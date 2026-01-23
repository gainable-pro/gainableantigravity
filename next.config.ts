import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
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
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
} as any;

export default nextConfig;
