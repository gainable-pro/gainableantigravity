require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));

async function run() {
  const experts = await prisma.expert.findMany({
    include: { photos: true }
  });

  console.log(`Checking ${experts.length} experts...`);
  for (const exp of experts) {
    console.log(`\n========================================`);
    console.log(`Expert: ${exp.nom_entreprise} (${exp.slug})`);
    console.log(`Current DB photos count: ${exp.photos.length}`);
    exp.photos.forEach(p => console.log(`  - DB Photo: ${p.photo_url}`));
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
