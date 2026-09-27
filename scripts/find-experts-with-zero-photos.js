require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  const experts = await prisma.expert.findMany({
    include: { photos: true }
  });

  const withZero = experts.filter(e => e.photos.length === 0);
  const withPhotos = experts.filter(e => e.photos.length > 0);

  console.log(`Total Experts: ${experts.length}`);
  console.log(`Experts WITH photos (${withPhotos.length}):`);
  withPhotos.forEach(e => console.log(`  - ${e.nom_entreprise} (${e.photos.length} photos)`));

  console.log(`\nExperts WITH ZERO photos (${withZero.length}):`);
  withZero.forEach(e => console.log(`  - ${e.nom_entreprise} (${e.slug})`));
}

run().catch(console.error).finally(() => prisma.$disconnect());
