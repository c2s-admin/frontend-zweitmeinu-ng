import { 
  Shield, 
  Heart, 
  Users, 
  Award,
  CheckCircle,
  Target,
  Lightbulb,
  Stethoscope
} from 'lucide-react'

// Interface that matches actual Strapi data structure
interface CoreValuesProps {
  id: number
  __component: 'sections.core-values'
  heading: string
  subheading?: string
  values?: Array<{
    id: number
    title: string
    description?: string
    icon?: string
    iconColor?: string
  }>
  backgroundColor?: string
}

// Icon mapping for healthcare values
const iconMap = {
  'shield': Shield,
  'heart': Heart,
  'users': Users,
  'award': Award,
  'check-circle': CheckCircle,
  'target': Target,
  'lightbulb': Lightbulb,
  'stethoscope': Stethoscope,
} as const

// Default healthcare values if none provided from Strapi
const defaultHealthcareValues = [
  {
    id: 1,
    title: 'Vertrauen',
    description: 'Wir bauen Vertrauen durch Kompetenz und schaffen eine vertrauensvolle Patientenbeziehung.',
    icon: 'shield',
    iconColor: '#B3AF09'
  },
  {
    id: 2,
    title: 'Transparenz',
    description: 'Offene und ehrliche Kommunikation ist die Basis unserer Arbeit.',
    icon: 'lightbulb',
    iconColor: '#B3AF09'
  },
  {
    id: 3,
    title: 'Qualität',
    description: 'Höchste medizinische Standards und kontinuierliche Verbesserung.',
    icon: 'award',
    iconColor: '#B3AF09'
  },
  {
    id: 4,
    title: 'Menschlichkeit',
    description: 'Der Patient steht mit seinen Bedürfnissen im Mittelpunkt.',
    icon: 'heart',
    iconColor: '#B3AF09'
  }
]

export default function CoreValues({
  heading,
  subheading,
  values,
  backgroundColor = 'healthcare-primary'
}: CoreValuesProps) {
  // Use Strapi values if available, otherwise fallback to default healthcare values
  const displayValues = (values && values.length > 0) ? values : defaultHealthcareValues
  return (
    <section 
      className="section-padding text-white"
      style={{
        backgroundColor: backgroundColor === 'healthcare-primary' 
          ? 'var(--healthcare-primary)' 
          : backgroundColor
      }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayValues.map((value) => {
            const IconComponent = iconMap[value.icon as keyof typeof iconMap] || CheckCircle
            
            return (
              <div 
                key={value.id}
                className="text-center group"
              >
                {/* Icon Container */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  {/* Background Circle */}
                  <div 
                    className="absolute inset-0 rounded-full bg-healthcare-accent-green/20 group-hover:bg-healthcare-accent-green/30 transition-colors duration-300"
                  />
                  
                  {/* Icon */}
                  <IconComponent 
                    className="relative w-10 h-10 z-10"
                    style={{ 
                      color: value.iconColor || 'var(--healthcare-accent-green)' 
                    }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">
                    {value.title}
                  </h3>
                  
                  {value.description && (
                    <p className="text-white/70 leading-relaxed text-sm">
                      {value.description}
                    </p>
                  )}
                </div>

                {/* Hover Effect Line */}
                <div className="w-0 h-0.5 bg-healthcare-accent-green mx-auto mt-4 group-hover:w-12 transition-all duration-300" />
              </div>
            )
          })}
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-12 w-24 h-24 border border-white/10 rounded-full" />
          <div className="absolute bottom-1/4 -right-12 w-32 h-32 border border-white/5 rounded-full" />
        </div>
      </div>
    </section>
  )
}