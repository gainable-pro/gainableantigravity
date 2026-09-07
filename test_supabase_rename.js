const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function renameExpertLogos() {
  console.log("=== Début du renommage SEO des logos d'entreprises dans Supabase Storage & DB ===");

  const experts = await prisma.expert.findMany({
    where: { logo_url: { not: null } },
    select: { id: true, nom_entreprise: true, ville: true, logo_url: true }
  });

  console.log(`Trouvé ${experts.length} experts avec un logo.`);

  let renamedCount = 0;
  let skippedCount = 0;

  for (const expert of experts) {
    if (!expert.logo_url) continue;

    // Check if logo is from gainable-assets bucket
    if (expert.logo_url.includes('gainable-assets/uploads/')) {
      const urlParts = expert.logo_url.split('/uploads/');
      const oldFilename = urlParts[1];

      // Extract file extension
      const ext = oldFilename.split('.').pop()?.split('?')[0]?.toLowerCase() || 'png';
      
      const companySlug = slugify(expert.nom_entreprise) || 'installateur';
      const citySlug = slugify(expert.ville) || 'france';

      // SEO-optimized filename with keywords: gainable-climatisation-rge-[entreprise]-[ville]
      const newFilename = `logo-gainable-climatisation-rge-${companySlug}-${citySlug}.${ext}`;
      const oldPath = `uploads/${oldFilename}`;
      const newPath = `uploads/${newFilename}`;

      if (oldFilename === newFilename) {
        skippedCount++;
        continue;
      }

      try {
        // 1. Download original file from Supabase
        const { data: fileData, error: downloadError } = await supabase.storage.from('gainable-assets').download(oldPath);
        
        if (downloadError || !fileData) {
          console.error(`Erreur téléchargement pour ${expert.nom_entreprise} (${oldPath}):`, downloadError?.message);
          skippedCount++;
          continue;
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());

        // 2. Upload with new SEO filename
        const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(newPath, buffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: true
        });

        if (uploadError) {
          console.error(`Erreur upload pour ${newPath}:`, uploadError.message);
          skippedCount++;
          continue;
        }

        // 3. Get Public URL of new file
        const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(newPath);
        const newLogoUrl = publicUrlData.publicUrl;

        // 4. Update Expert in database
        await prisma.expert.update({
          where: { id: expert.id },
          data: { logo_url: newLogoUrl }
        });

        renamedCount++;
        if (renamedCount % 10 === 0 || renamedCount <= 5) {
          console.log(`[${renamedCount}] ${expert.nom_entreprise} -> ${newFilename}`);
        }
      } catch (err) {
        console.error(`Erreur pour ${expert.nom_entreprise}:`, err.message);
        skippedCount++;
      }
    } else {
      skippedCount++;
    }
  }

  console.log(`\n=== Renommage terminé ! ${renamedCount} logos renommés avec succès avec mots-clés SEO (Gainable, Climatisation, RGE, Ville). ${skippedCount} ignorés/inchangés. ===`);
}

renameExpertLogos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
