import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Enable experimental features if needed
  experimental: {},
};

// Enable server actions if needed
if (process.env.ENABLE_SERVER_ACTIONS === 'true') {
  // @ts-expect-error - serverActions is not in the type definition yet
  nextConfig.experimental.serverActions = true;
}

export default nextConfig;
