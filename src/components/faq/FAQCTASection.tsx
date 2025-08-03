'use client'

import Link from 'next/link'
import { HelpCircle, Phone, Mail, Clock, UserCheck, Shield, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQCTASectionProps {
  icon?: string
  iconColor?: string
  title: string
  description: string
  additionalInfo?: string
  backgroundColor?: string
  textColor?: string
}

export function FAQCTASection({
  icon = 'HelpCircle',
  iconColor = 'text-yellow-500',
  title,
  description,
  additionalInfo,
  backgroundColor = 'bg-healthcare-primary',
  textColor = 'text-white'
}: FAQCTASectionProps) {

  return (
    <section className={cn("py-20 relative overflow-hidden", backgroundColor, textColor)}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-primary-dark opacity-95" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-white/10 backdrop-blur-sm rounded-full">
            <HelpCircle className={cn("w-10 h-10", iconColor.replace('text-', 'text-healthcare-accent-green') || 'text-healthcare-accent-green')} />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {/* Primary CTA - Kostenlose Beratung */}
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-3 px-8 py-4 bg-healthcare-accent-green hover:bg-healthcare-accent-hover text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Kostenlose Beratung
            </Link>

            {/* Secondary CTA - Hotline */}
            <a
              href="tel:+498008044100"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              0800 80 44 100
            </a>
          </div>

          {/* Additional Info */}
          {additionalInfo && (
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              {additionalInfo.split(' • ').map((info, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index === 0 && <Phone className="w-4 h-4" />}
                  {index === 1 && <Clock className="w-4 h-4" />}
                  {index === 2 && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                  <span>{info}</span>
                </div>
              ))}
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <UserCheck className="w-6 h-6 text-healthcare-accent-green" />
              </div>
              <h4 className="font-semibold mb-1">Erfahrene Experten</h4>
              <p className="text-sm text-white/80">Unabhängige Fachärzte mit Leitlinienexpertise</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-healthcare-accent-green" />
              </div>
              <h4 className="font-semibold mb-1">100% Vertraulich</h4>
              <p className="text-sm text-white/80">Ihre Daten sind bei uns sicher geschützt</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-healthcare-accent-green" />
              </div>
              <h4 className="font-semibold mb-1">Schnelle Antwort</h4>
              <p className="text-sm text-white/80">Binnen 24-48 Stunden erhalten Sie Ihre Zweitmeinung</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
