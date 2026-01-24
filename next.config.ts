import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ewsmfvisypgxbeqtbmec.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/onde-entregamos',
        destination: '/entrega-moveis-curitiba-rmc',
        permanent: true,
      },
      {
        source: '/frete-curitiba',
        destination: '/entrega-moveis-curitiba-rmc',
        permanent: true,
      },
      {
        source: '/regioes-de-entrega',
        destination: '/entrega-moveis-curitiba-rmc',
        permanent: true,
      },
      {
        source: '/entrega',
        destination: '/entrega-moveis-curitiba-rmc',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;