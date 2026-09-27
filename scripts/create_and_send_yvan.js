require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const email = "yvan.noreskal@gmail.com";
  const ccEmails = ["contact@gainable.fr", "gmaroann@gmail.com"];
  const password = "Gainable2028*";
  const firstName = "Yvan";
  const lastName = "Noreskal";

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

    console.log("✅ Compte commercial créé / mis à jour avec succès en BDD :", {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.commercialProfile
    });

    // 2. Envoi de l'email de confirmation via Resend
    console.log(`📧 2. Envoi de l'email de confirmation de candidature à ${email} (Copie à ${ccEmails.join(', ')})...`);

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de candidature - Gainable.fr</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- HEADER WITH LOGO -->
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
              
              <!-- WELCOME HEADING -->
              <h2 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">
                Bonjour Yvan, votre candidature est validée ! 🚀🔥
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous avons le plaisir de vous confirmer la validation de votre candidature pour le poste de <strong>Commercial Indépendant Gainable.fr</strong>.
              </p>

              <!-- JURIDIQUE NOTICE BOX -->
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
                <h4 style="color: #1e40af; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                  ⚖️ Information Service Juridique :
                </h4>
                <p style="color: #1e3a8a; font-size: 14px; margin: 0; line-height: 1.5;">
                  En attendant la préparation et l'édition définitive de votre contrat par notre service juridique, <strong>vous pouvez d'ores et déjà accéder à votre compte commercial</strong> pour découvrir la plateforme, prendre en main vos outils et démarrer votre préparation.
                </p>
              </div>

              <!-- CREDENTIALS BOX -->
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
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">yvan.noreskal@gmail.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 6px 0; color: #D59B2B; font-size: 14px; font-weight: 700; font-family: monospace;">Gainable2028*</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Rôle :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Commercial Indépendant</td>
                  </tr>
                </table>
              </div>

              <!-- CRM FEATURES OVERVIEW -->
              <h3 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 18px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                🛠️ Aperçu des outils mis à votre disposition :
              </h3>

              <div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #1e40af; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📍 Prospection Google Local & Carte de France
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Recherche directe des entreprises CVC par ville avec vue navigateur Google Live en temps réel, avis réels et import 1-clic dans votre CRM.
                  </p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #854d0e; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    🗺️ Base Nationale CVC (37 372 Entreprises)
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Base complète des installateurs et bureaux d'études avec filtres par région et département.
                  </p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #065f46; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📊 Gestion du Pipeline & Prise de Rendez-vous
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Suivi de l'état de vos prospects, enregistrement de vos comptes-rendus d'appels et programmation de vos rappels commerciaux.
                  </p>
                </div>
              </div>

              <!-- CTA BUTTON -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.gainable.fr/commercial/login" target="_blank" style="background-color: #D59B2B; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(213, 155, 43, 0.35);">
                  Se connecter au CRM Commercial →
                </a>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Bienvenue dans l'équipe Yvan, nous vous souhaitons une excellente réussite parmi nous !
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
                Cet e-mail contient des identifiants confidentiels réservés exclusivement à Yvan Noreskal.
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

        console.log(`📧 2. Envoi de l'email de confirmation de candidature à ${email} (Copie à ${ccEmails.join(', ')})...`);
    
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Gainable.fr <noreply@gainable.ch>',
      to: [email],
      cc: ccEmails,
      subject: '🚀 Confirmation de candidature & Vos accès Commercial Indépendant Gainable.fr',
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
