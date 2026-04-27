require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const expert = await prisma.expert.findFirst({
    where: {
      OR: [
        { nom_entreprise: { contains: 'climconfort34', mode: 'insensitive' } },
        { slug: { contains: 'climconfort34', mode: 'insensitive' } }
      ]
    },
    include: {
      user: true
    }
  });

  if (expert) {
    console.log('Expert found:', {
      nom_entreprise: expert.nom_entreprise,
      slug: expert.slug,
      email: expert.user.email,
      password_hash: expert.user.password_hash
    });
  } else {
    // Try finding by user email directly
    const user = await prisma.user.findFirst({
      where: {
        email: { contains: 'climconfort34', mode: 'insensitive' }
      }
    });
    if (user) {
        console.log('User found by email:', {
            email: user.email,
            password_hash: user.password_hash
        });
    } else {
        console.log('No expert or user found for climconfort34.');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
