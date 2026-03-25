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

        // Determine price dynamically instead of env vars
        let unitAmount = 0;
        let intervalType: 'year' | 'month' = 'year';
        let productName = '';

        if (planId === 'cvc') {
            productName = 'Société Expert CVC';
            if (interval === 'monthly') {
                unitAmount = 5000; // 50.00 € HT
                intervalType = 'month';
            } else {
                unitAmount = 65000; // 650.00 € HT
                intervalType = 'year';
            }
        } else if (planId === 'diag') {
            productName = 'Diagnostiqueur';
            unitAmount = 38000; // 380.00 € HT
            intervalType = 'year';
        } else {
            return NextResponse.json({ error: "Invalid plan ID configuration" }, { status: 400 });
        }

        // Determine base URL dynamically or use env
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || "https://www.gainable.ch";

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: unitAmount,
                        recurring: {
                            interval: intervalType,
                        },
                        tax_behavior: 'exclusive',
                    },
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
