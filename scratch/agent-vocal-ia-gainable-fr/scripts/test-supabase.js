import { supabase } from '../db.js';

async function testSupabase() {
  console.log("=== TEST DE CONNEXION SUPABASE ===");
  try {
    const { data, error } = await supabase
      .from('prospects')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error("❌ Erreur de requête Supabase :", error.message);
      console.log("Détails : Vérifiez votre fichier .env, SUPABASE_URL ou SUPABASE_ANON_KEY.");
      return;
    }

    console.log("✅ Connexion Supabase établie avec succès !");
    console.log(`Nombre actuel de prospects en base : ${data || 0}`);
  } catch (err) {
    console.error("❌ Exception lors de la connexion Supabase :", err.message);
  }
}

testSupabase();
