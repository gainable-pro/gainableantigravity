import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.gainable.fr';

    // 1. Static Routes
    const routes = [
        '',
        '/trouver-installateur',
        '/inscription',
        '/faq-visibilite-referencement',
        '/labels', // If exists
        '/bureau-etude', // If exists
        '/diagnostic-immobilier', // If exists
        // Add other critical static marketing pages
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Experts
    const experts = await prisma.expert.findMany({
        where: { status: 'active' }, // Only active
        select: { slug: true, created_at: true }
    });

    const expertRoutes = experts.map((expert) => ({
        url: `${baseUrl}/pro/${expert.slug}`,
        lastModified: expert.created_at, // or updated_at if you have it
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Articles
    const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: {
            slug: true,
            updatedAt: true,
            expert: { select: { slug: true } }
        }
    });

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/entreprise/${article.expert.slug}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...expertRoutes, ...articleRoutes];
}
