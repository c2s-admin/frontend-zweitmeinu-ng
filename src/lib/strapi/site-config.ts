import { strapiClient } from './client'
import type { SiteConfiguration, StrapiResponse } from '@/types/strapi'
import type { RealSiteConfiguration } from '@/types/strapi-real'
import { convertRealSiteToExpected } from '@/types/strapi-real'
import { logger } from '@/lib/logger'

export async function getSiteConfig(): Promise<SiteConfiguration | null> {
  try {
    logger.info('Fetching site configuration for zweitmeinu-ng...')

    // Get site configuration for zweitmeinu-ng with proper population
    const response = await strapiClient.get<StrapiResponse<RealSiteConfiguration[]>>(
      '/site-configurations',
      {
        'populate': '*'
      }
    )

    logger.info('Site config API response:', response)

    // Debug: Log all fields of zweitmeinu-ng site
    const debugSite = response.data?.find((site: RealSiteConfiguration) =>
      site.siteIdentifier === 'zweitmeinu-ng'
    )
    if (debugSite) {
      logger.info('Available fields in zweitmeinu-ng:', Object.keys(debugSite))
      if (debugSite.openingHours) {
        logger.info('openingHours found:', debugSite.openingHours)
      } else {
        logger.warn('openingHours NOT found in site config')
      }
    }

    // Filter for zweitmeinu-ng specifically
    const realSiteConfig = response.data?.find((site: RealSiteConfiguration) =>
      site.siteIdentifier === 'zweitmeinu-ng'
    ) || null

    if (!realSiteConfig) {
      logger.warn('No site configuration found for zweitmeinu-ng')
      logger.info('Available sites:', response.data?.map((site: RealSiteConfiguration) => site.siteIdentifier))
      logger.warn('Using fallback configuration')
      return getFallbackSiteConfig()
    }

    logger.info('Found site config:', realSiteConfig.siteName)

    // Convert real data structure to expected format
    const convertedSiteConfig = convertRealSiteToExpected(realSiteConfig) as SiteConfiguration

    logger.info('Converted site config:', convertedSiteConfig)

    // Validate converted site configuration
    if (!validateSiteConfig(convertedSiteConfig)) {
      logger.error('Invalid site configuration data after conversion')
      logger.warn('Using fallback configuration')
      return getFallbackSiteConfig()
    }

    logger.info('Site configuration validated successfully')
    return convertedSiteConfig
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch site config')

    // Return fallback configuration in case of error
    logger.warn('Using fallback configuration due to error')
    return getFallbackSiteConfig()
  }
}

export function validateSiteConfig(config: unknown): config is SiteConfiguration {
  if (!config || typeof config !== 'object') {
    logger.error('Site config is not an object:', config)
    return false
  }

  const configObj = config as Record<string, unknown>

  const hasId = typeof configObj.id === 'number'
  const hasAttributes = configObj.attributes && typeof configObj.attributes === 'object'

  if (!hasId || !hasAttributes) {
    logger.error('Site config missing id or attributes:', { hasId, hasAttributes })
    return false
  }

  const attributes = configObj.attributes as Record<string, unknown>
  const hasSiteIdentifier = attributes.siteIdentifier === 'zweitmeinu-ng'
  const hasSiteName = typeof attributes.siteName === 'string'

  if (!hasSiteIdentifier || !hasSiteName) {
    logger.error('Site config missing required attributes:', {
      hasSiteIdentifier,
      hasSiteName,
      siteIdentifier: attributes.siteIdentifier,
      siteName: attributes.siteName
    })
    return false
  }

  logger.info('Site config validation passed')
  return true
}

export function getFallbackSiteConfig(): SiteConfiguration {
  logger.info('Creating fallback site configuration')

  return {
    id: 11,
    attributes: {
      siteIdentifier: 'zweitmeinu-ng',
      domain: 'zweitmein.ng',
      siteName: 'Zweitmeinung.ng',
      brand: 'portal',
      navigation: {
        main: [
          { id: 1, label: 'Home', href: '/' },
          { id: 2, label: 'Zweitmeinung', href: '/zweitmeinung' },
          { id: 3, label: 'Fachbereiche', href: '/fachbereiche' },
          { id: 4, label: 'Motivation', href: '/motivation' },
          { id: 5, label: 'Über uns', href: '/ueber-uns' },
          { id: 6, label: 'Kontakt', href: '/kontakt' },
        ],
        footer: [
          {
            id: 1,
            title: 'Services',
            links: [
              { id: 1, label: 'Medizinische Zweitmeinung', href: '/zweitmeinung' },
              { id: 2, label: 'Online Beratung', href: '/beratung' },
              { id: 3, label: 'Healthcare AI', href: '/ai-solutions' },
            ]
          },
          {
            id: 2,
            title: 'Rechtliches',
            links: [
              { id: 1, label: 'Impressum', href: '/impressum' },
              { id: 2, label: 'Datenschutz', href: '/datenschutz' },
              { id: 3, label: 'AGB', href: '/agb' },
            ]
          }
        ]
      },
      contact: {
        id: 1,
        email: 'info@zweitmein.ng',
        phone: '+49 176 47870680',
        emergencyPhone: '+49 176 47870680',
        address: 'Healthcare Innovation Center, Deutschland'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }
  }
}

// Cache für Site Configuration
let cachedSiteConfig: SiteConfiguration | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 Minuten

export async function getCachedSiteConfig(): Promise<SiteConfiguration | null> {
  const now = Date.now()

  // Prüfe ob Cache noch gültig ist
  if (cachedSiteConfig && (now - cacheTimestamp) < CACHE_DURATION) {
    logger.info('Using cached site config')
    return cachedSiteConfig
  }

  // Lade neue Konfiguration
  logger.info('Loading fresh site config')
  const config = await getSiteConfig()

  if (config) {
    cachedSiteConfig = config
    cacheTimestamp = now
    logger.info('Site config cached successfully')
  }

  return config
}
