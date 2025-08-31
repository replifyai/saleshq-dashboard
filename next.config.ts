import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* no custom webpack externals; bundle threejs-toys normally */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
