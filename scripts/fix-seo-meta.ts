
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting SEO Meta Fix...");

    // Fetch all articles
    const articles = await prisma.article.findMany({
        select: { id: true, title: true, introduction: true, targetCity: true, mainImage: true }
    });

    console.log(`Processing ${articles.length} articles...`);

    let updatedCount = 0;

    for (const article of articles) {
        // 1. Meta Description
        // If metaDesc is missing, we can use the 'introduction' (which we populated with a meta-desc-like text)
        // or regenerate it. The current 'introduction' IS the meta description text I generated earlier.
        // So we can copy introduction -> metaDesc.
        // OR we can make it better. Let's strictly use the introduction text if it fits typical length (it was 140-160 chars approx).

        let metaDesc = article.introduction || "";
        if (!metaDesc || metaDesc.trim() === "") {
            metaDesc = `Découvrez tout ce qu'il faut savoir sur : ${article.title}. Installation, avantages et conseils d'experts pour votre confort thermique.`;
        }

        if (metaDesc.length > 300) {
            metaDesc = metaDesc.substring(0, 297) + "...";
        }

        const introText = article.introduction || "";
        const extraction = introText.match(/projet à (.*?)\./);
        let city = "France";
        if (extraction) {
            city = extraction[1];
        }

        const altText = `Installation ${article.title} - Expert ${city}`;

        await prisma.article.update({
            where: { id: article.id },
            data: {
                metaDesc: metaDesc,
                altText: altText,
                targetCity: city
            }
        });

        updatedCount++;
        if (updatedCount % 50 === 0) process.stdout.write('.');
    }

    console.log(`\nSuccessfully updated SEO fields for ${updatedCount} articles.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
