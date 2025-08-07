import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Check, AlertTriangle, FileText, User, Heart, Calendar, Shield, Phone, Clock, Info } from 'lucide-react'
import './ConsultationFlow.css'

export interface ConsultationStep {
  /** Step identifier */
  id: string
  /** Step title */
  title: string
  /** Step description */
  description: string
  /** Whether step is required */
  required?: boolean
  /** Whether step is completed */
  completed?: boolean
  /** Medical specialty context */
  specialty?: string
  /** Estimated time to complete */
  estimatedTime?: string
  /** Medical privacy notice */
  privacyNotice?: string
}

export interface ConsultationData {
  /** Personal information */
  personalInfo?: {
    name?: string
    email?: string
    phone?: string
    age?: number
    gender?: string
  }
  /** Medical concern */
  medicalConcern?: {
    specialty?: string
    symptoms?: string
    urgency?: 'routine' | 'urgent' | 'emergency'
    duration?: string
    previousTreatment?: boolean
  }
  /** Medical history */
  medicalHistory?: {
    conditions?: string[]
    medications?: string[]
    allergies?: string[]
    surgeries?: string[]
  }
  /** Uploaded documents */
  documents?: Array<{
    id: string
    name: string
    type: string
    size: number
    uploadDate: Date
  }>
  /** Consent and privacy */
  consent?: {
    medicalAdvice?: boolean
    dataProcessing?: boolean
    communication?: boolean
    gdprConsent?: boolean
  }
  /** Doctor preferences */
  preferences?: {
    doctorGender?: 'male' | 'female' | 'no-preference'
    language?: string
    communicationMethod?: 'video' | 'phone' | 'message'
    appointmentTime?: Date
  }
}

export interface ConsultationFlowProps {
  /** Consultation steps */
  steps?: ConsultationStep[]
  /** Current step index */
  currentStep?: number
  /** Consultation data */
  data?: ConsultationData
  /** Flow variant */
  variant?: 'default' | 'compact' | 'mobile' | 'emergency'
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Show progress indicator */
  showProgress?: boolean
  /** Show step numbers */
  showStepNumbers?: boolean
  /** Show estimated time */
  showEstimatedTime?: boolean
  /** Allow step skipping */
  allowSkipping?: boolean
  /** Emergency mode */
  emergencyMode?: boolean
  /** Medical context styling */
  medicalContext?: boolean
  /** Auto-save progress */
  autoSave?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Step change handler */
  onStepChange?: (stepIndex: number, stepData: any) => void
  /** Data change handler */
  onDataChange?: (data: ConsultationData) => void
  /** Step validation handler */
  onValidateStep?: (stepIndex: number, data: any) => boolean | string
  /** Flow completion handler */
  onComplete?: (data: ConsultationData) => void
  /** Emergency contact handler */
  onEmergencyContact?: () => void
  /** Cancel flow handler */
  onCancel?: () => void
}

// Default consultation steps
const defaultSteps: ConsultationStep[] = [
  {
    id: 'welcome',
    title: 'Willkommen',
    description: 'Informationen über den Beratungsprozess',
    // icon will be rendered based on step type
    required: true,
    estimatedTime: '2 Min'
  },
  {
    id: 'personal-info',
    title: 'Persönliche Angaben',
    description: 'Ihre Kontaktdaten für die medizinische Beratung',
    // icon will be rendered based on step type
    required: true,
    estimatedTime: '3 Min',
    privacyNotice: 'Ihre Daten werden vertraulich behandelt und unterliegen der ärztlichen Schweigepflicht.'
  },
  {
    id: 'medical-concern',
    title: 'Medizinisches Anliegen',
    description: 'Beschreibung Ihrer Symptome und Beschwerden',
    // icon will be rendered based on step type
    required: true,
    estimatedTime: '5 Min'
  },
  {
    id: 'medical-history',
    title: 'Krankengeschichte',
    description: 'Vorerkrankungen, Medikamente und Allergien',
    // icon will be rendered based on step type
    required: false,
    estimatedTime: '4 Min'
  },
  {
    id: 'documents',
    title: 'Medizinische Unterlagen',
    description: 'Befunde, Laborwerte oder Bilder hochladen',
    // icon will be rendered based on step type
    required: false,
    estimatedTime: '3 Min'
  },
  {
    id: 'consent',
    title: 'Einverständniserklärung',
    description: 'DSGVO-Einwilligung und medizinische Beratung',
    // icon will be rendered based on step type
    required: true,
    estimatedTime: '2 Min',
    privacyNotice: 'Ihre Einwilligung können Sie jederzeit widerrufen.'
  },
  {
    id: 'summary',
    title: 'Zusammenfassung',
    description: 'Überprüfung Ihrer Angaben vor dem Absenden',
    // icon will be rendered based on step type
    required: true,
    estimatedTime: '2 Min'
  }
]

// Get icon component for consultation step type
const getStepIconComponent = (stepId?: string) => {
  switch (stepId) {
    case 'welcome':
      return Heart
    case 'personal-info':
    case 'contact-info':
      return User
    case 'medical-concern':
    case 'symptoms':
      return FileText
    case 'medical-history':
      return Clock
    case 'documents':
      return FileText
    case 'consent':
      return Shield
    case 'summary':
    case 'emergency-summary':
      return Check
    case 'emergency-triage':
      return AlertTriangle
    default:
      return Info
  }
}

export const ConsultationFlow = ({
  steps = defaultSteps,
  currentStep = 0,
  data = {},
  variant = 'default',
  size = 'medium',
  showProgress = true,
  showStepNumbers = true,
  showEstimatedTime = true,
  allowSkipping = false,
  emergencyMode = false,
  medicalContext = true,
  autoSave = true,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onStepChange,
  onDataChange,
  onValidateStep,
  onComplete,
  onEmergencyContact,
  onCancel,
  ...props
}: ConsultationFlowProps) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(currentStep)
  const [internalData, setInternalData] = useState<ConsultationData>(data)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const containerClasses = `
    consultation-flow-container
    consultation-flow-container--${variant}
    consultation-flow-container--${size}
    ${emergencyMode ? 'consultation-flow-container--emergency' : ''}
    ${medicalContext ? 'consultation-flow-container--medical' : ''}
    ${loading ? 'consultation-flow-container--loading' : ''}
    ${className}
  `.trim()

  const currentStepData = steps[internalCurrentStep]
  const isFirstStep = internalCurrentStep === 0
  const isLastStep = internalCurrentStep === steps.length - 1
  const progressPercentage = ((internalCurrentStep + 1) / steps.length) * 100

  // Update internal state when props change
  useEffect(() => {
    setInternalCurrentStep(currentStep)
  }, [currentStep])

  useEffect(() => {
    setInternalData(data)
  }, [data])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onDataChange) {
      const timeoutId = setTimeout(() => {
        onDataChange(internalData)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [internalData, autoSave, onDataChange])

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const step = steps[internalCurrentStep]
    const errors: Record<string, string> = {}

    // External validation
    if (onValidateStep) {
      const result = onValidateStep(internalCurrentStep, internalData)
      if (typeof result === 'string') {
        errors[step.id] = result
      } else if (!result && step.required) {
        errors[step.id] = 'Bitte vervollständigen Sie diesen Schritt.'
      }
    }

    // Basic required field validation
    if (step.required && !completedSteps.has(internalCurrentStep)) {
      // Add step-specific validation logic here
      switch (step.id) {
        case 'personal-info':
          if (!internalData.personalInfo?.name || !internalData.personalInfo?.email) {
            errors[step.id] = 'Name und E-Mail-Adresse sind erforderlich.'
          }
          break
        case 'medical-concern':
          if (!internalData.medicalConcern?.symptoms) {
            errors[step.id] = 'Bitte beschreiben Sie Ihr medizinisches Anliegen.'
          }
          break
        case 'consent':
          if (!internalData.consent?.gdprConsent || !internalData.consent?.medicalAdvice) {
            errors[step.id] = 'Bitte stimmen Sie den erforderlichen Einverständniserklärungen zu.'
          }
          break
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Go to next step
  const goToNextStep = () => {
    if (isLastStep) {
      if (validateCurrentStep()) {
        setCompletedSteps(prev => new Set(prev).add(internalCurrentStep))
        onComplete?.(internalData)
      }
      return
    }

    if (validateCurrentStep() || allowSkipping) {
      const nextStep = internalCurrentStep + 1
      setCompletedSteps(prev => new Set(prev).add(internalCurrentStep))
      setInternalCurrentStep(nextStep)
      onStepChange?.(nextStep, internalData)
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      const prevStep = internalCurrentStep - 1
      setInternalCurrentStep(prevStep)
      onStepChange?.(prevStep, internalData)
      // Clear validation errors when going back
      setValidationErrors({})
    }
  }

  // Go to specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setInternalCurrentStep(stepIndex)
      onStepChange?.(stepIndex, internalData)
      // Clear validation errors when navigating
      setValidationErrors({})
    }
  }

  // Update consultation data
  const updateData = (updates: Partial<ConsultationData>) => {
    const newData = { ...internalData, ...updates }
    setInternalData(newData)
    onDataChange?.(newData)
  }

  // Get step status
  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' | 'error' => {
    if (completedSteps.has(index)) return 'completed'
    if (index === internalCurrentStep) {
      return validationErrors[steps[index].id] ? 'error' : 'current'
    }
    return 'pending'
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="consultation-flow-skeleton">
          <div className="consultation-flow-skeleton-progress" />
          <div className="consultation-flow-skeleton-content">
            <div className="consultation-flow-skeleton-title" />
            <div className="consultation-flow-skeleton-description" />
            <div className="consultation-flow-skeleton-form" />
          </div>
          <div className="consultation-flow-skeleton-actions" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Medizinische Beratung - Schritt für Schritt'}
      {...props}
    >
      {/* Emergency Banner */}
      {emergencyMode && (
        <div className="consultation-flow-emergency-banner">
          <AlertTriangle className="consultation-flow-emergency-icon" />
          <span className="consultation-flow-emergency-text">
            Bei medizinischen Notfällen wählen Sie bitte sofort die 112
          </span>
          <button
            className="consultation-flow-emergency-button"
            onClick={onEmergencyContact}
          >
            <Phone className="consultation-flow-emergency-button-icon" />
            Notfall
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      {showProgress && (
        <div className="consultation-flow-progress-container">
          <div className="consultation-flow-progress-bar">
            <div 
              className="consultation-flow-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="consultation-flow-progress-text">
            Schritt {internalCurrentStep + 1} von {steps.length}
            {showEstimatedTime && currentStepData.estimatedTime && (
              <span className="consultation-flow-estimated-time">
                · ca. {currentStepData.estimatedTime}
              </span>
            )}
          </div>

          {/* Step Indicators */}
          <div className="consultation-flow-steps-indicator">
            {steps.map((step, index) => {
              const status = getStepStatus(index)
              const stepClasses = `
                consultation-flow-step-indicator
                consultation-flow-step-indicator--${status}
                ${index <= internalCurrentStep ? 'consultation-flow-step-indicator--accessible' : ''}
              `.trim()

              return (
                <div
                  key={step.id}
                  className={stepClasses}
                  onClick={() => index <= internalCurrentStep ? goToStep(index) : undefined}
                  role="button"
                  tabIndex={index <= internalCurrentStep ? 0 : -1}
                  aria-label={`${step.title} - ${status === 'completed' ? 'abgeschlossen' : status === 'current' ? 'aktuell' : 'ausstehend'}`}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && index <= internalCurrentStep) {
                      e.preventDefault()
                      goToStep(index)
                    }
                  }}
                >
                  <div className="consultation-flow-step-indicator-content">
                    {showStepNumbers ? (
                      <span className="consultation-flow-step-number">
                        {status === 'completed' ? <Check /> : index + 1}
                      </span>
                    ) : (
                      <div className="consultation-flow-step-icon">
                        {status === 'completed' ? <Check /> : React.createElement(getStepIconComponent(step.id), { className: 'consultation-step-icon' })}
                      </div>
                    )}
                    
                    {(variant === 'default' || size === 'large') && (
                      <span className="consultation-flow-step-title">
                        {step.title}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Current Step Content */}
      <div className="consultation-flow-content">
        {/* Step Header */}
        <div className="consultation-flow-step-header">
          <div className="consultation-flow-step-icon-container">
            {React.createElement(getStepIconComponent(currentStepData.id), { className: 'consultation-step-icon' })}
          </div>
          
          <div className="consultation-flow-step-info">
            <h2 className="consultation-flow-step-title">
              {currentStepData.title}
            </h2>
            <p className="consultation-flow-step-description">
              {currentStepData.description}
            </p>
            
            {currentStepData.required && (
              <div className="consultation-flow-required-indicator">
                <Info className="consultation-flow-required-icon" />
                <span>Dieser Schritt ist erforderlich</span>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error */}
        {validationErrors[currentStepData.id] && (
          <div className="consultation-flow-validation-error">
            <AlertTriangle className="consultation-flow-validation-icon" />
            <span>{validationErrors[currentStepData.id]}</span>
          </div>
        )}

        {/* Step-Specific Content */}
        <div className="consultation-flow-step-content">
          {/* This would be replaced with actual step components */}
          <div className="consultation-flow-placeholder">
            <p>Hier würde der Inhalt für "{currentStepData.title}" angezeigt werden.</p>
            
            {/* Demo form elements based on step */}
            {currentStepData.id === 'personal-info' && (
              <div className="consultation-flow-demo-form">
                <div className="consultation-flow-form-group">
                  <label htmlFor="demo-name">Vollständiger Name *</label>
                  <input
                    id="demo-name"
                    type="text"
                    className="consultation-flow-input"
                    placeholder="Max Mustermann"
                    value={internalData.personalInfo?.name || ''}
                    onChange={(e) => updateData({
                      personalInfo: { ...internalData.personalInfo, name: e.target.value }
                    })}
                  />
                </div>
                <div className="consultation-flow-form-group">
                  <label htmlFor="demo-email">E-Mail-Adresse *</label>
                  <input
                    id="demo-email"
                    type="email"
                    className="consultation-flow-input"
                    placeholder="max.mustermann@email.com"
                    value={internalData.personalInfo?.email || ''}
                    onChange={(e) => updateData({
                      personalInfo: { ...internalData.personalInfo, email: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            {currentStepData.id === 'medical-concern' && (
              <div className="consultation-flow-demo-form">
                <div className="consultation-flow-form-group">
                  <label htmlFor="demo-symptoms">Beschreibung Ihrer Symptome *</label>
                  <textarea
                    id="demo-symptoms"
                    className="consultation-flow-textarea"
                    rows={4}
                    placeholder="Bitte beschreiben Sie Ihre Beschwerden..."
                    value={internalData.medicalConcern?.symptoms || ''}
                    onChange={(e) => updateData({
                      medicalConcern: { ...internalData.medicalConcern, symptoms: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            {currentStepData.id === 'consent' && (
              <div className="consultation-flow-demo-form">
                <div className="consultation-flow-checkbox-group">
                  <label className="consultation-flow-checkbox">
                    <input
                      type="checkbox"
                      checked={internalData.consent?.medicalAdvice || false}
                      onChange={(e) => updateData({
                        consent: { ...internalData.consent, medicalAdvice: e.target.checked }
                      })}
                    />
                    <span>Ich stimme der medizinischen Beratung zu *</span>
                  </label>
                  <label className="consultation-flow-checkbox">
                    <input
                      type="checkbox"
                      checked={internalData.consent?.gdprConsent || false}
                      onChange={(e) => updateData({
                        consent: { ...internalData.consent, gdprConsent: e.target.checked }
                      })}
                    />
                    <span>Ich stimme der DSGVO-konformen Datenverarbeitung zu *</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        {currentStepData.privacyNotice && (
          <div className="consultation-flow-privacy-notice">
            <Shield className="consultation-flow-privacy-icon" />
            <span>{currentStepData.privacyNotice}</span>
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="consultation-flow-actions">
        <div className="consultation-flow-actions-left">
          {!isFirstStep && (
            <button
              className="consultation-flow-action consultation-flow-action--secondary"
              onClick={goToPreviousStep}
            >
              <ChevronLeft className="consultation-flow-action-icon" />
              Zurück
            </button>
          )}
          
          {onCancel && (
            <button
              className="consultation-flow-action consultation-flow-action--tertiary"
              onClick={onCancel}
            >
              Abbrechen
            </button>
          )}
        </div>

        <div className="consultation-flow-actions-right">
          <button
            className="consultation-flow-action consultation-flow-action--primary"
            onClick={goToNextStep}
          >
            {isLastStep ? 'Beratung anfragen' : 'Weiter'}
            {!isLastStep && <ChevronRight className="consultation-flow-action-icon" />}
          </button>
        </div>
      </div>

      {/* Medical Context Footer */}
      {medicalContext && (
        <div className="consultation-flow-medical-footer">
          <Shield className="consultation-flow-medical-footer-icon" />
          <div className="consultation-flow-medical-footer-content">
            <span className="consultation-flow-medical-footer-title">
              Medizinische Zweitmeinung
            </span>
            <span className="consultation-flow-medical-footer-text">
              Alle Angaben werden vertraulich behandelt und unterliegen der ärztlichen Schweigepflicht. 
              DSGVO-konforme Datenverarbeitung.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

ConsultationFlow.displayName = 'ConsultationFlow'