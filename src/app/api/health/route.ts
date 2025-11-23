/**
 * Health Check API Endpoint
 *
 * Healthcare platform health monitoring endpoint
 * Used for uptime monitoring and deployment verification
 *
 * @see docs/DEPLOYMENT-WORKFLOW.md
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  uptime: number
  memory: NodeJS.MemoryUsage
  strapi?: 'connected' | 'error' | 'unavailable'
  redis?: 'connected' | 'unavailable'
}

export async function GET() {
  const startTime = Date.now()

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }

  // Check Strapi CMS connection
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    if (strapiUrl) {
      // Test a real endpoint that exists in Strapi (e.g., /pages)
      const testEndpoint = `${strapiUrl}/pages?pagination[pageSize]=1`
      const strapiResponse = await fetch(testEndpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5s timeout
      })
      health.strapi = strapiResponse.ok ? 'connected' : 'error'
    } else {
      health.strapi = 'unavailable'
      health.status = 'degraded'
    }
  } catch (error) {
    health.strapi = 'unavailable'
    health.status = 'degraded'
    console.error('Strapi health check failed:', error)
  }

  // Check Redis connection (if configured)
  if (process.env.REDIS_URL) {
    try {
      // Redis health check would go here
      // For now, mark as unavailable if not implemented
      health.redis = 'unavailable'
    } catch {
      health.redis = 'unavailable'
    }
  }

  // Calculate response time
  const responseTime = Date.now() - startTime

  // Determine overall health status
  if (health.strapi === 'unavailable') {
    health.status = 'unhealthy'
  } else if (health.strapi === 'error') {
    health.status = 'degraded'
  }

  // Return appropriate HTTP status code
  const statusCode = health.status === 'healthy' ? 200 :
                     health.status === 'degraded' ? 200 : 503

  return NextResponse.json(
    {
      ...health,
      responseTime: `${responseTime}ms`,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      }
    }
  )
}
