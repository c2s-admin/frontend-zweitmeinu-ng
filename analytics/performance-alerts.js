/**
 * Healthcare Performance Alert System
 * Medizinisches Alert-System für Performance-Probleme mit Patient Safety Focus
 * 
 * Features:
 * - Critical Alerts für Emergency Components
 * - Performance Degradation Detection
 * - Healthcare SLA Monitoring (Medical Response Times)
 * - Automated Performance Incident Response
 * - Patient Safety Risk Assessment
 * - Medical Professional Workflow Impact Analysis
 */

// Healthcare Alert Severity Levels
const HEALTHCARE_ALERT_LEVELS = {
  CRITICAL: {
    level: 'critical',
    priority: 1,
    color: '#dc2626', // Red - immediate attention
    description: 'Patient safety risk - immediate intervention required',
    responseTime: 0, // Immediate
    escalation: ['development_team', 'medical_director', 'cto']
  },
  HIGH: {
    level: 'high',
    priority: 2,
    color: '#f59e0b', // Amber - urgent attention
    description: 'Medical workflow impact - attention required within 1 hour',
    responseTime: 3600, // 1 hour
    escalation: ['development_team', 'product_manager']
  },
  MEDIUM: {
    level: 'medium',
    priority: 3,
    color: '#3b82f6', // Blue - planned attention
    description: 'Performance degradation - address within 24 hours',
    responseTime: 86400, // 24 hours
    escalation: ['development_team']
  },
  LOW: {
    level: 'low',
    priority: 4,
    color: '#10b981', // Green - monitoring
    description: 'Performance monitoring - track trends',
    responseTime: 604800, // 1 week
    escalation: []
  }
}

// Medical Context Alert Rules
const MEDICAL_ALERT_RULES = {
  // Emergency Component Performance
  emergency_component: {
    load_time_critical: {
      threshold: 100, // ms
      level: 'critical',
      message: 'Emergency component load time exceeds critical threshold',
      impact: 'Patient safety risk - delayed emergency response',
      actions: ['immediate_optimization', 'fallback_activation', 'incident_report']
    },
    load_time_high: {
      threshold: 150, // ms
      level: 'high',
      message: 'Emergency component performance degraded',
      impact: 'Emergency workflow impacted',
      actions: ['performance_review', 'optimization_planning']
    }
  },
  
  // Patient Form Performance
  patient_form: {
    response_time_critical: {
      threshold: 500, // ms
      level: 'high',
      message: 'Patient form response time too slow',
      impact: 'Patient data collection impacted - may affect diagnosis',
      actions: ['form_optimization', 'ux_review']
    },
    validation_lag: {
      threshold: 200, // ms
      level: 'medium',
      message: 'Form validation response delayed',
      impact: 'Patient experience degraded',
      actions: ['validation_optimization']
    }
  },
  
  // Accessibility Performance
  accessibility: {
    screen_reader_lag: {
      threshold: 100, // ms
      level: 'high',
      message: 'Screen reader response time exceeds accessibility standards',
      impact: 'Accessibility compliance violated - legal risk',
      actions: ['accessibility_audit', 'immediate_fix']
    },
    touch_target_violation: {
      threshold: 44, // px minimum
      level: 'medium',
      message: 'Touch targets below accessibility standards',
      impact: 'Mobile healthcare users affected',
      actions: ['ui_review', 'touch_optimization']
    }
  },
  
  // Doctor Profile Performance
  doctor_profile: {
    load_time_degraded: {
      threshold: 500, // ms
      level: 'medium',
      message: 'Doctor profile loading slowly',
      impact: 'Patient trust and selection process impacted',
      actions: ['profile_optimization', 'image_optimization']
    }
  },
  
  // Medical Search Performance
  medical_search: {
    response_lag: {
      threshold: 400, // ms
      level: 'medium',
      message: 'Medical search response too slow',
      impact: 'Healthcare professional workflow impacted',
      actions: ['search_optimization', 'caching_review']
    }
  },
  
  // Network and Infrastructure
  network_performance: {
    emergency_network_failure: {
      threshold: 5000, // ms timeout
      level: 'critical',
      message: 'Emergency network conditions causing failures',
      impact: 'Critical medical communications at risk',
      actions: ['network_escalation', 'offline_fallback', 'emergency_protocols']
    },
    mobile_3g_degradation: {
      threshold: 3000, // ms
      level: 'high',
      message: 'Mobile healthcare performance severely impacted',
      impact: 'Mobile medical professionals affected',
      actions: ['mobile_optimization', 'progressive_loading']
    }
  }
}

class HealthcarePerformanceAlerts {
  constructor(options = {}) {
    this.options = {
      enableRealTimeAlerts: true,
      enableAutomatedResponse: true,
      enableEscalation: true,
      debugMode: process.env.NODE_ENV === 'development',
      alertHistoryLimit: 1000,
      ...options
    }
    
    this.alertHistory = new Map()
    this.activeAlerts = new Map()
    this.alertCallbacks = new Map()
    this.escalationTimers = new Map()
    
    this.init()
  }

  init() {
    if (typeof window === 'undefined') return
    
    this.setupPerformanceMonitoring()
    this.setupAlertProcessing()
    this.initializeAlertUI()
    
    if (this.options.debugMode) {
      this.enableDebugMode()
    }
  }

  setupPerformanceMonitoring() {
    // Connect to healthcare metrics system
    if (window.healthcareMetrics) {
      this.connectToMetrics(window.healthcareMetrics)
    } else {
      // Wait for metrics system to initialize
      window.addEventListener('healthcareMetricsReady', (event) => {
        this.connectToMetrics(event.detail.metricsSystem)
      })
    }
  }

  connectToMetrics(metricsSystem) {
    // Listen for metric updates
    metricsSystem.onMetricRecorded = (metric) => {
      this.evaluateMetricForAlerts(metric)
    }
  }

  evaluateMetricForAlerts(metric) {
    const alertRules = this.getRelevantAlertRules(metric)
    
    alertRules.forEach(rule => {
      const alert = this.checkAlertRule(metric, rule)
      if (alert) {
        this.triggerAlert(alert)
      }
    })
  }

  getRelevantAlertRules(metric) {
    const rules = []
    const metricName = metric.name
    const metricData = metric.data
    
    // Emergency Component Rules
    if (metricData.componentType === 'emergency' || metricName.includes('emergency')) {
      rules.push(MEDICAL_ALERT_RULES.emergency_component.load_time_critical)
      rules.push(MEDICAL_ALERT_RULES.emergency_component.load_time_high)
    }
    
    // Patient Form Rules
    if (metricData.componentType === 'patientForm' || metricName.includes('form')) {
      rules.push(MEDICAL_ALERT_RULES.patient_form.response_time_critical)
      rules.push(MEDICAL_ALERT_RULES.patient_form.validation_lag)
    }
    
    // Accessibility Rules
    if (metricName.includes('screen_reader') || metricName.includes('accessibility')) {
      rules.push(MEDICAL_ALERT_RULES.accessibility.screen_reader_lag)
    }
    
    if (metricName.includes('touch_target')) {
      rules.push(MEDICAL_ALERT_RULES.accessibility.touch_target_violation)
    }
    
    // Doctor Profile Rules
    if (metricData.componentType === 'doctorProfile' || metricName.includes('doctor')) {
      rules.push(MEDICAL_ALERT_RULES.doctor_profile.load_time_degraded)
    }
    
    // Network Performance Rules
    if (metricName.includes('network') || metricData.networkCondition) {
      rules.push(MEDICAL_ALERT_RULES.network_performance.emergency_network_failure)
      rules.push(MEDICAL_ALERT_RULES.network_performance.mobile_3g_degradation)
    }
    
    return rules
  }

  checkAlertRule(metric, rule) {
    const metricValue = this.extractMetricValue(metric, rule)
    const threshold = rule.threshold
    
    // Different comparison logic based on rule type
    let ruleViolated = false
    
    if (rule.message.includes('exceeds') || rule.message.includes('slow')) {
      ruleViolated = metricValue > threshold
    } else if (rule.message.includes('below')) {
      ruleViolated = metricValue < threshold
    } else if (rule.message.includes('failure')) {
      ruleViolated = metricValue > threshold || metric.data.error === true
    }
    
    if (ruleViolated) {
      return this.createAlert(metric, rule, metricValue)
    }
    
    return null
  }

  extractMetricValue(metric, rule) {
    // Extract the relevant value from the metric based on rule type
    if (rule.message.includes('load time') || rule.message.includes('response time')) {
      return metric.data.loadTime || metric.data.duration || metric.data.value || 0
    }
    
    if (rule.message.includes('touch target')) {
      return metric.data.targetSize || 0
    }
    
    if (rule.message.includes('screen reader')) {
      return metric.data.processingTime || 0
    }
    
    return metric.data.value || 0
  }

  createAlert(metric, rule, metricValue) {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const alert = {
      id: alertId,
      level: HEALTHCARE_ALERT_LEVELS[rule.level.toUpperCase()],
      rule: rule,
      metric: metric,
      metricValue: metricValue,
      threshold: rule.threshold,
      timestamp: Date.now(),
      url: window.location.pathname,
      
      // Medical context
      medicalContext: metric.medicalContext || {},
      patientSafetyRisk: this.assessPatientSafetyRisk(rule, metricValue),
      workflowImpact: this.assessWorkflowImpact(rule, metric),
      
      // Alert metadata
      message: rule.message,
      impact: rule.impact,
      actions: rule.actions,
      acknowledged: false,
      resolved: false,
      escalated: false,
      
      // Response tracking
      responseDeadline: Date.now() + (HEALTHCARE_ALERT_LEVELS[rule.level.toUpperCase()].responseTime * 1000),
      escalationRequired: HEALTHCARE_ALERT_LEVELS[rule.level.toUpperCase()].escalation.length > 0
    }
    
    return alert
  }

  assessPatientSafetyRisk(rule, metricValue) {
    const riskFactors = {
      emergency_components: 3,
      accessibility_violations: 2,
      form_performance: 1,
      network_failures: 3
    }
    
    let riskScore = 0
    
    if (rule.message.includes('Emergency')) riskScore += riskFactors.emergency_components
    if (rule.message.includes('accessibility')) riskScore += riskFactors.accessibility_violations
    if (rule.message.includes('form')) riskScore += riskFactors.form_performance
    if (rule.message.includes('network')) riskScore += riskFactors.network_failures
    
    // Factor in how much the threshold is exceeded
    const exceedanceRatio = metricValue / rule.threshold
    riskScore *= exceedanceRatio
    
    if (riskScore >= 6) return 'critical'
    if (riskScore >= 4) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }

  assessWorkflowImpact(rule, metric) {
    const impact = {
      userTypes: [],
      medicalProcesses: [],
      severityLevel: 'low'
    }
    
    // Determine affected user types
    if (rule.message.includes('Emergency')) {
      impact.userTypes.push('emergency_responders', 'patients', 'triage_nurses')
      impact.severityLevel = 'critical'
    }
    
    if (rule.message.includes('form')) {
      impact.userTypes.push('patients', 'intake_staff')
      impact.medicalProcesses.push('data_collection', 'medical_history')
    }
    
    if (rule.message.includes('doctor profile')) {
      impact.userTypes.push('patients', 'referring_physicians')
      impact.medicalProcesses.push('provider_selection', 'appointment_scheduling')
    }
    
    if (rule.message.includes('accessibility')) {
      impact.userTypes.push('accessibility_users', 'elderly_patients')
      impact.severityLevel = 'high' // Accessibility is critical for inclusive care
    }
    
    return impact
  }

  triggerAlert(alert) {
    // Check for duplicate alerts (alert throttling)
    if (this.isDuplicateAlert(alert)) {
      this.updateExistingAlert(alert)
      return
    }
    
    // Store alert
    this.activeAlerts.set(alert.id, alert)
    this.recordAlertHistory(alert)
    
    // Process alert based on level
    this.processAlert(alert)
    
    // Setup escalation if required
    if (alert.escalationRequired) {
      this.scheduleEscalation(alert)
    }
    
    // Notify alert callbacks
    this.notifyAlertCallbacks(alert)
    
    if (this.options.debugMode) {
      console.warn(`Healthcare Alert [${alert.level.level.toUpperCase()}]:`, alert.message, alert)
    }
  }

  isDuplicateAlert(newAlert) {
    const similarAlerts = Array.from(this.activeAlerts.values())
      .filter(alert => 
        alert.rule.message === newAlert.rule.message &&
        alert.url === newAlert.url &&
        !alert.resolved &&
        (Date.now() - alert.timestamp) < 300000 // 5 minutes
      )
    
    return similarAlerts.length > 0
  }

  updateExistingAlert(newAlert) {
    const existingAlert = Array.from(this.activeAlerts.values())
      .find(alert => 
        alert.rule.message === newAlert.rule.message &&
        alert.url === newAlert.url &&
        !alert.resolved
      )
    
    if (existingAlert) {
      existingAlert.occurrenceCount = (existingAlert.occurrenceCount || 1) + 1
      existingAlert.lastOccurrence = Date.now()
      existingAlert.latestMetricValue = newAlert.metricValue
      
      // Escalate if getting worse
      if (newAlert.metricValue > existingAlert.metricValue) {
        this.escalateAlert(existingAlert)
      }
    }
  }

  processAlert(alert) {
    // Immediate actions based on alert level
    switch (alert.level.level) {
      case 'critical':
        this.handleCriticalAlert(alert)
        break
      case 'high':
        this.handleHighAlert(alert)
        break
      case 'medium':
        this.handleMediumAlert(alert)
        break
      case 'low':
        this.handleLowAlert(alert)
        break
    }
    
    // Execute automated actions
    if (this.options.enableAutomatedResponse) {
      this.executeAutomatedActions(alert)
    }
  }

  handleCriticalAlert(alert) {
    // Critical alerts require immediate attention
    this.sendImmediateNotification(alert)
    this.activateEmergencyProtocols(alert)
    this.logCriticalIncident(alert)
    
    // Update UI immediately
    this.showCriticalAlertBanner(alert)
  }

  handleHighAlert(alert) {
    this.sendHighPriorityNotification(alert)
    this.scheduleUrgentReview(alert)
    this.updateAlertDashboard(alert)
  }

  handleMediumAlert(alert) {
    this.addToAlertQueue(alert)
    this.scheduleReview(alert, 24 * 60 * 60 * 1000) // 24 hours
    this.updateAlertDashboard(alert)
  }

  handleLowAlert(alert) {
    this.addToMonitoringList(alert)
    this.scheduleWeeklyReview(alert)
  }

  executeAutomatedActions(alert) {
    alert.actions.forEach(action => {
      switch (action) {
        case 'immediate_optimization':
          this.triggerPerformanceOptimization(alert)
          break
        case 'fallback_activation':
          this.activateFallbackSystems(alert)
          break
        case 'accessibility_audit':
          this.scheduleAccessibilityAudit(alert)
          break
        case 'form_optimization':
          this.optimizeFormPerformance(alert)
          break
        case 'network_escalation':
          this.escalateNetworkIssue(alert)
          break
        case 'offline_fallback':
          this.enableOfflineFallback(alert)
          break
        default:
          if (this.options.debugMode) {
            console.log(`Automated action '${action}' not implemented`)
          }
      }
    })
  }

  // Automated Action Implementations
  triggerPerformanceOptimization(alert) {
    // Trigger bundle analysis and optimization
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        this.analyzeComponentPerformance(alert.metric)
      })
    }
  }

  activateFallbackSystems(alert) {
    // Activate simplified UI for critical components
    if (alert.metric.data.componentType === 'emergency') {
      this.enableSimplifiedEmergencyMode()
    }
  }

  scheduleAccessibilityAudit(alert) {
    // Schedule accessibility review
    this.recordActionItem({
      type: 'accessibility_audit',
      alert: alert.id,
      dueDate: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      priority: 'high'
    })
  }

  optimizeFormPerformance(alert) {
    // Enable form performance optimizations
    document.body.classList.add('form-performance-mode')
    
    // Defer non-critical form features
    this.deferNonCriticalFormFeatures()
  }

  escalateNetworkIssue(alert) {
    // Report network issue to infrastructure team
    this.sendNetworkAlert({
      level: 'critical',
      condition: alert.metric.data.networkCondition,
      impact: alert.impact,
      timestamp: alert.timestamp
    })
  }

  enableOfflineFallback(alert) {
    // Enable offline capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'ENABLE_OFFLINE_MODE',
          alert: alert.id
        })
      })
    }
  }

  // Alert UI and Notifications
  initializeAlertUI() {
    if (typeof document === 'undefined') return
    
    // Create alert container
    const alertContainer = document.createElement('div')
    alertContainer.id = 'healthcare-alerts-container'
    alertContainer.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      z-index: 10000;
      pointer-events: none;
    `
    
    document.body.appendChild(alertContainer)
  }

  showCriticalAlertBanner(alert) {
    const banner = document.createElement('div')
    banner.className = 'healthcare-critical-alert'
    banner.style.cssText = `
      background: ${alert.level.color};
      color: white;
      padding: 15px 20px;
      margin: 10px;
      border-radius: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      pointer-events: all;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `
    
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">⚠️</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">
            CRITICAL: ${alert.level.description}
          </div>
          <div style="font-size: 14px; opacity: 0.9;">
            ${alert.message}
          </div>
          <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
            Impact: ${alert.impact}
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
          ×
        </button>
      </div>
    `
    
    const container = document.getElementById('healthcare-alerts-container')
    if (container) {
      container.appendChild(banner)
      
      // Auto-remove after 30 seconds for critical alerts
      setTimeout(() => {
        if (banner.parentElement) {
          banner.remove()
        }
      }, 30000)
    }
  }

  // Escalation Management
  scheduleEscalation(alert) {
    const escalationDelay = alert.level.responseTime * 1000 // Convert to ms
    
    const timerId = setTimeout(() => {
      if (!alert.acknowledged && !alert.resolved) {
        this.escalateAlert(alert)
      }
    }, escalationDelay)
    
    this.escalationTimers.set(alert.id, timerId)
  }

  escalateAlert(alert) {
    alert.escalated = true
    alert.escalationTimestamp = Date.now()
    
    // Notify escalation targets
    alert.level.escalation.forEach(target => {
      this.notifyEscalationTarget(target, alert)
    })
    
    // Upgrade alert level if appropriate
    if (alert.level.level !== 'critical' && alert.patientSafetyRisk === 'critical') {
      alert.level = HEALTHCARE_ALERT_LEVELS.CRITICAL
      this.processAlert(alert) // Re-process with higher priority
    }
  }

  notifyEscalationTarget(target, alert) {
    // In a real implementation, this would integrate with notification systems
    if (this.options.debugMode) {
      console.error(`ESCALATION to ${target}:`, alert.message, alert)
    }
    
    // Send to analytics for tracking
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'healthcare_alert_escalation', {
        alert_id: alert.id,
        escalation_target: target,
        alert_level: alert.level.level,
        patient_safety_risk: alert.patientSafetyRisk
      })
    }
  }

  // Alert Management Methods
  acknowledgeAlert(alertId, acknowledgedBy) {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.acknowledged = true
      alert.acknowledgedBy = acknowledgedBy
      alert.acknowledgedAt = Date.now()
      
      // Cancel escalation
      const timer = this.escalationTimers.get(alertId)
      if (timer) {
        clearTimeout(timer)
        this.escalationTimers.delete(alertId)
      }
    }
  }

  resolveAlert(alertId, resolvedBy, resolution) {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedBy = resolvedBy
      alert.resolvedAt = Date.now()
      alert.resolution = resolution
      
      // Move to history
      this.activeAlerts.delete(alertId)
      
      // Cancel any timers
      const timer = this.escalationTimers.get(alertId)
      if (timer) {
        clearTimeout(timer)
        this.escalationTimers.delete(alertId)
      }
    }
  }

  // Alert Callbacks and Integrations
  onAlert(callback) {
    const id = `callback_${Date.now()}_${Math.random()}`
    this.alertCallbacks.set(id, callback)
    return id // Return ID for later removal
  }

  removeAlertCallback(id) {
    this.alertCallbacks.delete(id)
  }

  notifyAlertCallbacks(alert) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert)
      } catch (error) {
        console.error('Error in alert callback:', error)
      }
    })
  }

  // Reporting and Analytics
  recordAlertHistory(alert) {
    this.alertHistory.set(alert.id, alert)
    
    // Limit history size
    if (this.alertHistory.size > this.options.alertHistoryLimit) {
      const oldestKey = this.alertHistory.keys().next().value
      this.alertHistory.delete(oldestKey)
    }
  }

  getAlertDashboard() {
    return {
      active: {
        critical: this.getAlertsByLevel('critical'),
        high: this.getAlertsByLevel('high'),
        medium: this.getAlertsByLevel('medium'),
        low: this.getAlertsByLevel('low')
      },
      summary: {
        totalActive: this.activeAlerts.size,
        totalHistory: this.alertHistory.size,
        criticalCount: this.getAlertsByLevel('critical').length,
        escalatedCount: this.getEscalatedAlerts().length,
        patientSafetyRisks: this.getPatientSafetyRisks()
      },
      trends: {
        alertFrequency: this.calculateAlertFrequency(),
        commonIssues: this.identifyCommonIssues(),
        resolutionTimes: this.calculateResolutionTimes()
      }
    }
  }

  getAlertsByLevel(level) {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.level.level === level)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  getEscalatedAlerts() {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.escalated)
  }

  getPatientSafetyRisks() {
    return Array.from(this.activeAlerts.values())
      .filter(alert => alert.patientSafetyRisk === 'critical' || alert.patientSafetyRisk === 'high')
  }

  calculateAlertFrequency() {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000)
    const recentAlerts = Array.from(this.alertHistory.values())
      .filter(alert => alert.timestamp > last24Hours)
    
    return {
      last24Hours: recentAlerts.length,
      averagePerHour: recentAlerts.length / 24,
      peakHour: this.findPeakAlertHour(recentAlerts)
    }
  }

  identifyCommonIssues() {
    const issues = new Map()
    
    this.alertHistory.forEach(alert => {
      const key = alert.rule.message
      issues.set(key, (issues.get(key) || 0) + 1)
    })
    
    return Array.from(issues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Top 10 issues
  }

  calculateResolutionTimes() {
    const resolvedAlerts = Array.from(this.alertHistory.values())
      .filter(alert => alert.resolved && alert.resolvedAt)
    
    if (resolvedAlerts.length === 0) return { average: 0, median: 0 }
    
    const resolutionTimes = resolvedAlerts
      .map(alert => alert.resolvedAt - alert.timestamp)
    
    const average = resolutionTimes.reduce((a, b) => a + b) / resolutionTimes.length
    const sorted = resolutionTimes.sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    
    return { average, median }
  }

  findPeakAlertHour(alerts) {
    const hourCounts = new Array(24).fill(0)
    
    alerts.forEach(alert => {
      const hour = new Date(alert.timestamp).getHours()
      hourCounts[hour]++
    })
    
    const maxCount = Math.max(...hourCounts)
    const peakHour = hourCounts.indexOf(maxCount)
    
    return { hour: peakHour, count: maxCount }
  }

  // Debug and Testing
  enableDebugMode() {
    console.log('Healthcare Performance Alerts Debug Mode enabled')
    
    // Add debug controls to page
    this.addDebugControls()
    
    // Log all alerts
    this.onAlert(alert => {
      console.group(`Healthcare Alert: ${alert.level.level.toUpperCase()}`)
      console.log('Message:', alert.message)
      console.log('Impact:', alert.impact)
      console.log('Metric:', alert.metric)
      console.log('Patient Safety Risk:', alert.patientSafetyRisk)
      console.log('Workflow Impact:', alert.workflowImpact)
      console.groupEnd()
    })
  }

  addDebugControls() {
    const controls = document.createElement('div')
    controls.id = 'healthcare-alerts-debug'
    controls.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10001;
    `
    
    controls.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">Healthcare Alerts Debug</div>
      <button onclick="window.healthcareAlerts.testCriticalAlert()" style="margin: 2px; padding: 5px; font-size: 11px;">Test Critical</button>
      <button onclick="window.healthcareAlerts.testHighAlert()" style="margin: 2px; padding: 5px; font-size: 11px;">Test High</button>
      <button onclick="console.log(window.healthcareAlerts.getAlertDashboard())" style="margin: 2px; padding: 5px; font-size: 11px;">Show Dashboard</button>
      <button onclick="window.healthcareAlerts.clearAllAlerts()" style="margin: 2px; padding: 5px; font-size: 11px;">Clear All</button>
    `
    
    document.body.appendChild(controls)
  }

  // Test Methods
  testCriticalAlert() {
    const testAlert = this.createAlert(
      {
        name: 'emergency_component_test',
        data: {
          componentType: 'emergency',
          loadTime: 250,
          networkCondition: 'emergency_network'
        },
        medicalContext: { isEmergency: true, specialty: 'kardiologie' }
      },
      MEDICAL_ALERT_RULES.emergency_component.load_time_critical,
      250
    )
    
    this.triggerAlert(testAlert)
  }

  testHighAlert() {
    const testAlert = this.createAlert(
      {
        name: 'patient_form_test',
        data: {
          componentType: 'patientForm',
          duration: 600,
          formType: 'medical_history'
        },
        medicalContext: { userType: 'patient' }
      },
      MEDICAL_ALERT_RULES.patient_form.response_time_critical,
      600
    )
    
    this.triggerAlert(testAlert)
  }

  clearAllAlerts() {
    this.activeAlerts.clear()
    this.escalationTimers.forEach(timer => clearTimeout(timer))
    this.escalationTimers.clear()
    
    // Clear UI
    const container = document.getElementById('healthcare-alerts-container')
    if (container) {
      container.innerHTML = ''
    }
    
    console.log('All healthcare alerts cleared')
  }

  // Cleanup
  destroy() {
    this.clearAllAlerts()
    this.alertCallbacks.clear()
    this.alertHistory.clear()
    
    const debugPanel = document.getElementById('healthcare-alerts-debug')
    if (debugPanel) {
      debugPanel.remove()
    }
    
    const container = document.getElementById('healthcare-alerts-container')
    if (container) {
      container.remove()
    }
  }

  // Helper methods for action items
  recordActionItem(item) {
    // In a real implementation, this would integrate with a task management system
    if (this.options.debugMode) {
      console.log('Action Item Recorded:', item)
    }
  }

  enableSimplifiedEmergencyMode() {
    document.body.classList.add('emergency-simplified-mode')
    console.log('Emergency simplified mode activated')
  }

  deferNonCriticalFormFeatures() {
    // Defer non-essential form features to improve performance
    const nonCriticalElements = document.querySelectorAll('.form-enhancement, .form-animation')
    nonCriticalElements.forEach(el => el.style.display = 'none')
  }

  sendNetworkAlert(alertData) {
    if (this.options.debugMode) {
      console.error('Network Alert:', alertData)
    }
  }

  analyzeComponentPerformance(metric) {
    // Placeholder for component performance analysis
    console.log('Analyzing component performance for:', metric.name)
  }

  sendImmediateNotification(alert) {
    // Placeholder for immediate notification system
    if (this.options.debugMode) {
      console.error('IMMEDIATE NOTIFICATION:', alert.message)
    }
  }

  activateEmergencyProtocols(alert) {
    // Activate emergency response protocols
    if (this.options.debugMode) {
      console.error('EMERGENCY PROTOCOLS ACTIVATED:', alert)
    }
  }

  logCriticalIncident(alert) {
    // Log to incident management system
    if (this.options.debugMode) {
      console.error('CRITICAL INCIDENT LOGGED:', alert.id, alert)
    }
  }

  sendHighPriorityNotification(alert) {
    if (this.options.debugMode) {
      console.warn('HIGH PRIORITY NOTIFICATION:', alert.message)
    }
  }

  scheduleUrgentReview(alert) {
    this.recordActionItem({
      type: 'urgent_review',
      alert: alert.id,
      dueDate: Date.now() + (60 * 60 * 1000), // 1 hour
      priority: 'high'
    })
  }

  addToAlertQueue(alert) {
    // Add to alert processing queue
    if (this.options.debugMode) {
      console.log('Added to alert queue:', alert.id)
    }
  }

  scheduleReview(alert, delay) {
    this.recordActionItem({
      type: 'scheduled_review',
      alert: alert.id,
      dueDate: Date.now() + delay,
      priority: 'medium'
    })
  }

  addToMonitoringList(alert) {
    if (this.options.debugMode) {
      console.log('Added to monitoring list:', alert.id)
    }
  }

  scheduleWeeklyReview(alert) {
    this.recordActionItem({
      type: 'weekly_review',
      alert: alert.id,
      dueDate: Date.now() + (7 * 24 * 60 * 60 * 1000), // 1 week
      priority: 'low'
    })
  }

  updateAlertDashboard(alert) {
    // Update alert dashboard UI
    if (this.options.debugMode) {
      console.log('Alert dashboard updated with:', alert.id)
    }
  }
}

// Export for various environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HealthcarePerformanceAlerts,
    HEALTHCARE_ALERT_LEVELS,
    MEDICAL_ALERT_RULES
  }
} else if (typeof window !== 'undefined') {
  window.HealthcarePerformanceAlerts = HealthcarePerformanceAlerts
  window.HEALTHCARE_ALERT_LEVELS = HEALTHCARE_ALERT_LEVELS
  window.MEDICAL_ALERT_RULES = MEDICAL_ALERT_RULES
  
  // Auto-initialize
  window.addEventListener('DOMContentLoaded', () => {
    window.healthcareAlerts = new HealthcarePerformanceAlerts()
    console.log('Healthcare Performance Alerts initialized')
  })
}