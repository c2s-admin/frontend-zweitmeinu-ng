import { Quote, Lightbulb, Star, Heart, Target, Activity } from 'lucide-react'
import type { MissionStatementSection } from '@/types/strapi'

// Icon mapping for mission statements using Lucide React
const iconMap = {
  'quote': Quote,
  'lightbulb': Lightbulb,  
  'star': Star,
  'heart': Heart,
  'target': Target,
  'pulse': Activity
} as const

export default function MissionStatement({
  heading,
  missionText,
  attribution = '– Das Team von zweitmeinung.ng',
  icon = 'quote',
  backgroundColor,
  textColor
}: MissionStatementSection) {
  
  // Icon Component - uses actual icon from Strapi API
  const renderIcon = () => {
    const IconComponent = iconMap[icon as keyof typeof iconMap] || Quote;
    
    return (
      <div className="flex justify-center mb-6">
        <IconComponent className="w-16 h-16 text-yellow-400 animate-pulse" />
      </div>
    )
  }
  
  return (
    <section 
      className="section-padding text-white relative overflow-hidden"
      style={{
        backgroundColor: backgroundColor === 'healthcare-primary' 
          ? 'var(--healthcare-primary)' 
          : (backgroundColor || 'var(--healthcare-primary)')
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Mission Card - Glassmorphism Design */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl">
            
            {/* Icon */}
            <div className="flex justify-center mb-8">
              {renderIcon()}
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white">
              {heading}
            </h2>

            {/* Mission Text */}
            <div className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 text-white/90 font-normal max-w-3xl mx-auto">
              {missionText}
            </div>

            {/* Attribution */}
            {attribution && (
              <div className="text-base md:text-lg text-white/70 font-medium italic">
                {attribution}
              </div>
            )}

            {/* Subtle Glassmorphism Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 -z-10" />
          </div>

        </div>
      </div>

    </section>
  )
}