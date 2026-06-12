const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      title: true,
      slug: true,
      status: true,
      mainImage: true,
      altText: true,
      createdAt: true,
      expert: {
        select: {
          nom_entreprise: true
        }
      }
    }
  });
  console.log(JSON.stringify(articles, null, 2));
}

main().finally(() => prisma.$disconnect());
