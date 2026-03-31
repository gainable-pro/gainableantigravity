import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });
    console.log("EXPERT SLUG:", expert?.slug);

    const article = await prisma.article.findFirst({
        where: { expertId: expert?.id, title: { contains: 'Lausanne' } }
    });
    console.log("ARTICLE SLUG:", article?.slug);
}

main().finally(() => prisma.$disconnect());
