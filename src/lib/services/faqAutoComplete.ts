'use client'

// FAQ Auto-Complete Service
// Handles intelligent auto-complete suggestions with medical terms, fuzzy search, and performance optimization

export interface AutoCompleteSuggestion {
  id: string
  text: string
  type: 'faq' | 'medical-term' | 'popular-search' | 'category'
  category?: string
  description?: string
  highlightedText?: string
  score: number
}

export interface AutoCompleteResponse {
  suggestions: AutoCompleteSuggestion[]
  searchTerm: string
  totalSuggestions: number
  processingTime: number
}

export interface AutoCompleteOptions {
  maxResults?: number
  minQueryLength?: number
  debounceMs?: number
  cacheResults?: boolean
}

// Default options
const DEFAULT_OPTIONS: Required<AutoCompleteOptions> = {
  maxResults: 10,
  minQueryLength: 2,
  debounceMs: 300,
  cacheResults: true
}

// Cache for auto-complete results
const autoCompleteCache = new Map<string, { data: AutoCompleteResponse; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

// Debounce utility
function debounce<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  delay: number
): (...args: Args) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Auto-Complete Service Class
export class FAQAutoCompleteService {
  private options: Required<AutoCompleteOptions>
  private abortController: AbortController | null = null
  private debouncedFetch: (query: string, callback: (suggestions: AutoCompleteResponse | null) => void) => void

  constructor(options: AutoCompleteOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }

    // Create debounced fetch function
    this.debouncedFetch = debounce(
      (query: string, callback: (suggestions: AutoCompleteResponse | null) => void) => {
        this.fetchSuggestions(query).then(callback)
      },
      this.options.debounceMs
    )
  }

  // Main method to get auto-complete suggestions
  async getSuggestions(
    query: string,
    callback?: (suggestions: AutoCompleteResponse | null) => void
  ): Promise<AutoCompleteResponse | null> {
    // Validate query length
    if (!query || query.trim().length < this.options.minQueryLength) {
      const emptyResponse = {
        suggestions: [],
        searchTerm: query,
        totalSuggestions: 0,
        processingTime: 0
      }
      callback?.(emptyResponse)
      return emptyResponse
    }

    // For immediate response (non-debounced), fetch directly
    if (!callback) {
      return this.fetchSuggestions(query)
    }

    // For debounced response, use debounced function
    this.debouncedFetch(query, callback)
    return null // Will call callback asynchronously
  }

  // Fetch suggestions from API
  private async fetchSuggestions(query: string): Promise<AutoCompleteResponse | null> {
    try {
      // Check cache first
      if (this.options.cacheResults) {
        const cacheKey = `${query.toLowerCase()}-${this.options.maxResults}`
        const cached = autoCompleteCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          console.log('🎯 Auto-complete cache hit:', query)
          return cached.data
        }
      }

      // Cancel previous request if still pending
      if (this.abortController) {
        this.abortController.abort()
      }
      this.abortController = new AbortController()

      // Make API request
      const searchParams = new URLSearchParams({
        q: query.trim(),
        limit: this.options.maxResults.toString()
      })

      const response = await fetch(`/api/faq/autocomplete?${searchParams}`, {
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Auto-complete rate limit exceeded')
          return null
        }
        throw new Error(`Auto-complete API error: ${response.statusText}`)
      }

      const data: AutoCompleteResponse = await response.json()

      // Cache the result
      if (this.options.cacheResults) {
        const cacheKey = `${query.toLowerCase()}-${this.options.maxResults}`
        autoCompleteCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
      }

      console.log(`🔍 Auto-complete fetched: "${query}" -> ${data.totalSuggestions} suggestions (${data.processingTime}ms)`)
      return data

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, this is expected
        return null
      }

      console.error('Error fetching auto-complete suggestions:', error)
      return null
    }
  }

  // Clear cache
  clearCache(): void {
    autoCompleteCache.clear()
    console.log('🧹 Auto-complete cache cleared')
  }

  // Update options
  updateOptions(newOptions: Partial<AutoCompleteOptions>): void {
    this.options = { ...this.options, ...newOptions }

    // Recreate debounced function if debounce time changed
    if (newOptions.debounceMs) {
      this.debouncedFetch = debounce(
        (query: string, callback: (suggestions: AutoCompleteResponse | null) => void) => {
          this.fetchSuggestions(query).then(callback)
        },
        this.options.debounceMs
      )
    }
  }

  // Cancel any pending requests
  cancelPendingRequests(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}

// Global instance for easy use
export const faqAutoComplete = new FAQAutoCompleteService()

// Hook for React components
export function useFAQAutoComplete(options: AutoCompleteOptions = {}) {
  const service = new FAQAutoCompleteService(options)

  return {
    getSuggestions: service.getSuggestions.bind(service),
    clearCache: service.clearCache.bind(service),
    updateOptions: service.updateOptions.bind(service),
    cancelPendingRequests: service.cancelPendingRequests.bind(service)
  }
}

// Utility functions for suggestion handling
export function groupSuggestionsByType(suggestions: AutoCompleteSuggestion[]): {
  [key: string]: AutoCompleteSuggestion[]
} {
  return suggestions.reduce((groups, suggestion) => {
    const type = suggestion.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(suggestion)
    return groups
  }, {} as { [key: string]: AutoCompleteSuggestion[] })
}

export function getSuggestionTypeLabel(type: string): string {
  const typeLabels: { [key: string]: string } = {
    'faq': 'FAQ-Fragen',
    'medical-term': 'Medizinische Begriffe',
    'popular-search': 'Beliebte Suchen',
    'category': 'Kategorien'
  }
  return typeLabels[type] || type
}

export function getSuggestionTypeIcon(type: string): string {
  const typeIcons: { [key: string]: string } = {
    'faq': '❓',
    'medical-term': '🏥',
    'popular-search': '🔥',
    'category': '📁'
  }
  return typeIcons[type] || '💡'
}

// Analytics helpers
export function trackAutoCompleteUsage(
  query: string,
  selectedSuggestion?: AutoCompleteSuggestion,
  totalSuggestions?: number
): void {
  if (typeof window === 'undefined') return

  const analyticsEvent = {
    event: 'faq_autocomplete_usage',
    query,
    queryLength: query.length,
    selectedSuggestion: selectedSuggestion ? {
      text: selectedSuggestion.text,
      type: selectedSuggestion.type,
      score: selectedSuggestion.score
    } : null,
    totalSuggestions: totalSuggestions || 0,
    timestamp: new Date().toISOString()
  }

  console.log('📊 Auto-complete analytics:', analyticsEvent)

  // In production, send to your analytics service:
  // analytics.track('faq_autocomplete_usage', analyticsEvent)
}

// Validation helpers
export function validateQuery(query: string, minLength: number = 2): {
  isValid: boolean
  error?: string
} {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Query muss ein String sein' }
  }

  const trimmed = query.trim()
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Query muss mindestens ${minLength} Zeichen lang sein` }
  }

  // Check for potentially problematic characters
  if (/[<>\"']/g.test(trimmed)) {
    return { isValid: false, error: 'Query enthält ungültige Zeichen' }
  }

  return { isValid: true }
}

// Performance monitoring
export function measureAutoCompletePerformance<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now()

  return operation().then(result => {
    const endTime = performance.now()
    const duration = endTime - startTime

    console.log(`⚡ Auto-complete ${operationName}: ${duration.toFixed(2)}ms`)

    // Log slow operations
    if (duration > 500) {
      console.warn(`🐌 Slow auto-complete ${operationName}: ${duration.toFixed(2)}ms`)
    }

    return result
  })
}
