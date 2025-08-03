import Image from 'next/image'
import type { HeroSection as HeroSectionType } from '@/types/strapi'

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaButtons,
  overlayOpacity = 60
}: HeroSectionType) {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      {backgroundImage?.data && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.data.attributes.url}
            alt={backgroundImage.data.attributes.alternativeText || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
          />
        </div>
      )}

      {/* Default gradient if no image */}
      {!backgroundImage?.data && (
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-medical-yellow opacity-90" />
      )}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-4xl text-white">
            {title && (
              <h1 className="mb-8 animate-slide-up">
                {title}
              </h1>
            )}

            {subtitle && (
              <h2 className="text-2xl md:text-3xl mb-6 animate-slide-up animation-delay-200">
                {subtitle}
              </h2>
            )}

            {description && (
              <p className="text-xl mb-10 max-w-3xl leading-relaxed animate-slide-up animation-delay-400">
                {description}
              </p>
            )}

            {ctaButtons && ctaButtons.length > 0 && (
              <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-600">
                {ctaButtons.map((button, idx) => (
                  <a
                    key={button.id || idx}
                    href={button.href}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 ${
                      button.variant === 'secondary'
                        ? 'bg-white text-healthcare-primary hover:bg-gray-100 focus:ring-white/50'
                        : button.variant === 'ghost'
                        ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-healthcare-primary focus:ring-white/50'
                        : 'bg-healthcare-primary-light text-white hover:bg-healthcare-accent-hover focus:ring-healthcare-primary-light/50'
                    }`}
                    target={button.isExternal ? '_blank' : undefined}
                    rel={button.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {button.icon && <span className="mr-2">{button.icon}</span>}
                    {button.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
