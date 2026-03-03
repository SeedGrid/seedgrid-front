const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@seedgrid/fe-components", "@seedgrid/fe-theme"],
  webpack(config: { plugins?: Array<{ constructor?: { name?: string } }> }, { dev }: { dev: boolean }) {
    if (dev) {
      if (Array.isArray(config.plugins)) {
        config.plugins = config.plugins.filter((plugin) => plugin?.constructor?.name !== "EvalSourceMapDevToolPlugin");
      }
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.svg"
      }
    ];
  }
};

export default nextConfig;
