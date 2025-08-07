import React from 'react'
import { CheckCircle, Clock, AlertTriangle, User, Heart, Shield, Star, X } from 'lucide-react'
import './HealthcareBadge.css'

export interface HealthcareBadgeProps {
  /** Badge text content */
  children: React.ReactNode
  /** Badge variant */
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'urgent' | 'specialty'
  /** Badge size */
  size?: 'small' | 'medium' | 'large'
  /** Medical specialty (for specialty variant) */
  specialty?: 'kardiologie' | 'onkologie' | 'gallenblase' | 'nephrologie' | 'schilddruese' | 'intensivmedizin' | 'allgemeine-fragen'
  /** Show icon */
  showIcon?: boolean
  /** Custom icon override */
  customIcon?: React.ReactNode
  /** Badge shape */
  shape?: 'rounded' | 'pill' | 'square'
  /** Removable badge with close button */
  removable?: boolean
  /** Clickable badge */
  clickable?: boolean
  /** Loading state */
  loading?: boolean
  /** Accessibility label */
  ariaLabel?: string
  /** Click handler */
  onClick?: () => void
  /** Remove handler */
  onRemove?: () => void
}

export const HealthcareBadge = ({
  children,
  variant = 'neutral',
  size = 'medium',
  specialty,
  showIcon = true,
  customIcon,
  shape = 'rounded',
  removable = false,
  clickable = false,
  loading = false,
  ariaLabel,
  onClick,
  onRemove
}: HealthcareBadgeProps) => {
  const badgeClasses = `
    healthcare-badge
    healthcare-badge--${variant}
    healthcare-badge--${size}
    healthcare-badge--${shape}
    ${specialty ? `healthcare-badge--${specialty}` : ''}
    ${clickable ? 'healthcare-badge--clickable' : ''}
    ${loading ? 'healthcare-badge--loading' : ''}
  `.trim()

  const getIcon = () => {
    if (customIcon) return customIcon
    if (!showIcon) return null
    
    if (loading) {
      return <div className="healthcare-badge-spinner" />
    }
    
    if (variant === 'specialty' && specialty) {
      const specialtyIcons = {
        'kardiologie': <Heart className="healthcare-badge-icon" />,
        'onkologie': <Star className="healthcare-badge-icon" />,
        'gallenblase': <AlertTriangle className="healthcare-badge-icon" />,
        'nephrologie': <CheckCircle className="healthcare-badge-icon" />,
        'schilddruese': <Shield className="healthcare-badge-icon" />,
        'intensivmedizin': <Clock className="healthcare-badge-icon" />,
        'allgemeine-fragen': <User className="healthcare-badge-icon" />
      }
      return specialtyIcons[specialty]
    }
    
    switch (variant) {
      case 'success':
        return <CheckCircle className="healthcare-badge-icon" />
      case 'warning':
        return <AlertTriangle className="healthcare-badge-icon" />
      case 'error':
        return <X className="healthcare-badge-icon" />
      case 'info':
        return <User className="healthcare-badge-icon" />
      case 'urgent':
        return <Clock className="healthcare-badge-icon" />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (onClick && clickable && !loading) {
      onClick()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <span
      className={badgeClasses}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {/* Icon */}
      {getIcon()}
      
      {/* Content */}
      <span className="healthcare-badge-content">
        {children}
      </span>
      
      {/* Remove Button */}
      {removable && onRemove && (
        <button
          className="healthcare-badge-remove"
          onClick={handleRemove}
          aria-label={`${children} entfernen`}
          tabIndex={0}
        >
          <X className="healthcare-badge-remove-icon" />
        </button>
      )}
    </span>
  )
}