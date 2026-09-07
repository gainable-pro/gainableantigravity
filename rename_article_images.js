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

async function renameArticleImages() {
  console.log("=== Début du renommage SEO des images d'articles dans Supabase Storage & DB ===");

  const articles = await prisma.article.findMany({
    where: { mainImage: { not: null } },
    select: { id: true, title: true, slug: true, targetCity: true, mainImage: true, altText: true },
    take: 100
  });

  console.log(`Trouvé ${articles.length} articles avec une image d'illustration.`);

  let renamedCount = 0;
  let skippedCount = 0;

  for (const art of articles) {
    if (!art.mainImage) continue;

    if (art.mainImage.includes('gainable-assets/')) {
      const parts = art.mainImage.split('gainable-assets/');
      const oldPath = parts[1]; // e.g. "articles/b2c_paris_17123.png" or "uploads/..."
      const folder = oldPath.split('/')[0] || 'articles';
      const oldFilename = oldPath.split('/').pop() || '';

      const ext = oldFilename.split('.').pop()?.split('?')[0]?.toLowerCase() || 'png';
      const cleanSlug = slugify(art.slug || art.title).slice(0, 40);
      const citySlug = slugify(art.targetCity || 'france');

      const newFilename = `gainable-climatisation-installation-${citySlug}-${cleanSlug}.${ext}`;
      const newPath = `${folder}/${newFilename}`;

      if (oldFilename === newFilename) {
        skippedCount++;
        continue;
      }

      try {
        const { data: fileData, error: downloadError } = await supabase.storage.from('gainable-assets').download(oldPath);
        if (downloadError || !fileData) {
          skippedCount++;
          continue;
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());

        const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(newPath, buffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: true
        });

        if (uploadError) {
          skippedCount++;
          continue;
        }

        const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(newPath);
        const newImageUrl = publicUrlData.publicUrl;
        const newAltText = `Installation Climatisation Gainable RGE - ${art.title} à ${art.targetCity || 'France'}`;

        await prisma.article.update({
          where: { id: art.id },
          data: {
            mainImage: newImageUrl,
            altText: newAltText
          }
        });

        renamedCount++;
        if (renamedCount <= 5 || renamedCount % 10 === 0) {
          console.log(`[${renamedCount}] "${art.title}" -> ${newFilename}`);
        }
      } catch (err) {
        skippedCount++;
      }
    } else {
      // Local or static image, update altText with keywords
      const newAltText = `Gainable.fr Climatisation & PAC - ${art.title} (${art.targetCity || 'France'})`;
      await prisma.article.update({
        where: { id: art.id },
        data: { altText: newAltText }
      });
      skippedCount++;
    }
  }

  console.log(`\n=== Renommage des images d'articles terminé ! ${renamedCount} images renommées et ${skippedCount} attributs alt mis à jour. ===`);
}

renameArticleImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
