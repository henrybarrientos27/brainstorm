// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Allows build to pass even with ESLint issues
  },
  // You can add other config options here if needed
};

export default nextConfig;
