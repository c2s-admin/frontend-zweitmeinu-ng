'use client'

// FAQ Voting Service
// Handles all voting-related operations with optimistic updates, error handling, and local storage

import { logger } from '@/lib/logger'

export interface VoteRequest {
  faqId: number
  isHelpful: boolean
  sessionId?: string
}

export interface VoteResponse {
  success: boolean
  data?: {
    faqId: number
    helpfulCount: number
    notHelpfulCount: number
    userVote: boolean | null
  }
  error?: string
  message?: string
}

export interface VoteStats {
  faqId: number
  helpfulCount: number
  notHelpfulCount: number
}

export interface UserVoteStatus {
  [faqId: number]: boolean | null // true = helpful, false = not helpful, null = no vote
}

// Local storage keys
const VOTE_STORAGE_KEY = 'faq_user_votes'
const SESSION_ID_KEY = 'faq_session_id'

// Generate or retrieve session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '' // SSR guard

  let sessionId = localStorage.getItem(SESSION_ID_KEY)
  if (!sessionId) {
    sessionId = `faq_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  return sessionId
}

// Get user's vote status from local storage
export function getUserVoteStatus(): UserVoteStatus {
  if (typeof window === 'undefined') return {} // SSR guard

  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    logger.error({ err: error }, 'Error reading vote status from localStorage')
    return {}
  }
}

// Save user's vote status to local storage
export function saveUserVoteStatus(voteStatus: UserVoteStatus): void {
  if (typeof window === 'undefined') return // SSR guard

  try {
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(voteStatus))
  } catch (error) {
    logger.error({ err: error }, 'Error saving vote status to localStorage')
  }
}

// Get user's vote for a specific FAQ
export function getUserVote(faqId: number): boolean | null {
  const voteStatus = getUserVoteStatus()
  return voteStatus[faqId] ?? null
}

// Check if user has already voted for a FAQ
export function hasUserVoted(faqId: number): boolean {
  return getUserVote(faqId) !== null
}

// Submit a vote with optimistic updates
export async function submitVote(
  faqId: number,
  isHelpful: boolean,
  onOptimisticUpdate?: (faqId: number, isHelpful: boolean) => void,
  onError?: (error: string) => void,
  onSuccess?: (response: VoteResponse) => void
): Promise<VoteResponse> {
  try {
    // Check if user has already voted
    if (hasUserVoted(faqId)) {
      const errorMsg = 'Sie haben bereits für diese FAQ abgestimmt.'
      onError?.(errorMsg)
      return {
        success: false,
        error: 'Already voted',
        message: errorMsg
      }
    }

    // Optimistic update - immediately update UI
    if (onOptimisticUpdate) {
      onOptimisticUpdate(faqId, isHelpful)
    }

    // Save vote locally (optimistic)
    const currentVotes = getUserVoteStatus()
    currentVotes[faqId] = isHelpful
    saveUserVoteStatus(currentVotes)

    // Prepare request
    const sessionId = getSessionId()
    const voteRequest: VoteRequest = {
      faqId,
      isHelpful,
      sessionId
    }

    // Submit vote to API
    const response = await fetch('/api/faq/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteRequest)
    })

    const result: VoteResponse = await response.json()

    if (!response.ok || !result.success) {
      // Revert optimistic update on error
      delete currentVotes[faqId]
      saveUserVoteStatus(currentVotes)

      const errorMsg = result.message || 'Fehler beim Speichern der Bewertung'
      onError?.(errorMsg)
      return result
    }

    // Success - keep the optimistic update
    onSuccess?.(result)
    logger.info('Vote submitted successfully:', result)

    return result

  } catch (error) {
    logger.error({ err: error }, 'Error submitting vote')

    // Revert optimistic update on error
    const currentVotes = getUserVoteStatus()
    delete currentVotes[faqId]
    saveUserVoteStatus(currentVotes)

    const errorMsg = 'Netzwerkfehler. Bitte versuchen Sie es erneut.'
    onError?.(errorMsg)

    return {
      success: false,
      error: 'Network error',
      message: errorMsg
    }
  }
}

// Get vote statistics for a FAQ
export async function getVoteStats(faqId: number): Promise<VoteStats | null> {
  try {
    const response = await fetch(`/api/faq/vote?faqId=${faqId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      logger.error(`Failed to fetch vote stats: ${response.statusText}`)
      return null
    }

    const result = await response.json()
    return result.success ? result.data : null

  } catch (error) {
    logger.error({ err: error }, 'Error fetching vote stats')
    return null
  }
}

// Retry failed vote submission
export async function retryVote(
  faqId: number,
  onSuccess?: (response: VoteResponse) => void,
  onError?: (error: string) => void
): Promise<VoteResponse | null> {
  const userVote = getUserVote(faqId)

  if (userVote === null) {
    onError?.('Kein gespeicherter Vote zum Wiederholen gefunden')
    return null
  }

  // Remove from local storage and resubmit
  const currentVotes = getUserVoteStatus()
  delete currentVotes[faqId]
  saveUserVoteStatus(currentVotes)

  return submitVote(faqId, userVote, undefined, onError, onSuccess)
}

// Clear all stored votes (useful for testing or reset)
export function clearAllVotes(): void {
  if (typeof window === 'undefined') return // SSR guard

  localStorage.removeItem(VOTE_STORAGE_KEY)
  localStorage.removeItem(SESSION_ID_KEY)
}

// Analytics helper - track vote patterns
export function trackVotePattern(faqId: number, isHelpful: boolean, category?: string): void {
  if (typeof window === 'undefined') return // SSR guard

  // Log vote for analytics (you can send this to your analytics service)
  const voteEvent = {
    event: 'faq_vote',
    faqId,
    isHelpful,
    category,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId()
  }

  logger.info('Vote Analytics:', voteEvent)

  // You can send this to your analytics service:
  // analytics.track('faq_vote', voteEvent)
}

// Validation helpers
export function isValidFaqId(faqId: unknown): faqId is number {
  return typeof faqId === 'number' && faqId > 0 && Number.isInteger(faqId)
}

export function isValidVoteValue(isHelpful: unknown): isHelpful is boolean {
  return typeof isHelpful === 'boolean'
}

// Utility to get vote statistics summary
export function getVoteSummary(helpfulCount: number, notHelpfulCount: number): {
  total: number
  helpfulPercentage: number
  notHelpfulPercentage: number
  isPositive: boolean
} {
  const total = helpfulCount + notHelpfulCount

  if (total === 0) {
    return {
      total: 0,
      helpfulPercentage: 0,
      notHelpfulPercentage: 0,
      isPositive: true
    }
  }

  const helpfulPercentage = Math.round((helpfulCount / total) * 100)
  const notHelpfulPercentage = Math.round((notHelpfulCount / total) * 100)

  return {
    total,
    helpfulPercentage,
    notHelpfulPercentage,
    isPositive: helpfulPercentage >= 50
  }
}
