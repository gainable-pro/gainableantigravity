import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expertId = 'b6fce27f-cff9-4db6-8348-b7e1052b1291';
    const expert = await prisma.expert.findUnique({
        where: { id: expertId },
        select: { id: true, nom_entreprise: true, slug: true, status: true }
    });
    console.log(JSON.stringify(expert, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
