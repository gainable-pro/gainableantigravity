
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for 'Air Ge Energie'...");
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: "Air Ge",
                mode: 'insensitive'
            }
        },
        include: {
            articles: true,
            user: true
        }
    });

    if (expert) {
        console.log("Found Expert:");
        console.log(`- ID: ${expert.id}`);
        console.log(`- Name: ${expert.nom_entreprise}`);
        console.log(`- Status: ${expert.status}`);
        console.log(`- Slug: ${expert.slug}`);
        console.log(`- Articles count: ${expert.articles.length}`);
        expert.articles.forEach(a => {
            console.log(`  - Article: ${a.title} (${a.status})`);
        });
    } else {
        console.log("Expert 'Air Ge Energie' not found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
