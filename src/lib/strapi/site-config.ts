import { strapiClient } from './client'
import type { SiteConfiguration, StrapiResponse } from '@/types/strapi'
import type { RealSiteConfiguration } from '@/types/strapi-real'
import { convertRealSiteToExpected } from '@/types/strapi-real'

export async function getSiteConfig(): Promise<SiteConfiguration | null> {
  try {
    console.log('🔍 Fetching site configuration for zweitmeinu-ng...')

    // Get site configuration for zweitmeinu-ng with proper population
    const response = await strapiClient.get<StrapiResponse<RealSiteConfiguration[]>>(
      '/site-configurations',
      {
        'populate': '*'
      }
    )

    console.log('📊 Site config API response:', response)

    // Debug: Log all fields of zweitmeinu-ng site
    const debugSite = response.data?.find((site: RealSiteConfiguration) =>
      site.siteIdentifier === 'zweitmeinu-ng'
    )
    if (debugSite) {
      console.log('🔍 Available fields in zweitmeinu-ng:', Object.keys(debugSite))
      if (debugSite.openingHours) {
        console.log('✅ openingHours found:', debugSite.openingHours)
      } else {
        console.log('❌ openingHours NOT found in site config')
      }
    }

    // Filter for zweitmeinu-ng specifically
    const realSiteConfig = response.data?.find((site: RealSiteConfiguration) =>
      site.siteIdentifier === 'zweitmeinu-ng'
    ) || null

    if (!realSiteConfig) {
      console.warn('⚠️ No site configuration found for zweitmeinu-ng')
      console.log('Available sites:', response.data?.map((site: RealSiteConfiguration) => site.siteIdentifier))
      console.log('🔄 Using fallback configuration')
      return getFallbackSiteConfig()
    }

    console.log('✅ Found site config:', realSiteConfig.siteName)

    // Convert real data structure to expected format
    const convertedSiteConfig = convertRealSiteToExpected(realSiteConfig) as SiteConfiguration

    console.log('🔄 Converted site config:', convertedSiteConfig)

    // Validate converted site configuration
    if (!validateSiteConfig(convertedSiteConfig)) {
      console.error('❌ Invalid site configuration data after conversion')
      console.log('🔄 Using fallback configuration')
      return getFallbackSiteConfig()
    }

    console.log('✅ Site configuration validated successfully')
    return convertedSiteConfig
  } catch (error) {
    console.error('💥 Failed to fetch site config:', error)

    // Return fallback configuration in case of error
    console.log('🔄 Using fallback configuration due to error')
    return getFallbackSiteConfig()
  }
}

export function validateSiteConfig(config: unknown): config is SiteConfiguration {
  if (!config || typeof config !== 'object') {
    console.error('❌ Site config is not an object:', config)
    return false
  }

  const configObj = config as Record<string, unknown>

  const hasId = typeof configObj.id === 'number'
  const hasAttributes = configObj.attributes && typeof configObj.attributes === 'object'

  if (!hasId || !hasAttributes) {
    console.error('❌ Site config missing id or attributes:', { hasId, hasAttributes })
    return false
  }

  const attributes = configObj.attributes as Record<string, unknown>
  const hasSiteIdentifier = attributes.siteIdentifier === 'zweitmeinu-ng'
  const hasSiteName = typeof attributes.siteName === 'string'

  if (!hasSiteIdentifier || !hasSiteName) {
    console.error('❌ Site config missing required attributes:', {
      hasSiteIdentifier,
      hasSiteName,
      siteIdentifier: attributes.siteIdentifier,
      siteName: attributes.siteName
    })
    return false
  }

  console.log('✅ Site config validation passed')
  return true
}

export function getFallbackSiteConfig(): SiteConfiguration {
  console.log('🔄 Creating fallback site configuration')

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
    console.log('📋 Using cached site config')
    return cachedSiteConfig
  }

  // Lade neue Konfiguration
  console.log('🔄 Loading fresh site config')
  const config = await getSiteConfig()

  if (config) {
    cachedSiteConfig = config
    cacheTimestamp = now
    console.log('💾 Site config cached successfully')
  }

  return config
}
