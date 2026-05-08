import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to DB...");
    const count = await prisma.expert.count();
    console.log(`Expert count: ${count}`);
    const experts = await prisma.expert.findMany({ take: 10 });
    console.log("Experts:", JSON.stringify(experts, null, 2));
}

main()
    .catch(e => {
        console.error("ERROR in main:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
