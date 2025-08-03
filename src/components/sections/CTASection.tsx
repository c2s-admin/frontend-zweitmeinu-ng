interface CTASectionProps {
  id: number
  __component: 'sections.cta'
  title?: string
  subtitle?: string
  description?: string
  ctaButtons?: Array<{
    id: number
    text: string
    href: string
    variant?: 'primary' | 'secondary' | 'ghost'
    isExternal?: boolean
    icon?: string
  }>
  backgroundColor?: string
}

export default function CTASection({
  title,
  subtitle,
  description,
  ctaButtons = [],
  backgroundColor
}: CTASectionProps) {
  const bgClass = backgroundColor === 'primary'
    ? 'bg-healthcare-primary text-white'
    : backgroundColor === 'secondary'
    ? 'bg-healthcare-background text-healthcare-primary'
    : 'bg-healthcare-accent-green text-white'

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="container-custom text-center">
        {title && (
          <h2 className="mb-6">
            {title}
          </h2>
        )}

        {subtitle && (
          <h3 className="text-2xl md:text-3xl mb-6 opacity-90">
            {subtitle}
          </h3>
        )}

        {description && (
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            {description}
          </p>
        )}

        {ctaButtons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {ctaButtons.map((button) => (
              <a
                key={button.id}
                href={button.href}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 ${
                  button.variant === 'secondary'
                    ? 'bg-white text-healthcare-primary hover:bg-gray-100 focus:ring-white/50'
                    : button.variant === 'ghost'
                    ? 'bg-transparent border-2 border-current hover:bg-current hover:bg-opacity-10 focus:ring-current'
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
    </section>
  )
}
