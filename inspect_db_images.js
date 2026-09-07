const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function inspectImages() {
  const articlesWithImages = await prisma.article.findMany({
    where: { mainImage: { not: null } },
    select: { id: true, title: true, mainImage: true, altText: true },
    take: 20
  });

  const expertsWithLogos = await prisma.expert.findMany({
    where: { logo_url: { not: null } },
    select: { id: true, nom_entreprise: true, ville: true, logo_url: true },
    take: 20
  });

  console.log("=== Sample Article Images ===");
  console.log(articlesWithImages);

  console.log("\n=== Sample Expert Logos ===");
  console.log(expertsWithLogos);
}

inspectImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
