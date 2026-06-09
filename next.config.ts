import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
