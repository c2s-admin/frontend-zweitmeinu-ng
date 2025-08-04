/** @type {import('next').NextConfig} */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''
const STRAPI_HOSTNAME = STRAPI_URL ? new URL(STRAPI_URL).hostname : ''

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: STRAPI_HOSTNAME,
        port: '',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Optimize bundling
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Output configuration for static deployment
  // output: 'export',  // Uncomment for static export
  // distDir: 'out',     // Uncomment for static export
};

module.exports = nextConfig
