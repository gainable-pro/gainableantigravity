import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { targetCity: { contains: 'Paris 15', mode: 'insensitive' } },
        select: { slug: true, title: true, expert: { select: { slug: true } } },
        take: 3
    });
    console.dir(articles, { depth: null });

    const marseilleArticles = await prisma.article.findMany({
        where: { targetCity: { contains: 'Marseille 8', mode: 'insensitive' } },
        select: { slug: true, title: true, expert: { select: { slug: true } } },
        take: 3
    });
    console.dir(marseilleArticles, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
