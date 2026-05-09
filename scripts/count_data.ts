import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const articleCount = await prisma.article.count();
    const expertCount = await prisma.expert.count();
    console.log(`Articles: ${articleCount}`);
    console.log(`Experts: ${expertCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
