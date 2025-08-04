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
  {
    id: 1,
    documentId: '1',
    question: 'Q1',
    slug: 'q1',
    answer: '',
    priority: 'low',
    helpfulCount: 1,
    notHelpfulCount: 1,
    createdAt: '',
    updatedAt: '',
    publishedAt: ''
  }
]

const baseCategories: FAQCategory[] = [
  {
    id: 1,
    documentId: '1',
    name: 'General',
    slug: 'general',
    description: '',
    icon: '',
    color: '',
    order: 0,
    createdAt: '',
    updatedAt: '',
    publishedAt: ''
  }
]

describe('FAQVoteAnalytics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockGetVoteSummary.mockClear()
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
    mockGetVoteSummary.mockClear()

    const updatedFaqs = [
      ...baseFaqs,
      {
        id: 2,
        documentId: '2',
        question: 'Q2',
        slug: 'q2',
        answer: '',
        priority: 'low',
        helpfulCount: 0,
        notHelpfulCount: 0,
        createdAt: '',
        updatedAt: '',
        publishedAt: ''
      } as FAQ
    ]
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
    mockGetVoteSummary.mockClear()

    const newCategories = [
      ...baseCategories,
      {
        id: 2,
        documentId: '2',
        name: 'Other',
        slug: 'other',
        description: '',
        icon: '',
        color: '',
        order: 0,
        createdAt: '',
        updatedAt: '',
        publishedAt: ''
      }
    ]
    rerender(<FAQVoteAnalytics faqs={baseFaqs} categories={newCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()
  })

  it('recalculates when time range changes', () => {
    const mutableFaqs = baseFaqs.map(faq => ({ ...faq }))
    render(<FAQVoteAnalytics faqs={mutableFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    mockGetVoteSummary.mockClear()
    mockGetVoteSummary.mockReturnValue({ helpfulPercentage: 100, total: 4 })
    mutableFaqs[0].helpfulCount = 4
    mutableFaqs[0].notHelpfulCount = 0

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '24h' } })
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).toHaveBeenCalled()

    const totalVotesValue = screen.getByText('Gesamt Votes').previousSibling as HTMLElement
    expect(totalVotesValue).toHaveTextContent('4')

    const helpfulVotesValue = screen.getByText('Hilfreich').previousSibling as HTMLElement
    expect(helpfulVotesValue).toHaveTextContent('4')

    const notHelpfulVotesValue = screen.getByText('Nicht Hilfreich').previousSibling as HTMLElement
    expect(notHelpfulVotesValue).toHaveTextContent('0')

    expect(screen.getByText('100% hilfreich (4 Votes)')).toBeInTheDocument()
  })

  it('does not recalculate for unrelated prop changes', () => {
    const { rerender } = render(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} />)
    act(() => {
      vi.runAllTimers()
    })
    mockGetVoteSummary.mockClear()

    rerender(<FAQVoteAnalytics faqs={baseFaqs} categories={baseCategories} className="extra" />)
    act(() => {
      vi.runAllTimers()
    })
    expect(mockGetVoteSummary).not.toHaveBeenCalled()
  })
})
