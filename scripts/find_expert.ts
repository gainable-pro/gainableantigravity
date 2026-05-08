import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: 'Air G',
                mode: 'insensitive'
            }
        }
    });
    console.log(JSON.stringify(expert, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
