import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // Shared instance
import { headers } from "next/headers";
import Stripe from "stripe";

// Remove local instantiation logic

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (error: any) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = event.data.object as Stripe.Invoice;
    const subscription = event.data.object as Stripe.Subscription;

    try {
        // ----------------------------------------------------
        // 1. Checkout Completed -> Activate Expert + Link Customer
        // ----------------------------------------------------
        if (event.type === "checkout.session.completed") {
            const expertId = session.metadata?.expertId;
            const subscriptionId = session.subscription as string;

            if (expertId && expertId !== "pending_creation") {
                // Link Stripe Customer ID to Expert
                await prisma.expert.update({
                    where: { id: expertId },
                    data: {
                        stripeCustomerId: ((session.customer as any) as string) || null,
                        status: "active", // Activate account!
                    }
                });

                // Create Subscription Record
                const subDetails = await stripe.subscriptions.retrieve(subscriptionId);
                const sub = subDetails as Stripe.Subscription;

                await prisma.subscription.upsert({
                    where: { stripeId: sub.id },
                    update: {
                        status: sub.status,
                        planId: sub.items.data[0]?.price?.id ?? "",
                        currentPeriodEnd: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000) : new Date(),
                    },
                    create: {
                        expertId: expertId,
                        stripeId: sub.id,
                        status: sub.status,
                        planId: sub.items.data[0]?.price?.id ?? "",
                        currentPeriodEnd: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000) : new Date(),
                    }
                });
            }
        }

        // ----------------------------------------------------
        // 2. Invoice Paid -> Store Invoice PDF
        // ----------------------------------------------------
        if (event.type === "invoice.payment_succeeded") {
            // Find expert by stripeCustomerId
            const customerId = invoice.customer as string;
            const expert = await prisma.expert.findUnique({
                where: { stripeCustomerId: customerId }
            });

            if (expert) {
                await prisma.invoice.create({
                    data: {
                        expertId: expert.id,
                        stripeId: invoice.id,
                        amount: invoice.total,
                        status: "paid",
                        pdfUrl: invoice.hosted_invoice_url || invoice.invoice_pdf,
                    }
                });
            }
        }

        // ----------------------------------------------------
        // 3. Subscription Updated (Renewals, Cancellations)
        // ----------------------------------------------------
        if (event.type === "customer.subscription.updated") {
            await prisma.subscription.update({
                where: { stripeId: subscription.id },
                data: {
                    status: subscription.status,
                    currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : new Date(),
                }
            });

            // Optionally deactivate expert if status is canceled/unpaid
            // TODO: Add logic if requested.
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
    }
}
