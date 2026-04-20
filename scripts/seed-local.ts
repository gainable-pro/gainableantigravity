import { prisma } from '../src/lib/prisma';
import { b2bArticles } from '../src/lib/b2b-articles-data';

async function main() {
    const expert = await prisma.expert.findUnique({
        where: { slug: 'gainable-fr' },
    });

    if (!expert) {
        console.error("Expert gainable-fr not found");
        return;
    }

    let created = 0, updated = 0;

    for (const article of b2bArticles) {
        const existing = await prisma.article.findUnique({
            where: { expertId_slug: { expertId: expert.id, slug: article.slug } }
        });

        const articleData = {
            title: article.title,
            slug: article.slug,
            expertId: expert.id,
            status: 'PUBLISHED',
            content: article.contentHtml,
            mainImage: article.mainImage,
            introduction: article.intro,
            jsonContent: {
                sections: [{ title: article.title, content: article.contentHtml }],
                faq: []
            }
        };

        if (existing) {
            await prisma.article.update({
                where: { id: existing.id },
                data: articleData as any
            });
            updated++;
            console.log(`Updated: ${article.slug}`);
        } else {
            await prisma.article.create({
                data: articleData as any
            });
            created++;
            console.log(`Created: ${article.slug}`);
        }
    }
    console.log(`Done. Created: ${created}, Updated: ${updated}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
