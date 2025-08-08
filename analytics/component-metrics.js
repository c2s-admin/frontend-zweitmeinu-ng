/**
 * Healthcare Component Usage Metrics Tracking
 * GDPR-compliant analytics for 28+ healthcare design system components
 * 
 * Features:
 * - Real-time component usage tracking
 * - Medical context awareness (emergency vs. standard)
 * - User persona identification (patient, doctor, designer, developer)
 * - Accessibility feature adoption metrics
 * - Performance impact tracking
 * 
 * Privacy: No PII, medical data, or sensitive information tracked
 */

import { HealthcareEvents } from './healthcare-events.js'

/**
 * Healthcare Component Registry - All 28+ Storybook Components
 * Grouped by medical functionality and usage context
 */
export const HEALTHCARE_COMPONENTS = {
  // Core Healthcare UI Components (12)
  core: {
    'HealthcareButton': { category: 'interactive', medicalPriority: 'high', touchTarget: 56 },
    'HealthcareCard': { category: 'content', medicalPriority: 'medium', touchTarget: 44 },
    'HealthcareInput': { category: 'forms', medicalPriority: 'high', touchTarget: 56 },
    'HealthcareSelect': { category: 'forms', medicalPriority: 'medium', touchTarget: 56 },
    'HealthcareTextarea': { category: 'forms', medicalPriority: 'medium', touchTarget: 56 },
    'HealthcareAlert': { category: 'feedback', medicalPriority: 'high', touchTarget: 44 },
    'HealthcareModal': { category: 'overlay', medicalPriority: 'high', touchTarget: 56 },
    'HealthcareTooltip': { category: 'help', medicalPriority: 'low', touchTarget: 44 },
    'HealthcareBadge': { category: 'status', medicalPriority: 'medium', touchTarget: 32 },
    'HealthcareProgressBar': { category: 'feedback', medicalPriority: 'medium', touchTarget: 44 },
    'HealthcareList': { category: 'content', medicalPriority: 'medium', touchTarget: 44 },
    'HealthcareHeader': { category: 'navigation', medicalPriority: 'high', touchTarget: 56 }
  },

  // Medical-Specific Components (8)
  medical: {
    'DoctorProfile': { category: 'medical-content', medicalPriority: 'high', touchTarget: 64 },
    'SpecialtySelector': { category: 'medical-forms', medicalPriority: 'high', touchTarget: 56 },
    'EmergencyBanner': { category: 'emergency', medicalPriority: 'critical', touchTarget: 64 },
    'ConsultationFlow': { category: 'medical-process', medicalPriority: 'high', touchTarget: 56 },
    'HealthcareDatePicker': { category: 'medical-forms', medicalPriority: 'medium', touchTarget: 56 },
    'FileUpload': { category: 'medical-forms', medicalPriority: 'medium', touchTarget: 64 },
    'ConsentManager': { category: 'medical-legal', medicalPriority: 'critical', touchTarget: 56 },
    'MedicalFAQ': { category: 'medical-content', medicalPriority: 'medium', touchTarget: 44 }
  },

  // Accessibility Components (3)
  accessibility: {
    'AccessibilityDemo': { category: 'a11y-showcase', medicalPriority: 'high', touchTarget: 56 },
    'AccessibilityTest': { category: 'a11y-validation', medicalPriority: 'high', touchTarget: 56 },
    'HighContrastMode': { category: 'a11y-feature', medicalPriority: 'high', touchTarget: 64 }
  },

  // Content & Layout Components (5)
  content: {
    'CoreValues': { category: 'trust-content', medicalPriority: 'medium', touchTarget: 44 },
    'MotivationHero': { category: 'hero-content', medicalPriority: 'medium', touchTarget: 56 },
    'StorySection': { category: 'narrative-content', medicalPriority: 'low', touchTarget: 44 },
    'MedicalTestimonials': { category: 'trust-content', medicalPriority: 'high', touchTarget: 44 },
    'TrustIndicators': { category: 'trust-content', medicalPriority: 'high', touchTarget: 44 }
  }
}

/**
 * Medical Specialty Mapping for Healthcare Context
 * Based on 7 primary medical specialties of zweitmeinung.ng
 */
export const MEDICAL_SPECIALTIES = {
  'kardiologie': { color: 'red', urgency: 'high', components: ['DoctorProfile', 'SpecialtySelector'] },
  'onkologie': { color: 'purple', urgency: 'critical', components: ['DoctorProfile', 'ConsultationFlow'] },
  'gallenblase': { color: 'yellow', urgency: 'medium', components: ['SpecialtySelector', 'FileUpload'] },
  'nephrologie': { color: 'blue', urgency: 'high', components: ['DoctorProfile', 'HealthcareDatePicker'] },
  'schilddruese': { color: 'green', urgency: 'medium', components: ['SpecialtySelector', 'MedicalFAQ'] },
  'intensivmedizin': { color: 'orange', urgency: 'critical', components: ['EmergencyBanner', 'ConsultationFlow'] },
  'allgemeine-fragen': { color: 'healthcare-primary', urgency: 'low', components: ['MedicalFAQ', 'HealthcareCard'] }
}

/**
 * Healthcare Component Metrics Tracker
 */
export class ComponentMetrics {
  constructor() {
    this.usageData = new Map()
    this.performanceData = new Map()
    this.accessibilityData = new Map()
    this.medicalContextData = new Map()
    
    // Initialize metrics for all healthcare components
    this.initializeComponentMetrics()
  }

  /**
   * Initialize tracking for all healthcare components
   */
  initializeComponentMetrics() {
    const allComponents = {
      ...HEALTHCARE_COMPONENTS.core,
      ...HEALTHCARE_COMPONENTS.medical,
      ...HEALTHCARE_COMPONENTS.accessibility,
      ...HEALTHCARE_COMPONENTS.content
    }

    Object.keys(allComponents).forEach(componentName => {
      this.usageData.set(componentName, {
        views: 0,
        interactions: 0,
        emergencyViews: 0,
        accessibilityInteractions: 0,
        medicalContexts: new Map(),
        userPersonas: new Map(),
        lastUsed: null,
        avgSessionTime: 0,
        bounceRate: 0
      })

      this.performanceData.set(componentName, {
        avgLoadTime: 0,
        avgRenderTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
        errorCount: 0,
        performanceScore: 100
      })

      this.accessibilityData.set(componentName, {
        screenReaderUsage: 0,
        keyboardNavigation: 0,
        highContrastUsage: 0,
        voiceControlUsage: 0,
        a11yScore: 0,
        wcagViolations: 0
      })
    })
  }

  /**
   * Track component view with healthcare context
   */
  trackComponentView(componentName, context = {}) {
    const {
      healthcareContext = 'routine',
      userPersona = 'patient',
      medicalSpecialty = null,
      isEmergency = false,
      accessibilityFeatures = [],
      performanceMetrics = {}
    } = context

    // Privacy check - never track sensitive medical data
    const sanitizedContext = this.sanitizeHealthcareContext(context)

    // Update usage metrics
    const usage = this.usageData.get(componentName)
    if (usage) {
      usage.views += 1
      usage.lastUsed = new Date().toISOString()
      
      if (isEmergency) {
        usage.emergencyViews += 1
      }

      // Track medical contexts
      const medicalCount = usage.medicalContexts.get(healthcareContext) || 0
      usage.medicalContexts.set(healthcareContext, medicalCount + 1)

      // Track user personas
      const personaCount = usage.userPersonas.get(userPersona) || 0  
      usage.userPersonas.set(userPersona, personaCount + 1)

      // Track accessibility features
      accessibilityFeatures.forEach(feature => {
        const a11yData = this.accessibilityData.get(componentName)
        if (a11yData) {
          a11yData[feature] = (a11yData[feature] || 0) + 1
        }
      })
    }

    // Send healthcare analytics event
    HealthcareEvents.componentView(componentName, {
      healthcareContext,
      userPersona,
      medicalSpecialty,
      isEmergency,
      componentCategory: this.getComponentCategory(componentName),
      ...sanitizedContext
    })

    // Update performance metrics if provided
    if (performanceMetrics.loadTime) {
      this.updatePerformanceMetrics(componentName, performanceMetrics)
    }
  }

  /**
   * Track component interaction with medical context
   */
  trackComponentInteraction(componentName, interactionType, context = {}) {
    const usage = this.usageData.get(componentName)
    if (usage) {
      usage.interactions += 1

      if (context.accessibilityInteraction) {
        usage.accessibilityInteractions += 1
      }
    }

    // Healthcare-specific interaction tracking
    HealthcareEvents.componentInteraction(componentName, interactionType, {
      healthcareContext: context.healthcareContext || 'routine',
      medicalUrgency: context.isEmergency ? 'emergency' : 'routine',
      componentCategory: this.getComponentCategory(componentName),
      ...this.sanitizeHealthcareContext(context)
    })
  }

  /**
   * Update performance metrics for healthcare components
   */
  updatePerformanceMetrics(componentName, metrics) {
    const perfData = this.performanceData.get(componentName)
    if (perfData) {
      // Update running averages
      perfData.avgLoadTime = this.updateAverage(perfData.avgLoadTime, metrics.loadTime)
      perfData.avgRenderTime = this.updateAverage(perfData.avgRenderTime, metrics.renderTime)
      
      if (metrics.bundleSize) perfData.bundleSize = metrics.bundleSize
      if (metrics.memoryUsage) perfData.memoryUsage = metrics.memoryUsage
      if (metrics.errorCount) perfData.errorCount += metrics.errorCount

      // Calculate performance score for healthcare context
      perfData.performanceScore = this.calculateHealthcarePerformanceScore(perfData)
    }
  }

  /**
   * Calculate healthcare-specific performance score
   * Emergency components must have higher performance standards
   */
  calculateHealthcarePerformanceScore(perfData) {
    const componentCategory = this.getComponentCategory()
    const isEmergencyComponent = componentCategory === 'emergency'
    
    // Emergency components have stricter performance requirements
    const loadTimeThreshold = isEmergencyComponent ? 100 : 200 // ms
    const renderTimeThreshold = isEmergencyComponent ? 16 : 33 // ms (60fps vs 30fps)
    
    let score = 100
    
    // Penalize slow loading (critical for healthcare UX)
    if (perfData.avgLoadTime > loadTimeThreshold) {
      score -= Math.min(40, (perfData.avgLoadTime - loadTimeThreshold) / 10)
    }
    
    // Penalize slow rendering (affects user stress)
    if (perfData.avgRenderTime > renderTimeThreshold) {
      score -= Math.min(30, (perfData.avgRenderTime - renderTimeThreshold) / 2)
    }
    
    // Penalize errors (critical for medical platform trust)
    score -= Math.min(20, perfData.errorCount * 5)
    
    return Math.max(0, Math.round(score))
  }

  /**
   * Get comprehensive component adoption metrics
   */
  getComponentAdoptionMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      totalComponents: this.usageData.size,
      activeComponents: 0,
      emergencyComponents: 0,
      accessibilityAdoption: 0,
      medicalSpecialtyUsage: {},
      userPersonaBreakdown: {},
      performanceSummary: {},
      healthScores: {},
      topComponents: [],
      underusedComponents: [],
      emergencyPathComponents: [],
      accessibilityChampions: []
    }

    // Analyze each component
    this.usageData.forEach((usage, componentName) => {
      const isActive = usage.views > 0
      if (isActive) metrics.activeComponents += 1

      const hasEmergencyUsage = usage.emergencyViews > 0
      if (hasEmergencyUsage) metrics.emergencyComponents += 1

      const hasA11yUsage = usage.accessibilityInteractions > 0
      if (hasA11yUsage) metrics.accessibilityAdoption += 1

      // Medical specialty usage
      usage.medicalContexts.forEach((count, specialty) => {
        metrics.medicalSpecialtyUsage[specialty] = 
          (metrics.medicalSpecialtyUsage[specialty] || 0) + count
      })

      // User persona breakdown  
      usage.userPersonas.forEach((count, persona) => {
        metrics.userPersonaBreakdown[persona] = 
          (metrics.userPersonaBreakdown[persona] || 0) + count
      })

      // Component health score
      const healthScore = this.calculateComponentHealthScore(componentName)
      metrics.healthScores[componentName] = healthScore

      // Performance summary
      const perfData = this.performanceData.get(componentName)
      if (perfData) {
        metrics.performanceSummary[componentName] = {
          score: perfData.performanceScore,
          loadTime: perfData.avgLoadTime,
          errorCount: perfData.errorCount
        }
      }
    })

    // Generate insights
    metrics.topComponents = this.getTopComponents(5)
    metrics.underusedComponents = this.getUnderusedComponents(5) 
    metrics.emergencyPathComponents = this.getEmergencyPathComponents()
    metrics.accessibilityChampions = this.getAccessibilityChampions()

    return metrics
  }

  /**
   * Calculate overall component health score
   * Combines usage, performance, accessibility, and medical context scores
   */
  calculateComponentHealthScore(componentName) {
    const usage = this.usageData.get(componentName)
    const performance = this.performanceData.get(componentName)
    const accessibility = this.accessibilityData.get(componentName)
    
    if (!usage || !performance || !accessibility) return 0

    // Usage score (0-25 points)
    const maxViews = Math.max(...Array.from(this.usageData.values()).map(u => u.views))
    const usageScore = maxViews > 0 ? (usage.views / maxViews) * 25 : 0

    // Performance score (0-25 points)
    const performanceScore = (performance.performanceScore / 100) * 25

    // Accessibility score (0-25 points) 
    const totalA11yInteractions = accessibility.screenReaderUsage + 
      accessibility.keyboardNavigation + accessibility.highContrastUsage
    const a11yScore = Math.min(25, totalA11yInteractions * 2)

    // Medical context score (0-25 points)
    const emergencyUsageBonus = usage.emergencyViews > 0 ? 10 : 0
    const medicalSpecialtyCount = usage.medicalContexts.size
    const medicalContextScore = Math.min(15, medicalSpecialtyCount * 3) + emergencyUsageBonus

    const totalScore = usageScore + performanceScore + a11yScore + medicalContextScore
    return Math.round(totalScore)
  }

  /**
   * Get top performing healthcare components
   */
  getTopComponents(limit = 5) {
    const components = Array.from(this.usageData.entries())
      .map(([name, usage]) => ({
        name,
        views: usage.views,
        interactions: usage.interactions,
        healthScore: this.calculateComponentHealthScore(name),
        category: this.getComponentCategory(name)
      }))
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, limit)

    return components
  }

  /**
   * Get underused components that need attention
   */
  getUnderusedComponents(limit = 5) {
    const avgViews = Array.from(this.usageData.values())
      .reduce((sum, usage) => sum + usage.views, 0) / this.usageData.size

    const underused = Array.from(this.usageData.entries())
      .filter(([_, usage]) => usage.views < avgViews * 0.3)
      .map(([name, usage]) => ({
        name,
        views: usage.views,
        healthScore: this.calculateComponentHealthScore(name),
        category: this.getComponentCategory(name),
        potentialIssues: this.analyzeUnderuse(name, usage)
      }))
      .sort((a, b) => a.views - b.views)
      .slice(0, limit)

    return underused
  }

  /**
   * Get components used in emergency medical pathways
   */
  getEmergencyPathComponents() {
    return Array.from(this.usageData.entries())
      .filter(([_, usage]) => usage.emergencyViews > 0)
      .map(([name, usage]) => ({
        name,
        emergencyViews: usage.emergencyViews,
        totalViews: usage.views,
        emergencyPercentage: Math.round((usage.emergencyViews / usage.views) * 100),
        category: this.getComponentCategory(name)
      }))
      .sort((a, b) => b.emergencyViews - a.emergencyViews)
  }

  /**
   * Get components with highest accessibility adoption
   */
  getAccessibilityChampions() {
    return Array.from(this.accessibilityData.entries())
      .map(([name, a11yData]) => {
        const totalA11yUsage = a11yData.screenReaderUsage + 
          a11yData.keyboardNavigation + a11yData.highContrastUsage
        return {
          name,
          totalA11yUsage,
          screenReaderUsage: a11yData.screenReaderUsage,
          keyboardNavigation: a11yData.keyboardNavigation,  
          highContrastUsage: a11yData.highContrastUsage,
          category: this.getComponentCategory(name)
        }
      })
      .filter(comp => comp.totalA11yUsage > 0)
      .sort((a, b) => b.totalA11yUsage - a.totalA11yUsage)
  }

  // Helper methods
  getComponentCategory(componentName) {
    for (const [category, components] of Object.entries(HEALTHCARE_COMPONENTS)) {
      if (components[componentName]) {
        return components[componentName].category
      }
    }
    return 'unknown'
  }

  sanitizeHealthcareContext(context) {
    // Remove any potentially sensitive medical data
    const sensitiveFields = [
      'medicalConcern', 'patientData', 'symptoms', 'personalInfo',
      'medicalHistory', 'diagnosis', 'treatment', 'medication'
    ]

    const sanitized = { ...context }
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field] // Remove sensitive data
      }
    })

    return sanitized
  }

  updateAverage(currentAvg, newValue, count = 100) {
    return ((currentAvg * (count - 1)) + newValue) / count
  }

  analyzeUnderuse(componentName, usage) {
    const issues = []
    
    if (usage.views === 0) issues.push('never_viewed')
    if (usage.interactions < usage.views * 0.1) issues.push('low_interaction_rate') 
    if (usage.emergencyViews === 0 && this.getComponentCategory(componentName).includes('emergency')) {
      issues.push('emergency_component_unused')
    }
    if (usage.accessibilityInteractions === 0) issues.push('no_accessibility_usage')

    return issues
  }
}

// Global instance for healthcare component metrics
export const healthcareComponentMetrics = new ComponentMetrics()

/**
 * Convenience methods for easy integration
 */
export const ComponentUsageTracker = {
  // Track component view with healthcare context
  trackView: (componentName, context) => {
    healthcareComponentMetrics.trackComponentView(componentName, context)
  },

  // Track component interaction with medical context  
  trackInteraction: (componentName, interactionType, context) => {
    healthcareComponentMetrics.trackComponentInteraction(componentName, interactionType, context)
  },

  // Get current metrics snapshot
  getMetrics: () => {
    return healthcareComponentMetrics.getComponentAdoptionMetrics()
  },

  // Get component health score
  getComponentHealth: (componentName) => {
    return healthcareComponentMetrics.calculateComponentHealthScore(componentName)
  },

  // Get medical specialty usage breakdown
  getMedicalSpecialtyUsage: () => {
    const metrics = healthcareComponentMetrics.getComponentAdoptionMetrics()
    return metrics.medicalSpecialtyUsage
  },

  // Get emergency pathway usage
  getEmergencyUsage: () => {
    return healthcareComponentMetrics.getEmergencyPathComponents()
  }
}