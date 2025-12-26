
import { prisma } from "@/lib/prisma";

async function main() {
    const article = await prisma.article.findFirst({
        where: { status: 'PUBLISHED' },
        include: { expert: true }
    });

    if (article && article.expert) {
        console.log(`Test URL: https://www.gainable.ch/entreprise/${article.expert.slug}/articles/${article.slug}`);
    } else {
        console.log("No published article found for test.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
