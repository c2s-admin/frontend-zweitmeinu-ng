import React from 'react'
import { ChevronRight, User, Calendar, FileText, Heart, Stethoscope, Pill, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'
import './HealthcareList.css'

export interface HealthcareListItem {
  /** Item identifier */
  id: string
  /** Item title */
  title: string
  /** Item subtitle/description */
  subtitle?: string
  /** Item value/content */
  value?: string | number | React.ReactNode
  /** Item status */
  status?: 'normal' | 'success' | 'warning' | 'error' | 'pending'
  /** Item icon */
  icon?: React.ReactNode
  /** Medical specialty */
  specialty?: 'kardiologie' | 'onkologie' | 'gallenblase' | 'nephrologie' | 'schilddruese' | 'intensivmedizin'
  /** Medical priority level */
  priority?: 'low' | 'medium' | 'high' | 'critical'
  /** ICD-10 code for medical conditions */
  icdCode?: string
  /** Timestamp for medical records */
  timestamp?: Date | string
  /** Item metadata */
  metadata?: {
    /** Medical professional */
    professional?: string
    /** Medical facility */
    facility?: string
    /** Medical notes */
    notes?: string
  }
  /** Whether item is clickable */
  clickable?: boolean
  /** Click handler */
  onClick?: () => void
}

export interface HealthcareListProps {
  /** List items */
  items: HealthcareListItem[]
  /** List title */
  title?: string
  /** List type for styling */
  type?: 'default' | 'medical-records' | 'appointments' | 'medications' | 'test-results' | 'emergency-contacts'
  /** List size */
  size?: 'small' | 'medium' | 'large'
  /** Show avatars/icons */
  showIcons?: boolean
  /** Show medical metadata */
  showMetadata?: boolean
  /** Show timestamps */
  showTimestamp?: boolean
  /** Show ICD codes */
  showIcdCodes?: boolean
  /** Medical context styling */
  medicalContext?: boolean
  /** Emergency contact info */
  emergencyContact?: {
    number: string
    text: string
  }
  /** Empty state message */
  emptyMessage?: string
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Item click handler */
  onItemClick?: (item: HealthcareListItem) => void
}

export const HealthcareList = ({
  items,
  title,
  type = 'default',
  size = 'medium',
  showIcons = true,
  showMetadata = false,
  showTimestamp = false,
  showIcdCodes = false,
  medicalContext = false,
  emergencyContact = {
    number: '+49 800 80 44 100',
    text: 'Medizinischer Notfall?'
  },
  emptyMessage = 'Keine Daten verfügbar',
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onItemClick,
  ...props
}: HealthcareListProps) => {
  
  const listClasses = `
    healthcare-list-container
    healthcare-list-container--${size}
    healthcare-list-container--${type}
    ${medicalContext ? 'healthcare-list-container--medical' : ''}
    ${loading ? 'healthcare-list-container--loading' : ''}
    ${className}
  `.trim()

  // Get type icon
  const getTypeIcon = () => {
    switch (type) {
      case 'medical-records':
        return <FileText className="healthcare-list-type-icon" />
      case 'appointments':
        return <Calendar className="healthcare-list-type-icon" />
      case 'medications':
        return <Pill className="healthcare-list-type-icon" />
      case 'test-results':
        return <Stethoscope className="healthcare-list-type-icon" />
      case 'emergency-contacts':
        return <AlertTriangle className="healthcare-list-type-icon" />
      default:
        return <User className="healthcare-list-type-icon" />
    }
  }

  // Get status icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="healthcare-list-status-icon healthcare-list-status-icon--success" />
      case 'warning':
        return <AlertTriangle className="healthcare-list-status-icon healthcare-list-status-icon--warning" />
      case 'error':
        return <AlertTriangle className="healthcare-list-status-icon healthcare-list-status-icon--error" />
      case 'pending':
        return <Clock className="healthcare-list-status-icon healthcare-list-status-icon--pending" />
      default:
        return null
    }
  }

  // Get specialty color
  const getSpecialtyColor = (specialty?: string) => {
    switch (specialty) {
      case 'kardiologie': return '#dc2626'
      case 'onkologie': return '#7c3aed'  
      case 'gallenblase': return '#f59e0b'
      case 'nephrologie': return '#2563eb'
      case 'schilddruese': return '#10b981'
      case 'intensivmedizin': return '#ea580c'
      default: return '#1278B3'
    }
  }

  // Get priority styling
  const getPriorityClass = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'healthcare-list-item--critical'
      case 'high':
        return 'healthcare-list-item--high-priority'
      case 'medium':
        return 'healthcare-list-item--medium-priority'
      case 'low':
        return 'healthcare-list-item--low-priority'
      default:
        return ''
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp?: Date | string) => {
    if (!timestamp) return ''
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Handle item click
  const handleItemClick = (item: HealthcareListItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (onItemClick) {
      onItemClick(item)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={listClasses}>
        {title && (
          <div className="healthcare-list-header">
            {getTypeIcon()}
            <h3 className="healthcare-list-title">{title}</h3>
          </div>
        )}
        
        <div className="healthcare-list-loading">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="healthcare-list-skeleton">
              <div className="healthcare-list-skeleton-icon" />
              <div className="healthcare-list-skeleton-content">
                <div className="healthcare-list-skeleton-title" />
                <div className="healthcare-list-skeleton-subtitle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={listClasses}>
        {title && (
          <div className="healthcare-list-header">
            {getTypeIcon()}
            <h3 className="healthcare-list-title">{title}</h3>
          </div>
        )}
        
        <div className="healthcare-list-empty">
          <div className="healthcare-list-empty-icon">
            {getTypeIcon()}
          </div>
          <p className="healthcare-list-empty-message">
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={listClasses} {...props}>
      {/* Emergency Contact (for emergency type) */}
      {type === 'emergency-contacts' && emergencyContact && (
        <div className="healthcare-list-emergency">
          <AlertTriangle className="healthcare-list-emergency-icon" />
          <span className="healthcare-list-emergency-text">
            {emergencyContact.text}
          </span>
          <a 
            href={`tel:${emergencyContact.number}`}
            className="healthcare-list-emergency-number"
          >
            {emergencyContact.number}
          </a>
        </div>
      )}

      {/* Header */}
      {title && (
        <div className="healthcare-list-header">
          {getTypeIcon()}
          <h3 className="healthcare-list-title">{title}</h3>
          <div className="healthcare-list-count">
            {items.length} {items.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
        </div>
      )}

      {/* List */}
      <ul 
        className="healthcare-list"
        role="list"
        aria-label={ariaLabel || title || 'Healthcare List'}
      >
        {items.map((item) => {
          const isClickable = item.clickable || item.onClick || onItemClick
          
          const itemClasses = `
            healthcare-list-item
            healthcare-list-item--${item.status || 'normal'}
            ${item.specialty ? `healthcare-list-item--${item.specialty}` : ''}
            ${getPriorityClass(item.priority)}
            ${isClickable ? 'healthcare-list-item--clickable' : ''}
          `.trim()

          return (
            <li
              key={item.id}
              className={itemClasses}
              role="listitem"
              onClick={isClickable ? () => handleItemClick(item) : undefined}
              onKeyDown={isClickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleItemClick(item)
                }
              } : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={`${item.title}${item.subtitle ? ` - ${item.subtitle}` : ''}`}
            >
              {/* Priority Indicator */}
              {item.priority && (
                <div 
                  className="healthcare-list-priority-indicator"
                  style={{
                    backgroundColor: item.priority === 'critical' ? '#dc2626' :
                                   item.priority === 'high' ? '#f59e0b' :
                                   item.priority === 'medium' ? '#0ea5e9' : '#10b981'
                  }}
                />
              )}

              {/* Icon */}
              {showIcons && (
                <div className="healthcare-list-item-icon">
                  {item.icon || getTypeIcon()}
                </div>
              )}

              {/* Content */}
              <div className="healthcare-list-item-content">
                <div className="healthcare-list-item-main">
                  <div className="healthcare-list-item-title-section">
                    <h4 className="healthcare-list-item-title">
                      {item.title}
                    </h4>
                    
                    {/* Status Icon */}
                    {getStatusIcon(item.status)}
                    
                    {/* Specialty Indicator */}
                    {item.specialty && (
                      <div 
                        className="healthcare-list-item-specialty"
                        style={{ color: getSpecialtyColor(item.specialty) }}
                      >
                        <div 
                          className="healthcare-list-item-specialty-dot"
                          style={{ backgroundColor: getSpecialtyColor(item.specialty) }}
                        />
                        {item.specialty.charAt(0).toUpperCase() + item.specialty.slice(1)}
                      </div>
                    )}
                  </div>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className="healthcare-list-item-subtitle">
                      {item.subtitle}
                    </p>
                  )}

                  {/* ICD Code */}
                  {showIcdCodes && item.icdCode && (
                    <div className="healthcare-list-item-icd">
                      <span className="healthcare-list-item-icd-label">ICD-10:</span>
                      <code className="healthcare-list-item-icd-code">{item.icdCode}</code>
                    </div>
                  )}
                </div>

                {/* Value */}
                {item.value && (
                  <div className="healthcare-list-item-value">
                    {item.value}
                  </div>
                )}

                {/* Metadata */}
                {showMetadata && item.metadata && (
                  <div className="healthcare-list-item-metadata">
                    {item.metadata.professional && (
                      <div className="healthcare-list-item-meta">
                        <User className="healthcare-list-item-meta-icon" />
                        <span>{item.metadata.professional}</span>
                      </div>
                    )}
                    
                    {item.metadata.facility && (
                      <div className="healthcare-list-item-meta">
                        <Shield className="healthcare-list-item-meta-icon" />
                        <span>{item.metadata.facility}</span>
                      </div>
                    )}
                    
                    {item.metadata.notes && (
                      <div className="healthcare-list-item-notes">
                        {item.metadata.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                {showTimestamp && item.timestamp && (
                  <div className="healthcare-list-item-timestamp">
                    <Clock className="healthcare-list-item-timestamp-icon" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                )}
              </div>

              {/* Chevron for clickable items */}
              {isClickable && (
                <div className="healthcare-list-item-chevron">
                  <ChevronRight className="healthcare-list-item-chevron-icon" />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Medical Context Footer */}
      {medicalContext && (
        <div className="healthcare-list-medical-footer">
          <Shield className="healthcare-list-medical-footer-icon" />
          <div className="healthcare-list-medical-footer-content">
            <span className="healthcare-list-medical-footer-title">
              Medizinische Daten
            </span>
            <span className="healthcare-list-medical-footer-text">
              Alle medizinischen Informationen unterliegen der ärztlichen Schweigepflicht 
              und werden DSGVO-konform verarbeitet.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

HealthcareList.displayName = 'HealthcareList'