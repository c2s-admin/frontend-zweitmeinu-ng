import React from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Phone } from 'lucide-react'
import './HealthcareAlert.css'

export interface HealthcareAlertProps {
  /** Alert message */
  message: string
  /** Alert type */
  type?: 'success' | 'error' | 'warning' | 'info' | 'emergency'
  /** Alert title */
  title?: string
  /** Show close button */
  closable?: boolean
  /** Alert size */
  size?: 'small' | 'medium' | 'large'
  /** Emergency contact number (for emergency type) */
  emergencyNumber?: string
  /** Action button text */
  actionText?: string
  /** Custom icon */
  customIcon?: React.ReactNode
  /** Medical context styling */
  medicalContext?: boolean
  /** Close handler */
  onClose?: () => void
  /** Action button handler */
  onAction?: () => void
}

export const HealthcareAlert = ({
  message,
  type = 'info',
  title,
  closable = false,
  size = 'medium',
  emergencyNumber = '+49 800 80 44 100',
  actionText,
  customIcon,
  medicalContext = false,
  onClose,
  onAction
}: HealthcareAlertProps) => {
  const alertClasses = `
    healthcare-alert
    healthcare-alert--${type}
    healthcare-alert--${size}
    ${medicalContext ? 'healthcare-alert--medical' : ''}
  `.trim()

  const getIcon = () => {
    if (customIcon) return customIcon
    
    switch (type) {
      case 'success':
        return <CheckCircle className="healthcare-alert-icon" />
      case 'error':
        return <AlertCircle className="healthcare-alert-icon" />
      case 'warning':
        return <AlertTriangle className="healthcare-alert-icon" />
      case 'emergency':
        return <Phone className="healthcare-alert-icon" />
      default:
        return <Info className="healthcare-alert-icon" />
    }
  }

  const getAriaRole = () => {
    switch (type) {
      case 'error':
      case 'emergency':
        return 'alert'
      case 'success':
      case 'info':
      case 'warning':
        return 'status'
      default:
        return 'status'
    }
  }

  return (
    <div 
      className={alertClasses}
      role={getAriaRole()}
      aria-live={type === 'emergency' ? 'assertive' : 'polite'}
    >
      {/* Icon */}
      <div className="healthcare-alert-icon-container">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="healthcare-alert-content">
        {title && (
          <h4 className="healthcare-alert-title">
            {title}
          </h4>
        )}
        <p className="healthcare-alert-message">
          {message}
        </p>
        
        {/* Emergency Contact for Emergency Type */}
        {type === 'emergency' && (
          <div className="healthcare-alert-emergency">
            <a 
              href={`tel:${emergencyNumber}`}
              className="healthcare-alert-emergency-link"
              aria-label={`Notfall-Hotline anrufen: ${emergencyNumber}`}
            >
              <Phone className="healthcare-alert-emergency-icon" />
              {emergencyNumber}
            </a>
          </div>
        )}
        
        {/* Action Button */}
        {actionText && onAction && (
          <button
            className="healthcare-alert-action"
            onClick={onAction}
            aria-label={actionText}
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Close Button */}
      {closable && onClose && (
        <button
          className="healthcare-alert-close"
          onClick={onClose}
          aria-label="Benachrichtigung schließen"
        >
          <X className="healthcare-alert-close-icon" />
        </button>
      )}
    </div>
  )
}