const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Gainable.fr - Mélanie Ruhland</title>
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
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" alt="Collaboration Business Gainable" width="600" style="width: 100%; max-width: 600px; height: 200px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <!-- WELCOME HEADING -->
              <h2 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">
                Bonjour Mélanie, bienvenue dans l'équipe ! 🚀🔥
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Nous sommes ravis de vous accueillir en tant que <strong>Commerciale Indépendante Gainable.fr</strong>. Vous rejoignez notre pôle d'acquisition pour développer et accompagner les professionnels CVC, bureaux d'études et installateurs de pompes à chaleur en France.
              </p>

              <!-- LEGAL CONTRACT NOTICE BOX -->
              <div style="background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h4 style="color: #166534; margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">
                  📄 Service Juridique : Votre Contrat Commercial
                </h4>
                <p style="color: #15803d; font-size: 14px; margin: 0; line-height: 1.5;">
                  Nous vous informons que votre contrat officiel de <strong>Commerciale Indépendante</strong> est actuellement en cours de préparation par notre Service Juridique. Il sera disponible très prochainement et vous sera transmis pour signature afin de formaliser notre collaboration.
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
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">meltomeline2@gmail.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 6px 0; color: #D59B2B; font-size: 14px; font-weight: 700; font-family: monospace;">Gainable2026**</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Rôle :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Commerciale Indépendante</td>
                  </tr>
                </table>
              </div>

              <!-- CRM FEATURES OVERVIEW -->
              <h3 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 18px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                🛠️ Aperçu des fonctionnalités du CRM à votre disposition :
              </h3>

              <div style="space-y: 16px;">
                
                <!-- FEATURE 1 -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #1e40af; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📍 Prospection Google Local (Par Ville)
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Recherche directe des entreprises CVC par ville avec vue navigateur Google Live en temps réel, avis réels et fiches d'entreprises.
                  </p>
                </div>

                <!-- FEATURE 2 -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #854d0e; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    🗺️ Base Nationale CVC (37 372 Entreprises)
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Base complète qualifiée des professionnels du secteur avec filtres par région (carte vectorielle de France), département et activité.
                  </p>
                </div>

                <!-- FEATURE 3 -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #065f46; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    🌐 Fenêtre de Vérification & Qualification Google Live
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Mini-navigateur Google avec bouton retour (Précédent), diagnostic d'indexation SEO et fiches enrichies (CA, SIRET, Dirigeant, Effectifs, Email principal et secondaire).
                  </p>
                </div>

                <!-- FEATURE 4 -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                  <h4 style="color: #5b21b6; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📊 Gestion du Pipeline & Suivi des Prospects
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Suivi de l'état de vos prospects (Non contacté, Contacté, Intéressé, Vente effectuée, Refusé) et programmation de vos rappels et RDV commerciaux.
                  </p>
                </div>

                <!-- FEATURE 5 -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                  <h4 style="color: #991b1b; margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
                    📚 Playbook & Support Commercial
                  </h4>
                  <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.5;">
                    Accès aux arguments de vente, grilles tarifaires et présentations d'accompagnement pour concrétiser vos signatures.
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
                Bienvenue dans l'équipe Mélanie, nous vous souhaitons d'excellentes ventes !
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
                Cet e-mail contient des identifiants confidentiels réservés exclusivement à Mélanie Ruhland.
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

async function sendCopyMailToUser() {
  const recipients = ['airgenergie@gmail.com', 'contact@airgenergie.fr'];
  console.log(`Envoi de la copie directe de l'email de Mélanie Ruhland à : ${recipients.join(', ')}...`);

  try {
    const data = await resend.emails.send({
      from: 'Gainable.fr <noreply@gainable.ch>',
      to: recipients,
      subject: '[COPIE POUR VOTRE SUIVI] 🚀 Bienvenue Mélanie ! Access CRM & Contrat Commercial Indépendant',
      html: htmlContent,
    });

    console.log('✅ Copie envoyée avec succès ! ID:', data);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la copie :', error);
  }
}

sendCopyMailToUser();
