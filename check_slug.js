
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSlug() {
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: 'AR G',
                mode: 'insensitive'
            }
        }
    });

    if (expert) {
        console.log(`Found expert: ${expert.nom_entreprise}`);
        console.log(`Slug: ${expert.slug}`);
        console.log(`Created At: ${expert.createdAt}`);
    } else {
        console.log('Expert not found');
    }
}

checkSlug()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
