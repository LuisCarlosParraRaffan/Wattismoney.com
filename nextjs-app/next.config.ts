import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds to avoid route group conflicts
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
