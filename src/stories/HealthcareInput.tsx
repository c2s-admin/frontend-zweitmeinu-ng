import React, { useState, forwardRef } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle, Info, Shield } from 'lucide-react'
import './HealthcareInput.css'

export interface HealthcareInputProps {
  /** Input label */
  label: string
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'time'
  /** Placeholder text */
  placeholder?: string
  /** Input value */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Required field */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Error message */
  error?: string
  /** Help text */
  helpText?: string
  /** Success state with message */
  success?: string
  /** Medical context (shows privacy indicator) */
  medicalContext?: boolean
  /** Input size */
  size?: 'small' | 'medium' | 'large'
  /** Full width */
  fullWidth?: boolean
  /** Input name attribute */
  name?: string
  /** Autocomplete attribute */
  autoComplete?: string
  /** ARIA describedby */
  'aria-describedby'?: string
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Icon to display (left side) */
  leftIcon?: React.ReactNode
  /** Show password toggle for password inputs */
  showPasswordToggle?: boolean
}

export const HealthcareInput = forwardRef<HTMLInputElement, HealthcareInputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  required = false,
  disabled = false,
  error,
  helpText,
  success,
  medicalContext = false,
  size = 'medium',
  fullWidth = false,
  name,
  autoComplete,
  'aria-describedby': ariaDescribedBy,
  onChange,
  onFocus,
  onBlur,
  leftIcon,
  showPasswordToggle = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const inputId = name ? `healthcare-input-${name}` : `healthcare-input-${Math.random().toString(36).substring(7)}`
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  const successId = `${inputId}-success`

  const inputType = type === 'password' && showPassword ? 'text' : type

  const containerClasses = `
    healthcare-input-container
    healthcare-input-container--${size}
    ${fullWidth ? 'healthcare-input-container--full-width' : ''}
    ${error ? 'healthcare-input-container--error' : ''}
    ${success ? 'healthcare-input-container--success' : ''}
    ${disabled ? 'healthcare-input-container--disabled' : ''}
    ${focused ? 'healthcare-input-container--focused' : ''}
    ${medicalContext ? 'healthcare-input-container--medical' : ''}
  `.trim()

  const inputClasses = `
    healthcare-input
    healthcare-input--${size}
    ${leftIcon ? 'healthcare-input--with-left-icon' : ''}
    ${(type === 'password' && showPasswordToggle) ? 'healthcare-input--with-right-icon' : ''}
    ${error ? 'healthcare-input--error' : ''}
    ${success ? 'healthcare-input--success' : ''}
  `.trim()

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(e)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Build aria-describedby
  const describedByIds = []
  if (helpText) describedByIds.push(helpId)
  if (error) describedByIds.push(errorId)
  if (success) describedByIds.push(successId)
  if (ariaDescribedBy) describedByIds.push(ariaDescribedBy)

  return (
    <div className={containerClasses}>
      {/* Label */}
      <label htmlFor={inputId} className="healthcare-input-label">
        <span className="healthcare-input-label-text">
          {label}
          {required && <span className="healthcare-input-required">*</span>}
        </span>
        {medicalContext && (
          <div className="healthcare-input-privacy">
            <Shield className="healthcare-input-privacy-icon" />
            <span className="healthcare-input-privacy-text">Schweigepflicht</span>
          </div>
        )}
      </label>

      {/* Input Container */}
      <div className="healthcare-input-wrapper">
        {/* Left Icon */}
        {leftIcon && (
          <div className="healthcare-input-left-icon">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={inputClasses}
          aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Password Toggle */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="healthcare-input-password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="healthcare-input-password-icon" />
            ) : (
              <Eye className="healthcare-input-password-icon" />
            )}
          </button>
        )}

        {/* Status Icons */}
        {error && (
          <div className="healthcare-input-status-icon healthcare-input-status-icon--error">
            <AlertCircle className="healthcare-input-icon" />
          </div>
        )}
        {success && (
          <div className="healthcare-input-status-icon healthcare-input-status-icon--success">
            <CheckCircle className="healthcare-input-icon" />
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <div id={helpId} className="healthcare-input-help">
          <Info className="healthcare-input-help-icon" />
          <span className="healthcare-input-help-text">{helpText}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div id={errorId} className="healthcare-input-error" role="alert">
          <AlertCircle className="healthcare-input-error-icon" />
          <span className="healthcare-input-error-text">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div id={successId} className="healthcare-input-success" role="status">
          <CheckCircle className="healthcare-input-success-icon" />
          <span className="healthcare-input-success-text">{success}</span>
        </div>
      )}

      {/* Medical Context Privacy Notice */}
      {medicalContext && (
        <div className="healthcare-input-privacy-notice">
          <Shield className="healthcare-input-privacy-notice-icon" />
          <span className="healthcare-input-privacy-notice-text">
            Alle medizinischen Daten werden verschlüsselt übertragen und unterliegen der ärztlichen Schweigepflicht.
          </span>
        </div>
      )}
    </div>
  )
})

HealthcareInput.displayName = 'HealthcareInput'