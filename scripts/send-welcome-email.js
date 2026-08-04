const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Gainable.fr - Evans Gaspard</title>
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
                Plateforme de Référence du Génie Climatique
              </p>
            </td>
          </tr>

          <!-- HERO BUSINESS COLLABORATION IMAGE -->
          <tr>
            <td style="padding: 0; background-color: #1F2D3D;">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" alt="Collaboration Business Gainable" width="600" style="width: 100%; max-width: 600px; height: 220px; object-fit: cover; display: block; border: 0;" />
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <!-- WELCOME HEADING -->
              <h2 style="color: #1F2D3D; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">
                Bonjour Evans, bienvenue dans l'équipe ! 🚀🔥
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Nous sommes ravis de vous compter parmi nous en tant que <strong>Consultant Commercial & Expert SEO</strong>. Vous rejoignez une aventure ambitieuse avec un objectif clair : développer massivement notre réseau d'installateurs et d'experts CVC dans plus de 550 villes.
              </p>

              <!-- BOOST MOTIVATIONAL MESSAGE -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 12px 12px 0; padding: 18px 20px; margin-bottom: 24px;">
                <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">
                  💪 Ensemble, visons les sommets !
                </h4>
                <p style="color: #1e3a8a; font-size: 14px; margin: 0; line-height: 1.5;">
                  Toute l'équipe est à 100% derrière vous pour vous accompagner dans votre développement commercial (outils, leads, supports marketing). Vous avez le terrain, les arguments et le potentiel pour générer du gros chiffre et maximiser vos commissions !
                </p>
              </div>

              <!-- CREDENTIALS BOX -->
              <div style="background-color: #1F2D3D; border-radius: 12px; padding: 24px; color: #ffffff; margin-bottom: 24px;">
                <h3 style="color: #D59B2B; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  🔑 Vos identifiants d'accès :
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; width: 120px;">Rôle :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Consultant Commercial & SEO</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Identifiant :</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">evansgaspard@gmail.com</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Mot de passe :</td>
                    <td style="padding: 6px 0; color: #D59B2B; font-size: 14px; font-weight: 700; font-family: monospace;">Gainable2026*</td>
                  </tr>
                </table>
              </div>

              <!-- COMMISSION CARD 17% -->
              <div style="background-color: #fffbeb; border: 2px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align: top; width: 44px;">
                      <div style="background-color: #D59B2B; color: #ffffff; width: 38px; height: 38px; border-radius: 10px; text-align: center; line-height: 38px; font-size: 18px;">
                        💰
                      </div>
                    </td>
                    <td style="vertical-align: top; padding-left: 12px;">
                      <h4 style="color: #92400e; margin: 0 0 6px 0; font-size: 16px; font-weight: 700;">
                        Taux de Commission Garantie : <span style="color: #D59B2B; font-size: 18px; font-weight: 800;">17%</span>
                      </h4>
                      <p style="color: #b45309; font-size: 14px; margin: 0; line-height: 1.5;">
                        Vous touchez <strong>17% de commission directe</strong> sur chaque souscription d'expert, vente d'abonnement ou prestation enregistrée via votre profil.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- DISCOUNT COUPONS CARD -->
              <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                  🎁 Vos 2 Coupons de Réduction Exclusifs pour Closing :
                </h4>
                <p style="color: #15803d; font-size: 14px; margin: 0 0 14px 0; line-height: 1.5;">
                  Pour vous aider à déclencher la décision chez vos prospects et accélérer vos signatures, nous avons créé 2 bons de réduction personnels prêts à être utilisés :
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #bbf7d0; padding: 12px;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #f0fdf4;">
                      <span style="background-color: #dcfce7; color: #15803d; font-family: monospace; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 14px;">EVANS10</span>
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #f0fdf4; color: #166534; font-size: 14px; font-weight: 700;">
                      -10% de réduction unique (200 utilisations disponibles)
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px;">
                      <span style="background-color: #dcfce7; color: #15803d; font-family: monospace; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 14px;">EVANS5</span>
                    </td>
                    <td style="padding: 8px; color: #166534; font-size: 14px; font-weight: 700;">
                      -5% de réduction unique (200 utilisations disponibles)
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA BUTTON -->
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="https://www.gainable.fr/auth/login" target="_blank" style="background-color: #D59B2B; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(213, 155, 43, 0.35);">
                  Se connecter & Démarrer mon activité →
                </a>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Bienvenue à bord, Evans ! Faisons de cette collaboration une immense réussite.
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
                Cet email contient des informations confidentielles d'accès et d'outils commerciaux réservées exclusivement à Evans Gaspard.
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

async function sendMail() {
  const recipients = ['contact@gainable.fr', 'evansgaspard@gmail.com'];
  console.log(`Envoi du mail complet motivant avec coupons à : ${recipients.join(', ')}...`);

  try {
    const data = await resend.emails.send({
      from: 'Gainable.fr <noreply@gainable.ch>',
      to: recipients,
      subject: '🚀 Bienvenue Evans ! Vos accès, Commission 17% & Vos 2 Coupons Promo (EVANS10 / EVANS5)',
      html: htmlContent,
    });

    console.log('✅ Email motivant avec coupons envoyé avec succès ! ID:', data);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email :', error);
  }
}

sendMail();
