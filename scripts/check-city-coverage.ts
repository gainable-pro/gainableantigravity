
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        select: {
            title: true,
            status: true,
            targetCity: true,
            slug: true
        }
    });

    console.log(`Total articles: ${articles.length}`);

    const cityStats: Record<string, { published: number, draft: number, pending: number }> = {};
    const citiesFound = new Set<string>();

    // Known list from generator script to check against
    const GENERATOR_CITIES = [
        "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes",
        "Montpellier", "Strasbourg", "Bordeaux", "Lille", "Rennes",
        "Reims", "Le Havre", "Saint-Étienne", "Toulon"
    ];

    for (const article of articles) {
        let city = article.targetCity;

        // If targetCity is null, try to extract from title
        if (!city) {
            for (const knownCity of GENERATOR_CITIES) {
                if (article.title.includes(knownCity)) {
                    city = knownCity;
                    break;
                }
            }
        }

        if (city) {
            citiesFound.add(city);
            if (!cityStats[city]) {
                cityStats[city] = { published: 0, draft: 0, pending: 0 };
            }
            if (article.status === 'PUBLISHED') cityStats[city].published++;
            else if (article.status === 'DRAFT') cityStats[city].draft++;
            else cityStats[city].pending++;
        }
    }

    console.log("\n--- City Coverage ---");
    for (const [city, stats] of Object.entries(cityStats)) {
        console.log(`${city}: ${stats.published} Published, ${stats.draft} Draft, ${stats.pending} Pending`);
    }

    console.log("\n--- Missing from Generator List ---");
    const missing = GENERATOR_CITIES.filter(c => !citiesFound.has(c));
    console.log(missing.length > 0 ? missing.join(", ") : "None");

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
