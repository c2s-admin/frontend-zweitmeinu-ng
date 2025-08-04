'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  groupFAQsByCategory,
  advancedFAQSearch,
  getFAQsByCategory,
  analyzeCategorizationStrategy,
  analyzeCategorizationQuality,
  type FAQSearchResponse,
  type CategorizationStats,
  type CategorizationQuality,
  type FAQPage,
  type FAQCategory,
  type FAQ
} from '@/lib/strapi/faq'
import type { DynamicZoneSection } from '@/types/strapi'
import { FAQHeroSection } from './FAQHeroSection'
import { FAQCategoriesGrid } from './FAQCategoriesGrid'
import { FAQAccordion } from './FAQAccordion'
import { FAQCTASection } from './FAQCTASection'
import { FAQSearchResults } from './FAQSearchResults'
import { FAQCategorizationInfo } from './FAQCategorizationInfo'

interface FAQHeroSection extends DynamicZoneSection {
  __component: 'sections.faq-hero'
  title: string
  subtitle?: string
  description?: string
  showSearch?: boolean
  searchPlaceholder?: string
  backgroundColor?: string
}

interface FAQCategoriesSection extends DynamicZoneSection {
  __component: 'sections.faq-categories'
  description?: string
  columns?: number
  showQuestionCount?: boolean
}

interface FAQCTASection extends DynamicZoneSection {
  __component: 'sections.faq-cta'
  icon: string
  iconColor?: string
  title: string
  description?: string
  additionalInfo?: string
  backgroundColor?: string
  textColor?: string
}

interface FAQPageWrapperProps {
  initialData: {
    faqPage: FAQPage
    categories: FAQCategory[]
    faqs: FAQ[]
  }
}

export function FAQPageWrapper({ initialData }: FAQPageWrapperProps) {
  const { faqPage, categories, faqs } = initialData

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<FAQSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Category-specific FAQ state
  const [categorizedFAQs, setCategorizedFAQs] = useState<Record<string, FAQ[]>>({})

  // Categorization analytics state
  const [categorizationStats, setCategorizationStats] = useState<CategorizationStats | null>(null)
  const [categorizationQuality, setCategorizationQuality] = useState<CategorizationQuality | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Handle search
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchTerm('')
      setSearchResults(null)
      setIsSearchMode(false)
      return
    }

    setSearchTerm(term)
    setIsSearching(true)
    setIsSearchMode(true)

    try {
      const results = await advancedFAQSearch({
        term,
        limit: 20,
        includeAnswers: true
      })

      setSearchResults(results)

      // Scroll to search results
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results')
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults({
        results: [],
        total: 0,
        searchTerm: term,
        suggestions: [],
        categories: {}
      })
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSearch(suggestion)
  }, [handleSearch])

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setSearchResults(null)
    setIsSearchMode(false)

    // Scroll back to top
    const heroSection = document.querySelector('section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Load category-specific FAQs when needed
  const loadCategoryFAQs = useCallback(async (categorySlug: string) => {
    if (categorizedFAQs[categorySlug]) {
      return categorizedFAQs[categorySlug] // Already loaded
    }

    try {
      console.log(`🔄 Loading FAQs for category: ${categorySlug}`)
      const categoryFAQs = await getFAQsByCategory(categorySlug, 15) // Load more per category

      setCategorizedFAQs(prev => ({
        ...prev,
        [categorySlug]: categoryFAQs
      }))

      return categoryFAQs
    } catch (error) {
      console.error(`Error loading FAQs for category ${categorySlug}:`, error)
      return []
    }
  }, [categorizedFAQs])

  // Analyze categorization strategy on component mount
  useEffect(() => {
    if (faqs.length > 0 && categories.length > 0) {
      const stats = analyzeCategorizationStrategy(faqs)
      const quality = analyzeCategorizationQuality(faqs, categories)

      setCategorizationStats(stats)
      setCategorizationQuality(quality)

      console.log('🚀 FAQ Categorization Analysis completed:', {
        stats,
        quality
      })
    }
  }, [faqs, categories])

  // Group FAQs by category for the grid display
  const groupedFAQs = groupFAQsByCategory(faqs, categories)

  // Extract sections from Strapi page data
  const heroSection = faqPage.sections.find(
    (s): s is FAQHeroSection => s.__component === 'sections.faq-hero'
  )
  const categoriesSection = faqPage.sections.find(
    (s): s is FAQCategoriesSection => s.__component === 'sections.faq-categories'
  )
  const ctaSection = faqPage.sections.find(
    (s): s is FAQCTASection => s.__component === 'sections.faq-cta'
  )

  return (
    <div className="min-h-screen bg-white">
      {/* FAQ Hero Section with Search */}
      {heroSection && (
        <FAQHeroSection
          title={heroSection.title}
          subtitle={heroSection.subtitle ?? ''}
          description={heroSection.description ?? ''}
          showSearch={heroSection.showSearch ?? false}
          searchPlaceholder={heroSection.searchPlaceholder ?? ''}
          backgroundColor={heroSection.backgroundColor ?? ''}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          isSearching={isSearching}
        />
      )}

      {/* Conditional Content: Search Results OR Categories + FAQs */}
      {isSearchMode ? (
        <>
          {/* Search Results */}
          <FAQSearchResults
            searchResponse={searchResults}
            isLoading={isSearching}
            onClearSearch={handleClearSearch}
            onSuggestionClick={handleSuggestionClick}
          />
        </>
      ) : (
        <>
          {/* FAQ Categories Grid */}
          {categoriesSection && categories.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container-custom">
                <FAQCategoriesGrid
                  categories={categories}
                  description={categoriesSection.description}
                  columns={categoriesSection.columns}
                  showQuestionCount={categoriesSection.showQuestionCount}
                  groupedFAQs={groupedFAQs}
                />

                {/* User-friendly Categorization Info - Production Ready */}
                {categorizationStats && categorizationQuality && (
                  <div className="mt-12">
                    <FAQCategorizationInfo
                      stats={categorizationStats}
                      quality={categorizationQuality}
                      totalCategories={categories.length}
                    />
                  </div>
                )}

                {/* Enhanced Categorization Debug Panel - Only in Development */}
                {process.env.NODE_ENV === 'development' && categorizationStats && categorizationQuality && (
                  <div className="mt-12">
                    <button type="button"
                      onClick={() => setShowDebugInfo(!showDebugInfo)}
                      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {showDebugInfo ? 'Hide' : 'Show'} Categorization Analytics
                    </button>

                    {showDebugInfo && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🧠 Intelligent Hybrid Categorization Analytics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Strategy Statistics */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-700">Categorization Strategy</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-medium capitalize">{categorizationStats.method}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>API Health:</span>
                                <span className={`font-medium ${
                                  categorizationStats.apiHealth === 'healthy' ? 'text-green-600' :
                                  categorizationStats.apiHealth === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {categorizationStats.apiHealth}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Processing Time:</span>
                                <span className="font-medium">{categorizationStats.processingTime}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cache Hits:</span>
                                <span className="font-medium">{categorizationStats.cacheHits}/{categorizationStats.totalFAQs}</span>
                              </div>
                            </div>
                          </div>

                          {/* Data Distribution */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-700">Data Distribution</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Strapi Relations:</span>
                                <span className="font-medium text-blue-600">{categorizationStats.strapiRelations}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Keyword-based:</span>
                                <span className="font-medium text-green-600">{categorizationStats.keywordBased}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Uncategorized:</span>
                                <span className="font-medium text-red-600">{categorizationStats.uncategorized}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Confidence:</span>
                                <span className="font-medium">{Math.round(categorizationStats.confidence * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quality Analysis */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-3">Quality Analysis</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.round(categorizationQuality.overallScore * 100)}%
                              </div>
                              <div className="text-sm text-gray-600">Overall Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {Math.round(categorizationQuality.relationsCoverage * 100)}%
                              </div>
                              <div className="text-sm text-gray-600">Relations Coverage</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {Math.round(categorizationQuality.categoryCoverage * 100)}%
                              </div>
                              <div className="text-sm text-gray-600">Category Coverage</div>
                            </div>
                          </div>

                          {/* Recommendations */}
                          {categorizationQuality.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">💡 Recommendations:</h5>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {categorizationQuality.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Category Distribution */}
                        {Object.keys(categorizationStats.categoryDistribution).length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-3">Category Distribution</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {Object.entries(categorizationStats.categoryDistribution).map(([category, count]) => (
                                <div key={category} className="bg-gray-50 px-3 py-2 rounded-lg">
                                  <div className="text-sm font-medium text-gray-900">{count}</div>
                                  <div className="text-xs text-gray-600 capitalize">
                                    {category.replace('-', ' ').substring(0, 20)}...
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FAQ Content by Categories */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <div className="space-y-16">
                {categories.map((category: FAQCategory) => {
                  // Use the keyword-based categorized FAQs
                  const categoryFAQs = groupedFAQs[category.slug] || []

                  if (categoryFAQs.length === 0) return null

                  return (
                    <FAQAccordion
                      key={category.id}
                      category={category}
                      faqs={categoryFAQs}
                    />
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FAQ CTA Section - Always visible */}
      {ctaSection && (
        <FAQCTASection
          icon={ctaSection.icon}
          iconColor={ctaSection.iconColor ?? ''}
          title={ctaSection.title}
          description={ctaSection.description ?? ''}
          additionalInfo={ctaSection.additionalInfo}
          backgroundColor={ctaSection.backgroundColor ?? ''}
          textColor={ctaSection.textColor ?? ''}
        />
      )}
    </div>
  )
}
