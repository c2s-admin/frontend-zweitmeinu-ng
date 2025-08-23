import { strapiClient } from './client'
import type { Page, StrapiResponse } from '@/types/strapi'
import type { RealPage } from '@/types/strapi-real'
import { convertRealPageToExpected } from '@/types/strapi-real'
import { logger } from '@/lib/logger'

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    logger.info(`Fetching page with slug: ${slug}`)

    // Define comprehensive populate parameters for all section types based on real data
    const populateParams = strapiClient.buildPopulateParams([
      'sections',
      'sections.slides',
      'sections.slides.titleLines',
      'sections.slides.ctaButtons',
      'sections.slides.backgroundImage',
      'sections.slides.badge',
      'sections.image', // Added for StorySection images
      'sections.values', // Added for Core Values
      'sections.values.id',
      'sections.values.title',
      'sections.values.description',
      'sections.values.icon',
      'sections.values.color',
      // Mission Statement fields (corrected structure)
      'sections.quote',
      'sections.attribution',
      'sections.icon',
      'sections.backgroundColor',
      'seo'
    ])

    // Get page with the specific slug (no site filtering needed based on exploration)
    const filterParams = {
      'filters[slug][$eq]': slug
    }

    const response = await strapiClient.get<StrapiResponse<RealPage[]>>(
      '/pages',
      {
        ...populateParams,
        ...filterParams
      }
    )

    logger.info('API Response:', response)

    const realPage = response.data?.[0] || null

    if (!realPage) {
      logger.warn(`Page with slug "${slug}" not found`)
      return null
    }

    logger.info(`Found page: ${realPage.title}`)
    logger.info(`Sections found: ${realPage.sections?.length || 0}`)

    // Convert real data structure to expected format
    const convertedPage = convertRealPageToExpected(realPage)

    logger.info('Converted page:', convertedPage)

    // Validate page data
    if (!validatePageData(convertedPage)) {
      logger.error('Invalid page data structure after conversion')
      return null
    }

    return convertedPage
  } catch (error) {
    logger.error({ err: error }, `Failed to fetch page with slug "${slug}"`)
    return null
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    const populateParams = strapiClient.buildPopulateParams([
      'seo'
    ])

    const response = await strapiClient.get<StrapiResponse<RealPage[]>>(
      '/pages',
      {
        ...populateParams,
        'pagination[pageSize]': '100'
      }
    )

    // Convert real pages to expected format
    const convertedPages = (response.data || []).map(realPage => convertRealPageToExpected(realPage)) as Page[]

    return convertedPages
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch all pages')
    return []
  }
}

export async function getPageSlugs(): Promise<string[]> {
  try {
    const response = await strapiClient.get<StrapiResponse<RealPage[]>>(
      '/pages',
      {
        'fields[0]': 'slug',
        'pagination[pageSize]': '100'
      }
    )

    return response.data?.map(page => page.slug) || []
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch page slugs')
    return []
  }
}

export function validatePageData(page: unknown): page is Page {
  if (!page || typeof page !== 'object') {
    logger.error('Page validation failed:', { page })
    return false
  }

  const p = page as {
    id?: unknown
    attributes?: {
      slug?: unknown
      title?: unknown
      sections?: unknown
    }
  }

  const isValid =
    typeof p.id === 'number' &&
    typeof p.attributes?.slug === 'string' &&
    typeof p.attributes?.title === 'string' &&
    Array.isArray(p.attributes?.sections)

  if (!isValid) {
    logger.error('Page validation failed:', {
      hasId: typeof p.id === 'number',
      hasSlug: typeof p.attributes?.slug === 'string',
      hasTitle: typeof p.attributes?.title === 'string',
      hasSections: Array.isArray(p.attributes?.sections),
      pageStructure: page
    })
  }

  return isValid
}

// Helper function to get structured page metadata
export function getPageMetadata(page: Page) {
  const { title, description, seo } = page.attributes

  return {
    title: seo?.metaTitle || title,
    description: seo?.metaDescription || description,
    keywords: seo?.keywords,
    ogTitle: seo?.ogTitle || seo?.metaTitle || title,
    ogDescription: seo?.ogDescription || seo?.metaDescription || description,
    ogImage: seo?.ogImage?.data?.attributes?.url,
    canonical: seo?.canonical,
    noindex: seo?.noindex || false,
    nofollow: seo?.nofollow || false,
    twitterCard: seo?.twitterCard || 'summary_large_image'
  }
}

// Helper function to get sections by component type
export function getSectionsByType<T>(page: Page, componentType: string): T[] {
  return page.attributes.sections
    .filter(section => section.__component === componentType) as T[]
}

// Helper function to find first section of a specific type
export function getFirstSectionByType<T>(page: Page, componentType: string): T | null {
  const sections = getSectionsByType<T>(page, componentType)
  return sections[0] || null
}
