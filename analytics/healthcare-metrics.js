/**
 * Healthcare-spezifische Performance Metriken
 * Medizinische Performance-Anforderungen für zweitmeinung.ng Platform
 * 
 * Features:
 * - Emergency Component Performance (<100ms)
 * - Patient Stress Analysis (UI Response Times)
 * - Medical Professional Mobile Performance
 * - Accessibility Performance (Screen Reader, Touch)
 * - Network Condition Analysis (Clinical Networks, 3G)
 */

// Healthcare Performance Standards
const HEALTHCARE_PERFORMANCE_STANDARDS = {
  // Emergency Components - Kritische medizinische Funktionen
  emergency: {
    componentLoad: 100, // ms - Kritische Components müssen unter 100ms laden
    touchResponse: 16,  // ms - Sofortige Touch-Reaktion für Notfälle
    screenReaderResponse: 50, // ms - Screen Reader Antwortzeit
    networkTimeout: 5000, // ms - Maximale Wartezeit für Notfall-Daten
    priority: 'critical'
  },
  
  // Patient Forms - Datenerfassung und Eingaben
  patientForm: {
    componentLoad: 200, // ms - Formular-Components laden
    inputResponse: 32,  // ms - Eingabe-Reaktionszeit
    validationResponse: 100, // ms - Formular-Validierung
    autoSave: 500,      // ms - Automatisches Speichern
    priority: 'high'
  },
  
  // Doctor Profiles - Arzt-Informationen
  doctorProfile: {
    componentLoad: 300, // ms - Arzt-Profile laden
    imageLoad: 1000,    // ms - Profilbilder laden
    credentialsLoad: 200, // ms - Qualifikationen anzeigen
    availability: 150,   // ms - Verfügbarkeits-Check
    priority: 'medium'
  },
  
  // Accessibility - Barrierefreiheit
  accessibility: {
    screenReaderLatency: 50,  // ms - Screen Reader Verzögerung
    keyboardNavigation: 16,   // ms - Tastatur-Navigation
    focusIndicatorDelay: 0,   // ms - Fokus-Indikator sofort
    contrastRatio: 4.5,       // Kontrast-Verhältnis minimum
    touchTargetSize: 56,      // px - Touch-Ziel Mindestgröße
    priority: 'critical'
  },
  
  // Mobile Healthcare - Mobile Geräte im Gesundheitswesen
  mobile: {
    first_paint: 800,         // ms - Erster visueller Inhalt
    time_to_interactive: 2500, // ms - Interaktionsbereitschaft
    touch_delay: 300,         // ms - Touch-Verzögerung eliminieren
    viewport_adaptation: 100, // ms - Viewport-Anpassung
    offline_capability: true, // Offline-Funktionalität erforderlich
    priority: 'high'
  }
}

// Medical Network Conditions - Netzwerkbedingungen im Gesundheitswesen
const MEDICAL_NETWORK_CONDITIONS = {
  // Krankenhaus-WiFi (oft überlastet)
  hospital_wifi: {
    bandwidth: '2mbps',
    latency: 200,
    packetLoss: 0.05,
    description: 'Krankenhaus-WiFi mit geteilter Bandbreite'
  },
  
  // Mobile Daten für Hausärzte
  mobile_3g: {
    bandwidth: '1mbps',
    latency: 400,
    packetLoss: 0.02,
    description: '3G Mobilfunk für mobile Gesundheitsdienste'
  },
  
  // Notfall-Netzwerk
  emergency_network: {
    bandwidth: '512kbps',
    latency: 800,
    packetLoss: 0.1,
    description: 'Notfall-Netzwerk unter extremen Bedingungen'
  },
  
  // Telemedizin zu Hause
  home_broadband: {
    bandwidth: '5mbps',
    latency: 50,
    packetLoss: 0.01,
    description: 'Heimnetzwerk für Telemedizin'
  }
}

class HealthcareMetrics {
  constructor(options = {}) {
    this.options = {
      enableRealUserMonitoring: true,
      enableNetworkAnalysis: true,
      enableAccessibilityTracking: true,
      enableStressAnalysis: true,
      debugMode: process.env.NODE_ENV === 'development',
      ...options
    }
    
    this.metrics = new Map()
    this.networkCondition = 'unknown'
    this.currentContext = {
      medicalSpecialty: null,
      isEmergency: false,
      userType: 'patient', // patient, doctor, nurse, admin
      stressLevel: 'normal',
      accessibilityNeeds: []
    }
    
    this.init()
  }

  init() {
    if (typeof window === 'undefined') return
    
    this.detectNetworkConditions()
    this.setupPerformanceObserver()
    this.setupAccessibilityTracking()
    this.setupStressLevelMonitoring()
    
    if (this.options.debugMode) {
      this.enableDebugMode()
    }
  }

  // Netzwerkbedingungen erkennen und klassifizieren
  detectNetworkConditions() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (connection) {
      const effectiveType = connection.effectiveType
      const downlink = connection.downlink
      const rtt = connection.rtt
      
      // Klassifizierung basierend auf medizinischen Netzwerk-Standards
      if (rtt > 500 || downlink < 1) {
        this.networkCondition = 'emergency_network'
      } else if (rtt > 300 || (downlink < 2 && effectiveType === '3g')) {
        this.networkCondition = 'mobile_3g'
      } else if (rtt > 100 || (downlink < 5 && effectiveType === '4g')) {
        this.networkCondition = 'hospital_wifi'
      } else {
        this.networkCondition = 'home_broadband'
      }
      
      this.recordMetric('network_condition', {
        condition: this.networkCondition,
        effectiveType,
        downlink,
        rtt,
        medicalNetworkStandards: MEDICAL_NETWORK_CONDITIONS[this.networkCondition]
      })
    }
  }

  // Healthcare Performance Observer Setup
  setupPerformanceObserver() {
    if (!window.PerformanceObserver) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach(entry => {
        this.analyzePerformanceEntry(entry)
      })
    })
    
    // Beobachte verschiedene Performance-Metriken
    const entryTypes = ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
    
    entryTypes.forEach(type => {
      try {
        observer.observe({ entryTypes: [type] })
      } catch (e) {
        // Fallback für ältere Browser
        if (this.options.debugMode) {
          console.warn(`PerformanceObserver type '${type}' not supported`)
        }
      }
    })
  }

  analyzePerformanceEntry(entry) {
    const entryType = entry.entryType
    const name = entry.name
    
    // Healthcare Component Analysis
    if (this.isHealthcareResource(name)) {
      this.analyzeHealthcareComponent(entry)
    }
    
    // Web Vitals Analysis mit Medical Context
    if (entryType === 'largest-contentful-paint') {
      this.analyzeLCP(entry)
    } else if (entryType === 'first-input') {
      this.analyzeFID(entry)
    } else if (entryType === 'layout-shift') {
      this.analyzeCLS(entry)
    } else if (entryType === 'navigation') {
      this.analyzePageLoad(entry)
    }
  }

  isHealthcareResource(resourceName) {
    const healthcareKeywords = [
      'healthcare', 'medical', 'doctor', 'patient', 'emergency',
      'consultation', 'diagnosis', 'treatment', 'prescription',
      'kardiologie', 'onkologie', 'nephrologie'
    ]
    
    return healthcareKeywords.some(keyword => 
      resourceName.toLowerCase().includes(keyword)
    )
  }

  analyzeHealthcareComponent(entry) {
    const componentName = this.extractComponentName(entry.name)
    const loadTime = entry.responseEnd - entry.requestStart
    
    // Bestimme Component-Typ und Standards
    const componentType = this.classifyHealthcareComponent(componentName)
    const standards = HEALTHCARE_PERFORMANCE_STANDARDS[componentType]
    
    const analysis = {
      componentName,
      componentType,
      loadTime,
      standard: standards.componentLoad,
      withinStandard: loadTime <= standards.componentLoad,
      priority: standards.priority,
      networkCondition: this.networkCondition,
      medicalContext: this.currentContext,
      performanceGrade: this.calculatePerformanceGrade(loadTime, standards.componentLoad),
      recommendations: this.generateRecommendations(loadTime, standards, componentType)
    }
    
    this.recordMetric(`healthcare_component_${componentType}`, analysis)
    
    // Kritische Warnungen für Emergency Components
    if (componentType === 'emergency' && !analysis.withinStandard) {
      this.triggerPerformanceAlert({
        level: 'critical',
        message: `Emergency Component '${componentName}' exceeded performance budget`,
        loadTime,
        standard: standards.componentLoad,
        impact: 'Patient safety risk - immediate attention required'
      })
    }
  }

  extractComponentName(resourceUrl) {
    const pathSegments = resourceUrl.split('/')
    const filename = pathSegments[pathSegments.length - 1]
    return filename.split('.')[0] || 'unknown'
  }

  classifyHealthcareComponent(componentName) {
    const classifications = {
      emergency: ['emergency', 'notfall', 'critical', 'urgent'],
      patientForm: ['form', 'input', 'patient', 'data', 'consent'],
      doctorProfile: ['doctor', 'profile', 'arzt', 'physician', 'specialist'],
      accessibility: ['a11y', 'accessibility', 'screen', 'reader', 'contrast']
    }
    
    for (const [type, keywords] of Object.entries(classifications)) {
      if (keywords.some(keyword => componentName.toLowerCase().includes(keyword))) {
        return type
      }
    }
    
    return 'mobile' // Default classification
  }

  calculatePerformanceGrade(actualTime, standardTime) {
    const ratio = actualTime / standardTime
    
    if (ratio <= 0.7) return 'excellent'
    if (ratio <= 1.0) return 'good'
    if (ratio <= 1.5) return 'needs-improvement'
    return 'poor'
  }

  generateRecommendations(actualTime, standards, componentType) {
    const recommendations = []
    const ratio = actualTime / standards.componentLoad
    
    if (ratio > 1.5) {
      recommendations.push('Code-Splitting implementieren für bessere Ladezeiten')
      recommendations.push('Lazy Loading für nicht-kritische Assets')
    }
    
    if (ratio > 1.2 && componentType === 'emergency') {
      recommendations.push('Preloading für Emergency Components aktivieren')
      recommendations.push('Service Worker für Offline-Verfügbarkeit')
    }
    
    if (this.networkCondition === 'mobile_3g' || this.networkCondition === 'emergency_network') {
      recommendations.push('Bundle-Größe optimieren für langsame Netzwerke')
      recommendations.push('Progressive Enhancement implementieren')
    }
    
    return recommendations
  }

  // Largest Contentful Paint Analysis für Medical Content
  analyzeLCP(entry) {
    const lcpTime = entry.startTime
    const medicalContentThreshold = this.currentContext.isEmergency ? 800 : 1500
    
    this.recordMetric('lcp_medical', {
      value: lcpTime,
      threshold: medicalContentThreshold,
      withinStandard: lcpTime <= medicalContentThreshold,
      medicalContext: this.currentContext,
      networkCondition: this.networkCondition,
      contentType: this.identifyContentType(entry.element),
      patientImpact: this.assessPatientImpact(lcpTime, 'content_load')
    })
  }

  // First Input Delay Analysis für Healthcare Interaktionen
  analyzeFID(entry) {
    const fidTime = entry.processingStart - entry.startTime
    const interactionThreshold = this.currentContext.isEmergency ? 50 : 100
    
    this.recordMetric('fid_medical', {
      value: fidTime,
      threshold: interactionThreshold,
      withinStandard: fidTime <= interactionThreshold,
      interactionType: entry.name,
      medicalContext: this.currentContext,
      accessibilityImpact: this.assessAccessibilityImpact(fidTime),
      patientStressImpact: this.assessPatientImpact(fidTime, 'interaction_delay')
    })
  }

  // Cumulative Layout Shift für Medical Reading Experience
  analyzeCLS(entry) {
    if (entry.hadRecentInput) return // Ignore user-initiated layout shifts
    
    const shiftValue = entry.value
    const medicalReadingThreshold = 0.1 // Stricter für medical content
    
    this.recordMetric('cls_medical', {
      value: shiftValue,
      threshold: medicalReadingThreshold,
      withinStandard: shiftValue <= medicalReadingThreshold,
      medicalReadabilityImpact: shiftValue <= 0.05 ? 'minimal' : 'significant',
      affectedElements: this.identifyShiftingElements(entry),
      patientConfidenceImpact: this.assessPatientImpact(shiftValue, 'visual_instability')
    })
  }

  analyzePageLoad(entry) {
    const loadTime = entry.loadEventEnd - entry.navigationStart
    const medicalPageThreshold = this.currentContext.isEmergency ? 2000 : 4000
    
    this.recordMetric('page_load_medical', {
      value: loadTime,
      threshold: medicalPageThreshold,
      withinStandard: loadTime <= medicalPageThreshold,
      navigationTiming: {
        dns: entry.domainLookupEnd - entry.domainLookupStart,
        tcp: entry.connectEnd - entry.connectStart,
        request: entry.responseStart - entry.requestStart,
        response: entry.responseEnd - entry.responseStart,
        dom: entry.domContentLoadedEventEnd - entry.responseEnd
      },
      medicalContext: this.currentContext,
      networkCondition: this.networkCondition
    })
  }

  // Accessibility Performance Tracking
  setupAccessibilityTracking() {
    if (!this.options.enableAccessibilityTracking) return
    
    // Screen Reader Performance
    this.trackScreenReaderPerformance()
    
    // Keyboard Navigation Performance
    this.trackKeyboardNavigation()
    
    // Touch Target Analysis
    this.analyzeTouchTargets()
  }

  trackScreenReaderPerformance() {
    // Monitor ARIA label processing time
    const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby], [role]')
    
    ariaElements.forEach((element, index) => {
      const startTime = performance.now()
      
      // Simulate screen reader processing
      const ariaLabel = element.getAttribute('aria-label')
      const ariaDescribedBy = element.getAttribute('aria-describedby')
      const role = element.getAttribute('role')
      
      const processingTime = performance.now() - startTime
      
      if (index < 10) { // Sample first 10 elements to avoid spam
        this.recordMetric('screen_reader_performance', {
          processingTime,
          threshold: HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.screenReaderLatency,
          withinStandard: processingTime <= HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.screenReaderLatency,
          ariaComplexity: (ariaLabel?.length || 0) + (ariaDescribedBy?.length || 0) + (role?.length || 0),
          elementType: element.tagName.toLowerCase(),
          healthcareContext: this.currentContext.isEmergency ? 'emergency' : 'routine'
        })
      }
    })
  }

  trackKeyboardNavigation() {
    let lastFocusTime = 0
    
    document.addEventListener('focus', (event) => {
      const focusTime = performance.now()
      const focusDelay = lastFocusTime > 0 ? focusTime - lastFocusTime : 0
      
      if (lastFocusTime > 0) {
        this.recordMetric('keyboard_navigation_performance', {
          focusDelay,
          threshold: HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.keyboardNavigation,
          withinStandard: focusDelay <= HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.keyboardNavigation,
          elementType: event.target.tagName.toLowerCase(),
          isHealthcareElement: this.isHealthcareElement(event.target),
          accessibilityPriority: this.getAccessibilityPriority(event.target)
        })
      }
      
      lastFocusTime = focusTime
    })
  }

  analyzeTouchTargets() {
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, textarea, select, a, [tabindex]'
    )
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const targetSize = Math.min(rect.width, rect.height)
      
      const meetsHealthcareStandard = targetSize >= HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.touchTargetSize
      
      this.recordMetric('touch_target_analysis', {
        targetSize,
        standard: HEALTHCARE_PERFORMANCE_STANDARDS.accessibility.touchTargetSize,
        meetsStandard: meetsHealthcareStandard,
        elementType: element.tagName.toLowerCase(),
        isHealthcareElement: this.isHealthcareElement(element),
        isEmergencyElement: element.classList.contains('emergency-') || element.getAttribute('data-emergency') === 'true',
        touchOptimizationGrade: this.getTouchOptimizationGrade(targetSize)
      })
    })
  }

  // Stress Level Monitoring basierend auf Performance
  setupStressLevelMonitoring() {
    if (!this.options.enableStressAnalysis) return
    
    let interactionCount = 0
    let errorCount = 0
    let totalWaitTime = 0
    
    // Monitor user interactions für stress analysis
    ['click', 'touch', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        interactionCount++
        
        const startTime = performance.now()
        
        // Wait for any visual feedback
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime
          totalWaitTime += responseTime
          
          // Calculate stress indicators
          const averageWaitTime = totalWaitTime / interactionCount
          const stressLevel = this.calculateStressLevel(averageWaitTime, errorCount, interactionCount)
          
          if (stressLevel !== this.currentContext.stressLevel) {
            this.currentContext.stressLevel = stressLevel
            
            this.recordMetric('patient_stress_analysis', {
              stressLevel,
              averageWaitTime,
              interactionCount,
              errorCount,
              responseTime,
              stressFactors: this.identifyStressFactors(averageWaitTime, errorCount),
              recommendations: this.generateStressReductionRecommendations(stressLevel)
            })
          }
        })
      })
    })
    
    // Monitor errors that could increase stress
    window.addEventListener('error', () => {
      errorCount++
    })
  }

  calculateStressLevel(averageWaitTime, errorCount, interactionCount) {
    let stressScore = 0
    
    // Wait time stress factor
    if (averageWaitTime > 200) stressScore += 3
    else if (averageWaitTime > 100) stressScore += 2
    else if (averageWaitTime > 50) stressScore += 1
    
    // Error stress factor
    const errorRate = errorCount / Math.max(interactionCount, 1)
    if (errorRate > 0.1) stressScore += 3
    else if (errorRate > 0.05) stressScore += 2
    else if (errorRate > 0.02) stressScore += 1
    
    // Emergency context amplifies stress
    if (this.currentContext.isEmergency) {
      stressScore *= 1.5
    }
    
    if (stressScore >= 5) return 'critical'
    if (stressScore >= 3) return 'elevated'
    if (stressScore >= 1) return 'mild'
    return 'normal'
  }

  // Utility Methods
  identifyContentType(element) {
    if (!element) return 'unknown'
    
    if (element.tagName === 'IMG') return 'medical_image'
    if (element.classList.contains('doctor-')) return 'doctor_profile'
    if (element.classList.contains('emergency-')) return 'emergency_content'
    return 'general_medical_content'
  }

  assessPatientImpact(value, metricType) {
    const impactThresholds = {
      content_load: { low: 1000, moderate: 2000, high: 3000 },
      interaction_delay: { low: 100, moderate: 300, high: 500 },
      visual_instability: { low: 0.05, moderate: 0.1, high: 0.2 }
    }
    
    const thresholds = impactThresholds[metricType]
    if (!thresholds) return 'unknown'
    
    if (value <= thresholds.low) return 'low'
    if (value <= thresholds.moderate) return 'moderate'
    if (value <= thresholds.high) return 'high'
    return 'critical'
  }

  assessAccessibilityImpact(fidTime) {
    if (fidTime <= 50) return 'excellent_a11y'
    if (fidTime <= 100) return 'good_a11y'
    if (fidTime <= 200) return 'poor_a11y'
    return 'critical_a11y'
  }

  identifyShiftingElements(entry) {
    // Simplified - in real implementation would track actual shifting elements
    return ['content-area', 'navigation', 'forms'].filter(() => Math.random() > 0.5)
  }

  isHealthcareElement(element) {
    return element.classList.toString().includes('healthcare-') ||
           element.getAttribute('data-medical') === 'true' ||
           ['doctor-', 'patient-', 'medical-', 'emergency-'].some(prefix => 
             element.classList.toString().includes(prefix)
           )
  }

  getAccessibilityPriority(element) {
    if (element.classList.contains('emergency-')) return 'critical'
    if (element.getAttribute('role') === 'button') return 'high'
    if (element.tagName === 'INPUT') return 'high'
    return 'medium'
  }

  getTouchOptimizationGrade(targetSize) {
    if (targetSize >= 64) return 'excellent' // Emergency standard
    if (targetSize >= 56) return 'good'      // Healthcare standard
    if (targetSize >= 44) return 'minimal'   // WCAG minimum
    return 'inadequate'
  }

  identifyStressFactors(averageWaitTime, errorCount) {
    const factors = []
    
    if (averageWaitTime > 200) factors.push('slow_response_times')
    if (errorCount > 0) factors.push('technical_errors')
    if (this.networkCondition === 'emergency_network') factors.push('poor_network_conditions')
    if (this.currentContext.isEmergency) factors.push('emergency_context_pressure')
    
    return factors
  }

  generateStressReductionRecommendations(stressLevel) {
    const recommendations = {
      critical: [
        'Immediate performance optimization required',
        'Enable offline functionality for critical features',
        'Add loading states and progress indicators',
        'Implement error recovery mechanisms'
      ],
      elevated: [
        'Optimize component loading times',
        'Improve error messaging and guidance',
        'Add reassuring visual feedback'
      ],
      mild: [
        'Monitor performance trends',
        'Consider preloading frequently used components'
      ],
      normal: [
        'Continue monitoring performance metrics'
      ]
    }
    
    return recommendations[stressLevel] || []
  }

  // Alert and Reporting
  triggerPerformanceAlert(alert) {
    this.recordMetric('performance_alert', alert)
    
    if (this.options.debugMode) {
      console.warn('Healthcare Performance Alert:', alert)
    }
    
    // Send to monitoring system
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'healthcare_performance_alert', {
        alert_level: alert.level,
        load_time: alert.loadTime,
        standard: alert.standard,
        impact: alert.impact
      })
    }
  }

  recordMetric(name, data) {
    const metric = {
      name,
      data,
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      networkCondition: this.networkCondition,
      medicalContext: { ...this.currentContext }
    }
    
    this.metrics.set(`${name}_${Date.now()}_${Math.random()}`, metric)
    
    if (this.options.debugMode) {
      console.log('Healthcare Metric:', metric)
    }
  }

  // Update context based on page/component changes
  updateMedicalContext(context) {
    this.currentContext = { ...this.currentContext, ...context }
  }

  // Get healthcare performance dashboard data
  getHealthcareDashboard() {
    const dashboard = {
      overview: this.getOverviewMetrics(),
      emergencyPerformance: this.getEmergencyMetrics(),
      accessibilityPerformance: this.getAccessibilityMetrics(),
      networkAnalysis: this.getNetworkAnalysis(),
      stressAnalysis: this.getStressAnalysis(),
      recommendations: this.getRecommendations()
    }
    
    return dashboard
  }

  getOverviewMetrics() {
    const metrics = Array.from(this.metrics.values())
    
    return {
      totalMetrics: metrics.length,
      performanceGrade: this.calculateOverallGrade(metrics),
      criticalIssues: metrics.filter(m => m.data.priority === 'critical').length,
      networkCondition: this.networkCondition,
      currentStressLevel: this.currentContext.stressLevel
    }
  }

  getEmergencyMetrics() {
    const emergencyMetrics = Array.from(this.metrics.values())
      .filter(m => m.medicalContext?.isEmergency || m.data.componentType === 'emergency')
    
    return {
      emergencyComponentsCount: emergencyMetrics.length,
      averageLoadTime: this.calculateAverage(emergencyMetrics, 'loadTime'),
      withinEmergencyStandards: emergencyMetrics.filter(m => m.data.withinStandard).length,
      criticalAlerts: emergencyMetrics.filter(m => m.data.priority === 'critical').length
    }
  }

  getAccessibilityMetrics() {
    const a11yMetrics = Array.from(this.metrics.values())
      .filter(m => m.name.includes('accessibility') || m.name.includes('screen_reader') || m.name.includes('keyboard'))
    
    return {
      screenReaderPerformance: this.calculateAverage(a11yMetrics.filter(m => m.name.includes('screen_reader')), 'processingTime'),
      keyboardNavigationPerformance: this.calculateAverage(a11yMetrics.filter(m => m.name.includes('keyboard')), 'focusDelay'),
      touchTargetCompliance: this.calculateComplianceRate(a11yMetrics.filter(m => m.name.includes('touch_target')), 'meetsStandard')
    }
  }

  getNetworkAnalysis() {
    return {
      currentCondition: this.networkCondition,
      conditionDetails: MEDICAL_NETWORK_CONDITIONS[this.networkCondition],
      performanceImpact: this.assessNetworkImpact(),
      optimizationSuggestions: this.getNetworkOptimizations()
    }
  }

  getStressAnalysis() {
    const stressMetrics = Array.from(this.metrics.values())
      .filter(m => m.name.includes('stress'))
    
    const latestStress = stressMetrics[stressMetrics.length - 1]
    
    return {
      currentLevel: this.currentContext.stressLevel,
      stressFactors: latestStress?.data.stressFactors || [],
      recommendations: latestStress?.data.recommendations || [],
      trendAnalysis: this.analyzeStressTrend(stressMetrics)
    }
  }

  getRecommendations() {
    const allMetrics = Array.from(this.metrics.values())
    const recommendations = new Set()
    
    allMetrics.forEach(metric => {
      if (metric.data.recommendations) {
        metric.data.recommendations.forEach(rec => recommendations.add(rec))
      }
    })
    
    return Array.from(recommendations).sort((a, b) => {
      // Prioritize emergency and accessibility recommendations
      const aPriority = a.includes('Emergency') || a.includes('Accessibility') ? 1 : 0
      const bPriority = b.includes('Emergency') || b.includes('Accessibility') ? 1 : 0
      return bPriority - aPriority
    })
  }

  calculateOverallGrade(metrics) {
    if (metrics.length === 0) return 'unknown'
    
    const grades = metrics.filter(m => m.data.performanceGrade)
      .map(m => m.data.performanceGrade)
    
    const gradeScores = {
      excellent: 4,
      good: 3,
      'needs-improvement': 2,
      poor: 1
    }
    
    const averageScore = grades.reduce((sum, grade) => sum + (gradeScores[grade] || 0), 0) / grades.length
    
    if (averageScore >= 3.5) return 'excellent'
    if (averageScore >= 2.5) return 'good'
    if (averageScore >= 1.5) return 'needs-improvement'
    return 'poor'
  }

  calculateAverage(metrics, field) {
    const values = metrics.map(m => m.data[field]).filter(v => typeof v === 'number')
    return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0
  }

  calculateComplianceRate(metrics, field) {
    const total = metrics.length
    const compliant = metrics.filter(m => m.data[field] === true).length
    return total > 0 ? (compliant / total) * 100 : 0
  }

  assessNetworkImpact() {
    const condition = MEDICAL_NETWORK_CONDITIONS[this.networkCondition]
    if (!condition) return 'unknown'
    
    if (condition.latency > 400) return 'high'
    if (condition.latency > 200) return 'moderate'
    return 'low'
  }

  getNetworkOptimizations() {
    const optimizations = []
    const condition = MEDICAL_NETWORK_CONDITIONS[this.networkCondition]
    
    if (condition && condition.latency > 300) {
      optimizations.push('Enable aggressive caching for medical content')
      optimizations.push('Implement service worker for offline capability')
    }
    
    if (this.networkCondition === 'mobile_3g' || this.networkCondition === 'emergency_network') {
      optimizations.push('Optimize bundle size for slow networks')
      optimizations.push('Enable progressive loading')
      optimizations.push('Compress images and assets more aggressively')
    }
    
    return optimizations
  }

  analyzeStressTrend(stressMetrics) {
    if (stressMetrics.length < 2) return 'insufficient_data'
    
    const recent = stressMetrics.slice(-5)
    const stressLevels = { normal: 0, mild: 1, elevated: 2, critical: 3 }
    
    const trend = recent.map(m => stressLevels[m.data.stressLevel] || 0)
    const isIncreasing = trend[trend.length - 1] > trend[0]
    const isDecreasing = trend[trend.length - 1] < trend[0]
    
    if (isIncreasing) return 'increasing'
    if (isDecreasing) return 'decreasing'
    return 'stable'
  }

  enableDebugMode() {
    console.log('Healthcare Metrics Debug Mode enabled')
    
    // Add debug panel to page
    const debugPanel = document.createElement('div')
    debugPanel.id = 'healthcare-metrics-debug'
    debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
    `
    
    document.body.appendChild(debugPanel)
    
    // Update debug panel every 2 seconds
    setInterval(() => {
      const dashboard = this.getHealthcareDashboard()
      debugPanel.innerHTML = `
        <h4>Healthcare Metrics Debug</h4>
        <p>Grade: ${dashboard.overview.performanceGrade}</p>
        <p>Network: ${dashboard.networkAnalysis.currentCondition}</p>
        <p>Stress: ${dashboard.stressAnalysis.currentLevel}</p>
        <p>Metrics: ${dashboard.overview.totalMetrics}</p>
        <p>Critical: ${dashboard.overview.criticalIssues}</p>
      `
    }, 2000)
  }

  // Clean up
  destroy() {
    this.metrics.clear()
    
    const debugPanel = document.getElementById('healthcare-metrics-debug')
    if (debugPanel) {
      debugPanel.remove()
    }
  }
}

// Export für verschiedene Umgebungen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HealthcareMetrics,
    HEALTHCARE_PERFORMANCE_STANDARDS,
    MEDICAL_NETWORK_CONDITIONS
  }
} else if (typeof window !== 'undefined') {
  window.HealthcareMetrics = HealthcareMetrics
  window.HEALTHCARE_PERFORMANCE_STANDARDS = HEALTHCARE_PERFORMANCE_STANDARDS
  window.MEDICAL_NETWORK_CONDITIONS = MEDICAL_NETWORK_CONDITIONS
}