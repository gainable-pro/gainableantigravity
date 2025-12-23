
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const article = await prisma.article.findFirst({
        where: { title: { contains: "Climatisation" } }
    });

    if (article) {
        console.log("--- TITLE ---");
        console.log(article.title);
        console.log("--- INTRO ---");
        console.log(article.introduction);
        console.log("--- CONTENT SAMPLE ---");
        console.log(article.content.substring(0, 1000));
        console.log("--- FULL CONTENT LENGTH ---");
        console.log(article.content.length);
    } else {
        console.log("No article found.");
    }
}

main().finally(() => prisma.$disconnect());
