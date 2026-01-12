
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

// Mock Resend/Fetch if running standalone without Next.js environment?
// Actually simpler to just rely on the lib if we compile it, or inline the logic here to avoid compilation issues.
// Let's inline the logic to be safe and fast.

const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function sendData() {
    console.log("Searching for Air G Energie...");
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: { contains: 'Air G', mode: 'insensitive' }
        },
        include: { user: true }
    });

    if (!expert) {
        console.error("User not found!");
        return;
    }

    console.log("Found expert:", expert.nom_entreprise, "Email:", expert.user.email);

    const email = expert.user.email;
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Content Logic (Replicated from src/lib/email.ts for standalone test)
    const slug = expert.slug;
    const profileUrl = `https://www.gainable.fr/pro/${slug}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

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
        const imagePath = path.join(process.cwd(), 'public', 'assets', 'label-gainable-verified.png');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            console.log("Image found, sending email...");

            const response = await resend.emails.send({
                from: 'Gainable.fr <conseil@gainable.ch>',
                to: email,
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
            console.log("Resend API Response:", JSON.stringify(response, null, 2));
            if (response.error) {
                console.error("Resend Error:", response.error);
            } else {
                console.log("Email sent successfully according to API!");
            }
        } else {
            console.error("Image file not found at " + imagePath);
        }
    } catch (e) {
        console.error("Error sending email:", e);
    }
}

sendData()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
