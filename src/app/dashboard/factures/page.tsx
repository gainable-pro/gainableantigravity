import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { BillingView } from "./billing-view";
import { SubscribeView } from "./subscribe-view";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const userId = await getUserId();
    if (!userId) {
        redirect("/");
    }

    const resolvedParams = await searchParams;
    const sessionId = typeof resolvedParams?.session_id === 'string' ? resolvedParams.session_id : null;
    const isSuccess = resolvedParams?.success === 'true';

    // 1. Get Expert
    let expert = await prisma.expert.findUnique({
        where: { user_id: userId },
        select: { 
            id: true, 
            stripeCustomerId: true,
            expert_type: true,
            user: { select: { email: true } }
        }
    });

    if (!expert) {
        return (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Profil expert introuvable</h2>
                <p className="text-slate-500">Compte non configuré.</p>
            </div>
        );
    }

    // 2. Sync if returning from Checkout Session
    if (sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session && session.customer) {
                const customerId = session.customer as string;
                if (expert.stripeCustomerId !== customerId) {
                    await prisma.expert.update({
                        where: { id: expert.id },
                        data: { stripeCustomerId: customerId, status: "active" }
                    });
                    expert.stripeCustomerId = customerId;
                }
                if (session.subscription) {
                    const subId = session.subscription as string;
                    const subDetails = await stripe.subscriptions.retrieve(subId);
                    await prisma.subscription.upsert({
                        where: { stripeId: subId },
                        update: {
                            status: subDetails.status,
                            planId: subDetails.items.data[0]?.price?.id ?? "",
                            currentPeriodEnd: new Date((subDetails as any).current_period_end * 1000),
                        },
                        create: {
                            expertId: expert.id,
                            stripeId: subId,
                            status: subDetails.status,
                            planId: subDetails.items.data[0]?.price?.id ?? "",
                            currentPeriodEnd: new Date((subDetails as any).current_period_end * 1000),
                        }
                    });
                }
            }
        } catch (err) {
            console.error("Error syncing Stripe session:", err);
        }
    }

    let invoices: any[] = [];
    let subscription: any = null;

    if (expert.stripeCustomerId) {
        try {
            const [invoicesRes, subscriptionsRes] = await Promise.all([
                stripe.invoices.list({
                    customer: expert.stripeCustomerId,
                    limit: 24,
                }),
                stripe.subscriptions.list({
                    customer: expert.stripeCustomerId,
                    status: 'all',
                    limit: 1
                })
            ]);

            invoices = invoicesRes.data;
            subscription = subscriptionsRes.data[0] || null;

            // Sync invoices to local DB
            for (const inv of invoices) {
                if (inv.id && inv.status === 'paid') {
                    await prisma.invoice.upsert({
                        where: { stripeId: inv.id },
                        update: {
                            amount: inv.total,
                            status: 'paid',
                            pdfUrl: inv.hosted_invoice_url || inv.invoice_pdf
                        },
                        create: {
                            expertId: expert.id,
                            stripeId: inv.id,
                            amount: inv.total,
                            status: 'paid',
                            pdfUrl: inv.hosted_invoice_url || inv.invoice_pdf
                        }
                    }).catch(() => {});
                }
            }
        } catch (err) {
            console.error("Stripe fetch error:", err);
        }
    }

    const hasActiveSub = subscription && (subscription.status === 'active' || subscription.status === 'trialing');

    if (hasActiveSub) {
        return (
            <BillingView
                invoices={invoices}
                subscription={subscription}
            />
        );
    }

    return (
        <div className="space-y-12">
            <SubscribeView
                expertId={expert.id}
                email={expert.user?.email || ''}
                defaultPlanType={expert.expert_type}
                isSuccess={isSuccess}
            />

            {invoices.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Historique des Factures Précédentes</h2>
                    <BillingView invoices={invoices} subscription={{ status: 'canceled', created: 0, current_period_end: 0 } as any} />
                </div>
            )}
        </div>
    );
}
