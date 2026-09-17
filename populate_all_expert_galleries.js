require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const STORAGE_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gainable-assets/uploads/`;

// Standard pool of 12 verified high quality CVC & Heat Pump installation photos on Supabase Storage
const CVC_PHOTO_POOL = [
  '1768811007372_3vz54fsic_2025-10-21.webp',
  '1768811007372_5laml8ma0_2021-01-21.webp',
  '1768811007372_6ubt42tnz_unnamed__9_.webp',
  '1768811007372_8urf05f49_2025-10-21__1_.webp',
  '1768811007372_cc11pegwp_2021-06-21.webp',
  '1768812595674_dufzt8egf_lorrraine-chauffage-installation-pompe-chaleur-mitsubishi.webp',
  '1768812595674_h9gh4h61n_2023-05-31.webp',
  '1768820313081_7lph43dp5_Clim_DAIKIN_la_rochelle.webp',
  '1768820313081_oc1bdcrzn_Pompe___chaleur_DAIKIN_copie.webp',
  '1768823166911_4rumzrf3r_marco_climatisation.webp',
  '1768823166911_mhszr6nxg_unnamed__41_.webp',
  '1768823166911_p6c487mhm_unnamed__40_.webp'
];

async function run() {
  console.log("=== Population de 100% des galeries photos de tous les experts sur Gainable.fr ===");

  const experts = await prisma.expert.findMany({
    include: { photos: true }
  });

  let addedTotal = 0;

  for (let i = 0; i < experts.length; i++) {
    const expert = experts[i];

    // Skip internal platform handles if not public business
    if (expert.slug === 'gainable-fr' || expert.slug === 'redaction-gainable' || expert.slug === 'gainable-redaction') {
      continue;
    }

    if (expert.photos.length === 0) {
      // Rotate through CVC pool to give every expert 4 distinct high quality photos
      const startIdx = (i * 3) % CVC_PHOTO_POOL.length;
      const selectedFiles = [
        CVC_PHOTO_POOL[startIdx % CVC_PHOTO_POOL.length],
        CVC_PHOTO_POOL[(startIdx + 1) % CVC_PHOTO_POOL.length],
        CVC_PHOTO_POOL[(startIdx + 2) % CVC_PHOTO_POOL.length],
        CVC_PHOTO_POOL[(startIdx + 3) % CVC_PHOTO_POOL.length]
      ];

      console.log(`\nAjout de 4 photos CVC de qualité pour: ${expert.nom_entreprise} (${expert.slug})...`);
      for (const file of selectedFiles) {
        const photoUrl = `${STORAGE_BASE_URL}${file}`;
        await prisma.expertPhoto.create({
          data: {
            expert_id: expert.id,
            photo_url: photoUrl
          }
        });
        addedTotal++;
        console.log(`  ✅ ${photoUrl}`);
      }
    } else {
      console.log(`\nExpert déjà équipé (${expert.photos.length} photos conservées): ${expert.nom_entreprise}`);
    }
  }

  console.log(`\n=== SUCCÈS ! ${addedTotal} photos ajoutées. 100% des experts ont maintenant une galerie complète ! ===`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
