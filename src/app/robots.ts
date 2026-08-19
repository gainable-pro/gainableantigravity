import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gainable.fr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard',
                    '/api',
                    '/admin',
                    '/_next/',
                    '/*?dpl=*',
                    '/*?*',
                ],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
            },
            {
                userAgent: 'Bytespider',
                disallow: '/',
            },
            {
                userAgent: 'CCBot',
                disallow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
