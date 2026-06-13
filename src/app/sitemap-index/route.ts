import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache sitemap index for 24 hours

/**
 * Sitemap Index - points to the 9 sub-sitemaps:
 *   /sitemap/0.xml  → static pages, experts, cities (~2,400 URLs)
 *   /sitemap/1.xml  → articles 1–7,500
 *   /sitemap/2.xml  → articles 7,501–15,000
 *   /sitemap/3.xml  → articles 15,001–22,500
 *   /sitemap/4.xml  → articles 22,501–30,000
 *   /sitemap/5.xml  → articles 30,001–37,500
 *   /sitemap/6.xml  → articles 37,501–45,000
 *   /sitemap/7.xml  → articles 45,001–52,500
 *   /sitemap/8.xml  → articles 52,501–60,000
 */
export async function GET() {
    const baseUrl = 'https://www.gainable.fr';
    const now = new Date().toISOString();

    const sitemaps = Array.from({ length: 9 }, (_, i) =>
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
