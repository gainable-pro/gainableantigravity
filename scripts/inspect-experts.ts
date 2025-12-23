
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const experts = await prisma.expert.findMany({
        where: { slug: { not: 'gainable-fr' } }, // Show all except admin
        select: {
            id: true,
            nom_entreprise: true,
            ville: true,
            pays: true,
            status: true,
            latitude: true,
            longitude: true,
            slug: true
        }
    });

    console.log("Found experts:", experts.length);
    console.table(experts);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
