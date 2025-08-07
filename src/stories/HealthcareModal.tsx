import React, { useEffect, useRef, useState } from 'react'
import { X, AlertTriangle, CheckCircle, Info, Shield, Phone, FileText } from 'lucide-react'
import './HealthcareModal.css'

export interface HealthcareModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Modal title */
  title: string
  /** Modal content */
  children: React.ReactNode
  /** Modal size */
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  /** Modal type for styling */
  type?: 'default' | 'consent' | 'emergency' | 'success' | 'error' | 'info'
  /** Show close button */
  showCloseButton?: boolean
  /** Close on outside click */
  closeOnOutsideClick?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Medical context styling */
  medicalContext?: boolean
  /** Emergency contact information */
  emergencyContact?: {
    number: string
    text: string
  }
  /** GDPR compliance indicator */
  gdprCompliant?: boolean
  /** Footer content */
  footer?: React.ReactNode
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** ARIA describedby */
  'aria-describedby'?: string
  /** Close handler */
  onClose: () => void
  /** After close handler */
  onAfterClose?: () => void
  /** Before close handler (can prevent closing) */
  onBeforeClose?: () => boolean | Promise<boolean>
}

export const HealthcareModal = ({
  isOpen,
  title,
  children,
  size = 'medium',
  type = 'default',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  medicalContext = false,
  emergencyContact = {
    number: '+49 800 80 44 100',
    text: 'Medizinischer Notfall? Sofort anrufen!'
  },
  gdprCompliant = false,
  footer,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onClose,
  onAfterClose,
  onBeforeClose,
  ...props
}: HealthcareModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const modalId = `healthcare-modal-${Math.random().toString(36).substring(7)}`
  const titleId = `${modalId}-title`
  const contentId = `${modalId}-content`

  const modalClasses = `
    healthcare-modal
    healthcare-modal--${size}
    healthcare-modal--${type}
    ${medicalContext ? 'healthcare-modal--medical' : ''}
    ${isClosing ? 'healthcare-modal--closing' : ''}
    ${className}
  `.trim()

  const overlayClasses = `
    healthcare-modal-overlay
    healthcare-modal-overlay--${type}
    ${isClosing ? 'healthcare-modal-overlay--closing' : ''}
  `.trim()

  // Handle close with before close validation
  const handleClose = async () => {
    if (onBeforeClose) {
      const canClose = await onBeforeClose()
      if (!canClose) return
    }

    setIsClosing(true)
    
    // Wait for close animation
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      onClose()
      onAfterClose?.()
    }, 200)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isVisible) {
        handleClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, closeOnEscape])

  // Handle outside click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOutsideClick) {
      handleClose()
    }
  }

  // Focus management
  useEffect(() => {
    if (isOpen && !isVisible) {
      // Store previous active element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      setIsVisible(true)
      
      // Focus modal after animation
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement
          
          if (focusableElement) {
            focusableElement.focus()
          } else {
            modalRef.current.focus()
          }
        }
      }, 100)
    } else if (!isOpen && isVisible && !isClosing) {
      handleClose()
    }

    return () => {
      if (!isVisible) {
        // Restore body scroll
        document.body.style.overflow = ''
        
        // Restore focus
        if (previousActiveElement.current) {
          previousActiveElement.current.focus()
        }
      }
    }
  }, [isOpen, isVisible])

  // Trap focus within modal
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  // Get type icon
  const getTypeIcon = () => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="healthcare-modal-type-icon" />
      case 'success':
        return <CheckCircle className="healthcare-modal-type-icon" />
      case 'error':
        return <AlertTriangle className="healthcare-modal-type-icon" />
      case 'info':
        return <Info className="healthcare-modal-type-icon" />
      case 'consent':
        return <FileText className="healthcare-modal-type-icon" />
      default:
        return null
    }
  }

  if (!isVisible) return null

  return (
    <div className="healthcare-modal-portal">
      {/* Overlay */}
      <div 
        className={overlayClasses}
        onClick={handleOverlayClick}
        aria-hidden="true"
      >
        {/* Emergency Contact Banner (for emergency type) */}
        {type === 'emergency' && emergencyContact && (
          <div className="healthcare-modal-emergency-banner">
            <Phone className="healthcare-modal-emergency-icon" />
            <span className="healthcare-modal-emergency-text">
              {emergencyContact.text}
            </span>
            <a 
              href={`tel:${emergencyContact.number}`}
              className="healthcare-modal-emergency-number"
            >
              {emergencyContact.number}
            </a>
          </div>
        )}

        {/* Modal */}
        <div
          ref={modalRef}
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={ariaDescribedBy || contentId}
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Header */}
          <header className="healthcare-modal-header">
            <div className="healthcare-modal-title-section">
              {getTypeIcon()}
              <h2 id={titleId} className="healthcare-modal-title">
                {title}
              </h2>
              {medicalContext && (
                <div className="healthcare-modal-medical-badge">
                  <Shield className="healthcare-modal-medical-icon" />
                  <span className="healthcare-modal-medical-text">Vertraulich</span>
                </div>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                className="healthcare-modal-close"
                onClick={handleClose}
                aria-label="Dialog schließen"
              >
                <X className="healthcare-modal-close-icon" />
              </button>
            )}
          </header>

          {/* Content */}
          <div id={contentId} className="healthcare-modal-content">
            {children}
          </div>

          {/* Footer */}
          {(footer || gdprCompliant) && (
            <footer className="healthcare-modal-footer">
              {gdprCompliant && (
                <div className="healthcare-modal-gdpr">
                  <Shield className="healthcare-modal-gdpr-icon" />
                  <span className="healthcare-modal-gdpr-text">
                    DSGVO-konform · Medizinische Schweigepflicht
                  </span>
                </div>
              )}
              
              {footer && (
                <div className="healthcare-modal-footer-content">
                  {footer}
                </div>
              )}
            </footer>
          )}

          {/* Medical Privacy Notice */}
          {medicalContext && (
            <div className="healthcare-modal-privacy-notice">
              <Shield className="healthcare-modal-privacy-icon" />
              <div className="healthcare-modal-privacy-content">
                <span className="healthcare-modal-privacy-title">
                  Medizinische Daten
                </span>
                <span className="healthcare-modal-privacy-text">
                  Alle Informationen werden vertraulich behandelt und sind durch die 
                  ärztliche Schweigepflicht geschützt.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

HealthcareModal.displayName = 'HealthcareModal'