import dynamic from 'next/dynamic'
import type { DynamicZoneSection, HeroSection, MedicalSpecialtiesGrid, TextBlock, ServicesGrid, TestimonialsSection, NewsSection, FAQSection, ContactForm, StatsSection, TeamSection, CTASection, MotivationHeroSection, StorySection, CoreValuesSection, MissionStatementSection } from '@/types/strapi'
import type { RealHeroCarousel } from '@/types/strapi-real'
import type { SectionComponentType, SectionComponents } from '@/types/sections'
import { logger } from '@/lib/logger'

// Loading components for better performance
const LoadingHero = () => (
  <div className="h-screen bg-healthcare-background animate-pulse flex items-center justify-center">
    <div className="text-healthcare-primary">Loading...</div>
  </div>
)

const LoadingSection = () => (
  <div className="h-96 bg-healthcare-background animate-pulse flex items-center justify-center">
    <div className="text-healthcare-primary">Loading...</div>
  </div>
)

const LoadingSmall = () => (
  <div className="h-48 bg-healthcare-background animate-pulse flex items-center justify-center">
    <div className="text-healthcare-primary">Loading...</div>
  </div>
)

// Simplified dynamic loading
export const sectionComponents = {
  'sections.hero': dynamic<HeroSection>(() => import('./HeroSection'), {
    loading: LoadingHero
  }),
  'sections.hero-carousel': dynamic<RealHeroCarousel>(() => import('./HeroCarousel'), {
    loading: LoadingHero
  }),
  'sections.medical-specialties-grid': dynamic<MedicalSpecialtiesGrid>(() => import('./MedicalSpecialtiesGrid'), {
    loading: LoadingSection
  }),
  'sections.text-block': dynamic<TextBlock>(() => import('./TextBlock'), {
    loading: LoadingSmall
  }),
  'sections.services-grid': dynamic<ServicesGrid>(() => import('./ServicesGrid'), {
    loading: LoadingSection
  }),
  'sections.testimonials': dynamic<TestimonialsSection>(() => import('./Testimonials'), {
    loading: LoadingSection
  }),
  'sections.news': dynamic<NewsSection>(() => import('./NewsSection'), {
    loading: LoadingSection
  }),
  'sections.faq': dynamic<FAQSection>(() => import('./FAQSection'), {
    loading: LoadingSection
  }),
  'sections.contact-form': dynamic<ContactForm>(() => import('./ContactForm'), {
    loading: LoadingSection
  }),
  'sections.stats': dynamic<StatsSection>(() => import('./StatsSection'), {
    loading: LoadingSection
  }),
  'sections.team': dynamic<TeamSection>(() => import('./TeamSection'), {
    loading: LoadingSection
  }),
  'sections.cta': dynamic<CTASection>(() => import('./CTASection'), {
    loading: LoadingSmall
  }),
  // Motivation Page Specific Components
  'sections.hero-section': dynamic<MotivationHeroSection>(() => import('./MotivationHero'), {
    loading: LoadingHero
  }),
  'sections.story-section': dynamic<StorySection>(() => import('./StorySection'), {
    loading: LoadingSection
  }),
  'sections.core-values': dynamic<CoreValuesSection>(() => import('./CoreValues'), {
    loading: LoadingSection
  }),
  'sections.mission-statement': dynamic<MissionStatementSection>(() => import('./MissionStatement'), {
    loading: LoadingSection
  }),
} as unknown as SectionComponents

export function renderSection(section: DynamicZoneSection, index?: number) {
  // Validate section data
    if (!isValidSection(section)) {
      logger.warn(`Invalid section data:`, section)
      return null
    }

  const Component = sectionComponents[section.__component as SectionComponentType]

    if (!Component) {
      logger.warn(`Unknown section component: ${section.__component}`)

    // Fallback component für unbekannte Sections
    return (
      <div key={`fallback-${section.id}-${index || 0}`} className="section-padding bg-red-50 border border-red-200">
        <div className="container-custom text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Unbekannte Section
          </h3>
          <p className="text-red-500">
            Component "{section.__component}" ist nicht implementiert.
          </p>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-red-600 font-medium">
              Debug Information
            </summary>
            <pre className="mt-2 p-4 bg-red-100 rounded text-sm overflow-auto">
              {JSON.stringify(section, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  // Create a unique, stable key
  const uniqueKey = `section-${section.__component}-${section.id}-${index || 0}`

  try {
    // Simple component rendering with type assertion
    return (
      <div key={uniqueKey}>
        <Component {...(section as unknown as Record<string, unknown>)} />
      </div>
    )
  } catch (error) {
      logger.error({ err: error }, `Error rendering section ${section.__component}`)
    return (
      <div key={`error-${uniqueKey}`} className="section-padding bg-red-50">
        <div className="container-custom text-center">
          <h3 className="text-red-600 font-semibold">
            Error rendering section
          </h3>
          <p className="text-red-500 text-sm">
            {section.__component} (ID: {section.id})
          </p>
        </div>
      </div>
    )
  }
}

// Helper function to validate section data
export function isValidSection(section: unknown): section is DynamicZoneSection {
  if (!section || typeof section !== 'object') {
    return false
  }

  const sectionObj = section as Record<string, unknown>
  return typeof sectionObj.__component === 'string' &&
         typeof sectionObj.id === 'number' &&
         sectionObj.id > 0
}

// Helper function to filter sections by component type
export function filterSectionsByType<T extends DynamicZoneSection>(
  sections: DynamicZoneSection[],
  componentType: string
): T[] {
  return sections
    .filter(section => section.__component === componentType)
    .filter(isValidSection) as T[]
}

// Helper function to get the first section of a specific type
export function getFirstSectionByType<T extends DynamicZoneSection>(
  sections: DynamicZoneSection[],
  componentType: string
): T | null {
  const filtered = filterSectionsByType<T>(sections, componentType)
  return filtered[0] || null
}

// Debug function to list all section types in a page
export function debugSectionTypes(sections: DynamicZoneSection[]): void {
    if (process.env.NODE_ENV === 'development') {
      const types = sections.map(section => section.__component)
      const uniqueTypes = [...new Set(types)]

      logger.info('Debug: Section Types')
      logger.info(`Total sections: ${sections.length}`)
      logger.info(`Unique types: ${uniqueTypes}`)
      logger.info(`All types: ${types}`)

      // Check for duplicate IDs
      const ids = sections.map(section => section.id)
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      if (duplicateIds.length > 0) {
        logger.warn('Duplicate section IDs found:', duplicateIds)
      }
    }
}

