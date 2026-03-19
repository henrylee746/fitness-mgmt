import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  //Allows forbidden and unauthorized pages to be displayed
  experimental: {
    authInterrupts: true,
  },
  //Fetch images from Googleusercontent.com (for OAuth users)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
