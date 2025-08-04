import { Heart, Stethoscope, Shield, Target } from 'lucide-react'
import type { MissionStatementSection } from '@/types/strapi'

// Icon mapping for mission statements
const iconMap = {
  'heart': Heart,
  'stethoscope': Stethoscope,
  'shield': Shield,
  'target': Target,
} as const

export default function MissionStatement({
  heading,
  missionText,
  attribution = '– Das Team von zweitmeinung.ng',
  icon = 'heart',
  backgroundColor,
  textColor
}: MissionStatementSection) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Heart
  
  return (
    <section 
      className="section-padding relative overflow-hidden"
      style={{
        backgroundColor: backgroundColor || 'var(--healthcare-primary)',
        color: textColor || 'white'
      }}
    >
      <div className="container-custom">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Mission Card */}
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-healthcare-accent-green/20 flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-healthcare-accent-green" />
                </div>
                {/* Pulse Effect */}
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-healthcare-accent-green/10 animate-ping" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              {heading}
            </h2>

            {/* Mission Text */}
            <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 text-white/90 italic font-light">
              "{missionText}"
            </blockquote>

            {/* Attribution */}
            {attribution && (
              <cite className="text-lg text-white/70 font-medium not-italic">
                {attribution}
              </cite>
            )}

            {/* Decorative Quote Marks */}
            <div className="absolute top-6 left-6 text-6xl text-healthcare-accent-green/20 font-serif leading-none">
              "
            </div>
            <div className="absolute bottom-6 right-6 text-6xl text-healthcare-accent-green/20 font-serif leading-none rotate-180">
              "
            </div>
          </div>

        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-healthcare-accent-green/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-healthcare-accent-green/20 rounded-full animate-pulse animation-delay-300" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-healthcare-accent-green/40 rounded-full animate-pulse animation-delay-600" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full" />
            ))}
          </div>
        </div>
        
        {/* Large Circle Elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 border border-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 border border-white/3 rounded-full" />
      </div>
    </section>
  )
}