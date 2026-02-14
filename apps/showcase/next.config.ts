import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@seedgrid/fe-components", "@seedgrid/fe-theme"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.src$/,
      type: "asset/source"
    });
    return config;
  }
};

export default nextConfig;
