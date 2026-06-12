import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export async function generateSitemaps() {
    // Split into 3 sitemaps to stay under Google's 50,000 URLs limit:
    // 0: Static pages, experts, regions, cities (~2.6k URLs)
    // 1: Published articles batch 1 (up to 30,000)
    // 2: Published articles batch 2 (remaining)
    return [
        { id: 0 },
        { id: 1 },
        { id: 2 }
    ];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.gainable.fr';

    if (id === 0) {
        // 1. Static Routes
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

        // 2. Dynamic Experts
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

        // 3. City Landing Pages & Region Hub Pages
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

    if (id === 1) {
        // First 30k published articles
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            take: 30000,
            select: {
                slug: true,
                updatedAt: true,
                expert: { select: { slug: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return articles.map((article) => ({
            url: `${baseUrl}/entreprise/${article.expert.slug}/articles/${article.slug}`,
            lastModified: article.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    }

    if (id === 2) {
        // Next 30k published articles (covers the remaining 26,266)
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            skip: 30000,
            take: 30000,
            select: {
                slug: true,
                updatedAt: true,
                expert: { select: { slug: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return articles.map((article) => ({
            url: `${baseUrl}/entreprise/${article.expert.slug}/articles/${article.slug}`,
            lastModified: article.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    }

    return [];
}
