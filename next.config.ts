import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['canvas', 'pdfjs-dist'],
  experimental: {
    serverActions: {
      bodySizeLimit: '55mb',
    },
    proxyClientMaxBodySize: '55mb',
  },
  async redirects() {
    return [
      {
        source: '/notice/:id',
        destination: '/notices/:id',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
