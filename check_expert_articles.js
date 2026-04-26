const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const expert = await prisma.expert.findFirst({
    where: { nom_entreprise: { contains: 'AIR' } }
  });
  console.log("Expert:", expert);

  if (expert) {
    const articles = await prisma.article.findMany({
      where: { expertId: expert.id }
    });
    console.log(`Articles for ${expert.nom_entreprise}:`, articles.length);
  }

  // Find ANY article NOT from Gainable or Bureau d'Etude
  const otherArticles = await prisma.article.findMany({
    where: {
      expert: {
        nom_entreprise: {
          notIn: ['Rédaction Gainable.fr', 'Gainable.fr', "Bureau d'Etude Gainable.fr", 'Gainable Rédaction']
        }
      }
    }
  });
  console.log(`Articles by real experts: ${otherArticles.length}`);
  console.log(otherArticles.map(a => a.title));
}
main().finally(() => prisma.$disconnect());
