/**
 * Healthcare Component Popularity Analytics Dashboard
 * Real-time popularity tracking and visualization for healthcare design system
 * 
 * Features:
 * - Real-time component popularity rankings
 * - Medical specialty popularity analysis  
 * - User type popularity patterns (Designers, Developers, Medical Reviewers)
 * - Emergency vs. routine usage popularity
 * - Accessibility feature popularity tracking
 * - Interactive dashboard data preparation
 * 
 * Privacy: GDPR-compliant, no sensitive medical data tracked
 */

import { ComponentUsageTracker, HEALTHCARE_COMPONENTS, MEDICAL_SPECIALTIES } from './component-metrics.js'
import { AdoptionTracking, USER_TYPES } from './adoption-tracking.js'
import { ComponentHealth } from './component-health.js'
import { HealthcareEvents } from './healthcare-events.js'

/**
 * Popularity Ranking Algorithms
 */
export const POPULARITY_ALGORITHMS = {
  // Simple view count based popularity
  views: (component) => component.totalViews,
  
  // Weighted popularity (views + interactions)
  engagement: (component) => (component.totalViews * 0.7) + (component.totalInteractions * 0.3),
  
  // Healthcare-specific popularity (includes medical context)
  healthcare: (component) => {
    const baseScore = (component.totalViews * 0.5) + (component.totalInteractions * 0.3)
    const emergencyBonus = component.emergencyUsage * 0.15
    const accessibilityBonus = component.accessibilityUsage * 0.05
    return baseScore + emergencyBonus + accessibilityBonus
  },
  
  // Trending popularity (recent growth weighted)
  trending: (component) => {
    const recentViews = component.last7DaysViews || 0
    const previousViews = component.previous7DaysViews || 0
    const growthRate = previousViews > 0 ? (recentViews - previousViews) / previousViews : 0
    return component.totalViews * (1 + Math.max(0, growthRate))
  },
  
  // Quality-adjusted popularity (popularity * health score)
  quality: (component) => {
    const popularity = (component.totalViews * 0.6) + (component.totalInteractions * 0.4)
    const healthMultiplier = (component.healthScore || 50) / 100
    return popularity * healthMultiplier
  }
}

/**
 * Time Period Definitions for Popularity Analysis
 */
export const TIME_PERIODS = {
  'last24Hours': { hours: 24, label: 'Last 24 Hours' },
  'last7Days': { hours: 24 * 7, label: 'Last 7 Days' },
  'last30Days': { hours: 24 * 30, label: 'Last 30 Days' },
  'last90Days': { hours: 24 * 90, label: 'Last 90 Days' },
  'allTime': { hours: null, label: 'All Time' }
}

/**
 * Healthcare Component Popularity Dashboard
 */
export class PopularityDashboard {
  constructor() {
    this.popularityData = new Map()
    this.rankingHistory = new Map()
    this.medicalSpecialtyPopularity = new Map()
    this.userTypePopularity = new Map()
    this.emergencyPopularity = new Map()
    this.accessibilityPopularity = new Map()
    
    this.initializePopularityTracking()
  }

  /**
   * Initialize popularity tracking for all healthcare components
   */
  initializePopularityTracking() {
    const allComponents = {
      ...HEALTHCARE_COMPONENTS.core,
      ...HEALTHCARE_COMPONENTS.medical,
      ...HEALTHCARE_COMPONENTS.accessibility,
      ...HEALTHCARE_COMPONENTS.content
    }

    Object.keys(allComponents).forEach(componentName => {
      // Initialize popularity data
      this.popularityData.set(componentName, {
        totalViews: 0,
        totalInteractions: 0,
        emergencyUsage: 0,
        accessibilityUsage: 0,
        last7DaysViews: 0,
        previous7DaysViews: 0,
        healthScore: 0,
        category: allComponents[componentName].category,
        medicalPriority: allComponents[componentName].medicalPriority,
        rankings: {},
        trendDirection: 'stable'
      })

      // Initialize ranking history
      this.rankingHistory.set(componentName, {
        daily: new Map(),
        weekly: new Map(),
        monthly: new Map()
      })
    })

    // Initialize specialty popularity
    Object.keys(MEDICAL_SPECIALTIES).forEach(specialty => {
      this.medicalSpecialtyPopularity.set(specialty, {
        totalUsage: 0,
        topComponents: [],
        emergencyUsage: 0,
        userTypes: new Map()
      })
    })

    // Initialize user type popularity
    Object.keys(USER_TYPES).forEach(userType => {
      this.userTypePopularity.set(userType, {
        totalUsage: 0,
        topComponents: [],
        medicalContexts: new Map(),
        accessibilityUsage: 0
      })
    })
  }

  /**
   * Update component popularity data
   */
  updatePopularityData(componentName, updateData = {}) {
    const {
      views = 0,
      interactions = 0,
      emergencyContext = false,
      accessibilityFeatures = [],
      userType = 'patient',
      medicalSpecialty = null,
      medicalContext = 'routine'
    } = updateData

    const popularity = this.popularityData.get(componentName)
    if (!popularity) return

    // Update basic metrics
    popularity.totalViews += views
    popularity.totalInteractions += interactions

    if (emergencyContext) {
      popularity.emergencyUsage += 1
    }

    if (accessibilityFeatures.length > 0) {
      popularity.accessibilityUsage += accessibilityFeatures.length
    }

    // Update health score
    const healthData = ComponentHealth.calculateHealth(componentName)
    popularity.healthScore = healthData.overall

    // Update time-based metrics
    this.updateTimeBasedMetrics(componentName, views)

    // Calculate rankings using different algorithms
    popularity.rankings = this.calculateComponentRankings(componentName)

    // Update specialty popularity
    if (medicalSpecialty) {
      this.updateSpecialtyPopularity(medicalSpecialty, componentName, updateData)
    }

    // Update user type popularity
    this.updateUserTypePopularity(userType, componentName, updateData)

    // Record ranking history
    this.recordRankingHistory(componentName, popularity.rankings)

    // Send popularity analytics event
    HealthcareEvents.componentPopularity(componentName, {
      totalViews: popularity.totalViews,
      rankingPosition: popularity.rankings.healthcare || 999,
      popularityScore: this.calculatePopularityScore(componentName),
      trendDirection: popularity.trendDirection,
      userType,
      medicalSpecialty,
      emergencyContext
    })
  }

  /**
   * Calculate component rankings using different algorithms
   */
  calculateComponentRankings(componentName) {
    const allComponents = Array.from(this.popularityData.entries())
    const rankings = {}

    // Calculate rankings for each algorithm
    Object.keys(POPULARITY_ALGORITHMS).forEach(algorithm => {
      const sortedComponents = allComponents
        .map(([name, data]) => ({
          name,
          score: POPULARITY_ALGORITHMS[algorithm](data)
        }))
        .sort((a, b) => b.score - a.score)

      const rank = sortedComponents.findIndex(comp => comp.name === componentName) + 1
      rankings[algorithm] = rank
    })

    return rankings
  }

  /**
   * Get comprehensive popularity dashboard data
   */
  getPopularityDashboard(timePeriod = 'last30Days', algorithm = 'healthcare') {
    const dashboard = {
      timestamp: new Date().toISOString(),
      timePeriod: timePeriod,
      algorithm: algorithm,
      overview: {
        totalComponents: this.popularityData.size,
        activeComponents: 0,
        totalViews: 0,
        totalInteractions: 0,
        emergencyUsage: 0,
        accessibilityUsage: 0
      },
      topComponents: [],
      bottomComponents: [],
      trendingComponents: [],
      emergencyFavorites: [],
      accessibilityChampions: [],
      medicalSpecialtyRankings: {},
      userTypePreferences: {},
      categoryAnalysis: {},
      insights: [],
      recommendations: []
    }

    // Update all component data
    this.refreshAllPopularityData()

    // Calculate overview metrics
    this.popularityData.forEach((data, componentName) => {
      dashboard.overview.totalViews += data.totalViews
      dashboard.overview.totalInteractions += data.totalInteractions
      dashboard.overview.emergencyUsage += data.emergencyUsage
      dashboard.overview.accessibilityUsage += data.accessibilityUsage

      if (data.totalViews > 0) {
        dashboard.overview.activeComponents++
      }
    })

    // Generate component rankings
    dashboard.topComponents = this.getTopComponents(10, algorithm)
    dashboard.bottomComponents = this.getBottomComponents(5, algorithm)
    dashboard.trendingComponents = this.getTrendingComponents(5)
    dashboard.emergencyFavorites = this.getEmergencyFavorites(5)
    dashboard.accessibilityChampions = this.getAccessibilityChampions(5)

    // Medical specialty analysis
    dashboard.medicalSpecialtyRankings = this.getMedicalSpecialtyRankings()

    // User type analysis
    dashboard.userTypePreferences = this.getUserTypePreferences()

    // Category analysis
    dashboard.categoryAnalysis = this.getCategoryAnalysis()

    // Generate insights and recommendations
    dashboard.insights = this.generatePopularityInsights()
    dashboard.recommendations = this.generatePopularityRecommendations()

    return dashboard
  }

  /**
   * Get top components by popularity
   */
  getTopComponents(limit = 10, algorithm = 'healthcare') {
    const components = Array.from(this.popularityData.entries())
      .map(([name, data]) => ({
        name,
        score: POPULARITY_ALGORITHMS[algorithm](data),
        totalViews: data.totalViews,
        totalInteractions: data.totalInteractions,
        emergencyUsage: data.emergencyUsage,
        accessibilityUsage: data.accessibilityUsage,
        healthScore: data.healthScore,
        category: data.category,
        medicalPriority: data.medicalPriority,
        ranking: data.rankings[algorithm] || 999,
        trendDirection: data.trendDirection
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return components
  }

  /**
   * Get bottom components that need attention
   */
  getBottomComponents(limit = 5, algorithm = 'healthcare') {
    const components = Array.from(this.popularityData.entries())
      .map(([name, data]) => ({
        name,
        score: POPULARITY_ALGORITHMS[algorithm](data),
        totalViews: data.totalViews,
        category: data.category,
        medicalPriority: data.medicalPriority,
        ranking: data.rankings[algorithm] || 999,
        potentialIssues: this.identifyPopularityIssues(name, data)
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, limit)

    return components
  }

  /**
   * Get trending components (highest growth rate)
   */
  getTrendingComponents(limit = 5) {
    const components = Array.from(this.popularityData.entries())
      .map(([name, data]) => {
        const growthRate = this.calculateGrowthRate(name)
        return {
          name,
          growthRate,
          last7DaysViews: data.last7DaysViews,
          previous7DaysViews: data.previous7DaysViews,
          totalViews: data.totalViews,
          category: data.category,
          trendDirection: data.trendDirection
        }
      })
      .filter(comp => comp.growthRate > 0)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, limit)

    return components
  }

  /**
   * Get components most popular in emergency contexts
   */
  getEmergencyFavorites(limit = 5) {
    return Array.from(this.popularityData.entries())
      .filter(([_, data]) => data.emergencyUsage > 0)
      .map(([name, data]) => ({
        name,
        emergencyUsage: data.emergencyUsage,
        totalViews: data.totalViews,
        emergencyPercentage: data.totalViews > 0 ? Math.round((data.emergencyUsage / data.totalViews) * 100) : 0,
        category: data.category,
        medicalPriority: data.medicalPriority
      }))
      .sort((a, b) => b.emergencyUsage - a.emergencyUsage)
      .slice(0, limit)
  }

  /**
   * Get components with highest accessibility feature usage
   */
  getAccessibilityChampions(limit = 5) {
    return Array.from(this.popularityData.entries())
      .filter(([_, data]) => data.accessibilityUsage > 0)
      .map(([name, data]) => ({
        name,
        accessibilityUsage: data.accessibilityUsage,
        totalViews: data.totalViews,
        accessibilityPercentage: data.totalViews > 0 ? Math.round((data.accessibilityUsage / data.totalViews) * 100) : 0,
        category: data.category,
        a11yFeatures: this.getA11yFeatureBreakdown(name)
      }))
      .sort((a, b) => b.accessibilityUsage - a.accessibilityUsage)
      .slice(0, limit)
  }

  /**
   * Get medical specialty popularity rankings
   */
  getMedicalSpecialtyRankings() {
    const rankings = {}

    this.medicalSpecialtyPopularity.forEach((data, specialty) => {
      rankings[specialty] = {
        totalUsage: data.totalUsage,
        topComponents: data.topComponents.slice(0, 3), // Top 3 per specialty
        emergencyUsage: data.emergencyUsage,
        userTypeBreakdown: Object.fromEntries(data.userTypes),
        popularity: data.totalUsage,
        specialtyInfo: MEDICAL_SPECIALTIES[specialty]
      }
    })

    // Sort by popularity
    const sortedSpecialties = Object.entries(rankings)
      .sort(([,a], [,b]) => b.totalUsage - a.totalUsage)

    return Object.fromEntries(sortedSpecialties)
  }

  /**
   * Get user type preference analysis
   */
  getUserTypePreferences() {
    const preferences = {}

    this.userTypePopularity.forEach((data, userType) => {
      preferences[userType] = {
        totalUsage: data.totalUsage,
        topComponents: data.topComponents.slice(0, 5),
        medicalContextBreakdown: Object.fromEntries(data.medicalContexts),
        accessibilityUsage: data.accessibilityUsage,
        userTypeInfo: USER_TYPES[userType]
      }
    })

    return preferences
  }

  /**
   * Get component category analysis
   */
  getCategoryAnalysis() {
    const categoryData = new Map()

    this.popularityData.forEach((data, componentName) => {
      const category = data.category
      const current = categoryData.get(category) || {
        totalViews: 0,
        totalInteractions: 0,
        componentCount: 0,
        avgPopularity: 0,
        topComponent: null,
        emergencyUsage: 0
      }

      current.totalViews += data.totalViews
      current.totalInteractions += data.totalInteractions
      current.componentCount += 1
      current.emergencyUsage += data.emergencyUsage

      if (!current.topComponent || data.totalViews > current.topComponent.views) {
        current.topComponent = { name: componentName, views: data.totalViews }
      }

      categoryData.set(category, current)
    })

    // Calculate averages
    categoryData.forEach((data, category) => {
      data.avgPopularity = Math.round(data.totalViews / data.componentCount)
    })

    return Object.fromEntries(categoryData)
  }

  /**
   * Generate popularity insights
   */
  generatePopularityInsights() {
    const insights = []

    const topComponents = this.getTopComponents(3)
    const trendingComponents = this.getTrendingComponents(3)
    const emergencyFavorites = this.getEmergencyFavorites(3)

    // Top component insights
    if (topComponents.length > 0) {
      const top = topComponents[0]
      insights.push({
        type: 'top-performer',
        title: `${top.name} is the Most Popular Healthcare Component`,
        description: `With ${top.totalViews} total views and ${top.totalInteractions} interactions, ${top.name} leads in adoption`,
        impact: 'high',
        category: top.category
      })
    }

    // Trending insights
    if (trendingComponents.length > 0) {
      const trending = trendingComponents[0]
      insights.push({
        type: 'trending',
        title: `${trending.name} Shows Highest Growth`,
        description: `Growing at ${Math.round(trending.growthRate)}% week-over-week, indicating strong adoption momentum`,
        impact: 'medium',
        category: trending.category
      })
    }

    // Emergency usage insights
    if (emergencyFavorites.length > 0) {
      const emergency = emergencyFavorites[0]
      insights.push({
        type: 'emergency',
        title: `${emergency.name} Leads Emergency Context Usage`,
        description: `${emergency.emergencyPercentage}% of usage occurs in emergency contexts, critical for patient safety`,
        impact: 'critical',
        category: emergency.category
      })
    }

    // Category insights
    const categoryAnalysis = this.getCategoryAnalysis()
    const topCategory = Object.entries(categoryAnalysis)
      .sort(([,a], [,b]) => b.totalViews - a.totalViews)[0]

    if (topCategory) {
      const [categoryName, categoryData] = topCategory
      insights.push({
        type: 'category',
        title: `${categoryName} Components Show Highest Overall Usage`,
        description: `${categoryData.componentCount} components in this category generate ${categoryData.totalViews} total views`,
        impact: 'medium',
        category: categoryName
      })
    }

    return insights
  }

  /**
   * Generate popularity-based recommendations
   */
  generatePopularityRecommendations() {
    const recommendations = []

    const bottomComponents = this.getBottomComponents(3)
    const topComponents = this.getTopComponents(3)

    // Low popularity recommendations
    if (bottomComponents.length > 0) {
      recommendations.push({
        type: 'boost-adoption',
        priority: 'medium',
        title: 'Boost Adoption of Underused Components',
        description: `${bottomComponents.length} components show low adoption despite availability`,
        actions: [
          'Create usage examples and tutorials',
          'Add to popular page templates',
          'Improve documentation and medical use cases',
          'Consider user feedback and usability testing'
        ],
        components: bottomComponents.map(c => c.name)
      })
    }

    // Successful pattern replication
    if (topComponents.length > 0) {
      const patterns = topComponents.map(c => c.category)
      const uniquePatterns = [...new Set(patterns)]
      
      recommendations.push({
        type: 'replicate-success',
        priority: 'high',
        title: 'Replicate Successful Component Patterns',
        description: `Top components share common patterns that can be applied to improve other components`,
        actions: [
          'Analyze successful component design patterns',
          'Apply successful UX patterns to similar components',
          'Improve documentation based on successful examples',
          'Cross-promote related successful components'
        ],
        successfulCategories: uniquePatterns
      })
    }

    // Emergency optimization
    const emergencyFavorites = this.getEmergencyFavorites(5)
    const emergencyComponents = Array.from(this.popularityData.entries())
      .filter(([_, data]) => data.medicalPriority === 'critical')
      .filter(([name]) => !emergencyFavorites.some(fav => fav.name === name))

    if (emergencyComponents.length > 0) {
      recommendations.push({
        type: 'emergency-optimization',
        priority: 'critical',
        title: 'Optimize Critical Components for Emergency Use',
        description: `${emergencyComponents.length} critical components show low emergency context usage`,
        actions: [
          'Review emergency user journeys',
          'Optimize for high-stress usage scenarios',
          'Improve emergency state visibility',
          'Test in realistic emergency contexts'
        ],
        components: emergencyComponents.map(([name]) => name).slice(0, 3)
      })
    }

    return recommendations
  }

  // Helper methods
  updateTimeBasedMetrics(componentName, views) {
    const popularity = this.popularityData.get(componentName)
    if (!popularity) return

    // Mock time-based tracking (in real app, implement proper time windowing)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
    
    // Simulate last 7 days vs previous 7 days
    popularity.previous7DaysViews = popularity.last7DaysViews
    popularity.last7DaysViews += views

    // Calculate trend direction
    const growthRate = this.calculateGrowthRate(componentName)
    if (Math.abs(growthRate) < 5) popularity.trendDirection = 'stable'
    else if (growthRate > 0) popularity.trendDirection = 'growing'
    else popularity.trendDirection = 'declining'
  }

  calculateGrowthRate(componentName) {
    const popularity = this.popularityData.get(componentName)
    if (!popularity || popularity.previous7DaysViews === 0) return 0

    return ((popularity.last7DaysViews - popularity.previous7DaysViews) / popularity.previous7DaysViews) * 100
  }

  calculatePopularityScore(componentName) {
    const popularity = this.popularityData.get(componentName)
    if (!popularity) return 0

    return POPULARITY_ALGORITHMS.healthcare(popularity)
  }

  updateSpecialtyPopularity(specialty, componentName, updateData) {
    const specialtyData = this.medicalSpecialtyPopularity.get(specialty)
    if (!specialtyData) return

    specialtyData.totalUsage += 1

    if (updateData.emergencyContext) {
      specialtyData.emergencyUsage += 1
    }

    // Update user type breakdown
    const userType = updateData.userType || 'patient'
    const currentCount = specialtyData.userTypes.get(userType) || 0
    specialtyData.userTypes.set(userType, currentCount + 1)

    // Update top components for this specialty
    const componentExists = specialtyData.topComponents.find(comp => comp.name === componentName)
    if (componentExists) {
      componentExists.usage += 1
    } else {
      specialtyData.topComponents.push({ name: componentName, usage: 1 })
    }

    // Sort and keep top 5
    specialtyData.topComponents.sort((a, b) => b.usage - a.usage)
    specialtyData.topComponents = specialtyData.topComponents.slice(0, 5)
  }

  updateUserTypePopularity(userType, componentName, updateData) {
    const userTypeData = this.userTypePopularity.get(userType)
    if (!userTypeData) return

    userTypeData.totalUsage += 1

    const medicalContext = updateData.medicalContext || 'routine'
    const currentCount = userTypeData.medicalContexts.get(medicalContext) || 0
    userTypeData.medicalContexts.set(medicalContext, currentCount + 1)

    if (updateData.accessibilityFeatures && updateData.accessibilityFeatures.length > 0) {
      userTypeData.accessibilityUsage += updateData.accessibilityFeatures.length
    }

    // Update top components for this user type
    const componentExists = userTypeData.topComponents.find(comp => comp.name === componentName)
    if (componentExists) {
      componentExists.usage += 1
    } else {
      userTypeData.topComponents.push({ name: componentName, usage: 1 })
    }

    // Sort and keep top 10
    userTypeData.topComponents.sort((a, b) => b.usage - a.usage)
    userTypeData.topComponents = userTypeData.topComponents.slice(0, 10)
  }

  refreshAllPopularityData() {
    // Mock data refresh (in real app, pull from actual usage tracking)
    this.popularityData.forEach((data, componentName) => {
      const usage = ComponentUsageTracker.getMetrics()
      const health = ComponentHealth.calculateHealth(componentName)
      
      // Update with real data when available
      if (health) {
        data.healthScore = health.overall
      }
    })
  }

  recordRankingHistory(componentName, rankings) {
    const history = this.rankingHistory.get(componentName)
    if (!history) return

    const today = new Date().toISOString().split('T')[0]
    history.daily.set(today, { ...rankings, timestamp: new Date().toISOString() })

    // Keep only last 30 days
    const dates = Array.from(history.daily.keys()).sort()
    if (dates.length > 30) {
      history.daily.delete(dates[0])
    }
  }

  identifyPopularityIssues(componentName, data) {
    const issues = []

    if (data.totalViews === 0) issues.push('never_viewed')
    if (data.totalInteractions === 0 && data.totalViews > 0) issues.push('no_interactions')
    if (data.medicalPriority === 'critical' && data.emergencyUsage === 0) issues.push('critical_not_emergency_used')
    if (data.category.includes('a11y') && data.accessibilityUsage === 0) issues.push('accessibility_component_no_a11y_usage')
    if (data.healthScore < 50) issues.push('low_health_score')

    return issues
  }

  getA11yFeatureBreakdown(componentName) {
    const a11yData = AdoptionTracking.getAccessibilityAdoption(componentName)
    if (!a11yData) return {}

    return {
      screenReader: a11yData.screenReader?.sessions || 0,
      keyboardNavigation: a11yData.keyboardNavigation?.sessions || 0,
      highContrast: a11yData.highContrast?.sessions || 0,
      voiceControl: a11yData.voiceControl?.sessions || 0
    }
  }
}

// Global instance for healthcare popularity dashboard
export const healthcarePopularityDashboard = new PopularityDashboard()

/**
 * Convenience methods for easy integration
 */
export const PopularityAnalytics = {
  // Update component popularity data
  updatePopularity: (componentName, updateData) => {
    healthcarePopularityDashboard.updatePopularityData(componentName, updateData)
  },

  // Get popularity dashboard
  getDashboard: (timePeriod = 'last30Days', algorithm = 'healthcare') => {
    return healthcarePopularityDashboard.getPopularityDashboard(timePeriod, algorithm)
  },

  // Get component ranking
  getComponentRanking: (componentName, algorithm = 'healthcare') => {
    const popularity = healthcarePopularityDashboard.popularityData.get(componentName)
    return popularity?.rankings[algorithm] || 999
  },

  // Get top components
  getTopComponents: (limit = 10, algorithm = 'healthcare') => {
    return healthcarePopularityDashboard.getTopComponents(limit, algorithm)
  },

  // Get trending components
  getTrendingComponents: (limit = 5) => {
    return healthcarePopularityDashboard.getTrendingComponents(limit)
  },

  // Get emergency favorites
  getEmergencyFavorites: (limit = 5) => {
    return healthcarePopularityDashboard.getEmergencyFavorites(limit)
  },

  // Get medical specialty rankings
  getMedicalSpecialtyRankings: () => {
    return healthcarePopularityDashboard.getMedicalSpecialtyRankings()
  },

  // Get user type preferences
  getUserTypePreferences: () => {
    return healthcarePopularityDashboard.getUserTypePreferences()
  }
}