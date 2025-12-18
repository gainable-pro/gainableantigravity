import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
    ]
  },
};

export default nextConfig;
