import { strapiClient } from './client'
import { logger } from '@/lib/logger'

export interface LegalPage {
  id: number
  documentId: string
  type: 'impressum' | 'datenschutz' | 'agb' | 'cookie-policy' | 'other'
  content: string

  // iframe/embed Integration
  embedType?: 'iframe' | 'javascript' | 'static'
  embedUrl?: string | null
  provider?: string | null
  siteIdentifier?: string | null
  isActive?: boolean

  // Metadata
  title?: string
  description?: string
  slug?: string

  // Existing fields
  country: string
  language: string
  validFrom: string | null
  validUntil: string | null
  version: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface LegalPageResponse {
  data: LegalPage[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

/**
 * Get legal page by type (impressum, datenschutz, agb, etc.)
 */
export async function getLegalPage(type: LegalPage['type']): Promise<LegalPage | null> {
  try {
    logger.info(`Fetching legal page: ${type}`)

    // Use direct fetch to avoid URLSearchParams encoding issues with Strapi filters
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'
    const url = `${baseUrl}/legal-pages?filters[type][$eq]=${type}&sort=createdAt:desc`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['legal-pages'],
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json() as LegalPageResponse

    if (!data.data || data.data.length === 0) {
      logger.warn(`No legal page found for type: ${type}`)
      return null
    }

    const legalPage = data.data[0]
    logger.info(`Legal page loaded: ${type} (v${legalPage.version})`)

    return legalPage
  } catch (error) {
    logger.error({ err: error }, `Failed to fetch legal page: ${type}`)
    return null
  }
}

/**
 * Get all legal pages
 */
export async function getAllLegalPages(): Promise<LegalPage[]> {
  try {
    logger.info('Fetching all legal pages')

    const response = await strapiClient.get<LegalPageResponse>(
      '/legal-pages',
      {
        'filters[isActive][$eq]': true,
        'sort': 'type:asc'
      }
    )

    if (!response.data) {
      logger.warn('No legal pages found')
      return []
    }

    logger.info(`Loaded ${response.data.length} legal pages`)
    return response.data
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch legal pages')
    return []
  }
}

/**
 * Parse markdown content from legal page
 */
export function parseLegalPageContent(content: string): {
  title: string
  sections: { heading: string; content: string }[]
} {
  const lines = content.split('\n')
  const sections: { heading: string; content: string }[] = []
  let currentSection: { heading: string; content: string } | null = null
  let title = ''

  for (const line of lines) {
    // H1 is the main title
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim()
      continue
    }

    // H2/H3 are section headings
    if (line.startsWith('### ') || line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        heading: line.replace(/^#{2,3}\s/, '').trim(),
        content: ''
      }
      continue
    }

    // Add content to current section
    if (currentSection) {
      currentSection.content += line + '\n'
    }
  }

  // Add the last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return { title, sections }
}
