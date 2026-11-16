import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gainable.fr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/_next/static/',
                    '/_next/image',
                ],
                disallow: [
                    '/dashboard',
                    '/api',
                    '/admin',
                    '/_next/data/',
                    '/*?dpl=*',
                    '/*?*',
                ],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'Claude-SearchBot',
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
