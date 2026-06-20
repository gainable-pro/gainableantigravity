import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // Cache sitemaps for 24 hours

export async function generateStaticParams() {
    const ARTICLE_BATCH_SIZE = 7500;
    try {
        const articleCount = await prisma.article.count({
            where: { status: 'PUBLISHED' }
        });
        const articleSitemapsCount = Math.ceil(articleCount / ARTICLE_BATCH_SIZE);
        const totalSitemaps = 1 + articleSitemapsCount;
        return Array.from({ length: totalSitemaps }, (_, i) => ({ id: String(i) }));
    } catch (e) {
        console.error("Error in generateStaticParams for sitemap:", e);
        return Array.from({ length: 9 }, (_, i) => ({ id: String(i) }));
    }
}

const ARTICLE_BATCH_SIZE = 7500;
const BASE_URL = 'https://www.gainable.fr';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = Number(idStr);

    try {
        let xml = '';

        const articleCount = await prisma.article.count({
            where: { status: 'PUBLISHED' }
        });
        const articleSitemapsCount = Math.ceil(articleCount / ARTICLE_BATCH_SIZE);

        if (id === 0) {
            // Static pages
            const staticUrls = [
                '', '/trouver-installateur', '/trouver-diagnostiqueur',
                '/trouver-bureau-etude', '/inscription',
                '/faq-visibilite-referencement', '/labels',
                '/bureau-etude', '/diagnostic-immobilier',
                '/materiel',
            ].map(r => `  <url><loc>${BASE_URL}${r}</loc><changefreq>daily</changefreq><priority>${r === '' ? '1.0' : '0.8'}</priority></url>`);

            // Experts
            const experts = await prisma.expert.findMany({
                where: { status: 'active' },
                select: { slug: true }
            });
            const expertUrls = experts.map(e =>
                `  <url><loc>${BASE_URL}/pro/${e.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`
            );

            // Catalogue Products
            const rawCatalog = await import('@/data/sonepar_catalog.json').then(m => m.default || m);
            const toSlug = (sku: string) => sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            const productUrls = (rawCatalog as any[]).map(p =>
                `  <url><loc>${BASE_URL}/materiel/${toSlug(p.manufacturerSku)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
            );

            // Cities
            const { CITIES_100 } = await import('@/data/cities-100');
            const { CITIES_EXTENDED } = await import('@/data/cities-extended');
            const { CITIES_MEDIUM } = await import('@/data/cities-medium');
            const { slugify } = await import('@/lib/utils');
            const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

            const regionSet = new Set(ALL_CITIES.map(c => c.region));
            const regionUrls = [...regionSet].map(r =>
                `  <url><loc>${BASE_URL}/trouver-installateur/${slugify(r)}</loc><changefreq>weekly</changefreq><priority>0.95</priority></url>`
            );
            const cityUrls = ALL_CITIES.map(c =>
                `  <url><loc>${BASE_URL}/climatisation/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`
            );

            const all = [...staticUrls, ...expertUrls, ...productUrls, ...regionUrls, ...cityUrls];
            xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.join('\n')}\n</urlset>`;

        } else if (id >= 1 && id <= articleSitemapsCount) {
            const skip = (id - 1) * ARTICLE_BATCH_SIZE;

            const expertsData = await prisma.expert.findMany({ select: { id: true, slug: true } });
            const expertMap = new Map(expertsData.map(e => [e.id, e.slug]));

            const articles = await prisma.article.findMany({
                where: { status: 'PUBLISHED' },
                skip,
                take: ARTICLE_BATCH_SIZE,
                select: { slug: true, updatedAt: true, expertId: true },
                orderBy: { createdAt: 'desc' }
            });

            const urls = articles
                .filter(a => expertMap.has(a.expertId))
                .map(a =>
                    `  <url><loc>${BASE_URL}/entreprise/${expertMap.get(a.expertId)}/articles/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
                );

            xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
        } else {
            return new NextResponse('Not found', { status: 404 });
        }

        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });

    } catch (err: any) {
        console.error('Sitemap error:', err);
        return new NextResponse(`Error: ${err.message}`, { status: 500 });
    }
}
