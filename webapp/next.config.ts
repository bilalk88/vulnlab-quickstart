import type { NextConfig } from "next";
import os from "os";
import path from "path";

// Read the API port from the environment so it can be changed in .env.local
const LAB_API_PORT = process.env.LAB_API_PORT || '4100';

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

const nextConfig: NextConfig = {
  // Pin the tracing/output root to webapp/ so Turbopack resolves
  // node_modules from here instead of the repo root.
  outputFileTracingRoot: path.join(__dirname),

  // @ts-ignore
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
