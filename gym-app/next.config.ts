import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/gym-app-profile-pics/**', // Especifica el bucket y subrutas
      },
    ],
  },

};

export default nextConfig;
