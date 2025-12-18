import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/mot-de-passe-oublie',
        destination: '/reset-password',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
