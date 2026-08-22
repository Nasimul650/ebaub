import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/notice/:id',
        destination: '/notices/:id',
        permanent: true,
      },
      {
        source: '/admin/notice/:id',
        destination: '/admin/notices/:id/edit',
        permanent: true,
      },
      {
        source: '/admin/news/:id',
        destination: '/admin/news/:id/edit',
        permanent: true,
      },
      {
        source: '/admin/notices/:id',
        destination: '/admin/notices/:id/edit',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
