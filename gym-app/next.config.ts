import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }, 

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',        
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',        
      },
    ],
  },

};

export default nextConfig;
