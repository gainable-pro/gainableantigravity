
// Load env vars
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envFiles = [
    '.env.development.local',
    '.env.local',
    '.env.development',
    '.env'
];

envFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`Loading ${file}...`);
        const config = dotenv.config({ path: file });
        // dotenv doesn't overwrite, so order matters (first loaded wins? actually dotenv-flow usually handles priority, standard dotenv doesn't overwrite)
        // Wait, standard dotenv.config DOES NOT overwrite existing keys.
        // So we should load them in priority order: .env.development.local first?
        // Actually, if we want to FIND the key, we just need to load them until we have it.
        // But if they overlap, we want the "local" one.
    }
});

console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

// Checking if we have the key now
console.log('RESEND_API_KEY in process.env:', !!process.env.RESEND_API_KEY);

const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');

const prisma = new PrismaClient();

async function main() {
    const apiKey = process.env.RESEND_API_KEY;
    console.log("RESEND_API_KEY present:", !!apiKey);
    if (!apiKey) {
        console.error("ERROR: RESEND_API_KEY is missing. Cannot proceed.");
        return;
    }
    const resend = new Resend(apiKey);
    console.log("Searching for Air G Energie...");
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: 'AIR G',
                mode: 'insensitive'
            }
        },
        include: {
            user: true
        }
    });

    if (!expert || !expert.user) {
        console.error("Expert or User not found!");
        return;
    }

    const email = expert.user.email;
    // const email = "contact@airgenergie.fr"; // Verify if we need to force this
    console.log(`Found expert: ${expert.nom_entreprise} (${expert.slug})`);
    console.log(`Sending Welcome Email to: ${email}`);

    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing!");
        return;
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
             <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px;" />
        </div>
        
        <h2 style="color: #1F2D3D;">Bonjour,</h2>
        
        <p>Nous vous souhaitons la bienvenue au sein du réseau <strong style="color: #D32F2F; background-color: #0F172A; color: white; padding: 2px 6px; border-radius: 4px;">Gainable.fr</strong>.</p>
        <p>Votre inscription a bien été enregistrée.</p>

        <h3 style="color: #D59B2B; margin-top: 30px;">Votre espace professionnel</h3>
        <div style="border-top: 1px solid #eee; margin: 10px 0;"></div>

        <p>Vous bénéficiez désormais d’un accès dédié vous permettant de construire une présence qualitative et cohérente sur la plateforme.</p>
        
        <p>À ce titre, vous pouvez :</p>
        <ul style="list-style-type: disc; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 10px;">Intégrer des <strong>photos et vidéos</strong> de chantiers et de réalisations,</li>
            <li style="margin-bottom: 10px;">Configurer votre profil en sélectionnant les <strong>technologies réellement maîtrisées</strong>,</li>
            <li style="margin-bottom: 10px;">Définir précisément votre <strong>zone d’intervention</strong> (villes et codes postaux).</li>
        </ul>

        <h3 style="color: #D59B2B; margin-top: 30px;">Le Label Gainable.fr</h3>
        <div style="border-top: 1px solid #eee; margin: 10px 0;"></div>

        <div style="background-color: #FFF8E1; padding: 15px; border-left: 4px solid #D59B2B; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Le Label Gainable.fr s'inscrit dans une démarche volontaire de qualité et d'alignement professionnel.</p>
            <p style="margin-top: 10px;">Un membre de notre équipe prendra contact avec vous afin d’échanger et de valider que nous partageons la même vision du métier, les mêmes standards d'installation et la même exigence de satisfaction client.</p>
            <p style="margin-top: 10px; font-weight: bold;">Ce label est attribué aux professionnels qui incarnent pleinement les valeurs du réseau.</p>
        </div>

        <p style="margin-top: 40px;">Nous sommes ravis de vous compter parmi les entreprises référencées sur Gainable.fr et nous réjouissons de cette future collaboration.</p>
        
        <div style="margin-top: 40px; text-align: center;">
            <a href="https://www.gainable.fr" style="background-color: #1F2D3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder à mon espace pro</a>
        </div>

        <p style="margin-top: 40px; font-size: 14px; color: #666;">
            Cordialement,<br>
            <strong>L'équipe Gainable.fr</strong>
        </p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
            <p style="margin: 0; margin-bottom: 5px;">Ceci est un email automatique, merci de ne pas y répondre directement.<br>
            Pour toute demande, veuillez utiliser le formulaire de contact ou nous écrire à <a href="mailto:contact@gainable.fr" style="color: #999; text-decoration: underline;">contact@gainable.fr</a></p>
        </div>
    </div>
    `;

    try {
        const response = await resend.emails.send({
            from: "Gainable.fr <conseil@gainable.ch>",
            to: email,
            subject: "Bienvenue sur Gainable.fr – démarche de labellisation",
            html: htmlContent
        });

        console.log("Resend API Response:", JSON.stringify(response, null, 2));
        if (response.error) {
            console.error("Resend Error:", response.error);
        } else {
            console.log("Welcome Email sent successfully according to API!");
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
