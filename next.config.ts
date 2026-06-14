import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


  generateBuildId: async () => {
    // Force a unique build ID to prevent Vercel from serving stale cache
    return `build-${Date.now()}`;
  },

  async redirects() {
    return [
      {
        source: '/mot-de-passe-oublie',
        destination: '/auth/reset-password',
        permanent: true,
      },
      {
        source: '/reset-password',
        destination: '/auth/reset-password',
        permanent: true,
      },
      {
        source: '/entreprise/climatisation-pompe-a-chaleur-oison-plomberie-services-91-2366/articles/comprendre-le-prix-de-la-climatisation-gainable-a-la-ferte-saint-aubin-la-ferte-saint-aubin',
        destination: '/entreprise/climatisation-pompe-a-chaleur-oison-plomberie-services-91-2366/articles/comprendre-le-prix-de-la-climatisation-gainable-a-la-ferte-saint-aubin',
        permanent: true,
      },
      {
        source: '/entreprise/gainable-fr/articles/boostez-votre-chiffre-daffaires-avec-la-climatisation-gainable-a-lyon-lyon',
        destination: '/entreprise/gainable-fr/articles/boostez-votre-chiffre-daffaires-avec-la-climatisation-gainable-a-lyon',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // Sitemap index: /sitemap.xml → served by the sitemap-index API route
      {
        source: '/sitemap.xml',
        destination: '/sitemap-index',
      },
      // Sitemap parts: /sitemap/1.xml → served by the /sitemap/[id]/route.ts API route
      {
        source: '/sitemap/:id.xml',
        destination: '/sitemap/:id',
      },
      {
        source: '/trouver-installateur',
        destination: '/',
      },
      {
        source: '/trouver-diagnostiqueur',
        destination: '/?filter=diagnostiqueur',
      },
      {
        source: '/trouver-bureau-etude',
        destination: '/?filter=bureau_etude',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval' blob:; img-src 'self' data: https: blob:; media-src 'self' https: data: blob:;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
} as any;

export default nextConfig;
