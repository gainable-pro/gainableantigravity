require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: files, error } = await supabase.storage.from('gainable-assets').list('uploads', { limit: 1000 });
  if (error) {
    console.error('Storage error:', error);
    return;
  }

  const experts = await prisma.expert.findMany({
    select: {
      id: true,
      nom_entreprise: true,
      slug: true,
      logo_url: true,
      created_at: true
    }
  });

  fs.writeFileSync('storage_files.json', JSON.stringify(files, null, 2));
  fs.writeFileSync('experts.json', JSON.stringify(experts, null, 2));

  console.log(`Saved ${files.length} storage files and ${experts.length} experts to JSON.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
