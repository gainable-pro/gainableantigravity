import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // Cache sitemap index for 24 hours

export async function GET() {
    const baseUrl = 'https://www.gainable.fr';
    const now = new Date().toISOString();

    const articleCount = await prisma.article.count({
        where: { status: 'PUBLISHED' }
    });
    
    const ARTICLE_BATCH_SIZE = 7500;
    const articleSitemapsCount = Math.ceil(articleCount / ARTICLE_BATCH_SIZE);
    const totalSitemapsCount = 1 + articleSitemapsCount;

    const sitemaps = Array.from({ length: totalSitemapsCount }, (_, i) =>
        `  <sitemap>\n    <loc>${baseUrl}/sitemap/${i}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
