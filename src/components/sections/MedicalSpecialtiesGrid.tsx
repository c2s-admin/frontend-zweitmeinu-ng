import type { MedicalSpecialtiesGrid as MedicalSpecialtiesGridType } from '@/types/strapi'

export default function MedicalSpecialtiesGrid({
  title,
  subtitle,
  specialties = [],
  columns = 3
}: MedicalSpecialtiesGridType) {
  return (
    <section className="section-padding bg-white">
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

        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(columns, 4)} gap-8`}>
          {specialties.map((specialty) => (
            <div key={specialty.id} className="card text-center group hover:scale-105 transition-transform duration-300">
              {specialty.icon && (
                <div className="text-4xl mb-4">
                  {specialty.icon}
                </div>
              )}

              <h3 className="text-xl font-semibold text-healthcare-primary mb-4 group-hover:text-healthcare-primary-light transition-colors">
                {specialty.name}
              </h3>

              {specialty.description && (
                <p className="text-healthcare-text-muted">
                  {specialty.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
