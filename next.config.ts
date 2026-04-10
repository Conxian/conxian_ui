import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL || process.env.CORE_API_URL || "https://api.mainnet.hiro.so",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
