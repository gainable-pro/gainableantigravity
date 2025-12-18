import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        include: {
            expert: {
                select: {
                    slug: true,
                    nom_entreprise: true
                }
            }
        }
    });

    console.log(`Found ${articles.length} articles.`);
    articles.forEach(a => {
        console.log(`- [${a.status}] "${a.title}" by ${a.expert.nom_entreprise} (${a.expert.slug})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
