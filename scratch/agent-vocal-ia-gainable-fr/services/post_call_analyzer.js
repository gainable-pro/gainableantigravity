import { supabase } from '../db.js';
import { sendAcquisitionEmail, sendDemoAlert, sendCallbackAlert } from './mailer_service.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey && !openaiApiKey.includes('your_openai_api_key_here') ? new OpenAI({ apiKey: openaiApiKey }) : null;

/**
 * Analyse un appel terminé, insère les données en base, met à jour le prospect, 
 * et déclenche les e-mails de relance/proposition ou d'alerte démo.
 */
export async function analyzeCall({
  prospectId,
  duration, // en secondes
  status, // answered, no_answer, busy, failed
  transcription = '',
  conversionStatus = 'pending', // demo, refus, rappel, transfert, email_proposition, pending
  followUpDetails = null // { date, time, email } pour les actions planifiées
}) {
  console.log(`[Post-Call Analyzer] Analyse post-appel pour le prospect ${prospectId}. Durée: ${duration}s, Status: ${status}`);

  // 1. Récupérer les informations du prospect en base
  const { data: prospect, error: fetchErr } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .single();

  if (fetchErr || !prospect) {
    console.error("[Post-Call Analyzer] Impossible de trouver le prospect :", fetchErr?.message);
    return { success: false, error: 'Prospect introuvable' };
  }

  // 2. Extraire les insights via OpenAI ou générer des données simulées réalistes
  let analysis = {
    summary: "Appel court ou sans réponse.",
    sentiment: "Neutre",
    interest_score: 1,
    emotion_detected: "Calme",
    conversion_status: conversionStatus,
    objections_detected: []
  };

  if (status === 'answered' && duration > 10) {
    if (openai && transcription) {
      try {
        console.log("[Post-Call Analyzer] Lancement de l'analyse IA via GPT-4o-mini...");
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un analyste commercial de Gainable.fr. Analyse la transcription d'appel suivante et retourne un JSON avec les clés :
              - "summary" (résumé de 2 phrases max du déroulé de l'appel)
              - "sentiment" ("Positif", "Neutre" ou "Négatif")
              - "interest_score" (entier de 1 à 5, où 5 est super intéressé, 1 est hostile/aucun intérêt)
              - "emotion_detected" ("Calme", "Intéressé", "Agacé", "Pressé")
              - "conversion_status" ("demo", "refus", "rappel", "transfert", "email_proposition", "pending")
              - "objections_detected" (tableau des objections entendues : "prix", "pas de temps", "pas besoin", "plateforme", "autre")`
            },
            {
              role: 'user',
              content: `Transcription : "${transcription}"`
            }
          ],
          response_format: { type: "json_object" }
        });

        const resultJson = JSON.parse(response.choices[0].message.content);
        analysis = { ...analysis, ...resultJson };
        console.log("[Post-Call Analyzer] Analyse IA complétée :", analysis);
      } catch (err) {
        console.error("[Post-Call Analyzer] Échec de l'analyse OpenAI, utilisation du fallback mock :", err);
        analysis = getMockAnalysis(duration, conversionStatus, transcription);
      }
    } else {
      console.log("[Post-Call Analyzer] OpenAI non configuré ou transcription vide. Génération d'une analyse simulée...");
      analysis = getMockAnalysis(duration, conversionStatus, transcription);
    }
  } else {
    // Si l'appel n'a pas répondu
    if (status === 'busy') analysis.summary = "Artisan occupé, ligne occupée.";
    else if (status === 'no_answer') analysis.summary = "Pas de réponse, répondeur.";
    analysis.conversion_status = status === 'answered' ? conversionStatus : 'failed';
  }

  // 3. Insérer l'enregistrement dans la table 'calls'
  const callRecord = {
    prospect_id: prospectId,
    duration,
    status,
    transcription,
    summary: analysis.summary,
    sentiment: analysis.sentiment,
    interest_score: analysis.interest_score,
    emotion_detected: analysis.emotion_detected,
    conversion_status: analysis.conversion_status,
    scoring_details: { objections: analysis.objections_detected }
  };

  const { data: insertedCall, error: callErr } = await supabase
    .from('calls')
    .insert(callRecord)
    .select()
    .single();

  if (callErr) {
    console.error("[Post-Call Analyzer] Échec de l'enregistrement de l'appel :", callErr.message);
    return { success: false, error: callErr.message };
  }

  // 4. Mettre à jour le statut du prospect
  let newProspectStatus = 'answered';
  if (status !== 'answered') {
    newProspectStatus = status; // busy, no_answer, failed
  } else if (analysis.conversion_status === 'demo') {
    newProspectStatus = 'qualified';
  } else if (analysis.conversion_status === 'refus') {
    newProspectStatus = 'refused';
  } else if (analysis.conversion_status === 'rappel') {
    newProspectStatus = 'callback';
  } else if (analysis.conversion_status === 'email_proposition') {
    newProspectStatus = 'qualified';
  }

  const { error: updateErr } = await supabase
    .from('prospects')
    .update({ status: newProspectStatus })
    .eq('id', prospectId);

  if (updateErr) {
    console.error("[Post-Call Analyzer] Échec de la mise à jour du statut prospect :", updateErr.message);
  }

  // 5. Gérer les actions de follow-up (Relances & Alertes)
  if (status === 'answered') {
    // A. Envoi d'email de proposition
    if (analysis.conversion_status === 'email_proposition' || followUpDetails?.email) {
      const emailToSend = followUpDetails?.email || prospect.email;
      if (emailToSend) {
        // Envoi asynchrone pour ne pas bloquer
        sendAcquisitionEmail(emailToSend, prospect.name, prospect.city)
          .then(res => {
            supabase.from('follow_ups').insert({
              call_id: insertedCall.id,
              type: 'email',
              target: emailToSend,
              status: res.success ? 'sent' : 'failed',
              payload: res
            }).then(() => {});
          });
      } else {
        console.warn("[Post-Call Analyzer] Demande d'e-mail de proposition mais aucun e-mail disponible.");
      }
    }

    // B. Démo planifiée (Alerte immédiate à Marwan + Enregistrement follow-up)
    if (analysis.conversion_status === 'demo' && followUpDetails?.date) {
      const date = followUpDetails.date;
      const time = followUpDetails.time || '10:00';
      
      // Envoi de l'alerte e-mail immédiate à Marwan
      sendDemoAlert(prospect, date, time).then(() => {});

      // Enregistrement de la démo en base
      await supabase.from('follow_ups').insert({
        call_id: insertedCall.id,
        type: 'demo',
        target: `${date} ${time}`,
        status: 'pending',
        scheduled_at: new Date(`${date}T${time}:00`).toISOString(),
        payload: { date, time }
      });
    }

    // C. Rappel téléphonique (Callback) planifié pour Marwan
    if (analysis.conversion_status === 'rappel' && followUpDetails?.date) {
      const date = followUpDetails.date;
      const time = followUpDetails.time || '10:00';
      const reason = followUpDetails.reason || 'Artisan occupé / demande à être rappelé';

      // Enregistrement de la tâche de rappel programmé en base de données
      await supabase.from('follow_ups').insert({
        call_id: insertedCall.id,
        type: 'callback',
        target: `${date} ${time}`,
        status: 'pending',
        scheduled_at: new Date(`${date}T${time}:00`).toISOString(),
        payload: { date, time, reason }
      });
      
      console.log(`[Post-Call Analyzer] Rappel programmé en base de données pour le ${date} à ${time}`);
    }
  }

  return { success: true, callId: insertedCall.id, analysis };
}

/**
 * Génère des insights simulés cohérents avec la durée de l'appel et l'état de conversion.
 */
function getMockAnalysis(duration, conversionStatus, transcription) {
  let summary = "L'artisan a décroché mais n'a pas montré d'intérêt particulier.";
  let sentiment = "Neutre";
  let interest_score = 2;
  let emotion_detected = "Calme";
  let objections_detected = [];

  const text = transcription.toLowerCase();

  if (conversionStatus === 'demo') {
    summary = "Artisan très intéressé par le concept d'exclusivité locale et l'outil SEO IA. Une démonstration avec Marwan a été planifiée.";
    sentiment = "Positif";
    interest_score = 5;
    emotion_detected = "Intéressé";
  } else if (conversionStatus === 'email_proposition') {
    summary = "L'interlocuteur a demandé à recevoir les informations par e-mail afin d'étudier l'offre à tête reposée avant de s'engager.";
    sentiment = "Positif";
    interest_score = 4;
    emotion_detected = "Calme";
  } else if (conversionStatus === 'rappel') {
    summary = "L'artisan était sur un chantier ou occupé et a demandé à ce qu'on le rappelle à un créneau spécifique.";
    sentiment = "Neutre";
    interest_score = 3;
    emotion_detected = "Pressé";
    objections_detected.push("pas de temps");
  } else if (conversionStatus === 'refus') {
    summary = "Refus catégorique de l'offre. L'artisan ne souhaite plus être importuné ou n'a pas besoin de clients supplémentaires.";
    sentiment = "Négatif";
    interest_score = 1;
    emotion_detected = "Agacé";
    if (text.includes('cher') || text.includes('budget') || text.includes('argent')) objections_detected.push("prix");
    if (text.includes('travail') || text.includes('surchargé')) objections_detected.push("pas besoin");
    if (text.includes('plateforme') || text.includes('arnaque')) objections_detected.push("plateforme");
  } else {
    // Si la durée est élevée, on suppose un intérêt relatif
    if (duration > 60) {
      summary = "L'artisan a posé des questions sur le fonctionnement du générateur d'articles SEO de chantiers mais n'a pas finalisé d'action.";
      sentiment = "Positif";
      interest_score = 3;
      emotion_detected = "Calme";
    }
  }

  return {
    summary,
    sentiment,
    interest_score,
    emotion_detected,
    conversion_status: conversionStatus,
    objections_detected
  };
}

/**
 * Service Cron ou Planificateur local périodique (à exécuter toutes les minutes)
 * pour alerter Marwan si un rappel téléphonique ou une démo programmée arrive à échéance.
 */
export async function processScheduledFollowUps() {
  const now = new Date().toISOString();
  
  // Chercher tous les follow-ups en attente (pending) dont l'heure programmée est passée (<= now)
  const { data: pendingFollowUps, error } = await supabase
    .from('follow_ups')
    .select(`
      id,
      call_id,
      type,
      target,
      status,
      scheduled_at,
      payload,
      calls (
        prospect_id,
        summary
      )
    `)
    .eq('status', 'pending')
    .eq('type', 'callback') // On alerte uniquement pour les callbacks téléphoniques au moment venu
    .lte('scheduled_at', now);

  if (error) {
    console.error("[Scheduler Error] Échec de la récupération des rappels programmés :", error.message);
    return;
  }

  if (!pendingFollowUps || pendingFollowUps.length === 0) {
    return;
  }

  console.log(`[Scheduler] ${pendingFollowUps.length} rappel(s) à déclencher pour Marwan.`);

  for (const followUp of pendingFollowUps) {
    const prospectId = followUp.calls?.prospect_id;
    if (!prospectId) continue;

    // Récupérer le prospect lié
    const { data: prospect } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (prospect) {
      const date = followUp.payload?.date || 'aujourd\'hui';
      const time = followUp.payload?.time || '';
      const reason = followUp.payload?.reason || 'Rappel programmé';
      
      // Alerter Marwan par e-mail
      const mailRes = await sendCallbackAlert(prospect, date, time, `Rappel automatique planifié : ${reason} (Résumé du dernier appel : ${followUp.calls?.summary || 'Aucun résumé'})`);
      
      if (mailRes.success) {
        // Mettre à jour le statut du follow-up à 'sent'
        await supabase
          .from('follow_ups')
          .update({ status: 'sent' })
          .eq('id', followUp.id);
          
        console.log(`[Scheduler] Alerte envoyée avec succès pour le rappel de ${prospect.name}.`);
      } else {
        await supabase
          .from('follow_ups')
          .update({ status: 'failed', payload: { ...followUp.payload, error: mailRes.error } })
          .eq('id', followUp.id);
      }
    }
  }
}
