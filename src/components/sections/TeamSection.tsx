interface TeamSectionProps {
  id: number
  __component: 'sections.team'
  title?: string
  subtitle?: string
  teamMembers?: Array<{
    id: number
    name: string
    position: string
    bio?: string
    image?: {
      data: {
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
  }>
}

export default function TeamSection({
  title,
  subtitle,
  teamMembers = []
}: TeamSectionProps) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-32 h-32 mx-auto mb-6 bg-healthcare-background rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-4xl text-healthcare-primary">👨‍⚕️</span>
              </div>

              <h3 className="text-xl font-semibold text-healthcare-primary mb-2 group-hover:text-healthcare-primary-light transition-colors">
                {member.name}
              </h3>

              <p className="text-healthcare-accent-green font-medium mb-4">
                {member.position}
              </p>

              {member.bio && (
                <p className="text-healthcare-text-muted text-sm">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
