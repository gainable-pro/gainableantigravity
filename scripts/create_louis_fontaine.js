require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const email = "lfontaine.pro@outlook.fr";
  const previewRecipient = "contact@gainable.fr";
  const password = "Gainable2027**";
  const firstName = "Louis";
  const lastName = "FONTAINE";
  const phone = "0698691722";
  const commissionRate = 17;
  const commissionTier = "expert";

  try {
    console.log(`📌 1. Création / Mise à jour du compte commercial pour ${firstName} ${lastName} (${email})...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { commercialProfile: true }
    });

    let user;
    if (existingUser) {
      console.log(`ℹ️ L'utilisateur ${email} existe déjà. Mise à jour du profil et mot de passe...`);
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
                  statutLegal: "Agent Commercial Indépendant",
                  commissionRate: commissionRate,
                  commissionTier: commissionTier
                }
              }
            : {
                create: {
                  nom: lastName,
                  prenom: firstName,
                  telephone: phone,
                  statutLegal: "Agent Commercial Indépendant",
                  commissionRate: commissionRate,
                  commissionTier: commissionTier
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
              statutLegal: "Agent Commercial Indépendant",
              commissionRate: commissionRate,
              commissionTier: commissionTier
            }
          }
        },
        include: {
          commercialProfile: true
        }
      });
    }

    console.log("✅ Compte commercial créé avec succès en base de données :", {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.commercialProfile
    });

    // 2. Préparation du modèle HTML & Plain-Text
    console.log(`📧 2. Envoi de l'e-mail de test / prévisualisation UNIQUEMENT à ${previewRecipient}...`);

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos accès au Portail Commercial — Gainable.fr</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          
          <!-- BANDEAU SUPÉRIEUR BRANDÉ -->
          <tr>
            <td style="background-color: #1e293b; padding: 32px 28px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                GAINABLE<span style="color: #d59b2b;">.FR</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
                Portail Collaborateur & Commercial B2B
              </p>
            </td>
          </tr>

          <!-- CORPS PRINCIPAL -->
          <tr>
            <td style="padding: 32px 28px;">
              
              <h2 style="color: #0f172a; margin: 0 0 14px 0; font-size: 20px; font-weight: 700;">
                Bonjour ${firstName}, bienvenue chez Gainable.fr !
              </h2>
              
              <p style="color: #475569; font-size: 14px; margin: 0 0 20px 0;">
                Nous sommes ravis de vous compter parmi nos partenaires commerciaux indépendants. Votre compte commercial est désormais <strong>actif</strong> et prêt à l'emploi.
              </p>

              <!-- CADRE IDENTIFIANTS OFFICIELS -->
              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin: 0 0 14px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  Vos accès personnels au Portail Commercial :
                </h3>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                  <tr>
                    <td style="padding: 7px 0; color: #64748b; width: 140px;">URL de connexion :</td>
                    <td style="padding: 7px 0; font-weight: 600;">
                      <a href="https://www.gainable.fr/commercial/login" style="color: #2563eb; text-decoration: underline;">https://www.gainable.fr/commercial/login</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #64748b;">Identifiant / Email :</td>
                    <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #64748b;">Mot de passe :</td>
                    <td style="padding: 7px 0; color: #b45309; font-weight: 700; font-family: Consolas, Monaco, monospace;">${password}</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #64748b;">Rôle :</td>
                    <td style="padding: 7px 0; color: #0f172a; font-weight: 600;">Agent Commercial Indépendant</td>
                  </tr>
                  <tr>
                    <td style="padding: 7px 0; color: #64748b;">Niveau & Commission :</td>
                    <td style="padding: 7px 0; color: #166534; font-weight: 700;">17 % HT par vente (Palier Expert)</td>
                  </tr>
                </table>
              </div>

              <!-- BOUTON D'ACCÈS DIRECT -->
              <div style="text-align: center; margin: 26px 0;">
                <a href="https://www.gainable.fr/commercial/login" target="_blank" style="background-color: #d59b2b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block;">
                  Accéder à votre espace Commercial →
                </a>
              </div>

              <!-- ENCADRÉ FORMALITÉS CONTRACTUELLES -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
                <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">
                  Documents pour l'établissement de votre contrat :
                </h4>
                <p style="color: #1e3a8a; font-size: 13px; margin: 0 0 10px 0;">
                  Afin de formaliser votre contrat de collaboration commerciale, merci de nous transmettre par retour de cet e-mail :
                </p>
                <ul style="color: #1e3a8a; font-size: 13px; margin: 0; padding-left: 18px; line-height: 1.6;">
                  <li>Extrait KBIS ou avis de situation SIRENE (ou attestation d'inscription)</li>
                  <li>Numéro de société (SIREN / SIRET)</li>
                  <li>RIB professionnel pour le virement direct de vos commissions</li>
                </ul>
              </div>

              <!-- PRÉSENTATION DES OUTILS PROSPECTION -->
              <h4 style="color: #0f172a; margin: 0 0 12px 0; font-size: 14px; font-weight: 700;">
                Vos outils de prospection intégrés :
              </h4>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <strong style="color: #1e293b; font-size: 13px;">• Moteur Google LOCAL par Ville :</strong>
                    <span style="color: #64748b; font-size: 13px;"> Recherche cartographique ciblée des installateurs CVC et pompe à chaleur avec qualification d'appel.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <strong style="color: #1e293b; font-size: 13px;">• Base Nationale CVC (37k Entreprises) :</strong>
                    <span style="color: #64748b; font-size: 13px;"> Annuaire complet des frigoristes et bureaux d'études certifiés avec filtres par région.</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style="color: #1e293b; font-size: 13px;">• Pipeline CRM & Paiement Stripe :</strong>
                    <span style="color: #64748b; font-size: 13px;"> Suivi en temps réel de vos prospects, relances téléphoniques et génération de liens de paiement sécurisés.</span>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 13px; margin: 24px 0 0 0; text-align: center;">
                Bienvenue dans l'équipe Louis, nous restons à votre disposition pour vous accompagner dans vos premières ventes.
              </p>
            </td>
          </tr>

          <!-- FOOTER LÉGAL & SÉCURISÉ -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px 0;">
                © 2026 Gainable.fr — Plateforme nationale des professionnels de la climatisation et du génie climatique.
              </p>
              <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                Ce message contient des identifiants confidentiels réservés exclusivement à Louis FONTAINE.
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

Bienvenue chez Gainable.fr ! Votre compte d'Agent Commercial Indépendant est désormais actif.

Vos accès personnels au Portail Commercial :
- URL de connexion : https://www.gainable.fr/commercial/login
- Identifiant / Email : ${email}
- Mot de passe : ${password}
- Rôle : Agent Commercial Indépendant
- Commission : 17 % HT par vente (Palier Expert)

Documents à nous transmettre par retour d'e-mail pour l'établissement de votre contrat :
- Extrait KBIS ou avis de situation SIRENE
- Numéro de société (SIREN / SIRET)
- RIB professionnel (pour le versement de vos commissions)

Vos outils de prospection disponibles dès maintenant :
- Moteur Google LOCAL par Ville
- Base Nationale CVC (37 000 installateurs et bureaux d'études)
- Pipeline CRM et génération de liens de paiement Stripe direct

Pour toute question, vous pouvez contacter directement l'équipe à contact@gainable.fr.

Bienvenue dans l'équipe,
L'équipe Gainable.fr
https://www.gainable.fr
`;

    // Envoi de test UNIQUEMENT à contact@gainable.fr comme demandé par l'utilisateur
    const emailResponse = await resend.emails.send({
      from: 'Gainable.fr <conseil@gainable.ch>',
      replyTo: 'contact@gainable.fr',
      to: [previewRecipient],
      subject: `[TEST APERÇU] Vos accès au Portail Commercial — Gainable.fr (Pour ${firstName} ${lastName})`,
      html: htmlContent,
      text: plainText
    });

    console.log("🎉 Email de prévisualisation envoyé avec succès à contact@gainable.fr ! Réponse Resend :", emailResponse);

  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du script :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
