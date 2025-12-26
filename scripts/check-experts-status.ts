
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- EXPERT STATUS CHECK ---");
    const experts = await prisma.expert.findMany({
        select: {
            id: true,
            nom_entreprise: true,
            slug: true,
            status: true,
            user: { select: { email: true } }
        }
    });

    console.table(experts);
}

main().finally(() => prisma.$disconnect());
