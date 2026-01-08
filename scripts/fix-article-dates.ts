
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDates() {
    console.log("Starting date fix...");

    // Find articles that are PUBLISHED but have no publishedAt
    const articles = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            publishedAt: null
        },
        select: { id: true, createdAt: true, title: true }
    });

    console.log(`Found ${articles.length} articles to fix.`);

    for (const article of articles) {
        await prisma.article.update({
            where: { id: article.id },
            data: { publishedAt: article.createdAt }
        });
        console.log(`Updated: ${article.title} -> ${article.createdAt.toISOString()}`);
    }

    console.log("Done!");
}

fixDates()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
