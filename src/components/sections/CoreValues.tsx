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
import type { CoreValuesSection } from '@/types/strapi'

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

export default function CoreValues({
  heading,
  subheading,
  values = [],
  backgroundColor = 'healthcare-primary'
}: CoreValuesSection) {
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
          {values.map((value) => {
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