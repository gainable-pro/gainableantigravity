
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching articles...");

    // Fetch all articles, ordered by newest first
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true }
    });

    console.log(`Found ${articles.length} articles.`);

    if (articles.length <= 1) {
        console.log("No articles to delete (1 or fewer exists).");
        return;
    }

    // Keep the first one (most recent)
    const toKeep = articles[0];
    const toDelete = articles.slice(1);

    console.log(`\nKEEPING: "${toKeep.title}" (${toKeep.id})`);
    console.log(`\nDELETING ${toDelete.length} articles:`);
    toDelete.forEach((a, i) => console.log(` ${i + 1}. ${a.title}`));

    const idsToDelete = toDelete.map(a => a.id);

    // Initial deletion
    const result = await prisma.article.deleteMany({
        where: { id: { in: idsToDelete } }
    });

    console.log(`\nSuccessfully deleted ${result.count} articles.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
