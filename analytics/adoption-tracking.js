/**
 * Healthcare Component Adoption Trend Analysis
 * Advanced analytics for tracking design system component adoption patterns
 * 
 * Features:
 * - Time-series adoption trend analysis
 * - User type adoption patterns (Designers, Developers, Medical Reviewers)
 * - Medical context adoption (Emergency vs. Standard Healthcare)
 * - Accessibility feature adoption tracking
 * - Component lifecycle analysis (New, Growing, Mature, Declining)
 * 
 * Privacy: GDPR-compliant, no medical data or PII tracked
 */

import { ComponentUsageTracker, HEALTHCARE_COMPONENTS, MEDICAL_SPECIALTIES } from './component-metrics.js'
import { HealthcareEvents } from './healthcare-events.js'

/**
 * User Types for Healthcare Design System
 */
export const USER_TYPES = {
  'designer': {
    primaryContext: 'storybook',
    tools: ['figma', 'storybook', 'design-tokens'],
    medicalKnowledge: 'basic',
    priority: ['visual-design', 'accessibility', 'medical-appropriateness']
  },
  'developer': {
    primaryContext: 'implementation', 
    tools: ['vscode', 'storybook', 'github'],
    medicalKnowledge: 'basic',
    priority: ['performance', 'accessibility', 'maintainability']
  },
  'medical_reviewer': {
    primaryContext: 'content-review',
    tools: ['browser', 'storybook'],
    medicalKnowledge: 'expert',
    priority: ['medical-accuracy', 'patient-safety', 'trust']
  },
  'patient': {
    primaryContext: 'end-user',
    tools: ['mobile-browser', 'tablet'],
    medicalKnowledge: 'variable',
    priority: ['usability', 'accessibility', 'trust']
  },
  'healthcare_professional': {
    primaryContext: 'clinical-use',
    tools: ['mobile-browser', 'desktop'],
    medicalKnowledge: 'expert', 
    priority: ['efficiency', 'accuracy', 'mobile-optimization']
  }
}

/**
 * Component Adoption Lifecycle Stages
 */
export const ADOPTION_STAGES = {
  'new': { minAge: 0, maxAge: 7, minViews: 0, maxViews: 50 },       // First week, low usage
  'emerging': { minAge: 7, maxAge: 30, minViews: 50, maxViews: 200 },  // Growing usage
  'growing': { minAge: 30, maxAge: 90, minViews: 200, maxViews: 1000 }, // Steady growth
  'mature': { minAge: 90, maxAge: null, minViews: 1000, maxViews: null }, // Established
  'declining': { trend: 'negative', duration: 30 }  // Usage dropping over 30 days
}

/**
 * Healthcare Component Adoption Tracking System
 */
export class AdoptionTracker {
  constructor() {
    this.adoptionHistory = new Map()
    this.trendData = new Map()
    this.userTypeData = new Map()
    this.medicalContextData = new Map()
    this.accessibilityAdoption = new Map()
    
    this.initializeTracking()
  }

  /**
   * Initialize adoption tracking for all healthcare components
   */
  initializeTracking() {
    const allComponents = {
      ...HEALTHCARE_COMPONENTS.core,
      ...HEALTHCARE_COMPONENTS.medical,
      ...HEALTHCARE_COMPONENTS.accessibility,
      ...HEALTHCARE_COMPONENTS.content
    }

    Object.keys(allComponents).forEach(componentName => {
      // Historical adoption data (7-day buckets for trend analysis)
      this.adoptionHistory.set(componentName, {
        daily: new Map(),
        weekly: new Map(), 
        monthly: new Map(),
        firstUsed: null,
        ageInDays: 0,
        lifecycle: 'new'
      })

      // Trend analysis data
      this.trendData.set(componentName, {
        last7Days: [],
        last30Days: [],
        growthRate: 0,
        trendDirection: 'stable',
        velocity: 0,
        momentum: 0
      })

      // User type adoption patterns
      this.userTypeData.set(componentName, {
        designers: { views: 0, interactions: 0, lastActive: null },
        developers: { views: 0, interactions: 0, lastActive: null },
        medical_reviewers: { views: 0, interactions: 0, lastActive: null },
        patients: { views: 0, interactions: 0, lastActive: null },
        healthcare_professionals: { views: 0, interactions: 0, lastActive: null }
      })

      // Medical context adoption
      this.medicalContextData.set(componentName, {
        emergency: 0,
        routine: 0,
        consultation: 0,
        preventive: 0,
        specialtyBreakdown: new Map()
      })

      // Accessibility feature adoption
      this.accessibilityAdoption.set(componentName, {
        screenReader: { users: 0, sessions: 0 },
        keyboardNavigation: { users: 0, sessions: 0 },
        highContrast: { users: 0, sessions: 0 },
        voiceControl: { users: 0, sessions: 0 },
        reducedMotion: { users: 0, sessions: 0 }
      })
    })
  }

  /**
   * Record component adoption event with healthcare context
   */
  recordAdoption(componentName, adoptionData = {}) {
    const {
      userType = 'patient',
      medicalContext = 'routine',
      medicalSpecialty = null,
      accessibilityFeatures = [],
      emergencyContext = false,
      sessionId = null
    } = adoptionData

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const thisWeek = this.getWeekKey(new Date())
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

    // Update historical data
    const history = this.adoptionHistory.get(componentName)
    if (history) {
      // Daily tracking
      history.daily.set(today, (history.daily.get(today) || 0) + 1)

      // Weekly tracking
      history.weekly.set(thisWeek, (history.weekly.get(thisWeek) || 0) + 1)

      // Monthly tracking  
      history.monthly.set(thisMonth, (history.monthly.get(thisMonth) || 0) + 1)

      // First usage tracking
      if (!history.firstUsed) {
        history.firstUsed = new Date().toISOString()
      }

      // Calculate age in days
      history.ageInDays = Math.floor(
        (new Date() - new Date(history.firstUsed)) / (1000 * 60 * 60 * 24)
      )

      // Update lifecycle stage
      history.lifecycle = this.determineLifecycleStage(componentName)
    }

    // Update user type data
    const userTypes = this.userTypeData.get(componentName)
    if (userTypes && userTypes[userType]) {
      userTypes[userType].views += 1
      userTypes[userType].lastActive = new Date().toISOString()
    }

    // Update medical context data
    const medicalData = this.medicalContextData.get(componentName)
    if (medicalData) {
      medicalData[medicalContext] += 1

      if (medicalSpecialty) {
        const currentCount = medicalData.specialtyBreakdown.get(medicalSpecialty) || 0
        medicalData.specialtyBreakdown.set(medicalSpecialty, currentCount + 1)
      }
    }

    // Update accessibility adoption
    if (accessibilityFeatures.length > 0) {
      const a11yData = this.accessibilityAdoption.get(componentName)
      if (a11yData) {
        accessibilityFeatures.forEach(feature => {
          if (a11yData[feature]) {
            a11yData[feature].sessions += 1
            // Track unique users (simplified with sessionId)
            if (sessionId) {
              a11yData[feature].users += 1
            }
          }
        })
      }
    }

    // Update trend data
    this.updateTrendAnalysis(componentName)

    // Send healthcare analytics event
    HealthcareEvents.componentAdoption(componentName, {
      userType,
      medicalContext,
      medicalSpecialty,
      emergencyContext,
      lifecycleStage: history?.lifecycle,
      adoptionDay: this.calculateAdoptionDay(componentName),
      ...this.sanitizeAdoptionData(adoptionData)
    })
  }

  /**
   * Record component interaction with adoption context
   */
  recordInteraction(componentName, interactionType, context = {}) {
    // Update user type interaction data
    const userType = context.userType || 'patient'
    const userTypes = this.userTypeData.get(componentName)
    if (userTypes && userTypes[userType]) {
      userTypes[userType].interactions += 1
    }

    // Track interaction adoption event
    HealthcareEvents.componentInteraction(componentName, interactionType, {
      adoptionContext: true,
      userType,
      medicalContext: context.medicalContext || 'routine',
      ...this.sanitizeAdoptionData(context)
    })
  }

  /**
   * Update trend analysis for component
   */
  updateTrendAnalysis(componentName) {
    const history = this.adoptionHistory.get(componentName)
    const trends = this.trendData.get(componentName)
    
    if (!history || !trends) return

    // Get last 7 days of data
    const last7Days = this.getLast7DaysData(history.daily)
    trends.last7Days = last7Days

    // Get last 30 days of data
    const last30Days = this.getLast30DaysData(history.daily)
    trends.last30Days = last30Days

    // Calculate growth rate (week over week)
    const currentWeekTotal = last7Days.slice(-7).reduce((sum, day) => sum + day.count, 0)
    const previousWeekTotal = last7Days.slice(-14, -7).reduce((sum, day) => sum + day.count, 0)
    
    trends.growthRate = previousWeekTotal > 0 
      ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
      : 0

    // Determine trend direction
    trends.trendDirection = this.calculateTrendDirection(trends.growthRate, last7Days)

    // Calculate velocity (adoption speed)
    trends.velocity = this.calculateAdoptionVelocity(last30Days)

    // Calculate momentum (accelerating/decelerating adoption)
    trends.momentum = this.calculateAdoptionMomentum(last30Days)
  }

  /**
   * Get comprehensive adoption analytics
   */
  getAdoptionAnalytics() {
    const analytics = {
      timestamp: new Date().toISOString(),
      overview: {
        totalComponents: this.adoptionHistory.size,
        activeComponents: 0,
        emergingComponents: 0,
        matureComponents: 0,
        decliningComponents: 0
      },
      adoptionTrends: {},
      userTypeAnalysis: {},
      medicalContextAnalysis: {},
      accessibilityAdoption: {},
      lifecycleDistribution: {},
      topGrowingComponents: [],
      emergencyAdoptionLeaders: [],
      accessibilityChampions: [],
      underAdoptedComponents: [],
      recommendations: []
    }

    // Analyze each component
    this.adoptionHistory.forEach((history, componentName) => {
      const trends = this.trendData.get(componentName)
      const userTypes = this.userTypeData.get(componentName)
      const medicalData = this.medicalContextData.get(componentName)
      const a11yData = this.accessibilityAdoption.get(componentName)

      // Update overview counters
      if (history.lifecycle === 'emerging') analytics.overview.emergingComponents++
      else if (history.lifecycle === 'mature') analytics.overview.matureComponents++
      else if (history.lifecycle === 'declining') analytics.overview.decliningComponents++

      if (this.getTotalViews(history) > 0) analytics.overview.activeComponents++

      // Store component-specific data
      analytics.adoptionTrends[componentName] = {
        lifecycle: history.lifecycle,
        ageInDays: history.ageInDays,
        growthRate: trends?.growthRate || 0,
        trendDirection: trends?.trendDirection || 'stable',
        velocity: trends?.velocity || 0,
        totalViews: this.getTotalViews(history)
      }

      analytics.userTypeAnalysis[componentName] = userTypes
      analytics.medicalContextAnalysis[componentName] = medicalData
      analytics.accessibilityAdoption[componentName] = a11yData

      // Lifecycle distribution
      analytics.lifecycleDistribution[history.lifecycle] = 
        (analytics.lifecycleDistribution[history.lifecycle] || 0) + 1
    })

    // Generate insights and recommendations
    analytics.topGrowingComponents = this.getTopGrowingComponents(5)
    analytics.emergencyAdoptionLeaders = this.getEmergencyAdoptionLeaders(5)
    analytics.accessibilityChampions = this.getAccessibilityChampions(5)
    analytics.underAdoptedComponents = this.getUnderAdoptedComponents(5)
    analytics.recommendations = this.generateAdoptionRecommendations()

    return analytics
  }

  /**
   * Get top growing components (highest growth rate)
   */
  getTopGrowingComponents(limit = 5) {
    return Array.from(this.trendData.entries())
      .filter(([_, trends]) => trends.growthRate > 0)
      .sort((a, b) => b[1].growthRate - a[1].growthRate)
      .slice(0, limit)
      .map(([componentName, trends]) => ({
        name: componentName,
        growthRate: trends.growthRate,
        trendDirection: trends.trendDirection,
        velocity: trends.velocity,
        lifecycle: this.adoptionHistory.get(componentName)?.lifecycle
      }))
  }

  /**
   * Get components with highest emergency context adoption
   */
  getEmergencyAdoptionLeaders(limit = 5) {
    return Array.from(this.medicalContextData.entries())
      .filter(([_, data]) => data.emergency > 0)
      .sort((a, b) => b[1].emergency - a[1].emergency)
      .slice(0, limit)
      .map(([componentName, data]) => ({
        name: componentName,
        emergencyUsage: data.emergency,
        totalMedicalUsage: data.emergency + data.routine + data.consultation + data.preventive,
        emergencyPercentage: Math.round((data.emergency / (data.emergency + data.routine + data.consultation + data.preventive)) * 100)
      }))
  }

  /**
   * Get components with highest accessibility feature adoption
   */
  getAccessibilityChampions(limit = 5) {
    return Array.from(this.accessibilityAdoption.entries())
      .map(([componentName, a11yData]) => {
        const totalA11ySessions = Object.values(a11yData)
          .reduce((sum, feature) => sum + feature.sessions, 0)
        const totalA11yUsers = Object.values(a11yData)
          .reduce((sum, feature) => sum + feature.users, 0)
        
        return {
          name: componentName,
          totalA11ySessions,
          totalA11yUsers,
          features: a11yData
        }
      })
      .filter(comp => comp.totalA11ySessions > 0)
      .sort((a, b) => b.totalA11ySessions - a.totalA11ySessions)
      .slice(0, limit)
  }

  /**
   * Get components with low adoption that need attention
   */
  getUnderAdoptedComponents(limit = 5) {
    const avgViews = Array.from(this.adoptionHistory.values())
      .reduce((sum, history) => sum + this.getTotalViews(history), 0) / this.adoptionHistory.size

    return Array.from(this.adoptionHistory.entries())
      .filter(([_, history]) => {
        const totalViews = this.getTotalViews(history)
        return totalViews < avgViews * 0.3 && history.ageInDays > 14 // Older than 2 weeks, low usage
      })
      .map(([componentName, history]) => {
        const trends = this.trendData.get(componentName)
        return {
          name: componentName,
          totalViews: this.getTotalViews(history),
          ageInDays: history.ageInDays,
          lifecycle: history.lifecycle,
          growthRate: trends?.growthRate || 0,
          potentialIssues: this.identifyAdoptionBarriers(componentName)
        }
      })
      .sort((a, b) => a.totalViews - b.totalViews)
      .slice(0, limit)
  }

  /**
   * Generate adoption recommendations based on analysis
   */
  generateAdoptionRecommendations() {
    const recommendations = []

    // Analyze overall trends
    const analytics = this.getAdoptionAnalytics()

    // Recommendation: Promote underused components
    if (analytics.underAdoptedComponents.length > 0) {
      recommendations.push({
        type: 'promotion',
        priority: 'medium',
        title: 'Promote Underused Healthcare Components',
        description: `${analytics.underAdoptedComponents.length} components have low adoption despite being available for >2 weeks`,
        action: 'Create documentation, examples, or tutorials for underused components',
        components: analytics.underAdoptedComponents.map(c => c.name)
      })
    }

    // Recommendation: Scale successful patterns
    if (analytics.topGrowingComponents.length > 0) {
      recommendations.push({
        type: 'scaling',
        priority: 'high', 
        title: 'Scale Successful Healthcare Component Patterns',
        description: 'Apply successful patterns from high-growth components to similar components',
        action: 'Analyze and replicate successful adoption patterns',
        components: analytics.topGrowingComponents.map(c => c.name)
      })
    }

    // Recommendation: Improve accessibility adoption
    const totalA11yAdoption = Object.values(analytics.accessibilityAdoption)
      .reduce((sum, comp) => {
        return sum + Object.values(comp).reduce((compSum, feature) => compSum + feature.sessions, 0)
      }, 0)

    if (totalA11yAdoption < analytics.overview.activeComponents * 10) {
      recommendations.push({
        type: 'accessibility',
        priority: 'high',
        title: 'Increase Healthcare Accessibility Feature Adoption',
        description: 'Accessibility feature usage is below recommended levels for healthcare platform',
        action: 'Add accessibility onboarding, improve feature discoverability',
        impact: 'Critical for WCAG 2.1 AA compliance in medical contexts'
      })
    }

    // Recommendation: Emergency component optimization
    const emergencyComponents = analytics.emergencyAdoptionLeaders.filter(c => c.emergencyPercentage < 20)
    if (emergencyComponents.length > 0) {
      recommendations.push({
        type: 'emergency-optimization',
        priority: 'critical',
        title: 'Optimize Emergency Healthcare Component Usage',
        description: 'Some components used in emergency contexts have low emergency adoption rates',
        action: 'Review emergency user journeys, optimize component emergency states',
        components: emergencyComponents.map(c => c.name)
      })
    }

    return recommendations
  }

  // Helper methods
  determineLifecycleStage(componentName) {
    const history = this.adoptionHistory.get(componentName)
    const trends = this.trendData.get(componentName)
    
    if (!history) return 'new'

    const totalViews = this.getTotalViews(history)
    const ageInDays = history.ageInDays

    // Check for declining trend
    if (trends && trends.growthRate < -20 && trends.trendDirection === 'declining') {
      return 'declining'
    }

    // Apply lifecycle rules
    for (const [stage, rules] of Object.entries(ADOPTION_STAGES)) {
      if (rules.trend) continue // Skip declining (handled above)

      const ageMatches = ageInDays >= rules.minAge && (rules.maxAge === null || ageInDays <= rules.maxAge)
      const viewsMatch = totalViews >= rules.minViews && (rules.maxViews === null || totalViews <= rules.maxViews)

      if (ageMatches && viewsMatch) {
        return stage
      }
    }

    return 'mature' // Default for components that don't fit other categories
  }

  getTotalViews(history) {
    return Array.from(history.daily.values()).reduce((sum, count) => sum + count, 0)
  }

  getWeekKey(date) {
    const year = date.getFullYear()
    const week = this.getWeekNumber(date)
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  getLast7DaysData(dailyData) {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        count: dailyData.get(dateKey) || 0
      })
    }
    return days
  }

  getLast30DaysData(dailyData) {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        count: dailyData.get(dateKey) || 0
      })
    }
    return days
  }

  calculateTrendDirection(growthRate, recentData) {
    if (Math.abs(growthRate) < 5) return 'stable'
    if (growthRate > 20) return 'growing-fast'
    if (growthRate > 0) return 'growing'
    if (growthRate < -20) return 'declining-fast'
    return 'declining'
  }

  calculateAdoptionVelocity(last30Days) {
    // Simple velocity: average daily adoption in last 30 days
    const totalAdoptions = last30Days.reduce((sum, day) => sum + day.count, 0)
    return totalAdoptions / 30
  }

  calculateAdoptionMomentum(last30Days) {
    // Compare first half vs second half of 30-day period
    const firstHalf = last30Days.slice(0, 15).reduce((sum, day) => sum + day.count, 0)
    const secondHalf = last30Days.slice(15).reduce((sum, day) => sum + day.count, 0)
    
    return firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0
  }

  calculateAdoptionDay(componentName) {
    const history = this.adoptionHistory.get(componentName)
    if (!history || !history.firstUsed) return 0
    
    return Math.floor((new Date() - new Date(history.firstUsed)) / (1000 * 60 * 60 * 24))
  }

  identifyAdoptionBarriers(componentName) {
    const barriers = []
    const userTypes = this.userTypeData.get(componentName)
    const medicalData = this.medicalContextData.get(componentName)
    const a11yData = this.accessibilityAdoption.get(componentName)

    // Check if no user type has adopted it
    const totalUserViews = Object.values(userTypes).reduce((sum, user) => sum + user.views, 0)
    if (totalUserViews === 0) barriers.push('no_user_adoption')

    // Check if no medical context usage
    const totalMedicalUsage = medicalData.emergency + medicalData.routine + medicalData.consultation + medicalData.preventive
    if (totalMedicalUsage === 0) barriers.push('no_medical_context_usage')

    // Check if no accessibility usage (for non-a11y components)
    const componentCategory = this.getComponentCategory(componentName)
    if (componentCategory !== 'a11y-showcase') {
      const totalA11yUsage = Object.values(a11yData).reduce((sum, feature) => sum + feature.sessions, 0)
      if (totalA11yUsage === 0) barriers.push('no_accessibility_usage')
    }

    // Check designer adoption (critical for design system success)
    if (userTypes.designers.views === 0) barriers.push('no_designer_adoption')

    return barriers
  }

  getComponentCategory(componentName) {
    for (const [category, components] of Object.entries(HEALTHCARE_COMPONENTS)) {
      if (components[componentName]) {
        return components[componentName].category
      }
    }
    return 'unknown'
  }

  sanitizeAdoptionData(data) {
    // Remove sensitive fields that could contain medical information
    const sensitiveFields = [
      'medicalConcern', 'patientData', 'symptoms', 'diagnosis',
      'personalInfo', 'medicalHistory', 'treatment'
    ]

    const sanitized = { ...data }
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field]
      }
    })

    return sanitized
  }
}

// Global instance for healthcare adoption tracking
export const healthcareAdoptionTracker = new AdoptionTracker()

/**
 * Convenience methods for easy integration
 */
export const AdoptionTracking = {
  // Record component adoption with healthcare context
  recordAdoption: (componentName, context) => {
    healthcareAdoptionTracker.recordAdoption(componentName, context)
  },

  // Record component interaction with adoption tracking
  recordInteraction: (componentName, interactionType, context) => {
    healthcareAdoptionTracker.recordInteraction(componentName, interactionType, context)
  },

  // Get current adoption analytics
  getAnalytics: () => {
    return healthcareAdoptionTracker.getAdoptionAnalytics()
  },

  // Get component lifecycle stage
  getLifecycleStage: (componentName) => {
    return healthcareAdoptionTracker.adoptionHistory.get(componentName)?.lifecycle
  },

  // Get adoption trends for specific component
  getTrends: (componentName) => {
    return healthcareAdoptionTracker.trendData.get(componentName)
  },

  // Get user type breakdown for component
  getUserTypeBreakdown: (componentName) => {
    return healthcareAdoptionTracker.userTypeData.get(componentName)
  },

  // Get medical context usage for component
  getMedicalContextUsage: (componentName) => {
    return healthcareAdoptionTracker.medicalContextData.get(componentName)
  },

  // Get accessibility adoption for component
  getAccessibilityAdoption: (componentName) => {
    return healthcareAdoptionTracker.accessibilityAdoption.get(componentName)
  }
}