import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
