import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getPageMetadata } from '@/lib/strapi/pages'
import { renderSection, debugSectionTypes } from '@/components/sections'
import type { Page, DynamicZoneSection } from '@/types/strapi'

type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageData = await getPageBySlug('motivation')

    if (!pageData) {
      return {
        title: 'Motivation',
        description: 'Warum wir uns für Ihre Gesundheit einsetzen',
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
        canonical: metadata.canonical || '/motivation',
      },
      robots: {
        index: !metadata.noindex,
        follow: !metadata.nofollow,
      },
    }
  } catch (error) {
    console.error('💥 Error generating motivation metadata:', error)
    return {
      title: 'Motivation',
      description: 'Warum wir uns für Ihre Gesundheit einsetzen',
    }
  }
}

export default async function MotivationPage() {
  let pageData: Page | null = null

  try {
    pageData = await getPageBySlug('motivation')
  } catch (error) {
    console.error('💥 Error loading motivation page:', error)
  }

  if (!pageData) {
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
        console.warn('Skipping invalid section in motivation page:', section)
      }

      return isValid
    }) || []

  return <>{sections.map((section, index) => renderSection(section, index))}</>
}

