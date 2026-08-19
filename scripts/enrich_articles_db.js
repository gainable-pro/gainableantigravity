const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

// Variation pools for high-converting acquisition meta titles & descriptions
const TITLE_TEMPLATES = [
  "Trouver un Installateur de Climatisation Gainable à {city} : Devis & Artisan RGE",
  "Entreprise Climatisation Réversible à {city} : Devis Gratuit & Pose",
  "Artisan RGE Climatisation & Pompe à Chaleur à {city} : Tarif & Devis",
  "Société Experte en Climatisation Gainable à {city} (RGE & RE2020)",
  "Installation Climatisation Gainable à {city} : Trouver un Artisan Qualifié",
  "Devis Climatisation & PAC Réversible à {city} : Installateurs Certifiés"
];

const DESC_TEMPLATES = [
  "Vous recherchez une entreprise de climatisation réversible qualifiée RGE à {city} ? Obtenez une étude thermique gratuite et trouvez un artisan certifié au meilleur tarif.",
  "Trouvez un installateur certifié RGE pour votre projet de climatisation gainable à {city}. Devis gratuit, calcul de déperdition et pose conforme RE2020.",
  "Besoin d'un professionnel agréé en génie climatique à {city} ? Comparez les devis des meilleurs artisans locaux certifiés pour votre climatisation réversible.",
  "Installation de climatisation gainable et pompe à chaleur à {city}. Demandez votre devis sur-mesure auprès d'une société experte RGE de votre secteur."
];

const INTRO_TEMPLATES = [
  "Vous souhaitez installer une climatisation réversible ou un système gainable à {city} ? Pour garantir la performance énergétique et le confort thermique de votre logement, faire appel à une entreprise d'installation certifiée RGE est essentiel dans la région.",
  "Trouver un artisan qualifié en climatisation gainable à {city} est la première étape pour réussir votre projet de rénovation ou de construction neuve RE2020. Découvrez notre guide complet des tarifs, des normes et des aides financières disponibles.",
  "À la recherche d'une société experte en pompe à chaleur et climatisation réversible à {city} ? Que ce soit pour un logement individuel ou des locaux professionnels, nos installateurs partenaires RGE vous accompagnent du dimensionnement à la pose.",
  "L'installation d'une climatisation gainable réversible à {city} exige une étude thermique précise et un savoir-faire reconnu. Voici les éléments clés pour choisir votre installateur agréé et obtenir votre devis d'installation gratuit."
];

function stringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function enrichArticles() {
  console.log("=== DEBUT DE L'ENRICHISSEMENT BDD URL PAR URL (ACQUISITION & SEO) ===");

  const BATCH_SIZE = 50;
  let updatedCount = 0;

  const totalArticles = await prisma.article.count({
    where: { status: 'PUBLISHED' }
  });

  console.log(`Total d'articles à traiter en BDD : ${totalArticles}`);

  let hasMore = true;
  let cursor = null;

  while (hasMore) {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        title: true,
        slug: true,
        targetCity: true,
        metaDesc: true,
        introduction: true,
        expert: { select: { nom_entreprise: true, ville: true } }
      },
      orderBy: { id: 'asc' }
    });

    if (articles.length === 0) break;
    cursor = articles[articles.length - 1].id;

    const promises = articles.map(article => {
      const city = article.targetCity || article.expert?.ville || "votre secteur";
      const hash = stringHash(article.id + city);

      const titleTpl = TITLE_TEMPLATES[hash % TITLE_TEMPLATES.length];
      const descTpl = DESC_TEMPLATES[hash % DESC_TEMPLATES.length];
      const introTpl = INTRO_TEMPLATES[hash % INTRO_TEMPLATES.length];

      let newTitle = article.title;
      if (city && city !== "votre secteur" && !article.title.toLowerCase().includes("trouver") && !article.title.toLowerCase().includes("artisan")) {
        newTitle = titleTpl.replace(/\{city\}/g, city);
      }

      const newMetaDesc = descTpl.replace(/\{city\}/g, city);
      let newIntro = introTpl.replace(/\{city\}/g, city);

      if (article.introduction && article.introduction.length > 200 && !article.introduction.includes("Depuis l'entrée en vigueur")) {
        newIntro = article.introduction;
      }

      return prisma.article.update({
        where: { id: article.id },
        data: {
          title: newTitle,
          metaDesc: newMetaDesc,
          introduction: newIntro,
          updatedAt: new Date()
        }
      });
    });

    await Promise.all(promises);
    updatedCount += articles.length;

    if (updatedCount % 500 === 0 || updatedCount >= totalArticles) {
      console.log(`- Traité : ${updatedCount} / ${totalArticles} articles...`);
    }

    if (articles.length < BATCH_SIZE) break;
  }

  console.log(`\n✅ SUCCÈS : ${updatedCount} articles ont été réécrits et enrichis en BDD avec des métas orientées acquisition d'artisans !`);
}

enrichArticles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
