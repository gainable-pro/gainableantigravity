import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email") || "airgenergie@gmail.com";

    const dummyLink = "https://checkout.stripe.com/c/pay/cs_test_demo_gainable";

    // 1. Email 1: Demande de Paiement Prospect
    const email1Res = await sendEmail({
        to: targetEmail,
        subject: "Gainable.fr - Lien de paiement & Validation pour Exceed Digitabl",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #1F2D3D; padding: 30px; text-align: center; color: white;">
                <img src="https://www.gainable.fr/logo_white.png" alt="Gainable.fr" style="max-height: 55px; height: auto; width: auto; margin: 0 auto 10px auto; display: block;" />
                <p style="margin: 0; color: #D59B2B; font-size: 14px; font-weight: bold;">La plateforme des experts certifiés</p>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 16px;">Bonjour <strong>Maroann GHARIB</strong>,</p>
                <p style="font-size: 15px; color: #475569;">Suite à notre échange commercial, voici votre lien direct pour finaliser votre référencement sur <strong>Gainable.fr</strong> et valider la fiche de votre entreprise <strong>Exceed Digitabl</strong>.</p>
                
                <div style="background-color: #F8FAFC; border-left: 4px solid #2563EB; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-weight: bold; color: #1E293B; font-size: 15px;">Détails de l'offre réservée :</p>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #334155; font-size: 14px;">
                        <li>Formule : <strong>Expert CVC Climatisation (Label G & Fiche Dédiée)</strong></li>
                        <li>Tarif négocié : <strong>850,00 € HT / an</strong></li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="${dummyLink}" style="background-color: #2563EB; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                        Activer mon compte & Régler par Carte ➜
                    </a>
                </div>

                <p style="font-size: 12px; color: #94A3B8; text-align: center; margin-top: 30px;">
                    Lien de paiement sécurisé par Stripe. Si le bouton ne s'ouvre pas, suivez ce lien :<br>
                    <a href="${dummyLink}" style="color: #2563EB;">${dummyLink}</a>
                </p>
            </div>
        </div>
        `
    });

    // 2. Email 2: Confirmation Post-Paiement & Activation du Compte
    const email2Res = await sendEmail({
        to: targetEmail,
        subject: "Bienvenue sur Gainable.fr – Activation de votre Espace Expert",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #1F2D3D; padding: 30px; text-align: center; color: white;">
                <img src="https://www.gainable.fr/logo_white.png" alt="Gainable.fr" style="max-height: 55px; height: auto; width: auto; margin: 0 auto 10px auto; display: block;" />
                <p style="margin: 0; color: #D59B2B; font-size: 14px; font-weight: bold;">Compte Certifié & Activé</p>
            </div>
            <div style="padding: 30px;">
                <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px 18px; rounded: 8px; margin-bottom: 20px; color: #065F46; font-weight: bold; text-align: center; border-radius: 8px;">
                    ✓ Votre paiement a bien été validé par Stripe
                </div>

                <p style="font-size: 16px;">Bonjour <strong>Maroann GHARIB</strong>,</p>
                <p style="font-size: 15px; color: #475569;">Nous vous souhaitons la bienvenue au sein du réseau <strong>Gainable.fr</strong>. Votre adhésion pour l'entreprise <strong>Exceed Digitabl</strong> est maintenant confirmée.</p>

                <div style="background-color: #FFFBEB; border-left: 4px solid #D59B2B; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-weight: bold; color: #92400E; font-size: 15px;">Dernière étape : Définir votre mot de passe</p>
                    <p style="margin: 8px 0 0 0; color: #B45309; font-size: 14px;">Pour accéder à votre espace pro, gérer vos demandes de devis et importer vos photos de chantiers, veuillez créer votre mot de passe sécurisé.</p>
                </div>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://www.gainable.fr/nouveau-mot-de-passe" style="background-color: #1F2D3D; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(31, 45, 61, 0.25);">
                        Définir mon mot de passe & Connexion ➜
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

                <p style="font-size: 13px; color: #64748B; margin: 0;">
                    Cordialement,<br>
                    <strong>L'équipe Gainable.fr</strong><br>
                    <a href="https://www.gainable.fr" style="color: #D59B2B; text-decoration: none; font-weight: bold;">www.gainable.fr</a>
                </p>
            </div>
        </div>
        `
    });

    return NextResponse.json({
        success: true,
        targetEmail,
        email1: email1Res,
        email2: email2Res
    });
}
