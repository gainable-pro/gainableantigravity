import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache sitemap index for 1 hour

export async function GET() {
    const baseUrl = 'https://www.gainable.fr';
    const now = new Date().toISOString();

    // Sitemap 0: Core pages, all /pro/[slug], all real artisan articles, all /materiel/[sku], all /climatisation/[city]
    // Sitemap 1: Active whitelisted SEO articles with GSC impressions
    const totalSitemapsCount = 2;

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
