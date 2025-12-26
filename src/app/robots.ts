import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gainable.fr';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard',
                '/api',
                '/admin',
                // prevent indexing of search filters if not essential SEO pages, 
                // though user asked for City pages to be indexable, so we generally allow search.
                // We rely on canonicals for duplication handling.
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
