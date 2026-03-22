import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  // Suppress node warnings in build
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
