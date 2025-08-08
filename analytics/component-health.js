/**
 * Healthcare Component Health Score System
 * Advanced health monitoring for healthcare design system components
 * 
 * Features:
 * - Multi-dimensional health scoring (Usage, Performance, Accessibility, Medical Context)
 * - Component health alerts and warnings
 * - Medical-specific health criteria (Emergency response, Trust indicators)
 * - Component ecosystem health (Dependencies, Integration issues)
 * - Automated health checks and recommendations
 * 
 * Privacy: GDPR-compliant, healthcare-safe metrics only
 */

import { ComponentUsageTracker, HEALTHCARE_COMPONENTS } from './component-metrics.js'
import { AdoptionTracking } from './adoption-tracking.js'
import { HealthcareEvents } from './healthcare-events.js'

/**
 * Healthcare Component Health Dimensions
 * Each dimension scored 0-100, weighted by medical importance
 */
export const HEALTH_DIMENSIONS = {
  usage: {
    weight: 25,
    description: 'Component adoption and usage frequency',
    medicalImportance: 'high',
    criteria: ['view_count', 'interaction_rate', 'user_diversity', 'retention']
  },
  performance: {
    weight: 30, // Higher weight for healthcare (patient stress)
    description: 'Loading speed, rendering performance, bundle impact',
    medicalImportance: 'critical',
    criteria: ['load_time', 'render_time', 'bundle_size', 'error_rate']
  },
  accessibility: {
    weight: 25, // Equal importance for healthcare compliance
    description: 'WCAG 2.1 AA compliance and accessibility feature usage',
    medicalImportance: 'critical',
    criteria: ['contrast_ratio', 'keyboard_nav', 'screen_reader', 'touch_targets']
  },
  medicalContext: {
    weight: 20, // Healthcare-specific dimension
    description: 'Medical appropriateness and emergency context handling',
    medicalImportance: 'critical',
    criteria: ['emergency_readiness', 'trust_indicators', 'medical_accuracy', 'context_awareness']
  }
}

/**
 * Component Health Alert Levels
 */
export const HEALTH_ALERTS = {
  critical: { threshold: 0, color: '#dc2626', action: 'immediate' },    // 0-30: Critical issues
  warning: { threshold: 31, color: '#f59e0b', action: 'priority' },     // 31-60: Needs attention  
  healthy: { threshold: 61, color: '#10b981', action: 'monitor' },      // 61-80: Good health
  excellent: { threshold: 81, color: '#059669', action: 'maintain' }    // 81-100: Excellent
}

/**
 * Medical-Specific Health Criteria
 */
export const MEDICAL_HEALTH_CRITERIA = {
  emergency: {
    maxLoadTime: 100,     // Emergency components must load <100ms
    minTouchTarget: 64,   // Emergency buttons need 64px+ targets
    requiredContrast: 7,  // Higher contrast for stress situations
    maxErrors: 0         // Zero tolerance for errors in emergency
  },
  routine: {
    maxLoadTime: 200,     // Standard healthcare components <200ms
    minTouchTarget: 56,   // Standard 56px touch targets
    requiredContrast: 4.5, // WCAG AA standard
    maxErrors: 1         // Minimal error tolerance
  },
  trust: {
    requiredElements: ['medical_credentials', 'privacy_notice', 'security_indicators'],
    minTrustScore: 80    // Trust components need high scores
  }
}

/**
 * Healthcare Component Health Monitor
 */
export class ComponentHealthMonitor {
  constructor() {
    this.healthScores = new Map()
    this.healthHistory = new Map()
    this.alerts = new Map()
    this.recommendations = new Map()
    
    this.initializeHealthMonitoring()
  }

  /**
   * Initialize health monitoring for all healthcare components
   */
  initializeHealthMonitoring() {
    const allComponents = {
      ...HEALTHCARE_COMPONENTS.core,
      ...HEALTHCARE_COMPONENTS.medical,
      ...HEALTHCARE_COMPONENTS.accessibility,
      ...HEALTHCARE_COMPONENTS.content
    }

    Object.keys(allComponents).forEach(componentName => {
      // Initialize health scores
      this.healthScores.set(componentName, {
        overall: 0,
        usage: 0,
        performance: 0,
        accessibility: 0,
        medicalContext: 0,
        lastUpdated: new Date().toISOString(),
        trend: 'stable'
      })

      // Initialize health history (daily snapshots)
      this.healthHistory.set(componentName, {
        daily: new Map(),
        weekly: new Map(),
        alerts: [],
        improvements: [],
        regressions: []
      })

      // Initialize alerts
      this.alerts.set(componentName, [])

      // Initialize recommendations
      this.recommendations.set(componentName, [])
    })
  }

  /**
   * Calculate comprehensive health score for component
   */
  calculateHealthScore(componentName, forceRecalculate = false) {
    const currentScore = this.healthScores.get(componentName)
    
    // Skip if recently calculated (unless forced)
    if (!forceRecalculate && currentScore) {
      const lastUpdate = new Date(currentScore.lastUpdated)
      const hoursSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60)
      if (hoursSinceUpdate < 1) {
        return currentScore
      }
    }

    const scores = {
      usage: this.calculateUsageScore(componentName),
      performance: this.calculatePerformanceScore(componentName),
      accessibility: this.calculateAccessibilityScore(componentName),
      medicalContext: this.calculateMedicalContextScore(componentName)
    }

    // Calculate weighted overall score
    const overall = (
      scores.usage * (HEALTH_DIMENSIONS.usage.weight / 100) +
      scores.performance * (HEALTH_DIMENSIONS.performance.weight / 100) +
      scores.accessibility * (HEALTH_DIMENSIONS.accessibility.weight / 100) +
      scores.medicalContext * (HEALTH_DIMENSIONS.medicalContext.weight / 100)
    )

    // Determine trend
    const previousScore = this.getPreviousHealthScore(componentName)
    const trend = this.calculateHealthTrend(overall, previousScore)

    const healthScore = {
      overall: Math.round(overall),
      ...scores,
      lastUpdated: new Date().toISOString(),
      trend
    }

    // Store updated score
    this.healthScores.set(componentName, healthScore)

    // Record in history
    this.recordHealthHistory(componentName, healthScore)

    // Update alerts and recommendations
    this.updateHealthAlerts(componentName, healthScore)
    this.updateRecommendations(componentName, healthScore)

    // Send health event
    HealthcareEvents.componentHealth(componentName, {
      healthScore: healthScore.overall,
      usageScore: scores.usage,
      performanceScore: scores.performance,
      accessibilityScore: scores.accessibility,
      medicalContextScore: scores.medicalContext,
      trend,
      alertLevel: this.getHealthAlertLevel(healthScore.overall)
    })

    return healthScore
  }

  /**
   * Calculate usage dimension score (0-100)
   */
  calculateUsageScore(componentName) {
    const usage = ComponentUsageTracker.getMetrics()
    const component = this.findComponentInMetrics(usage, componentName)
    
    if (!component) return 0

    let score = 0

    // View count score (0-30 points)
    const maxViews = Math.max(...Object.values(usage.healthScores))
    if (maxViews > 0) {
      score += Math.min(30, (component.views / maxViews) * 30)
    }

    // Interaction rate score (0-25 points)
    const interactionRate = component.views > 0 ? component.interactions / component.views : 0
    score += Math.min(25, interactionRate * 100) // Assuming 25% interaction rate = full points

    // User diversity score (0-25 points)
    const adoptionData = AdoptionTracking.getUserTypeBreakdown(componentName)
    if (adoptionData) {
      const activeUserTypes = Object.values(adoptionData).filter(user => user.views > 0).length
      score += (activeUserTypes / 5) * 25 // 5 user types max
    }

    // Retention score (0-20 points)
    const lifecycle = AdoptionTracking.getLifecycleStage(componentName)
    const lifecycleScore = {
      'new': 10, 'emerging': 15, 'growing': 20, 'mature': 20, 'declining': 5
    }
    score += lifecycleScore[lifecycle] || 0

    return Math.min(100, Math.round(score))
  }

  /**
   * Calculate performance dimension score (0-100)
   */
  calculatePerformanceScore(componentName) {
    const componentInfo = this.getComponentInfo(componentName)
    const medicalCategory = componentInfo?.medicalPriority || 'medium'
    const criteria = medicalCategory === 'critical' ? MEDICAL_HEALTH_CRITERIA.emergency : MEDICAL_HEALTH_CRITERIA.routine

    let score = 100 // Start at perfect, deduct for issues

    // Mock performance data (in real app, get from performance monitoring)
    const performanceData = this.getMockPerformanceData(componentName)

    // Load time score (30% of performance)
    if (performanceData.loadTime > criteria.maxLoadTime) {
      const penalty = Math.min(30, (performanceData.loadTime - criteria.maxLoadTime) / 10)
      score -= penalty
    }

    // Render time score (25% of performance)  
    const maxRenderTime = medicalCategory === 'critical' ? 16 : 33 // 60fps vs 30fps
    if (performanceData.renderTime > maxRenderTime) {
      const penalty = Math.min(25, (performanceData.renderTime - maxRenderTime) / 2)
      score -= penalty
    }

    // Bundle size score (20% of performance)
    const maxBundleSize = 50 // KB, conservative for healthcare mobile users
    if (performanceData.bundleSize > maxBundleSize) {
      const penalty = Math.min(20, (performanceData.bundleSize - maxBundleSize) / 5)
      score -= penalty
    }

    // Error rate score (25% of performance)
    const errorPenalty = Math.min(25, performanceData.errorCount * 5)
    score -= errorPenalty

    return Math.max(0, Math.round(score))
  }

  /**
   * Calculate accessibility dimension score (0-100)
   */
  calculateAccessibilityScore(componentName) {
    let score = 0

    // Contrast ratio (30 points)
    const contrastRatio = this.getMockContrastRatio(componentName)
    if (contrastRatio >= 7) score += 30      // AAA level
    else if (contrastRatio >= 4.5) score += 25  // AA level
    else if (contrastRatio >= 3) score += 15    // Basic level
    // else 0 points

    // Touch target size (25 points)
    const componentInfo = this.getComponentInfo(componentName)
    const touchTarget = componentInfo?.touchTarget || 44
    const requiredTarget = componentInfo?.medicalPriority === 'critical' ? 64 : 56
    
    if (touchTarget >= requiredTarget) score += 25
    else if (touchTarget >= 44) score += 15  // WCAG minimum
    else score += 5

    // Keyboard navigation (20 points)
    const a11yData = AdoptionTracking.getAccessibilityAdoption(componentName)
    if (a11yData && a11yData.keyboardNavigation?.sessions > 0) {
      score += Math.min(20, a11yData.keyboardNavigation.sessions * 2)
    }

    // Screen reader usage (15 points)
    if (a11yData && a11yData.screenReader?.sessions > 0) {
      score += Math.min(15, a11yData.screenReader.sessions * 3)
    }

    // High contrast support (10 points)
    if (a11yData && a11yData.highContrast?.sessions > 0) {
      score += Math.min(10, a11yData.highContrast.sessions)
    }

    return Math.min(100, Math.round(score))
  }

  /**
   * Calculate medical context dimension score (0-100)
   */
  calculateMedicalContextScore(componentName) {
    let score = 0

    // Emergency readiness (40 points)
    const medicalUsage = AdoptionTracking.getMedicalContextUsage(componentName)
    if (medicalUsage) {
      const hasEmergencyUsage = medicalUsage.emergency > 0
      const componentCategory = this.getComponentCategory(componentName)
      
      if (componentCategory === 'emergency') {
        // Emergency components must be used in emergency contexts
        score += hasEmergencyUsage ? 40 : 0
      } else {
        // Non-emergency components get partial credit
        score += hasEmergencyUsage ? 30 : 20
      }
    } else {
      score += 20 // Default for components without medical usage data
    }

    // Trust indicators (30 points)
    const trustScore = this.calculateTrustScore(componentName)
    score += Math.round(trustScore * 0.3)

    // Medical accuracy (20 points)
    const accuracyScore = this.calculateMedicalAccuracyScore(componentName)
    score += accuracyScore

    // Context awareness (10 points)
    const contextScore = this.calculateContextAwarenessScore(componentName)
    score += contextScore

    return Math.min(100, Math.round(score))
  }

  /**
   * Get comprehensive health dashboard data
   */
  getHealthDashboard() {
    const dashboard = {
      timestamp: new Date().toISOString(),
      overview: {
        totalComponents: this.healthScores.size,
        averageHealth: 0,
        criticalComponents: 0,
        warningComponents: 0,
        healthyComponents: 0,
        excellentComponents: 0
      },
      componentScores: {},
      alerts: {},
      recommendations: {},
      trends: {},
      medicalContextHealth: {},
      emergencyComponentHealth: {},
      accessibilityHealth: {},
      performanceHealth: {}
    }

    let totalHealth = 0

    // Calculate scores for all components
    this.healthScores.forEach((score, componentName) => {
      const currentScore = this.calculateHealthScore(componentName)
      dashboard.componentScores[componentName] = currentScore

      totalHealth += currentScore.overall
      
      // Update overview counters
      const alertLevel = this.getHealthAlertLevel(currentScore.overall)
      dashboard.overview[`${alertLevel}Components`]++

      // Store alerts and recommendations
      dashboard.alerts[componentName] = this.alerts.get(componentName) || []
      dashboard.recommendations[componentName] = this.recommendations.get(componentName) || []

      // Analyze specific health aspects
      dashboard.medicalContextHealth[componentName] = currentScore.medicalContext
      dashboard.accessibilityHealth[componentName] = currentScore.accessibility
      dashboard.performanceHealth[componentName] = currentScore.performance

      // Emergency component special tracking
      const componentCategory = this.getComponentCategory(componentName)
      if (componentCategory === 'emergency') {
        dashboard.emergencyComponentHealth[componentName] = currentScore
      }
    })

    dashboard.overview.averageHealth = Math.round(totalHealth / this.healthScores.size)

    return dashboard
  }

  /**
   * Update health alerts for component
   */
  updateHealthAlerts(componentName, healthScore) {
    const alerts = []
    const overall = healthScore.overall

    // Overall health alerts
    if (overall <= 30) {
      alerts.push({
        type: 'critical',
        message: `Component health critically low (${overall}/100)`,
        priority: 'immediate',
        impact: 'High risk of user experience issues'
      })
    } else if (overall <= 60) {
      alerts.push({
        type: 'warning', 
        message: `Component health needs attention (${overall}/100)`,
        priority: 'high',
        impact: 'Moderate risk of adoption issues'
      })
    }

    // Dimension-specific alerts
    if (healthScore.performance <= 40) {
      alerts.push({
        type: 'performance',
        message: 'Poor performance may impact patient experience',
        priority: 'high',
        impact: 'Slow loading affects stressed healthcare users'
      })
    }

    if (healthScore.accessibility <= 50) {
      alerts.push({
        type: 'accessibility',
        message: 'WCAG 2.1 AA compliance at risk',
        priority: 'critical',
        impact: 'Legal compliance and user exclusion risk'
      })
    }

    if (healthScore.medicalContext <= 40) {
      alerts.push({
        type: 'medical',
        message: 'Medical context appropriateness concerns',
        priority: 'high',
        impact: 'May not meet healthcare platform standards'
      })
    }

    // Emergency component special alerts
    const componentCategory = this.getComponentCategory(componentName)
    if (componentCategory === 'emergency' && overall <= 80) {
      alerts.push({
        type: 'emergency',
        message: 'Emergency component below required health threshold',
        priority: 'critical',
        impact: 'Patient safety risk in emergency situations'
      })
    }

    this.alerts.set(componentName, alerts)
  }

  /**
   * Update recommendations for component improvement
   */
  updateRecommendations(componentName, healthScore) {
    const recommendations = []

    // Usage improvement recommendations
    if (healthScore.usage <= 50) {
      recommendations.push({
        category: 'usage',
        title: 'Improve Component Adoption',
        actions: [
          'Add usage examples in Storybook',
          'Create documentation with medical use cases',
          'Add component to popular page templates'
        ],
        expectedImpact: 'Increase adoption and usage diversity'
      })
    }

    // Performance improvement recommendations
    if (healthScore.performance <= 60) {
      recommendations.push({
        category: 'performance',
        title: 'Optimize Component Performance',
        actions: [
          'Optimize bundle size with code splitting',
          'Implement lazy loading for non-critical parts',
          'Review and optimize rendering logic'
        ],
        expectedImpact: 'Better user experience, especially for stressed patients'
      })
    }

    // Accessibility improvement recommendations  
    if (healthScore.accessibility <= 70) {
      recommendations.push({
        category: 'accessibility',
        title: 'Enhance Accessibility Compliance',
        actions: [
          'Increase color contrast to AAA standards',
          'Ensure 56px+ touch targets for healthcare use',
          'Add comprehensive ARIA labels and descriptions',
          'Test with actual assistive technologies'
        ],
        expectedImpact: 'WCAG 2.1 AA compliance and inclusive healthcare access'
      })
    }

    // Medical context recommendations
    if (healthScore.medicalContext <= 60) {
      recommendations.push({
        category: 'medical',
        title: 'Improve Medical Context Appropriateness',
        actions: [
          'Add emergency state handling',
          'Include trust indicators and medical credentials',
          'Review content for medical accuracy',
          'Test in realistic healthcare scenarios'
        ],
        expectedImpact: 'Better healthcare user experience and trust'
      })
    }

    this.recommendations.set(componentName, recommendations)
  }

  // Helper methods
  getHealthAlertLevel(score) {
    if (score >= 81) return 'excellent'
    if (score >= 61) return 'healthy'
    if (score >= 31) return 'warning'
    return 'critical'
  }

  getComponentInfo(componentName) {
    for (const [category, components] of Object.entries(HEALTHCARE_COMPONENTS)) {
      if (components[componentName]) {
        return components[componentName]
      }
    }
    return null
  }

  getComponentCategory(componentName) {
    const info = this.getComponentInfo(componentName)
    return info?.category || 'unknown'
  }

  findComponentInMetrics(metrics, componentName) {
    // Mock component data (in real app, extract from actual metrics)
    return {
      views: Math.floor(Math.random() * 1000),
      interactions: Math.floor(Math.random() * 500)
    }
  }

  getMockPerformanceData(componentName) {
    // Mock performance data (in real app, get from actual monitoring)
    const componentInfo = this.getComponentInfo(componentName)
    const isEmergency = componentInfo?.medicalPriority === 'critical'
    
    return {
      loadTime: isEmergency ? 80 + Math.random() * 40 : 150 + Math.random() * 100,
      renderTime: isEmergency ? 12 + Math.random() * 8 : 20 + Math.random() * 20,
      bundleSize: 20 + Math.random() * 60,
      errorCount: Math.floor(Math.random() * 3)
    }
  }

  getMockContrastRatio(componentName) {
    // Mock contrast data (in real app, calculate from actual colors)
    const componentInfo = this.getComponentInfo(componentName)
    const isAccessibility = componentInfo?.category?.includes('a11y')
    return isAccessibility ? 4.5 + Math.random() * 3 : 3 + Math.random() * 2
  }

  calculateTrustScore(componentName) {
    // Mock trust calculation (in real app, analyze trust elements)
    const componentCategory = this.getComponentCategory(componentName)
    if (componentCategory.includes('trust') || componentCategory.includes('medical')) {
      return 70 + Math.random() * 30
    }
    return 50 + Math.random() * 30
  }

  calculateMedicalAccuracyScore(componentName) {
    // Mock accuracy score (in real app, get from medical review)
    return Math.floor(15 + Math.random() * 5) // 15-20 points
  }

  calculateContextAwarenessScore(componentName) {
    // Mock context awareness (in real app, analyze context handling)
    return Math.floor(5 + Math.random() * 5) // 5-10 points
  }

  getPreviousHealthScore(componentName) {
    const history = this.healthHistory.get(componentName)
    if (history && history.daily.size > 0) {
      const dates = Array.from(history.daily.keys()).sort()
      const previousDate = dates[dates.length - 2] // Second-to-last entry
      return history.daily.get(previousDate)?.overall || 0
    }
    return 0
  }

  calculateHealthTrend(currentScore, previousScore) {
    if (previousScore === 0) return 'new'
    
    const change = currentScore - previousScore
    if (Math.abs(change) < 5) return 'stable'
    if (change > 10) return 'improving-fast'
    if (change > 0) return 'improving'
    if (change < -10) return 'declining-fast'
    return 'declining'
  }

  recordHealthHistory(componentName, healthScore) {
    const history = this.healthHistory.get(componentName)
    if (history) {
      const today = new Date().toISOString().split('T')[0]
      history.daily.set(today, healthScore)

      // Keep only last 30 days of daily data
      const dates = Array.from(history.daily.keys()).sort()
      if (dates.length > 30) {
        const oldDate = dates[0]
        history.daily.delete(oldDate)
      }
    }
  }
}

// Global instance for healthcare component health monitoring
export const healthcareHealthMonitor = new ComponentHealthMonitor()

/**
 * Convenience methods for easy integration
 */
export const ComponentHealth = {
  // Calculate health score for component
  calculateHealth: (componentName) => {
    return healthcareHealthMonitor.calculateHealthScore(componentName)
  },

  // Get overall health dashboard
  getDashboard: () => {
    return healthcareHealthMonitor.getHealthDashboard()
  },

  // Get alerts for component
  getAlerts: (componentName) => {
    return healthcareHealthMonitor.alerts.get(componentName) || []
  },

  // Get recommendations for component
  getRecommendations: (componentName) => {
    return healthcareHealthMonitor.recommendations.get(componentName) || []
  },

  // Get health trend for component
  getHealthTrend: (componentName) => {
    const score = healthcareHealthMonitor.healthScores.get(componentName)
    return score?.trend || 'unknown'
  },

  // Force recalculation of all health scores
  recalculateAll: () => {
    const allComponents = Object.keys({
      ...HEALTHCARE_COMPONENTS.core,
      ...HEALTHCARE_COMPONENTS.medical,
      ...HEALTHCARE_COMPONENTS.accessibility,
      ...HEALTHCARE_COMPONENTS.content
    })

    allComponents.forEach(componentName => {
      healthcareHealthMonitor.calculateHealthScore(componentName, true)
    })

    return healthcareHealthMonitor.getHealthDashboard()
  }
}