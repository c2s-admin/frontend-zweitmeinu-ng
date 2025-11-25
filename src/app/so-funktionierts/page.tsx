import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getPageMetadata } from '@/lib/strapi/pages'
import { renderSection, debugSectionTypes } from '@/components/sections'
import type { Page, DynamicZoneSection } from '@/types/strapi'
import { logger } from '@/lib/logger'

type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageData = await getPageBySlug('so-funktionierts')

    if (!pageData) {
      return {
        title: 'So funktioniert\'s | Zweitmeinung.ng',
        description: 'Erfahren Sie, wie unser Zweitmeinungsservice funktioniert - Schritt für Schritt erklärt.',
      }
    }

    const metadata = getPageMetadata(pageData)

    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      openGraph: {
        title: metadata.ogTitle,
        description: metadata.ogDescription,
        images: metadata.ogImage ? [metadata.ogImage] : undefined,
      },
      twitter: {
        card: metadata.twitterCard as TwitterCardType,
        title: metadata.ogTitle,
        description: metadata.ogDescription,
        images: metadata.ogImage ? [metadata.ogImage] : undefined,
      },
      alternates: {
        canonical: metadata.canonical || '/so-funktionierts',
      },
      robots: {
        index: !metadata.noindex,
        follow: !metadata.nofollow,
      },
    }
  } catch (error) {
    logger.error({ err: error }, 'Error generating so-funktionierts metadata')
    return {
      title: 'So funktioniert\'s | Zweitmeinung.ng',
      description: 'Erfahren Sie, wie unser Zweitmeinungsservice funktioniert - Schritt für Schritt erklärt.',
    }
  }
}

export default async function SoFunktioniertPage() {
  let pageData: Page | null = null

  try {
    pageData = await getPageBySlug('so-funktionierts')
  } catch (error) {
    logger.error({ err: error }, 'Error loading so-funktionierts page')
  }

  if (!pageData) {
    logger.warn('So funktioniert\'s page not found in Strapi')
    notFound()
  }

  if (process.env.NODE_ENV === 'development' && pageData.attributes.sections) {
    debugSectionTypes(pageData.attributes.sections)
  }

  const sections: DynamicZoneSection[] =
    pageData.attributes.sections?.filter((section): section is DynamicZoneSection => {
      const isValid =
        section !== null &&
        typeof section === 'object' &&
        typeof section.__component === 'string' &&
        typeof section.id === 'number' &&
        section.id > 0

      if (!isValid) {
        logger.warn('Skipping invalid section in so-funktionierts page:', section)
      }

      return isValid
    }) || []

  logger.info(`Rendering so-funktionierts page with ${sections.length} sections`)

  return <>{sections.map((section, index) => renderSection(section, index))}</>
}
