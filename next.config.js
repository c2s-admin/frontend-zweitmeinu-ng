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
  script-src 'self' ${process.env.NODE_ENV === 'development' ? "'unsafe-inline' 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' ${STRAPI_ORIGIN} ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''};
  font-src 'self' https://fonts.gstatic.com;
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
  
  // Performance optimization for healthcare mobile users
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Healthcare-specific optimizations
    if (!dev && !isServer) {
      // Split healthcare components into optimized chunks
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          
          // Emergency components - highest priority, separate chunk
          emergency: {
            name: 'emergency',
            test: /[\\/]stories[\\/](Emergency|HealthcareModal)/,
            chunks: 'all',
            priority: 50,
            enforce: true
          },
          
          // Core healthcare components
          healthcareCore: {
            name: 'healthcare-core',
            test: /[\\/]stories[\\/](Healthcare|Button|Card|Input)/,
            chunks: 'all',
            priority: 40,
            minChunks: 1,
            maxSize: 100000 // 100KB max for mobile
          },
          
          // Medical consultation components
          consultation: {
            name: 'consultation',
            test: /[\\/]stories[\\/](Consultation|Doctor|Specialty|MedicalFAQ)/,
            chunks: 'all',
            priority: 30,
            maxSize: 150000 // 150KB max
          },
          
          // Content sections
          content: {
            name: 'content',
            test: /[\\/]stories[\\/](Motivation|Story|CoreValues)/,
            chunks: 'all',
            priority: 20,
            maxSize: 200000 // 200KB max
          },
          
          // Utilities and forms
          utils: {
            name: 'utils',
            test: /[\\/]stories[\\/](FileUpload|DatePicker|Progress)/,
            chunks: 'all',
            priority: 10,
            maxSize: 100000
          }
        }
      }
      
      // Optimize for mobile healthcare users
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Tree shake unused icons (important for healthcare mobile performance)
      config.resolve.alias = {
        ...config.resolve.alias,
        'lucide-react': 'lucide-react/dist/esm/icons'
      }
    }
    
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
