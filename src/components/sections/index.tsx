import React from 'react'
import dynamic from 'next/dynamic'
import type { DynamicZoneSection } from '@/types/strapi'

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
  'sections.hero': dynamic(() => import('./HeroSection'), {
    loading: LoadingHero
  }),
  'sections.hero-carousel': dynamic(() => import('./HeroCarousel'), {
    loading: LoadingHero
  }),
  'sections.medical-specialties-grid': dynamic(() => import('./MedicalSpecialtiesGrid'), {
    loading: LoadingSection
  }),
  'sections.text-block': dynamic(() => import('./TextBlock'), {
    loading: LoadingSmall
  }),
  'sections.services-grid': dynamic(() => import('./ServicesGrid'), {
    loading: LoadingSection
  }),
  'sections.testimonials': dynamic(() => import('./Testimonials'), {
    loading: LoadingSection
  }),
  'sections.news': dynamic(() => import('./NewsSection'), {
    loading: LoadingSection
  }),
  'sections.faq': dynamic(() => import('./FAQSection'), {
    loading: LoadingSection
  }),
  'sections.contact-form': dynamic(() => import('./ContactForm'), {
    loading: LoadingSection
  }),
  'sections.stats': dynamic(() => import('./StatsSection'), {
    loading: LoadingSection
  }),
  'sections.team': dynamic(() => import('./TeamSection'), {
    loading: LoadingSection
  }),
  'sections.cta': dynamic(() => import('./CTASection'), {
    loading: LoadingSmall
  }),
}

export function renderSection(section: DynamicZoneSection, index?: number) {
  // Validate section data
  if (!isValidSection(section)) {
    console.warn(`⚠️ Invalid section data:`, section)
    return null
  }

  const Component = sectionComponents[section.__component as keyof typeof sectionComponents]

  if (!Component) {
    console.warn(`Unknown section component: ${section.__component}`)

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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(section as any)} />
      </div>
    )
  } catch (error) {
    console.error(`Error rendering section ${section.__component}:`, error)
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

    console.group('🔍 Debug: Section Types')
    console.log('Total sections:', sections.length)
    console.log('Unique types:', uniqueTypes)
    console.log('All types:', types)

    // Check for duplicate IDs
    const ids = sections.map(section => section.id)
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      console.warn('⚠️ Duplicate section IDs found:', duplicateIds)
    }

    console.groupEnd()
  }
}

// Export type definitions for components
export type SectionComponentType = keyof typeof sectionComponents
