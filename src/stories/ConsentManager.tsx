import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Shield, Check, X, AlertTriangle, Info, Eye, EyeOff, 
  Settings, Clock, FileText, Lock, User, Database,
  ChevronDown, ChevronRight, Download, Trash2
} from 'lucide-react'
import './ConsentManager.css'

export interface ConsentCategory {
  /** Category identifier */
  id: string
  /** Category name */
  name: string
  /** Category description */
  description: string
  /** Whether this category is essential/required */
  essential?: boolean
  /** Current consent status */
  consented: boolean
  /** Data processing purposes */
  purposes?: string[]
  /** Data retention period */
  retentionPeriod?: string
  /** Third party processors */
  thirdParties?: string[]
  /** Legal basis */
  legalBasis?: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  /** Last consent change */
  lastChanged?: Date
  /** Consent method */
  consentMethod?: 'explicit' | 'implicit' | 'pre_checked' | 'opt_out'
}

export interface ConsentRecord {
  /** Record identifier */
  id: string
  /** Consent timestamp */
  timestamp: Date
  /** User identifier (anonymized) */
  userId: string
  /** Consent categories and statuses */
  categories: Record<string, boolean>
  /** Consent method used */
  method: 'banner' | 'settings' | 'registration' | 'update'
  /** IP address (anonymized) */
  ipAddress?: string
  /** User agent */
  userAgent?: string
  /** Version of privacy policy */
  policyVersion: string
}

export interface ConsentManagerProps {
  /** Available consent categories */
  categories?: ConsentCategory[]
  /** Current consent record */
  currentConsents?: Record<string, boolean>
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Layout variant */
  variant?: 'banner' | 'modal' | 'settings' | 'inline'
  /** Show detailed information */
  showDetails?: boolean
  /** Show consent history */
  showHistory?: boolean
  /** Show data usage */
  showDataUsage?: boolean
  /** Allow granular consent */
  allowGranular?: boolean
  /** GDPR compliance mode */
  gdprMode?: boolean
  /** Medical data consent */
  medicalMode?: boolean
  /** Privacy policy version */
  policyVersion?: string
  /** Privacy policy URL */
  policyUrl?: string
  /** Contact email for privacy matters */
  contactEmail?: string
  /** Organization name */
  organizationName?: string
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Accept all handler */
  onAcceptAll?: () => void
  /** Reject all handler */
  onRejectAll?: () => void
  /** Save preferences handler */
  onSavePreferences?: (consents: Record<string, boolean>) => void
  /** Category consent change handler */
  onConsentChange?: (categoryId: string, consented: boolean) => void
  /** Settings open handler */
  onOpenSettings?: () => void
  /** Privacy policy view handler */
  onViewPolicy?: () => void
  /** Data download request handler */
  onDownloadData?: () => void
  /** Data deletion request handler */
  onDeleteData?: () => void
  /** Close handler */
  onClose?: () => void
}

// Default consent categories for healthcare
const defaultConsentCategories: ConsentCategory[] = [
  {
    id: 'essential',
    name: 'Essentiell',
    description: 'Technisch notwendige Cookies und Daten für die Grundfunktionen der Plattform. Diese können nicht deaktiviert werden.',
    essential: true,
    consented: true,
    purposes: ['Sitzungsverwaltung', 'Sicherheit', 'Funktionsfähigkeit'],
    retentionPeriod: 'Sitzung',
    legalBasis: 'contract',
    lastChanged: new Date(),
    consentMethod: 'explicit'
  },
  {
    id: 'medical_data',
    name: 'Medizinische Datenverarbeitung',
    description: 'Verarbeitung und Speicherung Ihrer medizinischen Unterlagen für die Zweitmeinungsberatung. DSGVO-konform verschlüsselt.',
    essential: false,
    consented: false,
    purposes: ['Medizinische Beratung', 'Arzt-Patienten-Kommunikation', 'Befundanalyse'],
    retentionPeriod: '10 Jahre (gesetzlich)',
    legalBasis: 'consent',
    thirdParties: ['Spezialisierte Fachärzte', 'Medizinische Bildanalysedienste'],
    consentMethod: 'explicit'
  },
  {
    id: 'analytics',
    name: 'Analyse und Statistik',
    description: 'Anonymisierte Nutzungsstatistiken zur Verbesserung unserer Dienste. Keine personenbezogenen medizinischen Daten.',
    essential: false,
    consented: false,
    purposes: ['Webseitenoptimierung', 'Nutzungsanalyse', 'Performance-Messung'],
    retentionPeriod: '26 Monate',
    legalBasis: 'legitimate_interests',
    thirdParties: ['Google Analytics (anonymisiert)'],
    consentMethod: 'explicit'
  },
  {
    id: 'marketing',
    name: 'Marketing und Kommunikation',
    description: 'Personalisierte Gesundheitsinformationen und Benachrichtigungen über neue medizinische Services.',
    essential: false,
    consented: false,
    purposes: ['Newsletter', 'Serviceinformationen', 'Gesundheitstipps'],
    retentionPeriod: 'Bis Widerruf',
    legalBasis: 'consent',
    thirdParties: ['E-Mail-Service-Provider'],
    consentMethod: 'explicit'
  }
]

// Get legal basis display text
const getLegalBasisText = (basis?: ConsentCategory['legalBasis']): string => {
  switch (basis) {
    case 'consent':
      return 'Einwilligung'
    case 'contract':
      return 'Vertragserfüllung'
    case 'legal_obligation':
      return 'Rechtliche Verpflichtung'
    case 'vital_interests':
      return 'Lebenswichtige Interessen'
    case 'public_task':
      return 'Öffentliche Aufgabe'
    case 'legitimate_interests':
      return 'Berechtigte Interessen'
    default:
      return 'Nicht spezifiziert'
  }
}

// Get consent method display text
const getConsentMethodText = (method?: ConsentCategory['consentMethod']): string => {
  switch (method) {
    case 'explicit':
      return 'Ausdrücklich'
    case 'implicit':
      return 'Stillschweigend'
    case 'pre_checked':
      return 'Vorangekreuzt'
    case 'opt_out':
      return 'Opt-Out'
    default:
      return 'Unbekannt'
  }
}

export const ConsentManager = ({
  categories = defaultConsentCategories,
  currentConsents = {},
  size = 'medium',
  variant = 'modal',
  showDetails = false,
  showHistory = false,
  showDataUsage = true,
  allowGranular = true,
  gdprMode = true,
  medicalMode = true,
  policyVersion = '2.1',
  policyUrl = '/datenschutz',
  contactEmail = 'datenschutz@zweitmeinung.ng',
  organizationName = 'zweitmeinung.ng',
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  onConsentChange,
  onOpenSettings,
  onViewPolicy,
  onDownloadData,
  onDeleteData,
  onClose,
  ...props
}: ConsentManagerProps) => {
  const [internalConsents, setInternalConsents] = useState<Record<string, boolean>>(() => {
    // Initialize with current consents or defaults
    const initial: Record<string, boolean> = {}
    categories.forEach(cat => {
      initial[cat.id] = currentConsents[cat.id] ?? cat.consented
    })
    return initial
  })
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Update internal consents when props change
  useEffect(() => {
    const updated: Record<string, boolean> = {}
    categories.forEach(cat => {
      updated[cat.id] = currentConsents[cat.id] ?? cat.consented
    })
    setInternalConsents(updated)
  }, [categories, currentConsents])

  const containerClasses = `
    healthcare-consent-container
    healthcare-consent-container--${size}
    healthcare-consent-container--${variant}
    ${gdprMode ? 'healthcare-consent-container--gdpr' : ''}
    ${medicalMode ? 'healthcare-consent-container--medical' : ''}
    ${loading ? 'healthcare-consent-container--loading' : ''}
    ${className}
  `.trim()

  // Handle accept all
  const handleAcceptAll = useCallback(() => {
    const allAccepted: Record<string, boolean> = {}
    categories.forEach(cat => {
      allAccepted[cat.id] = true
    })
    setInternalConsents(allAccepted)
    onAcceptAll?.()
    onSavePreferences?.(allAccepted)
  }, [categories, onAcceptAll, onSavePreferences])

  // Handle reject all (except essential)
  const handleRejectAll = useCallback(() => {
    const essentialOnly: Record<string, boolean> = {}
    categories.forEach(cat => {
      essentialOnly[cat.id] = cat.essential || false
    })
    setInternalConsents(essentialOnly)
    onRejectAll?.()
    onSavePreferences?.(essentialOnly)
  }, [categories, onRejectAll, onSavePreferences])

  // Handle save preferences
  const handleSavePreferences = useCallback(() => {
    onSavePreferences?.(internalConsents)
  }, [internalConsents, onSavePreferences])

  // Handle consent change
  const handleConsentChange = useCallback((categoryId: string, consented: boolean) => {
    setInternalConsents(prev => ({
      ...prev,
      [categoryId]: consented
    }))
    onConsentChange?.(categoryId, consented)
  }, [onConsentChange])

  // Toggle category expansion
  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }, [])

  // Calculate consent statistics
  const consentStats = useMemo(() => {
    const total = categories.length
    const consented = categories.filter(cat => internalConsents[cat.id]).length
    const essential = categories.filter(cat => cat.essential).length
    const optional = total - essential
    const optionalConsented = categories.filter(cat => !cat.essential && internalConsents[cat.id]).length
    
    return {
      total,
      consented,
      essential,
      optional,
      optionalConsented,
      percentage: Math.round((consented / total) * 100)
    }
  }, [categories, internalConsents])

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-consent-skeleton">
          <div className="healthcare-consent-skeleton-header" />
          <div className="healthcare-consent-skeleton-categories" />
          <div className="healthcare-consent-skeleton-actions" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Datenschutz und Cookie-Einstellungen'}
      role="dialog"
      aria-modal={variant === 'modal'}
      {...props}
    >
      {/* Header */}
      <div className="healthcare-consent-header">
        <div className="healthcare-consent-title-container">
          <Shield className="healthcare-consent-title-icon" />
          <div>
            <h2 className="healthcare-consent-title">
              {medicalMode ? 'Medizinischer Datenschutz' : 'Datenschutz-Einstellungen'}
            </h2>
            <p className="healthcare-consent-subtitle">
              {gdprMode 
                ? 'DSGVO-konforme Verwaltung Ihrer Einwilligungen'
                : 'Verwalten Sie Ihre Datenschutz-Präferenzen'
              }
            </p>
          </div>
        </div>

        {onClose && variant === 'modal' && (
          <button 
            className="healthcare-consent-close"
            onClick={onClose}
            aria-label="Datenschutz-Dialog schließen"
          >
            <X />
          </button>
        )}

        {gdprMode && (
          <div className="healthcare-consent-gdpr-badge">
            <Shield className="healthcare-consent-gdpr-icon" />
            <span>DSGVO-konform</span>
          </div>
        )}
      </div>

      {/* Organization Info */}
      {organizationName && (
        <div className="healthcare-consent-organization">
          <Info className="healthcare-consent-organization-icon" />
          <div>
            <p>
              <strong>{organizationName}</strong> verwendet Cookies und verarbeitet Daten zur Verbesserung 
              Ihrer Nutzererfahrung. {medicalMode && 'Medizinische Daten werden DSGVO-konform verschlüsselt gespeichert.'}
            </p>
            <p className="healthcare-consent-policy-link">
              <a 
                href={policyUrl} 
                onClick={(e) => {
                  e.preventDefault()
                  onViewPolicy?.()
                }}
                className="healthcare-consent-link"
              >
                Datenschutzerklärung lesen
              </a>
              {' • '}
              <span>Version {policyVersion}</span>
              {contactEmail && (
                <>
                  {' • '}
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="healthcare-consent-link"
                  >
                    Datenschutz-Kontakt
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Consent Statistics */}
      {showDataUsage && consentStats.total > 0 && (
        <div className="healthcare-consent-stats">
          <div className="healthcare-consent-stat">
            <div className="healthcare-consent-stat-label">Einwilligungen:</div>
            <div className="healthcare-consent-stat-value">
              {consentStats.consented}/{consentStats.total} ({consentStats.percentage}%)
            </div>
          </div>
          <div className="healthcare-consent-stat-progress">
            <div 
              className="healthcare-consent-stat-progress-bar"
              style={{ width: `${consentStats.percentage}%` }}
            />
          </div>
          <div className="healthcare-consent-stat-breakdown">
            <span>Essentiell: {consentStats.essential}</span>
            <span>Optional: {consentStats.optionalConsented}/{consentStats.optional}</span>
          </div>
        </div>
      )}

      {/* Consent Categories */}
      <div className="healthcare-consent-categories">
        {categories.map(category => {
          const isExpanded = expandedCategories[category.id]
          const isConsented = internalConsents[category.id]
          
          return (
            <div 
              key={category.id}
              className={`
                healthcare-consent-category
                ${category.essential ? 'healthcare-consent-category--essential' : ''}
                ${isConsented ? 'healthcare-consent-category--consented' : ''}
                ${isExpanded ? 'healthcare-consent-category--expanded' : ''}
              `.trim()}
            >
              <div className="healthcare-consent-category-header">
                <div className="healthcare-consent-category-main">
                  <div className="healthcare-consent-category-info">
                    <h3 className="healthcare-consent-category-name">
                      {category.name}
                      {category.essential && (
                        <span className="healthcare-consent-category-essential-badge">
                          Essentiell
                        </span>
                      )}
                    </h3>
                    <p className="healthcare-consent-category-description">
                      {category.description}
                    </p>
                  </div>

                  <div className="healthcare-consent-category-control">
                    {category.essential ? (
                      <div className="healthcare-consent-category-essential">
                        <Check className="healthcare-consent-category-essential-icon" />
                        <span>Erforderlich</span>
                      </div>
                    ) : (
                      <label className="healthcare-consent-category-toggle">
                        <input
                          type="checkbox"
                          checked={isConsented}
                          onChange={(e) => handleConsentChange(category.id, e.target.checked)}
                          disabled={!allowGranular}
                          className="healthcare-consent-category-checkbox"
                        />
                        <span className="healthcare-consent-category-toggle-slider" />
                        <span className="healthcare-consent-category-toggle-label">
                          {isConsented ? 'Aktiviert' : 'Deaktiviert'}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {showDetails && (
                  <button
                    className="healthcare-consent-category-expand"
                    onClick={() => toggleCategoryExpansion(category.id)}
                    aria-label={`${category.name} Details ${isExpanded ? 'zuklappen' : 'aufklappen'}`}
                  >
                    {isExpanded ? <ChevronDown /> : <ChevronRight />}
                  </button>
                )}
              </div>

              {/* Category Details */}
              {showDetails && isExpanded && (
                <div className="healthcare-consent-category-details">
                  {category.purposes && (
                    <div className="healthcare-consent-detail">
                      <h4>Zwecke:</h4>
                      <ul>
                        {category.purposes.map((purpose, index) => (
                          <li key={index}>{purpose}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="healthcare-consent-detail-grid">
                    {category.retentionPeriod && (
                      <div className="healthcare-consent-detail">
                        <h4>Speicherdauer:</h4>
                        <p>{category.retentionPeriod}</p>
                      </div>
                    )}

                    {category.legalBasis && (
                      <div className="healthcare-consent-detail">
                        <h4>Rechtsgrundlage:</h4>
                        <p>{getLegalBasisText(category.legalBasis)}</p>
                      </div>
                    )}

                    {category.consentMethod && (
                      <div className="healthcare-consent-detail">
                        <h4>Einwilligung:</h4>
                        <p>{getConsentMethodText(category.consentMethod)}</p>
                      </div>
                    )}

                    {category.lastChanged && (
                      <div className="healthcare-consent-detail">
                        <h4>Letzte Änderung:</h4>
                        <p>{category.lastChanged.toLocaleDateString('de-DE')}</p>
                      </div>
                    )}
                  </div>

                  {category.thirdParties && (
                    <div className="healthcare-consent-detail">
                      <h4>Drittanbieter:</h4>
                      <ul>
                        {category.thirdParties.map((party, index) => (
                          <li key={index}>{party}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Advanced Settings */}
      {gdprMode && (
        <div className="healthcare-consent-advanced">
          <button
            className="healthcare-consent-advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
          >
            <Settings className="healthcare-consent-advanced-toggle-icon" />
            <span>Erweiterte Einstellungen</span>
            {showAdvanced ? <ChevronDown /> : <ChevronRight />}
          </button>

          {showAdvanced && (
            <div className="healthcare-consent-advanced-content">
              <h4>Ihre Rechte nach DSGVO:</h4>
              <div className="healthcare-consent-rights">
                <button
                  className="healthcare-consent-right-button"
                  onClick={onDownloadData}
                  disabled={!onDownloadData}
                >
                  <Download className="healthcare-consent-right-icon" />
                  <div>
                    <strong>Daten herunterladen</strong>
                    <p>Erhalten Sie eine Kopie aller Ihrer gespeicherten Daten</p>
                  </div>
                </button>

                <button
                  className="healthcare-consent-right-button healthcare-consent-right-button--danger"
                  onClick={onDeleteData}
                  disabled={!onDeleteData}
                >
                  <Trash2 className="healthcare-consent-right-icon" />
                  <div>
                    <strong>Daten löschen</strong>
                    <p>Beantragen Sie die Löschung Ihrer persönlichen Daten</p>
                  </div>
                </button>
              </div>

              <div className="healthcare-consent-contact">
                <p>
                  Für weitere Fragen zum Datenschutz wenden Sie sich an unseren 
                  Datenschutzbeauftragten: {' '}
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="healthcare-consent-link"
                  >
                    {contactEmail}
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="healthcare-consent-actions">
        {variant === 'banner' && (
          <div className="healthcare-consent-banner-actions">
            <button
              className="healthcare-consent-action healthcare-consent-action--secondary"
              onClick={handleRejectAll}
            >
              {medicalMode ? 'Nur Essentiell' : 'Alle ablehnen'}
            </button>
            
            {allowGranular && (
              <button
                className="healthcare-consent-action healthcare-consent-action--tertiary"
                onClick={onOpenSettings}
              >
                Einstellungen
              </button>
            )}
            
            <button
              className="healthcare-consent-action healthcare-consent-action--primary"
              onClick={handleAcceptAll}
            >
              {medicalMode ? 'Alle akzeptieren' : 'Alles akzeptieren'}
            </button>
          </div>
        )}

        {variant !== 'banner' && (
          <div className="healthcare-consent-settings-actions">
            <button
              className="healthcare-consent-action healthcare-consent-action--secondary"
              onClick={onClose || handleRejectAll}
            >
              {onClose ? 'Abbrechen' : 'Nur Essentiell'}
            </button>
            
            <div className="healthcare-consent-action-group">
              <button
                className="healthcare-consent-action healthcare-consent-action--tertiary"
                onClick={handleRejectAll}
              >
                Alle ablehnen
              </button>
              
              <button
                className="healthcare-consent-action healthcare-consent-action--primary"
                onClick={handleSavePreferences}
              >
                Einstellungen speichern
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {gdprMode && (
        <div className="healthcare-consent-footer">
          <div className="healthcare-consent-footer-info">
            <Clock className="healthcare-consent-footer-icon" />
            <p>
              Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')} • 
              Sie können Ihre Einstellungen jederzeit in den Datenschutz-Einstellungen ändern.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

ConsentManager.displayName = 'ConsentManager'