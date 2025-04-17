import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add image domain configuration
  images: {
    domains: ['localhost'], // Allow localhost to load images
  },
  
  // Existing webpack configuration
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
