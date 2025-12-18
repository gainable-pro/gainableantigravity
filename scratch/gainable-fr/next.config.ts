import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  generateBuildId: async () => {
    // Force a unique build ID to prevent Vercel from serving stale cache
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
