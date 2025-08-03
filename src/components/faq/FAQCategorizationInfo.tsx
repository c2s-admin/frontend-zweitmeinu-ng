'use client'

import { useState } from 'react'
import {
  Info,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Search,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CategorizationStats, CategorizationQuality } from '@/lib/strapi/faq'

interface FAQCategorizationInfoProps {
  stats: CategorizationStats
  quality: CategorizationQuality
  totalCategories: number
  className?: string
}

export function FAQCategorizationInfo({
  stats,
  quality,
  totalCategories,
  className
}: FAQCategorizationInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate user-friendly metrics
  const totalCategorized = stats.strapiRelations + stats.keywordBased
  const categorizationRate = (totalCategorized / stats.totalFAQs) * 100
  const apiReliability = stats.confidence * 100
  const systemHealth = quality.overallScore * 100

  // Get health status
  const getHealthStatus = () => {
    if (systemHealth >= 90) return { icon: CheckCircle, color: 'text-green-600', text: 'Ausgezeichnet' }
    if (systemHealth >= 75) return { icon: CheckCircle, color: 'text-blue-600', text: 'Sehr gut' }
    if (systemHealth >= 60) return { icon: AlertTriangle, color: 'text-yellow-600', text: 'Gut' }
    return { icon: AlertTriangle, color: 'text-red-600', text: 'Verbesserungsbedarf' }
  }

  const healthStatus = getHealthStatus()
  const HealthIcon = healthStatus.icon

  return (
    <div className={cn("bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Intelligente FAQ-Kategorisierung
              <HealthIcon className={cn("w-5 h-5", healthStatus.color)} />
            </h3>
            <p className="text-sm text-gray-600">
              {totalCategorized} von {stats.totalFAQs} FAQs automatisch kategorisiert
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm transition-colors"
        >
          <Info className="w-4 h-4" />
          {isExpanded ? 'Weniger' : 'Details'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(categorizationRate)}%
          </div>
          <div className="text-xs text-gray-600">Kategorisiert</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(apiReliability)}%
          </div>
          <div className="text-xs text-gray-600">Datenqualität</div>
        </div>
        <div className="text-center">
          <div className={cn("text-2xl font-bold", healthStatus.color)}>
            {Math.round(systemHealth)}%
          </div>
          <div className="text-xs text-gray-600">System-Score</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Overview */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                System-Übersicht
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kategorisierungsmethode:</span>
                  <span className="text-sm font-medium capitalize">
                    {stats.method === 'hybrid' ? 'Hybrid (Optimal)' :
                     stats.method === 'relations-only' ? 'Nur Relations' :
                     'Nur Keywords'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API-Verbindung:</span>
                  <span className={cn("text-sm font-medium",
                    stats.apiHealth === 'healthy' ? 'text-green-600' :
                    stats.apiHealth === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {stats.apiHealth === 'healthy' ? 'Stabil' :
                     stats.apiHealth === 'degraded' ? 'Eingeschränkt' : 'Gestört'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verarbeitungszeit:</span>
                  <span className="text-sm font-medium">{stats.processingTime}ms</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cache-Effizienz:</span>
                  <span className="text-sm font-medium">
                    {Math.round((stats.cacheHits / stats.totalFAQs) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-green-600" />
                Datenquellen
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CMS-Relations:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">{stats.strapiRelations}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(stats.strapiRelations / stats.totalFAQs) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">KI-Keywords:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">{stats.keywordBased}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(stats.keywordBased / stats.totalFAQs) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Unkategorisiert:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">{stats.uncategorized}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{ width: `${(stats.uncategorized / stats.totalFAQs) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health Badge */}
          <div className="mt-6 flex items-center justify-center">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              systemHealth >= 90 ? "bg-green-100 text-green-800" :
              systemHealth >= 75 ? "bg-blue-100 text-blue-800" :
              systemHealth >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}>
              <Zap className="w-4 h-4" />
              <span>System-Status: {healthStatus.text}</span>
            </div>
          </div>

          {/* Performance Tips */}
          {quality.recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Verbesserungsvorschläge
              </h5>
              <ul className="space-y-1 text-sm text-gray-600">
                {quality.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
