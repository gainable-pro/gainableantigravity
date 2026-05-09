import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expertId = 'b6fce27f-cff9-4db6-8348-b7e1052b1291';
    const articles = await prisma.article.findMany({
        where: { expertId },
        select: { id: true, title: true, status: true, expertId: true }
    });
    console.log(`Expert ID: ${expertId}`);
    console.log(`Articles found: ${articles.length}`);
    console.log(JSON.stringify(articles, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
