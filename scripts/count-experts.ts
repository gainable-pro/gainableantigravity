import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.expert.count();
    console.log(`Experts in DB: ${count}`);
    const experts = await prisma.expert.findMany({
        select: { nom_entreprise: true, status: true }
    });
    console.log("Expert names:", experts);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
