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

export type SectionComponents = Record<SectionComponentType, ComponentType<Record<string, unknown>>>
