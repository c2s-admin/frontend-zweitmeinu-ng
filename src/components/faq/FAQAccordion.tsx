'use client'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Activity,
  FlaskConical,
  HeartPulse,
  ScanFace,
  Droplet,
  Droplets,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQCategory, FAQ } from '@/lib/strapi/faq'
import {
  submitVote,
  getUserVote,
  hasUserVoted,
  getVoteSummary,
  trackVotePattern,
  type VoteResponse
} from '@/lib/services/faqVoting'

interface FAQAccordionProps {
  category: FAQCategory
  faqs: FAQ[]
}

const iconComponents = {
  'help-circle': HelpCircle,
  'activity': Activity,
  'flask-conical': FlaskConical,
  'heart-pulse': HeartPulse,
  'scan-face': ScanFace,
  'droplet': Droplet,
  'water': Droplets,
}

export function FAQAccordion({ category, faqs }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [userVotes, setUserVotes] = useState<Record<number, boolean | null>>({})
  const [voteLoading, setVoteLoading] = useState<Record<number, boolean>>({})
  const [voteErrors, setVoteErrors] = useState<Record<number, string>>({})
  const [voteSuccess, setVoteSuccess] = useState<Record<number, boolean>>({})
  const [optimisticCounts, setOptimisticCounts] = useState<Record<number, { helpful: number; notHelpful: number }>>({})

  const IconComponent = iconComponents[category.icon as keyof typeof iconComponents] || HelpCircle

  // Load user votes from localStorage on component mount
  useEffect(() => {
    const userVoteStatus: Record<number, boolean | null> = {}
    faqs.forEach(faq => {
      userVoteStatus[faq.id] = getUserVote(faq.id)
    })
    setUserVotes(userVoteStatus)
  }, [faqs])

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

    // Find the FAQ to get current counts
    const faq = faqs.find(f => f.id === faqId)
    if (!faq) {
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
          // Update optimistic counts
          setOptimisticCounts(prev => ({
            ...prev,
            [faqId]: {
              helpful: faq.helpfulCount + (isHelpful ? 1 : 0),
              notHelpful: faq.notHelpfulCount + (isHelpful ? 0 : 1)
            }
          }))

          // Update user vote status
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
          trackVotePattern(faqId, isHelpful, category.slug)

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
      console.error('Vote submission failed:', error)
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

  const getDisplayCounts = (faq: FAQ) => {
    const optimistic = optimisticCounts[faq.id]
    return {
      helpfulCount: optimistic?.helpful ?? faq.helpfulCount,
      notHelpfulCount: optimistic?.notHelpful ?? faq.notHelpfulCount
    }
  }

  if (faqs.length === 0) {
    return null
  }

  return (
    <div id={`category-${category.slug}`} className="scroll-mt-8">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-healthcare-primary/5">
          <IconComponent
            className="w-6 h-6 text-healthcare-primary"
            style={{ color: category.color }}
          />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-healthcare-primary">
            {category.name}
          </h2>
          <p className="text-healthcare-text-muted mt-1">
            {category.description}
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openItems.has(faq.id)
          const userVote = userVotes[faq.id]

          return (
            <div key={faq.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Question */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-healthcare-accent-green/10 flex-shrink-0 mt-1">
                    <span className="text-healthcare-accent-green font-semibold text-sm">Q</span>
                  </div>
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold text-healthcare-primary leading-relaxed">
                      {faq.question}
                    </h3>
                    {/* Priority Badge */}
                    {faq.priority === 'featured' && (
                      <div className="flex items-center gap-1 bg-healthcare-accent-green/10 text-healthcare-accent-green px-2 py-1 rounded-full text-xs font-medium mt-2 inline-flex">
                        <span>⭐</span>
                        <span>Häufig gefragt</span>
                      </div>
                    )}
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
                        <p className="text-healthcare-text leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>

                      {/* Additional Resources */}
                      {faq.videoUrl && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">📺 Video-Antwort verfügbar</p>
                          <a
                            href={faq.videoUrl}
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
                              const counts = getDisplayCounts(faq)
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
                          <button
                            onClick={() => handleVote(faq.id, true)}
                            disabled={voteLoading[faq.id] || hasUserVoted(faq.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                              userVotes[faq.id] === true
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : hasUserVoted(faq.id)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600 hover:border-green-200 border border-transparent",
                              voteLoading[faq.id] && "opacity-70"
                            )}
                          >
                            {voteLoading[faq.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : userVotes[faq.id] === true ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <ThumbsUp className="w-4 h-4" />
                            )}
                            <span>Ja ({getDisplayCounts(faq).helpfulCount})</span>
                          </button>

                          <button
                            onClick={() => handleVote(faq.id, false)}
                            disabled={voteLoading[faq.id] || hasUserVoted(faq.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                              userVotes[faq.id] === false
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : hasUserVoted(faq.id)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 hover:border-red-200 border border-transparent",
                              voteLoading[faq.id] && "opacity-70"
                            )}
                          >
                            {voteLoading[faq.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : userVotes[faq.id] === false ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <ThumbsDown className="w-4 h-4" />
                            )}
                            <span>Nein ({getDisplayCounts(faq).notHelpfulCount})</span>
                          </button>
                        </div>

                        {/* Success Message */}
                        {voteSuccess[faq.id] && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Vielen Dank für Ihr Feedback!</span>
                          </div>
                        )}

                        {/* Error Message */}
                        {voteErrors[faq.id] && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm mb-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{voteErrors[faq.id]}</span>
                          </div>
                        )}

                        {/* Already Voted Message */}
                        {hasUserVoted(faq.id) && !voteErrors[faq.id] && !voteSuccess[faq.id] && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Sie haben bereits abgestimmt. Danke für Ihr Feedback!</span>
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

      {/* Show More Button */}
      {faqs.length >= 8 && (
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-healthcare-primary hover:bg-healthcare-primary-light text-white rounded-lg transition-colors font-medium">
            Weitere Fragen anzeigen
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
