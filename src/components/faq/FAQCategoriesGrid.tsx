'use client'

import Link from 'next/link'
import {
  HelpCircle,
  Activity,
  FlaskConical,
  HeartPulse,
  ScanFace,
  Droplet,
  Droplets
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQCategory, FAQ } from '@/lib/strapi/faq'

interface FAQCategoriesGridProps {
  categories: FAQCategory[]
  description?: string
  columns?: number
  showQuestionCount?: boolean
  groupedFAQs?: Record<string, FAQ[]>
}

const iconComponents = {
  'help-circle': HelpCircle,
  'activity': Activity,
  'flask-conical': FlaskConical,
  'heart-pulse': HeartPulse,
  'scan-face': ScanFace,
  'droplet': Droplet,
  'water': Droplets,
}

export function FAQCategoriesGrid({
  categories,
  description,
  columns = 3,
  showQuestionCount = true,
  groupedFAQs = {}
}: FAQCategoriesGridProps) {

  const getIconComponent = (iconName: string) => {
    return iconComponents[iconName as keyof typeof iconComponents] || HelpCircle
  }

  const handleCategoryClick = (categorySlug: string) => {
    // Scroll to the specific category section
    const categoryElement = document.getElementById(`category-${categorySlug}`)
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div id="faq-categories">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-4">
          FAQ nach Fachbereichen
        </h2>
        {description && (
          <p className="text-lg text-healthcare-text-muted max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Categories Grid */}
      <div className={cn(
        "grid gap-6",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "md:grid-cols-2 lg:grid-cols-4"
      )}>
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon)
          const questionCount = groupedFAQs[category.slug]?.length || 0

          return (
            <button type="button"
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left border border-gray-100 hover:border-healthcare-accent-green/20 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-lg bg-healthcare-primary/5 group-hover:bg-healthcare-primary/10 transition-colors">
                <IconComponent
                  className="w-7 h-7 text-healthcare-primary group-hover:text-healthcare-accent-green transition-colors"
                  style={{ color: category.color }}
                />
              </div>

              {/* Category Name */}
              <h3 className="text-xl font-semibold text-healthcare-primary mb-2 group-hover:text-healthcare-accent-green transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-healthcare-text-muted text-sm leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Question Count & Link */}
              <div className="flex items-center justify-between">
                {showQuestionCount && (
                  <span className="text-xs text-healthcare-text-muted bg-gray-100 px-2 py-1 rounded-full">
                    {questionCount} {questionCount === 1 ? 'Frage' : 'Fragen'}
                  </span>
                )}
                <span className="text-healthcare-primary group-hover:text-healthcare-accent-green text-sm font-medium transition-colors">
                  Fragen anzeigen →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-healthcare-accent-green/10 text-healthcare-primary px-4 py-2 rounded-full text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>Über {categories.reduce((total, cat) => total + (groupedFAQs[cat.slug]?.length || 0), 0)} Fragen und Antworten verfügbar</span>
        </div>
      </div>
    </div>
  )
}
