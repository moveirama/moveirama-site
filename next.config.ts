import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artely.com.br',
        pathname: '/site/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ewsmfvisypgxbeqtbmec.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};
export default nextConfig;
