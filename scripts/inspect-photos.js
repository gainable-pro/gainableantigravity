require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const experts = await prisma.expert.findMany({
    where: {
      photos: { some: {} }
    },
    select: {
      id: true,
      nom_entreprise: true,
      slug: true,
      photos: {
        select: { id: true, photo_url: true }
      }
    }
  });

  console.log(`Found ${experts.length} experts with photos.`);
  for (const e of experts) {
    console.log(`\nExpert: ${e.nom_entreprise} (${e.slug})`);
    console.log(`Photos (${e.photos.length}):`);
    e.photos.forEach(p => console.log(`  - ID: ${p.id} | URL: ${p.photo_url}`));
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
