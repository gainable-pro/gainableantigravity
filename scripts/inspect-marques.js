require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const marques = await prisma.expertMarque.findMany({
    include: { expert: { select: { nom_entreprise: true } } }
  });

  console.log(`Found ${marques.length} marques:`);
  marques.forEach(m => {
    console.log(`  - Expert: ${m.expert.nom_entreprise} | Value: "${m.value}"`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
