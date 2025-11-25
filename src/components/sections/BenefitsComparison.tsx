import React from 'react'
import { Check, X, Minus } from 'lucide-react'

interface ComparisonFeature {
  id: number
  feature: string
  description?: string
  withUs: boolean | 'partial'
  withoutUs: boolean | 'partial'
  category?: string
}

interface BenefitsComparisonProps {
  id: number
  __component: 'sections.benefits-comparison'
  title?: string
  subtitle?: string
  description?: string
  columnTitles: {
    withUs: string
    withoutUs: string
  }
  features: ComparisonFeature[]
  highlightWithUs?: boolean
  backgroundColor?: string
}

export default function BenefitsComparison({
  title,
  subtitle,
  description,
  columnTitles = {
    withUs: 'Mit Zweitmeinung',
    withoutUs: 'Ohne Zweitmeinung',
  },
  features = [],
  highlightWithUs = true,
  backgroundColor = 'bg-white',
}: BenefitsComparisonProps) {
  const renderCheckmark = (value: boolean | 'partial') => {
    if (value === true) {
      return (
        <Check
          className="w-6 h-6 text-green-600"
          aria-label="Ja"
        />
      )
    }
    if (value === 'partial') {
      return (
        <Minus
          className="w-6 h-6 text-yellow-600"
          aria-label="Teilweise"
        />
      )
    }
    return (
      <X
        className="w-6 h-6 text-red-500"
        aria-label="Nein"
      />
    )
  }

  // Group features by category if available
  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'Allgemein'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(feature)
    return acc
  }, {} as Record<string, ComparisonFeature[]>)

  return (
    <section className={`py-16 lg:py-24 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle || description) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-healthcare-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        )}

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-healthcare-primary text-white">
            <div className="p-6 font-semibold text-lg border-r border-white/20">
              Merkmal
            </div>
            <div
              className={`p-6 font-semibold text-lg text-center border-r border-white/20 ${
                highlightWithUs ? 'bg-healthcare-primary-light' : ''
              }`}
            >
              {columnTitles.withUs}
            </div>
            <div className="p-6 font-semibold text-lg text-center">
              {columnTitles.withoutUs}
            </div>
          </div>

          {/* Table Body */}
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <div key={category}>
              {/* Category Header */}
              {Object.keys(groupedFeatures).length > 1 && (
                <div className="bg-healthcare-background px-6 py-3 font-semibold text-healthcare-primary border-b border-gray-200">
                  {category}
                </div>
              )}

              {/* Features in Category */}
              {categoryFeatures.map((feature, index) => (
                <div
                  key={feature.id || index}
                  className="grid grid-cols-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Feature Name */}
                  <div className="p-6 border-r border-gray-200">
                    <div className="font-medium text-gray-900 mb-1">
                      {feature.feature}
                    </div>
                    {feature.description && (
                      <div className="text-sm text-gray-600">
                        {feature.description}
                      </div>
                    )}
                  </div>

                  {/* With Us */}
                  <div
                    className={`p-6 flex items-center justify-center border-r border-gray-200 ${
                      highlightWithUs ? 'bg-green-50/30' : ''
                    }`}
                  >
                    {renderCheckmark(feature.withUs)}
                  </div>

                  {/* Without Us */}
                  <div className="p-6 flex items-center justify-center">
                    {renderCheckmark(feature.withoutUs)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" aria-hidden="true" />
            <span className="text-gray-700">Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="w-5 h-5 text-yellow-600" aria-hidden="true" />
            <span className="text-gray-700">Teilweise verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" aria-hidden="true" />
            <span className="text-gray-700">Nicht verfügbar</span>
          </div>
        </div>

        {/* Bottom CTA */}
        {features.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              <span className="font-semibold text-healthcare-primary">{features.length} Merkmale</span> im Vergleich
            </p>
            <button className="bg-healthcare-primary-light text-white font-semibold px-8 py-4 rounded-lg hover:bg-healthcare-primary transition-colors duration-300 focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2 min-h-[56px]">
              Jetzt Zweitmeinung anfragen
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
