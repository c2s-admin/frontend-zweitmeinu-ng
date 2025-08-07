import React from 'react'
import { ChevronRight, Star, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import './HealthcareCard.css'

export interface HealthcareCardProps {
  /** Card title */
  title: string
  /** Card description/content */
  description?: string
  /** Medical specialty or category */
  specialty?: string
  /** Card image URL */
  imageUrl?: string
  /** Image alt text for accessibility */
  imageAlt?: string
  /** Rating (1-5) for doctors/services */
  rating?: number
  /** Review count */
  reviewCount?: number
  /** Price information */
  price?: string
  /** Processing time */
  processingTime?: string
  /** Trust indicators */
  trustIndicators?: Array<{
    icon: 'shield' | 'certificate' | 'clock'
    label: string
  }>
  /** Card status */
  status?: 'default' | 'featured' | 'urgent' | 'completed' | 'disabled'
  /** Show action button/link */
  showAction?: boolean
  /** Action button text */
  actionText?: string
  /** Card size variant */
  size?: 'small' | 'medium' | 'large'
  /** Loading state */
  isLoading?: boolean
  /** Click handler */
  onClick?: () => void
  /** Action button click handler */
  onActionClick?: (event: React.MouseEvent) => void
}

export const HealthcareCard = ({
  title,
  description,
  specialty,
  imageUrl,
  imageAlt,
  rating,
  reviewCount,
  price,
  processingTime,
  trustIndicators,
  status = 'default',
  showAction = true,
  actionText = 'Mehr erfahren',
  size = 'medium',
  isLoading = false,
  onClick,
  onActionClick
}: HealthcareCardProps) => {
  const cardClasses = `
    healthcare-card
    healthcare-card--${size}
    healthcare-card--${status}
    ${onClick ? 'healthcare-card--clickable' : ''}
    ${isLoading ? 'healthcare-card--loading' : ''}
  `.trim()

  const handleCardClick = () => {
    if (onClick && !isLoading && status !== 'disabled') {
      onClick()
    }
  }

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (onActionClick && !isLoading && status !== 'disabled') {
      onActionClick(event)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'featured':
        return <Star className="healthcare-card-status-icon" />
      case 'urgent':
        return <AlertTriangle className="healthcare-card-status-icon" />
      case 'completed':
        return <CheckCircle className="healthcare-card-status-icon" />
      default:
        return null
    }
  }

  const getSpecialtyColor = (specialty?: string) => {
    const specialtyColors: Record<string, string> = {
      'kardiologie': 'red',
      'onkologie': 'purple',
      'gallenblase': 'yellow',
      'nephrologie': 'blue',
      'schilddruese': 'green',
      'intensivmedizin': 'orange',
      'allgemeine-fragen': 'gray'
    }
    return specialtyColors[specialty?.toLowerCase() || ''] || 'gray'
  }

  if (isLoading) {
    return (
      <div className={cardClasses} role="article" aria-label="Medizinische Inhalte werden geladen">
        <div className="healthcare-card-loading">
          <div className="healthcare-card-loading-content">
            <div className="healthcare-card-loading-spinner"></div>
            <span className="healthcare-card-loading-text">Medizinische Daten werden geladen...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article 
      className={cardClasses}
      onClick={handleCardClick}
      role="article"
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={`${title}${specialty ? ` - ${specialty}` : ''}`}
    >
      {/* Status Indicator */}
      {status !== 'default' && (
        <div className={`healthcare-card-status healthcare-card-status--${status}`}>
          {getStatusIcon()}
          <span className="healthcare-card-status-text">
            {status === 'featured' && 'Empfohlen'}
            {status === 'urgent' && 'Dringend'}
            {status === 'completed' && 'Abgeschlossen'}
            {status === 'disabled' && 'Nicht verfügbar'}
          </span>
        </div>
      )}

      {/* Image Section */}
      {imageUrl && (
        <div className="healthcare-card-image">
          <img
            src={imageUrl}
            alt={imageAlt || `Bild für ${title}`}
            className="healthcare-card-img"
            loading="lazy"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="healthcare-card-content">
        {/* Specialty Badge */}
        {specialty && (
          <div className={`healthcare-card-specialty healthcare-card-specialty--${getSpecialtyColor(specialty)}`}>
            {specialty}
          </div>
        )}

        {/* Title */}
        <h3 className="healthcare-card-title">
          {title}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="healthcare-card-rating">
            <div className="healthcare-card-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`healthcare-card-star ${
                    star <= rating ? 'healthcare-card-star--filled' : ''
                  }`}
                />
              ))}
            </div>
            <span className="healthcare-card-rating-text">
              {rating.toFixed(1)} {reviewCount && `(${reviewCount} Bewertungen)`}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="healthcare-card-description">
            {description}
          </p>
        )}

        {/* Medical Info */}
        <div className="healthcare-card-info">
          {price && (
            <div className="healthcare-card-info-item">
              <span className="healthcare-card-info-label">Kosten:</span>
              <span className="healthcare-card-info-value">{price}</span>
            </div>
          )}
          {processingTime && (
            <div className="healthcare-card-info-item">
              <Clock className="healthcare-card-info-icon" />
              <span className="healthcare-card-info-value">{processingTime}</span>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        {trustIndicators && trustIndicators.length > 0 && (
          <div className="healthcare-card-trust">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="healthcare-card-trust-item">
                {indicator.icon === 'shield' && <Shield className="healthcare-card-trust-icon" />}
                {indicator.icon === 'certificate' && <CheckCircle className="healthcare-card-trust-icon" />}
                {indicator.icon === 'clock' && <Clock className="healthcare-card-trust-icon" />}
                <span className="healthcare-card-trust-label">{indicator.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {showAction && status !== 'disabled' && (
        <div className="healthcare-card-action">
          <button
            className="healthcare-card-action-button"
            onClick={handleActionClick}
            disabled={isLoading}
            aria-label={`${actionText} für ${title}`}
          >
            <span>{actionText}</span>
            <ChevronRight className="healthcare-card-action-icon" />
          </button>
        </div>
      )}
    </article>
  )
}