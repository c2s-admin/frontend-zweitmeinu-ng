import type { ServicesGrid as ServicesGridType } from '@/types/strapi'

export default function ServicesGrid({
  title,
  subtitle,
  services = [],
  columns = 3
}: ServicesGridType) {
  return (
    <section className="section-padding bg-healthcare-background">
      <div className="container-custom">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-healthcare-primary mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} gap-8`}>
          {services.map((service) => (
            <div key={service.id} className="card group hover:scale-105 transition-transform duration-300">
              {service.icon && (
                <div className="text-4xl mb-4 text-healthcare-primary">
                  {service.icon}
                </div>
              )}

              <h3 className="text-xl font-semibold text-healthcare-primary mb-4 group-hover:text-healthcare-primary-light transition-colors">
                {service.title}
              </h3>

              {service.description && (
                <p className="text-healthcare-text-muted mb-6">
                  {service.description}
                </p>
              )}

              {service.ctaButton && (
                <a
                  href={service.ctaButton.href}
                  className="btn-primary inline-block"
                  target={service.ctaButton.isExternal ? '_blank' : undefined}
                  rel={service.ctaButton.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {service.ctaButton.text}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
