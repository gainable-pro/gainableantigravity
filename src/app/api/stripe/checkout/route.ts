import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

// Ensure global prisma
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

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
        const { planId, expertId, email } = body;

        // Basic validation
        if (!planId) return NextResponse.json({ error: "Missing planId" }, { status: 400 });

        // If we have an expertId, ensure they exist and aren't already subscribed?
        // User requirements: "Inscription -> Paiement". Expert might be pending.
        // We will pass expertId as metadata to Stripe to reconcile in Webhook.

        // Determine price ID from env or body (assuming body sends 'cvc' or 'diag' or directly priceId)
        // Let's assume body sends key "cvc" or "diag"
        let priceId = "";
        if (planId === 'cvc') priceId = process.env.STRIPE_PRICE_CVC || '';
        if (planId === 'diag') priceId = process.env.STRIPE_PRICE_DIAG || '';
        if (!priceId) priceId = planId; // Fallback if direct ID sent

        if (!priceId) {
            return NextResponse.json({ error: "Invalid Price ID configuration" }, { status: 500 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: email, // Pre-fill email if available
            metadata: {
                expertId: expertId || "pending_creation", // If expert created before, pass ID. If not, handle differently.
                // Based on user flow: Form -> DB (Pending) -> Payment. So expertId SHOULD be present.
            },
            allow_promotion_codes: true, // Enable promo codes
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/inscription/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/inscription?canceled=true`,
        });

        return NextResponse.json({ url: session.url }, { headers: CORS_HEADERS });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
