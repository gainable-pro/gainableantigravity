import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { b2bArticles } from "@/lib/b2b-articles-data";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        const results = await Promise.all(b2bArticles.map(async (article) => {
            const articleData = {
                title: article.title,
                slug: article.slug,
                expertId: expert.id,
                introduction: article.intro,
                content: article.contentHtml,
                status: 'PUBLISHED' as any,
                mainImage: article.mainImage,
                jsonContent: {
                    sections: [{ title: article.title, content: article.contentHtml }],
                    faq: []
                }
            };

            const existing = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug: article.slug } }
            });

            if (existing) {
                await prisma.article.update({
                    where: { id: existing.id },
                    data: articleData
                });
                return { slug: article.slug, action: 'updated', url: `https://www.gainable.fr/entreprise/gainable-fr/articles/${article.slug}` };
            } else {
                await prisma.article.create({
                    data: {
                        ...articleData,
                        publishedAt: new Date()
                    }
                });
                return { slug: article.slug, action: 'created', url: `https://www.gainable.fr/entreprise/gainable-fr/articles/${article.slug}` };
            }
        }));

        stats.updated = results.filter(r => r.action === 'updated').length;
        stats.created = results.filter(r => r.action === 'created').length;

        return NextResponse.json({ success: true, stats, results });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
