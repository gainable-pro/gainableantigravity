const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    include: {
      expert: {
        select: { nom_entreprise: true }
      }
    }
  });
  console.log(`Total articles: ${articles.length}`);
  const byExpert = articles.reduce((acc, a) => {
    const name = a.expert.nom_entreprise;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  console.log(byExpert);
}
main().finally(() => prisma.$disconnect());
