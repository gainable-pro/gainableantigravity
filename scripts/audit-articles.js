
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        take: 5,
        select: {
            title: true,
            slug: true,
            introduction: true,
            content: true
        }
    });
    console.log(JSON.stringify(articles, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
