import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add image domain configuration
  images: {
    domains: ['127.0.0.1', 'localhost','srv797689.hstgr.cloud',]
  },
  
  // Existing webpack configuration
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Laravel API
      },
    ];
  },
};

export default nextConfig;
