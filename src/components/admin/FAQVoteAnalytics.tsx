'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Users,
  Eye,
  RefreshCw,
  Download,
  Calendar,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUserVoteStatus, getVoteSummary } from '@/lib/services/faqVoting'
import type { FAQ, FAQCategory } from '@/lib/strapi/faq'

interface FAQVoteAnalyticsProps {
  faqs: FAQ[]
  categories: FAQCategory[]
  className?: string
}

interface VoteAnalytics {
  totalVotes: number
  helpfulVotes: number
  notHelpfulVotes: number
  topPerformingFAQs: Array<{
    id: number
    question: string
    helpfulPercentage: number
    totalVotes: number
  }>
  poorPerformingFAQs: Array<{
    id: number
    question: string
    helpfulPercentage: number
    totalVotes: number
  }>
  categoryStats: Array<{
    category: string
    totalVotes: number
    helpfulPercentage: number
    faqCount: number
  }>
  recentVotes: Array<{
    faqId: number
    question: string
    isHelpful: boolean
    timestamp: string
  }>
}

export function FAQVoteAnalytics({ faqs, categories, className }: FAQVoteAnalyticsProps) {
  const [analytics, setAnalytics] = useState<VoteAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  // Calculate analytics from FAQ data
  const calculateAnalytics = useCallback((): VoteAnalytics => {
    let totalVotes = 0
    let helpfulVotes = 0
    let notHelpfulVotes = 0

    // Calculate vote statistics
    faqs.forEach(faq => {
      const faqHelpful = faq.helpfulCount || 0
      const faqNotHelpful = faq.notHelpfulCount || 0

      totalVotes += faqHelpful + faqNotHelpful
      helpfulVotes += faqHelpful
      notHelpfulVotes += faqNotHelpful
    })

    // Top performing FAQs (highest helpful percentage with minimum votes)
    const topPerformingFAQs = faqs
      .map(faq => {
        const summary = getVoteSummary(faq.helpfulCount || 0, faq.notHelpfulCount || 0)
        return {
          id: faq.id,
          question: faq.question,
          helpfulPercentage: summary.helpfulPercentage,
          totalVotes: summary.total
        }
      })
      .filter(item => item.totalVotes >= 3) // Minimum 3 votes
      .sort((a, b) => b.helpfulPercentage - a.helpfulPercentage)
      .slice(0, 5)

    // Poor performing FAQs (lowest helpful percentage with minimum votes)
    const poorPerformingFAQs = faqs
      .map(faq => {
        const summary = getVoteSummary(faq.helpfulCount || 0, faq.notHelpfulCount || 0)
        return {
          id: faq.id,
          question: faq.question,
          helpfulPercentage: summary.helpfulPercentage,
          totalVotes: summary.total
        }
      })
      .filter(item => item.totalVotes >= 3) // Minimum 3 votes
      .sort((a, b) => a.helpfulPercentage - b.helpfulPercentage)
      .slice(0, 5)

    // Category statistics
    const categoryStats = categories.map(category => {
      const categoryFAQs = faqs.filter(faq =>
        faq.category?.slug === category.slug
      )

      let categoryTotalVotes = 0
      let categoryHelpfulVotes = 0

      categoryFAQs.forEach(faq => {
        const faqHelpful = faq.helpfulCount || 0
        const faqNotHelpful = faq.notHelpfulCount || 0
        categoryTotalVotes += faqHelpful + faqNotHelpful
        categoryHelpfulVotes += faqHelpful
      })

      const helpfulPercentage = categoryTotalVotes > 0
        ? Math.round((categoryHelpfulVotes / categoryTotalVotes) * 100)
        : 0

      return {
        category: category.name,
        totalVotes: categoryTotalVotes,
        helpfulPercentage,
        faqCount: categoryFAQs.length
      }
    }).sort((a, b) => b.totalVotes - a.totalVotes)

    // Mock recent votes (in production, this would come from a real analytics system)
    const recentVotes = faqs
      .slice(0, 10)
      .map(faq => ({
        faqId: faq.id,
        question: faq.question,
        isHelpful: Math.random() > 0.3, // Mock data
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      totalVotes,
      helpfulVotes,
      notHelpfulVotes,
      topPerformingFAQs,
      poorPerformingFAQs,
      categoryStats,
      recentVotes
    }
  }, [faqs, categories])

  // Load analytics on component mount
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const analyticsData = calculateAnalytics()
      setAnalytics(analyticsData)
      setIsLoading(false)
    }, 500)
  }, [calculateAnalytics, timeRange])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      const analyticsData = calculateAnalytics()
      setAnalytics(analyticsData)
      setRefreshing(false)
    }, 1000)
  }

  const exportData = () => {
    if (!analytics) return

    const csvData = faqs.map(faq => ({
      'FAQ ID': faq.id,
      'Frage': faq.question,
      'Hilfreich': faq.helpfulCount || 0,
      'Nicht Hilfreich': faq.notHelpfulCount || 0,
      'Gesamt Votes': (faq.helpfulCount || 0) + (faq.notHelpfulCount || 0),
      'Hilfreich %': getVoteSummary(faq.helpfulCount || 0, faq.notHelpfulCount || 0).helpfulPercentage
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faq-vote-analytics-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-6", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const overallHelpfulPercentage = analytics.totalVotes > 0
    ? Math.round((analytics.helpfulVotes / analytics.totalVotes) * 100)
    : 0

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">FAQ Vote Analytics</h2>
              <p className="text-sm text-gray-600">Übersicht der Bewertungen und Performance-Metriken</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTimeRange(e.target.value as '24h' | '7d' | '30d' | 'all')
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="24h">Letzte 24h</option>
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
              <option value="all">Alle Zeit</option>
            </select>

            <button type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-healthcare-primary hover:bg-healthcare-primary-light text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              Aktualisieren
            </button>

            <button type="button"
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{analytics.totalVotes}</div>
                <div className="text-sm text-blue-700">Gesamt Votes</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">{analytics.helpfulVotes}</div>
                <div className="text-sm text-green-700">Hilfreich</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ThumbsDown className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">{analytics.notHelpfulVotes}</div>
                <div className="text-sm text-red-700">Nicht Hilfreich</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{overallHelpfulPercentage}%</div>
                <div className="text-sm text-purple-700">Erfolgsrate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing FAQs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Performance FAQs
          </h3>
          <div className="space-y-3">
            {analytics.topPerformingFAQs.map((faq, index) => (
              <div key={faq.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-sm font-semibold text-green-800">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {faq.question}
                  </div>
                  <div className="text-xs text-gray-600">
                    {faq.helpfulPercentage}% hilfreich ({faq.totalVotes} Votes)
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {faq.helpfulPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Poor Performing FAQs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
            Verbesserungsbedarf
          </h3>
          <div className="space-y-3">
            {analytics.poorPerformingFAQs.map((faq, index) => (
              <div key={faq.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-sm font-semibold text-red-800">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {faq.question}
                  </div>
                  <div className="text-xs text-gray-600">
                    {faq.helpfulPercentage}% hilfreich ({faq.totalVotes} Votes)
                  </div>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {faq.helpfulPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          Performance nach Kategorien
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.categoryStats.map(stat => (
            <div key={stat.category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{stat.category}</h4>
                <span className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-full",
                  stat.helpfulPercentage >= 70 ? "bg-green-100 text-green-800" :
                  stat.helpfulPercentage >= 50 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {stat.helpfulPercentage}%
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Votes: {stat.totalVotes}</div>
                <div>FAQs: {stat.faqCount}</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    stat.helpfulPercentage >= 70 ? "bg-green-500" :
                    stat.helpfulPercentage >= 50 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${stat.helpfulPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
