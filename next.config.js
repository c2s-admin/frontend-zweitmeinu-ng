/** @type {import('next').NextConfig} */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''
const STRAPI = STRAPI_URL ? new URL(STRAPI_URL) : null
const STRAPI_HOSTNAME = STRAPI?.hostname || ''
const STRAPI_PROTOCOL = STRAPI?.protocol.replace(':', '') || 'https'
const STRAPI_BASE_PATH = STRAPI
  ? STRAPI.pathname.replace(/\/api$/, '').replace(/\/$/, '')
  : ''
const STRAPI_UPLOADS_SEGMENT = 'uploads'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: STRAPI_PROTOCOL,
        hostname: STRAPI_HOSTNAME,
        port: '',
        pathname: `${STRAPI_BASE_PATH}/${STRAPI_UPLOADS_SEGMENT}/**`,
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: {
      beasties: true,
    },
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
