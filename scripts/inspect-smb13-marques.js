require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const smb13 = await prisma.expert.findFirst({
    where: { nom_entreprise: { contains: 'SMB 13', mode: 'insensitive' } },
    include: { marques: true }
  });

  console.log(`SMB 13 marques (${smb13.marques.length}):`);
  smb13.marques.forEach(m => console.log(`  - ID: ${m.id} | Value: "${m.value}"`));
}

run().catch(console.error).finally(() => prisma.$disconnect());
