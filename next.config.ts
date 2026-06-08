import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['api.dicebear.com'],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        https: false,
        http: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:fs': false,
        'node:path': false,
        'node:https': false,
        'node:http': false,
      };
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(node:fs|node:path|node:https|node:http|fs|path|https|http)$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
