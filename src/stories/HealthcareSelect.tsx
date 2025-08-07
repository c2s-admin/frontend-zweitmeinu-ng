import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import './HealthcareSelect.css'

export interface HealthcareSelectOption {
  value: string
  label: string
  description?: string
  specialty?: string
  disabled?: boolean
}

export interface HealthcareSelectProps {
  /** Select label */
  label: string
  /** Available options */
  options: HealthcareSelectOption[]
  /** Selected value(s) */
  value?: string | string[]
  /** Default value(s) */
  defaultValue?: string | string[]
  /** Placeholder text */
  placeholder?: string
  /** Multiple selection */
  multiple?: boolean
  /** Searchable dropdown */
  searchable?: boolean
  /** Required field */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Error message */
  error?: string
  /** Help text */
  helpText?: string
  /** Success message */
  success?: string
  /** Medical context styling */
  medicalContext?: boolean
  /** Select size */
  size?: 'small' | 'medium' | 'large'
  /** Full width */
  fullWidth?: boolean
  /** Max height for dropdown */
  maxHeight?: number
  /** Clear button for multiple select */
  clearable?: boolean
  /** Name attribute */
  name?: string
  /** Change handler */
  onChange?: (value: string | string[]) => void
  /** Search handler */
  onSearch?: (query: string) => void
  /** Focus handler */
  onFocus?: () => void
  /** Blur handler */
  onBlur?: () => void
}

export const HealthcareSelect = ({
  label,
  options,
  value,
  defaultValue,
  placeholder = 'Auswählen...',
  multiple = false,
  searchable = false,
  required = false,
  disabled = false,
  error,
  helpText,
  success,
  medicalContext = false,
  size = 'medium',
  fullWidth = false,
  maxHeight = 300,
  clearable = false,
  name,
  onChange,
  onSearch,
  onFocus,
  onBlur
}: HealthcareSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [internalValue, setInternalValue] = useState<string | string[]>(
    value !== undefined ? value : (defaultValue || (multiple ? [] : ''))
  )
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectId = name ? `healthcare-select-${name}` : `healthcare-select-${Math.random().toString(36).substring(7)}`
  const helpId = `${selectId}-help`
  const errorId = `${selectId}-error`
  const successId = `${selectId}-success`

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options

  // Get current value(s)
  const currentValue = value !== undefined ? value : internalValue
  const selectedOptions = multiple 
    ? options.filter(option => Array.isArray(currentValue) && currentValue.includes(option.value))
    : options.find(option => currentValue === option.value)

  const containerClasses = `
    healthcare-select-container
    healthcare-select-container--${size}
    ${fullWidth ? 'healthcare-select-container--full-width' : ''}
    ${error ? 'healthcare-select-container--error' : ''}
    ${success ? 'healthcare-select-container--success' : ''}
    ${disabled ? 'healthcare-select-container--disabled' : ''}
    ${isOpen ? 'healthcare-select-container--open' : ''}
    ${medicalContext ? 'healthcare-select-container--medical' : ''}
  `.trim()

  const selectClasses = `
    healthcare-select
    healthcare-select--${size}
    ${error ? 'healthcare-select--error' : ''}
    ${success ? 'healthcare-select--success' : ''}
    ${disabled ? 'healthcare-select--disabled' : ''}
  `.trim()

  // Handle value change
  const handleChange = (optionValue: string) => {
    let newValue: string | string[]

    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      if (currentArray.includes(optionValue)) {
        newValue = currentArray.filter(v => v !== optionValue)
      } else {
        newValue = [...currentArray, optionValue]
      }
    } else {
      newValue = optionValue
      setIsOpen(false)
    }

    setInternalValue(newValue)
    onChange?.(newValue)
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = multiple ? [] : ''
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFocusedIndex(-1)
    onSearch?.(query)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleChange(filteredOptions[focusedIndex].value)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, 0))
        }
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement
      focusedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex, isOpen])

  // Build aria-describedby
  const describedByIds = []
  if (helpText) describedByIds.push(helpId)
  if (error) describedByIds.push(errorId)
  if (success) describedByIds.push(successId)

  // Get display text
  const getDisplayText = () => {
    if (multiple && Array.isArray(currentValue)) {
      if (currentValue.length === 0) return placeholder
      if (currentValue.length === 1) {
        const option = options.find(opt => opt.value === currentValue[0])
        return option?.label || currentValue[0]
      }
      return `${currentValue.length} ausgewählt`
    } else {
      const option = options.find(opt => opt.value === currentValue)
      return option?.label || placeholder
    }
  }

  return (
    <div className={containerClasses} ref={selectRef}>
      {/* Label */}
      <label htmlFor={selectId} className="healthcare-select-label">
        <span className="healthcare-select-label-text">
          {label}
          {required && <span className="healthcare-select-required">*</span>}
        </span>
        {medicalContext && (
          <div className="healthcare-select-medical-indicator">
            <span className="healthcare-select-medical-text">Fachbereich</span>
          </div>
        )}
      </label>

      {/* Select Button */}
      <div
        className={selectClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${selectId}-label`}
        aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
      >
        <div className="healthcare-select-content">
          {/* Selected Value(s) Display */}
          <div className="healthcare-select-value">
            {multiple && Array.isArray(currentValue) && currentValue.length > 1 ? (
              <div className="healthcare-select-chips">
                {selectedOptions.slice(0, 2).map((option) => (
                  <span key={option.value} className="healthcare-select-chip">
                    {option.label}
                    <button
                      className="healthcare-select-chip-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleChange(option.value)
                      }}
                      aria-label={`${option.label} entfernen`}
                    >
                      <X className="healthcare-select-chip-remove-icon" />
                    </button>
                  </span>
                ))}
                {currentValue.length > 2 && (
                  <span className="healthcare-select-chip healthcare-select-chip--count">
                    +{currentValue.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="healthcare-select-text">
                {getDisplayText()}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="healthcare-select-actions">
            {clearable && currentValue && (multiple ? (Array.isArray(currentValue) && currentValue.length > 0) : true) && (
              <button
                className="healthcare-select-clear"
                onClick={handleClear}
                aria-label="Auswahl löschen"
                tabIndex={-1}
              >
                <X className="healthcare-select-clear-icon" />
              </button>
            )}
            <div className="healthcare-select-arrow">
              <ChevronDown className="healthcare-select-arrow-icon" />
            </div>
          </div>
        </div>

        {/* Status Icons */}
        {error && (
          <div className="healthcare-select-status-icon healthcare-select-status-icon--error">
            <AlertCircle className="healthcare-select-icon" />
          </div>
        )}
        {success && (
          <div className="healthcare-select-status-icon healthcare-select-status-icon--success">
            <CheckCircle className="healthcare-select-icon" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="healthcare-select-dropdown" style={{ maxHeight }}>
          {/* Search Input */}
          {searchable && (
            <div className="healthcare-select-search">
              <Search className="healthcare-select-search-icon" />
              <input
                ref={inputRef}
                type="text"
                className="healthcare-select-search-input"
                placeholder="Fachbereich suchen..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    handleKeyDown(e)
                  }
                }}
              />
            </div>
          )}

          {/* Options List */}
          <ul
            ref={listRef}
            className="healthcare-select-list"
            role="listbox"
            aria-multiselectable={multiple}
          >
            {filteredOptions.length === 0 ? (
              <li className="healthcare-select-option healthcare-select-option--empty">
                <span>Keine Optionen gefunden</span>
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = multiple
                  ? Array.isArray(currentValue) && currentValue.includes(option.value)
                  : currentValue === option.value
                const isFocused = index === focusedIndex

                return (
                  <li
                    key={option.value}
                    className={`
                      healthcare-select-option
                      ${isSelected ? 'healthcare-select-option--selected' : ''}
                      ${isFocused ? 'healthcare-select-option--focused' : ''}
                      ${option.disabled ? 'healthcare-select-option--disabled' : ''}
                      ${option.specialty ? `healthcare-select-option--${option.specialty}` : ''}
                    `.trim()}
                    onClick={() => !option.disabled && handleChange(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                  >
                    <div className="healthcare-select-option-content">
                      <div className="healthcare-select-option-main">
                        <span className="healthcare-select-option-label">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="healthcare-select-option-description">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="healthcare-select-option-check">
                          <Check className="healthcare-select-check-icon" />
                        </div>
                      )}
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <div id={helpId} className="healthcare-select-help">
          <Info className="healthcare-select-help-icon" />
          <span className="healthcare-select-help-text">{helpText}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div id={errorId} className="healthcare-select-error" role="alert">
          <AlertCircle className="healthcare-select-error-icon" />
          <span className="healthcare-select-error-text">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div id={successId} className="healthcare-select-success" role="status">
          <CheckCircle className="healthcare-select-success-icon" />
          <span className="healthcare-select-success-text">{success}</span>
        </div>
      )}
    </div>
  )
}