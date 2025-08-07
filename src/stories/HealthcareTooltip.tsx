import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Info, HelpCircle, AlertTriangle, Stethoscope, Pill, Heart } from 'lucide-react'
import './HealthcareTooltip.css'

export interface HealthcareTooltipProps {
  /** Tooltip content */
  content: string
  /** Extended content for complex medical terms */
  extendedContent?: string
  /** Tooltip title */
  title?: string
  /** Tooltip type for styling */
  type?: 'default' | 'medical' | 'warning' | 'info' | 'definition' | 'symptom'
  /** Tooltip position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  /** Tooltip size */
  size?: 'small' | 'medium' | 'large'
  /** Trigger type */
  trigger?: 'hover' | 'click' | 'focus' | 'manual'
  /** Show delay in milliseconds */
  showDelay?: number
  /** Hide delay in milliseconds */
  hideDelay?: number
  /** Show arrow */
  showArrow?: boolean
  /** Medical term for specialized styling */
  medicalTerm?: boolean
  /** ICD-10 code for medical conditions */
  icdCode?: string
  /** Related medical specialty */
  specialty?: 'kardiologie' | 'onkologie' | 'gallenblase' | 'nephrologie' | 'schilddruese' | 'intensivmedizin'
  /** Maximum width */
  maxWidth?: number
  /** Disabled state */
  disabled?: boolean
  /** Children to wrap with tooltip */
  children: React.ReactNode
  /** Custom class name */
  className?: string
  /** ARIA describedby target */
  'aria-describedby'?: string
  /** Open state (for manual trigger) */
  open?: boolean
  /** Open change handler */
  onOpenChange?: (open: boolean) => void
}

export const HealthcareTooltip = ({
  content,
  extendedContent,
  title,
  type = 'default',
  position = 'auto',
  size = 'medium',
  trigger = 'hover',
  showDelay = 500,
  hideDelay = 300,
  showArrow = true,
  medicalTerm = false,
  icdCode,
  specialty,
  maxWidth = 320,
  disabled = false,
  children,
  className = '',
  'aria-describedby': ariaDescribedBy,
  open,
  onOpenChange,
  ...props
}: HealthcareTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const [isExpanded, setIsExpanded] = useState(false)
  
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout>()
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  const isManuallyControlled = trigger === 'manual' && open !== undefined

  const tooltipId = `healthcare-tooltip-${Math.random().toString(36).substring(7)}`
  const contentId = `${tooltipId}-content`

  const tooltipClasses = `
    healthcare-tooltip
    healthcare-tooltip--${size}
    healthcare-tooltip--${type}
    healthcare-tooltip--${actualPosition}
    ${medicalTerm ? 'healthcare-tooltip--medical-term' : ''}
    ${specialty ? `healthcare-tooltip--${specialty}` : ''}
    ${isExpanded ? 'healthcare-tooltip--expanded' : ''}
    ${className}
  `.trim()

  // Calculate optimal position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || position !== 'auto') {
      return position
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Check available space in each direction
    const space = {
      top: triggerRect.top,
      bottom: viewport.height - triggerRect.bottom,
      left: triggerRect.left,
      right: viewport.width - triggerRect.right
    }

    // Prefer top/bottom over left/right for readability
    if (space.top >= tooltipRect.height + 10) return 'top'
    if (space.bottom >= tooltipRect.height + 10) return 'bottom'
    if (space.right >= tooltipRect.width + 10) return 'right'
    if (space.left >= tooltipRect.width + 10) return 'left'

    // Fallback to position with most space
    const maxSpace = Math.max(space.top, space.bottom, space.left, space.right)
    if (maxSpace === space.top) return 'top'
    if (maxSpace === space.bottom) return 'bottom'
    if (maxSpace === space.right) return 'right'
    return 'left'
  }, [position])

  // Show tooltip
  const showTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return
    
    clearTimeout(hideTimeoutRef.current)
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      onOpenChange?.(true)
      
      // Calculate position after visibility is set
      requestAnimationFrame(() => {
        setActualPosition(calculatePosition())
      })
    }, showDelay)
  }, [disabled, isManuallyControlled, showDelay, onOpenChange, calculatePosition])

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return
    
    clearTimeout(showTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
      setIsExpanded(false)
      onOpenChange?.(false)
    }, hideDelay)
  }, [disabled, isManuallyControlled, hideDelay, onOpenChange])

  // Handle manual control
  useEffect(() => {
    if (isManuallyControlled) {
      if (open && !isVisible) {
        setIsVisible(true)
        requestAnimationFrame(() => {
          setActualPosition(calculatePosition())
        })
      } else if (!open && isVisible) {
        setIsVisible(false)
        setIsExpanded(false)
      }
    }
  }, [open, isVisible, isManuallyControlled, calculatePosition])

  // Handle click trigger
  const handleClick = () => {
    if (trigger === 'click' && !disabled) {
      if (isVisible) {
        hideTooltip()
      } else {
        showTooltip()
      }
    }
  }

  // Handle key events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible) {
      setIsVisible(false)
      setIsExpanded(false)
      onOpenChange?.(false)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (trigger === 'focus' || trigger === 'click') {
        event.preventDefault()
        if (isVisible) {
          hideTooltip()
        } else {
          showTooltip()
        }
      }
    }
  }

  // Handle expand toggle
  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current)
      clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  // Get type icon
  const getTypeIcon = () => {
    switch (type) {
      case 'medical':
        return <Stethoscope className="healthcare-tooltip-type-icon" />
      case 'warning':
        return <AlertTriangle className="healthcare-tooltip-type-icon" />
      case 'info':
        return <Info className="healthcare-tooltip-type-icon" />
      case 'definition':
        return <HelpCircle className="healthcare-tooltip-type-icon" />
      case 'symptom':
        return <Heart className="healthcare-tooltip-type-icon" />
      default:
        return <Info className="healthcare-tooltip-type-icon" />
    }
  }

  // Get specialty icon
  const getSpecialtyIcon = () => {
    if (!specialty) return null
    
    switch (specialty) {
      case 'kardiologie':
        return <Heart className="healthcare-tooltip-specialty-icon" />
      default:
        return <Pill className="healthcare-tooltip-specialty-icon" />
    }
  }

  const triggerProps = {
    ref: triggerRef,
    'aria-describedby': isVisible ? contentId : ariaDescribedBy,
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip
    }),
    ...(trigger === 'click' && {
      onClick: handleClick,
      'aria-expanded': isVisible,
      'aria-haspopup': 'dialog'
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
      tabIndex: 0
    }),
    onKeyDown: handleKeyDown
  }

  return (
    <div className="healthcare-tooltip-container">
      {/* Trigger wrapper */}
      <div 
        className={`healthcare-tooltip-trigger ${medicalTerm ? 'healthcare-tooltip-trigger--medical' : ''}`}
        {...triggerProps}
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={tooltipClasses}
          style={{ maxWidth }}
          aria-live="polite"
          {...props}
        >
          {/* Arrow */}
          {showArrow && (
            <div className="healthcare-tooltip-arrow" />
          )}

          {/* Header */}
          {(title || getSpecialtyIcon() || icdCode) && (
            <div className="healthcare-tooltip-header">
              <div className="healthcare-tooltip-title-section">
                {getTypeIcon()}
                {title && (
                  <h3 className="healthcare-tooltip-title">{title}</h3>
                )}
                {getSpecialtyIcon()}
              </div>
              
              {icdCode && (
                <div className="healthcare-tooltip-icd">
                  <span className="healthcare-tooltip-icd-label">ICD-10:</span>
                  <code className="healthcare-tooltip-icd-code">{icdCode}</code>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div id={contentId} className="healthcare-tooltip-content">
            <div className="healthcare-tooltip-main-content">
              {content}
            </div>

            {/* Extended content */}
            {extendedContent && (
              <>
                {!isExpanded && (
                  <button
                    className="healthcare-tooltip-expand-button"
                    onClick={handleExpandToggle}
                    aria-label="Weitere Informationen anzeigen"
                  >
                    <HelpCircle className="healthcare-tooltip-expand-icon" />
                    Mehr erfahren
                  </button>
                )}
                
                {isExpanded && (
                  <div className="healthcare-tooltip-extended">
                    {extendedContent}
                    <button
                      className="healthcare-tooltip-collapse-button"
                      onClick={handleExpandToggle}
                      aria-label="Erweiterte Informationen ausblenden"
                    >
                      Weniger anzeigen
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Medical disclaimer */}
          {medicalTerm && (
            <div className="healthcare-tooltip-disclaimer">
              <Info className="healthcare-tooltip-disclaimer-icon" />
              <span className="healthcare-tooltip-disclaimer-text">
                Diese Informationen ersetzen nicht die ärztliche Beratung.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

HealthcareTooltip.displayName = 'HealthcareTooltip'