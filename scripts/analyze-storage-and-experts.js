require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // List all files in Supabase Storage gainable-assets / uploads
  const { data: files, error } = await supabase.storage.from('gainable-assets').list('uploads', { limit: 1000 });
  if (error) {
    console.error('Storage error:', error);
    return;
  }
  console.log(`Total files in Supabase Storage: ${files.length}`);

  // Group files by timestamp prefix (first 13 digits: 176xxxxxxxxxx)
  const groupedByTime = {};
  for (const f of files) {
    const timeMatch = f.name.match(/^(17\d{11})/);
    const prefix = timeMatch ? timeMatch[1] : 'other';
    if (!groupedByTime[prefix]) groupedByTime[prefix] = [];
    groupedByTime[prefix].push(f);
  }

  console.log('\n--- Grouped files by upload timestamp prefix ---');
  for (const [prefix, fList] of Object.entries(groupedByTime)) {
    console.log(`\nPrefix: ${prefix} (${fList.length} files):`);
    fList.forEach(f => console.log(`   ${f.name} (created: ${f.created_at})`));
  }

  // Get all experts
  const experts = await prisma.expert.findMany({
    select: {
      id: true,
      nom_entreprise: true,
      slug: true,
      logo_url: true,
      created_at: true,
      updated_at: true,
      photos: {
        select: { id: true, photo_url: true, created_at: true }
      }
    }
  });

  console.log(`\n--- Experts (${experts.length}) ---`);
  for (const e of experts) {
    console.log(`\nExpert: ${e.nom_entreprise} | Slug: ${e.slug}`);
    console.log(`  Logo URL: ${e.logo_url}`);
    console.log(`  Created: ${e.created_at}`);
    console.log(`  Photos in DB (${e.photos.length}):`);
    e.photos.forEach(p => console.log(`    Photo ID: ${p.id} | DB URL: ${p.photo_url} | Created: ${p.created_at}`));
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
