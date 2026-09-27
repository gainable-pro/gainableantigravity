const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env files
['.env.development.local', '.env.local', '.env.development', '.env'].forEach(f => {
    const p = path.resolve(process.cwd(), f);
    if (fs.existsSync(p)) dotenv.config({ path: p });
});

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});
const resend = new Resend(process.env.RESEND_API_KEY);

const email = "ace01800@gmail.com";
const rawPassword = "Lenoir2026*";
const firstName = "Christian";
const lastName = "Lenoir";

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Gainable.fr — Christian Lenoir</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- HEADER WITH LOGO -->
          <tr>
            <td style="background-color: #1F2D3D; padding: 32px; text-align: center;">
              <a href="https://www.gainable.fr" target="_blank" style="text-decoration: none;">
                <img src="https://www.gainable.fr/gainable-fr-logo-blanc-officiel-climatisation.png" alt="Gainable.fr" width="190" style="width: 190px; height: auto; border: 0; display: block; margin: 0 auto 12px auto;" />
              </a>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">
                Plateforme Nationale de Référencement Génie Climatique & CVC
              </p>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <!-- WELCOME HEADING -->
              <h2 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">
                Félicitations et bienvenue dans l'équipe, Christian ! 🚀🔥
              </h2>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous sommes ravis de vous accueillir pour cette mission en tant que <strong>Commercial Indépendant Gainable.fr</strong>. C'est un réel plaisir de vous compter parmi nous pour développer la visibilité des spécialistes du Génie Climatique et CVC partout en France.
              </p>

              <!-- JURIDIQUE NOTICE BOX -->
              <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-left: 4px solid #3B82F6; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
                <h4 style="color: #1E40AF; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                  📜 Information Contrat Freelance :
                </h4>
                <p style="color: #1E3A8A; font-size: 14px; line-height: 1.5; margin: 0;">
                  Votre <strong>contrat de mission freelance est actuellement en cours de rédaction auprès de notre service juridique</strong>. Il vous sera transmis très prochainement pour validation et signature.
                </p>
              </div>

              <!-- WELCOME INVITATION TO PRACTICE -->
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                En attendant la réception du contrat, vous pouvez <strong>dès à présent vous faire la main sur vos outils de travail et vous familiariser avec le discours commercial et la méthode de présentation</strong>.
              </p>

              <!-- CREDENTIALS BOX -->
              <div style="background-color: #1F2D3D; border-radius: 14px; padding: 24px; color: #ffffff; margin-bottom: 28px;">
                <h3 style="color: #D59B2B; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  🔑 Vos accès au Portail Commercial CRM :
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 140px;">URL d'accès :</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                      <a href="https://www.gainable.fr/commercial/login" target="_blank" style="color: #60A5FA; text-decoration: underline;">https://www.gainable.fr/commercial/login</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Identifiant / Email :</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 8px 0; color: #D59B2B; font-size: 15px; font-weight: 700; font-family: monospace;">${rawPassword}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Rôle :</td>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Commercial Indépendant / Consultant B2B</td>
                  </tr>
                </table>
              </div>

              <!-- CTA BUTTON -->
              <div style="text-align: center; margin: 28px 0 32px 0;">
                <a href="https://www.gainable.fr/commercial/login" target="_blank" style="background-color: #D59B2B; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(213, 155, 43, 0.35);">
                  Accéder à mon espace Commercial →
                </a>
              </div>

              <!-- SUPPORT & CONTACT NOTICE -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #1F2D3D; margin: 0 0 10px 0; font-size: 15px; font-weight: 700;">
                  🤝 Je reste à votre entière disposition
                </h3>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                  N'hésitez pas à me contacter directement si vous avez la moindre question ou besoin d'un point d'échange pour caler votre démarrage. Je suis à vos côtés pour que cette aventure chez <strong>Gainable.fr</strong> soit un vrai succès !
                </p>
              </div>

              <p style="color: #1F2D3D; font-size: 15px; font-weight: 700; margin: 24px 0 0 0;">
                Bien amicalement,<br />
                <span style="color: #D59B2B;">L'Équipe Gainable.fr</span>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0; font-weight: 600;">
                EXCEED DIGITAL SAS — Gainable.fr
              </p>
              <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                Cet e-mail contient vos identifiants confidentiels réservés à Christian Lenoir.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

async function main() {
    console.log("=== 1. CRÉATION DU COMPTE COMMERCIAL ===");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { commercialProfile: true }
    });

    let user;
    if (existingUser) {
        console.log(`L'utilisateur ${email} existe déjà. Mise à jour des identifiants et du rôle commercial...`);
        user = await prisma.user.update({
            where: { email },
            data: {
                password_hash: hashedPassword,
                role: "commercial",
                commercialProfile: existingUser.commercialProfile ? {
                    update: {
                        nom: lastName,
                        prenom: firstName
                    }
                } : {
                    create: {
                        nom: lastName,
                        prenom: firstName
                    }
                }
            },
            include: { commercialProfile: true }
        });
        console.log("✅ Compte mis à jour avec succès :", user.id);
    } else {
        user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role: "commercial",
                commercialProfile: {
                    create: {
                        nom: lastName,
                        prenom: firstName
                    }
                }
            },
            include: { commercialProfile: true }
        });
        console.log("✅ Compte commercial créé avec succès :", user.id);
    }

    console.log("\n=== 2. ENVOI DE L'EMAIL DE FÉLICITATIONS ET BIENVENUE ===");
    try {
        const emailResponse = await resend.emails.send({
            from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
            replyTo: 'contact@gainable.fr',
            to: [email],
            subject: "🚀 Bienvenue chez Gainable.fr — Vos accès & intégration commerciale",
            html: htmlContent
        });

        console.log("✅ Email de félicitations envoyé avec succès !");
        console.log("Response:", emailResponse);
    } catch (err) {
        console.error("❌ Erreur lors de l'envoi de l'email via Resend:", err);
    }
}

main()
    .catch(e => {
        console.error("❌ Exception:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
