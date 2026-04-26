const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const a = await prisma.article.findFirst({ where: { slug: { contains: 'pac-sk88rj' } } });
  console.log("DB MAIN IMAGE: ", a?.mainImage);
}
main().finally(() => prisma.$disconnect());
