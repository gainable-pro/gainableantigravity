import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { findCommercialByCode } from "@/lib/commercial-codes";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { planId, expertId, email, interval, promoCode, ref, returnUrl, cancelUrl } = body; // interval: 'yearly' | 'monthly'

        // Basic validation
        if (!planId) return NextResponse.json({ error: "Missing planId" }, { status: 400 });

        // Resolve commercial code if passed
        const targetCode = promoCode || ref;
        let commercialId: string | null = null;
        if (targetCode) {
            const commercial = await findCommercialByCode(targetCode);
            if (commercial) {
                commercialId = commercial.id;
            }
        }

        // Use Stripe catalog Price IDs (managed via Stripe Dashboard)
        let priceId = '';

        if (planId === 'cvc') {
            if (interval === 'monthly') {
                priceId = process.env.STRIPE_PRICE_CVC_MONTHLY || 'price_1ThvjKGfw444kXxvQ8ypVgxa';
            } else {
                priceId = process.env.STRIPE_PRICE_CVC || 'price_1ThviWGfw444kXxvdJrfcGwj';
            }
        } else if (planId === 'diag') {
            if (interval === 'monthly') {
                priceId = process.env.STRIPE_PRICE_DIAG_MONTHLY || 'price_1ThvmEGfw444kXxvPDCsSip1';
            } else {
                priceId = process.env.STRIPE_PRICE_DIAG || 'price_1ThvldGfw444kXxv8MArvpef';
            }
        } else {
            return NextResponse.json({ error: "Invalid plan ID configuration" }, { status: 400 });
        }

        // Determine base URL dynamically or use env
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || "https://www.gainable.fr";

        // Check if existing customerId exists for expert
        let stripeCustomerId: string | undefined = undefined;
        if (expertId && expertId !== "pending_creation") {
            const existingExpert = await prisma.expert.findUnique({
                where: { id: expertId },
                select: { stripeCustomerId: true }
            });
            if (existingExpert?.stripeCustomerId) {
                stripeCustomerId = existingExpert.stripeCustomerId;
            }
        }

        const successPath = returnUrl || "/inscription/paiement/succes";
        const cancelPath = cancelUrl || "/inscription?canceled=true";

        const successUrl = `${baseUrl}${successPath.startsWith('/') ? successPath : '/' + successPath}?success=true&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrlFull = `${baseUrl}${cancelPath.startsWith('/') ? cancelPath : '/' + cancelPath}`;

        const sessionParams: any = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                expertId: expertId || "pending_creation",
                commercialId: commercialId || "",
                promoCode: targetCode || ""
            },
            allow_promotion_codes: true, // Enable promo codes
            automatic_tax: { enabled: true }, // Verify VAT/Tax location
            success_url: successUrl,
            cancel_url: cancelUrlFull,
        };

        if (stripeCustomerId) {
            sessionParams.customer = stripeCustomerId;
        } else if (email) {
            sessionParams.customer_email = email;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({ url: session.url }, { headers: CORS_HEADERS });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
