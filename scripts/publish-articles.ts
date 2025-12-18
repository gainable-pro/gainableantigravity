import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const expertSlug = "air-g-energie-470";
    const expert = await prisma.expert.findUnique({
        where: { slug: expertSlug }
    });

    if (!expert) {
        console.error("Expert not found!");
        return;
    }

    const result = await prisma.article.updateMany({
        where: { expertId: expert.id },
        data: {
            status: 'PUBLISHED',
            publishedAt: new Date()
        }
    });

    console.log(`Updated ${result.count} articles to PUBLISHED for ${expert.nom_entreprise}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
