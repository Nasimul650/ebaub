import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/notice/:id',
        destination: '/notices/:id',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
