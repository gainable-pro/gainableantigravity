
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const experts = await prisma.expert.findMany({
        where: {
            nom_entreprise: { in: ['AIR G ENERGIE', 'SMB 13'] }
        },
        select: {
            id: true,
            nom_entreprise: true,
            telephone: true,
            user: { select: { email: true } }
        }
    });

    console.log("Found Experts:");
    experts.forEach(e => {
        console.log(`- ${e.nom_entreprise}: Phone="${e.telephone}" Email="${e.user.email}"`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
