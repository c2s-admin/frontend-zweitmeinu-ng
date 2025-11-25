import React from 'react'
import { Shield, Heart, Clock, Award, Users, TrendingUp } from 'lucide-react'

interface ChoiceCard {
  id: number
  title: string
  description: string
  icon?: string
  iconName?: 'shield' | 'heart' | 'clock' | 'award' | 'users' | 'trending'
  benefits?: string[]
  highlighted?: boolean
}

interface WhyChooseCardsProps {
  id: number
  __component: 'sections.why-choose-cards'
  title?: string
  subtitle?: string
  description?: string
  cards: ChoiceCard[]
  columns?: number
  backgroundColor?: string
}

const iconMap = {
  shield: Shield,
  heart: Heart,
  clock: Clock,
  award: Award,
  users: Users,
  trending: TrendingUp,
}

export default function WhyChooseCards({
  title,
  subtitle,
  description,
  cards = [],
  columns = 3,
  backgroundColor = 'bg-white',
}: WhyChooseCardsProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const getIcon = (card: ChoiceCard) => {
    if (card.iconName && iconMap[card.iconName]) {
      const IconComponent = iconMap[card.iconName]
      return <IconComponent className="w-12 h-12" aria-hidden="true" />
    }
    if (card.icon) {
      return <span className="text-5xl" aria-hidden="true">{card.icon}</span>
    }
    return <Heart className="w-12 h-12" aria-hidden="true" />
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

        {/* Cards Grid */}
        <div className={`grid ${gridClasses[columns] || gridClasses[3]} gap-8`}>
          {cards.map((card, index) => (
            <div
              key={card.id || index}
              className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border-2 ${
                card.highlighted
                  ? 'border-healthcare-primary-light bg-healthcare-background'
                  : 'border-transparent hover:border-healthcare-primary-light'
              }`}
            >
              {/* Highlighted Badge */}
              {card.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-healthcare-primary-light text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Empfohlen
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className={`p-4 rounded-full ${
                    card.highlighted
                      ? 'bg-healthcare-primary-light text-white'
                      : 'bg-healthcare-background text-healthcare-primary group-hover:bg-healthcare-primary-light group-hover:text-white'
                  } transition-colors duration-300`}
                >
                  {getIcon(card)}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-healthcare-primary mb-4 text-center">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 text-center mb-6">
                {card.description}
              </p>

              {/* Benefits */}
              {card.benefits && card.benefits.length > 0 && (
                <ul className="space-y-3">
                  {card.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-gray-700"
                    >
                      <span
                        className="text-healthcare-primary mr-3 mt-1 flex-shrink-0"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Hover Effect Border */}
              <div
                className={`absolute inset-0 rounded-2xl border-4 ${
                  card.highlighted
                    ? 'border-healthcare-primary-light'
                    : 'border-transparent'
                } group-hover:border-healthcare-primary-light transition-colors duration-300 pointer-events-none`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {cards.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              Über <span className="font-semibold text-healthcare-primary">{cards.length} Gründe</span>,
              warum Patienten uns vertrauen
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
