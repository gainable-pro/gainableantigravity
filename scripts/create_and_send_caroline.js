require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const email = "carolineguillaume35@gmail.com";
  const ccEmails = ["gmaroann@gmail.com", "contact@gainable.fr"];
  const password = "Gainable2027*";
  const firstName = "Caroline";
  const lastName = "Guillaume";
  const phone = "0761446744";
  const region = "Hauts-de-France";

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
            ? { 
                update: { 
                  nom: lastName, 
                  prenom: firstName, 
                  telephone: phone,
                  adresse: region,
                  statutLegal: "Agent Commercial Indépendant",
                  commissionRate: 10,
                  commissionTier: "debutant"
                } 
              }
            : { 
                create: { 
                  nom: lastName, 
                  prenom: firstName, 
                  telephone: phone,
                  adresse: region,
                  statutLegal: "Agent Commercial Indépendant",
                  commissionRate: 10,
                  commissionTier: "debutant"
                } 
              }
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
              telephone: phone,
              adresse: region,
              statutLegal: "Agent Commercial Indépendant",
              commissionRate: 10,
              commissionTier: "debutant"
            }
          }
        },
        include: {
          commercialProfile: true
        }
      });
    }

    console.log("✅ Compte commercial créé avec succès en BDD :", {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.commercialProfile
    });

    // 2. Envoi de l'email d'accès et de confirmation via Resend
    console.log(`📧 2. Envoi de l'email d'accès et de bienvenue à ${email} (Copie à ${ccEmails.join(', ')})...`);

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validation de candidature & Vos accès - Gainable.fr</title>
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
                Bonjour Caroline, votre candidature est retenue ! 🚀🔥
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous avons le plaisir de vous confirmer que votre candidature a été acceptée pour la mission d'<strong>Agent Commercial Indépendant Gainable.fr</strong>.
              </p>

              <!-- JURIDIQUE & DOCUMENTS NOTICE BOX -->
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">
                  📑 Documents nécessaires pour la rédaction de votre contrat :
                </h4>
                <p style="color: #1e3a8a; font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
                  Afin de permettre à notre service administratif et juridique d'établir votre contrat de collaboration commerciale, nous vous remercions de bien vouloir nous faire parvenir par retour d'e-mail :
                </p>
                <ul style="color: #1e3a8a; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.7;">
                  <li><strong>Extrait KBIS</strong> ou avis de situation SIRENE (ou attestation d'inscription)</li>
                  <li><strong>Numéro de société (SIREN / SIRET)</strong></li>
                  <li><strong>RIB professionnel</strong> (pour le versement de vos commissions)</li>
                </ul>
              </div>

              <!-- NOTICE ACCES IMMEDIAT -->
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                En attendant la signature formelle du contrat, <strong>votre compte commercial est d'ores et déjà actif</strong>. Vous pouvez dès à présent vous connecter pour découvrir la plateforme, explorer les outils de prospection et préparer vos premières actions.
              </p>

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
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">carolineguillaume35@gmail.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 6px 0; color: #D59B2B; font-size: 14px; font-weight: 700; font-family: monospace;">Gainable2027*</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Rôle :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Agent Commercial Indépendant</td>
                  </tr>
                </table>
              </div>

              <!-- CRM FEATURES OVERVIEW -->
              <h3 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 18px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                🛠️ Vos outils d'accélération commerciale :
              </h3>

              <div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #1e40af; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📍 Prospection Google Local & Carte de France
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Recherche directe des professionnels de la climatisation et du CVC par département et ville avec vue live et import dans votre CRM.
                  </p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #854d0e; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    🗺️ Base Nationale CVC (37 372 Entreprises)
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Accès complet au fichier national qualifié des installateurs et bureaux d'études thermiques.
                  </p>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #065f46; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📊 Gestion du Pipeline & Suivi Commercial
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Pilotage de vos prospects, historique d'échanges, relances et suivi de vos commissions en temps réel.
                  </p>
                </div>
              </div>

              <!-- CTA BUTTON -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.gainable.fr/commercial/login" target="_blank" style="background-color: #D59B2B; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(213, 155, 43, 0.35);">
                  Accéder à votre espace Commercial →
                </a>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Bienvenue dans l'aventure Caroline, nous sommes ravis de vous compter parmi nous !
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
                Cet e-mail contient des identifiants confidentiels réservés exclusivement à Caroline Guillaume.
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

    const plainText = `Bonjour ${firstName},

Félicitations, votre candidature a été retenue pour la mission d'Agent Commercial Indépendant Gainable.fr.

Voici vos accès personnels à votre Portail Commercial :
- URL de connexion : https://www.gainable.fr/commercial/login
- Identifiant / Email : ${email}
- Mot de passe : ${password}
- Rôle : Agent Commercial Indépendant

Documents à nous transmettre par retour d'email pour l'établissement de votre contrat :
- Extrait KBIS ou avis de situation SIRENE
- Numéro de société (SIREN / SIRET)
- RIB professionnel

Votre compte est d'ores et déjà actif. Vous pouvez vous connecter pour explorer votre CRM et vos outils de prospection.

Bienvenue dans l'équipe,
L'équipe Gainable.fr
https://www.gainable.fr
`;

    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Gainable.fr Recrutement <conseil@gainable.ch>',
      replyTo: 'contact@gainable.fr',
      to: [email],
      cc: ccEmails,
      subject: 'Vos accès au Portail Commercial — Gainable.fr',
      html: htmlContent,
      text: plainText
    });

    console.log("🎉 Email de confirmation et identifiants envoyé avec succès ! Réponse Resend :", emailResponse);

  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du script :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
