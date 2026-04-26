const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const experts = await prisma.expert.findMany({ select: { slug: true, nom_entreprise: true } });
  console.log(`Total experts: ${experts.length}`);
  console.log(experts.slice(0, 10));
}
main().finally(() => prisma.$disconnect());
