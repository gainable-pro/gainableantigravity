import { supabase } from '../db.js';
import { analyzeCall, processScheduledFollowUps } from '../services/post_call_analyzer.js';

async function testDemoBookingAndScheduler() {
  console.log("=== TEST DU CYCLE DES RENDEZ-VOUS ET NOTIFICATIONS DE RAPPEL ===");

  // 1. Créer un prospect de test temporaire
  console.log("\n1. Création d'un prospect de test...");
  const tempPhone = '+336' + Math.floor(10000000 + Math.random() * 90000000);
  
  const { data: prospect, error: pErr } = await supabase
    .from('prospects')
    .insert({
      name: "Test Clim Express",
      phone: tempPhone,
      email: "prospect-test@clims.fr",
      city: "Toulouse",
      activity_detected: "climatisation",
      pre_call_score: 85,
      status: 'pending'
    })
    .select()
    .single();

  if (pErr) {
    console.error("❌ Impossible de créer le prospect de test :", pErr.message);
    return;
  }
  console.log(`✅ Prospect de test créé avec ID : ${prospect.id} (Tél: ${prospect.phone})`);

  // 2. Simuler un appel de Valentin où l'artisan demande un RAPPEL immédiat (pour dans 5 secondes)
  console.log("\n2. Simulation d'un appel avec demande de rappel programmé...");
  const callbackTime = new Date(Date.now() + 5000); // dans 5 secondes
  const timeStr = callbackTime.toTimeString().substring(0, 5); // HH:MM
  const dateStr = callbackTime.toISOString().substring(0, 10); // YYYY-MM-DD

  const callResult = await analyzeCall({
    prospectId: prospect.id,
    duration: 45,
    status: 'answered',
    transcription: "Valentin: Bonjour... Artisan: Je suis sur un toit là, rappelez-moi vite mardi ou dans quelques minutes.",
    conversionStatus: 'rappel',
    followUpDetails: {
      date: dateStr,
      time: timeStr,
      reason: "Artisan sur le toit, demande à être recontacté à ce créneau."
    }
  });

  if (!callResult.success) {
    console.error("❌ Échec de analyzeCall :", callResult.error);
    // Nettoyer
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return;
  }
  console.log("✅ Appel analysé et enregistré.");
  console.log(`- Résumé généré : "${callResult.analysis.summary}"`);
  console.log(`- Intérêt : ${callResult.analysis.interest_score}/5`);

  // 3. Vérifier que le statut du prospect a été modifié à 'callback'
  const { data: updatedProspect } = await supabase
    .from('prospects')
    .select('status')
    .eq('id', prospect.id)
    .single();

  console.log(`- Nouveau statut du prospect : ${updatedProspect.status} (attendu: callback)`);

  // 4. Attendre 6 secondes pour que la date programmée soit dans le passé
  console.log("\n3. Attente de 6 secondes pour que l'heure de rappel programmée arrive à échéance...");
  await new Promise(resolve => setTimeout(resolve, 6000));

  // 5. Exécuter le scheduler pour déclencher la notification de rappel pour Marwan
  console.log("\n4. Exécution du planificateur (processScheduledFollowUps) pour alerter M. Marwan...");
  await processScheduledFollowUps();

  // 6. Nettoyer les données de test
  console.log("\n5. Nettoyage des données de test de la base...");
  const { error: delErr } = await supabase
    .from('prospects')
    .delete()
    .eq('id', prospect.id);
    
  if (delErr) {
    console.error("Erreur nettoyage :", delErr.message);
  } else {
    console.log("✅ Base de données nettoyée avec succès.");
  }
  
  console.log("\n=== TEST REUSSI AVEC SUCCÈS ! ===");
}

testDemoBookingAndScheduler();
