import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "keyra-backend-803170070973.asia-south1.run.app",
      }
    ],
  },
  // Ensure Next.js can proxy requests to backend during dev
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://keyra-backend-803170070973.asia-south1.run.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
