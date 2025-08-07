/**
 * Healthcare Bundle Analyzer
 * 
 * Monitors and reports on bundle sizes for healthcare components
 * Critical for mobile medical users with limited data plans
 */

interface BundleStats {
  componentName: string
  bundleSize: number
  gzippedSize: number
  loadTime: number
  dependencies: string[]
  isHealthcareCritical: boolean
  memoryUsage?: number
}

interface HealthcarePerformanceReport {
  totalBundleSize: number
  criticalPathSize: number
  emergencyComponentsSize: number
  mobileOptimizationScore: number
  recommendations: string[]
  components: BundleStats[]
}

/**
 * Bundle size analyzer for healthcare components
 */
export class HealthcareBundleAnalyzer {
  private stats: Map<string, BundleStats> = new Map()
  private performanceObserver?: PerformanceObserver
  
  constructor() {
    this.initializePerformanceObserver()
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name.includes('healthcare') || entry.name.includes('medical')) {
            this.recordComponentLoad(entry as PerformanceNavigationTiming)
          }
        })
      })
      
      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'resource'] })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }
    }
  }

  /**
   * Record component loading stats
   */
  recordComponentLoad(entry: PerformanceNavigationTiming | PerformanceResourceTiming) {
    const componentName = this.extractComponentName(entry.name)
    if (!componentName) return

    const stats: BundleStats = {
      componentName,
      bundleSize: entry.transferSize || 0,
      gzippedSize: entry.encodedBodySize || 0,
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      dependencies: this.extractDependencies(entry.name),
      isHealthcareCritical: this.isHealthcareCritical(componentName),
      memoryUsage: this.getMemoryUsage()
    }

    this.stats.set(componentName, stats)
    
    // Log warnings for large healthcare components
    if (stats.bundleSize > 100 * 1024) { // 100KB
      console.warn(`Large healthcare component: ${componentName} is ${(stats.bundleSize / 1024).toFixed(1)}KB`)
    }
    
    if (stats.loadTime > 500 && stats.isHealthcareCritical) {
      console.warn(`Slow critical healthcare component: ${componentName} took ${stats.loadTime.toFixed(1)}ms`)
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(): HealthcarePerformanceReport {
    const components = Array.from(this.stats.values())
    const totalBundleSize = components.reduce((sum, comp) => sum + comp.bundleSize, 0)
    const criticalComponents = components.filter(comp => comp.isHealthcareCritical)
    const criticalPathSize = criticalComponents.reduce((sum, comp) => sum + comp.bundleSize, 0)
    const emergencyComponents = components.filter(comp => 
      comp.componentName.includes('Emergency') || 
      comp.componentName.includes('emergency') ||
      comp.componentName.includes('Modal')
    )
    const emergencyComponentsSize = emergencyComponents.reduce((sum, comp) => sum + comp.bundleSize, 0)

    const mobileOptimizationScore = this.calculateMobileScore(components)
    const recommendations = this.generateRecommendations(components)

    return {
      totalBundleSize,
      criticalPathSize,
      emergencyComponentsSize,
      mobileOptimizationScore,
      recommendations,
      components
    }
  }

  /**
   * Calculate mobile optimization score (0-100)
   */
  private calculateMobileScore(components: BundleStats[]): number {
    let score = 100
    
    // Penalize large bundles
    const totalSize = components.reduce((sum, comp) => sum + comp.bundleSize, 0)
    if (totalSize > 1024 * 1024) { // 1MB
      score -= 30
    } else if (totalSize > 512 * 1024) { // 512KB
      score -= 15
    }
    
    // Penalize slow loading critical components
    const slowCriticalComponents = components.filter(comp => 
      comp.isHealthcareCritical && comp.loadTime > 300
    )
    score -= slowCriticalComponents.length * 10
    
    // Penalize components without code splitting
    const largeComponents = components.filter(comp => comp.bundleSize > 50 * 1024)
    score -= largeComponents.length * 5
    
    // Bonus for emergency components optimization
    const optimizedEmergencyComponents = components.filter(comp =>
      comp.componentName.includes('Emergency') && comp.bundleSize < 30 * 1024
    )
    score += optimizedEmergencyComponents.length * 5

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(components: BundleStats[]): string[] {
    const recommendations: string[] = []
    
    // Large bundle recommendations
    const totalSize = components.reduce((sum, comp) => sum + comp.bundleSize, 0)
    if (totalSize > 800 * 1024) {
      recommendations.push('Consider implementing more aggressive code splitting for healthcare mobile users')
    }
    
    // Slow critical components
    const slowCritical = components.filter(comp => 
      comp.isHealthcareCritical && comp.loadTime > 300
    )
    if (slowCritical.length > 0) {
      recommendations.push(`Optimize critical healthcare components: ${slowCritical.map(c => c.componentName).join(', ')}`)
    }
    
    // Large individual components
    const largeComponents = components.filter(comp => comp.bundleSize > 100 * 1024)
    if (largeComponents.length > 0) {
      recommendations.push(`Split large components into smaller chunks: ${largeComponents.map(c => c.componentName).join(', ')}`)
    }
    
    // Memory usage recommendations
    const highMemoryComponents = components.filter(comp => 
      comp.memoryUsage && comp.memoryUsage > 50 * 1024 * 1024
    )
    if (highMemoryComponents.length > 0) {
      recommendations.push('Consider implementing component cleanup for memory-intensive healthcare components')
    }
    
    // Emergency components optimization
    const emergencyComponents = components.filter(comp => 
      comp.componentName.includes('Emergency') && comp.bundleSize > 50 * 1024
    )
    if (emergencyComponents.length > 0) {
      recommendations.push('Emergency components should be under 50KB for critical medical situations')
    }
    
    // Mobile-specific recommendations
    if (this.isMobileDevice()) {
      recommendations.push('Detected mobile device - prioritize emergency components preloading')
      recommendations.push('Consider implementing service worker caching for offline medical access')
    }
    
    return recommendations
  }

  /**
   * Extract component name from resource URL
   */
  private extractComponentName(url: string): string | null {
    const matches = url.match(/\/([A-Za-z]+(?:Healthcare|Medical|Emergency|Doctor|Patient)[A-Za-z]*)\./i) ||
                   url.match(/\/stories\/([A-Za-z]+)\./i) ||
                   url.match(/healthcare-([a-z-]+)/i)
    
    return matches ? matches[1] : null
  }

  /**
   * Extract component dependencies from bundle
   */
  private extractDependencies(url: string): string[] {
    // This would be enhanced with actual webpack bundle analysis
    const commonDeps = ['react', 'react-dom']
    const healthcareDeps = ['lucide-react', 'clsx']
    
    if (url.includes('lucide')) {
      return [...commonDeps, 'lucide-react']
    }
    
    return commonDeps
  }

  /**
   * Check if component is critical for healthcare
   */
  private isHealthcareCritical(componentName: string): boolean {
    const criticalComponents = [
      'EmergencyBanner',
      'HealthcareModal',
      'HealthcareButton',
      'HealthcareInput',
      'HealthcareCard',
      'ConsultationFlow'
    ]
    
    return criticalComponents.some(critical => 
      componentName.toLowerCase().includes(critical.toLowerCase())
    )
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return undefined
  }

  /**
   * Detect mobile device
   */
  private isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768)
  }

  /**
   * Export report as JSON
   */
  exportReport(): string {
    const report = this.generateReport()
    return JSON.stringify(report, null, 2)
  }

  /**
   * Clear all stats
   */
  clear() {
    this.stats.clear()
  }

  /**
   * Get stats for specific component
   */
  getComponentStats(componentName: string): BundleStats | undefined {
    return this.stats.get(componentName)
  }

  /**
   * Get all component names being tracked
   */
  getTrackedComponents(): string[] {
    return Array.from(this.stats.keys())
  }
}

// Singleton instance
export const healthcareBundleAnalyzer = new HealthcareBundleAnalyzer()

/**
 * Healthcare-specific webpack bundle analysis
 */
export const analyzeHealthcareBundle = async (stats: any) => {
  const healthcareChunks = stats.chunks.filter((chunk: any) =>
    chunk.name.includes('healthcare') || 
    chunk.name.includes('medical') ||
    chunk.name.includes('emergency')
  )

  const analysis = {
    totalHealthcareSize: 0,
    criticalPathSize: 0,
    emergencySize: 0,
    chunks: healthcareChunks.map((chunk: any) => ({
      name: chunk.name,
      size: chunk.size,
      modules: chunk.modules?.length || 0,
      isAsync: !chunk.initial
    }))
  }

  analysis.totalHealthcareSize = healthcareChunks.reduce((sum: number, chunk: any) => sum + chunk.size, 0)
  analysis.emergencySize = healthcareChunks
    .filter((chunk: any) => chunk.name.includes('emergency'))
    .reduce((sum: number, chunk: any) => sum + chunk.size, 0)

  return analysis
}

/**
 * Generate Lighthouse-style performance report for healthcare
 */
export const generateHealthcareLighthouseReport = (bundleStats: BundleStats[]) => {
  const metrics = {
    'First Contentful Paint': calculateFCP(bundleStats),
    'Largest Contentful Paint': calculateLCP(bundleStats),
    'Total Blocking Time': calculateTBT(bundleStats),
    'Cumulative Layout Shift': calculateCLS(bundleStats),
    'Speed Index': calculateSI(bundleStats),
    'Emergency Component Load Time': calculateEmergencyLoadTime(bundleStats)
  }

  const score = calculateOverallHealthcareScore(metrics)

  return {
    score,
    metrics,
    category: 'Healthcare Performance',
    recommendations: generateLighthouseRecommendations(metrics, bundleStats)
  }
}

// Helper functions for Lighthouse-style metrics
function calculateFCP(stats: BundleStats[]): number {
  const criticalStats = stats.filter(s => s.isHealthcareCritical)
  return criticalStats.length > 0 ? Math.min(...criticalStats.map(s => s.loadTime)) : 0
}

function calculateLCP(stats: BundleStats[]): number {
  return stats.length > 0 ? Math.max(...stats.map(s => s.loadTime)) : 0
}

function calculateTBT(stats: BundleStats[]): number {
  return stats.reduce((sum, stat) => sum + Math.max(0, stat.loadTime - 50), 0)
}

function calculateCLS(stats: BundleStats[]): number {
  // Simplified CLS calculation based on component loading
  return stats.filter(s => s.loadTime > 200).length * 0.1
}

function calculateSI(stats: BundleStats[]): number {
  const totalTime = stats.reduce((sum, stat) => sum + stat.loadTime, 0)
  return totalTime / stats.length || 0
}

function calculateEmergencyLoadTime(stats: BundleStats[]): number {
  const emergencyComponents = stats.filter(s => 
    s.componentName.includes('Emergency') || s.componentName.includes('emergency')
  )
  return emergencyComponents.length > 0 ? 
    emergencyComponents.reduce((sum, s) => sum + s.loadTime, 0) / emergencyComponents.length : 0
}

function calculateOverallHealthcareScore(metrics: Record<string, number>): number {
  // Healthcare-weighted scoring
  const weights = {
    'First Contentful Paint': 0.25,
    'Largest Contentful Paint': 0.20,
    'Total Blocking Time': 0.15,
    'Cumulative Layout Shift': 0.10,
    'Speed Index': 0.15,
    'Emergency Component Load Time': 0.15 // Critical for healthcare
  }

  let totalScore = 0
  let totalWeight = 0

  Object.entries(metrics).forEach(([metric, value]) => {
    const weight = weights[metric as keyof typeof weights] || 0
    // Convert values to 0-100 scores (simplified)
    const normalizedScore = Math.max(0, 100 - (value / 10))
    totalScore += normalizedScore * weight
    totalWeight += weight
  })

  return Math.round(totalScore / totalWeight)
}

function generateLighthouseRecommendations(
  metrics: Record<string, number>, 
  stats: BundleStats[]
): string[] {
  const recommendations: string[] = []

  if (metrics['Emergency Component Load Time'] > 300) {
    recommendations.push('Emergency components load too slowly - optimize for critical medical situations')
  }

  if (metrics['First Contentful Paint'] > 2000) {
    recommendations.push('First Contentful Paint is slow - preload critical healthcare resources')
  }

  if (metrics['Total Blocking Time'] > 500) {
    recommendations.push('High blocking time - implement code splitting for healthcare components')
  }

  return recommendations
}