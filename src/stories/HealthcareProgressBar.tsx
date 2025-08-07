import React from 'react'
import { Check, Clock, AlertTriangle, Heart, FileText, UserCheck, Stethoscope, Calendar } from 'lucide-react'
import './HealthcareProgressBar.css'

export interface HealthcareProgressStep {
  /** Step identifier */
  id: string
  /** Step label */
  label: string
  /** Step description */
  description?: string
  /** Step status */
  status: 'pending' | 'current' | 'completed' | 'error' | 'warning'
  /** Step icon */
  icon?: React.ReactNode
  /** Medical context info */
  medicalInfo?: {
    /** Expected duration */
    duration?: string
    /** Medical professional */
    professional?: string
    /** Medical specialty */
    specialty?: 'kardiologie' | 'onkologie' | 'gallenblase' | 'nephrologie' | 'schilddruese' | 'intensivmedizin'
  }
  /** Optional click handler */
  onClick?: () => void
}

export interface HealthcareProgressBarProps {
  /** Progress steps */
  steps: HealthcareProgressStep[]
  /** Current step index */
  currentStep?: number
  /** Progress percentage (0-100) */
  progress?: number
  /** Progress bar size */
  size?: 'small' | 'medium' | 'large'
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Medical process type */
  processType?: 'appointment' | 'treatment' | 'diagnosis' | 'emergency' | 'consent'
  /** Show step numbers */
  showStepNumbers?: boolean
  /** Show progress percentage */
  showPercentage?: boolean
  /** Show medical timeline */
  showTimeline?: boolean
  /** Emergency contact visible */
  emergencyContact?: {
    number: string
    text: string
  }
  /** Animated progress */
  animated?: boolean
  /** Medical context styling */
  medicalContext?: boolean
  /** Custom class name */
  className?: string
  /** Step click handler */
  onStepClick?: (step: HealthcareProgressStep, index: number) => void
}

export const HealthcareProgressBar = ({
  steps,
  currentStep = 0,
  progress,
  size = 'medium',
  orientation = 'horizontal',
  processType = 'treatment',
  showStepNumbers = true,
  showPercentage = false,
  showTimeline = false,
  emergencyContact = {
    number: '+49 800 80 44 100',
    text: 'Medizinischer Notfall?'
  },
  animated = true,
  medicalContext = false,
  className = '',
  onStepClick,
  ...props
}: HealthcareProgressBarProps) => {
  
  // Calculate progress percentage if not provided
  const calculatedProgress = progress !== undefined ? progress : 
    steps.length > 0 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0

  const containerClasses = `
    healthcare-progress-container
    healthcare-progress-container--${size}
    healthcare-progress-container--${orientation}
    healthcare-progress-container--${processType}
    ${medicalContext ? 'healthcare-progress-container--medical' : ''}
    ${animated ? 'healthcare-progress-container--animated' : ''}
    ${className}
  `.trim()

  // Get status icon
  const getStatusIcon = (status: HealthcareProgressStep['status'], stepIcon?: React.ReactNode) => {
    if (stepIcon) return stepIcon
    
    switch (status) {
      case 'completed':
        return <Check className="healthcare-progress-step-icon" />
      case 'current':
        return <Clock className="healthcare-progress-step-icon" />
      case 'error':
        return <AlertTriangle className="healthcare-progress-step-icon" />
      case 'warning':
        return <AlertTriangle className="healthcare-progress-step-icon" />
      case 'pending':
      default:
        return <div className="healthcare-progress-step-number">{steps.findIndex(s => s.id === steps.find(step => step.status === status)?.id) + 1}</div>
    }
  }

  // Get process type icon
  const getProcessTypeIcon = () => {
    switch (processType) {
      case 'appointment':
        return <Calendar className="healthcare-progress-type-icon" />
      case 'treatment':
        return <Stethoscope className="healthcare-progress-type-icon" />
      case 'diagnosis':
        return <Heart className="healthcare-progress-type-icon" />
      case 'emergency':
        return <AlertTriangle className="healthcare-progress-type-icon" />
      case 'consent':
        return <FileText className="healthcare-progress-type-icon" />
      default:
        return <UserCheck className="healthcare-progress-type-icon" />
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

  return (
    <div className={containerClasses} {...props}>
      {/* Emergency Contact (for emergency process type) */}
      {processType === 'emergency' && emergencyContact && (
        <div className="healthcare-progress-emergency">
          <AlertTriangle className="healthcare-progress-emergency-icon" />
          <span className="healthcare-progress-emergency-text">
            {emergencyContact.text}
          </span>
          <a 
            href={`tel:${emergencyContact.number}`}
            className="healthcare-progress-emergency-number"
          >
            {emergencyContact.number}
          </a>
        </div>
      )}

      {/* Header */}
      <div className="healthcare-progress-header">
        <div className="healthcare-progress-title-section">
          {getProcessTypeIcon()}
          <div className="healthcare-progress-title-content">
            <h3 className="healthcare-progress-title">
              {processType === 'appointment' && 'Terminbuchung'}
              {processType === 'treatment' && 'Behandlungsverlauf'}
              {processType === 'diagnosis' && 'Diagnoseverfahren'}
              {processType === 'emergency' && 'Notfallbehandlung'}
              {processType === 'consent' && 'Einverständniserklärung'}
            </h3>
            {showTimeline && (
              <div className="healthcare-progress-timeline">
                Schritt {currentStep + 1} von {steps.length}
              </div>
            )}
          </div>
        </div>

        {/* Progress Percentage */}
        {showPercentage && (
          <div className="healthcare-progress-percentage">
            <span className="healthcare-progress-percentage-value">
              {calculatedProgress}%
            </span>
            <span className="healthcare-progress-percentage-label">
              Fortschritt
            </span>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="healthcare-progress-track">
        {/* Progress Fill */}
        <div 
          className="healthcare-progress-fill"
          style={{ 
            [orientation === 'horizontal' ? 'width' : 'height']: `${calculatedProgress}%` 
          }}
        />
        
        {/* Steps */}
        <div className="healthcare-progress-steps">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep || step.status === 'completed'
            const hasError = step.status === 'error'
            const hasWarning = step.status === 'warning'

            const stepClasses = `
              healthcare-progress-step
              healthcare-progress-step--${step.status}
              ${isActive ? 'healthcare-progress-step--active' : ''}
              ${isCompleted ? 'healthcare-progress-step--completed' : ''}
              ${step.onClick || onStepClick ? 'healthcare-progress-step--clickable' : ''}
            `.trim()

            const handleStepClick = () => {
              if (step.onClick) {
                step.onClick()
              } else if (onStepClick) {
                onStepClick(step, index)
              }
            }

            return (
              <div
                key={step.id}
                className={stepClasses}
                style={{
                  [orientation === 'horizontal' ? 'left' : 'top']: 
                    `${(index / (steps.length - 1)) * 100}%`
                }}
                onClick={handleStepClick}
                role={step.onClick || onStepClick ? 'button' : undefined}
                tabIndex={step.onClick || onStepClick ? 0 : undefined}
                aria-label={`${step.label} - ${step.status}`}
              >
                {/* Step Circle */}
                <div 
                  className="healthcare-progress-step-circle"
                  style={{
                    borderColor: step.medicalInfo?.specialty ? 
                      getSpecialtyColor(step.medicalInfo.specialty) : 
                      undefined
                  }}
                >
                  {showStepNumbers ? (
                    isCompleted || step.status === 'completed' ? (
                      <Check className="healthcare-progress-step-icon" />
                    ) : hasError ? (
                      <AlertTriangle className="healthcare-progress-step-icon healthcare-progress-step-icon--error" />
                    ) : hasWarning ? (
                      <AlertTriangle className="healthcare-progress-step-icon healthcare-progress-step-icon--warning" />
                    ) : (
                      step.icon || (
                        <span className="healthcare-progress-step-number">
                          {index + 1}
                        </span>
                      )
                    )
                  ) : (
                    getStatusIcon(step.status, step.icon)
                  )}
                </div>

                {/* Step Content */}
                <div className="healthcare-progress-step-content">
                  <div className="healthcare-progress-step-label">
                    {step.label}
                  </div>
                  
                  {step.description && (
                    <div className="healthcare-progress-step-description">
                      {step.description}
                    </div>
                  )}

                  {/* Medical Info */}
                  {step.medicalInfo && (
                    <div className="healthcare-progress-step-medical">
                      {step.medicalInfo.duration && (
                        <div className="healthcare-progress-step-duration">
                          <Clock className="healthcare-progress-step-duration-icon" />
                          <span>{step.medicalInfo.duration}</span>
                        </div>
                      )}
                      
                      {step.medicalInfo.professional && (
                        <div className="healthcare-progress-step-professional">
                          <UserCheck className="healthcare-progress-step-professional-icon" />
                          <span>{step.medicalInfo.professional}</span>
                        </div>
                      )}
                      
                      {step.medicalInfo.specialty && (
                        <div 
                          className="healthcare-progress-step-specialty"
                          style={{ 
                            color: getSpecialtyColor(step.medicalInfo.specialty) 
                          }}
                        >
                          <div 
                            className="healthcare-progress-step-specialty-indicator"
                            style={{ 
                              backgroundColor: getSpecialtyColor(step.medicalInfo.specialty) 
                            }}
                          />
                          {step.medicalInfo.specialty.charAt(0).toUpperCase() + 
                           step.medicalInfo.specialty.slice(1)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Indicator */}
                  {(hasError || hasWarning) && (
                    <div className={`healthcare-progress-step-status healthcare-progress-step-status--${step.status}`}>
                      {hasError && '⚠️ Fehler aufgetreten'}
                      {hasWarning && '⚠️ Achtung erforderlich'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Medical Context Footer */}
      {medicalContext && (
        <div className="healthcare-progress-medical-footer">
          <Heart className="healthcare-progress-medical-footer-icon" />
          <div className="healthcare-progress-medical-footer-content">
            <span className="healthcare-progress-medical-footer-title">
              Medizinische Betreuung
            </span>
            <span className="healthcare-progress-medical-footer-text">
              Alle Schritte werden von qualifizierten Fachärzten begleitet und sind 
              durch die ärztliche Schweigepflicht geschützt.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

HealthcareProgressBar.displayName = 'HealthcareProgressBar'