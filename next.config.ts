import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_URL?.replace(/^https?:\/\//, '') || 's3.aws.com',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
