import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();
        const { prospectId, planId, discountRate } = body;

        if (!prospectId) {
            return NextResponse.json({ message: "Prospect ID requis" }, { status: 400 });
        }

        const prospect = await prisma.commercialProspect.findUnique({
            where: { id: prospectId }
        });

        if (!prospect) {
            return NextResponse.json({ message: "Prospect introuvable" }, { status: 404 });
        }

        const priceMap: Record<string, number> = { cvc: 850, diag: 750 };
        const baseAmount = priceMap[planId] || 850;
        const discount = Number(discountRate) || 0;
        const finalPrice = Math.round(baseAmount * (1 - discount));

        const origin = req.headers.get("origin");
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || "https://www.gainable.fr";

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: planId === "diag" ? "Abonnement Expert Diag Immo - Gainable.fr" : "Abonnement Expert CVC Climatisation - Gainable.fr",
                            description: `Référencement & Fiche Dédiée pour ${prospect.nomEntreprise}`,
                        },
                        unit_amount: finalPrice * 100, // Cents
                        recurring: {
                            interval: "year"
                        }
                    },
                    quantity: 1,
                }
            ],
            customer_email: prospect.email || undefined,
            metadata: {
                prospectId: prospect.id,
                commercialId: user.id,
                planId: planId || "cvc",
                isCommercialLink: "true"
            },
            allow_promotion_codes: true,
            success_url: `${baseUrl}/confirmation-devis?session_id={CHECKOUT_SESSION_ID}&prospect_id=${prospect.id}`,
            cancel_url: `${baseUrl}/commercial/prospects/${prospect.id}?canceled=true`,
        });

        let emailSent = false;
        if (prospect.email) {
            const emailRes = await sendEmail({
                to: prospect.email,
                subject: `Gainable.fr - Lien de paiement & Validation pour ${prospect.nomEntreprise}`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                    <div style="background-color: #1F2D3D; padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800;">GAINABLE.FR</h1>
                        <p style="margin: 5px 0 0 0; color: #D59B2B; font-size: 14px;">La plateforme des experts certifiés</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px;">Bonjour ${prospect.prenomContact || ''} ${prospect.nomContact || ''},</p>
                        <p style="font-size: 15px; color: #475569;">Suite à notre échange commercial, voici votre lien direct pour finaliser votre référencement sur <strong>Gainable.fr</strong> et valider la fiche de votre entreprise <strong>${prospect.nomEntreprise}</strong>.</p>
                        
                        <div style="background-color: #F8FAFC; border-left: 4px solid #2563EB; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; font-weight: bold; color: #1E293B; font-size: 15px;">Détails de l'offre réservée :</p>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #334155; font-size: 14px;">
                                <li>Formule : <strong>${planId === 'diag' ? 'Expert Diag Immo' : 'Expert CVC Climatisation'}</strong></li>
                                <li>Tarif négocié : <strong>${finalPrice} € HT / an</strong></li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${session.url}" style="background-color: #2563EB; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                                Activer mon compte & Régler par Carte ➜
                            </a>
                        </div>

                        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin-top: 30px;">
                            Lien de paiement sécurisé par Stripe. Si le bouton ne s'ouvre pas, suivez ce lien :<br>
                            <a href="${session.url}" style="color: #2563EB;">${session.url}</a>
                        </p>
                    </div>
                </div>
                `
            });
            emailSent = emailRes.success;
        }

        return NextResponse.json({
            success: true,
            url: session.url,
            emailSent
        });

    } catch (error: any) {
        console.error("Payment Link Error:", error);
        return NextResponse.json({ message: "Erreur lors de la génération du lien : " + error.message }, { status: 500 });
    }
}
