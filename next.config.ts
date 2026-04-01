import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL || process.env.CORE_API_URL || "https://api.testnet.hiro.so",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
