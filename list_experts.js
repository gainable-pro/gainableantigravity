
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listExperts() {
    try {
        const experts = await prisma.expert.findMany({
            take: 20,
            orderBy: {
                created_at: 'asc' // Corrected field name
            },
            select: {
                id: true,
                nom_entreprise: true,
                slug: true,
                created_at: true // Corrected field name
            }
        });

        console.log('--- Oldest Experts ---');
        experts.forEach(e => {
            // Simple match specific to the one looked for
            if (e.nom_entreprise.toLowerCase().includes('ar g')) {
                console.log(`>>> FOUND IT: ${e.nom_entreprise} -> ${e.slug} (${e.created_at})`);
            } else {
                console.log(`${e.nom_entreprise} -> ${e.slug} (${e.created_at})`);
            }
        });
    } catch (error) {
        console.error("Error fetching experts:", error);
    }
}

listExperts()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
