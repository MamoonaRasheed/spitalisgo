import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add image domain configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
  },
  
  // Existing webpack configuration
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Ignore ESLint warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
