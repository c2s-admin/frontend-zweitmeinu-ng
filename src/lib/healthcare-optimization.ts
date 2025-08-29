/**
 * Healthcare Application Optimization Manager
 * 
 * Central coordination for all healthcare performance optimizations:
 * - Component lazy loading strategy
 * - Bundle splitting coordination
 * - Performance monitoring integration
 * - Emergency component prioritization
 * - Mobile healthcare optimization
 */

import { 
  healthcareLoader,
  getNetworkAwareLoadingStrategy,
  registerHealthcareServiceWorker
} from './performance'

import { 
  healthcareBundleAnalyzer,
  type HealthcarePerformanceReport
} from './bundle-analyzer'

import {
  healthcarePerformanceTests,
  quickHealthcarePerformanceCheck,
  startContinuousPerformanceMonitoring,
  checkPerformanceBudget
} from './performance-tests'

import {
  preloadEmergencyComponents,
  preloadCoreHealthcareComponents,
  preloadConsultationComponents,
  type HealthcareComponentName
} from '../components/lazy/HealthcareLazy'

export interface HealthcareOptimizationConfig {
  /** Enable performance monitoring */
  enableMonitoring?: boolean
  /** Enable service worker for offline access */
  enableServiceWorker?: boolean
  /** Preload emergency components on app start */
  preloadEmergency?: boolean
  /** Enable continuous performance testing */
  enableContinuousTests?: boolean
  /** Performance test interval in milliseconds */
  testInterval?: number
  // Bundle analysis is handled by the monitor/analyzer modules
  /** User context for optimization */
  userContext?: {
    isEmergency?: boolean
    medicalSpecialty?: string
    connectionType?: string
    deviceType?: 'mobile' | 'tablet' | 'desktop'
  }
}

export interface OptimizationStatus {
  isOptimized: boolean
  emergencyReady: boolean
  performanceScore: number
  recommendations: string[]
  loadedComponents: string[]
  memoryUsage?: number
  networkStrategy: string
}

/**
 * Healthcare Application Optimization Manager
 */
export class HealthcareOptimizationManager {
  private config: Required<HealthcareOptimizationConfig>
  private monitoringCleanup?: () => void
  private initialized = false
  
  constructor(config: HealthcareOptimizationConfig = {}) {
    this.config = {
      enableMonitoring: true,
      enableServiceWorker: true,
      preloadEmergency: true,
      enableContinuousTests: false,
      testInterval: 300000, // 5 minutes
      userContext: {},
      ...config
    }
  }

  /**
   * Initialize healthcare optimization
   */
  async initialize(): Promise<OptimizationStatus> {
    if (this.initialized) {
      console.warn('Healthcare optimization already initialized')
      return this.getStatus()
    }

    console.log('🏥 Initializing Healthcare Application Optimization...')

    try {
      // 1. Register service worker for offline healthcare access
      if (this.config.enableServiceWorker) {
        await registerHealthcareServiceWorker()
        console.log('✅ Healthcare service worker registered')
      }

      // 2. Determine network strategy
      const networkStrategy = getNetworkAwareLoadingStrategy()
      console.log(`📶 Network strategy: ${networkStrategy}`)

      // 3. Preload critical healthcare components
      await this.preloadCriticalComponents()

      // 4. Start continuous testing if enabled (synthetic checks only)
      if (this.config.enableContinuousTests) {
        this.monitoringCleanup = startContinuousPerformanceMonitoring(this.config.testInterval)
        console.log('📊 Continuous performance monitoring started')
      }

      // 5. Run initial performance check
      const performancePass = await quickHealthcarePerformanceCheck()
      console.log(`🏁 Initial performance check: ${performancePass ? '✅ PASS' : '❌ FAIL'}`)

      this.initialized = true
      console.log('✅ Healthcare optimization initialized successfully')

      return this.getStatus()

    } catch (error) {
      console.error('❌ Healthcare optimization initialization failed:', error)
      throw new Error(`Healthcare optimization failed: ${error}`)
    }
  }

  /**
   * Preload critical healthcare components based on context
   */
  private async preloadCriticalComponents(): Promise<void> {
    const { userContext } = this.config

    // Always preload emergency components
    if (this.config.preloadEmergency) {
      await preloadEmergencyComponents()
      console.log('🚨 Emergency components preloaded')
    }

    // Emergency context - preload everything critical
    if (userContext.isEmergency) {
      await Promise.all([
        preloadEmergencyComponents(),
        preloadCoreHealthcareComponents()
      ])
      console.log('🚑 Emergency context: critical components preloaded')
      return
    }

    // Network-aware preloading
    const networkStrategy = getNetworkAwareLoadingStrategy()
    
    switch (networkStrategy) {
      case 'aggressive':
        // Fast connection - preload consultation components too
        await Promise.all([
          preloadEmergencyComponents(),
          preloadCoreHealthcareComponents(),
          preloadConsultationComponents()
        ])
        console.log('🚀 Aggressive preloading: all components loaded')
        break

      case 'standard':
        // Standard connection - preload core components
        await Promise.all([
          preloadEmergencyComponents(),
          preloadCoreHealthcareComponents()
        ])
        console.log('📱 Standard preloading: core components loaded')
        break

      case 'conservative':
        // Slow connection - only emergency + essential core
        await preloadEmergencyComponents()
        console.log('🐌 Conservative preloading: emergency only')
        break

      case 'minimal':
        // Very slow connection - emergency only
        await preloadEmergencyComponents()
        console.log('⚡ Minimal preloading: emergency components only')
        break

      default:
        await preloadCoreHealthcareComponents()
    }

    // Preload based on medical specialty
    if (userContext.medicalSpecialty) {
      await this.preloadSpecialtyComponents(userContext.medicalSpecialty)
    }
  }

  /**
   * Preload components for specific medical specialty
   */
  private async preloadSpecialtyComponents(specialty: string): Promise<void> {
    type Preloader = () => Promise<unknown>
    const specialtyPreloads: Record<string, Preloader[]> = {
      cardiology: [
        () => healthcareLoader.loadComponent('DoctorProfile', 'important'),
        () => healthcareLoader.loadComponent('SpecialtySelector', 'standard')
      ],
      oncology: [
        () => healthcareLoader.loadComponent('ConsultationFlow', 'important'),
        () => healthcareLoader.loadComponent('FileUpload', 'standard')
      ],
      // Add more specialties as needed
    }

    const preloaders = specialtyPreloads[specialty.toLowerCase()]
    if (preloaders) {
      await Promise.all(preloaders.map(preloader => preloader()))
      console.log(`🏥 ${specialty} components preloaded`)
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Consolidated: monitoring is handled by HealthcarePerformanceMonitor component
  }

  /**
   * Initialize bundle analysis
   */
  private initializeBundleAnalysis(): void {
    // Consolidated: periodic analysis is handled externally if needed
  }

  /**
   * Get current optimization status
   */
  async getStatus(): Promise<OptimizationStatus> {
    const bundleReport = healthcareBundleAnalyzer.generateReport()
    const budgetCheck = await checkPerformanceBudget()
    const performanceTest = await quickHealthcarePerformanceCheck()
    
    return {
      isOptimized: this.initialized && budgetCheck.withinBudget,
      emergencyReady: performanceTest,
      performanceScore: bundleReport.mobileOptimizationScore,
      recommendations: bundleReport.recommendations,
      loadedComponents: healthcareBundleAnalyzer.getTrackedComponents(),
      memoryUsage: this.getMemoryUsage(),
      networkStrategy: getNetworkAwareLoadingStrategy()
    }
  }

  /**
   * Run comprehensive performance audit
   */
  async runPerformanceAudit(): Promise<{
    bundleAnalysis: HealthcarePerformanceReport
    performanceTests: ReturnType<typeof healthcarePerformanceTests['runAllTests']> extends Promise<infer R> ? R : unknown
    budgetCheck: Awaited<ReturnType<typeof checkPerformanceBudget>>
    status: OptimizationStatus
  }> {
    console.log('🔍 Running comprehensive healthcare performance audit...')

    const [bundleAnalysis, performanceTests, budgetCheck, status] = await Promise.all([
      Promise.resolve(healthcareBundleAnalyzer.generateReport()),
      healthcarePerformanceTests.runAllTests(),
      checkPerformanceBudget(),
      this.getStatus()
    ])

    console.log('📋 Healthcare performance audit completed')
    return {
      bundleAnalysis,
      performanceTests,
      budgetCheck,
      status
    }
  }

  /**
   * Optimize for emergency context
   */
  async optimizeForEmergency(): Promise<void> {
    console.log('🚨 Optimizing for emergency context...')

    // Preload all emergency components immediately
    await preloadEmergencyComponents()

    // Clean up non-essential components to free memory
    healthcareLoader.cleanup()

    // Prioritize emergency components in any future loads
    this.config.userContext.isEmergency = true

    console.log('✅ Emergency optimization completed')
  }

  /**
   * Optimize for mobile healthcare users
   */
  async optimizeForMobile(): Promise<void> {
    console.log('📱 Optimizing for mobile healthcare users...')

    // Use conservative loading strategy
    const mobileComponents = ['EmergencyBanner', 'HealthcareButton', 'HealthcareInput', 'HealthcareCard']
    
    for (const componentName of mobileComponents) {
      await healthcareLoader.loadComponent(componentName as HealthcareComponentName, 'important')
    }

    console.log('✅ Mobile optimization completed')
  }

  /**
   * Clean up optimization resources
   */
  cleanup(): void {
    if (this.monitoringCleanup) {
      this.monitoringCleanup()
      this.monitoringCleanup = undefined
    }

    healthcareLoader.cleanup()
    healthcareBundleAnalyzer.clear()

    this.initialized = false
    console.log('🧹 Healthcare optimization cleaned up')
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } }
      return perf.memory?.usedJSHeapSize
    }
    return undefined
  }

  /**
   * Export optimization report
   */
  exportReport(): string {
    const report = {
      config: this.config,
      initialized: this.initialized,
      bundleAnalysis: healthcareBundleAnalyzer.exportReport(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    
    return JSON.stringify(report, null, 2)
  }
}

// Singleton instance for global healthcare optimization
export const healthcareOptimization = new HealthcareOptimizationManager()

/**
 * Quick setup function for common healthcare optimization scenarios
 */
export const setupHealthcareOptimization = async (scenario: 'emergency' | 'mobile' | 'standard' | 'custom', customConfig?: HealthcareOptimizationConfig) => {
  let config: HealthcareOptimizationConfig

  switch (scenario) {
    case 'emergency':
      config = {
        preloadEmergency: true,
        enableServiceWorker: true,
        enableMonitoring: true,
        userContext: { isEmergency: true, deviceType: 'mobile' }
      }
      break

    case 'mobile':
      config = {
        preloadEmergency: true,
        enableServiceWorker: true,
        enableMonitoring: false, // Reduce overhead on mobile
        userContext: { deviceType: 'mobile' }
      }
      break

    case 'standard':
      config = {
        preloadEmergency: true,
        enableServiceWorker: true,
        enableMonitoring: true,
        enableContinuousTests: false
      }
      break

    case 'custom':
      config = customConfig || {}
      break
  }

  const optimizer = new HealthcareOptimizationManager(config)
  const status = await optimizer.initialize()
  
  console.log(`🏥 Healthcare optimization setup completed for ${scenario} scenario`)
  console.log('📊 Status:', status)
  
  return { optimizer, status }
}

// Auto-initialize with standard config if in browser
if (typeof window !== 'undefined' && !window.healthcareOptimizationInitialized) {
  // Mark as initialized to prevent multiple initializations
  window.healthcareOptimizationInitialized = true
  
  // Initialize with standard config after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupHealthcareOptimization('standard').catch(console.error)
    })
  } else {
    setupHealthcareOptimization('standard').catch(console.error)
  }
}

// Extend window object for debugging
declare global {
  interface Window {
    healthcareOptimizationInitialized?: boolean
    healthcareOptimization?: HealthcareOptimizationManager
  }
}

if (typeof window !== 'undefined') {
  window.healthcareOptimization = healthcareOptimization
}
