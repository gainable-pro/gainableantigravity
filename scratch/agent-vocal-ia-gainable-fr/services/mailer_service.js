import { Resend } from 'resend';
import { getAcquisitionEmailHtml } from '../templates/acquisition_email.js';
import dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey || resendApiKey.includes('your_resend_api_key_here')) {
  console.warn("Attention : RESEND_API_KEY non configurée. Les e-mails seront simulés dans la console.");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;
const senderEmail = 'Gainable.fr <noreply@gainable.fr>';
const defaultTeamEmail = process.env.TEAM_NOTIFICATION_EMAIL || 'contact@gainable.fr';

/**
 * Envoie l'e-mail de proposition commerciale (acquisition) à l'artisan.
 */
export async function sendAcquisitionEmail(prospectEmail, companyName, city) {
  const htmlContent = getAcquisitionEmailHtml({ companyName, city });
  
  console.log(`[Email] Préparation de l'envoi de la proposition à ${companyName} (${prospectEmail}) pour la ville ${city}`);
  
  if (!resend) {
    console.log(`[Email Mock] Email de proposition simulé avec succès pour ${prospectEmail}.`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: prospectEmail,
      subject: `Proposition Exclusive Climatisation - Gainable.fr (${city})`,
      html: htmlContent
    });

    if (error) {
      console.error(`[Email Error] Échec de l'envoi de la proposition à ${prospectEmail} via Resend :`, error);
      return { success: false, error };
    }

    console.log(`[Email] Proposition envoyée avec succès à ${prospectEmail} via Resend (ID: ${data.id})`);
    return { success: true, data };
  } catch (err) {
    console.error(`[Email Exception] Échec de l'envoi à ${prospectEmail} :`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Alerte M. Marwan d'une Démo planifiée par l'IA.
 */
export async function sendDemoAlert(prospect, date, time) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333; line-height: 1.5;">
      <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px;">🚨 NOUVELLE DÉMO PLANIFIÉE</h2>
      <p>Bonjour M. Marwan,</p>
      <p>L'assistant vocal IA vient de planifier une démonstration pour la plateforme <strong>Gainable.fr</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Artisan :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Ville :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.city || 'Non renseignée'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Téléphone :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">E-mail :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.email || 'Non renseigné'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Date de la démo :</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #2e7d32;">${date} à ${time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Note Google :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.google_rating || 'N/A'}/5 (${prospect.google_reviews_count || 0} avis)</td>
        </tr>
      </table>
      
      <p>L'artisan attend votre appel de présentation de 10 minutes à ce créneau.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">Envoyé automatiquement par Valentin, Agent Vocal Gainable.fr.</p>
    </div>
  `;

  console.log(`[Alerte Démo] Envoi de la notification de démo pour ${prospect.name} programmée le ${date} à ${time}`);

  if (!resend) {
    console.log(`[Alerte Démo Mock] Alerte Démo simulée avec succès dans la console pour ${defaultTeamEmail}.`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: defaultTeamEmail,
      subject: `🚨 Démo Planifiée : ${prospect.name} (${prospect.city || 'CVC'}) - ${date} à ${time}`,
      html: htmlContent
    });

    if (error) {
      console.error(`[Alerte Démo Error] Échec de l'envoi de l'alerte via Resend :`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error(`[Alerte Démo Exception]`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Alerte M. Marwan d'un Rappel téléphonique (Callback) planifié par l'IA.
 */
export async function sendCallbackAlert(prospect, date, time, reason = 'Rappel planifié') {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333; line-height: 1.5;">
      <h2 style="color: #0288d1; border-bottom: 2px solid #0288d1; padding-bottom: 10px;">📅 RAPPEL PROGRAMMÉ (CALLBACK)</h2>
      <p>Bonjour M. Marwan,</p>
      <p>L'assistant vocal IA a enregistré une demande de rappel pour l'artisan suivant car il était occupé ou l'a explicitement demandé.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Artisan :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Ville :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.city || 'Non renseignée'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Téléphone :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">E-mail :</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${prospect.email || 'Non renseigné'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Date de Rappel :</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #0288d1;">${date} à ${time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Contexte :</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-style: italic;">${reason}</td>
        </tr>
      </table>
      
      <p>Merci de recontacter cet artisan au créneau indiqué.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">Envoyé automatiquement par Valentin, Agent Vocal Gainable.fr.</p>
    </div>
  `;

  console.log(`[Alerte Callback] Envoi de l'alerte rappel pour ${prospect.name} le ${date} à ${time}`);

  if (!resend) {
    console.log(`[Alerte Callback Mock] Alerte Callback simulée avec succès dans la console pour ${defaultTeamEmail}.`);
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: defaultTeamEmail,
      subject: `📅 Rappel à faire : ${prospect.name} (${prospect.city || 'CVC'}) - ${date} à ${time}`,
      html: htmlContent
    });

    if (error) {
      console.error(`[Alerte Callback Error] Échec de l'envoi de l'alerte via Resend :`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error(`[Alerte Callback Exception]`, err);
    return { success: false, error: err.message };
  }
}
