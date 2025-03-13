import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'swu3azlmiqum7w5g.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
