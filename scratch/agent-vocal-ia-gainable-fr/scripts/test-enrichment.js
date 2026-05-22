import { enrichProspect, calculatePreCallScore } from '../services/enrichment_service.js';

async function testEnrichment() {
  console.log("=== TEST DU MODULE D'ENRICHISSEMENT ET DE SCORING ===");

  const testCases = [
    { name: "Clim & Chauffage Aquitaine", city: "Bordeaux", activity: "climatisation" },
    { name: "Dupond Plomberie", city: "Lyon", activity: "plomberie générale" },
    { name: "Atlantic CVC Services", city: "Marseille", activity: "installation pompe a chaleur" },
    { name: "Boulangerie du Coin", city: "Paris", activity: "boulangerie" }
  ];

  for (const tc of testCases) {
    console.log(`\n🔍 Enrichissement de "${tc.name}" à ${tc.city}...`);
    const data = await enrichProspect(tc.name, tc.city, tc.activity);
    
    console.log("Données Google Places récupérées (ou mockées) :");
    console.log(`- Note : ${data.google_rating}/5`);
    console.log(`- Avis : ${data.google_reviews_count}`);
    console.log(`- Site web : ${data.website || 'Aucun'}`);
    console.log(`- Mots-clés repérés : ${data.keywords_matched.join(', ')}`);
    console.log(`- Maturité digitale : ${data.digital_maturity}`);

    const score = calculatePreCallScore({
      activity: tc.activity,
      rating: data.google_rating,
      reviewsCount: data.google_reviews_count,
      hasWebsite: data.has_website
    });

    console.log(`🎯 SCORE PRÉ-APPEL CALCULÉ : ${score}/100`);
    if (score >= 80) {
      console.log("➡️ Statut : PRIORITÉ HAUTE (A appeler en premier)");
    } else if (score >= 50) {
      console.log("➡️ Statut : ÉLIGIBLE (Intéressant)");
    } else {
      console.log("➡️ Statut : EXCLU (Activité non pertinente ou mauvaise note)");
    }
  }
}

testEnrichment();
