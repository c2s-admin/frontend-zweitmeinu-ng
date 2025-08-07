import React, { useState, useCallback, useMemo } from 'react'
import { 
  Heart, Shield, Users, Award, Clock, Zap,
  CheckCircle, Star, TrendingUp, Eye, Lock, 
  HeartHandshake, Stethoscope, BookOpen, Phone,
  Globe, Smartphone, ChevronRight, ExternalLink
} from 'lucide-react'
import './CoreValues.css'

export interface HealthcareValue {
  /** Value identifier */
  id: string
  /** Value name */
  name: string
  /** Short description */
  description: string
  /** Detailed explanation */
  details?: string
  /** Icon component */
  icon: React.ComponentType<any>
  /** Value color theme */
  color?: string
  /** Statistics/metrics */
  metrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  /** Related certifications */
  certifications?: string[]
  /** Implementation examples */
  examples?: string[]
  /** Priority level */
  priority?: 'high' | 'medium' | 'low'
}

export interface CoreValuesProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Section description */
  description?: string
  /** Healthcare values */
  values?: HealthcareValue[]
  /** Layout variant */
  variant?: 'grid' | 'cards' | 'list' | 'featured' | 'compact'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Show statistics */
  showMetrics?: boolean
  /** Show certifications */
  showCertifications?: boolean
  /** Show examples */
  showExamples?: boolean
  /** Show detailed descriptions */
  showDetails?: boolean
  /** Enable interactions */
  interactive?: boolean
  /** Medical context */
  medicalContext?: boolean
  /** Show priority indicators */
  showPriority?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Value click handler */
  onValueClick?: (value: HealthcareValue) => void
  /** Certification click handler */
  onCertificationClick?: (certification: string) => void
  /** Learn more handler */
  onLearnMore?: (value: HealthcareValue) => void
}

// Default healthcare values
const defaultHealthcareValues: HealthcareValue[] = [
  {
    id: 'patient-safety',
    name: 'Patientensicherheit',
    description: 'Höchste Sicherheitsstandards in der medizinischen Beratung',
    details: 'Wir gewährleisten die Sicherheit unserer Patienten durch strenge Qualitätskontrollen, verifizierte Ärzte und sichere Datenübertragung. Jede medizinische Empfehlung wird durch mindestens zwei Fachexperten validiert.',
    icon: Shield,
    color: '#dc2626',
    priority: 'high',
    metrics: [
      { label: 'Sicherheits-Score', value: '99.8%', description: 'Qualitätssicherung' },
      { label: 'Verifizierte Ärzte', value: '2.500+', description: 'Geprüfte Experten' },
      { label: 'Sichere Übertragungen', value: '750.000+', description: 'Verschlüsselte Daten' }
    ],
    certifications: ['ISO 27001', 'DSGVO-konform', 'TÜV-zertifiziert', 'CE-Medizinprodukt'],
    examples: [
      'Ende-zu-Ende-Verschlüsselung aller medizinischen Daten',
      'Zweifach-Validierung aller medizinischen Empfehlungen',
      'Regelmäßige Sicherheitsaudits durch externe Prüfer',
      'Anonymisierte Datenverarbeitung zum Patientenschutz'
    ]
  },
  {
    id: 'medical-excellence',
    name: 'Medizinische Exzellenz',
    description: 'Führende Fachärzte mit höchsten Qualifikationen',
    details: 'Unser Netzwerk umfasst ausschließlich Top-Mediziner mit nachgewiesener Expertise. Alle Ärzte durchlaufen ein strenges Auswahlverfahren und werden kontinuierlich in ihrer Qualifikation überprüft.',
    icon: Award,
    color: '#7c2d12',
    priority: 'high',
    metrics: [
      { label: 'Durchschnittserfahrung', value: '15+ Jahre', description: 'Ärztliche Praxis' },
      { label: 'Publikationen', value: '12.000+', description: 'Wissenschaftliche Arbeiten' },
      { label: 'Fachrichtungen', value: '45+', description: 'Medizinische Spezialgebiete' }
    ],
    certifications: ['Facharzt-Zertifizierung', 'Board Certification', 'Universitätszugehörigkeit'],
    examples: [
      'Chefärzte aus führenden deutschen Universitätskliniken',
      'Internationale Experten mit Publikationen in Nature/Lancet',
      'Spezialisierte Zentren für seltene Krankheiten',
      'Kontinuierliche Weiterbildung durch Medical Conferences'
    ]
  },
  {
    id: 'accessibility',
    name: 'Barrierefreiheit',
    description: 'Medizinische Beratung für alle zugänglich machen',
    details: 'Wir sorgen dafür, dass jeder Patient unabhängig von körperlichen Einschränkungen oder technischen Kenntnissen Zugang zu hochwertiger medizinischer Beratung erhält.',
    icon: HeartHandshake,
    color: '#059669',
    priority: 'high',
    metrics: [
      { label: 'Barrierefreiheit-Score', value: 'WCAG 2.1 AA', description: 'Web-Standards' },
      { label: 'Sprachen', value: '12+', description: 'Mehrsprachiger Support' },
      { label: 'Assistive Technologien', value: '95%+', description: 'Kompatibilität' }
    ],
    certifications: ['WCAG 2.1 AA', 'Section 508', 'EN 301 549'],
    examples: [
      'Screen Reader-optimierte Benutzeroberfläche',
      'Hochkontrast-Modus für sehbehinderte Patienten',
      'Tastatur-Navigation für motorische Einschränkungen',
      'Mehrsprachige Übersetzungen in Echtzeit'
    ]
  },
  {
    id: 'response-time',
    name: 'Schnelle Antwortzeiten',
    description: 'Zeitnahe medizinische Beratung wenn sie gebraucht wird',
    details: 'Zeit ist bei medizinischen Entscheidungen oft kritisch. Wir garantieren schnelle Bearbeitungszeiten ohne Kompromisse bei der Qualität der medizinischen Bewertung.',
    icon: Clock,
    color: '#1278B3',
    priority: 'medium',
    metrics: [
      { label: 'Durchschnitt', value: '< 18h', description: 'Antwortzeit' },
      { label: 'Express-Service', value: '< 4h', description: 'Notfälle' },
      { label: 'Verfügbarkeit', value: '24/7', description: 'Support-Hotline' }
    ],
    certifications: ['SLA-Garantie', 'Notfall-Bereitschaft'],
    examples: [
      'Express-Bearbeitung für kritische Fälle in unter 4 Stunden',
      'Automatische Priorisierung nach medizinischer Dringlichkeit',
      '24/7 Support-Hotline für dringende Rückfragen',
      'Echtzeit-Benachrichtigungen über Bearbeitungsstatus'
    ]
  },
  {
    id: 'transparency',
    name: 'Transparenz',
    description: 'Offene Kommunikation und nachvollziehbare Entscheidungen',
    details: 'Wir informieren unsere Patienten umfassend über alle Aspekte ihrer Behandlung, Kosten und mögliche Alternativen. Transparenz schafft Vertrauen.',
    icon: Eye,
    color: '#0369a1',
    priority: 'medium',
    metrics: [
      { label: 'Kostenvorhersagbarkeit', value: '100%', description: 'Transparent' },
      { label: 'Arzt-Profile', value: 'Vollständig', description: 'Einsehbar' },
      { label: 'Behandlungswege', value: 'Dokumentiert', description: 'Nachvollziehbar' }
    ],
    certifications: ['Transparenz-Zertifikat', 'Open-Data-Initiative'],
    examples: [
      'Vollständige Arzt-Profile mit Qualifikationen und Erfahrung',
      'Transparente Kostenstruktur ohne versteckte Gebühren',
      'Offenlegung aller Behandlungsalternativen und Risiken',
      'Öffentliche Bewertungen und Erfahrungsberichte'
    ]
  },
  {
    id: 'innovation',
    name: 'Innovation',
    description: 'Modernste Technologie für bessere medizinische Ergebnisse',
    details: 'Wir nutzen innovative Technologien wie KI-Diagnoseunterstützung, Telemedizin und digitale Gesundheitsakten, um die bestmögliche medizinische Beratung zu bieten.',
    icon: Zap,
    color: '#7c3aed',
    priority: 'low',
    metrics: [
      { label: 'KI-Unterstützung', value: '85%', description: 'Diagnose-Präzision' },
      { label: 'Digital Health Tools', value: '25+', description: 'Integrierte Systeme' },
      { label: 'Forschungspartnerschaften', value: '12', description: 'Universitäten' }
    ],
    certifications: ['Digital Health Certification', 'AI-Ethics Approved'],
    examples: [
      'KI-basierte Diagnoseunterstützung für komplexe Fälle',
      'Telemedizinische Konsultationen in HD-Qualität',
      'Digitale Gesundheitsakten mit Blockchain-Sicherheit',
      'Virtual Reality für Patientenaufklärung'
    ]
  }
]

export const CoreValues = ({
  title = 'Unsere Werte',
  subtitle = 'Was uns als Healthcare-Plattform auszeichnet',
  description = 'Diese Grundprinzipien leiten unser Handeln und gewährleisten die bestmögliche medizinische Beratung für unsere Patienten.',
  values = defaultHealthcareValues,
  variant = 'cards',
  size = 'medium',
  showMetrics = true,
  showCertifications = true,
  showExamples = false,
  showDetails = false,
  interactive = true,
  medicalContext = true,
  showPriority = true,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onValueClick,
  onCertificationClick,
  onLearnMore,
  ...props
}: CoreValuesProps) => {
  const [expandedValues, setExpandedValues] = useState<Set<string>>(new Set())
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const containerClasses = `
    healthcare-core-values
    healthcare-core-values--${variant}
    healthcare-core-values--${size}
    ${medicalContext ? 'healthcare-core-values--medical' : ''}
    ${interactive ? 'healthcare-core-values--interactive' : ''}
    ${loading ? 'healthcare-core-values--loading' : ''}
    ${className}
  `.trim()

  // Handle value expansion
  const handleToggleExpanded = useCallback((valueId: string) => {
    if (!interactive) return
    
    setExpandedValues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(valueId)) {
        newSet.delete(valueId)
      } else {
        newSet.add(valueId)
      }
      return newSet
    })
  }, [interactive])

  // Handle value selection
  const handleValueClick = useCallback((value: HealthcareValue) => {
    if (!interactive) return
    
    setSelectedValue(prev => prev === value.id ? null : value.id)
    onValueClick?.(value)
  }, [interactive, onValueClick])

  // Handle learn more
  const handleLearnMore = useCallback((value: HealthcareValue, event: React.MouseEvent) => {
    event.stopPropagation()
    onLearnMore?.(value)
  }, [onLearnMore])

  // Handle certification click
  const handleCertificationClick = useCallback((certification: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onCertificationClick?.(certification)
  }, [onCertificationClick])

  // Sort values by priority
  const sortedValues = useMemo(() => {
    return [...values].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const aPriority = priorityOrder[a.priority || 'medium']
      const bPriority = priorityOrder[b.priority || 'medium']
      return aPriority - bPriority
    })
  }, [values])

  // Get priority indicator
  const getPriorityIndicator = (priority?: string) => {
    switch (priority) {
      case 'high':
        return { icon: Zap, color: '#dc2626', label: 'Kritisch' }
      case 'medium':
        return { icon: TrendingUp, color: '#f59e0b', label: 'Wichtig' }
      case 'low':
        return { icon: CheckCircle, color: '#059669', label: 'Standard' }
      default:
        return { icon: CheckCircle, color: '#6b7280', label: 'Standard' }
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-core-values-skeleton">
          <div className="healthcare-core-values-skeleton-header" />
          <div className="healthcare-core-values-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="healthcare-core-values-skeleton-card" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Healthcare Core Values Section'}
      {...props}
    >
      {/* Header */}
      <div className="healthcare-core-values-header">
        <h2 className="healthcare-core-values-title">{title}</h2>
        <p className="healthcare-core-values-subtitle">{subtitle}</p>
        {description && (
          <p className="healthcare-core-values-description">{description}</p>
        )}
      </div>

      {/* Values Grid */}
      <div className="healthcare-core-values-grid">
        {sortedValues.map((value) => {
          const ValueIcon = value.icon
          const isExpanded = expandedValues.has(value.id)
          const isSelected = selectedValue === value.id
          const priorityIndicator = getPriorityIndicator(value.priority)
          const PriorityIcon = priorityIndicator.icon

          return (
            <article
              key={value.id}
              className={`healthcare-core-values-value ${
                isExpanded ? 'healthcare-core-values-value--expanded' : ''
              } ${
                isSelected ? 'healthcare-core-values-value--selected' : ''
              }`}
              onClick={() => handleValueClick(value)}
              role={interactive ? 'button' : 'article'}
              tabIndex={interactive ? 0 : undefined}
              aria-expanded={interactive ? isExpanded : undefined}
            >
              {/* Value Header */}
              <div className="healthcare-core-values-value-header">
                <div className="healthcare-core-values-value-icon-container">
                  <ValueIcon 
                    className="healthcare-core-values-value-icon"
                    style={{ color: value.color || '#1278B3' }}
                  />
                  {showPriority && value.priority && (
                    <div 
                      className="healthcare-core-values-value-priority"
                      style={{ backgroundColor: priorityIndicator.color }}
                      title={`Priorität: ${priorityIndicator.label}`}
                    >
                      <PriorityIcon className="healthcare-core-values-value-priority-icon" />
                    </div>
                  )}
                </div>
                
                <div className="healthcare-core-values-value-header-content">
                  <h3 className="healthcare-core-values-value-name">
                    {value.name}
                  </h3>
                  <p className="healthcare-core-values-value-description">
                    {value.description}
                  </p>
                </div>

                {interactive && (
                  <button
                    className="healthcare-core-values-value-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleExpanded(value.id)
                    }}
                    aria-label={`${value.name} ${isExpanded ? 'einklappen' : 'erweitern'}`}
                  >
                    <ChevronRight 
                      className={`healthcare-core-values-value-toggle-icon ${
                        isExpanded ? 'healthcare-core-values-value-toggle-icon--expanded' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Detailed Content */}
              {(showDetails || isExpanded) && value.details && (
                <div className="healthcare-core-values-value-details">
                  <p>{value.details}</p>
                </div>
              )}

              {/* Metrics */}
              {showMetrics && value.metrics && value.metrics.length > 0 && (
                <div className="healthcare-core-values-value-metrics">
                  <div className="healthcare-core-values-value-metrics-grid">
                    {value.metrics.map((metric, index) => (
                      <div key={index} className="healthcare-core-values-value-metric">
                        <div className="healthcare-core-values-value-metric-value">
                          {metric.value}
                        </div>
                        <div className="healthcare-core-values-value-metric-label">
                          {metric.label}
                        </div>
                        {metric.description && (
                          <div className="healthcare-core-values-value-metric-description">
                            {metric.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {showExamples && value.examples && value.examples.length > 0 && (
                <div className="healthcare-core-values-value-examples">
                  <h4>Umsetzung:</h4>
                  <ul>
                    {value.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {showCertifications && value.certifications && value.certifications.length > 0 && (
                <div className="healthcare-core-values-value-certifications">
                  <div className="healthcare-core-values-value-certifications-list">
                    {value.certifications.map((cert, index) => (
                      <button
                        key={index}
                        className="healthcare-core-values-value-certification"
                        onClick={(e) => handleCertificationClick(cert, e)}
                        title={`Mehr über ${cert} erfahren`}
                      >
                        <Award className="healthcare-core-values-value-certification-icon" />
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {onLearnMore && (
                <div className="healthcare-core-values-value-actions">
                  <button
                    className="healthcare-core-values-value-learn-more"
                    onClick={(e) => handleLearnMore(value, e)}
                  >
                    <BookOpen className="healthcare-core-values-value-learn-more-icon" />
                    Mehr erfahren
                    <ExternalLink className="healthcare-core-values-value-learn-more-arrow" />
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* Medical Disclaimer */}
      {medicalContext && (
        <div className="healthcare-core-values-disclaimer">
          <Shield className="healthcare-core-values-disclaimer-icon" />
          <p>
            <strong>Qualitätsversprechen:</strong> Diese Werte sind nicht nur Absichtserklärungen, 
            sondern werden durch messbare Qualitätsindikatoren und externe Zertifizierungen 
            kontinuierlich überprüft und sichergestellt.
          </p>
        </div>
      )}
    </div>
  )
}

CoreValues.displayName = 'CoreValues'