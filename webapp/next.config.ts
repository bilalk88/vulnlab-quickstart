import type { NextConfig } from "next";

// Read the API port from the environment so it can be changed in .env.local
// without touching this file. Defaults to 4100.
const LAB_API_PORT = process.env.LAB_API_PORT || '4100';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${LAB_API_PORT}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
