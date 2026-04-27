
import { Resend } from 'resend';

// Use env var or allowed test key if not set (for dev without env)
// Note: In prod, strict env check is needed.
// Generic Email Sender
export async function sendEmail({
    to,
    subject,
    html,
    text
}: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.warn("⚠️ RESEND_API_KEY not set. Email simulation:", { to, subject });
        return { success: true, simulated: true };
    }

    const resend = new Resend(resendApiKey);

    try {
        const data = await resend.emails.send({
            from: 'Gainable.fr <contact@gainable.fr>', // Use generic sender for testing
            to,
            subject,
            html,
            text
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
    }
}

// Specific Email: Expert Verified Label
export async function sendLabelAwardedEmail(to: string, companyName: string, slug: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.warn("⚠️ RESEND_API_KEY not set. Email simulation for Label Award:", { to, companyName });
        return { success: true, simulated: true };
    }

    const resend = new Resend(resendApiKey);

    const profileUrl = `https://www.gainable.fr/pro/${slug}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

    // Text content
    const textContent = `Bonjour,

Nous vous remercions pour votre confiance et sommes ravis de vous accueillir parmi les professionnels référencés sur Gainable.fr.

Suite à l’analyse de votre dossier, nous avons le plaisir de vous confirmer l’attribution du label Gainable.fr – Compte certifié à votre entreprise.

Ce label a pour objectif de valoriser les sociétés fiables et engagées, et constitue un véritable repère de confiance pour vos clients. Il atteste de la cohérence de vos informations professionnelles et de votre sérieux.

Vous trouverez en pièce jointe le visuel « Compte certifié Gainable.fr ».
Nous vous invitons à l’intégrer à votre signature e-mail, à votre site internet ou à tout autre support de communication pertinent.

Voir votre fiche : ${profileUrl}

Partager votre certification :
- Facebook : ${facebookShare}
- LinkedIn : ${linkedinShare}

Afin d’optimiser son impact, nous vous recommandons d’y associer un lien de redirection vers votre fiche Gainable.fr, permettant à vos clients de consulter et vérifier votre référencement.

Gainable.fr a pour vocation de mettre en relation des particuliers avec des professionnels qualifiés, tout en renforçant la visibilité et la crédibilité des entreprises partenaires.

Nous vous souhaitons la bienvenue sur la plateforme et restons à votre disposition pour toute question.

Cordialement,

Gainable.fr
Le réseau des experts en climatisation gainable
www.gainable.fr
contact@gainable.fr`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px;" />
        </div>
        <p>Bonjour,</p>
        <p>Nous vous remercions pour votre confiance et sommes ravis de vous accueillir parmi les professionnels référencés sur <strong>Gainable.fr</strong>.</p>
        <p>Suite à nos échanges et à l’analyse de votre dossier, nous avons le plaisir de vous confirmer l’attribution du label <strong>Gainable.fr – Compte certifié</strong> à votre entreprise.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #1e293b;">Votre label de confiance</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Ce label valorise votre fiabilité et votre engagement auprès de vos clients. Il atteste de la cohérence de vos informations professionnelles et de votre sérieux.</p>
        </div>

        <p>Vous trouverez en pièce jointe le visuel « <strong>Expert vérifié Gainable.fr</strong> ».</p>
        <p>Nous vous invitons à l’intégrer à votre signature e-mail, à votre site internet ou à tout autre support de communication pertinent.</p>

        <p>Afin d’optimiser son impact, nous vous recommandons d’y associer un lien de redirection vers votre fiche Gainable.fr, permettant à vos clients de consulter et vérifier votre référencement.</p>

        <p>Gainable.fr a pour vocation de mettre en relation des particuliers avec des professionnels qualifiés, tout en renforçant la visibilité et la crédibilité des entreprises partenaires.</p>

        <p>Nous vous souhaitons la bienvenue sur la plateforme et restons à votre disposition pour toute question.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        
        <p style="font-size: 14px; color: #64748b;">
            Cordialement,<br>
            <strong>L'équipe Gainable.fr</strong><br>
            Le réseau des experts en climatisation gainable<br>
            <a href="https://www.gainable.fr" style="color: #F59E0B; text-decoration: none;">www.gainable.fr</a>
        </p>
    </div>
    `;

    try {
        // Read the image file and convert to buffer
        // Note: fs is not available in Edge runtime, but this is likely Node runtime.
        // We will assume Node runtime for simplicity as no "edge" config seen in routes.
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(process.cwd(), 'public', 'assets', 'label-gainable-verified.png');
        const imageBuffer = fs.readFileSync(imagePath);

        const data = await resend.emails.send({
            from: 'Gainable.fr <conseil@gainable.ch>',
            to,
            subject: 'Félicitations ! Votre entreprise a reçu le label "Compte Certifié" Gainable.fr',
            html: htmlContent,
            text: textContent,
            attachments: [
                {
                    filename: 'label-gainable-verified.png',
                    content: imageBuffer
                }
            ]
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error (Label Email):", error);
        return { success: false, error };
    }
}
// Specific Email: PWA Promotion
export async function sendPWAPromotionEmail(to: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.warn("⚠️ RESEND_API_KEY not set. Email simulation for PWA Promotion:", { to });
        return { success: true, simulated: true };
    }

    const resend = new Resend(resendApiKey);

    const dashboardUrl = "https://gainable.fr/dashboard";

    const textContent = `Bonjour cher expert,

Le réseau Gainable.fr franchit une nouvelle étape majeure ! 

Grâce à notre stratégie SEO agressive, nous comptons aujourd'hui plus de 7 500 pages indexées sur Google, et plus de 23 000 pages supplémentaires sont actuellement en cours d'indexation. Cette croissance exponentielle signifie une visibilité sans précédent pour vos services.

Surfez sur la vague !
Pour profiter pleinement de cette dynamique, nous vous encourageons à publier régulièrement des articles et des photos de vos réalisations. Plus vous contribuez, plus vous remontez dans les résultats de recherche locaux.

Découvrez notre nouvelle Application (PWA)
Installez Gainable.fr directement sur votre smartphone pour gérer vos articles et vos leads en un clin d'œil. Plus besoin de passer par votre navigateur !

Comment installer l'application ?
1. Cliquez sur ce lien depuis votre téléphone : ${dashboardUrl}
2. Une fois sur le site, une bannière d'installation s'affichera automatiquement pour vous guider.

L'application est 100% compatible avec tous les iPhones et smartphones Android.

À très vite sur Gainable.fr !
L'équipe Gainable.fr`;

    const htmlContent = `
    <div style="font-family: 'Montserrat', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <div style="background-color: #1F2D3D; padding: 40px 20px; text-align: center;">
            <img src="https://gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px; margin-bottom: 20px;" />
            <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">LA RÉVOLUTION GAINABLE EST EN MARCHE</h1>
        </div>
        
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px;">Bonjour cher expert,</p>
            
            <p>Le réseau <strong>Gainable.fr</strong> explose ! 🚀</p>
            
            <p>Grâce à notre stratégie SEO, nous comptons aujourd'hui <strong>plus de 7 500 pages indexées</strong> sur Google, et <strong>23 000 nouvelles pages</strong> sont en cours d'indexation.</p>
            
            <div style="background-color: #FFFBEB; border-left: 4px solid #D59B2B; padding: 20px; margin: 30px 0; border-radius: 0 12px 12px 0;">
                <p style="margin: 0; font-weight: bold; color: #92400E; font-size: 18px;">Surfez sur la vague ! 🌊</p>
                <p style="margin: 10px 0 0 0; font-size: 15px; color: #B45309;">Publiez vos articles et photos de chantiers pour dominer les résultats de recherche dans votre ville.</p>
            </div>

            <h2 style="color: #1F2D3D; font-size: 20px; margin-top: 40px; display: flex; items-center: center; gap: 10px;">
                <img src="https://gainable.fr/favicon.jpg" style="width: 24px; height: 24px; border-radius: 4px;" />
                Votre nouvelle Application Pro
            </h2>
            <p>Nous avons lancé l'application **Gainable.fr** pour vous permettre de gérer vos leads et vos articles directement depuis votre smartphone.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${dashboardUrl}" style="background-color: #D59B2B; color: #1F2D3D; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(213, 155, 43, 0.3);">
                    INSTALLER L'APPLICATION
                </a>
            </div>

            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 25px;">
                <p style="margin-top: 0; font-weight: bold; color: #1F2D3D;">Installation en 2 secondes :</p>
                <p style="font-size: 14px; margin-bottom: 0; color: #64748B;">Une fois sur votre tableau de bord, une <strong>bannière intelligente</strong> apparaîtra en bas de votre écran pour vous guider dans l'installation (iPhone & Android).</p>
            </div>

            <p style="font-size: 13px; color: #94A3B8; text-align: center; margin-top: 40px; font-style: italic;">
                L'application est 100% compatible avec tous les smartphones.
            </p>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="font-size: 14px; color: #64748B; margin: 0;">
                À très vite sur votre espace expert,<br>
                <strong>L'équipe Gainable.fr</strong>
            </p>
            <div style="margin-top: 20px;">
                <a href="https://gainable.fr" style="color: #D59B2B; text-decoration: none; font-weight: bold; font-size: 13px;">www.gainable.fr</a>
            </div>
        </div>
    </div>
    `;

    try {
        const data = await resend.emails.send({
            from: 'Gainable.fr <contact@gainable.fr>',
            to,
            subject: '🚀 Gainable.fr explose : Votre nouvelle application est disponible !',
            html: htmlContent,
            text: textContent
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error (PWA Promotion):", error);
        return { success: false, error };
    }
}
