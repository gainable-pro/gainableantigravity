const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function fixDuplicatesAndOptimize() {
  console.log("=== Début du script d'optimisation SEO & Dédoublonnage ===");

  // 1. Fetch published articles that share exact titles
  const duplicateTitles = await prisma.$queryRaw`
    SELECT title, COUNT(*)::int as count 
    FROM "Article" 
    WHERE status = 'PUBLISHED' 
    GROUP BY title 
    HAVING COUNT(*) > 1 
    ORDER BY count DESC;
  `;

  console.log(`Nombre de titres en doublon identifiés : ${duplicateTitles.length}`);

  let updatedTitlesCount = 0;

  for (const dup of duplicateTitles) {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', title: dup.title },
      include: { expert: true }
    });

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const city = art.targetCity || art.expert.ville || 'France';
      const company = art.expert.nom_entreprise;

      let newTitle = art.title;
      if (i > 0) {
        if (i % 3 === 1) {
          newTitle = `【Devis Gratuit 48h】 Climatisation Gainable à ${city} (${company})`;
        } else if (i % 3 === 2) {
          newTitle = `Artisan RGE Climatisation & PAC Réversible à ${city} - ${company}`;
        } else {
          newTitle = `Installation Climatisation Gainable à ${city} [Tarifs 2026] - ${company}`;
        }
      } else if (!newTitle.includes('【') && !newTitle.includes('RGE')) {
        newTitle = `【Devis 48h】 ${newTitle}`;
      }

      const newMetaDesc = `▶ Obtenez votre devis d'installation de climatisation gainable et pompe à chaleur à ${city} avec ${company}. Artisans certifiés RGE & étude de dimensionnement offerte.`.slice(0, 160);

      await prisma.article.update({
        where: { id: art.id },
        data: {
          title: newTitle,
          metaDesc: newMetaDesc
        }
      });

      updatedTitlesCount++;
    }
  }

  console.log(`Titres mis à jour avec succès pour ${updatedTitlesCount} articles.`);

  // 2. Fetch duplicate introductions and add local uniqueness
  const duplicateIntros = await prisma.$queryRaw`
    SELECT "introduction", COUNT(*)::int as count 
    FROM "Article" 
    WHERE status = 'PUBLISHED' AND "introduction" IS NOT NULL AND LENGTH("introduction") > 10
    GROUP BY "introduction" 
    HAVING COUNT(*) > 1 
    ORDER BY count DESC;
  `;

  console.log(`\nNombre d'introductions en doublon identifiées : ${duplicateIntros.length}`);

  let updatedIntrosCount = 0;

  for (const dup of duplicateIntros) {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', introduction: dup.introduction },
      include: { expert: true }
    });

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const city = art.targetCity || art.expert.ville || 'votre secteur';
      const company = art.expert.nom_entreprise;

      if (i > 0) {
        const uniqueIntro = `Vous recherchez un spécialiste agréé en climatisation réversible et pompe à chaleur gainable à ${city} ? L'entreprise ${company} et le réseau Gainable.fr vous accompagnent du dimensionnement thermique jusqu'à la pose conforme aux normes RE2020. ${art.introduction}`;
        await prisma.article.update({
          where: { id: art.id },
          data: { introduction: uniqueIntro }
        });
        updatedIntrosCount++;
      }
    }
  }

  console.log(`Introductions mises à jour avec succès pour ${updatedIntrosCount} articles.`);

  console.log("\n=== Optimisation terminée avec succès ! ===");
}

fixDuplicatesAndOptimize()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
