require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  const smb13 = await prisma.expert.findFirst({
    where: { nom_entreprise: { contains: 'SMB 13', mode: 'insensitive' } },
    include: { photos: true, marques: true }
  });

  console.log(`=== SMB 13 ===`);
  console.log(`Photos count: ${smb13.photos.length}`);
  smb13.photos.forEach(p => console.log(`  - ${p.photo_url}`));
  console.log(`Marques count: ${smb13.marques.length}`);
  smb13.marques.forEach(m => console.log(`  - ${m.value}`));

  const airg = await prisma.expert.findFirst({
    where: { nom_entreprise: { contains: 'Air G', mode: 'insensitive' } },
    include: { photos: true, marques: true }
  });

  console.log(`\n=== AIR G ENERGIE ===`);
  console.log(`Photos count: ${airg.photos.length}`);
  airg.photos.forEach(p => console.log(`  - ${p.photo_url}`));
}

run().catch(console.error).finally(() => prisma.$disconnect());
