'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, Info } from 'lucide-react'

interface LegalIframeProps {
  src: string
  title: string
  provider?: string
  height?: string
}

export function LegalIframe({
  src,
  title,
  provider,
  height = '5000'
}: LegalIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if running on localhost/development
    const isLocalhost = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.startsWith('192.168.') ||
       window.location.hostname.startsWith('10.'))

    setIsDevelopment(isLocalhost)
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    // Force iframe reload by changing key
    const iframe = document.querySelector('iframe[data-legal-iframe]') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className="space-y-4">
      {/* Development Warning */}
      {isDevelopment && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Development-Modus erkannt
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Der iframe wird möglicherweise nicht geladen, da alfright.eu nur Zugriffe von{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded text-xs font-mono">
                  zweitmeinu.ng
                </code>{' '}
                Domains erlaubt.
              </p>
              <div className="bg-white border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">
                  Lösungen für lokales Testing:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>
                    <strong>Hosts-Datei anpassen:</strong>{' '}
                    <code className="bg-blue-50 px-1 py-0.5 rounded text-xs font-mono">
                      127.0.0.1 zweitmeinu.ng
                    </code>{' '}
                    in <code className="bg-blue-50 px-1 py-0.5 rounded text-xs font-mono">/etc/hosts</code> hinzufügen
                  </li>
                  <li>
                    <strong>Production-Domain testen:</strong> Auf{' '}
                    <a
                      href="https://zweitmeinu.ng/datenschutz"
                      className="text-blue-600 hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      zweitmeinu.ng/datenschutz
                    </a>{' '}
                    testen
                  </li>
                  <li>
                    <strong>Browser-Console:</strong> CSP-Fehler sind in Development normal
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iframe Container */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Loading State */}
        {isLoading && !hasError && (
        <div className="flex flex-col items-center justify-center p-12 bg-healthcare-background">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-healthcare-primary-light border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-lg text-healthcare-primary font-medium">
            Datenschutzerklärung wird geladen...
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {provider && `Bereitgestellt von ${provider}`}
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="flex flex-col items-center justify-center p-12 bg-red-50">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Fehler beim Laden
          </h3>
          <p className="text-gray-700 mb-6 text-center max-w-md">
            Die Datenschutzerklärung konnte nicht geladen werden.
            Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Datenschutzbeauftragten.
          </p>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-healthcare-primary-light text-white rounded-lg hover:bg-healthcare-primary transition-colors min-h-[56px] focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2"
            aria-label="Erneut versuchen"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium">Erneut versuchen</span>
          </button>

          {/* Emergency Contact */}
          <div className="mt-8 p-4 bg-white rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">
              <strong>Datenschutzbeauftragter:</strong>{' '}
              <a
                href="mailto:datenschutz@zweitmeinung.ng"
                className="text-healthcare-primary-light hover:underline focus:underline focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded px-1"
              >
                datenschutz@zweitmeinung.ng
              </a>
            </p>
          </div>
        </div>
      )}

      {/* iframe */}
      <iframe
        data-legal-iframe
        src={src}
        width="100%"
        height={height}
        style={{
          border: 0,
          display: hasError ? 'none' : 'block',
          minHeight: isLoading ? '400px' : height + 'px'
        }}
        loading="lazy"
        title={title}
        aria-label="Vollständige Datenschutzerklärung gemäß DSGVO"
        onLoad={handleLoad}
        onError={handleError}
        className="w-full"
      />
      </div>
    </div>
  )
}
