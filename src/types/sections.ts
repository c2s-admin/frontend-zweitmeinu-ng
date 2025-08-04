import type { ComponentType } from 'react'

export type SectionComponentType =
  | 'sections.hero'
  | 'sections.hero-carousel'
  | 'sections.medical-specialties-grid'
  | 'sections.text-block'
  | 'sections.services-grid'
  | 'sections.testimonials'
  | 'sections.news'
  | 'sections.faq'
  | 'sections.contact-form'
  | 'sections.stats'
  | 'sections.team'
  | 'sections.cta'
  // Motivation Page Specific Components
  | 'sections.hero-section'
  | 'sections.story-section'
  | 'sections.core-values'
  | 'sections.mission-statement'

export type SectionComponents = Record<SectionComponentType, ComponentType<Record<string, unknown>>>
