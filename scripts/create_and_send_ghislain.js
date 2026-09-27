require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const email = "ghislaina25@gmail.com";
  const ccEmail = "gmaroann@gmail.com";
  const password = "Gainable2027*";
  const firstName = "Ghislain";
  const lastName = "M";

  try {
    console.log(`📌 1. Création / Mise à jour du compte commercial pour ${firstName} ${lastName} (${email})...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { commercialProfile: true }
    });

    let user;
    if (existingUser) {
      console.log(`ℹ️ L'utilisateur ${email} existe déjà. Mise à jour des identifiants et du rôle...`);
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password_hash: hashedPassword,
          role: "commercial",
          commercialProfile: existingUser.commercialProfile 
            ? { update: { nom: lastName, prenom: firstName } }
            : { create: { nom: lastName, prenom: firstName, statutLegal: "Micro-entreprise" } }
        },
        include: { commercialProfile: true }
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password_hash: hashedPassword,
          role: "commercial",
          commercialProfile: {
            create: {
              nom: lastName,
              prenom: firstName,
              statutLegal: "Micro-entreprise"
            }
          }
        },
        include: {
          commercialProfile: true
        }
      });
    }

    console.log("✅ Compte commercial prêt en base de données :", {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.commercialProfile
    });

    // 2. Envoi de l'email de confirmation via Resend
    console.log(`📧 2. Envoi de l'email de confirmation à ${email} (Copie à ${ccEmail})...`);

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Gainable.fr - Ghislain M</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color: #1F2D3D; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">
                GAINABLE<span style="color: #D59B2B;">.FR</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">
                Plateforme de Référence du Génie Climatique & CVC
              </p>
            </td>
          </tr>

          <!-- HERO IMAGE -->
          <tr>
            <td style="padding: 0; background-color: #1F2D3D;">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" alt="Commercial Gainable" width="600" style="width: 100%; max-width: 600px; height: 200px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <h2 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">
                Bonjour Ghislain, bienvenue dans l'équipe ! 🚀🔥
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Votre compte <strong>Commercial Indépendant Gainable.fr</strong> a été créé avec succès. Vous disposez désormais d'un accès privilégié à notre portail commercial pour piloter vos prospects et développer votre activité.
              </p>

              <!-- ACCÈS -->
              <div style="background-color: #1F2D3D; border-radius: 12px; padding: 24px; color: #ffffff; margin-bottom: 24px;">
                <h3 style="color: #D59B2B; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  🔑 Vos accès au Portail Commercial :
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; width: 140px;">URL de connexion :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                      <a href="https://www.gainable.fr/commercial/login" style="color: #3b82f6; text-decoration: underline;">https://www.gainable.fr/commercial/login</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Identifiant / Email :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">ghislaina25@gmail.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 6px 0; color: #D59B2B; font-size: 14px; font-weight: 700; font-family: monospace;">Gainable2027*</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Rôle :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Commercial Indépendant</td>
                  </tr>
                </table>
              </div>

              <!-- FONCTIONNALITÉS CRM -->
              <h3 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 18px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                🛠️ Outils disponibles sur votre espace :
              </h3>

              <div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #1e40af; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📍 Prospection Google Local & Carte de France
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Recherche directe d'entreprises CVC avec vue Google Live, fiches qualifiées et import direct dans votre CRM.
                  </p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #065f46; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📊 Suivi du Pipeline de Ventes
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Gestion du statut de vos prospects, prise de rendez-vous et comptes-rendus d'appels.
                  </p>
                </div>
              </div>

              <!-- BUTTON -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.gainable.fr/commercial/login" target="_blank" style="background-color: #D59B2B; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(213, 155, 43, 0.35);">
                  Se connecter au CRM Commercial →
                </a>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Bienvenue parmi nous Ghislain, nous vous souhaitons d'excellentes ventes !
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0;">
                © 2026 Gainable.fr - Tous droits réservés.
              </p>
              <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                Cet e-mail contient des identifiants confidentiels réservés exclusivement à Ghislain M.
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

    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Gainable.fr <noreply@gainable.ch>',
      to: [email],
      cc: [ccEmail],
      subject: '🚀 Bienvenue Ghislain ! Vos accès Commercial Indépendant Gainable.fr',
      html: htmlContent
    });

    console.log("🎉 Email de confirmation envoyé avec succès ! Réponse Resend :", emailResponse);

  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du script :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
