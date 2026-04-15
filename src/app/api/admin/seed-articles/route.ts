import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { b2bArticles } from "@/lib/b2b-articles-data";

export async function GET(req: Request) {
    try {
        console.log('Starting B2B Articles Generation...');

        // Get Admin Expert ID for the blog post
        const expert = await prisma.expert.findUnique({
            where: { slug: 'gainable-fr' },
        });

        if (!expert) {
            return NextResponse.json({ error: 'Expert "gainable-fr" not found. Please ensure it exists.' }, { status: 400 });
        }

        const stats = { created: 0, updated: 0 };
        const results = [];

        for (const article of b2bArticles) {
            const existing = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug: article.slug } }
            });

            if (existing) {
                console.log(`Article "${article.slug}" already exists, updating...`);
                await prisma.article.update({
                    where: { id: existing.id },
                    data: {
                        title: article.title,
                        introduction: article.intro,
                        content: article.contentHtml,
                        status: 'PUBLISHED',
                        mainImage: article.mainImage,
                        jsonContent: {
                            sections: [{ title: article.title, content: article.contentHtml }],
                            faq: []
                        }
                    }
                });
                stats.updated++;
                results.push({ slug: article.slug, action: 'updated', url: `https://www.gainable.fr/entreprise/gainable-fr/articles/${article.slug}` });
            } else {
                console.log(`Creating new article "${article.slug}"...`);
                await prisma.article.create({
                    data: {
                        title: article.title,
                        slug: article.slug,
                        expertId: expert.id,
                        introduction: article.intro,
                        content: article.contentHtml,
                        status: 'PUBLISHED',
                        publishedAt: new Date(),
                        mainImage: article.mainImage,
                        jsonContent: {
                            sections: [{ title: article.title, content: article.contentHtml }],
                            faq: []
                        }
                    }
                });
                stats.created++;
                results.push({ slug: article.slug, action: 'created', url: `https://www.gainable.fr/entreprise/gainable-fr/articles/${article.slug}` });
            }
        }

        return NextResponse.json({ success: true, stats, results });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
