import React from 'react'
import Link from 'next/link'
import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react'

interface CTAButton {
  id: number
  text: string
  href: string
  variant?: 'primary' | 'secondary' | 'outline'
  icon?: 'arrow' | 'phone' | 'mail' | 'message'
}

interface ProcessCTAProps {
  id: number
  __component: 'sections.process-cta'
  title?: string
  subtitle?: string
  description?: string
  buttons: CTAButton[]
  showContactInfo?: boolean
  urgencyMessage?: string
  backgroundColor?: string
  backgroundImage?: string
  pattern?: 'gradient' | 'solid' | 'pattern'
}

const iconMap = {
  arrow: ArrowRight,
  phone: Phone,
  mail: Mail,
  message: MessageCircle,
}

export default function ProcessCTA({
  title,
  subtitle,
  description,
  buttons = [],
  showContactInfo = true,
  urgencyMessage,
  backgroundColor = 'bg-healthcare-primary',
  pattern = 'gradient',
}: ProcessCTAProps) {
  const getButtonClasses = (variant: string = 'primary') => {
    const baseClasses = 'inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 min-h-[56px] min-w-[200px] hover:transform hover:scale-105'

    const variantClasses = {
      primary: 'bg-white text-healthcare-primary hover:bg-gray-100 focus:ring-white',
      secondary: 'bg-healthcare-accent-green text-white hover:bg-healthcare-accent-green/90 focus:ring-healthcare-accent-green',
      outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-healthcare-primary focus:ring-white',
    }

    return `${baseClasses} ${variantClasses[variant]}`
  }

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) {
      return <ArrowRight className="w-5 h-5" aria-hidden="true" />
    }
    const IconComponent = iconMap[iconName]
    return <IconComponent className="w-5 h-5" aria-hidden="true" />
  }

  const backgroundPatterns = {
    gradient: 'bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-primary',
    solid: backgroundColor,
    pattern: `${backgroundColor} bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:40px_40px]`,
  }

  return (
    <section className={`relative py-16 lg:py-24 overflow-hidden ${backgroundPatterns[pattern]}`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-healthcare-accent-green rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Urgency Message */}
        {urgencyMessage && (
          <div className="text-center mb-8">
            <div className="inline-block bg-healthcare-accent-green text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-pulse">
              {urgencyMessage}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-2xl text-white/90 mb-4 font-medium">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {buttons.map((button, index) => (
              <Link
                key={button.id || index}
                href={button.href}
                className={getButtonClasses(button.variant)}
              >
                {button.text}
                {getIcon(button.icon)}
              </Link>
            ))}
          </div>
        )}

        {/* Contact Info */}
        {showContactInfo && (
          <div className="border-t border-white/20 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-white">
              {/* Phone */}
              <a
                href="tel:+4980080441100"
                className="flex items-center gap-3 hover:text-healthcare-accent-green transition-colors group"
              >
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Hotline</div>
                  <div className="font-semibold">+49 800 80 44 100</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:kontakt@zweitmeinu.ng"
                className="flex items-center gap-3 hover:text-healthcare-accent-green transition-colors group"
              >
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-white/70">E-Mail</div>
                  <div className="font-semibold">kontakt@zweitmeinu.ng</div>
                </div>
              </a>

              {/* Availability */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-full">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Erreichbarkeit</div>
                  <div className="font-semibold">Mo-Fr 9:00-16:00 Uhr</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-healthcare-accent-green text-xl">✓</span>
            <span>DSGVO-konform</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-healthcare-accent-green text-xl">✓</span>
            <span>Ärztliche Schweigepflicht</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-healthcare-accent-green text-xl">✓</span>
            <span>Zertifizierte Fachärzte</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-healthcare-accent-green text-xl">✓</span>
            <span>Schnelle Bearbeitung</span>
          </div>
        </div>
      </div>
    </section>
  )
}
