import React, { useState, useEffect } from 'react'
import { Heart, Activity, Droplets, Zap, UserPlus, HelpCircle, CheckCircle, AlertTriangle, Circle } from 'lucide-react'
import './SpecialtySelector.css'

export interface MedicalSpecialty {
  /** Specialty identifier */
  id: string
  /** Specialty name */
  name: string
  /** Specialty description */
  description: string
  /** Detailed explanation */
  details?: string
  /** Color theme for specialty */
  color: string
  /** FAQ count for this specialty */
  faqCount?: number
  /** Available doctors count */
  doctorCount?: number
  /** Average response time */
  responseTime?: string
  /** Example conditions */
  conditions?: string[]
  /** Whether specialty is available for emergency consultations */
  emergencyAvailable?: boolean
  /** Specialty is currently unavailable */
  unavailable?: boolean
}

export interface SpecialtySelectorProps {
  /** Available medical specialties */
  specialties?: MedicalSpecialty[]
  /** Selection mode */
  mode?: 'single' | 'multiple'
  /** Selected specialty IDs */
  selectedIds?: string[]
  /** Default selected specialty IDs */
  defaultSelectedIds?: string[]
  /** Layout variant */
  layout?: 'grid' | 'list' | 'cards'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Show specialty details */
  showDetails?: boolean
  /** Show doctor counts */
  showDoctorCounts?: boolean
  /** Show FAQ counts */
  showFaqCounts?: boolean
  /** Show response times */
  showResponseTimes?: boolean
  /** Show example conditions */
  showConditions?: boolean
  /** Emergency mode highlighting */
  emergencyMode?: boolean
  /** Search functionality */
  searchable?: boolean
  /** Custom title */
  title?: string
  /** Custom subtitle */
  subtitle?: string
  /** Show "General Questions" option */
  showGeneralQuestions?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[], selectedSpecialties: MedicalSpecialty[]) => void
  /** Specialty click handler */
  onSpecialtyClick?: (specialty: MedicalSpecialty) => void
  /** Search change handler */
  onSearchChange?: (searchTerm: string) => void
}

// Default medical specialties for zweitmeinung.ng
const defaultSpecialties: MedicalSpecialty[] = [
  {
    id: 'kardiologie',
    name: 'Kardiologie',
    description: 'Herz- und Kreislauferkrankungen',
    details: 'Diagnose und Behandlung von Herzerkrankungen, Bluthochdruck, Herzrhythmusstörungen und Gefäßerkrankungen',
    // icon will be rendered based on specialty type
    color: '#dc2626',
    faqCount: 45,
    doctorCount: 8,
    responseTime: '24h',
    conditions: ['Herzinfarkt', 'Bluthochdruck', 'Herzrhythmusstörungen', 'Herzschwäche'],
    emergencyAvailable: true
  },
  {
    id: 'onkologie',
    name: 'Onkologie',
    description: 'Krebserkrankungen und Tumore',
    details: 'Früherkennung, Diagnose und Behandlung von Krebserkrankungen sowie Tumornachsorge',
    // icon will be rendered based on specialty type
    color: '#7c3aed',
    faqCount: 67,
    doctorCount: 12,
    responseTime: '48h',
    conditions: ['Brustkrebs', 'Darmkrebs', 'Lungenkrebs', 'Lymphome'],
    emergencyAvailable: false
  },
  {
    id: 'gallenblase',
    name: 'Gallenblase',
    description: 'Gallenblasen- und Gallenwegerkrankungen',
    details: 'Behandlung von Gallensteinen, Gallenblasenentzündungen und Erkrankungen der Gallenwege',
    // icon will be rendered based on specialty type
    color: '#f59e0b',
    faqCount: 28,
    doctorCount: 6,
    responseTime: '36h',
    conditions: ['Gallensteine', 'Gallenkolik', 'Gallenblasenentzündung', 'Gallenwegsverschluss'],
    emergencyAvailable: true
  },
  {
    id: 'nephrologie',
    name: 'Nephrologie',
    description: 'Nierenerkrankungen',
    details: 'Diagnose und Therapie von Nierenerkrankungen, Dialyse und Nierentransplantation',
    // icon will be rendered based on specialty type
    color: '#2563eb',
    faqCount: 39,
    doctorCount: 7,
    responseTime: '32h',
    conditions: ['Niereninsuffizienz', 'Nierensteine', 'Dialyse', 'Bluthochdruck'],
    emergencyAvailable: false
  },
  {
    id: 'schilddruese',
    name: 'Schilddrüse',
    description: 'Schilddrüsen- und Stoffwechselerkrankungen',
    details: 'Behandlung von Schilddrüsenerkrankungen, Stoffwechselstörungen und Hormontherapie',
    // icon will be rendered based on specialty type
    color: '#10b981',
    faqCount: 52,
    doctorCount: 5,
    responseTime: '28h',
    conditions: ['Schilddrüsenüberfunktion', 'Hashimoto', 'Schilddrüsenknoten', 'Kropf'],
    emergencyAvailable: false
  },
  {
    id: 'intensivmedizin',
    name: 'Intensivmedizin',
    description: 'Intensivpflege und Notfallmedizin',
    details: 'Behandlung kritisch kranker Patienten und medizinische Notfallversorgung',
    // icon will be rendered based on specialty type
    color: '#ea580c',
    faqCount: 34,
    doctorCount: 15,
    responseTime: '2h',
    conditions: ['Sepsis', 'Beatmung', 'Schockzustände', 'Multiorganversagen'],
    emergencyAvailable: true
  }
]

const generalQuestionsSpecialty: MedicalSpecialty = {
  id: 'allgemeine-fragen',
  name: 'Allgemeine Fragen',
  description: 'Allgemeine medizinische Beratung',
  details: 'Allgemeine Gesundheitsfragen, Präventionsmedizin und medizinische Beratung',
  // icon will be rendered based on specialty type
  color: '#6b7280',
  faqCount: 89,
  doctorCount: 20,
  responseTime: '12h',
  conditions: ['Vorsorge', 'Impfungen', 'Gesunde Lebensführung', 'Medikamente'],
  emergencyAvailable: false
}

// Get icon component for specialty type
const getSpecialtyIconComponent = (specialtyId?: string) => {
  switch (specialtyId) {
    case 'kardiologie':
      return Heart
    case 'onkologie':
      return Activity
    case 'gallenblase':
      return Droplets
    case 'nephrologie':
      return Circle
    case 'schilddruese':
      return Zap
    case 'intensivmedizin':
      return AlertTriangle
    case 'allgemeine-fragen':
      return HelpCircle
    default:
      return UserPlus
  }
}

export const SpecialtySelector = ({
  specialties = defaultSpecialties,
  mode = 'single',
  selectedIds = [],
  defaultSelectedIds = [],
  layout = 'grid',
  size = 'medium',
  showDetails = false,
  showDoctorCounts = true,
  showFaqCounts = false,
  showResponseTimes = true,
  showConditions = false,
  emergencyMode = false,
  searchable = false,
  title = 'Wählen Sie Ihren Fachbereich',
  subtitle = 'Unsere Fachärzte stehen Ihnen zur Verfügung',
  showGeneralQuestions = true,
  loading = false,
  className = '',
  onSelectionChange,
  onSpecialtyClick,
  onSearchChange,
  ...props
}: SpecialtySelectorProps) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds.length > 0 ? selectedIds : defaultSelectedIds
  )
  const [searchTerm, setSearchTerm] = useState('')

  const allSpecialties = showGeneralQuestions 
    ? [...specialties, generalQuestionsSpecialty]
    : specialties

  // Filter specialties based on search
  const filteredSpecialties = searchTerm
    ? allSpecialties.filter(specialty => 
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.conditions?.some(condition => 
          condition.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : allSpecialties

  const containerClasses = `
    specialty-selector-container
    specialty-selector-container--${size}
    specialty-selector-container--${layout}
    ${emergencyMode ? 'specialty-selector-container--emergency' : ''}
    ${loading ? 'specialty-selector-container--loading' : ''}
    ${className}
  `.trim()

  // Handle specialty selection
  const handleSpecialtySelect = (specialty: MedicalSpecialty) => {
    if (specialty.unavailable) return

    let newSelectedIds: string[]

    if (mode === 'single') {
      newSelectedIds = [specialty.id]
    } else {
      if (internalSelectedIds.includes(specialty.id)) {
        newSelectedIds = internalSelectedIds.filter(id => id !== specialty.id)
      } else {
        newSelectedIds = [...internalSelectedIds, specialty.id]
      }
    }

    setInternalSelectedIds(newSelectedIds)
    
    const selectedSpecialties = allSpecialties.filter(s => 
      newSelectedIds.includes(s.id)
    )
    
    onSelectionChange?.(newSelectedIds, selectedSpecialties)
    onSpecialtyClick?.(specialty)
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    onSearchChange?.(term)
  }

  // Update internal state when selectedIds prop changes
  useEffect(() => {
    if (selectedIds.length > 0) {
      setInternalSelectedIds(selectedIds)
    }
  }, [selectedIds])

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="specialty-selector-header">
          <div className="specialty-selector-header-skeleton" />
          <div className="specialty-selector-subtitle-skeleton" />
        </div>
        
        <div className="specialty-selector-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="specialty-card-skeleton">
              <div className="specialty-card-skeleton-icon" />
              <div className="specialty-card-skeleton-content">
                <div className="specialty-card-skeleton-title" />
                <div className="specialty-card-skeleton-description" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses} {...props}>
      {/* Header */}
      <div className="specialty-selector-header">
        <h2 className="specialty-selector-title">{title}</h2>
        {subtitle && (
          <p className="specialty-selector-subtitle">{subtitle}</p>
        )}
        
        {/* Emergency Mode Banner */}
        {emergencyMode && (
          <div className="specialty-selector-emergency-banner">
            <AlertTriangle className="specialty-selector-emergency-icon" />
            <span>Notfall-Modus: Nur Fachbereiche mit Notfall-Verfügbarkeit werden angezeigt</span>
          </div>
        )}

        {/* Search */}
        {searchable && (
          <div className="specialty-selector-search">
            <input
              type="text"
              className="specialty-selector-search-input"
              placeholder="Fachbereich oder Erkrankung suchen..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Specialties Grid/List */}
      <div className={`specialty-selector-${layout}`}>
        {filteredSpecialties
          .filter(specialty => !emergencyMode || specialty.emergencyAvailable)
          .map((specialty) => {
            const isSelected = internalSelectedIds.includes(specialty.id)
            const isUnavailable = specialty.unavailable

            const cardClasses = `
              specialty-card
              specialty-card--${layout}
              specialty-card--${size}
              ${isSelected ? 'specialty-card--selected' : ''}
              ${isUnavailable ? 'specialty-card--unavailable' : ''}
              ${emergencyMode && specialty.emergencyAvailable ? 'specialty-card--emergency-available' : ''}
            `.trim()

            return (
              <div
                key={specialty.id}
                className={cardClasses}
                style={{ '--specialty-color': specialty.color } as React.CSSProperties}
                onClick={() => handleSpecialtySelect(specialty)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-disabled={isUnavailable}
                aria-label={`${specialty.name} - ${specialty.description}${isSelected ? ' (ausgewählt)' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSpecialtySelect(specialty)
                  }
                }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="specialty-card-selected-indicator">
                    <CheckCircle className="specialty-card-selected-icon" />
                  </div>
                )}

                {/* Emergency Indicator */}
                {emergencyMode && specialty.emergencyAvailable && (
                  <div className="specialty-card-emergency-indicator">
                    <AlertTriangle className="specialty-card-emergency-icon" />
                  </div>
                )}

                {/* Icon */}
                <div className="specialty-card-icon">
                  {React.createElement(getSpecialtyIconComponent(specialty.id), { className: 'specialty-icon' })}
                </div>

                {/* Content */}
                <div className="specialty-card-content">
                  <h3 className="specialty-card-title">{specialty.name}</h3>
                  <p className="specialty-card-description">{specialty.description}</p>

                  {/* Details */}
                  {showDetails && specialty.details && (
                    <p className="specialty-card-details">{specialty.details}</p>
                  )}

                  {/* Metadata */}
                  <div className="specialty-card-metadata">
                    {showDoctorCounts && specialty.doctorCount && (
                      <div className="specialty-card-meta-item">
                        <UserPlus className="specialty-card-meta-icon" />
                        <span>{specialty.doctorCount} Ärzte</span>
                      </div>
                    )}
                    
                    {showResponseTimes && specialty.responseTime && (
                      <div className="specialty-card-meta-item">
                        <span>⏱️ {specialty.responseTime}</span>
                      </div>
                    )}

                    {showFaqCounts && specialty.faqCount && (
                      <div className="specialty-card-meta-item">
                        <HelpCircle className="specialty-card-meta-icon" />
                        <span>{specialty.faqCount} FAQ</span>
                      </div>
                    )}
                  </div>

                  {/* Conditions */}
                  {showConditions && specialty.conditions && (
                    <div className="specialty-card-conditions">
                      <span className="specialty-card-conditions-label">Beispiele:</span>
                      <div className="specialty-card-conditions-list">
                        {specialty.conditions.slice(0, 3).map((condition, index) => (
                          <span key={index} className="specialty-card-condition">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Unavailable Overlay */}
                {isUnavailable && (
                  <div className="specialty-card-unavailable-overlay">
                    <span>Derzeit nicht verfügbar</span>
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* No Results */}
      {searchTerm && filteredSpecialties.length === 0 && (
        <div className="specialty-selector-no-results">
          <HelpCircle className="specialty-selector-no-results-icon" />
          <p>Keine Fachbereiche gefunden für "{searchTerm}"</p>
          <p className="specialty-selector-no-results-hint">
            Versuchen Sie es mit anderen Suchbegriffen oder wählen Sie "Allgemeine Fragen"
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {mode === 'multiple' && internalSelectedIds.length > 0 && (
        <div className="specialty-selector-summary">
          <p>
            <strong>{internalSelectedIds.length}</strong> Fachbereich{internalSelectedIds.length !== 1 ? 'e' : ''} ausgewählt
          </p>
        </div>
      )}
    </div>
  )
}

SpecialtySelector.displayName = 'SpecialtySelector'