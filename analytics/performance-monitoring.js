/**
 * Healthcare Performance Monitoring - Real User Monitoring (RUM) für Healthcare UX
 * Überwacht kritische Performance-Metriken für medizinische Komponenten
 * 
 * Features:
 * - Emergency Component Load Time (<100ms für kritische Components)
 * - Patient Stress Metrics (Long Task Times in medizinischen Kontexten)
 * - Accessibility Performance (Screen Reader Response Time)
 * - Mobile Healthcare Performance (3G Network, Touch Response)
 * - Web Vitals für Healthcare: LCP, FID, CLS mit medical context
 */

// Web Vitals für Healthcare Context
class HealthcareWebVitals {
  constructor() {
    this.metrics = new Map()
    this.isEmergencyContext = false
    this.medicalSpecialty = null
    this.patientStressLevel = 'normal'
    
    this.initWebVitals()
    this.startPerformanceObserver()
  }

  // Initialize Web Vitals measurement with healthcare context
  initWebVitals() {
    // Largest Contentful Paint (LCP) - Critical for medical content
    this.observeLCP()
    
    // First Input Delay (FID) - Critical for healthcare forms
    this.observeFID()
    
    // Cumulative Layout Shift (CLS) - Critical for medical readability
    this.observeCLS()
    
    // First Contentful Paint (FCP) - Emergency component priority
    this.observeFCP()
  }

  observeLCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      const lcpValue = lastEntry.startTime
      const healthcareThreshold = this.isEmergencyContext ? 800 : 1500
      
      this.recordMetric('lcp', {
        value: lcpValue,
        threshold: healthcareThreshold,
        isWithinBudget: lcpValue <= healthcareThreshold,
        healthcareContext: this.getHealthcareContext(),
        emergencyContext: this.isEmergencyContext,
        medicalSpecialty: this.medicalSpecialty,
        patientStress: this.patientStressLevel
      })
    })
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  }

  observeFID() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      entries.forEach((entry) => {
        const fidValue = entry.processingStart - entry.startTime
        const healthcareThreshold = this.isEmergencyContext ? 50 : 100
        
        this.recordMetric('fid', {
          value: fidValue,
          threshold: healthcareThreshold,
          isWithinBudget: fidValue <= healthcareThreshold,
          interactionType: entry.name,
          healthcareContext: this.getHealthcareContext(),
          touchOptimized: this.isTouchInput(entry)
        })
      })
    })
    
    observer.observe({ type: 'first-input', buffered: true })
  }

  observeCLS() {
    let clsValue = 0
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      const healthcareThreshold = 0.1 // Stricter for medical content
      
      this.recordMetric('cls', {
        value: clsValue,
        threshold: healthcareThreshold,
        isWithinBudget: clsValue <= healthcareThreshold,
        healthcareContext: this.getHealthcareContext(),
        medicalReadability: clsValue <= 0.05 // Excellent for medical reading
      })
    })
    
    observer.observe({ type: 'layout-shift', buffered: true })
  }

  observeFCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fcpEntry = entries[0]
      
      const fcpValue = fcpEntry.startTime
      const healthcareThreshold = this.isEmergencyContext ? 400 : 800
      
      this.recordMetric('fcp', {
        value: fcpValue,
        threshold: healthcareThreshold,
        isWithinBudget: fcpValue <= healthcareThreshold,
        healthcareContext: this.getHealthcareContext(),
        emergencyPriority: this.isEmergencyContext
      })
    })
    
    observer.observe({ type: 'paint', buffered: true })
  }

  // Long Task Monitoring für Patient Stress Analysis
  startPerformanceObserver() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'longtask') {
          this.handleLongTask(entry)
        } else if (entry.entryType === 'measure') {
          this.handleCustomMeasure(entry)
        }
      })
    })
    
    observer.observe({ entryTypes: ['longtask', 'measure'] })
  }

  // Long Task Analysis für Medical Context
  handleLongTask(entry) {
    const duration = entry.duration
    const healthcareCritical = duration > 50 // Critical for healthcare UX
    
    // Erhöhte Stress-Level bei Long Tasks in medizinischen Kontexten
    if (healthcareCritical && this.isEmergencyContext) {
      this.patientStressLevel = 'critical'
    } else if (duration > 30) {
      this.patientStressLevel = 'elevated'
    }
    
    this.recordMetric('longtask', {
      duration,
      startTime: entry.startTime,
      healthcareCritical,
      patientStressImpact: this.calculateStressImpact(duration),
      emergencyContext: this.isEmergencyContext,
      medicalSpecialty: this.medicalSpecialty,
      recommendation: this.getPerformanceRecommendation('longtask', duration)
    })
  }

  // Custom Healthcare Measures
  handleCustomMeasure(entry) {
    const measureName = entry.name
    const duration = entry.duration
    
    if (measureName.startsWith('healthcare-')) {
      this.recordHealthcareMeasure(measureName, duration, entry)
    }
  }

  recordHealthcareMeasure(measureName, duration, entry) {
    const measureType = measureName.replace('healthcare-', '')
    const thresholds = this.getHealthcareThresholds(measureType)
    
    this.recordMetric(`healthcare-${measureType}`, {
      duration,
      startTime: entry.startTime,
      threshold: thresholds,
      isWithinBudget: duration <= thresholds.target,
      performanceGrade: this.calculatePerformanceGrade(duration, thresholds),
      healthcareContext: this.getHealthcareContext(),
      medicalPriority: this.getMedicalPriority(measureType)
    })
  }

  // Healthcare-specific thresholds
  getHealthcareThresholds(measureType) {
    const thresholds = {
      'emergency-component-load': { target: 100, warning: 150, critical: 200 },
      'patient-form-response': { target: 200, warning: 350, critical: 500 },
      'doctor-profile-load': { target: 300, warning: 500, critical: 750 },
      'screen-reader-response': { target: 50, warning: 100, critical: 150 },
      'touch-response': { target: 16, warning: 32, critical: 50 },
      'medical-search': { target: 250, warning: 400, critical: 600 },
      'consent-form-load': { target: 150, warning: 250, critical: 350 }
    }
    
    return thresholds[measureType] || { target: 200, warning: 400, critical: 600 }
  }

  calculatePerformanceGrade(duration, thresholds) {
    if (duration <= thresholds.target) return 'excellent'
    if (duration <= thresholds.warning) return 'good'
    if (duration <= thresholds.critical) return 'poor'
    return 'critical'
  }

  getMedicalPriority(measureType) {
    const priorities = {
      'emergency-component-load': 'critical',
      'patient-form-response': 'high',
      'screen-reader-response': 'high',
      'touch-response': 'high',
      'doctor-profile-load': 'medium',
      'medical-search': 'medium',
      'consent-form-load': 'low'
    }
    
    return priorities[measureType] || 'medium'
  }

  calculateStressImpact(duration) {
    if (duration > 100) return 'severe'
    if (duration > 50) return 'moderate'
    if (duration > 30) return 'mild'
    return 'minimal'
  }

  getPerformanceRecommendation(metricType, value) {
    const recommendations = {
      longtask: {
        critical: 'Code-splitting für medizinische Komponenten implementieren',
        elevated: 'Lazy Loading für nicht-kritische Healthcare Features',
        normal: 'Performance ist akzeptabel für medizinische Anwendung'
      }
    }
    
    const level = value > 50 ? 'critical' : value > 30 ? 'elevated' : 'normal'
    return recommendations[metricType]?.[level] || 'Performance überwachen'
  }

  isTouchInput(entry) {
    return entry.target && entry.target.matches('button, [role="button"], input, textarea, select')
  }

  getHealthcareContext() {
    return {
      specialty: this.medicalSpecialty,
      emergency: this.isEmergencyContext,
      stressLevel: this.patientStressLevel,
      timestamp: performance.now()
    }
  }

  // Update context based on page/component context
  updateHealthcareContext(context) {
    this.isEmergencyContext = context.isEmergency || false
    this.medicalSpecialty = context.medicalSpecialty || null
    this.patientStressLevel = context.patientStressLevel || 'normal'
  }

  recordMetric(name, data) {
    const metricData = {
      name,
      ...data,
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    }
    
    this.metrics.set(`${name}-${Date.now()}`, metricData)
    
    // Send to analytics if critical or emergency context
    if (data.healthcareCritical || this.isEmergencyContext) {
      this.sendCriticalMetric(metricData)
    }
    
    // Store in localStorage for debugging
    this.storeDebugMetric(metricData)
  }

  getConnectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : { effectiveType: 'unknown' }
  }

  sendCriticalMetric(metricData) {
    // Send critical healthcare metrics immediately
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'healthcare_performance_critical', {
        metric_name: metricData.name,
        metric_value: metricData.value || metricData.duration,
        healthcare_context: metricData.healthcareContext?.specialty || 'general',
        emergency_context: metricData.emergencyContext || false,
        performance_grade: metricData.performanceGrade || 'unknown'
      })
    }
  }

  storeDebugMetric(metricData) {
    if (process.env.NODE_ENV === 'development') {
      const debugMetrics = JSON.parse(localStorage.getItem('healthcare-performance-debug') || '[]')
      debugMetrics.push(metricData)
      
      // Keep only last 50 metrics
      if (debugMetrics.length > 50) {
        debugMetrics.splice(0, debugMetrics.length - 50)
      }
      
      localStorage.setItem('healthcare-performance-debug', JSON.stringify(debugMetrics))
    }
  }

  // Get performance summary for healthcare dashboard
  getHealthcarePerformanceSummary() {
    const summary = {
      webVitals: {},
      healthcareMetrics: {},
      emergencyPerformance: {},
      accessibilityPerformance: {},
      recommendations: []
    }
    
    this.metrics.forEach((metric) => {
      if (['lcp', 'fid', 'cls', 'fcp'].includes(metric.name)) {
        summary.webVitals[metric.name] = {
          value: metric.value,
          threshold: metric.threshold,
          grade: metric.isWithinBudget ? 'pass' : 'fail',
          healthcareOptimized: metric.healthcareContext
        }
      }
      
      if (metric.name.startsWith('healthcare-')) {
        const metricName = metric.name.replace('healthcare-', '')
        summary.healthcareMetrics[metricName] = {
          duration: metric.duration,
          grade: metric.performanceGrade,
          medicalPriority: metric.medicalPriority
        }
      }
      
      if (metric.emergencyContext) {
        summary.emergencyPerformance[metric.name] = {
          value: metric.value || metric.duration,
          criticalThreshold: metric.threshold,
          withinEmergencyBudget: metric.isWithinBudget
        }
      }
      
      if (metric.name === 'screen-reader-response' || metric.name === 'touch-response') {
        summary.accessibilityPerformance[metric.name] = {
          responseTime: metric.duration,
          accessibilityGrade: metric.performanceGrade,
          criticalForA11y: metric.medicalPriority === 'critical'
        }
      }
      
      if (metric.recommendation) {
        summary.recommendations.push({
          metric: metric.name,
          recommendation: metric.recommendation,
          priority: metric.medicalPriority || 'medium'
        })
      }
    })
    
    return summary
  }

  // Clear debug data
  clearDebugData() {
    localStorage.removeItem('healthcare-performance-debug')
    this.metrics.clear()
  }
}

// Healthcare Component Performance Tracker
class HealthcareComponentTracker {
  constructor() {
    this.componentMetrics = new Map()
    this.observeComponents()
  }

  observeComponents() {
    // Observer für Healthcare Components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && this.isHealthcareComponent(node)) {
            this.trackComponentMount(node)
          }
        })
      })
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-component', 'class']
    })
  }

  isHealthcareComponent(element) {
    const healthcareClasses = [
      'healthcare-',
      'medical-',
      'emergency-',
      'doctor-',
      'patient-',
      'consent-'
    ]
    
    return healthcareClasses.some(className => 
      element.className && element.className.includes(className)
    ) || element.getAttribute('data-component')?.startsWith('healthcare-')
  }

  trackComponentMount(element) {
    const componentName = this.getComponentName(element)
    const mountStart = performance.now()
    
    // Wait for component to be fully rendered
    requestAnimationFrame(() => {
      const mountEnd = performance.now()
      const mountTime = mountEnd - mountStart
      
      this.recordComponentMetric(componentName, 'mount', {
        mountTime,
        isEmergency: this.isEmergencyComponent(element),
        hasAccessibilityFeatures: this.hasA11yFeatures(element),
        touchOptimized: this.isTouchOptimized(element)
      })
    })
  }

  getComponentName(element) {
    return element.getAttribute('data-component') || 
           element.className.split(' ').find(cls => cls.startsWith('healthcare-')) ||
           'unknown-healthcare-component'
  }

  isEmergencyComponent(element) {
    return element.className.includes('emergency-') || 
           element.getAttribute('data-emergency') === 'true'
  }

  hasA11yFeatures(element) {
    return element.hasAttribute('aria-label') || 
           element.hasAttribute('aria-describedby') ||
           element.getAttribute('role') !== null
  }

  isTouchOptimized(element) {
    const rect = element.getBoundingClientRect()
    return rect.width >= 56 && rect.height >= 56 // Healthcare touch target size
  }

  recordComponentMetric(componentName, metricType, data) {
    const key = `${componentName}-${metricType}-${Date.now()}`
    
    this.componentMetrics.set(key, {
      component: componentName,
      metricType,
      ...data,
      timestamp: Date.now(),
      url: window.location.pathname
    })
  }

  getComponentPerformanceReport() {
    const report = {
      components: {},
      emergencyComponents: {},
      accessibilityReport: {},
      touchOptimizationReport: {}
    }
    
    this.componentMetrics.forEach((metric, key) => {
      const componentName = metric.component
      
      if (!report.components[componentName]) {
        report.components[componentName] = {
          mountTimes: [],
          emergencyOptimized: false,
          accessibilityScore: 0,
          touchOptimized: false
        }
      }
      
      const component = report.components[componentName]
      
      if (metric.metricType === 'mount') {
        component.mountTimes.push(metric.mountTime)
        component.emergencyOptimized = metric.isEmergency
        component.accessibilityScore += metric.hasAccessibilityFeatures ? 1 : 0
        component.touchOptimized = metric.touchOptimized
        
        if (metric.isEmergency) {
          report.emergencyComponents[componentName] = {
            averageMountTime: this.calculateAverage(component.mountTimes),
            withinEmergencyThreshold: metric.mountTime <= 100
          }
        }
        
        if (metric.hasAccessibilityFeatures) {
          report.accessibilityReport[componentName] = {
            a11yFeatures: true,
            mountTime: metric.mountTime,
            a11yPerformanceGrade: metric.mountTime <= 50 ? 'excellent' : 
                                 metric.mountTime <= 100 ? 'good' : 'needs-improvement'
          }
        }
        
        if (metric.touchOptimized) {
          report.touchOptimizationReport[componentName] = {
            touchReady: true,
            meetsTouchStandards: true
          }
        }
      }
    })
    
    return report
  }

  calculateAverage(numbers) {
    return numbers.length > 0 ? numbers.reduce((a, b) => a + b) / numbers.length : 0
  }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HealthcareWebVitals,
    HealthcareComponentTracker
  }
} else if (typeof window !== 'undefined') {
  window.HealthcareWebVitals = HealthcareWebVitals
  window.HealthcareComponentTracker = HealthcareComponentTracker
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.healthcareRUM = new HealthcareWebVitals()
    window.healthcareComponentTracker = new HealthcareComponentTracker()
    
    console.log('Healthcare Performance Monitoring initialized')
  })
}