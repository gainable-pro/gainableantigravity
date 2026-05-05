const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const experts = await prisma.expert.findMany({ select: { nom_entreprise: true } });
    console.log(experts);
}

main().finally(() => prisma.$disconnect());
