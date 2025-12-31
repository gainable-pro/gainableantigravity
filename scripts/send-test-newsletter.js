const { PrismaClient } = require("@prisma/client");
const { Resend } = require("resend");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const NOM_ENTREPRISE_TARGET = "AIR G ENERGIE";

async function main() {
    console.log(`Searching for expert: ${NOM_ENTREPRISE_TARGET}...`);

    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: NOM_ENTREPRISE_TARGET,
                mode: 'insensitive'
            }
        },
        include: {
            user: true
        }
    });

    if (!expert) {
        console.error("Expert not found!");
        return;
    }

    console.log(`Found expert: ${expert.nom_entreprise} (${expert.user.email})`);

    const email = expert.user.email;
    const nom_compte = expert.nom_entreprise;
    const ville = expert.ville;
    let secteur = "Bâtiment";
    if (expert.expert_type === 'cvc_climatisation') secteur = "Génie Climatique";
    else if (expert.expert_type === 'bureau_detude') secteur = "Études Thermiques";
    else if (expert.expert_type === 'diagnostics_dpe') secteur = "Diagnostic Immobilier";

    console.log("Sending email to:", email);

    try {
        const { data, error } = await resend.emails.send({
            from: "Gainable.fr <conseil@gainable.ch>",
            to: email,
            subject: `[TEST] 📍 Votre visibilité SEO à ${ville} : Bilan & Conseils`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Conseils SEO Mensuels Gainable.fr</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #D59B2B;">
            <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="height: 40px;">
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #1F2D3D; line-height: 1.6;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 24px; color: #1F2D3D;">Bonjour ${nom_compte},</h1>

            <p>En cette fin de mois, nous souhaitions faire un point sur la visibilité en ligne de votre activité de <strong>${secteur}</strong> à <strong>${ville}</strong>.</p>

            <p style="margin-top: 20px;">Le référencement naturel (SEO) est un travail de fond, progressif et durable.<br>
            Contrairement à la publicité, l’indexation par les moteurs de recherche prend du temps : chaque action s’accumule et renforce votre présence digitale sur le long terme.</p>

            <div style="background-color: #F0F9FF; border-left: 4px solid #0ea5e9; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; color: #0c4a6e;">Notre stratégie pour vous :</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #0c4a6e;">
                    <li>👉 Vous positionner durablement sur <strong>${ville}</strong> et alentours.</li>
                    <li>👉 Renforcer votre notoriété locale.</li>
                    <li>👉 Générer du trafic qualifié via <strong>Gainable.fr</strong>.</li>
                </ul>
            </div>

            <p style="font-weight: bold; font-size: 18px; margin-top: 30px; color: #D59B2B;">💡 Pour booster votre visibilité ce mois-ci :</p>
            <p>Nous vous recommandons de publier un nouvel article dans votre espace pro. Voici quelques idées simples qui fonctionnent :</p>

            <ul style="padding-left: 20px; margin-top: 10px;">
                <li style="margin-bottom: 8px;">Un <strong>chantier récent</strong> (photos avant / après).</li>
                <li style="margin-bottom: 8px;">Une explication sur un <strong>type d’installation</strong> réalisé.</li>
                <li style="margin-bottom: 8px;">Une intervention spécifique à <strong>${ville}</strong>.</li>
                <li style="margin-bottom: 8px;">Un <strong>conseil technique</strong> pour vos clients.</li>
            </ul>

            <p style="margin-top: 24px;">Chaque contenu publié est une "porte d'entrée" de plus vers votre profil. C'est mécanique : <strong>plus votre espace est actif, plus vous remontez dans les recherches locales.</strong></p>

            <div style="text-align: center; margin-top: 40px;">
                <a href="https://www.gainable.fr/dashboard/articles/new" style="background-color: #D59B2B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Rédiger un article maintenant</a>
            </div>

            <p style="margin-top: 40px; font-style: italic; color: #64748b; font-size: 14px;">
                🎯 Notre objectif est de vous faire monter en puissance mois après mois. Nous restons à votre disposition pour vous accompagner.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">L’équipe <strong>Gainable.fr</strong></p>
            <p style="margin: 5px 0 0 0;">Plateforme dédiée aux experts du génie climatique.</p>
        </div>
    </div>
</body>
</html>
            `
        });

        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", data);
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
