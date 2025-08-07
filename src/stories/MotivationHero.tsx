import React, { useState, useCallback, useMemo } from 'react'
import { 
  Heart, Stethoscope, Users, Award, Clock, ArrowRight,
  Play, Pause, Volume2, VolumeX, Star, CheckCircle,
  Phone, Calendar, FileText, Shield, Zap, TrendingUp
} from 'lucide-react'
import './MotivationHero.css'

export interface HealthcareStatistic {
  /** Statistic identifier */
  id: string
  /** Display value */
  value: string
  /** Statistic label */
  label: string
  /** Description text */
  description?: string
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Trend direction */
  trend?: 'up' | 'down' | 'stable'
  /** Trend value */
  trendValue?: string
}

export interface PatientTestimonial {
  /** Testimonial identifier */
  id: string
  /** Patient name (can be anonymized) */
  patientName: string
  /** Medical condition */
  condition: string
  /** Testimonial text */
  testimonial: string
  /** Patient age range */
  ageRange?: string
  /** Treatment outcome */
  outcome?: 'positive' | 'improved' | 'ongoing'
  /** Rating given */
  rating?: number
  /** Avatar URL */
  avatar?: string
  /** Video testimonial URL */
  videoUrl?: string
  /** Audio testimonial URL */
  audioUrl?: string
  /** Date of testimonial */
  date?: Date
}

export interface EmergencyContact {
  /** Contact identifier */
  id: string
  /** Contact name */
  name: string
  /** Phone number */
  phone: string
  /** Contact type */
  type: 'emergency' | 'medical' | 'support'
  /** Availability */
  availability: '24/7' | 'business_hours'
}

export interface MotivationHeroProps {
  /** Hero title */
  title?: string
  /** Hero subtitle */
  subtitle?: string
  /** Main description */
  description?: string
  /** Primary CTA text */
  primaryCTA?: string
  /** Secondary CTA text */
  secondaryCTA?: string
  /** Background image URL */
  backgroundImage?: string
  /** Background video URL */
  backgroundVideo?: string
  /** Healthcare statistics */
  statistics?: HealthcareStatistic[]
  /** Patient testimonials */
  testimonials?: PatientTestimonial[]
  /** Emergency contacts */
  emergencyContacts?: EmergencyContact[]
  /** Hero layout variant */
  variant?: 'standard' | 'centered' | 'split' | 'video' | 'emergency'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Show video controls */
  showVideoControls?: boolean
  /** Show emergency banner */
  showEmergencyBanner?: boolean
  /** Show trust indicators */
  showTrustIndicators?: boolean
  /** Show patient testimonials */
  showTestimonials?: boolean
  /** Show statistics */
  showStatistics?: boolean
  /** Auto-play video */
  autoPlayVideo?: boolean
  /** Enable audio */
  enableAudio?: boolean
  /** Medical context */
  medicalContext?: boolean
  /** Emergency mode */
  emergencyMode?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Primary CTA handler */
  onPrimaryCTA?: () => void
  /** Secondary CTA handler */
  onSecondaryCTA?: () => void
  /** Video play handler */
  onVideoPlay?: () => void
  /** Video pause handler */
  onVideoPause?: () => void
  /** Audio toggle handler */
  onAudioToggle?: (enabled: boolean) => void
  /** Emergency call handler */
  onEmergencyCall?: (contact: EmergencyContact) => void
  /** Testimonial click handler */
  onTestimonialClick?: (testimonial: PatientTestimonial) => void
}

// Default healthcare statistics
const defaultStatistics: HealthcareStatistic[] = [
  {
    id: 'patients-helped',
    value: '50.000+',
    label: 'Behandelte Patienten',
    description: 'Erfolgreiche medizinische Beratungen',
    icon: Users,
    trend: 'up',
    trendValue: '+12%'
  },
  {
    id: 'specialist-network',
    value: '1.200+',
    label: 'Fachärzte',
    description: 'Spezialisierte Mediziner im Netzwerk',
    icon: Stethoscope,
    trend: 'up',
    trendValue: '+8%'
  },
  {
    id: 'response-time',
    value: '< 24h',
    label: 'Antwortzeit',
    description: 'Durchschnittliche Bearbeitungszeit',
    icon: Clock,
    trend: 'stable'
  },
  {
    id: 'satisfaction',
    value: '98%',
    label: 'Zufriedenheit',
    description: 'Patientenzufriedenheit',
    icon: Heart,
    trend: 'up',
    trendValue: '+2%'
  }
]

// Default patient testimonials
const defaultTestimonials: PatientTestimonial[] = [
  {
    id: 'testimonial-1',
    patientName: 'Maria S.',
    condition: 'Kardiologie',
    testimonial: 'Die Zweitmeinung gab mir die Sicherheit, die richtige Behandlungsentscheidung zu treffen.',
    ageRange: '45-55',
    outcome: 'positive',
    rating: 5,
    date: new Date('2024-07-15')
  },
  {
    id: 'testimonial-2',
    patientName: 'Thomas M.',
    condition: 'Onkologie',
    testimonial: 'Dank der schnellen und kompetenten Beratung konnte ich unnötige Operationen vermeiden.',
    ageRange: '60-70',
    outcome: 'improved',
    rating: 5,
    date: new Date('2024-07-10')
  },
  {
    id: 'testimonial-3',
    patientName: 'Anna K.',
    condition: 'Orthopädie',
    testimonial: 'Die Experten nahmen sich Zeit und erklärten alles verständlich.',
    ageRange: '30-40',
    outcome: 'positive',
    rating: 5,
    date: new Date('2024-07-20')
  }
]

// Default emergency contacts
const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emergency-112',
    name: 'Notruf',
    phone: '112',
    type: 'emergency',
    availability: '24/7'
  },
  {
    id: 'medical-116117',
    name: 'Ärztlicher Bereitschaftsdienst',
    phone: '116117',
    type: 'medical',
    availability: '24/7'
  },
  {
    id: 'support-hotline',
    name: 'zweitmeinung.ng Support',
    phone: '+49 800 80 44 100',
    type: 'support',
    availability: 'business_hours'
  }
]

export const MotivationHero = ({
  title = 'Medizinische Zweitmeinung online',
  subtitle = 'Sicherheit durch Expertise',
  description = 'Erhalten Sie eine professionelle zweite Meinung von führenden Fachärzten. Schnell, diskret und von Ihrer Krankenkasse erstattet.',
  primaryCTA = 'Jetzt Zweitmeinung anfordern',
  secondaryCTA = 'Mehr erfahren',
  backgroundImage,
  backgroundVideo,
  statistics = defaultStatistics,
  testimonials = defaultTestimonials,
  emergencyContacts = defaultEmergencyContacts,
  variant = 'standard',
  size = 'medium',
  showVideoControls = true,
  showEmergencyBanner = true,
  showTrustIndicators = true,
  showTestimonials = true,
  showStatistics = true,
  autoPlayVideo = false,
  enableAudio = false,
  medicalContext = true,
  emergencyMode = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onPrimaryCTA,
  onSecondaryCTA,
  onVideoPlay,
  onVideoPause,
  onAudioToggle,
  onEmergencyCall,
  onTestimonialClick,
  ...props
}: MotivationHeroProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(autoPlayVideo)
  const [audioEnabled, setAudioEnabled] = useState(enableAudio)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const containerClasses = `
    healthcare-motivation-hero
    healthcare-motivation-hero--${variant}
    healthcare-motivation-hero--${size}
    ${medicalContext ? 'healthcare-motivation-hero--medical' : ''}
    ${emergencyMode ? 'healthcare-motivation-hero--emergency' : ''}
    ${loading ? 'healthcare-motivation-hero--loading' : ''}
    ${className}
  `.trim()

  // Handle video play/pause
  const handleVideoToggle = useCallback(() => {
    const newPlaying = !isVideoPlaying
    setIsVideoPlaying(newPlaying)
    
    if (newPlaying) {
      onVideoPlay?.()
    } else {
      onVideoPause?.()
    }
  }, [isVideoPlaying, onVideoPlay, onVideoPause])

  // Handle audio toggle
  const handleAudioToggle = useCallback(() => {
    const newAudioEnabled = !audioEnabled
    setAudioEnabled(newAudioEnabled)
    onAudioToggle?.(newAudioEnabled)
  }, [audioEnabled, onAudioToggle])

  // Handle emergency call
  const handleEmergencyCall = useCallback((contact: EmergencyContact) => {
    onEmergencyCall?.(contact)
    window.location.href = `tel:${contact.phone}`
  }, [onEmergencyCall])

  // Handle testimonial rotation
  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  // Get statistics with trend colors
  const getStatisticTrendColor = (trend?: string): string => {
    switch (trend) {
      case 'up': return '#10b981'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-motivation-hero-skeleton">
          <div className="healthcare-motivation-hero-skeleton-content" />
          <div className="healthcare-motivation-hero-skeleton-stats" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Medizinische Zweitmeinung Hero-Bereich'}
      role="banner"
      {...props}
    >
      {/* Background Media */}
      {(backgroundImage || backgroundVideo) && (
        <div className="healthcare-motivation-hero-background">
          {backgroundVideo && (
            <video
              className="healthcare-motivation-hero-video"
              autoPlay={autoPlayVideo}
              muted={!audioEnabled}
              loop
              playsInline
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          )}
          {backgroundImage && !backgroundVideo && (
            <img
              className="healthcare-motivation-hero-image"
              src={backgroundImage}
              alt=""
              aria-hidden="true"
            />
          )}
          <div className="healthcare-motivation-hero-overlay" />
        </div>
      )}

      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="healthcare-motivation-hero-emergency-banner">
          <div className="healthcare-motivation-hero-emergency-content">
            <Zap className="healthcare-motivation-hero-emergency-icon" />
            <span>Medizinischer Notfall?</span>
            <div className="healthcare-motivation-hero-emergency-contacts">
              {emergencyContacts.filter(c => c.type === 'emergency').map(contact => (
                <button
                  key={contact.id}
                  className="healthcare-motivation-hero-emergency-contact"
                  onClick={() => handleEmergencyCall(contact)}
                  aria-label={`${contact.name} anrufen: ${contact.phone}`}
                >
                  <Phone className="healthcare-motivation-hero-emergency-contact-icon" />
                  {contact.phone}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="healthcare-motivation-hero-content">
        <div className="healthcare-motivation-hero-main">
          {/* Text Content */}
          <div className="healthcare-motivation-hero-text">
            <h1 className="healthcare-motivation-hero-title">
              {title}
            </h1>
            <p className="healthcare-motivation-hero-subtitle">
              {subtitle}
            </p>
            <p className="healthcare-motivation-hero-description">
              {description}
            </p>

            {/* Trust Indicators */}
            {showTrustIndicators && (
              <div className="healthcare-motivation-hero-trust">
                <div className="healthcare-motivation-hero-trust-item">
                  <Shield className="healthcare-motivation-hero-trust-icon" />
                  <span>DSGVO-konform</span>
                </div>
                <div className="healthcare-motivation-hero-trust-item">
                  <Award className="healthcare-motivation-hero-trust-icon" />
                  <span>Zertifizierte Ärzte</span>
                </div>
                <div className="healthcare-motivation-hero-trust-item">
                  <CheckCircle className="healthcare-motivation-hero-trust-icon" />
                  <span>Kassenerstattung</span>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="healthcare-motivation-hero-actions">
              <button
                className="healthcare-motivation-hero-cta healthcare-motivation-hero-cta--primary"
                onClick={onPrimaryCTA}
                aria-label={primaryCTA}
              >
                <Calendar className="healthcare-motivation-hero-cta-icon" />
                {primaryCTA}
                <ArrowRight className="healthcare-motivation-hero-cta-arrow" />
              </button>
              <button
                className="healthcare-motivation-hero-cta healthcare-motivation-hero-cta--secondary"
                onClick={onSecondaryCTA}
                aria-label={secondaryCTA}
              >
                <FileText className="healthcare-motivation-hero-cta-icon" />
                {secondaryCTA}
              </button>
            </div>
          </div>

          {/* Media Content */}
          {variant === 'video' && backgroundVideo && (
            <div className="healthcare-motivation-hero-media">
              <div className="healthcare-motivation-hero-video-container">
                <video
                  className="healthcare-motivation-hero-preview-video"
                  controls={showVideoControls}
                  autoPlay={autoPlayVideo}
                  muted={!audioEnabled}
                  loop
                >
                  <source src={backgroundVideo} type="video/mp4" />
                </video>
                
                {showVideoControls && (
                  <div className="healthcare-motivation-hero-video-controls">
                    <button
                      className="healthcare-motivation-hero-video-control"
                      onClick={handleVideoToggle}
                      aria-label={isVideoPlaying ? 'Video pausieren' : 'Video abspielen'}
                    >
                      {isVideoPlaying ? <Pause /> : <Play />}
                    </button>
                    <button
                      className="healthcare-motivation-hero-video-control"
                      onClick={handleAudioToggle}
                      aria-label={audioEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
                    >
                      {audioEnabled ? <Volume2 /> : <VolumeX />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        {showStatistics && statistics.length > 0 && (
          <div className="healthcare-motivation-hero-statistics">
            <div className="healthcare-motivation-hero-statistics-grid">
              {statistics.map((stat) => {
                const StatIcon = stat.icon || TrendingUp
                const trendColor = getStatisticTrendColor(stat.trend)
                
                return (
                  <div key={stat.id} className="healthcare-motivation-hero-statistic">
                    <div className="healthcare-motivation-hero-statistic-icon-container">
                      <StatIcon 
                        className="healthcare-motivation-hero-statistic-icon"
                        style={{ color: trendColor }}
                      />
                      {stat.trend === 'up' && stat.trendValue && (
                        <div className="healthcare-motivation-hero-statistic-trend">
                          <TrendingUp className="healthcare-motivation-hero-statistic-trend-icon" />
                          {stat.trendValue}
                        </div>
                      )}
                    </div>
                    <div className="healthcare-motivation-hero-statistic-content">
                      <div className="healthcare-motivation-hero-statistic-value">
                        {stat.value}
                      </div>
                      <div className="healthcare-motivation-hero-statistic-label">
                        {stat.label}
                      </div>
                      {stat.description && (
                        <div className="healthcare-motivation-hero-statistic-description">
                          {stat.description}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Patient Testimonials */}
        {showTestimonials && testimonials.length > 0 && (
          <div className="healthcare-motivation-hero-testimonials">
            <div className="healthcare-motivation-hero-testimonial-container">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`healthcare-motivation-hero-testimonial ${
                    index === currentTestimonial ? 'healthcare-motivation-hero-testimonial--active' : ''
                  }`}
                  onClick={() => onTestimonialClick?.(testimonial)}
                >
                  <div className="healthcare-motivation-hero-testimonial-content">
                    <div className="healthcare-motivation-hero-testimonial-quote">
                      "{testimonial.testimonial}"
                    </div>
                    <div className="healthcare-motivation-hero-testimonial-meta">
                      <div className="healthcare-motivation-hero-testimonial-author">
                        <strong>{testimonial.patientName}</strong>
                        <span>{testimonial.condition}</span>
                      </div>
                      {testimonial.rating && (
                        <div className="healthcare-motivation-hero-testimonial-rating">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="healthcare-motivation-hero-testimonial-star" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {testimonials.length > 1 && (
              <div className="healthcare-motivation-hero-testimonial-controls">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`healthcare-motivation-hero-testimonial-dot ${
                      index === currentTestimonial ? 'healthcare-motivation-hero-testimonial-dot--active' : ''
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`Bewertung ${index + 1} anzeigen`}
                  />
                ))}
                <button
                  className="healthcare-motivation-hero-testimonial-next"
                  onClick={nextTestimonial}
                  aria-label="Nächste Bewertung"
                >
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medical Disclaimer */}
      {medicalContext && (
        <div className="healthcare-motivation-hero-disclaimer">
          <Shield className="healthcare-motivation-hero-disclaimer-icon" />
          <p>
            <strong>Medizinischer Hinweis:</strong> Diese Plattform ersetzt keine 
            professionelle medizinische Beratung. Bei akuten Notfällen wählen Sie 112.
          </p>
        </div>
      )}
    </div>
  )
}

MotivationHero.displayName = 'MotivationHero'