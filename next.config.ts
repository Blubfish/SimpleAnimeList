import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
    ],
    minimumCacheTTL: 2678400,
    formats: ["image/webp"],
    imageSizes: [70, 99, 120, 230],
    deviceSizes: [400, 768, 1024],
  },
};

export default nextConfig;
