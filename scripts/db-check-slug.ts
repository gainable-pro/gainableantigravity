import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("--- Active Experts ---");
    const experts = await prisma.expert.findMany({
        where: { status: 'active' },
        take: 3,
        select: { slug: true, nom_entreprise: true }
    });
    console.log(JSON.stringify(experts, null, 2));

    console.log("\n--- Valid Articles ---");
    const articles = await prisma.article.findMany({
        take: 1,
        include: { expert: { select: { slug: true } } },
        where: { status: 'PUBLISHED' }
    });

    if (articles.length > 0) {
        const a = articles[0];
        console.log(`Article URL: /entreprise/${a.expert.slug}/articles/${a.slug}`);
    }
}

main().finally(() => prisma.$disconnect());
