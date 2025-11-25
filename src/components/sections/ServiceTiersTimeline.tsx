import React from 'react'
import { Check, Star, Zap } from 'lucide-react'

interface ServiceTier {
  id: number
  name: string
  description: string
  price?: string
  duration?: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  icon?: string
  color?: 'primary' | 'secondary' | 'accent'
}

interface ServiceTiersTimelineProps {
  id: number
  __component: 'sections.service-tiers-timeline'
  title?: string
  subtitle?: string
  description?: string
  tiers: ServiceTier[]
  orientation?: 'horizontal' | 'vertical'
  showPricing?: boolean
  backgroundColor?: string
}

export default function ServiceTiersTimeline({
  title,
  subtitle,
  description,
  tiers = [],
  orientation = 'horizontal',
  showPricing = false,
  backgroundColor = 'bg-gray-50',
}: ServiceTiersTimelineProps) {
  const colorClasses = {
    primary: {
      bg: 'bg-healthcare-primary-light',
      border: 'border-healthcare-primary-light',
      text: 'text-healthcare-primary-light',
      badgeBg: 'bg-healthcare-primary',
    },
    secondary: {
      bg: 'bg-healthcare-accent-green',
      border: 'border-healthcare-accent-green',
      text: 'text-healthcare-accent-green',
      badgeBg: 'bg-healthcare-accent-green',
    },
    accent: {
      bg: 'bg-healthcare-primary',
      border: 'border-healthcare-primary',
      text: 'text-healthcare-primary',
      badgeBg: 'bg-healthcare-primary-light',
    },
  }

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

        {/* Tiers */}
        <div
          className={`relative ${
            orientation === 'horizontal'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col space-y-8 max-w-4xl mx-auto'
          }`}
        >
          {tiers.map((tier, index) => {
            const colors = colorClasses[tier.color || 'primary']

            return (
              <div
                key={tier.id || index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 ${
                  tier.highlighted
                    ? `border-4 ${colors.border} transform scale-105`
                    : 'border-2 border-gray-200 hover:border-healthcare-primary-light'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`${colors.badgeBg} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}>
                      <Star className="w-4 h-4" aria-hidden="true" />
                      Beliebt
                    </span>
                  </div>
                )}

                {/* Icon */}
                {tier.icon && (
                  <div className="mb-6 flex justify-center">
                    <div className={`p-4 rounded-full ${colors.bg} text-white`}>
                      <span className="text-4xl" aria-hidden="true">
                        {tier.icon}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tier Name */}
                <h3 className={`text-2xl font-bold ${colors.text} mb-3 text-center`}>
                  {tier.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                  {tier.description}
                </p>

                {/* Pricing */}
                {showPricing && tier.price && (
                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <div className="text-4xl font-bold text-healthcare-primary mb-2">
                      {tier.price}
                    </div>
                    {tier.duration && (
                      <div className="text-gray-500 text-sm">
                        {tier.duration}
                      </div>
                    )}
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start"
                    >
                      <Check
                        className={`w-5 h-5 ${colors.text} mr-3 mt-0.5 flex-shrink-0`}
                        aria-hidden="true"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    tier.highlighted
                      ? `${colors.bg} text-white hover:opacity-90 transform hover:scale-105`
                      : 'bg-gray-100 text-healthcare-primary hover:bg-healthcare-primary hover:text-white'
                  } focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2`}
                  aria-label={`${tier.name} auswählen`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Mehr erfahren
                    <Zap className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom Info */}
        {tiers.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Alle Pakete beinhalten <span className="font-semibold text-healthcare-primary">ärztliche Schweigepflicht</span> und{' '}
              <span className="font-semibold text-healthcare-primary">DSGVO-Konformität</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
