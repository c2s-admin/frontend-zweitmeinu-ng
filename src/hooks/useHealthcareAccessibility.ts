/**
 * Healthcare Accessibility Hook
 * 
 * Custom React hook for managing accessibility features in healthcare components:
 * - Screen reader announcements
 * - Keyboard navigation
 * - Focus management
 * - High contrast mode
 * - Text size adjustments
 * - Reduced motion preferences
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  healthcareScreenReader,
  healthcareKeyboardManager,
  healthcareFocusManager,
  type HealthcareAnnouncementType,
  type AccessibilitySettings
} from '../lib/accessibility'

export interface UseHealthcareAccessibilityOptions {
  /** Enable automatic focus management */
  autoFocus?: boolean
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean
  /** Enable screen reader announcements */
  enableScreenReader?: boolean
  /** Component context for accessibility */
  context?: 'form' | 'navigation' | 'content' | 'emergency' | 'modal'
  /** Medical context for enhanced accessibility */
  medicalContext?: boolean
  /** Emergency mode for critical situations */
  emergencyMode?: boolean
}

export interface AccessibilityState {
  /** Current accessibility settings */
  settings: AccessibilitySettings
  /** Whether high contrast is active */
  isHighContrast: boolean
  /** Whether reduced motion is active */
  isReducedMotion: boolean
  /** Current text size */
  textSize: 'small' | 'medium' | 'large' | 'extra-large'
  /** Whether focus indicators are enhanced */
  enhancedFocus: boolean
  /** Whether keyboard navigation is active */
  keyboardNavigation: boolean
}

export function useHealthcareAccessibility(options: UseHealthcareAccessibilityOptions = {}) {
  const {
    autoFocus = false,
    enableKeyboardShortcuts: _enableKeyboardShortcuts = true,
    enableScreenReader = true,
    context: _context = 'content',
    medicalContext = false,
    emergencyMode = false
  } = options

  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    settings: {
      screenReaderOptimizations: true,
      keyboardNavigationEnhanced: true,
      highContrastMode: false,
      reducedMotion: false,
      focusIndicatorEnhanced: true,
      textSizeAdjustment: 'medium',
      voiceRecognition: false
    },
    isHighContrast: false,
    isReducedMotion: false,
    textSize: 'medium',
    enhancedFocus: true,
    keyboardNavigation: true
  })

  const componentRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Helpers before effects to satisfy TS ordering
  const loadAccessibilitySettings = useCallback((): Partial<AccessibilitySettings> => {
    if (typeof window === 'undefined') return {}
    try {
      const saved = localStorage.getItem('healthcare-accessibility-settings')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }, [])

  const saveAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    if (typeof window === 'undefined') return
    try {
      const currentSettings = loadAccessibilitySettings()
      const newSettings = { ...currentSettings, ...settings }
      localStorage.setItem('healthcare-accessibility-settings', JSON.stringify(newSettings))
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error)
    }
  }, [loadAccessibilitySettings])

  const announceEmergency = useCallback((message: string) => {
    healthcareScreenReader.announceEmergency(message)
  }, [])

  // Initialize accessibility features
  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    // Load saved settings from localStorage
    const savedSettings = loadAccessibilitySettings()
    
    const initialState: AccessibilityState = {
      ...accessibilityState,
      settings: { ...accessibilityState.settings, ...savedSettings },
      isReducedMotion: prefersReducedMotion || !!savedSettings.reducedMotion,
      isHighContrast: prefersHighContrast || !!savedSettings.highContrastMode,
      textSize: (savedSettings.textSizeAdjustment as AccessibilityState['textSize']) || 'medium'
    }

    setAccessibilityState(initialState)
    applyAccessibilitySettings(initialState)

    // Listen for preference changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setAccessibilityState(prev => ({ ...prev, isReducedMotion: e.matches }))
    }

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setAccessibilityState(prev => ({ ...prev, isHighContrast: e.matches }))
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
    highContrastQuery.addEventListener('change', handleHighContrastChange)

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      highContrastQuery.removeEventListener('change', handleHighContrastChange)
    }
  }, [accessibilityState, loadAccessibilitySettings])

  // Apply emergency mode
  useEffect(() => {
    if (emergencyMode) {
      document.body.classList.add('emergency-mode')
      announceEmergency('Notfall-Modus aktiviert. Alle wichtigen Funktionen sind priorisiert.')
    } else {
      document.body.classList.remove('emergency-mode')
    }

    return () => {
      document.body.classList.remove('emergency-mode')
    }
  }, [emergencyMode, announceEmergency])

  // Auto focus management
  useEffect(() => {
    if (autoFocus && componentRef.current) {
      const focusableElement = componentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement

      if (focusableElement) {
        // Store previous focus
        previousFocusRef.current = document.activeElement as HTMLElement
        // Focus the element
        focusableElement.focus()

        return () => {
          // Restore previous focus on cleanup
          if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
            previousFocusRef.current.focus()
          }
        }
      }
    }
  }, [autoFocus])

  // Screen reader functions
  const announce = useCallback((
    message: string, 
    type: HealthcareAnnouncementType = 'navigation',
    urgent = false
  ) => {
    if (!enableScreenReader) return
    
    // Add medical context if applicable
    if (medicalContext) {
      const medicalPrefix = urgent ? '🚨 Medizinischer Hinweis: ' : '🏥 '
      healthcareScreenReader.announce(medicalPrefix + message, type, urgent)
    } else {
      healthcareScreenReader.announce(message, type, urgent)
    }
  }, [enableScreenReader, medicalContext])


  const announceMedicalData = useCallback((message: string, sensitive = false) => {
    healthcareScreenReader.announceMedicalData(message, sensitive)
  }, [])

  const announceFormValidation = useCallback((field: string, error: string) => {
    healthcareScreenReader.announceFormValidation(field, error)
  }, [])

  const announceProgress = useCallback((step: number, total: number, description: string) => {
    healthcareScreenReader.announceProgress(step, total, description)
  }, [])

  // Focus management functions
  const focusFirst = useCallback(() => {
    if (!componentRef.current) return false

    const focusable = healthcareKeyboardManager.getFocusableElements(componentRef.current)
    if (focusable.length > 0) {
      focusable[0].focus()
      return true
    }
    return false
  }, [])

  const focusLast = useCallback(() => {
    if (!componentRef.current) return false

    const focusable = healthcareKeyboardManager.getFocusableElements(componentRef.current)
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
      return true
    }
    return false
  }, [])

  const focusNext = useCallback(() => {
    healthcareKeyboardManager.focusNext()
  }, [])

  const focusPrevious = useCallback(() => {
    healthcareKeyboardManager.focusPrevious()
  }, [])

  const trapFocus = useCallback(() => {
    if (componentRef.current) {
      healthcareKeyboardManager.trapFocus(componentRef.current)
    }
  }, [])

  const releaseFocusTrap = useCallback(() => {
    healthcareKeyboardManager.releaseFocusTrap()
  }, [])

  const storeFocus = useCallback(() => {
    healthcareFocusManager.storeFocus()
  }, [])

  const restoreFocus = useCallback(() => {
    return healthcareFocusManager.restoreFocus()
  }, [])

  const focusFirstError = useCallback(() => {
    return healthcareFocusManager.focusFirstError()
  }, [])

  // Settings management functions
  const toggleHighContrast = useCallback(() => {
    const newState = !accessibilityState.isHighContrast
    setAccessibilityState(prev => ({
      ...prev,
      isHighContrast: newState,
      settings: { ...prev.settings, highContrastMode: newState }
    }))
    
    if (newState) {
      document.body.classList.add('high-contrast')
      announce('Hoher Kontrast aktiviert')
    } else {
      document.body.classList.remove('high-contrast')
      announce('Hoher Kontrast deaktiviert')
    }
    
    saveAccessibilitySettings({ highContrastMode: newState })
  }, [accessibilityState.isHighContrast, announce, saveAccessibilitySettings])

  const toggleReducedMotion = useCallback(() => {
    const newState = !accessibilityState.isReducedMotion
    setAccessibilityState(prev => ({
      ...prev,
      isReducedMotion: newState,
      settings: { ...prev.settings, reducedMotion: newState }
    }))
    
    if (newState) {
      document.body.classList.add('reduced-motion')
      announce('Bewegungsreduzierung aktiviert')
    } else {
      document.body.classList.remove('reduced-motion')
      announce('Bewegungsreduzierung deaktiviert')
    }
    
    saveAccessibilitySettings({ reducedMotion: newState })
  }, [accessibilityState.isReducedMotion, announce, saveAccessibilitySettings])

  const setTextSize = useCallback((size: AccessibilityState['textSize']) => {
    // Remove all text size classes
    const textSizes = ['text-small', 'text-medium', 'text-large', 'text-extra-large']
    textSizes.forEach(className => document.body.classList.remove(className))
    
    // Add new text size class
    document.body.classList.add(`text-${size}`)
    
    setAccessibilityState(prev => ({
      ...prev,
      textSize: size,
      settings: { ...prev.settings, textSizeAdjustment: size }
    }))
    
    const sizeNames = {
      'small': 'Klein',
      'medium': 'Normal', 
      'large': 'Groß',
      'extra-large': 'Extra Groß'
    }
    
    announce(`Textgröße geändert zu: ${sizeNames[size]}`)
    saveAccessibilitySettings({ textSizeAdjustment: size })
  }, [announce, saveAccessibilitySettings])

  const cycleTextSize = useCallback(() => {
    const sizes: AccessibilityState['textSize'][] = ['small', 'medium', 'large', 'extra-large']
    const currentIndex = sizes.indexOf(accessibilityState.textSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setTextSize(sizes[nextIndex])
  }, [accessibilityState.textSize, setTextSize])

  const toggleEnhancedFocus = useCallback(() => {
    const newState = !accessibilityState.enhancedFocus
    setAccessibilityState(prev => ({
      ...prev,
      enhancedFocus: newState,
      settings: { ...prev.settings, focusIndicatorEnhanced: newState }
    }))
    
    if (newState) {
      document.body.classList.add('healthcare-enhanced-focus')
      announce('Verstärkte Fokusanzeige aktiviert')
    } else {
      document.body.classList.remove('healthcare-enhanced-focus')
      announce('Verstärkte Fokusanzeige deaktiviert')
    }
    
    saveAccessibilitySettings({ focusIndicatorEnhanced: newState })
  }, [accessibilityState.enhancedFocus, announce, saveAccessibilitySettings])

  // Utility functions
  const isKeyboardUser = useCallback(() => {
    return document.body.classList.contains('keyboard-navigation')
  }, [])

  const enableKeyboardNavigation = useCallback(() => {
    document.body.classList.add('keyboard-navigation')
    setAccessibilityState(prev => ({
      ...prev,
      keyboardNavigation: true,
      settings: { ...prev.settings, keyboardNavigationEnhanced: true }
    }))
  }, [])

  const disableKeyboardNavigation = useCallback(() => {
    document.body.classList.remove('keyboard-navigation')
    setAccessibilityState(prev => ({
      ...prev,
      keyboardNavigation: false,
      settings: { ...prev.settings, keyboardNavigationEnhanced: false }
    }))
  }, [])

  // Helper functions (defined earlier for TS ordering)

  const applyAccessibilitySettings = (state: AccessibilityState) => {
    // Apply high contrast
    if (state.isHighContrast) {
      document.body.classList.add('high-contrast')
    }

    // Apply reduced motion
    if (state.isReducedMotion) {
      document.body.classList.add('reduced-motion')
    }

    // Apply text size
    document.body.classList.add(`text-${state.textSize}`)

    // Apply enhanced focus
    if (state.enhancedFocus) {
      document.body.classList.add('healthcare-enhanced-focus')
    }

    // Apply keyboard navigation
    if (state.keyboardNavigation) {
      document.body.classList.add('keyboard-navigation')
    }
  }

  return {
    // State
    accessibilityState,
    componentRef,

    // Screen reader functions
    announce,
    announceEmergency,
    announceMedicalData,
    announceFormValidation,
    announceProgress,

    // Focus management
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    trapFocus,
    releaseFocusTrap,
    storeFocus,
    restoreFocus,
    focusFirstError,

    // Settings functions
    toggleHighContrast,
    toggleReducedMotion,
    setTextSize,
    cycleTextSize,
    toggleEnhancedFocus,

    // Utility functions
    isKeyboardUser,
    enableKeyboardNavigation,
    disableKeyboardNavigation
  }
}

// Specialized hooks for specific contexts
export function useHealthcareFormAccessibility(options: Omit<UseHealthcareAccessibilityOptions, 'context'> = {}) {
  return useHealthcareAccessibility({ ...options, context: 'form', autoFocus: true })
}

export function useHealthcareModalAccessibility(options: Omit<UseHealthcareAccessibilityOptions, 'context'> = {}) {
  const accessibility = useHealthcareAccessibility({ ...options, context: 'modal', autoFocus: true })

  useEffect(() => {
    // Auto trap focus when modal is active
    accessibility.trapFocus()
    accessibility.storeFocus()

    return () => {
      accessibility.releaseFocusTrap()
      accessibility.restoreFocus()
    }
  }, [accessibility])

  return accessibility
}

export function useHealthcareEmergencyAccessibility(options: Omit<UseHealthcareAccessibilityOptions, 'emergencyMode'> = {}) {
  return useHealthcareAccessibility({ 
    ...options, 
    emergencyMode: true, 
    context: 'emergency',
    medicalContext: true,
    enableScreenReader: true
  })
}

export function useHealthcareNavigationAccessibility(options: Omit<UseHealthcareAccessibilityOptions, 'context'> = {}) {
  return useHealthcareAccessibility({ ...options, context: 'navigation', enableKeyboardShortcuts: true })
}
