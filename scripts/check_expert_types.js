const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const experts = await prisma.expert.findMany({
        select: { expert_type: true },
        distinct: ['expert_type']
    });
    console.log("Distinct expert types:", experts.map(e => e.expert_type));
}
main().catch(console.error).finally(() => prisma.$disconnect());
