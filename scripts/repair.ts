import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Repair...");
    // 1. Delete all mass SEO articles that might have been corrupted (targetCity is not null)
    const result = await prisma.article.deleteMany({
        where: { targetCity: { not: null } }
    });
    console.log(`Deleted ${result.count} local SEO articles to prepare for clean seed.`);
}

main().finally(() => prisma.$disconnect());
