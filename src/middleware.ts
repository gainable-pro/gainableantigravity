
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * STRATEGY:
 * 1. Return 410 Gone for deleted legacy Wix resources (Tags, Posts, Guides).
 * 2. Return 301 Redirect for high-value legacy city URLs to the new structure.
 */

const LEGACY_410_PATHS = [
    '/pros',
    '/mentions-légales',
];

const LEGACY_410_PREFIXES = [
    '/post/',
    '/blog/tags/',
    '/_api/',
    '/ville/',
    '/installation-climatisation-',
];

// Specific legacy root city URLs that must be 410
const LEGACY_CITY_ROOTS = new Set([
    'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille',
    'frejus' // explicitely mentioned in screenshot
]);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle exact 410 paths
    if (LEGACY_410_PATHS.includes(pathname)) {
        return new NextResponse(null, { status: 410, statusText: 'Gone' });
    }

    // Handle 410 prefixes
    if (LEGACY_410_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
        return new NextResponse(null, { status: 410, statusText: 'Gone' });
    }

    // Handle root-level legacy city slugs as 410
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length === 1) {
        const slug = pathParts[0].toLowerCase();
        if (LEGACY_CITY_ROOTS.has(slug)) {
            return new NextResponse(null, { status: 410, statusText: 'Gone' });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
