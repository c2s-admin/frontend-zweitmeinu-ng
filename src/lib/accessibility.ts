/**
 * Healthcare Advanced Accessibility Utilities
 * 
 * Comprehensive accessibility enhancements for healthcare applications:
 * - Screen reader optimization with medical context
 * - Keyboard navigation patterns for healthcare workflows
 * - High contrast and reduced motion support
 * - Voice recognition integration
 * - Emergency accessibility features
 * - WCAG 2.1 AA+ compliance utilities
 */

// Screen reader announcements for medical contexts
export type HealthcareAnnouncementType = 
  | 'emergency'
  | 'medical-data'
  | 'privacy'
  | 'form-validation'
  | 'progress'
  | 'success'
  | 'error'
  | 'navigation'

export interface HealthcareScreenReaderConfig {
  language: 'de-DE' | 'en-US' | 'auto'
  medicalTerminologyMode: boolean
  urgencyLevel: 'normal' | 'important' | 'assertive'
  verbosity: 'minimal' | 'standard' | 'detailed'
}

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  description: string
  category: 'navigation' | 'emergency' | 'forms' | 'accessibility'
  handler: (event: KeyboardEvent) => void
}

export interface AccessibilitySettings {
  screenReaderOptimizations: boolean
  keyboardNavigationEnhanced: boolean
  highContrastMode: boolean
  reducedMotion: boolean
  focusIndicatorEnhanced: boolean
  textSizeAdjustment: 'small' | 'medium' | 'large' | 'extra-large'
  voiceRecognition: boolean
}

/**
 * Healthcare Screen Reader Manager
 * Optimized announcements for medical contexts
 */
export class HealthcareScreenReader {
  private static instance: HealthcareScreenReader
  private config: HealthcareScreenReaderConfig
  private announcementQueue: Array<{ message: string; type: HealthcareAnnouncementType; priority: number }>
  private isProcessing = false

  constructor(config: Partial<HealthcareScreenReaderConfig> = {}) {
    this.config = {
      language: 'de-DE',
      medicalTerminologyMode: true,
      urgencyLevel: 'normal',
      verbosity: 'standard',
      ...config
    }
    this.announcementQueue = []
  }

  static getInstance(config?: Partial<HealthcareScreenReaderConfig>): HealthcareScreenReader {
    if (!HealthcareScreenReader.instance) {
      HealthcareScreenReader.instance = new HealthcareScreenReader(config)
    }
    return HealthcareScreenReader.instance
  }

  /**
   * Announce message to screen reader with healthcare context
   */
  announce(
    message: string, 
    type: HealthcareAnnouncementType = 'navigation',
    urgent = false
  ): void {
    const priority = this.getPriorityLevel(type, urgent)
    const enhancedMessage = this.enhanceMessageForHealthcare(message, type)
    
    this.announcementQueue.push({
      message: enhancedMessage,
      type,
      priority
    })

    this.processAnnouncementQueue()
  }

  /**
   * Emergency announcement - highest priority
   */
  announceEmergency(message: string): void {
    this.announce(message, 'emergency', true)
  }

  /**
   * Medical data announcement with privacy considerations
   */
  announceMedicalData(message: string, sensitive = false): void {
    const privacyEnhanced = sensitive 
      ? `Vertrauliche medizinische Information: ${message}. Diese Daten sind durch die ärztliche Schweigepflicht geschützt.`
      : message
    
    this.announce(privacyEnhanced, 'medical-data')
  }

  /**
   * Form validation announcement for medical forms
   */
  announceFormValidation(field: string, error: string): void {
    const message = `Fehler im Feld ${field}: ${error}. Bitte korrigieren Sie die Eingabe für eine ordnungsgemäße medizinische Beratung.`
    this.announce(message, 'form-validation', true)
  }

  /**
   * Progress announcement for medical processes
   */
  announceProgress(step: number, total: number, description: string): void {
    const message = `Schritt ${step} von ${total} der medizinischen Datenerfassung: ${description}`
    this.announce(message, 'progress')
  }

  private enhanceMessageForHealthcare(message: string, type: HealthcareAnnouncementType): string {
    if (!this.config.medicalTerminologyMode) {
      return message
    }

    // Add medical context prefixes
    const contextPrefixes = {
      'emergency': '🚨 MEDIZINISCHER NOTFALL: ',
      'medical-data': '🏥 Medizinische Information: ',
      'privacy': '🔒 Datenschutz: ',
      'form-validation': '⚠️ Eingabefehler: ',
      'progress': '📋 Fortschritt: ',
      'success': '✅ Erfolg: ',
      'error': '❌ Fehler: ',
      'navigation': ''
    }

    const prefix = contextPrefixes[type] || ''
    return prefix + message
  }

  private getPriorityLevel(type: HealthcareAnnouncementType, urgent: boolean): number {
    const basePriorities = {
      'emergency': 10,
      'form-validation': 8,
      'error': 7,
      'medical-data': 6,
      'privacy': 5,
      'success': 4,
      'progress': 3,
      'navigation': 2
    }

    const basePriority = basePriorities[type] || 1
    return urgent ? basePriority + 5 : basePriority
  }

  private async processAnnouncementQueue(): Promise<void> {
    if (this.isProcessing || this.announcementQueue.length === 0) {
      return
    }

    this.isProcessing = true

    // Sort by priority (highest first)
    this.announcementQueue.sort((a, b) => b.priority - a.priority)

    while (this.announcementQueue.length > 0) {
      const announcement = this.announcementQueue.shift()!
      await this.makeAnnouncement(announcement.message, announcement.type)
      
      // Brief pause between announcements
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    this.isProcessing = false
  }

  private async makeAnnouncement(message: string, type: HealthcareAnnouncementType): Promise<void> {
    // Create ARIA live region for announcement
    const liveRegion = this.getOrCreateLiveRegion(type)
    
    // Clear previous content
    liveRegion.textContent = ''
    
    // Brief delay to ensure screen readers notice the change
    await new Promise(resolve => setTimeout(resolve, 10))
    
    // Set the announcement
    liveRegion.textContent = message

    // Auto-clear after announcement (except for persistent types)
    if (type !== 'emergency' && type !== 'form-validation') {
      setTimeout(() => {
        if (liveRegion.textContent === message) {
          liveRegion.textContent = ''
        }
      }, 3000)
    }
  }

  private getOrCreateLiveRegion(type: HealthcareAnnouncementType): HTMLElement {
    const regionId = `healthcare-sr-${type}`
    let region = document.getElementById(regionId)

    if (!region) {
      region = document.createElement('div')
      region.id = regionId
      region.setAttribute('aria-live', type === 'emergency' ? 'assertive' : 'polite')
      region.setAttribute('aria-atomic', 'true')
      region.className = 'sr-only healthcare-screen-reader-region'
      region.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `
      document.body.appendChild(region)
    }

    return region
  }
}

/**
 * Healthcare Keyboard Navigation Manager
 * Enhanced keyboard shortcuts for medical workflows
 */
export class HealthcareKeyboardManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map()
  private isActive = true
  private trapStack: HTMLElement[] = []

  constructor() {
    this.initializeHealthcareShortcuts()
    this.bindEventListeners()
  }

  private initializeHealthcareShortcuts(): void {
    // Emergency shortcuts
    this.addShortcut({
      key: 'F1',
      description: 'Notfall-Hotline anrufen',
      category: 'emergency',
      handler: () => {
        this.triggerEmergencyAction()
      }
    })

    this.addShortcut({
      key: 'Escape',
      description: 'Aktuelle Aktion abbrechen / Modal schließen',
      category: 'navigation',
      handler: (event) => {
        this.handleEscapeKey(event)
      }
    })

    // Navigation shortcuts
    this.addShortcut({
      key: 'h',
      altKey: true,
      description: 'Zur Hauptnavigation springen',
      category: 'navigation',
      handler: () => {
        this.focusMainNavigation()
      }
    })

    this.addShortcut({
      key: 'm',
      altKey: true,
      description: 'Zum Hauptinhalt springen',
      category: 'navigation',
      handler: () => {
        this.focusMainContent()
      }
    })

    this.addShortcut({
      key: 's',
      altKey: true,
      description: 'Suche fokussieren',
      category: 'navigation',
      handler: () => {
        this.focusSearch()
      }
    })

    // Form shortcuts
    this.addShortcut({
      key: 'Enter',
      ctrlKey: true,
      description: 'Formular abschicken',
      category: 'forms',
      handler: () => {
        this.submitCurrentForm()
      }
    })

    this.addShortcut({
      key: 's',
      ctrlKey: true,
      description: 'Formular zwischenspeichern',
      category: 'forms',
      handler: (event) => {
        event.preventDefault()
        this.saveFormData()
      }
    })

    // Accessibility shortcuts
    this.addShortcut({
      key: 'c',
      altKey: true,
      shiftKey: true,
      description: 'Hohen Kontrast umschalten',
      category: 'accessibility',
      handler: () => {
        this.toggleHighContrast()
      }
    })

    this.addShortcut({
      key: 'r',
      altKey: true,
      shiftKey: true,
      description: 'Bewegungen reduzieren',
      category: 'accessibility',
      handler: () => {
        this.toggleReducedMotion()
      }
    })

    this.addShortcut({
      key: 't',
      altKey: true,
      shiftKey: true,
      description: 'Textgröße anpassen',
      category: 'accessibility',
      handler: () => {
        this.cycleTextSize()
      }
    })
  }

  addShortcut(shortcut: KeyboardShortcut): void {
    const key = this.createShortcutKey(shortcut)
    this.shortcuts.set(key, shortcut)
  }

  removeShortcut(shortcut: Partial<KeyboardShortcut>): void {
    const key = this.createShortcutKey(shortcut as KeyboardShortcut)
    this.shortcuts.delete(key)
  }

  /**
   * Trap focus within a container (for modals, forms)
   */
  trapFocus(container: HTMLElement): void {
    this.trapStack.push(container)
    this.updateFocusTrap()
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap(): HTMLElement | undefined {
    const released = this.trapStack.pop()
    this.updateFocusTrap()
    return released
  }

  /**
   * Get all focusable elements within container
   */
  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }

  /**
   * Focus next element in tab order
   */
  focusNext(currentElement?: HTMLElement): void {
    const focusable = this.getFocusableElements()
    const currentIndex = currentElement 
      ? focusable.indexOf(currentElement)
      : focusable.indexOf(document.activeElement as HTMLElement)
    
    const nextIndex = (currentIndex + 1) % focusable.length
    focusable[nextIndex]?.focus()
  }

  /**
   * Focus previous element in tab order
   */
  focusPrevious(currentElement?: HTMLElement): void {
    const focusable = this.getFocusableElements()
    const currentIndex = currentElement
      ? focusable.indexOf(currentElement)
      : focusable.indexOf(document.activeElement as HTMLElement)
    
    const prevIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1
    focusable[prevIndex]?.focus()
  }

  private createShortcutKey(shortcut: KeyboardShortcut): string {
    const modifiers = []
    if (shortcut.ctrlKey) modifiers.push('ctrl')
    if (shortcut.altKey) modifiers.push('alt')
    if (shortcut.shiftKey) modifiers.push('shift')
    if (shortcut.metaKey) modifiers.push('meta')
    
    return [...modifiers, shortcut.key.toLowerCase()].join('+')
  }

  private bindEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isActive) return

    const shortcutKey = this.createShortcutKey({
      key: event.key,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey
    } as KeyboardShortcut)

    const shortcut = this.shortcuts.get(shortcutKey)
    if (shortcut) {
      event.preventDefault()
      shortcut.handler(event)
      
      // Announce shortcut activation to screen reader
      const screenReader = HealthcareScreenReader.getInstance()
      screenReader.announce(`Tastenkürzel aktiviert: ${shortcut.description}`)
    }

    // Handle tab navigation with focus trap
    if (event.key === 'Tab' && this.trapStack.length > 0) {
      this.handleTabbingInTrap(event)
    }
  }

  private handleKeyUp(_event: KeyboardEvent): void {
    // Handle any key up events if needed
  }

  private handleTabbingInTrap(event: KeyboardEvent): void {
    const currentTrap = this.trapStack[this.trapStack.length - 1]
    const focusableElements = this.getFocusableElements(currentTrap)
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement as HTMLElement

    if (event.shiftKey) {
      // Shift + Tab (backwards)
      if (activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab (forwards)
      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  private updateFocusTrap(): void {
    // Update focus trap logic when trap stack changes
    if (this.trapStack.length > 0) {
      const currentTrap = this.trapStack[this.trapStack.length - 1]
      const focusable = this.getFocusableElements(currentTrap)
      if (focusable.length > 0 && !currentTrap.contains(document.activeElement)) {
        focusable[0].focus()
      }
    }
  }

  // Shortcut handler implementations
  private triggerEmergencyAction(): void {
    // Show emergency modal or call emergency number
    window.open('tel:112', '_self')
    const screenReader = HealthcareScreenReader.getInstance()
    screenReader.announceEmergency('Notfall-Hotline wird angerufen: 112')
  }

  private handleEscapeKey(_event: KeyboardEvent): void {
    // Close modals, cancel actions
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])')
    if (modal) {
      const closeButton = modal.querySelector('[aria-label*="schließen"], .close') as HTMLButtonElement
      closeButton?.click()
    }
  }

  private focusMainNavigation(): void {
    const nav = document.querySelector('nav[role="navigation"], nav') as HTMLElement
    nav?.focus()
  }

  private focusMainContent(): void {
    const main = document.querySelector('main, #main-content, [role="main"]') as HTMLElement
    main?.focus()
  }

  private focusSearch(): void {
    const search = document.querySelector('input[type="search"], [role="searchbox"]') as HTMLElement
    search?.focus()
  }

  private submitCurrentForm(): void {
    const activeElement = document.activeElement
    const form = activeElement?.closest('form')
    if (form) {
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLButtonElement
      submitButton?.click()
    }
  }

  private saveFormData(): void {
    const activeElement = document.activeElement
    const form = activeElement?.closest('form')
    if (form) {
      // Trigger form auto-save
      form.dispatchEvent(new CustomEvent('healthcare-auto-save'))
      const screenReader = HealthcareScreenReader.getInstance()
      screenReader.announce('Formulardaten wurden automatisch gespeichert')
    }
  }

  private toggleHighContrast(): void {
    document.body.classList.toggle('high-contrast')
    const isActive = document.body.classList.contains('high-contrast')
    const screenReader = HealthcareScreenReader.getInstance()
    screenReader.announce(`Hoher Kontrast ${isActive ? 'aktiviert' : 'deaktiviert'}`)
  }

  private toggleReducedMotion(): void {
    document.body.classList.toggle('reduced-motion')
    const isActive = document.body.classList.contains('reduced-motion')
    const screenReader = HealthcareScreenReader.getInstance()
    screenReader.announce(`Bewegungsreduzierung ${isActive ? 'aktiviert' : 'deaktiviert'}`)
  }

  private cycleTextSize(): void {
    const sizes = ['text-small', 'text-medium', 'text-large', 'text-extra-large']
    const currentSize = sizes.find(size => document.body.classList.contains(size))
    const currentIndex = currentSize ? sizes.indexOf(currentSize) : 1
    const nextIndex = (currentIndex + 1) % sizes.length
    
    // Remove all size classes
    sizes.forEach(size => document.body.classList.remove(size))
    // Add new size
    document.body.classList.add(sizes[nextIndex])
    
    const sizeNames = {
      'text-small': 'Klein',
      'text-medium': 'Normal',
      'text-large': 'Groß',
      'text-extra-large': 'Extra Groß'
    }
    
    const screenReader = HealthcareScreenReader.getInstance()
    screenReader.announce(`Textgröße geändert zu: ${sizeNames[sizes[nextIndex] as keyof typeof sizeNames]}`)
  }
}

/**
 * Healthcare Focus Manager
 * Enhanced focus management for medical workflows
 */
export class HealthcareFocusManager {
  private focusHistory: HTMLElement[] = []
  private maxHistoryLength = 10

  /**
   * Store current focus in history
   */
  storeFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement)
      if (this.focusHistory.length > this.maxHistoryLength) {
        this.focusHistory.shift()
      }
    }
  }

  /**
   * Restore previous focus
   */
  restoreFocus(): boolean {
    const previousElement = this.focusHistory.pop()
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus()
      return true
    }
    return false
  }

  /**
   * Focus first form error
   */
  focusFirstError(): boolean {
    const errorElement = document.querySelector('.error, [aria-invalid="true"], .healthcare-input--error input') as HTMLElement
    if (errorElement) {
      errorElement.focus()
      return true
    }
    return false
  }

  /**
   * Focus next required field
   */
  focusNextRequired(): boolean {
    const requiredFields = document.querySelectorAll(
      'input[required], textarea[required], select[required]'
    ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    const currentElement = document.activeElement as HTMLElement
    const currentIndex = Array.from(requiredFields).indexOf(currentElement as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    
    for (let i = currentIndex + 1; i < requiredFields.length; i++) {
      const field = requiredFields[i]
      if (!field.value || field.validity.valueMissing) {
        field.focus()
        return true
      }
    }
    return false
  }

  /**
   * Enhance focus indicators
   */
  enhanceFocusIndicators(): void {
    const style = document.createElement('style')
    style.innerHTML = `
      /* Enhanced focus indicators for healthcare */
      .healthcare-enhanced-focus :focus {
        outline: 3px solid #1278B3 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(18, 120, 179, 0.2) !important;
      }
      
      .healthcare-enhanced-focus button:focus {
        outline: 3px solid #10b981 !important;
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.2) !important;
      }
      
      .healthcare-enhanced-focus .error:focus,
      .healthcare-enhanced-focus [aria-invalid="true"]:focus {
        outline: 3px solid #dc2626 !important;
        box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.2) !important;
      }
    `
    document.head.appendChild(style)
    document.body.classList.add('healthcare-enhanced-focus')
  }
}

// Singleton instances
export const healthcareScreenReader = HealthcareScreenReader.getInstance()
export const healthcareKeyboardManager = new HealthcareKeyboardManager()
export const healthcareFocusManager = new HealthcareFocusManager()

// Utility functions
export const announceToScreenReader = (message: string, type?: HealthcareAnnouncementType) => {
  healthcareScreenReader.announce(message, type)
}

export const announceEmergency = (message: string) => {
  healthcareScreenReader.announceEmergency(message)
}

export const announceMedicalData = (message: string, sensitive?: boolean) => {
  healthcareScreenReader.announceMedicalData(message, sensitive)
}

export const announceFormValidation = (field: string, error: string) => {
  healthcareScreenReader.announceFormValidation(field, error)
}

export const announceProgress = (step: number, total: number, description: string) => {
  healthcareScreenReader.announceProgress(step, total, description)
}

// Initialize accessibility features
if (typeof window !== 'undefined') {
  // Auto-enhance focus indicators
  document.addEventListener('DOMContentLoaded', () => {
    healthcareFocusManager.enhanceFocusIndicators()
  })

  // Add healthcare accessibility controls to window for debugging
  interface HealthcareAccessibilityGlobal {
    healthcareAccessibility?: Record<string, unknown>
  }
  ;(window as unknown as HealthcareAccessibilityGlobal).healthcareAccessibility = {
    screenReader: healthcareScreenReader,
    keyboard: healthcareKeyboardManager,
    focus: healthcareFocusManager,
    announce: announceToScreenReader,
    announceEmergency,
    announceMedicalData
  }
}
