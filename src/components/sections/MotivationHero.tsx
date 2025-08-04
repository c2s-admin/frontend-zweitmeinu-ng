import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { MotivationHeroSection } from '@/types/strapi'

export default function MotivationHero({
  title,
  subtitle,
  description,
  backgroundType = 'gradient',
  showBreadcrumb = true,
  breadcrumbText = 'Patientenversorgung für Zentren'
}: MotivationHeroSection) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Healthcare Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-accent-green/80" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Breadcrumb */}
            {showBreadcrumb && breadcrumbText && (
              <div className="mb-8 flex items-center justify-center text-healthcare-accent-green/80">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-healthcare-accent-green" />
                  <span className="text-sm font-medium">{breadcrumbText}</span>
                </div>
              </div>
            )}

            {/* Main Title */}
            {title && (
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                {title}
              </h1>
            )}

            {/* Subtitle */}
            {subtitle && (
              <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-light leading-relaxed animate-slide-up animation-delay-200">
                {subtitle}
              </h2>
            )}

            {/* Description */}
            {description && (
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-white/80 leading-relaxed animate-slide-up animation-delay-400">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent" />
      
      {/* Healthcare Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/20 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-white/15 rounded-full" />
      </div>
    </section>
  )
}