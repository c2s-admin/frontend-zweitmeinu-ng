/**
 * Storybook-Specific Analytics Integration
 * Healthcare Design System analytics for Storybook 9.1.1
 */

import { HealthcareEvents } from './healthcare-events.js'

/**
 * Storybook Analytics Manager for Healthcare Components
 * Tracks design system usage and component interactions within Storybook
 */
export class StorybookAnalytics {
  constructor() {
    this.initialized = false
    this.sessionId = this.generateSessionId()
    this.viewerType = this.detectViewerType()
    this.deviceType = this.detectDeviceType()
  }
  
  /**
   * Initialize Storybook Analytics
   * Called when Storybook loads
   */
  init() {
    if (this.initialized) return
    
    console.log('🏥 Healthcare Storybook Analytics initialized')
    this.initialized = true
    
    // Track Storybook session start
    HealthcareEvents.storybook.storyView('Storybook Session Start', {
      viewer_type: this.viewerType,
      device_type: this.deviceType,
      storybook_version: '9.1.1',
      session_id: this.sessionId
    })
    
    this.setupStoryListeners()
    this.setupAddonListeners()
    this.setupPerformanceTracking()
  }
  
  /**
   * Track story view with healthcare context
   */
  trackStoryView(storyName, storyArgs = {}, context = {}) {
    if (!this.initialized) return
    
    const healthcareContext = this.extractHealthcareContext(storyName, storyArgs)
    
    HealthcareEvents.storybook.storyView(storyName, {
      ...context,
      ...healthcareContext,
      viewer_type: this.viewerType,
      device_type: this.deviceType,
      session_id: this.sessionId,
      story_args: this.sanitizeStoryArgs(storyArgs)
    })
  }
  
  /**
   * Track component interaction within stories
   */
  trackStoryInteraction(storyName, componentName, action, context = {}) {
    if (!this.initialized) return
    
    HealthcareEvents.componentInteraction(componentName, action, {
      ...context,
      storybook_context: true,
      story_name: storyName,
      viewer_type: this.viewerType,
      session_id: this.sessionId
    })
  }
  
  /**
   * Track addon usage (A11y, Docs, etc.)
   */
  trackAddonUsage(addonName, action, context = {}) {
    if (!this.initialized) return
    
    HealthcareEvents.storybook.addonUsage(addonName, {
      ...context,
      action: action,
      viewer_type: this.viewerType,
      session_id: this.sessionId,
      
      // Medical addon context
      accessibility_testing: addonName === 'a11y',
      medical_review: context.medical_review || false
    })
  }
  
  /**
   * Track accessibility addon specific events
   */
  trackA11yAddon(storyName, violations = [], context = {}) {
    if (!this.initialized) return
    
    // Track accessibility testing
    HealthcareEvents.accessibilityFeature('storybook_a11y_test', {
      healthcare_context: this.extractHealthcareContext(storyName).medical_context,
      violations_found: violations.length,
      violation_types: violations.map(v => v.impact),
      story_name: storyName,
      viewer_type: this.viewerType,
      
      // Medical accessibility context
      medical_context: this.isMedicalStory(storyName) ? 'medical' : 'general',
      emergency_story: storyName.toLowerCase().includes('emergency'),
      
      feature_success: violations.length === 0,
      session_id: this.sessionId
    })
  }
  
  /**
   * Track design token usage in stories
   */
  trackDesignTokenUsage(tokenName, tokenValue, componentName, context = {}) {
    if (!this.initialized) return
    
    HealthcareEvents.designSystemUsage(tokenName, {
      ...context,
      token_value: tokenValue,
      component_using_token: componentName,
      usage_context: 'storybook',
      viewer_type: this.viewerType,
      session_id: this.sessionId,
      
      // Medical design context
      medical_context: this.isMedicalComponent(componentName) ? 'medical' : 'general',
      trust_element: this.isTrustElement(tokenName, componentName),
      emergency_element: this.isEmergencyElement(componentName)
    })
  }
  
  /**
   * Setup automatic story listeners
   */
  setupStoryListeners() {
    // Listen for story changes (if available in Storybook API)
    if (window.__STORYBOOK_ADDONS_CHANNEL__) {
      const channel = window.__STORYBOOK_ADDONS_CHANNEL__
      
      channel.on('storybook/story-changed', (storyId) => {
        const story = this.getStoryFromId(storyId)
        if (story) {
          this.trackStoryView(story.name, story.args, {
            story_id: storyId,
            story_kind: story.kind
          })
        }
      })
      
      channel.on('storybook/addon/a11y/result', (result) => {
        const currentStory = this.getCurrentStory()
        if (currentStory && result) {
          this.trackA11yAddon(currentStory.name, result.violations || [], {
            passes: result.passes?.length || 0,
            incomplete: result.incomplete?.length || 0
          })
        }
      })
    }
  }
  
  /**
   * Setup addon-specific listeners
   */
  setupAddonListeners() {
    // Track addon panel usage
    document.addEventListener('click', (event) => {
      const addonButton = event.target.closest('[data-addon-id]')
      if (addonButton) {
        const addonId = addonButton.getAttribute('data-addon-id')
        this.trackAddonUsage(addonId, 'panel_opened', {
          addon_panel_id: addonId
        })
      }
    })
  }
  
  /**
   * Setup performance tracking for Storybook
   */
  setupPerformanceTracking() {
    // Track initial load performance
    if (window.performance) {
      setTimeout(() => {
        const loadTime = window.performance.now()
        HealthcareEvents.storybook.storyView('Storybook Load Performance', {
          load_time: Math.round(loadTime),
          viewer_type: this.viewerType,
          device_type: this.deviceType,
          session_id: this.sessionId
        })
      }, 1000)
    }
  }
  
  /**
   * Helper methods
   */
  generateSessionId() {
    return `sb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  detectViewerType() {
    // Detect if user is likely a designer, developer, or medical reviewer
    const userAgent = navigator.userAgent.toLowerCase()
    const hostname = window.location.hostname
    
    if (hostname.includes('design') || hostname.includes('storybook')) {
      return 'designer'
    }
    
    if (userAgent.includes('dev') || hostname.includes('localhost')) {
      return 'developer'  
    }
    
    // Check for medical review context indicators
    const params = new URLSearchParams(window.location.search)
    if (params.get('medical-review') === 'true') {
      return 'medical_reviewer'
    }
    
    return 'unknown'
  }
  
  detectDeviceType() {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }
  
  extractHealthcareContext(storyName, storyArgs = {}) {
    const context = {
      medical_context: 'general',
      medical_scenario: 'standard',
      accessibility_story: false,
      emergency_story: false
    }
    
    const lowerStoryName = storyName.toLowerCase()
    
    // Medical context detection
    if (this.isMedicalStory(storyName)) {
      context.medical_context = 'medical'
    }
    
    // Emergency context detection
    if (lowerStoryName.includes('emergency')) {
      context.emergency_story = true
      context.medical_scenario = 'emergency'
    }
    
    // Accessibility context detection
    if (lowerStoryName.includes('accessibility') || 
        lowerStoryName.includes('a11y') ||
        lowerStoryName.includes('high contrast') ||
        lowerStoryName.includes('screen reader')) {
      context.accessibility_story = true
    }
    
    // Medical specialty detection
    const specialties = ['kardiologie', 'onkologie', 'nephrologie', 'gallenblase', 'schilddruese']
    const specialty = specialties.find(s => lowerStoryName.includes(s))
    if (specialty) {
      context.medical_specialty = specialty
    }
    
    return context
  }
  
  isMedicalStory(storyName) {
    const medicalIndicators = [
      'healthcare', 'medical', 'doctor', 'patient', 'emergency',
      'specialty', 'consultation', 'diagnosis', 'treatment'
    ]
    
    return medicalIndicators.some(indicator => 
      storyName.toLowerCase().includes(indicator)
    )
  }
  
  isMedicalComponent(componentName) {
    const medicalComponents = [
      'DoctorProfile', 'SpecialtySelector', 'MedicalFAQ', 'EmergencyBanner',
      'ConsentManager', 'ConsultationFlow'
    ]
    
    return medicalComponents.includes(componentName) ||
           componentName.toLowerCase().includes('healthcare') ||
           componentName.toLowerCase().includes('medical')
  }
  
  isTrustElement(tokenName, componentName) {
    const trustIndicators = ['credential', 'certificate', 'verified', 'trust']
    return trustIndicators.some(indicator => 
      tokenName.toLowerCase().includes(indicator) ||
      componentName.toLowerCase().includes(indicator)
    )
  }
  
  isEmergencyElement(componentName) {
    return componentName.toLowerCase().includes('emergency') ||
           componentName.toLowerCase().includes('urgent')
  }
  
  sanitizeStoryArgs(args) {
    // Remove any potentially sensitive data from story args before tracking
    const sanitized = {}
    
    Object.keys(args).forEach(key => {
      const value = args[key]
      
      // Skip sensitive medical data
      if (this.isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]'
        return
      }
      
      // Only include non-sensitive, analytics-relevant data
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value
      }
    })
    
    return sanitized
  }
  
  isSensitiveField(fieldName) {
    const sensitiveFields = [
      'medicalConcern', 'patientData', 'symptoms', 'diagnosis',
      'personalInfo', 'email', 'phone', 'address'
    ]
    
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field.toLowerCase())
    )
  }
  
  // Helper methods for getting current story (implementation depends on Storybook API)
  getCurrentStory() {
    // This would need to be implemented based on Storybook's available APIs
    return null
  }
  
  getStoryFromId(storyId) {
    // This would need to be implemented based on Storybook's available APIs  
    return null
  }
}

// Export singleton instance
export const storybookAnalytics = new StorybookAnalytics()

// Auto-initialize if in Storybook environment
if (typeof window !== 'undefined' && window.__STORYBOOK_ADDONS_CHANNEL__) {
  storybookAnalytics.init()
}

export default storybookAnalytics