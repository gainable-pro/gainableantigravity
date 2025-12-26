
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("--- FORCE ACTIVATE EXPERTS ---");

    let retries = 5;
    while (retries > 0) {
        try {
            // activate ALL pending experts for now to be safe
            // or specific ones if we knew IDs. 
            // Let's just create if not exists or update.

            // 1. Activate standard experts
            const result = await prisma.expert.updateMany({
                where: {
                    OR: [
                        { nom_entreprise: { contains: "SMB", mode: 'insensitive' } },
                        { nom_entreprise: { contains: "FEXIM", mode: 'insensitive' } },
                        // also catch "Gmaroann" just in case
                        { nom_entreprise: { contains: "Gmaroann", mode: 'insensitive' } }
                    ]
                },
                data: { status: 'active' } // Make sure it's 'active' not 'ACTIVE' depending on schema?
                // Schema uses string default "pending". So "active" is likely correct.
            });

            console.log(`Activated ${result.count} experts.`);

            // Log who they are
            const experts = await prisma.expert.findMany({
                where: { status: 'active' },
                select: { nom_entreprise: true, slug: true, status: true }
            });
            console.table(experts);

            break; // Success
        } catch (e: any) {
            console.error(`Attempt failed: ${e.message}`);
            retries--;
            await wait(3000);
        }
    }
}

main().finally(() => prisma.$disconnect());
