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
  script-src 'self' https://js.hcaptcha.com https://hcaptcha.com ${process.env.NODE_ENV === 'development' ? "'unsafe-inline' 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hcaptcha.com;
  img-src 'self' data: https:;
  connect-src 'self' ${STRAPI_ORIGIN} https://hcaptcha.com https://*.hcaptcha.com ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''};
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://app.alfright.eu https://hcaptcha.com https://*.hcaptcha.com;
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
  // Healthcare-optimized bundling
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enforce strict builds: fail on TS/ESLint errors
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Performance optimization hook (kept minimal; rely on Next defaults)
  webpack: (config, { dev, isServer, webpack }) => {
    // Optional: enable experimental chunking only when explicitly requested
    if (!dev && !isServer && process.env.HEALTHCARE_CHUNKING === 'true') {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          emergency: {
            name: 'emergency',
            test: /[\\/]components[\\/].*(Emergency|Modal)/,
            chunks: 'all',
            priority: 30,
          },
        }
      }
    }
    // Keep defaults; Next handles tree-shaking and chunking well
    
    // Bundle analyzer for healthcare performance monitoring
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'healthcare-bundle-report.html',
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: 'healthcare-stats.json'
        })
      )
    }
    
    return config
  },
  
  // Output configuration for static deployment
  // output: 'export',  // Uncomment for static export
  // distDir: 'out',     // Uncomment for static export
};

module.exports = nextConfig
