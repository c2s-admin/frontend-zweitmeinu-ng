/**
 * Healthcare Performance Monitor
 * 
 * Real-time performance monitoring for healthcare applications:
 * - Critical component load time tracking
 * - Memory usage monitoring for long medical sessions
 * - Network quality detection for mobile medical users
 * - Emergency performance alerts
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { healthcareBundleAnalyzer, measureHealthcarePerformance } from '../lib/bundle-analyzer'
import { getNetworkAwareLoadingStrategy, registerHealthcareServiceWorker } from '../lib/performance'

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  memoryUsage?: number
  networkType?: string
  emergencyComponentLoadTime?: number
  criticalComponentFailures: number
}

export interface HealthcarePerformanceMonitorProps {
  /** Enable detailed performance logging */
  enableLogging?: boolean
  /** Performance alert threshold in milliseconds */
  alertThreshold?: number
  /** Monitor emergency components specifically */
  monitorEmergency?: boolean
  /** Callback for performance alerts */
  onPerformanceAlert?: (metric: string, value: number, severity: 'warning' | 'critical') => void
  /** Enable service worker registration */
  enableServiceWorker?: boolean
}

export const HealthcarePerformanceMonitor = ({
  enableLogging = true,
  alertThreshold = 3000,
  monitorEmergency = true,
  onPerformanceAlert,
  enableServiceWorker = true
}: HealthcarePerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    criticalComponentFailures: 0
  })
  
  const [networkStrategy, setNetworkStrategy] = useState<string>('standard')
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const performanceObserverRef = useRef<PerformanceObserver | null>(null)
  const emergencyComponentTimesRef = useRef<Map<string, number>>(new Map())

  // Initialize performance monitoring
  useEffect(() => {
    initializePerformanceMonitoring()
    if (enableServiceWorker) {
      registerHealthcareServiceWorker()
    }
    
    return cleanup
  }, [enableServiceWorker])

  // Network strategy monitoring
  useEffect(() => {
    const strategy = getNetworkAwareLoadingStrategy()
    setNetworkStrategy(strategy)
    setIsSlowConnection(strategy === 'minimal' || strategy === 'conservative')
    
    if (enableLogging) {
      console.log(`Healthcare network strategy: ${strategy}`)
    }
  }, [enableLogging])

  const initializePerformanceMonitoring = useCallback(() => {
    // Web Vitals monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Monitor paint timing
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }))
              
              // Alert if FCP is too slow for healthcare
              if (entry.startTime > 2500) {
                onPerformanceAlert?.('First Contentful Paint', entry.startTime, 'warning')
              }
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })

        // Monitor largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lastEntry.startTime
          }))
          
          // Critical alert if LCP is too slow for medical applications
          if (lastEntry.startTime > alertThreshold) {
            onPerformanceAlert?.('Largest Contentful Paint', lastEntry.startTime, 'critical')
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Monitor layout shifts
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          })
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: cls
          }))
          
          // Alert on high layout shift (problematic for medical forms)
          if (cls > 0.25) {
            onPerformanceAlert?.('Cumulative Layout Shift', cls, 'warning')
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        performanceObserverRef.current = lcpObserver

        // Monitor resource loading for healthcare components
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            const resource = entry as PerformanceResourceTiming
            
            // Track emergency component loading
            if (monitorEmergency && isEmergencyResource(resource.name)) {
              const loadTime = resource.responseEnd - resource.startTime
              emergencyComponentTimesRef.current.set(resource.name, loadTime)
              
              setMetrics(prev => ({
                ...prev,
                emergencyComponentLoadTime: Math.max(prev.emergencyComponentLoadTime || 0, loadTime)
              }))
              
              // Critical alert for slow emergency components
              if (loadTime > 1000) {
                onPerformanceAlert?.('Emergency Component Load', loadTime, 'critical')
              }
            }
            
            // Track failed resource loads
            if (resource.responseStart === 0) {
              setMetrics(prev => ({
                ...prev,
                criticalComponentFailures: prev.criticalComponentFailures + 1
              }))
            }
          })
        })
        resourceObserver.observe({ entryTypes: ['resource'] })

      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error)
      }
    }

    // Memory usage monitoring for long medical sessions
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memoryMonitor = setInterval(() => {
        const memory = (performance as any).memory
        if (memory) {
          const memoryUsage = memory.usedJSHeapSize
          setMetrics(prev => ({
            ...prev,
            memoryUsage
          }))
          
          // Alert on high memory usage (important for mobile medical devices)
          if (memoryUsage > 100 * 1024 * 1024) { // 100MB
            onPerformanceAlert?.('Memory Usage', memoryUsage, 'warning')
          }
        }
      }, 30000) // Check every 30 seconds
      
      return () => clearInterval(memoryMonitor)
    }
  }, [alertThreshold, monitorEmergency, onPerformanceAlert])

  const cleanup = useCallback(() => {
    if (performanceObserverRef.current) {
      performanceObserverRef.current.disconnect()
    }
  }, [])

  // Component load time measurement hook
  const measureComponentLoad = useCallback((componentName: string) => {
    const measurement = measureHealthcarePerformance(componentName)
    
    return {
      end: () => {
        const result = measurement.end()
        
        // Record in bundle analyzer
        healthcareBundleAnalyzer.recordComponentLoad({
          name: componentName,
          loadEventStart: performance.now() - result.loadTime,
          loadEventEnd: performance.now(),
          transferSize: 0,
          encodedBodySize: 0
        } as PerformanceNavigationTiming)
        
        // Alert on slow components
        if (!result.isAcceptable) {
          onPerformanceAlert?.(
            `Component Load: ${componentName}`, 
            result.loadTime, 
            result.isSlow ? 'critical' : 'warning'
          )
        }
        
        return result
      }
    }
  }, [onPerformanceAlert])

  // Report current performance status
  const getPerformanceReport = useCallback(() => {
    return {
      ...metrics,
      networkStrategy,
      isSlowConnection,
      emergencyComponentTimes: Object.fromEntries(emergencyComponentTimesRef.current),
      bundleAnalysis: healthcareBundleAnalyzer.generateReport(),
      recommendations: generateHealthcareRecommendations()
    }
  }, [metrics, networkStrategy, isSlowConnection])

  const generateHealthcareRecommendations = useCallback(() => {
    const recommendations: string[] = []
    
    if (metrics.firstContentfulPaint > 2500) {
      recommendations.push('Consider preloading critical healthcare components')
    }
    
    if (metrics.largestContentfulPaint > 4000) {
      recommendations.push('Optimize images and reduce bundle size for mobile medical users')
    }
    
    if (metrics.cumulativeLayoutShift > 0.25) {
      recommendations.push('Fix layout shifts that could disrupt medical form completion')
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 80 * 1024 * 1024) {
      recommendations.push('Implement memory cleanup for long medical consultation sessions')
    }
    
    if (metrics.criticalComponentFailures > 0) {
      recommendations.push('Address component loading failures - critical for medical applications')
    }
    
    if (isSlowConnection) {
      recommendations.push('Detected slow connection - enable emergency-only mode')
    }
    
    return recommendations
  }, [metrics, isSlowConnection])

  // Export performance data (for analytics)
  const exportPerformanceData = useCallback(() => {
    const report = getPerformanceReport()
    
    if (enableLogging) {
      console.log('Healthcare Performance Report:', report)
    }
    
    // Could send to analytics service here
    return JSON.stringify(report, null, 2)
  }, [getPerformanceReport, enableLogging])

  // Helper functions
  const isEmergencyResource = (url: string) => {
    return url.includes('emergency') || 
           url.includes('Emergency') || 
           url.includes('modal') || 
           url.includes('Modal') ||
           url.includes('notfall')
  }

  // Emergency performance check
  const checkEmergencyPerformance = useCallback(() => {
    const emergencyTimes = Array.from(emergencyComponentTimesRef.current.values())
    if (emergencyTimes.length === 0) return true
    
    const avgEmergencyLoadTime = emergencyTimes.reduce((sum, time) => sum + time, 0) / emergencyTimes.length
    return avgEmergencyLoadTime < 1000 // Emergency components should load in <1s
  }, [])

  // Expose monitoring functions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add performance monitor to window for debugging
      ;(window as any).healthcarePerformance = {
        getReport: getPerformanceReport,
        exportData: exportPerformanceData,
        measureComponent: measureComponentLoad,
        checkEmergency: checkEmergencyPerformance,
        getCurrentMetrics: () => metrics
      }
    }
  }, [getPerformanceReport, exportPerformanceData, measureComponentLoad, checkEmergencyPerformance, metrics])

  // Performance status indicator (for development)
  if (process.env.NODE_ENV === 'development' && enableLogging) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-xs"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="text-green-600 font-semibold">Healthcare Performance Monitor</div>
        <div>FCP: {Math.round(metrics.firstContentfulPaint)}ms</div>
        <div>LCP: {Math.round(metrics.largestContentfulPaint)}ms</div>
        <div>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</div>
        {metrics.memoryUsage && (
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
        )}
        <div className={`text-${isSlowConnection ? 'red' : 'green'}-600`}>
          Network: {networkStrategy}
        </div>
        {metrics.emergencyComponentLoadTime && (
          <div className={`text-${metrics.emergencyComponentLoadTime > 1000 ? 'red' : 'green'}-600`}>
            Emergency: {Math.round(metrics.emergencyComponentLoadTime)}ms
          </div>
        )}
      </div>
    )
  }

  // Return null in production (monitoring runs in background)
  return null
}

// Hook for component-level performance monitoring
export const useHealthcarePerformance = (componentName: string) => {
  const measurementRef = useRef<ReturnType<typeof measureHealthcarePerformance> | null>(null)
  
  useEffect(() => {
    measurementRef.current = measureHealthcarePerformance(componentName)
    
    return () => {
      if (measurementRef.current) {
        const result = measurementRef.current.end()
        console.log(`Healthcare component ${componentName} performance:`, result)
      }
    }
  }, [componentName])
  
  return {
    startMeasurement: () => {
      measurementRef.current = measureHealthcarePerformance(componentName)
    },
    endMeasurement: () => {
      if (measurementRef.current) {
        return measurementRef.current.end()
      }
      return null
    }
  }
}

export default HealthcarePerformanceMonitor