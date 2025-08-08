/**
 * Test Suite für Healthcare Performance Monitoring System
 * Testet alle Performance Monitoring Features mit medizinischen Szenarien
 */

// Import modules (adjust paths if running in Node.js)
const isNode = typeof module !== 'undefined' && module.exports

if (isNode) {
  // Node.js environment - would need to mock browser APIs
  console.log('Healthcare Performance Monitoring Test - Node.js environment detected')
  console.log('This test is designed to run in browser environment')
  process.exit(0)
}

// Browser environment test suite
class HealthcarePerformanceMonitoringTest {
  constructor() {
    this.testResults = []
    this.testStartTime = performance.now()
  }

  async runAllTests() {
    console.group('🏥 Healthcare Performance Monitoring Test Suite')
    console.log('Starting comprehensive performance monitoring tests...')
    
    try {
      // Test Real User Monitoring (RUM)
      await this.testRUMIntegration()
      
      // Test Healthcare Metrics
      await this.testHealthcareMetrics()
      
      // Test Performance Alerts
      await this.testPerformanceAlerts()
      
      // Test Integration
      await this.testSystemIntegration()
      
      // Test Emergency Scenarios
      await this.testEmergencyScenarios()
      
      // Test Accessibility Performance
      await this.testAccessibilityPerformance()
      
      // Test Network Conditions
      await this.testNetworkConditions()
      
      this.displayTestResults()
      
    } catch (error) {
      console.error('Test suite failed:', error)
    }
    
    console.groupEnd()
  }

  async testRUMIntegration() {
    console.group('📊 Testing RUM Integration')
    
    try {
      // Initialize RUM system
      const rumSystem = new HealthcareRUMIntegration({
        debugMode: true,
        sampleRate: 1.0,
        bufferSize: 100
      })
      
      // Test journey detection
      rumSystem.startJourney('patient_consultation', 'landing')
      this.assert(
        rumSystem.journeyState.currentJourney === 'patient_consultation',
        'Journey should be detected and started'
      )
      
      // Test stage transition
      rumSystem.transitionToStage('specialty_selection')
      this.assert(
        rumSystem.journeyState.currentStage === 'specialty_selection',
        'Stage transition should work'
      )
      
      // Test component tracking
      const testComponent = this.createTestHealthcareComponent('emergency-button')
      document.body.appendChild(testComponent)
      
      // Wait for component tracking
      await this.wait(100)
      
      // Test RUM data collection
      this.assert(
        rumSystem.rumData.size > 0,
        'RUM system should collect performance data'
      )
      
      // Cleanup
      document.body.removeChild(testComponent)
      rumSystem.destroy()
      
      this.recordTest('RUM Integration', true)
      
    } catch (error) {
      console.error('RUM Integration test failed:', error)
      this.recordTest('RUM Integration', false, error.message)
    }
    
    console.groupEnd()
  }

  async testHealthcareMetrics() {
    console.group('🏥 Testing Healthcare Metrics')
    
    try {
      // Initialize healthcare metrics
      const healthcareMetrics = new HealthcareMetrics({
        debugMode: true,
        enableRealUserMonitoring: true,
        enableNetworkAnalysis: true,
        enableAccessibilityTracking: true,
        enableStressAnalysis: true
      })
      
      // Test network detection
      this.assert(
        healthcareMetrics.networkCondition !== 'unknown',
        'Network condition should be detected'
      )
      
      // Test medical context updates
      healthcareMetrics.updateMedicalContext({
        isEmergency: true,
        medicalSpecialty: 'kardiologie',
        userType: 'patient'
      })
      
      this.assert(
        healthcareMetrics.currentContext.isEmergency === true,
        'Medical context should be updatable'
      )
      
      // Test performance standards
      const emergencyStandards = healthcareMetrics.constructor.HEALTHCARE_PERFORMANCE_STANDARDS?.emergency
      this.assert(
        emergencyStandards && emergencyStandards.componentLoad === 100,
        'Emergency component standards should be configured'
      )
      
      // Test dashboard generation
      const dashboard = healthcareMetrics.getHealthcareDashboard()
      this.assert(
        dashboard && dashboard.overview && dashboard.emergencyPerformance,
        'Healthcare dashboard should be generated'
      )
      
      healthcareMetrics.destroy()
      this.recordTest('Healthcare Metrics', true)
      
    } catch (error) {
      console.error('Healthcare Metrics test failed:', error)
      this.recordTest('Healthcare Metrics', false, error.message)
    }
    
    console.groupEnd()
  }

  async testPerformanceAlerts() {
    console.group('🚨 Testing Performance Alerts')
    
    try {
      // Initialize alert system
      const alertSystem = new HealthcarePerformanceAlerts({
        debugMode: true,
        enableRealTimeAlerts: true,
        enableAutomatedResponse: true
      })
      
      let alertTriggered = false
      
      // Listen for alerts
      alertSystem.onAlert((alert) => {
        alertTriggered = true
        console.log('Test alert received:', alert.message)
      })
      
      // Test critical alert
      alertSystem.testCriticalAlert()
      
      // Wait for alert processing
      await this.wait(100)
      
      this.assert(
        alertTriggered,
        'Critical alert should be triggered'
      )
      
      // Test alert dashboard
      const dashboard = alertSystem.getAlertDashboard()
      this.assert(
        dashboard && dashboard.summary && dashboard.active,
        'Alert dashboard should be available'
      )
      
      // Test high priority alert
      alertSystem.testHighAlert()
      await this.wait(100)
      
      this.assert(
        alertSystem.activeAlerts.size > 0,
        'Active alerts should be tracked'
      )
      
      // Test alert resolution
      const firstAlert = alertSystem.activeAlerts.values().next().value
      if (firstAlert) {
        alertSystem.resolveAlert(firstAlert.id, 'test', 'Test resolution')
        this.assert(
          firstAlert.resolved === true,
          'Alerts should be resolvable'
        )
      }
      
      alertSystem.destroy()
      this.recordTest('Performance Alerts', true)
      
    } catch (error) {
      console.error('Performance Alerts test failed:', error)
      this.recordTest('Performance Alerts', false, error.message)
    }
    
    console.groupEnd()
  }

  async testSystemIntegration() {
    console.group('🔗 Testing System Integration')
    
    try {
      // Test that all systems can work together
      const rumSystem = new HealthcareRUMIntegration({ debugMode: true })
      const metricsSystem = new HealthcareMetrics({ debugMode: true })
      const alertSystem = new HealthcarePerformanceAlerts({ debugMode: true })
      
      // Simulate integration
      rumSystem.startJourney('emergency_response', 'emergency_detection')
      metricsSystem.updateMedicalContext({
        isEmergency: true,
        medicalSpecialty: 'kardiologie'
      })
      
      // Test that systems don't conflict
      this.assert(
        rumSystem.journeyState.currentJourney === 'emergency_response',
        'RUM system should maintain state during integration'
      )
      
      this.assert(
        metricsSystem.currentContext.isEmergency === true,
        'Metrics system should maintain context during integration'
      )
      
      // Cleanup
      rumSystem.destroy()
      metricsSystem.destroy()
      alertSystem.destroy()
      
      this.recordTest('System Integration', true)
      
    } catch (error) {
      console.error('System Integration test failed:', error)
      this.recordTest('System Integration', false, error.message)
    }
    
    console.groupEnd()
  }

  async testEmergencyScenarios() {
    console.group('🚑 Testing Emergency Scenarios')
    
    try {
      const alertSystem = new HealthcarePerformanceAlerts({ debugMode: true })
      
      // Create emergency component
      const emergencyComponent = this.createTestHealthcareComponent('emergency-contact', true)
      document.body.appendChild(emergencyComponent)
      
      // Simulate emergency component slow loading
      const slowLoadMetric = {
        name: 'emergency_component_load',
        data: {
          componentType: 'emergency',
          loadTime: 250, // Exceeds 100ms emergency threshold
          networkCondition: 'emergency_network'
        },
        medicalContext: {
          isEmergency: true,
          specialty: 'kardiologie'
        }
      }
      
      let criticalAlertTriggered = false
      alertSystem.onAlert((alert) => {
        if (alert.level.level === 'critical') {
          criticalAlertTriggered = true
        }
      })
      
      // Trigger emergency performance issue
      alertSystem.evaluateMetricForAlerts(slowLoadMetric)
      
      await this.wait(100)
      
      this.assert(
        criticalAlertTriggered,
        'Critical alert should be triggered for emergency component performance issues'
      )
      
      // Cleanup
      document.body.removeChild(emergencyComponent)
      alertSystem.destroy()
      
      this.recordTest('Emergency Scenarios', true)
      
    } catch (error) {
      console.error('Emergency Scenarios test failed:', error)
      this.recordTest('Emergency Scenarios', false, error.message)
    }
    
    console.groupEnd()
  }

  async testAccessibilityPerformance() {
    console.group('♿ Testing Accessibility Performance')
    
    try {
      const metricsSystem = new HealthcareMetrics({
        debugMode: true,
        enableAccessibilityTracking: true
      })
      
      // Create accessibility-enhanced component
      const a11yComponent = this.createTestHealthcareComponent('accessible-form')
      a11yComponent.setAttribute('aria-label', 'Medical information form')
      a11yComponent.setAttribute('role', 'form')
      a11yComponent.style.minWidth = '56px'
      a11yComponent.style.minHeight = '56px'
      
      document.body.appendChild(a11yComponent)
      
      // Wait for accessibility tracking
      await this.wait(200)
      
      // Test that accessibility metrics are collected
      this.assert(
        metricsSystem.metrics.size > 0,
        'Accessibility metrics should be collected'
      )
      
      // Test touch target analysis
      const hasA11yMetrics = Array.from(metricsSystem.metrics.values())
        .some(metric => metric.name.includes('accessibility') || metric.name.includes('touch_target'))
      
      this.assert(
        hasA11yMetrics,
        'Touch target and accessibility metrics should be tracked'
      )
      
      // Cleanup
      document.body.removeChild(a11yComponent)
      metricsSystem.destroy()
      
      this.recordTest('Accessibility Performance', true)
      
    } catch (error) {
      console.error('Accessibility Performance test failed:', error)
      this.recordTest('Accessibility Performance', false, error.message)
    }
    
    console.groupEnd()
  }

  async testNetworkConditions() {
    console.group('🌐 Testing Network Conditions')
    
    try {
      const metricsSystem = new HealthcareMetrics({
        debugMode: true,
        enableNetworkAnalysis: true
      })
      
      // Test network profile detection
      this.assert(
        metricsSystem.networkCondition !== null,
        'Network condition should be detected'
      )
      
      // Test network profiles exist
      const networkProfiles = window.MEDICAL_NETWORK_CONDITIONS
      this.assert(
        networkProfiles && Object.keys(networkProfiles).length > 0,
        'Medical network profiles should be defined'
      )
      
      // Test specific network profiles
      this.assert(
        networkProfiles.hospital_wifi && networkProfiles.emergency_network,
        'Critical network profiles should be defined'
      )
      
      // Test network analysis in dashboard
      const dashboard = metricsSystem.getHealthcareDashboard()
      this.assert(
        dashboard.networkAnalysis && dashboard.networkAnalysis.currentCondition,
        'Network analysis should be included in dashboard'
      )
      
      metricsSystem.destroy()
      this.recordTest('Network Conditions', true)
      
    } catch (error) {
      console.error('Network Conditions test failed:', error)
      this.recordTest('Network Conditions', false, error.message)
    }
    
    console.groupEnd()
  }

  // Helper Methods
  createTestHealthcareComponent(type, isEmergency = false) {
    const element = document.createElement('div')
    element.className = `healthcare-${type} ${isEmergency ? 'emergency-' : ''}`
    element.setAttribute('data-component', `healthcare-${type}`)
    element.style.width = '200px'
    element.style.height = '60px'
    element.style.background = isEmergency ? '#dc2626' : '#1278B3'
    element.style.color = 'white'
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.textContent = isEmergency ? '🚨 Emergency' : '🏥 Healthcare'
    
    if (isEmergency) {
      element.setAttribute('data-emergency', 'true')
      element.setAttribute('aria-label', 'Emergency medical assistance')
    }
    
    return element
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`)
    }
  }

  recordTest(testName, passed, error = null) {
    this.testResults.push({
      name: testName,
      passed,
      error,
      timestamp: Date.now()
    })
    
    const status = passed ? '✅ PASSED' : '❌ FAILED'
    console.log(`${status}: ${testName}${error ? ` - ${error}` : ''}`)
  }

  displayTestResults() {
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(test => test.passed).length
    const failedTests = totalTests - passedTests
    const testDuration = performance.now() - this.testStartTime
    
    console.log('\n📋 Healthcare Performance Monitoring Test Results')
    console.log('==================================================')
    console.log(`Total Tests: ${totalTests}`)
    console.log(`Passed: ${passedTests} ✅`)
    console.log(`Failed: ${failedTests} ❌`)
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
    console.log(`Test Duration: ${testDuration.toFixed(2)}ms`)
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:')
      this.testResults
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`- ${test.name}: ${test.error}`)
        })
    } else {
      console.log('\n🎉 All tests passed! Healthcare Performance Monitoring is ready for production.')
    }
    
    // Generate test report
    this.generateTestReport()
  }

  generateTestReport() {
    const report = {
      testSuite: 'Healthcare Performance Monitoring',
      timestamp: new Date().toISOString(),
      duration: performance.now() - this.testStartTime,
      results: this.testResults,
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(test => test.passed).length,
        failed: this.testResults.filter(test => !test.passed).length,
        successRate: (this.testResults.filter(test => test.passed).length / this.testResults.length) * 100
      },
      environment: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        performance: {
          timing: performance.timing,
          navigation: performance.navigation
        }
      }
    }
    
    // Store report for debugging
    window.healthcarePerformanceTestReport = report
    
    console.log('\n📊 Detailed test report available at: window.healthcarePerformanceTestReport')
  }

  // Static method to run tests
  static async run() {
    const testSuite = new HealthcarePerformanceMonitoringTest()
    await testSuite.runAllTests()
    return testSuite.testResults
  }
}

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
  window.HealthcarePerformanceMonitoringTest = HealthcarePerformanceMonitoringTest
  
  // Wait for all systems to load
  window.addEventListener('DOMContentLoaded', () => {
    // Give systems time to initialize
    setTimeout(() => {
      // Check if we're in test mode
      const urlParams = new URLSearchParams(window.location.search)
      const runTests = urlParams.get('run-performance-tests') === 'true'
      
      if (runTests || window.location.hostname === 'localhost') {
        console.log('🧪 Running Healthcare Performance Monitoring Tests...')
        HealthcarePerformanceMonitoringTest.run()
      } else {
        console.log('💡 To run Healthcare Performance Monitoring tests, add ?run-performance-tests=true to URL')
      }
    }, 2000)
  })
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HealthcarePerformanceMonitoringTest
}