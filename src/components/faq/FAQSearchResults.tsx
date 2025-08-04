'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  X,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Clock,
  Tag,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQSearchResult, FAQSearchResponse } from '@/lib/strapi/faq'
import {
  submitVote,
  getUserVote,
  hasUserVoted,
  getVoteSummary,
  trackVotePattern,
  type VoteResponse
} from '@/lib/services/faqVoting'
import { logger } from '@/lib/logger'

interface FAQSearchResultsProps {
  searchResponse: FAQSearchResponse | null
  isLoading: boolean
  onClearSearch: () => void
  onSuggestionClick: (suggestion: string) => void
}

export function FAQSearchResults({
  searchResponse,
  isLoading,
  onClearSearch,
  onSuggestionClick
}: FAQSearchResultsProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [userVotes, setUserVotes] = useState<Record<number, boolean | null>>({})
  const [voteLoading, setVoteLoading] = useState<Record<number, boolean>>({})
  const [voteErrors, setVoteErrors] = useState<Record<number, string>>({})
  const [voteSuccess, setVoteSuccess] = useState<Record<number, boolean>>({})
  const [optimisticCounts, setOptimisticCounts] = useState<Record<number, { helpful: number; notHelpful: number }>>({})

  // Load user votes from localStorage when search results change
  useEffect(() => {
    if (searchResponse?.results) {
      const userVoteStatus: Record<number, boolean | null> = {}
      searchResponse.results.forEach(result => {
        userVoteStatus[result.id] = getUserVote(result.id)
      })
      setUserVotes(userVoteStatus)
    }
  }, [searchResponse])

  const toggleItem = (faqId: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(faqId)) {
      newOpenItems.delete(faqId)
    } else {
      newOpenItems.add(faqId)
    }
    setOpenItems(newOpenItems)
  }

  const handleVote = async (faqId: number, isHelpful: boolean) => {
    // Check if user has already voted
    if (hasUserVoted(faqId)) {
      setVoteErrors(prev => ({
        ...prev,
        [faqId]: 'Sie haben bereits für diese FAQ abgestimmt.'
      }))
      return
    }

    // Clear previous errors
    setVoteErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[faqId]
      return newErrors
    })

    // Set loading state
    setVoteLoading(prev => ({
      ...prev,
      [faqId]: true
    }))

    // Find the FAQ result to get current counts
    const result = searchResponse?.results.find(r => r.id === faqId)
    if (!result) {
      setVoteErrors(prev => ({
        ...prev,
        [faqId]: 'FAQ nicht gefunden.'
      }))
      setVoteLoading(prev => {
        const newLoading = { ...prev }
        delete newLoading[faqId]
        return newLoading
      })
      return
    }

    try {
      await submitVote(
        faqId,
        isHelpful,
        // Optimistic update callback
        (faqId: number, isHelpful: boolean) => {
          setOptimisticCounts(prev => ({
            ...prev,
            [faqId]: {
              helpful: result.helpfulCount + (isHelpful ? 1 : 0),
              notHelpful: result.notHelpfulCount + (isHelpful ? 0 : 1)
            }
          }))

          setUserVotes(prev => ({
            ...prev,
            [faqId]: isHelpful
          }))
        },
        // Error callback
        (error: string) => {
          setVoteErrors(prev => ({
            ...prev,
            [faqId]: error
          }))

          // Clear optimistic updates on error
          setOptimisticCounts(prev => {
            const newCounts = { ...prev }
            delete newCounts[faqId]
            return newCounts
          })

          setUserVotes(prev => {
            const newVotes = { ...prev }
            delete newVotes[faqId]
            return newVotes
          })
        },
        // Success callback
        (response: VoteResponse) => {
          setVoteSuccess(prev => ({
            ...prev,
            [faqId]: true
          }))

          // Track vote for analytics
          trackVotePattern(faqId, isHelpful, 'search-result')

          // Clear success message after 3 seconds
          setTimeout(() => {
            setVoteSuccess(prev => {
              const newSuccess = { ...prev }
              delete newSuccess[faqId]
              return newSuccess
            })
          }, 3000)

          // Update actual counts from API response
          if (response.data) {
            setOptimisticCounts(prev => ({
              ...prev,
              [faqId]: {
                helpful: response.data!.helpfulCount,
                notHelpful: response.data!.notHelpfulCount
              }
            }))
          }
        }
      )
    } catch (error) {
      logger.error({ err: error }, 'Vote submission failed')
      setVoteErrors(prev => ({
        ...prev,
        [faqId]: 'Ein unerwarteter Fehler ist aufgetreten.'
      }))
    } finally {
      // Clear loading state
      setVoteLoading(prev => {
        const newLoading = { ...prev }
        delete newLoading[faqId]
        return newLoading
      })
    }
  }

  const getDisplayCounts = (result: FAQSearchResult) => {
    const optimistic = optimisticCounts[result.id]
    return {
      helpfulCount: optimistic?.helpful ?? result.helpfulCount,
      notHelpfulCount: optimistic?.notHelpful ?? result.notHelpfulCount
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 text-healthcare-primary">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
                <span className="text-lg font-medium">Suche läuft...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!searchResponse) {
    return null
  }

  const { results, total, searchTerm, suggestions, categories } = searchResponse

  return (
    <div className="py-16 bg-gray-50" id="search-results">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">

          {/* Search Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-healthcare-primary mb-2">
                Suchergebnisse
              </h2>
              <div className="flex items-center gap-4 text-healthcare-text-muted">
                <span>
                  {total} {total === 1 ? 'Ergebnis' : 'Ergebnisse'} für "<strong className="text-healthcare-primary">{searchTerm}</strong>"
                </span>
                <button type="button"
                  onClick={onClearSearch}
                  className="inline-flex items-center gap-1 text-healthcare-accent-green hover:text-healthcare-accent-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                  Suche löschen
                </button>
              </div>
            </div>
          </div>

          {/* Search Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Verwandte Suchbegriffe:</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button type="button"
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Distribution */}
          {Object.keys(categories).length > 1 && (
            <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-healthcare-primary mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Ergebnisse nach Kategorie:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(categories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-healthcare-text-muted capitalize">
                      {category.replace('-', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-healthcare-primary bg-white px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-healthcare-primary mb-2">
                Keine Ergebnisse gefunden
              </h3>
              <p className="text-healthcare-text-muted mb-6 max-w-md mx-auto">
                Ihre Suche nach "<strong>{searchTerm}</strong>" hat keine Treffer ergeben.
                Versuchen Sie es mit anderen Suchbegriffen oder kontaktieren Sie uns direkt.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button type="button"
                  onClick={onClearSearch}
                  className="px-6 py-3 bg-healthcare-primary hover:bg-healthcare-primary-light text-white rounded-lg transition-colors"
                >
                  Neue Suche starten
                </button>
                <a
                  href="/kontakt"
                  className="px-6 py-3 border border-healthcare-primary text-healthcare-primary hover:bg-healthcare-primary hover:text-white rounded-lg transition-colors"
                >
                  Frage direkt stellen
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const isOpen = openItems.has(result.id)

                return (
                  <div key={result.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    {/* Question */}
                    <button type="button"
                      onClick={() => toggleItem(result.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-healthcare-accent-green/10 flex-shrink-0 mt-1">
                          <span className="text-healthcare-accent-green font-semibold text-sm">Q</span>
                        </div>
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            {/* Match Type Badge */}
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium",
                              result.matchType === 'question' && "bg-blue-100 text-blue-800",
                              result.matchType === 'answer' && "bg-green-100 text-green-800",
                              result.matchType === 'both' && "bg-purple-100 text-purple-800"
                            )}>
                              {result.matchType === 'question' && 'Frage-Treffer'}
                              {result.matchType === 'answer' && 'Antwort-Treffer'}
                              {result.matchType === 'both' && 'Volltext-Treffer'}
                            </span>

                            {/* Priority Badge */}
                            {result.priority === 'featured' && (
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-healthcare-accent-green/10 text-healthcare-accent-green">
                                ⭐ Häufig gefragt
                              </span>
                            )}

                            {/* Score (for debugging) */}
                            {process.env.NODE_ENV === 'development' && (
                              <span className="text-xs text-gray-400">
                                Score: {result.score}
                              </span>
                            )}
                          </div>

                          <h3
                            className="text-lg font-semibold text-healthcare-primary leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: result.highlightedQuestion || result.question
                            }}
                          />
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-healthcare-text-muted transition-transform duration-200 flex-shrink-0",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Answer */}
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-healthcare-primary/10 flex-shrink-0">
                            <span className="text-healthcare-primary font-semibold text-sm">A</span>
                          </div>
                          <div className="flex-1">
                            {/* Answer Text */}
                            <div className="prose prose-healthcare max-w-none mb-6">
                              <p
                                className="text-healthcare-text leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: result.highlightedAnswer || result.answer
                                }}
                              />
                            </div>

                            {/* Additional Resources */}
                            {result.videoUrl && (
                              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800 mb-2">📺 Video-Antwort verfügbar</p>
                                <a
                                  href={result.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Video ansehen →
                                </a>
                              </div>
                            )}

                            {/* Enhanced Helpful Feedback */}
                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-healthcare-text-muted">
                                  War diese Antwort hilfreich?
                                </span>

                                {/* Vote Statistics */}
                                <div className="text-xs text-gray-500">
                                  {(() => {
                                    const counts = getDisplayCounts(result)
                                    const summary = getVoteSummary(counts.helpfulCount, counts.notHelpfulCount)
                                    return summary.total > 0 ? (
                                      <span className={cn(
                                        "px-2 py-1 rounded-full",
                                        summary.isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                      )}>
                                        {summary.helpfulPercentage}% hilfreich ({summary.total} Bewertungen)
                                      </span>
                                    ) : null
                                  })()}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <button type="button"
                                  onClick={() => handleVote(result.id, true)}
                                  disabled={voteLoading[result.id] || hasUserVoted(result.id)}
                                  className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    userVotes[result.id] === true
                                      ? "bg-green-100 text-green-700 border border-green-200"
                                      : hasUserVoted(result.id)
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600 hover:border-green-200 border border-transparent",
                                    voteLoading[result.id] && "opacity-70"
                                  )}
                                >
                                  {voteLoading[result.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : userVotes[result.id] === true ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <ThumbsUp className="w-4 h-4" />
                                  )}
                                  <span>Ja ({getDisplayCounts(result).helpfulCount})</span>
                                </button>

                                <button type="button"
                                  onClick={() => handleVote(result.id, false)}
                                  disabled={voteLoading[result.id] || hasUserVoted(result.id)}
                                  className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    userVotes[result.id] === false
                                      ? "bg-red-100 text-red-700 border border-red-200"
                                      : hasUserVoted(result.id)
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 hover:border-red-200 border border-transparent",
                                    voteLoading[result.id] && "opacity-70"
                                  )}
                                >
                                  {voteLoading[result.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : userVotes[result.id] === false ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <ThumbsDown className="w-4 h-4" />
                                  )}
                                  <span>Nein ({getDisplayCounts(result).notHelpfulCount})</span>
                                </button>
                              </div>

                              {/* Success Message */}
                              {voteSuccess[result.id] && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm mb-2">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Vielen Dank für Ihr Feedback!</span>
                                </div>
                              )}

                              {/* Error Message */}
                              {voteErrors[result.id] && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm mb-2">
                                  <AlertCircle className="w-4 h-4" />
                                  <span>{voteErrors[result.id]}</span>
                                </div>
                              )}

                              {/* Already Voted Message */}
                              {hasUserVoted(result.id) && !voteErrors[result.id] && !voteSuccess[result.id] && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Sie haben bereits abgestimmt. Danke für Ihr Feedback!</span>
                                </div>
                              )}
                            </div>

                            {/* Updated timestamp */}
                            <div className="flex items-center justify-end pt-2">
                              {result.lastUpdated && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Aktualisiert: {new Date(result.lastUpdated).toLocaleDateString('de-DE')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Load More Button (if there are more results) */}
          {results.length > 0 && total > results.length && (
            <div className="text-center mt-8">
              <button type="button" className="inline-flex items-center gap-2 px-6 py-3 bg-healthcare-primary hover:bg-healthcare-primary-light text-white rounded-lg transition-colors font-medium">
                Weitere Ergebnisse laden
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
