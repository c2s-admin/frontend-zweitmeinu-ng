/** @type {import('next').NextConfig} */
const { env } = require('./src/lib/env')

const STRAPI = new URL(env.NEXT_PUBLIC_STRAPI_URL)
const STRAPI_HOSTNAME = STRAPI.hostname
const STRAPI_PROTOCOL = STRAPI.protocol.replace(':', '')
const STRAPI_BASE_PATH = STRAPI.pathname
  .replace(/\/api$/, '')
  .replace(/\/$/, '')
const STRAPI_UPLOADS_SEGMENT = 'uploads'
const STRAPI_ORIGIN = STRAPI.origin

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' ${STRAPI_ORIGIN};
  font-src 'self';
  frame-ancestors 'none';
`

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
            value: 'no-referrer',
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
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
