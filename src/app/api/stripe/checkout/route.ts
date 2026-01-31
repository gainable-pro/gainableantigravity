import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // Shared instance
// Remove local instantiation logic

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
        const { planId, expertId, email, interval } = body; // interval: 'yearly' | 'monthly'

        // Basic validation
        if (!planId) return NextResponse.json({ error: "Missing planId" }, { status: 400 });

        // Determine price ID
        let priceId = "";

        if (planId === 'cvc') {
            if (interval === 'monthly') {
                priceId = process.env.STRIPE_PRICE_CVC_MONTHLY || '';
            } else {
                priceId = process.env.STRIPE_PRICE_CVC || '';
            }
        } else if (planId === 'diag') {
            priceId = process.env.STRIPE_PRICE_DIAG || '';
        } else {
            // Fallback if direct ID sent (rare case)
            priceId = planId;
        }

        if (!priceId) {
            console.error("Stripe Config Error: Missing Price ID for", planId, interval);
            return NextResponse.json({ error: "Invalid Price ID configuration" }, { status: 500 });
        }

        // Determine base URL dynamically or use env
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || "https://www.gainable.ch";

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
            automatic_tax: { enabled: true }, // Verify VAT/Tax location
            success_url: `${baseUrl}/inscription/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/inscription?canceled=true`,
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
