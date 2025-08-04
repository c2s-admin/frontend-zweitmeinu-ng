import { render, fireEvent, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { FAQVoteAnalytics } from '../FAQVoteAnalytics'
import type { FAQ, FAQCategory } from '@/lib/strapi/faq'
import { getVoteSummary } from '@/lib/services/faqVoting'

vi.mock('@/lib/services/faqVoting', () => ({
  getVoteSummary: vi.fn().mockReturnValue({ helpfulPercentage: 50, total: 2 }),
  getUserVoteStatus: vi.fn()
}))

const mockGetVoteSummary = getVoteSummary as unknown as ReturnType<typeof vi.fn>

const baseFaqs: FAQ[] = [
  { id: 1, question: 'Q1', helpfulCount: 1, notHelpfulCount: 1 }
]

const baseCategories: FAQCategory[] = [
  { id: 1, slug: 'general', name: 'General' } as FAQCategory
]

describe('FAQVoteAnalytics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    ;(mockGetVoteSummary as any).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calculates analytics on initial mount', () => {
    render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()
  })

  it('recalculates when faqs change', () => {
    const { rerender } = render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    ;(mockGetVoteSummary as any).mockClear()

    const updatedFaqs = [...baseFaqs, { id: 2, question: 'Q2', helpfulCount: 0, notHelpfulCount: 0 }]
    rerender(<FAQVoteAnalytics faqs={updatedFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()
  })

  it('recalculates when categories change', () => {
    const { rerender } = render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    ;(mockGetVoteSummary as any).mockClear()

    const newCategories = [...baseCategories, { id: 2, slug: 'other', name: 'Other' } as FAQCategory]
    rerender(<FAQVoteAnalytics faqs={baseFaqs} categories={newCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()
  })

  it('recalculates when time range changes', () => {
    render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    ;(mockGetVoteSummary as any).mockClear()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '24h' } })
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()
  })

  it('does not recalculate for unrelated prop changes', () => {
    const { rerender } = render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    ;(mockGetVoteSummary as any).mockClear()

    rerender(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} className="extra" />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).not.toHaveBeenCalled()
  })
})
