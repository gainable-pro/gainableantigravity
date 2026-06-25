require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const expert = await prisma.expert.findFirst({
    where: {
      nom_entreprise: { contains: 'air g', mode: 'insensitive' }
    },
    include: {
      user: true,
      articles: true
    }
  });

  if (expert) {
    console.log('Expert found:', {
      id: expert.id,
      nom_entreprise: expert.nom_entreprise,
      slug: expert.slug,
      email: expert.user.email,
      password_hash: expert.user.password_hash,
      articles_count: expert.articles.length,
      status: expert.status,
      created_at: expert.created_at
    });
  } else {
    console.log('No expert found.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
