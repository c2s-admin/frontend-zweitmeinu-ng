import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { AlertCircle, CheckCircle, Info, Shield, Type, RotateCcw } from 'lucide-react'
import './HealthcareTextarea.css'

export interface HealthcareTextareaProps {
  /** Textarea label */
  label: string
  /** Textarea value */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Required field */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Readonly state */
  readOnly?: boolean
  /** Error message */
  error?: string
  /** Help text */
  helpText?: string
  /** Success message */
  success?: string
  /** Medical context (shows privacy indicators) */
  medicalContext?: boolean
  /** Auto-resize textarea */
  autoResize?: boolean
  /** Minimum rows */
  minRows?: number
  /** Maximum rows */
  maxRows?: number
  /** Character limit */
  maxLength?: number
  /** Show character count */
  showCharacterCount?: boolean
  /** Textarea size */
  size?: 'small' | 'medium' | 'large'
  /** Full width */
  fullWidth?: boolean
  /** Name attribute */
  name?: string
  /** Autocomplete attribute */
  autoComplete?: string
  /** Spell check */
  spellCheck?: boolean
  /** ARIA describedby */
  'aria-describedby'?: string
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  /** Clear handler */
  onClear?: () => void
  /** Input handler (for real-time changes) */
  onInput?: (event: React.FormEvent<HTMLTextAreaElement>) => void
}

export const HealthcareTextarea = forwardRef<HTMLTextAreaElement, HealthcareTextareaProps>(({
  label,
  value,
  defaultValue,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  success,
  medicalContext = false,
  autoResize = false,
  minRows = 3,
  maxRows = 12,
  maxLength,
  showCharacterCount = false,
  size = 'medium',
  fullWidth = false,
  name,
  autoComplete,
  spellCheck = true,
  'aria-describedby': ariaDescribedBy,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onInput,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value || defaultValue || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const actualRef = ref || textareaRef

  const textareaId = name ? `healthcare-textarea-${name}` : `healthcare-textarea-${Math.random().toString(36).substring(7)}`
  const helpId = `${textareaId}-help`
  const errorId = `${textareaId}-error`
  const successId = `${textareaId}-success`
  const countId = `${textareaId}-count`

  const containerClasses = `
    healthcare-textarea-container
    healthcare-textarea-container--${size}
    ${fullWidth ? 'healthcare-textarea-container--full-width' : ''}
    ${error ? 'healthcare-textarea-container--error' : ''}
    ${success ? 'healthcare-textarea-container--success' : ''}
    ${disabled ? 'healthcare-textarea-container--disabled' : ''}
    ${readOnly ? 'healthcare-textarea-container--readonly' : ''}
    ${focused ? 'healthcare-textarea-container--focused' : ''}
    ${medicalContext ? 'healthcare-textarea-container--medical' : ''}
  `.trim()

  const textareaClasses = `
    healthcare-textarea
    healthcare-textarea--${size}
    ${error ? 'healthcare-textarea--error' : ''}
    ${success ? 'healthcare-textarea--success' : ''}
    ${autoResize ? 'healthcare-textarea--auto-resize' : ''}
  `.trim()

  // Auto-resize functionality
  const adjustHeight = () => {
    if (autoResize && actualRef && 'current' in actualRef && actualRef.current) {
      const textarea = actualRef.current
      textarea.style.height = 'auto'
      
      const minHeight = minRows * 24 // Approximate line height
      const maxHeight = maxRows * 24
      const scrollHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      
      textarea.style.height = `${scrollHeight}px`
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // Apply maxLength if specified
    if (maxLength && newValue.length > maxLength) {
      return
    }
    
    if (value === undefined) {
      setInternalValue(newValue)
    }
    
    onChange?.(e)
    adjustHeight()
  }

  // Handle input event (real-time)
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    onInput?.(e)
    adjustHeight()
  }

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true)
    onFocus?.(e)
  }

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false)
    onBlur?.(e)
  }

  // Handle clear
  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('')
    }
    onClear?.()
    
    // Focus textarea after clearing
    if (actualRef && 'current' in actualRef && actualRef.current) {
      actualRef.current.focus()
    }
  }

  // Adjust height on mount and value changes
  useEffect(() => {
    adjustHeight()
  }, [value, internalValue, autoResize, minRows, maxRows])

  // Build aria-describedby
  const describedByIds = []
  if (helpText) describedByIds.push(helpId)
  if (error) describedByIds.push(errorId)
  if (success) describedByIds.push(successId)
  if (showCharacterCount && maxLength) describedByIds.push(countId)
  if (ariaDescribedBy) describedByIds.push(ariaDescribedBy)

  // Get current value for character counting
  const currentValue = value !== undefined ? value : internalValue
  const characterCount = currentValue.length
  const isNearLimit = maxLength && characterCount > maxLength * 0.8
  const isOverLimit = maxLength && characterCount > maxLength

  return (
    <div className={containerClasses}>
      {/* Label */}
      <label htmlFor={textareaId} className="healthcare-textarea-label">
        <div className="healthcare-textarea-label-content">
          <span className="healthcare-textarea-label-text">
            {label}
            {required && <span className="healthcare-textarea-required">*</span>}
          </span>
          {medicalContext && (
            <div className="healthcare-textarea-privacy">
              <Shield className="healthcare-textarea-privacy-icon" />
              <span className="healthcare-textarea-privacy-text">Vertraulich</span>
            </div>
          )}
        </div>
        
        {/* Character Count in Label */}
        {showCharacterCount && maxLength && (
          <div 
            id={countId}
            className={`
              healthcare-textarea-count 
              ${isNearLimit ? 'healthcare-textarea-count--warning' : ''}
              ${isOverLimit ? 'healthcare-textarea-count--error' : ''}
            `.trim()}
          >
            <Type className="healthcare-textarea-count-icon" />
            <span>{characterCount} / {maxLength}</span>
          </div>
        )}
      </label>

      {/* Textarea Container */}
      <div className="healthcare-textarea-wrapper">
        {/* Textarea */}
        <textarea
          ref={actualRef}
          id={textareaId}
          name={name}
          value={currentValue}
          defaultValue={value !== undefined ? undefined : defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          rows={autoResize ? minRows : undefined}
          maxLength={maxLength}
          className={textareaClasses}
          aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          onChange={handleChange}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Clear Button */}
        {onClear && currentValue && !disabled && !readOnly && (
          <button
            type="button"
            className="healthcare-textarea-clear"
            onClick={handleClear}
            aria-label="Text löschen"
            tabIndex={-1}
          >
            <RotateCcw className="healthcare-textarea-clear-icon" />
          </button>
        )}

        {/* Status Icons */}
        {error && (
          <div className="healthcare-textarea-status-icon healthcare-textarea-status-icon--error">
            <AlertCircle className="healthcare-textarea-icon" />
          </div>
        )}
        {success && (
          <div className="healthcare-textarea-status-icon healthcare-textarea-status-icon--success">
            <CheckCircle className="healthcare-textarea-icon" />
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <div id={helpId} className="healthcare-textarea-help">
          <Info className="healthcare-textarea-help-icon" />
          <span className="healthcare-textarea-help-text">{helpText}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div id={errorId} className="healthcare-textarea-error" role="alert">
          <AlertCircle className="healthcare-textarea-error-icon" />
          <span className="healthcare-textarea-error-text">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div id={successId} className="healthcare-textarea-success" role="status">
          <CheckCircle className="healthcare-textarea-success-icon" />
          <span className="healthcare-textarea-success-text">{success}</span>
        </div>
      )}

      {/* Medical Context Privacy Notice */}
      {medicalContext && (
        <div className="healthcare-textarea-privacy-notice">
          <Shield className="healthcare-textarea-privacy-notice-icon" />
          <div className="healthcare-textarea-privacy-notice-content">
            <span className="healthcare-textarea-privacy-notice-title">
              Medizinische Schweigepflicht
            </span>
            <span className="healthcare-textarea-privacy-notice-text">
              Alle Angaben werden vertraulich behandelt und unterliegen der ärztlichen Schweigepflicht. 
              Daten werden verschlüsselt übertragen und DSGVO-konform gespeichert.
            </span>
          </div>
        </div>
      )}
    </div>
  )
})

HealthcareTextarea.displayName = 'HealthcareTextarea'