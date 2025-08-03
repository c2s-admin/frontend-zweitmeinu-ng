interface StatsSectionProps {
  id: number
  __component: 'sections.stats'
  title?: string
  subtitle?: string
  stats?: Array<{
    id: number
    number: string
    label: string
    icon?: string
  }>
}

export default function StatsSection({
  title,
  subtitle,
  stats = []
}: StatsSectionProps) {
  return (
    <section className="section-padding bg-healthcare-primary">
      <div className="container-custom text-white">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-white mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              {stat.icon && (
                <div className="text-4xl mb-4 text-healthcare-accent-green">
                  {stat.icon}
                </div>
              )}
              <div className="text-4xl md:text-5xl font-bold mb-2 text-healthcare-accent-green">
                {stat.number}
              </div>
              <div className="text-lg text-white/90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
