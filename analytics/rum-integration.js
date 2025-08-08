/**
 * Real User Monitoring (RUM) Integration für Healthcare Platform
 * Integriert RUM-Daten mit medizinischen Performance-Anforderungen
 * 
 * Features:
 * - Component-level Performance Tracking
 * - User Journey Performance (Patient → Arzt → Emergency)
 * - Network Condition Monitoring (3G, WiFi, Clinical Networks)
 * - Medical Context-Aware RUM Data Collection
 * - Healthcare-specific Performance Insights
 */

// Healthcare User Journey Stages
const HEALTHCARE_USER_JOURNEYS = {
  patient_consultation: {
    stages: [
      'landing', 'specialty_selection', 'doctor_profile', 'appointment_booking', 
      'form_completion', 'payment', 'confirmation'
    ],
    criticalStages: ['specialty_selection', 'appointment_booking'],
    emergencyPath: ['emergency_landing', 'triage', 'immediate_contact'],
    performanceThresholds: {
      stage_transition: 500, // ms
      form_interaction: 200,  // ms
      critical_action: 100   // ms
    }
  },
  
  doctor_workflow: {
    stages: [
      'login', 'dashboard', 'patient_list', 'patient_profile', 
      'diagnosis_entry', 'prescription', 'notes_completion'
    ],
    criticalStages: ['patient_profile', 'diagnosis_entry'],
    mobileOptimized: true,
    performanceThresholds: {
      stage_transition: 300, // ms - doctors need fast workflows
      data_entry: 150,       // ms - medical data entry
      critical_action: 50    // ms - emergency actions
    }
  },
  
  emergency_response: {
    stages: [
      'emergency_detection', 'triage_assessment', 'provider_contact', 
      'emergency_info_display', 'escalation_protocols'
    ],
    criticalStages: ['emergency_detection', 'provider_contact'],
    allStagesCritical: true,
    performanceThresholds: {
      stage_transition: 50,  // ms - every millisecond counts
      emergency_action: 25,  // ms - immediate response needed
      network_timeout: 2000  // ms - emergency network tolerance
    }
  },
  
  accessibility_user: {
    stages: [
      'screen_reader_init', 'navigation_setup', 'content_access', 
      'interaction_completion', 'feedback_provision'
    ],
    criticalStages: ['screen_reader_init', 'content_access'],
    accessibilityFocused: true,
    performanceThresholds: {
      screen_reader_response: 50,   // ms - screen reader lag
      keyboard_navigation: 16,      // ms - keyboard response
      focus_indicator: 0,           // ms - immediate focus
      aria_processing: 100          // ms - ARIA label processing
    }
  }
}

// Healthcare Network Conditions for RUM
const HEALTHCARE_NETWORK_PROFILES = {
  hospital_wifi: {
    name: 'Hospital WiFi',
    expectedBandwidth: '2-10mbps',
    expectedLatency: '100-300ms',
    reliability: 'medium',
    congestionFactor: 'high',
    description: 'Shared hospital network with multiple medical devices'
  },
  
  mobile_healthcare: {
    name: 'Mobile Healthcare 4G/5G',
    expectedBandwidth: '5-50mbps',
    expectedLatency: '50-150ms',
    reliability: 'high',
    congestionFactor: 'medium',
    description: 'Mobile data for healthcare professionals in field'
  },
  
  emergency_3g: {
    name: 'Emergency 3G Network',
    expectedBandwidth: '0.5-3mbps',
    expectedLatency: '200-800ms',
    reliability: 'low',
    congestionFactor: 'high',
    description: 'Fallback network in emergency situations'
  },
  
  telehealth_home: {
    name: 'Patient Home Broadband',
    expectedBandwidth: '10-100mbps',
    expectedLatency: '20-100ms',
    reliability: 'high',
    congestionFactor: 'low',
    description: 'Home internet for telehealth consultations'
  },
  
  clinical_ethernet: {
    name: 'Clinical Wired Network',
    expectedBandwidth: '100mbps+',
    expectedLatency: '10-50ms',
    reliability: 'very_high',
    congestionFactor: 'low',
    description: 'High-speed clinical workstation network'
  }
}

class HealthcareRUMIntegration {
  constructor(options = {}) {
    this.options = {
      enableComponentTracking: true,
      enableJourneyTracking: true,
      enableNetworkMonitoring: true,
      enableAccessibilityRUM: true,
      sampleRate: 1.0, // 100% sampling for healthcare (critical data)
      bufferSize: 1000,
      flushInterval: 5000, // 5 seconds
      debugMode: process.env.NODE_ENV === 'development',
      ...options
    }
    
    this.rumData = new Map()
    this.journeyState = {
      currentJourney: null,
      currentStage: null,
      stageStartTime: null,
      journeyStartTime: null,
      userType: 'patient' // patient, doctor, nurse, emergency_responder
    }
    
    this.networkProfile = null
    this.performanceBuffer = []
    this.componentMetrics = new Map()
    
    this.init()
  }

  init() {
    if (typeof window === 'undefined') return
    
    this.detectNetworkProfile()
    this.initializeRUMCollection()
    this.setupJourneyTracking()
    this.setupComponentTracking()
    this.setupAccessibilityRUM()
    this.startPeriodicFlush()
    
    if (this.options.debugMode) {
      this.enableDebugMode()
    }
  }

  // Network Profile Detection
  detectNetworkProfile() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (connection) {
      const effectiveType = connection.effectiveType
      const downlink = connection.downlink
      const rtt = connection.rtt
      
      // Classify network based on healthcare context
      if (rtt < 50 && downlink > 50) {
        this.networkProfile = HEALTHCARE_NETWORK_PROFILES.clinical_ethernet
      } else if (rtt < 100 && downlink > 10) {
        this.networkProfile = HEALTHCARE_NETWORK_PROFILES.telehealth_home
      } else if (effectiveType === '4g' && downlink > 5) {
        this.networkProfile = HEALTHCARE_NETWORK_PROFILES.mobile_healthcare
      } else if (rtt > 200 || downlink < 2) {
        this.networkProfile = HEALTHCARE_NETWORK_PROFILES.emergency_3g
      } else {
        this.networkProfile = HEALTHCARE_NETWORK_PROFILES.hospital_wifi
      }
    } else {
      this.networkProfile = HEALTHCARE_NETWORK_PROFILES.hospital_wifi // Default assumption
    }
    
    this.recordRUMData('network_profile_detected', {
      profile: this.networkProfile,
      connectionData: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      } : null
    })
  }

  // Journey Tracking
  setupJourneyTracking() {
    if (!this.options.enableJourneyTracking) return
    
    // Detect journey type based on URL and user context
    this.detectUserJourney()
    
    // Track page navigation
    this.setupNavigationTracking()
    
    // Track user interactions within journey
    this.setupInteractionTracking()
  }

  detectUserJourney() {
    const url = window.location.pathname.toLowerCase()
    const searchParams = new URLSearchParams(window.location.search)
    
    // Emergency journey detection
    if (url.includes('emergency') || url.includes('notfall') || searchParams.has('emergency')) {
      this.startJourney('emergency_response', 'emergency_detection')
      return
    }
    
    // Doctor workflow detection
    if (url.includes('doctor') || url.includes('provider') || url.includes('medical-professional')) {
      this.startJourney('doctor_workflow', 'dashboard')
      return
    }
    
    // Accessibility user detection
    if (this.detectAccessibilityUser()) {
      this.startJourney('accessibility_user', 'screen_reader_init')
      return
    }
    
    // Default patient consultation journey
    this.startJourney('patient_consultation', 'landing')
  }

  detectAccessibilityUser() {
    // Detect accessibility features usage
    return (
      window.speechSynthesis && window.speechSynthesis.getVoices().length > 0 ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      window.getComputedStyle(document.body).getPropertyValue('forced-color-adjust') === 'none' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(prefers-contrast: high)').matches
    )
  }

  startJourney(journeyType, initialStage) {
    this.journeyState.currentJourney = journeyType
    this.journeyState.currentStage = initialStage
    this.journeyState.stageStartTime = performance.now()
    this.journeyState.journeyStartTime = performance.now()
    
    const journey = HEALTHCARE_USER_JOURNEYS[journeyType]
    
    this.recordRUMData('journey_started', {
      journeyType,
      initialStage,
      journeyConfig: journey,
      userType: this.journeyState.userType,
      networkProfile: this.networkProfile.name,
      timestamp: Date.now()
    })
  }

  transitionToStage(newStage, context = {}) {
    if (!this.journeyState.currentJourney) return
    
    const stageEndTime = performance.now()
    const stageDuration = stageEndTime - this.journeyState.stageStartTime
    const journey = HEALTHCARE_USER_JOURNEYS[this.journeyState.currentJourney]
    
    // Check if stage transition meets performance thresholds
    const threshold = journey.performanceThresholds.stage_transition
    const isCriticalStage = journey.criticalStages.includes(this.journeyState.currentStage)
    const performanceGrade = this.gradeStagePerformance(stageDuration, threshold, isCriticalStage)
    
    this.recordRUMData('stage_transition', {
      journeyType: this.journeyState.currentJourney,
      fromStage: this.journeyState.currentStage,
      toStage: newStage,
      duration: stageDuration,
      threshold,
      performanceGrade,
      isCriticalStage,
      withinThreshold: stageDuration <= threshold,
      context,
      networkProfile: this.networkProfile.name
    })
    
    // Update journey state
    this.journeyState.currentStage = newStage
    this.journeyState.stageStartTime = stageEndTime
  }

  gradeStagePerformance(duration, threshold, isCritical) {
    const ratio = duration / threshold
    const criticalFactor = isCritical ? 0.7 : 1.0 // Stricter grading for critical stages
    
    if (ratio <= 0.5 * criticalFactor) return 'excellent'
    if (ratio <= 0.8 * criticalFactor) return 'good'
    if (ratio <= 1.0 * criticalFactor) return 'acceptable'
    if (ratio <= 1.5 * criticalFactor) return 'poor'
    return 'critical'
  }

  // Navigation Tracking
  setupNavigationTracking() {
    // Track navigation timing
    window.addEventListener('beforeunload', () => {
      this.flushRUMData() // Ensure data is sent before page unload
    })
    
    // Track page load completion
    window.addEventListener('load', () => {
      this.recordPageLoadMetrics()
    })
    
    // Track SPA navigation
    this.setupSPANavigation()
  }

  recordPageLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (!navigation) return
    
    const loadMetrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domParsing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      resource: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
      total: navigation.loadEventEnd - navigation.navigationStart
    }
    
    // Healthcare-specific analysis
    const healthcareAnalysis = {
      meetsCriticalThreshold: loadMetrics.total <= 2000, // 2s for critical healthcare content
      meetsStandardThreshold: loadMetrics.total <= 4000, // 4s for standard healthcare content
      networkEfficiency: this.assessNetworkEfficiency(loadMetrics),
      bottlenecks: this.identifyLoadBottlenecks(loadMetrics)
    }
    
    this.recordRUMData('page_load_complete', {
      loadMetrics,
      healthcareAnalysis,
      journeyContext: this.journeyState,
      networkProfile: this.networkProfile.name
    })
  }

  assessNetworkEfficiency(loadMetrics) {
    const networkTime = loadMetrics.dns + loadMetrics.tcp + loadMetrics.request
    const totalTime = loadMetrics.total
    const networkRatio = networkTime / totalTime
    
    if (networkRatio > 0.7) return 'poor_network'
    if (networkRatio > 0.4) return 'network_limited'
    return 'good_network'
  }

  identifyLoadBottlenecks(loadMetrics) {
    const bottlenecks = []
    
    if (loadMetrics.dns > 200) bottlenecks.push('dns_slow')
    if (loadMetrics.tcp > 500) bottlenecks.push('tcp_slow')
    if (loadMetrics.request > 1000) bottlenecks.push('server_slow')
    if (loadMetrics.domParsing > 1000) bottlenecks.push('dom_heavy')
    if (loadMetrics.resource > 2000) bottlenecks.push('resources_heavy')
    
    return bottlenecks
  }

  setupSPANavigation() {
    // Monitor History API for SPA navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      this.handleSPANavigation('push', args[2])
    }
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      this.handleSPANavigation('replace', args[2])
    }
    
    window.addEventListener('popstate', (event) => {
      this.handleSPANavigation('pop', window.location.pathname)
    })
  }

  handleSPANavigation(type, url) {
    const navigationStart = performance.now()
    
    // Wait for new content to be rendered
    requestAnimationFrame(() => {
      const navigationEnd = performance.now()
      const duration = navigationEnd - navigationStart
      
      this.recordRUMData('spa_navigation', {
        type,
        url,
        duration,
        journeyContext: this.journeyState,
        performanceGrade: duration <= 200 ? 'excellent' : duration <= 500 ? 'good' : 'poor'
      })
      
      // Check if we need to transition journey stage
      this.checkStageTransition(url)
    })
  }

  checkStageTransition(url) {
    if (!this.journeyState.currentJourney) return
    
    const journey = HEALTHCARE_USER_JOURNEYS[this.journeyState.currentJourney]
    let newStage = null
    
    // Determine new stage based on URL patterns
    if (url.includes('specialty')) newStage = 'specialty_selection'
    else if (url.includes('doctor') || url.includes('provider')) newStage = 'doctor_profile'
    else if (url.includes('appointment') || url.includes('booking')) newStage = 'appointment_booking'
    else if (url.includes('form') || url.includes('information')) newStage = 'form_completion'
    else if (url.includes('payment')) newStage = 'payment'
    else if (url.includes('confirmation')) newStage = 'confirmation'
    
    if (newStage && newStage !== this.journeyState.currentStage) {
      this.transitionToStage(newStage, { triggeredBy: 'spa_navigation', url })
    }
  }

  // Component Performance Tracking
  setupComponentTracking() {
    if (!this.options.enableComponentTracking) return
    
    this.setupComponentObserver()
    this.trackComponentInteractions()
    this.measureComponentPerformance()
  }

  setupComponentObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && this.isHealthcareComponent(node)) {
            this.trackComponentMount(node)
          }
        })
        
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1 && this.isHealthcareComponent(node)) {
            this.trackComponentUnmount(node)
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
    return (
      element.getAttribute('data-component')?.startsWith('healthcare-') ||
      element.className.includes('healthcare-') ||
      element.className.includes('medical-') ||
      element.className.includes('doctor-') ||
      element.className.includes('patient-') ||
      element.className.includes('emergency-')
    )
  }

  trackComponentMount(element) {
    const componentName = this.getComponentName(element)
    const mountStart = performance.now()
    
    // Wait for component to be fully rendered and interactive
    this.waitForComponentReady(element).then(() => {
      const mountEnd = performance.now()
      const mountTime = mountEnd - mountStart
      
      const componentData = {
        componentName,
        mountTime,
        isEmergency: this.isEmergencyComponent(element),
        isAccessibilityOptimized: this.hasA11yFeatures(element),
        isTouchOptimized: this.isTouchOptimized(element),
        position: this.getElementPosition(element),
        visibility: this.getElementVisibility(element)
      }
      
      this.recordRUMData('component_mount', {
        ...componentData,
        journeyContext: this.journeyState,
        performanceGrade: this.gradeComponentPerformance(componentName, mountTime)
      })
      
      // Store component metrics for aggregation
      this.componentMetrics.set(element, {
        name: componentName,
        mountTime: mountStart,
        readyTime: mountEnd,
        interactions: 0
      })
    })
  }

  async waitForComponentReady(element) {
    // Wait for any images to load
    const images = element.querySelectorAll('img')
    if (images.length > 0) {
      await Promise.allSettled(
        Array.from(images).map(img => 
          img.complete ? Promise.resolve() : new Promise(resolve => {
            img.onload = img.onerror = resolve
          })
        )
      )
    }
    
    // Wait for any animations to complete
    if (element.getAnimations) {
      const animations = element.getAnimations()
      if (animations.length > 0) {
        await Promise.allSettled(animations.map(anim => anim.finished))
      }
    }
    
    // Ensure element is visible and interactive
    return new Promise(resolve => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.disconnect()
            resolve()
          }
        })
      })
      
      observer.observe(element)
      
      // Timeout after 5 seconds
      setTimeout(() => {
        observer.disconnect()
        resolve()
      }, 5000)
    })
  }

  getComponentName(element) {
    return (
      element.getAttribute('data-component') ||
      element.className.split(' ').find(cls => cls.startsWith('healthcare-')) ||
      element.tagName.toLowerCase() + '-component'
    )
  }

  isEmergencyComponent(element) {
    return (
      element.className.includes('emergency-') ||
      element.getAttribute('data-emergency') === 'true' ||
      element.getAttribute('aria-label')?.toLowerCase().includes('emergency') ||
      element.getAttribute('aria-label')?.toLowerCase().includes('notfall')
    )
  }

  hasA11yFeatures(element) {
    return (
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-describedby') ||
      element.hasAttribute('role') ||
      element.hasAttribute('tabindex') ||
      element.querySelector('[aria-label], [aria-describedby], [role]') !== null
    )
  }

  isTouchOptimized(element) {
    const rect = element.getBoundingClientRect()
    return rect.width >= 44 && rect.height >= 44 // WCAG minimum
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      inViewport: (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      )
    }
  }

  getElementVisibility(element) {
    const style = window.getComputedStyle(element)
    return {
      visible: style.visibility === 'visible' && style.display !== 'none',
      opacity: parseFloat(style.opacity),
      zIndex: parseInt(style.zIndex) || 0
    }
  }

  gradeComponentPerformance(componentName, mountTime) {
    const thresholds = {
      emergency: { excellent: 50, good: 100, acceptable: 150 },
      form: { excellent: 100, good: 200, acceptable: 350 },
      profile: { excellent: 150, good: 300, acceptable: 500 },
      default: { excellent: 200, good: 400, acceptable: 600 }
    }
    
    let threshold = thresholds.default
    if (componentName.includes('emergency')) threshold = thresholds.emergency
    else if (componentName.includes('form')) threshold = thresholds.form
    else if (componentName.includes('profile')) threshold = thresholds.profile
    
    if (mountTime <= threshold.excellent) return 'excellent'
    if (mountTime <= threshold.good) return 'good'
    if (mountTime <= threshold.acceptable) return 'acceptable'
    return 'poor'
  }

  trackComponentUnmount(element) {
    const metrics = this.componentMetrics.get(element)
    if (metrics) {
      const lifetime = performance.now() - metrics.mountTime
      
      this.recordRUMData('component_unmount', {
        componentName: metrics.name,
        lifetime,
        interactions: metrics.interactions,
        interactionRate: metrics.interactions / (lifetime / 1000),
        journeyContext: this.journeyState
      })
      
      this.componentMetrics.delete(element)
    }
  }

  trackComponentInteractions() {
    ['click', 'focus', 'input', 'change'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        if (this.isHealthcareComponent(event.target)) {
          this.recordComponentInteraction(event.target, eventType, event)
        }
      })
    })
  }

  recordComponentInteraction(element, interactionType, event) {
    const componentName = this.getComponentName(element)
    const interactionTime = performance.now()
    
    // Update component metrics
    const metrics = this.componentMetrics.get(element)
    if (metrics) {
      metrics.interactions++
    }
    
    // Measure interaction response time
    requestAnimationFrame(() => {
      const responseTime = performance.now() - interactionTime
      
      this.recordRUMData('component_interaction', {
        componentName,
        interactionType,
        responseTime,
        journeyContext: this.journeyState,
        isEmergencyContext: this.isEmergencyComponent(element),
        performanceGrade: responseTime <= 16 ? 'excellent' : 
                         responseTime <= 50 ? 'good' : 
                         responseTime <= 100 ? 'acceptable' : 'poor',
        eventDetails: this.extractEventDetails(event)
      })
    })
  }

  extractEventDetails(event) {
    return {
      type: event.type,
      isTrusted: event.isTrusted,
      timeStamp: event.timeStamp,
      target: {
        tagName: event.target.tagName,
        type: event.target.type,
        id: event.target.id,
        className: event.target.className
      }
    }
  }

  measureComponentPerformance() {
    // Measure component rendering performance using Performance Observer
    if (!window.PerformanceObserver) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.name.startsWith('healthcare-')) {
          this.recordRUMData('component_performance_measure', {
            measureName: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            journeyContext: this.journeyState
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure'] })
  }

  // Accessibility RUM
  setupAccessibilityRUM() {
    if (!this.options.enableAccessibilityRUM) return
    
    this.trackScreenReaderUsage()
    this.trackKeyboardNavigation()
    this.trackFocusManagement()
    this.trackContrastPreferences()
  }

  trackScreenReaderUsage() {
    // Detect screen reader usage patterns
    let ariaLiveRegionUpdates = 0
    
    // Monitor ARIA live region updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.hasAttribute('aria-live')) {
          ariaLiveRegionUpdates++
          
          this.recordRUMData('screen_reader_activity', {
            type: 'aria_live_update',
            element: mutation.target.tagName,
            ariaLive: mutation.target.getAttribute('aria-live'),
            updateCount: ariaLiveRegionUpdates,
            journeyContext: this.journeyState
          })
        }
      })
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  trackKeyboardNavigation() {
    let tabSequence = []
    let tabStartTime = 0
    
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (tabSequence.length === 0) {
          tabStartTime = performance.now()
        }
        
        tabSequence.push({
          element: event.target,
          timestamp: performance.now()
        })
        
        // Analyze tab sequence after a pause
        clearTimeout(this.tabAnalysisTimer)
        this.tabAnalysisTimer = setTimeout(() => {
          this.analyzeTabSequence(tabSequence, tabStartTime)
          tabSequence = []
        }, 2000)
      }
    })
  }

  analyzeTabSequence(sequence, startTime) {
    if (sequence.length < 2) return
    
    const totalTime = sequence[sequence.length - 1].timestamp - startTime
    const averageTabTime = totalTime / (sequence.length - 1)
    
    // Identify healthcare components in tab sequence
    const healthcareComponents = sequence.filter(item => 
      this.isHealthcareComponent(item.element)
    )
    
    this.recordRUMData('keyboard_navigation_sequence', {
      totalElements: sequence.length,
      healthcareElements: healthcareComponents.length,
      totalTime,
      averageTabTime,
      navigationEfficiency: healthcareComponents.length / sequence.length,
      journeyContext: this.journeyState,
      performanceGrade: averageTabTime <= 16 ? 'excellent' : 
                       averageTabTime <= 50 ? 'good' : 'poor'
    })
  }

  trackFocusManagement() {
    let focusHistory = []
    
    document.addEventListener('focus', (event) => {
      const focusTime = performance.now()
      const previousFocus = focusHistory[focusHistory.length - 1]
      
      if (previousFocus) {
        const focusDelay = focusTime - previousFocus.timestamp
        
        this.recordRUMData('focus_transition', {
          fromElement: this.getElementDetails(previousFocus.element),
          toElement: this.getElementDetails(event.target),
          focusDelay,
          isHealthcareElement: this.isHealthcareComponent(event.target),
          journeyContext: this.journeyState,
          performanceGrade: focusDelay <= 16 ? 'excellent' : 
                           focusDelay <= 50 ? 'good' : 'poor'
        })
      }
      
      focusHistory.push({
        element: event.target,
        timestamp: focusTime
      })
      
      // Keep only recent focus history
      if (focusHistory.length > 10) {
        focusHistory = focusHistory.slice(-10)
      }
    })
  }

  getElementDetails(element) {
    return {
      tagName: element.tagName,
      type: element.type,
      id: element.id,
      className: element.className,
      ariaLabel: element.getAttribute('aria-label'),
      role: element.getAttribute('role')
    }
  }

  trackContrastPreferences() {
    // Track high contrast mode usage
    const highContrastMedia = window.matchMedia('(prefers-contrast: high)')
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const trackPreference = () => {
      this.recordRUMData('accessibility_preferences', {
        highContrast: highContrastMedia.matches,
        reducedMotion: reducedMotionMedia.matches,
        forcedColors: window.matchMedia('(forced-colors: active)').matches,
        journeyContext: this.journeyState
      })
    }
    
    trackPreference()
    highContrastMedia.addListener(trackPreference)
    reducedMotionMedia.addListener(trackPreference)
  }

  // RUM Data Management
  recordRUMData(eventName, data) {
    const rumEntry = {
      id: `rum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventName,
      data,
      timestamp: Date.now(),
      performanceNow: performance.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      networkProfile: this.networkProfile?.name,
      journeyState: { ...this.journeyState }
    }
    
    // Store in buffer
    this.performanceBuffer.push(rumEntry)
    
    // Store in map for immediate access
    this.rumData.set(rumEntry.id, rumEntry)
    
    if (this.options.debugMode) {
      console.log('Healthcare RUM:', eventName, data)
    }
    
    // Auto-flush if buffer is getting full
    if (this.performanceBuffer.length >= this.options.bufferSize * 0.8) {
      this.flushRUMData()
    }
  }

  startPeriodicFlush() {
    setInterval(() => {
      this.flushRUMData()
    }, this.options.flushInterval)
  }

  flushRUMData() {
    if (this.performanceBuffer.length === 0) return
    
    const dataToFlush = [...this.performanceBuffer]
    this.performanceBuffer = []
    
    // Send data to analytics endpoint
    this.sendRUMData(dataToFlush)
  }

  sendRUMData(data) {
    // Send to Google Analytics if available
    if (typeof window.gtag === 'function') {
      data.forEach(entry => {
        window.gtag('event', 'healthcare_rum', {
          event_name: entry.eventName,
          rum_data: JSON.stringify(entry.data),
          journey_type: entry.journeyState.currentJourney,
          network_profile: entry.networkProfile
        })
      })
    }
    
    // Send to custom analytics endpoint
    if (typeof window.fetch === 'function') {
      fetch('/api/analytics/rum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entries: data,
          metadata: {
            sessionId: this.getSessionId(),
            userType: this.journeyState.userType,
            timestamp: Date.now()
          }
        })
      }).catch(error => {
        if (this.options.debugMode) {
          console.error('Failed to send RUM data:', error)
        }
      })
    }
    
    if (this.options.debugMode) {
      console.log('Flushed RUM data:', data.length, 'entries')
    }
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    return this.sessionId
  }

  // Analytics and Reporting
  getHealthcareRUMSummary() {
    const summary = {
      journey: this.getJourneySummary(),
      components: this.getComponentsSummary(),
      accessibility: this.getAccessibilitySummary(),
      network: this.getNetworkSummary(),
      performance: this.getPerformanceSummary()
    }
    
    return summary
  }

  getJourneySummary() {
    const journeyEntries = Array.from(this.rumData.values())
      .filter(entry => entry.eventName.includes('journey') || entry.eventName.includes('stage'))
    
    return {
      currentJourney: this.journeyState.currentJourney,
      currentStage: this.journeyState.currentStage,
      journeyDuration: this.journeyState.journeyStartTime ? 
        performance.now() - this.journeyState.journeyStartTime : 0,
      stageTransitions: journeyEntries.filter(entry => entry.eventName === 'stage_transition').length,
      averageStageTime: this.calculateAverageStageTime(journeyEntries)
    }
  }

  calculateAverageStageTime(journeyEntries) {
    const transitions = journeyEntries.filter(entry => entry.eventName === 'stage_transition')
    if (transitions.length === 0) return 0
    
    const totalDuration = transitions.reduce((sum, entry) => sum + entry.data.duration, 0)
    return totalDuration / transitions.length
  }

  getComponentsSummary() {
    const componentEntries = Array.from(this.rumData.values())
      .filter(entry => entry.eventName.includes('component'))
    
    const mountEntries = componentEntries.filter(entry => entry.eventName === 'component_mount')
    const interactionEntries = componentEntries.filter(entry => entry.eventName === 'component_interaction')
    
    return {
      totalComponents: mountEntries.length,
      averageMountTime: this.calculateAverageMountTime(mountEntries),
      totalInteractions: interactionEntries.length,
      averageInteractionTime: this.calculateAverageInteractionTime(interactionEntries),
      emergencyComponents: mountEntries.filter(entry => entry.data.isEmergency).length,
      accessibilityOptimizedComponents: mountEntries.filter(entry => entry.data.isAccessibilityOptimized).length
    }
  }

  calculateAverageMountTime(mountEntries) {
    if (mountEntries.length === 0) return 0
    const totalTime = mountEntries.reduce((sum, entry) => sum + entry.data.mountTime, 0)
    return totalTime / mountEntries.length
  }

  calculateAverageInteractionTime(interactionEntries) {
    if (interactionEntries.length === 0) return 0
    const totalTime = interactionEntries.reduce((sum, entry) => sum + entry.data.responseTime, 0)
    return totalTime / interactionEntries.length
  }

  getAccessibilitySummary() {
    const a11yEntries = Array.from(this.rumData.values())
      .filter(entry => entry.eventName.includes('screen_reader') || 
                      entry.eventName.includes('keyboard') ||
                      entry.eventName.includes('focus'))
    
    return {
      screenReaderActivities: a11yEntries.filter(entry => entry.eventName.includes('screen_reader')).length,
      keyboardNavigations: a11yEntries.filter(entry => entry.eventName.includes('keyboard')).length,
      focusTransitions: a11yEntries.filter(entry => entry.eventName === 'focus_transition').length,
      accessibilityUser: this.journeyState.currentJourney === 'accessibility_user'
    }
  }

  getNetworkSummary() {
    return {
      currentProfile: this.networkProfile,
      connection: this.getConnectionInfo()
    }
  }

  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : null
  }

  getPerformanceSummary() {
    const perfEntries = Array.from(this.rumData.values())
    
    return {
      totalRUMEntries: this.rumData.size,
      bufferSize: this.performanceBuffer.length,
      averageEventRate: this.calculateEventRate(),
      networkEfficiencyScore: this.calculateNetworkEfficiency(),
      performanceGrades: this.aggregatePerformanceGrades(perfEntries)
    }
  }

  calculateEventRate() {
    if (this.rumData.size === 0 || !this.journeyState.journeyStartTime) return 0
    const journeyDuration = performance.now() - this.journeyState.journeyStartTime
    return (this.rumData.size / journeyDuration) * 1000 // events per second
  }

  calculateNetworkEfficiency() {
    // Simplified network efficiency calculation
    const profile = this.networkProfile
    if (!profile) return 0
    
    const efficiencyMap = {
      'Clinical Wired Network': 95,
      'Patient Home Broadband': 85,
      'Mobile Healthcare 4G/5G': 75,
      'Hospital WiFi': 60,
      'Emergency 3G Network': 30
    }
    
    return efficiencyMap[profile.name] || 50
  }

  aggregatePerformanceGrades(entries) {
    const grades = { excellent: 0, good: 0, acceptable: 0, poor: 0 }
    
    entries.forEach(entry => {
      if (entry.data.performanceGrade) {
        grades[entry.data.performanceGrade]++
      }
    })
    
    return grades
  }

  // Debug Mode
  enableDebugMode() {
    console.log('Healthcare RUM Debug Mode enabled')
    
    // Add debug panel
    this.createDebugPanel()
    
    // Log RUM events
    const originalRecord = this.recordRUMData.bind(this)
    this.recordRUMData = (eventName, data) => {
      console.group(`Healthcare RUM: ${eventName}`)
      console.log('Data:', data)
      console.log('Journey:', this.journeyState)
      console.log('Network:', this.networkProfile?.name)
      console.groupEnd()
      
      return originalRecord(eventName, data)
    }
  }

  createDebugPanel() {
    const panel = document.createElement('div')
    panel.id = 'healthcare-rum-debug'
    panel.style.cssText = `
      position: fixed;
      top: 50px;
      left: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 11px;
      z-index: 10000;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
    `
    
    document.body.appendChild(panel)
    
    // Update panel every 3 seconds
    setInterval(() => {
      const summary = this.getHealthcareRUMSummary()
      panel.innerHTML = `
        <h4 style="margin-top: 0;">Healthcare RUM Debug</h4>
        <p><strong>Journey:</strong> ${summary.journey.currentJourney || 'None'}</p>
        <p><strong>Stage:</strong> ${summary.journey.currentStage || 'None'}</p>
        <p><strong>Network:</strong> ${this.networkProfile?.name || 'Unknown'}</p>
        <p><strong>Components:</strong> ${summary.components.totalComponents}</p>
        <p><strong>Interactions:</strong> ${summary.components.totalInteractions}</p>
        <p><strong>RUM Entries:</strong> ${this.rumData.size}</p>
        <p><strong>Buffer:</strong> ${this.performanceBuffer.length}</p>
        <p><strong>A11y Activities:</strong> ${summary.accessibility.screenReaderActivities + summary.accessibility.keyboardNavigations}</p>
        <button onclick="console.log(window.healthcareRUM.getHealthcareRUMSummary())" 
                style="margin-top: 10px; padding: 5px; background: #333; color: white; border: none; cursor: pointer;">
          Log Summary
        </button>
        <button onclick="window.healthcareRUM.flushRUMData()" 
                style="margin-left: 5px; padding: 5px; background: #333; color: white; border: none; cursor: pointer;">
          Flush Data
        </button>
      `
    }, 3000)
  }

  // Cleanup
  destroy() {
    // Clear timers
    clearTimeout(this.tabAnalysisTimer)
    
    // Flush remaining data
    this.flushRUMData()
    
    // Clear data structures
    this.rumData.clear()
    this.componentMetrics.clear()
    this.performanceBuffer = []
    
    // Remove debug panel
    const debugPanel = document.getElementById('healthcare-rum-debug')
    if (debugPanel) {
      debugPanel.remove()
    }
  }
}

// Export for various environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HealthcareRUMIntegration,
    HEALTHCARE_USER_JOURNEYS,
    HEALTHCARE_NETWORK_PROFILES
  }
} else if (typeof window !== 'undefined') {
  window.HealthcareRUMIntegration = HealthcareRUMIntegration
  window.HEALTHCARE_USER_JOURNEYS = HEALTHCARE_USER_JOURNEYS
  window.HEALTHCARE_NETWORK_PROFILES = HEALTHCARE_NETWORK_PROFILES
  
  // Auto-initialize
  window.addEventListener('DOMContentLoaded', () => {
    window.healthcareRUM = new HealthcareRUMIntegration()
    
    // Signal that RUM is ready
    window.dispatchEvent(new CustomEvent('healthcareRUMReady', {
      detail: { rumSystem: window.healthcareRUM }
    }))
    
    console.log('Healthcare RUM Integration initialized')
  })
}