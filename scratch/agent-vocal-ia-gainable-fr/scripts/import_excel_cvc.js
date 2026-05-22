import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || 
                      supabaseUrl.includes('your-project') || 
                      supabaseUrl.includes('placeholder') || 
                      !supabaseAnonKey || 
                      supabaseAnonKey.includes('your_anon_public_key');

async function importExcel() {
  console.log("🚀 Démarrage de l'importateur Excel CVC...");

  if (isPlaceholder) {
    console.error("❌ Erreur : Supabase n'est pas configuré en mode Cloud. Veuillez définir SUPABASE_URL et SUPABASE_ANON_KEY dans le fichier .env");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const excelPath = path.resolve('C:\\Users\\ghari\\.gemini\\antigravity-ide\\scratch\\cvc_data.xlsx');
  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Fichier introuvable à l'emplacement : ${excelPath}`);
    process.exit(1);
  }

  console.log(`📊 Lecture du fichier Excel : ${excelPath}`);
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet);

  console.log(`🔍 Total des lignes trouvées dans l'Excel : ${rows.length}`);

  // Récupérer les numéros de téléphone déjà existants pour éviter les doublons
  console.log("📥 Récupération des prospects existants dans Supabase...");
  const { data: existing, error: fetchError } = await supabase
    .from('prospects')
    .select('phone');

  if (fetchError) {
    console.error("❌ Erreur lors de la récupération des prospects existants :", fetchError.message);
    process.exit(1);
  }

  const existingPhones = new Set(existing ? existing.map(p => p.phone) : []);
  console.log(`ℹ️ ${existingPhones.size} numéros de téléphone déjà enregistrés.`);

  const prospectsToInsert = [];
  let ignoredCount = 0;
  let duplicateCount = 0;

  for (const row of rows) {
    const rawPhone = row['Téléphone'];
    if (!rawPhone) {
      ignoredCount++;
      continue;
    }

    let phone = String(rawPhone).trim().replace(/[\s\.\-\(\)]/g, '');
    if (phone.startsWith('0')) {
      phone = '+33' + phone.substring(1);
    }

    if (existingPhones.has(phone)) {
      duplicateCount++;
      continue;
    }

    const name = row['Raison sociale'] || 'Sans Nom';
    const city = row['Ville'] || 'France';
    const activity = row['Métier'] || row['Libellé activité'] || 'climatisation';
    const zipCode = row['Code postal'] ? String(row['Code postal']) : '';
    const region = row['Région'] || '';
    const address = row['Adresse normée ligne 4'] || '';
    const siret = row['Siret'] ? String(row['Siret']) : '';

    // Déterminer le score pré-appel
    const actLower = activity.toLowerCase();
    const isHigh = actLower.includes('clim') || actLower.includes('pac') || actLower.includes('thermique') || actLower.includes('chauffage');
    const score = isHigh ? 85 : 60;

    // Métadonnées de simulation
    const googleRating = parseFloat((Math.random() * 0.8 + 4.0).toFixed(1));
    const googleReviews = Math.floor(Math.random() * 40) + 5;
    const hasWebsite = Math.random() > 0.4;

    prospectsToInsert.push({
      name,
      siret,
      phone,
      email: null,
      website: hasWebsite ? `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'installateur'}.fr` : null,
      address,
      city,
      zip_code: zipCode,
      region,
      activity_detected: activity,
      source: 'import_excel_cvc',
      google_rating: googleRating,
      google_reviews_count: googleReviews,
      has_website: hasWebsite,
      digital_maturity: hasWebsite ? (googleReviews > 20 ? 'forte' : 'moyenne') : 'faible',
      keywords_matched: isHigh ? ['clim', 'pac'] : [],
      pre_call_score: score,
      mission_name: 'Import CVC Excel',
      status: 'pending'
    });
  }

  console.log(`💡 Résultats du filtrage :
  - A insérer : ${prospectsToInsert.length}
  - Ignorés (sans téléphone) : ${ignoredCount}
  - Doublons ignorés : ${duplicateCount}`);

  if (prospectsToInsert.length === 0) {
    console.log("✅ Aucun nouveau prospect à importer.");
    return;
  }

  // Insertion par lots (batches) de 100
  const batchSize = 100;
  let successCount = 0;

  for (let i = 0; i < prospectsToInsert.length; i += batchSize) {
    const batch = prospectsToInsert.slice(i, i + batchSize);
    console.log(`📤 Insertion du lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(prospectsToInsert.length / batchSize)} (${batch.length} prospects)...`);
    
    const { error: insertError } = await supabase
      .from('prospects')
      .insert(batch);

    if (insertError) {
      console.error("❌ Erreur lors de l'insertion du lot :", insertError.message);
    } else {
      successCount += batch.length;
    }
  }

  console.log(`🎉 Importation terminée avec succès ! ${successCount} nouveaux prospects insérés.`);
}

importExcel().catch(err => {
  console.error("❌ Erreur critique lors de l'importation :", err);
});
