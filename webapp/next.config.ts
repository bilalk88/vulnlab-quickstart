import type { NextConfig } from "next";

// Read the API port from the environment so it can be changed in .env.local
// without touching this file. Defaults to 4100.
const LAB_API_PORT = process.env.LAB_API_PORT || '4100';

import os from "os";

function getLocalIPs() {
  const ips = ['127.0.0.1', 'localhost'];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4') ips.push(iface.address);
    }
  }
  return ips;
}

// @ts-ignore - allowedDevOrigins is relatively new in Next 15 and might lack TS definitions
const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalIPs(),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://127.0.0.1:${LAB_API_PORT}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
