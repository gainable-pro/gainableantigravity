
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expert = await prisma.expert.findFirst({ where: { nom_entreprise: "Gainable Rédaction" } });
    console.log("Admin Expert:", expert ? "FOUND" : "NOT FOUND");
    if (expert) console.log("Expert ID:", expert.id);

    const articleCount = await prisma.article.count();
    const articlesWithImage = await prisma.article.count({ where: { NOT: { mainImage: "/assets/images/blog-default.jpg" } } });
    const articlesLinkedToAdmin = expert ? await prisma.article.count({ where: { expertId: expert.id } }) : 0;

    console.log(`Total Articles: ${articleCount}`);
    console.log(`Articles with New Images: ${articlesWithImage}`);
    console.log(`Articles Linked to Admin: ${articlesLinkedToAdmin}`);
}

main().finally(() => prisma.$disconnect());
