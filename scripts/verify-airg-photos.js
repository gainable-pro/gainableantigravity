require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const airg = await prisma.expert.findUnique({
    where: { slug: 'climatisation-pompe-a-chaleur-miramas-air-g-energie-8907' },
    include: { photos: true }
  });

  console.log(`Expert: ${airg.nom_entreprise}`);
  console.log(`Photos count: ${airg.photos.length}`);
  airg.photos.forEach(p => console.log(`  - ${p.photo_url}`));
}

run().catch(console.error).finally(() => prisma.$disconnect());
