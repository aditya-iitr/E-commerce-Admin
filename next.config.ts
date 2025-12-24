import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 ADD THIS IMAGE CONFIGURATION
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all paths from Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // If you use placeholders
      },
    ],
  },
  
  // Keep your existing compiler config
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;