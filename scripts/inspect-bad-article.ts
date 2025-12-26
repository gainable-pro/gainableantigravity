
import { prisma } from "@/lib/prisma";

async function main() {
    const badArticle = await prisma.article.findFirst({
        where: {
            OR: [
                { metaDesc: null },
                { metaDesc: "" }
            ]
        }
    });

    if (badArticle) {
        console.log("Found bad article:", badArticle.id, badArticle.title);
        console.log("Intro:", badArticle.introduction);
        console.log("TargetCity:", badArticle.targetCity);
        console.log("MetaDesc:", badArticle.metaDesc);
    } else {
        console.log("No articles with missing metaDesc found!");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
