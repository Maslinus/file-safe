import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "adventurous-caiman-790.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
