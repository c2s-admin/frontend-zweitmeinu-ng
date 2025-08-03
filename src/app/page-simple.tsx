'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export default function SimplePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-healthcare-background flex items-center justify-center">
        <div className="text-healthcare-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-accent-blue opacity-90 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container-custom">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8">
                <Heart className="w-6 h-6 text-white" />
                <span className="text-white font-medium text-lg">
                  Zweitmeinung
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-8">
                <span className="block text-white leading-tight">
                  Medizinische Online
                </span>
                <span className="block text-healthcare-accent-green font-bold leading-tight">
                  Zweitmeinung
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed">
                Sind Sie unsicher über Ihre Diagnose? Übernehmen Sie die Kontrolle über Ihre Gesundheit und holen Sie eine Zweitmeinung ein!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="/kontakt"
                  className="bg-healthcare-primary-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-healthcare-accent-hover focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light/50"
                >
                  Zweitmeinung anfragen
                </a>
                <a
                  href="/leistungen"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-healthcare-primary focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  Mehr erfahren
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-healthcare-primary mb-6">
              Warum eine zweite Meinung?
            </h2>
            <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
              Eine zweite medizinische Meinung kann Ihnen Sicherheit geben und dabei helfen,
              die beste Behandlungsentscheidung zu treffen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Präzise Diagnose',
                description: 'Bestätigung oder Korrektur bestehender Diagnosen durch unabhängige Fachärzte.'
              },
              {
                icon: '⏱️',
                title: 'Schnelle Antwort',
                description: 'Erhalten Sie innerhalb von 24-48 Stunden eine fundierte medizinische Einschätzung.'
              },
              {
                icon: '🔒',
                title: 'Absolut vertraulich',
                description: 'Ihre medizinischen Daten werden streng vertraulich und DSGVO-konform behandelt.'
              }
            ].map((feature, index) => (
              <div key={`feature-${index}`} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-healthcare-text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-healthcare-primary">
        <div className="container-custom text-center text-white">
          <h2 className="mb-6">Bereit für Ihre zweite Meinung?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns noch heute und erhalten Sie die medizinische
            Sicherheit, die Sie verdienen.
          </p>
          <a
            href="/kontakt"
            className="btn-primary bg-healthcare-accent-green hover:bg-healthcare-accent-hover"
          >
            Jetzt kostenlos beraten lassen
          </a>
        </div>
      </section>
    </div>
  )
}
