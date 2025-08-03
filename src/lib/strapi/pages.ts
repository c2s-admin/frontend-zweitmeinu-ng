import { strapiClient } from './client'
import type { Page, StrapiResponse } from '@/types/strapi'
import type { RealPage } from '@/types/strapi-real'
import { convertRealPageToExpected } from '@/types/strapi-real'

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    console.log(`🔍 Fetching page with slug: ${slug}`)

    // Define comprehensive populate parameters for all section types based on real data
    const populateParams = strapiClient.buildPopulateParams([
      'sections',
      'sections.slides',
      'sections.slides.titleLines',
      'sections.slides.ctaButtons',
      'sections.slides.backgroundImage',
      'sections.slides.badge',
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

    console.log(`📊 API Response:`, response)

    const realPage = response.data?.[0] || null

    if (!realPage) {
      console.warn(`⚠️ Page with slug "${slug}" not found`)
      return null
    }

    console.log(`✅ Found page:`, realPage.title)
    console.log(`📦 Sections found:`, realPage.sections?.length || 0)

    // Convert real data structure to expected format
    const convertedPage = convertRealPageToExpected(realPage)

    console.log(`🔄 Converted page:`, convertedPage)

    // Validate page data
    if (!validatePageData(convertedPage)) {
      console.error('❌ Invalid page data structure after conversion')
      return null
    }

    return convertedPage
  } catch (error) {
    console.error(`💥 Failed to fetch page with slug "${slug}":`, error)
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
    console.error('Failed to fetch all pages:', error)
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
    console.error('Failed to fetch page slugs:', error)
    return []
  }
}

export function validatePageData(page: any): page is Page {
  const isValid = page?.id &&
                  page?.attributes?.slug &&
                  page?.attributes?.title &&
                  Array.isArray(page?.attributes?.sections)

  if (!isValid) {
    console.error('❌ Page validation failed:', {
      hasId: !!page?.id,
      hasSlug: !!page?.attributes?.slug,
      hasTitle: !!page?.attributes?.title,
      hasSections: Array.isArray(page?.attributes?.sections),
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
