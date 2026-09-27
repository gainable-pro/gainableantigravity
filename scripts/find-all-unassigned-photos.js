require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const files = JSON.parse(fs.readFileSync('storage_files.json', 'utf8'));

async function run() {
  const dbPhotos = await prisma.expertPhoto.findMany();
  const dbUrls = new Set(dbPhotos.map(p => p.photo_url));

  console.log(`Total storage files: ${files.length}`);
  console.log(`Total DB photo URLs: ${dbPhotos.length}`);

  const unassigned = files.filter(f => {
    const fullUrl = `https://mppxucdjziuaovdfeknj.supabase.co/storage/v1/object/public/gainable-assets/uploads/${f.name}`;
    return !dbUrls.has(fullUrl);
  });

  console.log(`\n--- UNASSIGNED STORAGE FILES (${unassigned.length}) ---`);
  unassigned.forEach(f => console.log(`  - ${f.name} (created: ${f.created_at})`));
}

run().catch(console.error).finally(() => prisma.$disconnect());
