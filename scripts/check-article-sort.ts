
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkArticles() {
    const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' }, // Current sort
        select: {
            id: true,
            title: true,
            publishedAt: true,
            createdAt: true, // Check this too
            expert: { select: { nom_entreprise: true } }
        },
        take: 20
    });

    console.log("--- ARTICLES (checking dates) ---");
    articles.forEach(a => {
        console.log(`[Published: ${a.publishedAt?.toISOString() || 'NULL'}] [Created: ${a.createdAt.toISOString()}] ${a.title}`);
    });

    const nullCount = await prisma.article.count({
        where: { status: 'PUBLISHED', publishedAt: null }
    });
    console.log(`\nTotal PUBLISHED articles with NULL publishedAt: ${nullCount}`);
}

checkArticles()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
