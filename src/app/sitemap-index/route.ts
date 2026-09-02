import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // Cache sitemap index for 24 hours

export async function GET() {
    const baseUrl = 'https://www.gainable.fr';
    const now = new Date().toISOString();

    let totalSitemapsCount = 2; // /sitemap/0.xml (Core + Cities) + /sitemap/1.xml (Curated Articles)
    try {
        const articleCount = await prisma.article.count({
            where: { status: 'PUBLISHED' }
        });
        totalSitemapsCount = articleCount > 0 ? 2 : 1;
    } catch (e) {
        console.error("Error fetching article count for sitemap-index:", e);
    }

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

