import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

// Article sitemaps: IDs 1–8, each covering 7,500 articles (total ~60k)
// ID 0: Static pages, experts, regions, cities
const ARTICLE_BATCH_SIZE = 7500;
const ARTICLE_SITEMAP_COUNT = 8; // IDs 1 through 8

export async function generateSitemaps() {
    const ids = [{ id: 0 }];
    for (let i = 1; i <= ARTICLE_SITEMAP_COUNT; i++) {
        ids.push({ id: i });
    }
    return ids;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.gainable.fr';

    // ── Sitemap 0: Static pages + experts + cities ──────────────────────────
    if (id === 0) {
        const routes = [
            '',
            '/trouver-installateur',
            '/trouver-diagnostiqueur',
            '/trouver-bureau-etude',
            '/inscription',
            '/faq-visibilite-referencement',
            '/labels',
            '/bureau-etude',
            '/diagnostic-immobilier',
        ].map((route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }));

        const experts = await prisma.expert.findMany({
            where: { status: 'active' },
            select: { slug: true, created_at: true }
        });

        const expertRoutes = experts.map((expert) => ({
            url: `${baseUrl}/pro/${expert.slug}`,
            lastModified: expert.created_at,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        const { CITIES_100 } = await import('@/data/cities-100');
        const { CITIES_EXTENDED } = await import('@/data/cities-extended');
        const { CITIES_MEDIUM } = await import('@/data/cities-medium');
        const { slugify } = await import('@/lib/utils');

        const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

        const regions = Array.from(new Set(ALL_CITIES.map(c => c.region)));
        const regionRoutes = regions.map(region => ({
            url: `${baseUrl}/trouver-installateur/${slugify(region)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.95,
        }));

        const cityRoutes = ALL_CITIES.map((city) => ({
            url: `${baseUrl}/climatisation/${city.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        return [...routes, ...expertRoutes, ...regionRoutes, ...cityRoutes];
    }

    // ── Sitemaps 1–8: Articles in batches of 7,500 ─────────────────────────
    if (id >= 1 && id <= ARTICLE_SITEMAP_COUNT) {
        const skip = (id - 1) * ARTICLE_BATCH_SIZE;

        // Pre-load all expert slugs into memory (tiny table, very fast)
        const experts = await prisma.expert.findMany({
            select: { id: true, slug: true }
        });
        const expertMap = new Map(experts.map(e => [e.id, e.slug]));

        // Fetch only this batch — no SQL JOIN
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            skip,
            take: ARTICLE_BATCH_SIZE,
            select: { slug: true, updatedAt: true, expertId: true },
            orderBy: { createdAt: 'desc' }
        });

        return articles
            .filter(a => expertMap.has(a.expertId))
            .map((article) => ({
                url: `${baseUrl}/entreprise/${expertMap.get(article.expertId)}/articles/${article.slug}`,
                lastModified: article.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
    }

    return [];
}
