import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:4100/api/:path*`, // Proxy to Lab API
      },
    ];
  },
};

export default nextConfig;
