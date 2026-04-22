import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.article.count();
    const published = await prisma.article.count({ where: { status: 'PUBLISHED' }});
    const c = await prisma.expert.count();
    
    // Check how many have a targetCity
    const localArts = await prisma.article.count({ where: { NOT: { targetCity: null } }});
    const nationalArts = await prisma.article.count({ where: { targetCity: null } });

    console.log(`Total Articles: ${total}`);
    console.log(`Published Articles: ${published}`);
    console.log(`Local SEO Articles: ${localArts}`);
    console.log(`National Articles: ${nationalArts}`);
    console.log(`Experts: ${c}`);

    const sitemapLogic = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, expertId: true, slug: true }
    });
    console.log("Articles in sitemap pool: ", sitemapLogic.length);
}
main().finally(() => prisma.$disconnect());
