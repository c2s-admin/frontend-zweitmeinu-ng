'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, HelpCircle, X, ArrowRight, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useFAQAutoComplete,
  groupSuggestionsByType,
  getSuggestionTypeLabel,
  getSuggestionTypeIcon,
  trackAutoCompleteUsage,
  type AutoCompleteSuggestion,
  type AutoCompleteResponse
} from '@/lib/services/faqAutoComplete'

interface FAQHeroSectionProps {
  title: string
  subtitle: string
  description: string
  showSearch: boolean
  searchPlaceholder: string
  backgroundColor?: string
  onSearch?: (term: string) => void
  searchTerm?: string
  isSearching?: boolean
}

export function FAQHeroSection({
  title,
  subtitle,
  description,
  showSearch,
  searchPlaceholder,
  backgroundColor = 'bg-healthcare-primary',
  onSearch,
  searchTerm = '',
  isSearching = false
}: FAQHeroSectionProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [autoCompleteResults, setAutoCompleteResults] = useState<AutoCompleteResponse | null>(null)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300)

  // Auto-complete service
  const { getSuggestions, clearCache, cancelPendingRequests } = useFAQAutoComplete({
    maxResults: 8,
    minQueryLength: 2,
    debounceMs: 250
  })

  // Handle auto-complete suggestions
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2 && isFocused) {
      setIsLoadingSuggestions(true)
      getSuggestions(debouncedSearchTerm, (response) => {
        setAutoCompleteResults(response)
        setShowSuggestions(!!response && response.suggestions.length > 0)
        setSelectedSuggestionIndex(-1)
        setIsLoadingSuggestions(false)
      })
    } else {
      setShowSuggestions(false)
      setAutoCompleteResults(null)
      setIsLoadingSuggestions(false)
    }
  }, [debouncedSearchTerm, isFocused, getSuggestions])

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm.trim() && onSearch && !showSuggestions) {
      onSearch(debouncedSearchTerm.trim())
    }
  }, [debouncedSearchTerm, onSearch, showSuggestions])

  // Sync external search term changes
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm)
    }
  }, [searchTerm, localSearchTerm])

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingRequests()
    }
  }, [cancelPendingRequests])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If suggestion is selected, use it
    if (selectedSuggestionIndex >= 0 && autoCompleteResults?.suggestions[selectedSuggestionIndex]) {
      const selectedSuggestion = autoCompleteResults.suggestions[selectedSuggestionIndex]
      handleSuggestionSelect(selectedSuggestion)
      return
    }

    if (localSearchTerm.trim() && onSearch) {
      onSearch(localSearchTerm.trim())
      setShowSuggestions(false)
      trackAutoCompleteUsage(localSearchTerm.trim(), undefined, autoCompleteResults?.totalSuggestions)
    } else if (!localSearchTerm.trim()) {
      // If empty search, scroll to categories
      const categoriesSection = document.getElementById('faq-categories')
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleClearSearch = () => {
    setLocalSearchTerm('')
    setShowSuggestions(false)
    setAutoCompleteResults(null)
    setSelectedSuggestionIndex(-1)
    if (onSearch) {
      onSearch('')
    }
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    setSelectedSuggestionIndex(-1)

    // If user clears the input, immediately clear search
    if (!value.trim()) {
      setShowSuggestions(false)
      setAutoCompleteResults(null)
      if (onSearch) {
        onSearch('')
      }
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (localSearchTerm.trim().length >= 2 && autoCompleteResults?.suggestions.length) {
      setShowSuggestions(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || !autoCompleteResults?.suggestions.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev =>
          prev < autoCompleteResults.suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : autoCompleteResults.suggestions.length - 1
        )
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
      case 'Tab':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault()
          const selectedSuggestion = autoCompleteResults.suggestions[selectedSuggestionIndex]
          handleSuggestionSelect(selectedSuggestion)
        }
        break
    }
  }

  const handleSuggestionSelect = (suggestion: AutoCompleteSuggestion) => {
    setLocalSearchTerm(suggestion.text)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)

    // Track analytics
    trackAutoCompleteUsage(localSearchTerm, suggestion, autoCompleteResults?.totalSuggestions)

    // Perform search
    if (onSearch) {
      onSearch(suggestion.text)
    }

    // Focus input
    inputRef.current?.focus()
  }

  // Popular search suggestions
  const popularSearches = [
    'Zweitmeinung Kosten',
    'Operation notwendig',
    'Krebs Behandlung',
    'Herz Katheter',
    'Gallenblase entfernen'
  ]

  return (
    <section className={cn("py-20 text-white relative overflow-hidden", backgroundColor)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-primary-dark opacity-90" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/20 rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-white/10 rounded-full">
            <HelpCircle className="w-10 h-10 text-healthcare-accent-green" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-4 text-white/90 leading-relaxed">
            {subtitle}
          </p>

          {/* Description */}
          <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto">
            {description}
          </p>

          {/* Enhanced Search Form with Auto-Complete */}
          {showSearch && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    className={cn(
                      "w-full pl-12 pr-12 py-4 text-lg bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-healthcare-accent-green text-healthcare-primary placeholder-gray-500 transition-all duration-200",
                      showSuggestions ? "rounded-t-xl" : "rounded-xl"
                    )}
                  />

                  {/* Clear Search Button */}
                  {localSearchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-16 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  {/* Loading Indicator */}
                  {(isSearching || isLoadingSuggestions) && (
                    <div className="absolute right-16 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-healthcare-primary"></div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSearching || isLoadingSuggestions}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-healthcare-accent-green hover:bg-healthcare-accent-hover disabled:opacity-50 text-white rounded-lg transition-colors duration-300 font-medium z-10"
                >
                  {isSearching ? '...' : 'Suchen'}
                </button>

                {/* Auto-Complete Suggestions Dropdown */}
                {showSuggestions && autoCompleteResults && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-white/20 border-t-0 rounded-b-xl shadow-xl z-20 max-h-96 overflow-y-auto"
                  >
                    {autoCompleteResults.suggestions.length > 0 ? (
                      <>
                        {/* Suggestions List */}
                        <div className="py-2">
                          {Object.entries(groupSuggestionsByType(autoCompleteResults.suggestions)).map(([type, suggestions]) => (
                            <div key={type} className="mb-4 last:mb-0">
                              {/* Type Header */}
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50/50 border-b border-gray-100">
                                <span className="mr-2">{getSuggestionTypeIcon(type)}</span>
                                {getSuggestionTypeLabel(type)}
                              </div>

                              {/* Suggestions */}
                              {suggestions.map((suggestion, index) => {
                                const globalIndex = autoCompleteResults.suggestions.findIndex(s => s.id === suggestion.id)
                                const isSelected = globalIndex === selectedSuggestionIndex

                                return (
                                  <button
                                    key={suggestion.id}
                                    type="button"
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                    className={cn(
                                      "w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0",
                                      isSelected && "bg-blue-100 border-blue-200"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className="text-sm font-medium text-gray-900 truncate"
                                          dangerouslySetInnerHTML={{
                                            __html: suggestion.highlightedText || suggestion.text
                                          }}
                                        />
                                        {suggestion.description && (
                                          <div className="text-xs text-gray-500 truncate mt-1">
                                            {suggestion.description}
                                          </div>
                                        )}
                                        {suggestion.category && (
                                          <div className="text-xs text-blue-600 mt-1">
                                            📁 {suggestion.category}
                                          </div>
                                        )}
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span>↑↓ Navigation</span>
                            <span>↵ Auswählen</span>
                            <span>Esc Schließen</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{autoCompleteResults.processingTime}ms</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <div className="text-sm">Keine Vorschläge gefunden</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Versuchen Sie andere Suchbegriffe
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Enhanced Search Info */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-healthcare-accent-green" />
                  <span>
                    Intelligente Suche mit über 25 FAQs und medizinischen Begriffen
                  </span>
                </div>
                {localSearchTerm && (
                  <span className="hidden sm:inline">•</span>
                )}
                {localSearchTerm && (
                  <span className="text-healthcare-accent-green">
                    Suche nach: "{localSearchTerm}"
                  </span>
                )}
                {autoCompleteResults && (
                  <span className="hidden sm:inline">•</span>
                )}
                {autoCompleteResults && (
                  <span className="text-healthcare-accent-green">
                    {autoCompleteResults.totalSuggestions} Vorschläge
                  </span>
                )}
              </div>

              {/* Popular Searches - Show when not actively searching */}
              {!localSearchTerm && !showSuggestions && (
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-left">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Beliebte Suchbegriffe:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button type="button"
                        key={index}
                        onClick={() => {
                          setLocalSearchTerm(search)
                          setShowSuggestions(false)
                          if (onSearch) {
                            onSearch(search)
                          }
                          trackAutoCompleteUsage(search)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Search className="w-3 h-3" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Search Tips */}
              <div className="mt-6 space-y-2 text-xs text-white/60">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-healthcare-accent-green">🔍</span>
                    <span>Auto-Complete ab 2 Zeichen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-healthcare-accent-green">🏥</span>
                    <span>Medizinische Fachbegriffe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-healthcare-accent-green">⚡</span>
                    <span>Intelligente Vorschläge</span>
                  </div>
                </div>
                <div className="text-center">
                  💡 Tipp: Nutzen Sie die Pfeiltasten zur Navigation und Enter zum Auswählen der Vorschläge
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
