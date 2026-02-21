
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        take: 20,
        select: {
            title: true,
            content: true
        }
    });

    console.log(`Auditing ${articles.length} articles...`);

    for (let i = 0; i < articles.length; i++) {
        const a1 = articles[i];
        for (let j = i + 1; j < articles.length; j++) {
            const a2 = articles[j];

            // Simple similarity check: shared word count percentage
            const words1 = new Set(a1.content.toLowerCase().match(/\w+/g));
            const words2 = new Set(a2.content.toLowerCase().match(/\w+/g));

            const intersection = new Set([...words1].filter(x => words2.has(x)));
            const similarity = (intersection.size / Math.min(words1.size, words2.size)) * 100;

            if (similarity > 80) {
                console.log(`High similarity (${similarity.toFixed(2)}%) between:`);
                console.log(`  - ${a1.title}`);
                console.log(`  - ${a2.title}`);
            }
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
