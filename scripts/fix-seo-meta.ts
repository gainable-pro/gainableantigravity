
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
        if (metaDesc.length > 300) {
            // Truncate if too long (though intro was designed to be short)
            metaDesc = metaDesc.substring(0, 297) + "...";
        }

        // 2. Alt Text
        // Generate based on title. 
        // "Installation de climatisation gainable à [City]"
        // We need the city. I didn't save 'targetCity' in valid column in previous script?
        // Let's check if targetCity was saved. 
        // Checking generate-articles-batch.ts... I DID NOT save targetCity in the `data` object!
        // I rotated cities in memory but didn't persist the choice!
        // This is a problem. The content mentions the city, but the structured field `targetCity` is likely null.

        // RECOVERY:
        // Extract city from the content (it's in the first paragraph "Vous êtes situé à Paris...").
        // Regex to find city.
        const cityMatch = article.introduction?.match(/projet à ([^.]+)\./) || null;
        let city = "France";
        if (cityMatch && cityMatch[1]) {
            city = cityMatch[1].trim();
        } else {
            // Fallback regex on content if intro structure varies
            // <p>Vous êtes situé à <strong>Paris</strong>
        }

        // Wait, I can't easily read content here without fetching it (heavy).
        // Actually, in `generate-articles-batch.ts`, intro was: `Découvrez tout sur : ${title}. Guide complet pour votre projet à ${city}.`
        // So I can extract city from `introduction` string easily.
        const introText = article.introduction || "";
        const extraction = introText.match(/projet à (.*?)\./);
        if (extraction) {
            city = extraction[1];
        }

        const altText = `Installation ${article.title} - Expert ${city}`;

        await prisma.article.update({
            where: { id: article.id },
            data: {
                metaDesc: metaDesc,
                altText: altText, // SEO optimized alt text
                targetCity: city // Populate this missing field too
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
