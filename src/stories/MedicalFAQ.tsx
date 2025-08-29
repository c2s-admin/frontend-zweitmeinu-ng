// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, HelpCircle, FileText,  Heart, Activity, Filter, X, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import './MedicalFAQ.css'

export interface FAQ {
  /** FAQ identifier */
  id: string
  /** Question text */
  question: string
  /** Answer text */
  answer: string
  /** Medical category */
  category?: string
  /** Medical specialty */
  specialty?: string
  /** FAQ tags for search */
  tags?: string[]
  /** Related FAQ IDs */
  relatedIds?: string[]
  /** View count */
  viewCount?: number
  /** Last updated date */
  lastUpdated?: Date
  /** Medical importance level */
  importance?: 'low' | 'medium' | 'high' | 'critical'
  /** Is verified by medical professional */
  medicallyVerified?: boolean
  /** Target audience */
  audience?: 'patient' | 'professional' | 'general'
}

export interface MedicalFAQProps {
  /** FAQ data */
  faqs?: FAQ[]
  /** Default selected categories */
  selectedCategories?: string[]
  /** Default search term */
  searchTerm?: string
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Layout variant */
  variant?: 'default' | 'compact' | 'cards' | 'list'
  /** Show category filters */
  showCategoryFilter?: boolean
  /** Show specialty filters */
  showSpecialtyFilter?: boolean
  /** Show search functionality */
  searchable?: boolean
  /** Show related questions */
  showRelatedQuestions?: boolean
  /** Show view counts */
  showViewCounts?: boolean
  /** Show medical verification badges */
  showVerificationBadges?: boolean
  /** Show importance levels */
  showImportanceLevels?: boolean
  /** Max related questions to show */
  maxRelatedQuestions?: number
  /** Auto-expand important FAQs */
  autoExpandImportant?: boolean
  /** Emergency mode highlighting */
  emergencyMode?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** FAQ expand/collapse handler */
  onFAQToggle?: (faqId: string, expanded: boolean) => void
  /** Search change handler */
  onSearchChange?: (searchTerm: string) => void
  /** Category filter change handler */
  onCategoryChange?: (categories: string[]) => void
  /** FAQ click handler */
  onFAQClick?: (faq: FAQ) => void
}

// Default medical FAQs for healthcare platform
const defaultMedicalFAQs: FAQ[] = [
  {
    id: 'what-is-zweitmeinung',
    question: 'Was ist eine medizinische Zweitmeinung?',
    answer: 'Eine medizinische Zweitmeinung ist die unabhängige Einschätzung eines zweiten Arztes zu Ihrer Diagnose oder Behandlung. Sie hilft Ihnen, die beste medizinische Entscheidung zu treffen und gibt Sicherheit bei wichtigen Gesundheitsfragen.',
    category: 'Allgemein',
    specialty: 'allgemeine-fragen',
    tags: ['zweitmeinung', 'diagnose', 'behandlung', 'arzt'],
    relatedIds: ['when-need-zweitmeinung', 'how-works-process'],
    viewCount: 1247,
    importance: 'high',
    medicallyVerified: true,
    audience: 'general'
  },
  {
    id: 'when-need-zweitmeinung',
    question: 'Wann sollte ich eine Zweitmeinung einholen?',
    answer: 'Eine Zweitmeinung ist besonders sinnvoll bei schwerwiegenden Diagnosen, vor größeren Operationen, bei seltenen Erkrankungen, wenn Sie sich unsicher fühlen, oder wenn verschiedene Ärzte unterschiedliche Meinungen haben.',
    category: 'Allgemein',
    specialty: 'allgemeine-fragen',
    tags: ['wann', 'operation', 'diagnose', 'unsicherheit'],
    relatedIds: ['what-is-zweitmeinung', 'costs-insurance'],
    viewCount: 892,
    importance: 'high',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'how-works-process',
    question: 'Wie läuft der Prozess der Zweitmeinung ab?',
    answer: 'Nach Ihrer Anmeldung erhalten Sie einen strukturierten Fragebogen. Sie laden relevante Befunde hoch, ein Facharzt prüft Ihren Fall und Sie erhalten innerhalb von 48h eine schriftliche Einschätzung. Bei Bedarf kann ein Gespräch vereinbart werden.',
    category: 'Prozess',
    specialty: 'allgemeine-fragen',
    tags: ['ablauf', 'prozess', 'fragebogen', 'befunde', '48h'],
    relatedIds: ['what-is-zweitmeinung', 'costs-insurance'],
    viewCount: 654,
    importance: 'medium',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'costs-insurance',
    question: 'Übernimmt die Krankenkasse die Kosten?',
    answer: 'Bei bestimmten medizinischen Eingriffen haben gesetzlich Versicherte Anspruch auf eine kostenlose Zweitmeinung. Private Krankenkassen übernehmen oft die Kosten. Wir beraten Sie gerne über die Möglichkeiten in Ihrem individuellen Fall.',
    category: 'Kosten',
    specialty: 'allgemeine-fragen',
    tags: ['krankenkasse', 'kosten', 'versicherung', 'anspruch'],
    relatedIds: ['when-need-zweitmeinung', 'how-works-process'],
    viewCount: 1156,
    importance: 'high',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'heart-surgery-zweitmeinung',
    question: 'Sollte ich vor einer Herzoperation eine Zweitmeinung einholen?',
    answer: 'Bei geplanten Herz-OPs ist eine Zweitmeinung sehr empfehlenswert. Kardiochirurgische Eingriffe sind komplex und verschiedene Behandlungsansätze möglich. Eine zweite Expertenmeinung kann alternative Therapien aufzeigen oder die geplante Operation bestätigen.',
    category: 'Kardiologie',
    specialty: 'kardiologie',
    tags: ['herzoperation', 'kardiochirurgie', 'herzeingriff'],
    relatedIds: ['when-need-zweitmeinung', 'emergency-heart-symptoms'],
    viewCount: 423,
    importance: 'critical',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'cancer-diagnosis-zweitmeinung',
    question: 'Ist eine Zweitmeinung bei Krebsdiagnose sinnvoll?',
    answer: 'Bei einer Krebsdiagnose ist eine Zweitmeinung sehr wichtig. Verschiedene Onkologen können unterschiedliche Therapieansätze vorschlagen. Eine zweite Meinung hilft, die beste Behandlung zu finden und gibt Ihnen Sicherheit bei dieser schwerwiegenden Diagnose.',
    category: 'Onkologie',
    specialty: 'onkologie',
    tags: ['krebs', 'tumor', 'onkologie', 'therapie', 'chemotherapie'],
    relatedIds: ['when-need-zweitmeinung', 'what-documents-needed'],
    viewCount: 789,
    importance: 'critical',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'emergency-heart-symptoms',
    question: 'Was sind Notfall-Symptome bei Herzproblemen?',
    answer: 'Rufen Sie sofort 112 bei: starke Brustschmerzen, Atemnot, Übelkeit mit Brustschmerzen, Schmerzen im Arm/Kiefer, kalter Schweiß. Bei akuten Herzproblemen ist keine Zeit für eine Zweitmeinung - gehen Sie sofort ins Krankenhaus!',
    category: 'Notfall',
    specialty: 'kardiologie',
    tags: ['notfall', 'herzinfarkt', 'brustschmerzen', '112', 'atemnot'],
    relatedIds: ['heart-surgery-zweitmeinung'],
    viewCount: 234,
    importance: 'critical',
    medicallyVerified: true,
    audience: 'general'
  },
  {
    id: 'what-documents-needed',
    question: 'Welche Unterlagen benötige ich für eine Zweitmeinung?',
    answer: 'Wichtige Dokumente sind: Arztbriefe, Laborwerte, Bildgebung (Röntgen, CT, MRT), Pathologie-Befunde, aktuelle Medikamentenliste, Vorbefunde. Je vollständiger die Unterlagen, desto präziser die Zweitmeinung.',
    category: 'Unterlagen',
    specialty: 'allgemeine-fragen',
    tags: ['unterlagen', 'dokumente', 'befunde', 'röntgen', 'labor'],
    relatedIds: ['how-works-process', 'data-protection'],
    viewCount: 567,
    importance: 'medium',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'data-protection',
    question: 'Wie wird der Datenschutz gewährleistet?',
    answer: 'Ihre medizinischen Daten unterliegen der ärztlichen Schweigepflicht und werden DSGVO-konform behandelt. Alle Übertragungen sind SSL-verschlüsselt, Server stehen in Deutschland, und nur autorisierte Fachärzte haben Zugriff auf Ihre Daten.',
    category: 'Datenschutz',
    specialty: 'allgemeine-fragen',
    tags: ['datenschutz', 'dsgvo', 'schweigepflicht', 'verschlüsselung'],
    relatedIds: ['what-documents-needed', 'how-works-process'],
    viewCount: 445,
    importance: 'high',
    medicallyVerified: true,
    audience: 'general'
  },
  {
    id: 'gallbladder-surgery-alternatives',
    question: 'Gibt es Alternativen zur Gallenblasen-OP?',
    answer: 'Bei Gallensteinen gibt es verschiedene Behandlungsoptionen: minimal-invasive Laparoskopie, medikamentöse Auflösung, Stoßwellentherapie oder konservative Behandlung. Die beste Option hängt von Größe, Lage und Symptomen ab.',
    category: 'Gallenblase',
    specialty: 'gallenblase',
    tags: ['gallensteine', 'laparoskopie', 'operation', 'alternativen'],
    relatedIds: ['when-need-zweitmeinung'],
    viewCount: 321,
    importance: 'medium',
    medicallyVerified: true,
    audience: 'patient'
  }
]

// Get icon for medical category
const getCategoryIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'kardiologie':
      return Heart
    case 'onkologie':
      return Activity
    case 'notfall':
      return AlertTriangle
    case 'allgemein':
      return HelpCircle
    case 'prozess':
    case 'unterlagen':
      return FileText
    default:
      return HelpCircle
  }
}

// Get importance color
const getImportanceColor = (importance?: string) => {
  switch (importance) {
    case 'critical':
      return '#dc2626'
    case 'high':
      return '#f59e0b'
    case 'medium':
      return '#10b981'
    case 'low':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}

export const MedicalFAQ = ({
  faqs = defaultMedicalFAQs,
  selectedCategories = [],
  searchTerm = '',
  size = 'medium',
  variant = 'default',
  showCategoryFilter = true,
  showSpecialtyFilter = false,
  searchable = true,
  showRelatedQuestions = true,
  showViewCounts = false,
  showVerificationBadges = true,
  showImportanceLevels = true,
  maxRelatedQuestions = 3,
  autoExpandImportant = true,
  emergencyMode = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onFAQToggle,
  onSearchChange,
  onCategoryChange,
  onFAQClick,
  ...props
}: MedicalFAQProps) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<string[]>(selectedCategories)
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set())
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})

  // Get unique categories and specialties
  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))
    return cats.sort()
  }, [faqs])

  const _specialties = useMemo(() => {
    const specs = Array.from(new Set(faqs.map(faq => faq.specialty).filter(Boolean)))
    return specs.sort()
  }, [faqs])

  // Filter and search FAQs
  const filteredFAQs = useMemo(() => {
    let filtered = faqs

    // Emergency mode - show only critical importance
    if (emergencyMode) {
      filtered = filtered.filter(faq => faq.importance === 'critical')
    }

    // Category filter
    if (internalSelectedCategories.length > 0) {
      filtered = filtered.filter(faq => 
        faq.category && internalSelectedCategories.includes(faq.category)
      )
    }

    // Search filter
    if (internalSearchTerm) {
      const searchLower = internalSearchTerm.toLowerCase()
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        faq.category?.toLowerCase().includes(searchLower)
      )
    }

    // Sort by importance and view count
    return filtered.sort((a, b) => {
      // Emergency items first
      if (a.importance === 'critical' && b.importance !== 'critical') return -1
      if (b.importance === 'critical' && a.importance !== 'critical') return 1
      
      // Then by view count
      const aViews = (a.viewCount || 0) + (viewCounts[a.id] || 0)
      const bViews = (b.viewCount || 0) + (viewCounts[b.id] || 0)
      return bViews - aViews
    })
  }, [faqs, internalSelectedCategories, internalSearchTerm, emergencyMode, viewCounts])

  // Get related FAQs
  const getRelatedFAQs = (faq: FAQ): FAQ[] => {
    if (!faq.relatedIds) return []
    return faqs
      .filter(f => faq.relatedIds!.includes(f.id))
      .slice(0, maxRelatedQuestions)
  }

  // Auto-expand important FAQs
  useEffect(() => {
    if (autoExpandImportant) {
      const importantIds = filteredFAQs
        .filter(faq => faq.importance === 'critical' || faq.importance === 'high')
        .slice(0, 2) // Only auto-expand first 2 important FAQs
        .map(faq => faq.id)
      
      setExpandedFAQs(new Set(importantIds))
    }
  }, [filteredFAQs, autoExpandImportant])

  const containerClasses = `
    medical-faq-container
    medical-faq-container--${size}
    medical-faq-container--${variant}
    ${emergencyMode ? 'medical-faq-container--emergency' : ''}
    ${loading ? 'medical-faq-container--loading' : ''}
    ${className}
  `.trim()

  // Handle FAQ toggle
  const handleFAQToggle = (faq: FAQ) => {
    const isExpanded = expandedFAQs.has(faq.id)
    const newExpanded = new Set(expandedFAQs)
    
    if (isExpanded) {
      newExpanded.delete(faq.id)
    } else {
      newExpanded.add(faq.id)
      // Increment view count
      setViewCounts(prev => ({ ...prev, [faq.id]: (prev[faq.id] || 0) + 1 }))
    }
    
    setExpandedFAQs(newExpanded)
    onFAQToggle?.(faq.id, !isExpanded)
    onFAQClick?.(faq)
  }

  // Handle search
  const handleSearch = (term: string) => {
    setInternalSearchTerm(term)
    onSearchChange?.(term)
  }

  // Handle category filter
  const handleCategoryToggle = (category: string) => {
    const newCategories = internalSelectedCategories.includes(category)
      ? internalSelectedCategories.filter(c => c !== category)
      : [...internalSelectedCategories, category]
    
    setInternalSelectedCategories(newCategories)
    onCategoryChange?.(newCategories)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setInternalSearchTerm('')
    setInternalSelectedCategories([])
    onSearchChange?.('')
    onCategoryChange?.([])
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="medical-faq-skeleton">
          <div className="medical-faq-skeleton-header" />
          {[...Array(6)].map((_, index) => (
            <div key={index} className="medical-faq-skeleton-item">
              <div className="medical-faq-skeleton-question" />
              <div className="medical-faq-skeleton-answer" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Medizinische FAQ - Häufig gestellte Fragen'}
      {...props}
    >
      {/* Header */}
      <div className="medical-faq-header">
        <div className="medical-faq-title-container">
          <HelpCircle className="medical-faq-title-icon" />
          <div>
            <h2 className="medical-faq-title">
              {emergencyMode ? '🚨 Notfall-FAQ' : 'Häufig gestellte Fragen'}
            </h2>
            <p className="medical-faq-subtitle">
              {emergencyMode 
                ? 'Kritische medizinische Informationen' 
                : 'Antworten zu medizinischen Zweitmeinungen'
              }
            </p>
          </div>
        </div>

        {/* Search */}
        {searchable && (
          <div className="medical-faq-search">
            <div className="medical-faq-search-input-wrapper">
              <Search className="medical-faq-search-icon" />
              <input
                type="text"
                className="medical-faq-search-input"
                placeholder="FAQ durchsuchen..."
                value={internalSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="FAQ durchsuchen"
              />
              {internalSearchTerm && (
                <button
                  className="medical-faq-search-clear"
                  onClick={() => handleSearch('')}
                  aria-label="Suche löschen"
                >
                  <X />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {(showCategoryFilter || showSpecialtyFilter) && (
        <div className="medical-faq-filters">
          {showCategoryFilter && (
            <div className="medical-faq-filter-group">
              <Filter className="medical-faq-filter-icon" />
              <span className="medical-faq-filter-label">Kategorien:</span>
              <div className="medical-faq-filter-tags">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`medical-faq-filter-tag ${
                      internalSelectedCategories.includes(category) 
                        ? 'medical-faq-filter-tag--active' 
                        : ''
                    }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {React.createElement(getCategoryIcon(category), { 
                      className: 'medical-faq-filter-tag-icon' 
                    })}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(internalSelectedCategories.length > 0 || internalSearchTerm) && (
            <button
              className="medical-faq-clear-filters"
              onClick={clearAllFilters}
            >
              <X className="medical-faq-clear-filters-icon" />
              Alle Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="medical-faq-results-summary">
        <p>
          <strong>{filteredFAQs.length}</strong> von <strong>{faqs.length}</strong> FAQs gefunden
          {internalSearchTerm && ` für "${internalSearchTerm}"`}
          {internalSelectedCategories.length > 0 && 
            ` in ${internalSelectedCategories.length} Kategorie${internalSelectedCategories.length !== 1 ? 'n' : ''}`
          }
        </p>
      </div>

      {/* FAQ List */}
      <div className="medical-faq-list">
        {filteredFAQs.length === 0 ? (
          <div className="medical-faq-empty-state">
            <HelpCircle className="medical-faq-empty-icon" />
            <p>Keine FAQs gefunden.</p>
            <p className="medical-faq-empty-hint">
              Versuchen Sie andere Suchbegriffe oder entfernen Sie Filter.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedFAQs.has(faq.id)
            const relatedFAQs = showRelatedQuestions ? getRelatedFAQs(faq) : []
            const totalViews = (faq.viewCount || 0) + (viewCounts[faq.id] || 0)

            const itemClasses = `
              medical-faq-item
              medical-faq-item--${variant}
              ${isExpanded ? 'medical-faq-item--expanded' : ''}
              ${faq.importance === 'critical' ? 'medical-faq-item--critical' : ''}
              ${faq.importance === 'high' ? 'medical-faq-item--high' : ''}
            `.trim()

            return (
              <div key={faq.id} className={itemClasses}>
                {/* Question Header */}
                <div
                  className="medical-faq-question"
                  onClick={() => handleFAQToggle(faq)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${faq.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleFAQToggle(faq)
                    }
                  }}
                >
                  <div className="medical-faq-question-content">
                    <div className="medical-faq-question-main">
                      {React.createElement(getCategoryIcon(faq.category), { 
                        className: 'medical-faq-question-icon',
                        style: { color: getImportanceColor(faq.importance) }
                      })}
                      <span className="medical-faq-question-text">{faq.question}</span>
                    </div>

                    <div className="medical-faq-question-meta">
                      {/* Importance Badge */}
                      {showImportanceLevels && faq.importance && (
                        <div 
                          className={`medical-faq-importance medical-faq-importance--${faq.importance}`}
                          style={{ backgroundColor: getImportanceColor(faq.importance) }}
                        >
                          {faq.importance === 'critical' && '🚨'}
                          {faq.importance === 'high' && '❗'}
                          {faq.importance === 'medium' && 'ℹ️'}
                        </div>
                      )}

                      {/* Medical Verification */}
                      {showVerificationBadges && faq.medicallyVerified && (
                        <div className="medical-faq-verified">
                          <CheckCircle className="medical-faq-verified-icon" />
                          <span>Ärztlich geprüft</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      {faq.category && (
                        <div className="medical-faq-category-badge">
                          {faq.category}
                        </div>
                      )}

                      {/* View Count */}
                      {showViewCounts && totalViews > 0 && (
                        <div className="medical-faq-view-count">
                          👁️ {totalViews}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="medical-faq-toggle-icon">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* Answer Content */}
                {isExpanded && (
                  <div 
                    id={`faq-answer-${faq.id}`}
                    className="medical-faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                  >
                    <div className="medical-faq-answer-content">
                      <p>{faq.answer}</p>

                      {/* Tags */}
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="medical-faq-tags">
                          <span className="medical-faq-tags-label">Tags:</span>
                          {faq.tags.map((tag, index) => (
                            <span key={index} className="medical-faq-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Related Questions */}
                      {relatedFAQs.length > 0 && (
                        <div className="medical-faq-related">
                          <h4 className="medical-faq-related-title">
                            <ArrowRight className="medical-faq-related-icon" />
                            Verwandte Fragen:
                          </h4>
                          <ul className="medical-faq-related-list">
                            {relatedFAQs.map(relatedFAQ => (
                              <li key={relatedFAQ.id}>
                                <button
                                  className="medical-faq-related-link"
                                  onClick={() => handleFAQToggle(relatedFAQ)}
                                >
                                  {React.createElement(getCategoryIcon(relatedFAQ.category), { 
                                    className: 'medical-faq-related-link-icon' 
                                  })}
                                  {relatedFAQ.question}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

MedicalFAQ.displayName = 'MedicalFAQ'
// @ts-nocheck
