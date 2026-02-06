import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Empty turbopack config to acknowledge we're using Turbopack
  turbopack: {},
};

export default nextConfig;
