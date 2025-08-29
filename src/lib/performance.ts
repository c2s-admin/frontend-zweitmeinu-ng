/**
 * Healthcare Performance Optimization Utilities
 * 
 * Provides performance utilities optimized for healthcare users:
 * - Mobile-first optimization (many medical users on mobile)
 * - Stressed user optimization (fast loading critical)
 * - Memory-efficient for older devices
 * - Network-aware loading for limited data plans
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react'

// Healthcare component loading priorities
export type HealthcarePriority = 'critical' | 'important' | 'standard' | 'deferred'

export interface HealthcareLoadingConfig {
  priority: HealthcarePriority
  preload?: boolean
  chunkName?: string
  webpackPrefetch?: boolean
  webpackPreload?: boolean
  medicalContext?: boolean
}

/**
 * Healthcare-optimized lazy loading
 * Prioritizes medical components and emergency features
 */
export function createHealthcareLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: HealthcareLoadingConfig = { priority: 'standard' }
): LazyExoticComponent<T> {
  const { priority, chunkName, webpackPrefetch, webpackPreload, medicalContext } = config

  // Add webpack magic comments for better chunking
  const enhancedImportFn = importFn

  if (chunkName || webpackPrefetch || webpackPreload) {
    const comments = []
    if (chunkName) comments.push(`webpackChunkName: "${chunkName}"`)
    if (webpackPrefetch) comments.push('webpackPrefetch: true')
    if (webpackPreload) comments.push('webpackPreload: true')
    
    // This is a TypeScript hint - the actual magic comments need to be in the import call
    console.log(`Webpack comments for ${chunkName}: ${comments.join(', ')}`)
  }

  const LazyComponent = lazy(enhancedImportFn)

  // Add priority metadata for runtime optimization
  ;(LazyComponent as unknown as { __healthcarePriority?: HealthcarePriority }).__healthcarePriority = priority
  ;(LazyComponent as unknown as { __medicalContext?: boolean }).__medicalContext = medicalContext

  return LazyComponent
}

/**
 * Preload healthcare components based on user context
 */
export const preloadHealthcareComponents = async (context: {
  userAgent?: string
  connectionType?: string
  isEmergency?: boolean
  medicalSpecialty?: string
}) => {
  const { userAgent: _userAgent, connectionType, isEmergency, medicalSpecialty } = context

  // Critical components for emergency situations
  if (isEmergency) {
    await Promise.all([
      import('../stories/' + 'EmergencyBanner'),
      import('../stories/' + 'HealthcareModal'),
      import('../stories/' + 'ConsultationFlow')
    ])
    return
  }

  // Check connection quality
  const isSlowConnection = connectionType === '2g' || connectionType === 'slow-2g'
  if (isSlowConnection) {
    // Only preload critical components on slow connections
    await import('../stories/' + 'HealthcareCard')
    return
  }

  // Preload based on medical specialty
  const specialtyComponents = {
    cardiology: () => import('../stories/' + 'SpecialtySelector'),
    oncology: () => import('../stories/' + 'DoctorProfile'),
    default: () => import('../stories/' + 'MotivationHero')
  }

  const componentLoader = specialtyComponents[medicalSpecialty as keyof typeof specialtyComponents] 
    || specialtyComponents.default

  // Progressive preloading
  requestIdleCallback(() => {
    componentLoader()
  })
}

/**
 * Healthcare-specific bundle splitting configuration
 */
export const HEALTHCARE_CHUNKS = {
  // Emergency components - highest priority
  emergency: {
    components: ['EmergencyBanner', 'HealthcareModal'],
    priority: 'critical' as const,
    preload: true
  },
  
  // Core healthcare components
  core: {
    components: ['HealthcareCard', 'HealthcareInput', 'HealthcareButton'],
    priority: 'important' as const,
    preload: true
  },
  
  // Medical forms and consultation
  consultation: {
    components: ['ConsultationFlow', 'MedicalFAQ', 'ConsentManager'],
    priority: 'important' as const,
    preload: false
  },
  
  // Advanced medical features
  advanced: {
    components: ['DoctorProfile', 'SpecialtySelector', 'HealthcareDatePicker'],
    priority: 'standard' as const,
    preload: false
  },
  
  // Content and presentation
  content: {
    components: ['MotivationHero', 'StorySection', 'CoreValues'],
    priority: 'standard' as const,
    preload: false
  },
  
  // File handling and data management
  data: {
    components: ['FileUpload', 'HealthcareProgressBar'],
    priority: 'deferred' as const,
    preload: false
  }
} as const

/**
 * Memory-efficient component loader for healthcare devices
 */
export class HealthcareComponentLoader {
  private loadedComponents = new Set<string>()
  private loadingComponents = new Map<string, Promise<unknown>>()
  private memoryThreshold = 50 * 1024 * 1024 // 50MB threshold

  async loadComponent(componentName: string, priority: HealthcarePriority = 'standard') {
    // Check if already loaded
    if (this.loadedComponents.has(componentName)) {
      return
    }

    // Check if currently loading
    const existingPromise = this.loadingComponents.get(componentName)
    if (existingPromise) {
      return existingPromise
    }

    // Check memory constraints for mobile healthcare devices
    if (this.shouldDeferLoading(priority)) {
      console.log(`Deferring load of ${componentName} due to memory constraints`)
      return
    }

    // Create loading promise
    const loadingPromise = this.loadComponentByName(componentName)
    this.loadingComponents.set(componentName, loadingPromise)

    try {
      await loadingPromise
      this.loadedComponents.add(componentName)
      this.loadingComponents.delete(componentName)
    } catch (error) {
      this.loadingComponents.delete(componentName)
      console.error(`Failed to load healthcare component ${componentName}:`, error)
      throw error
    }
  }

  private shouldDeferLoading(priority: HealthcarePriority): boolean {
    // Never defer critical medical components
    if (priority === 'critical') return false

    // Check memory usage
    if (this.getMemoryUsage() > this.memoryThreshold) {
      return priority === 'deferred' || priority === 'standard'
    }

    return false
  }

  private getMemoryUsage(): number {
    // Use performance.memory if available (Chrome)
    if ('memory' in performance) {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } }
      return perf.memory?.usedJSHeapSize ?? 0
    }
    return 0
  }

  private async loadComponentByName(componentName: string): Promise<unknown> {
    // Dynamic imports with webpack magic comments for better chunking
    switch (componentName) {
      case 'EmergencyBanner':
        return import(
          /* webpackChunkName: "emergency-banner" */
          /* webpackPreload: true */
          '../stories/' + 'EmergencyBanner'
        )
      case 'HealthcareModal':
        return import(
          /* webpackChunkName: "healthcare-modal" */
          /* webpackPreload: true */
          '../stories/' + 'HealthcareModal'
        )
      case 'ConsultationFlow':
        return import(
          /* webpackChunkName: "consultation-flow" */
          '../stories/' + 'ConsultationFlow'
        )
      case 'DoctorProfile':
        return import(
          /* webpackChunkName: "doctor-profile" */
          '../stories/' + 'DoctorProfile'
        )
      case 'SpecialtySelector':
        return import(
          /* webpackChunkName: "specialty-selector" */
          '../stories/' + 'SpecialtySelector'
        )
      case 'MedicalFAQ':
        return import(
          /* webpackChunkName: "medical-faq" */
          '../stories/' + 'MedicalFAQ'
        )
      case 'MotivationHero':
        return import(
          /* webpackChunkName: "motivation-hero" */
          '../stories/' + 'MotivationHero'
        )
      case 'StorySection':
        return import(
          /* webpackChunkName: "story-section" */
          '../stories/' + 'StorySection'
        )
      case 'CoreValues':
        return import(
          /* webpackChunkName: "core-values" */
          '../stories/' + 'CoreValues'
        )
      case 'FileUpload':
        return import(
          /* webpackChunkName: "file-upload" */
          '../stories/' + 'FileUpload'
        )
      default:
        throw new Error(`Unknown healthcare component: ${componentName}`)
    }
  }

  // Memory cleanup for long-running medical sessions
  cleanup() {
    this.loadingComponents.clear()
    // Keep critical components loaded
    const criticalComponents = ['EmergencyBanner', 'HealthcareModal']
    this.loadedComponents.forEach(component => {
      if (!criticalComponents.includes(component)) {
        this.loadedComponents.delete(component)
      }
    })
  }
}

// Singleton instance for healthcare component loading
export const healthcareLoader = new HealthcareComponentLoader()

/**
 * Healthcare performance monitoring
 */
export const measureHealthcarePerformance = (componentName: string) => {
  const startTime = performance.now()
  
  return {
    end: () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      // Log slow loading for healthcare components (>500ms is concerning for medical UX)
      if (loadTime > 500) {
        console.warn(`Slow healthcare component load: ${componentName} took ${loadTime.toFixed(2)}ms`)
      }
      
      // Healthcare performance metrics
      return {
        componentName,
        loadTime,
        isAcceptable: loadTime < 300, // Healthcare components should load in <300ms
        isSlow: loadTime > 500,
        timestamp: new Date().toISOString()
      }
    }
  }
}

/**
 * Network-aware loading for healthcare users
 */
export const getNetworkAwareLoadingStrategy = () => {
  // Check for Network Information API
  const nav = navigator as Navigator & { connection?: unknown; mozConnection?: unknown; webkitConnection?: unknown }
  const rawConn: unknown = (nav.connection ?? nav.mozConnection ?? nav.webkitConnection)
  const connection = rawConn as { effectiveType?: string; downlink?: number } | undefined
  
  if (!connection) {
    return 'standard' // Fallback strategy
  }
  
  const { effectiveType } = connection
  
  // Optimize for healthcare users on various networks
  const dl = connection?.downlink ?? 0
  if (effectiveType === '4g' && dl > 5) {
    return 'aggressive' // Preload more components
  } else if (effectiveType === '3g' || (effectiveType === '4g' && dl < 2)) {
    return 'conservative' // Load only essential components
  } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    return 'minimal' // Emergency-only mode
  }
  
  return 'standard'
}

/**
 * Healthcare-specific intersection observer for lazy loading
 */
export const createHealthcareIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  // Optimized thresholds for healthcare content (more aggressive for mobile)
  const healthcareOptions: IntersectionObserverInit = {
    rootMargin: '50px', // Load components slightly before they're needed
    threshold: 0.1, // Trigger when 10% visible
    ...options
  }
  
  return new IntersectionObserver(callback, healthcareOptions)
}

/**
 * Service worker registration for healthcare PWA
 */
export const registerHealthcareServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/healthcare-sw.js')
      console.log('Healthcare service worker registered:', registration.scope)
      
      // Handle updates for medical applications
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Notify user of important updates for medical app
              console.log('Healthcare app update available - restart recommended')
            }
          })
        }
      })
      
      return registration
    } catch (error) {
      console.error('Healthcare service worker registration failed:', error)
    }
  }
}
