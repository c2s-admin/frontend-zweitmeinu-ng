import type { Metadata } from 'next'
import Link from 'next/link'
import { FileQuestion, Home, Phone, Mail, HelpCircle, Heart, Stethoscope, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Seite nicht gefunden | Zweitmeinung.ng',
  description: 'Die gesuchte Seite konnte nicht gefunden werden. Wir helfen Ihnen gerne weiter.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const quickLinks = [
    { href: '/', label: 'Startseite', icon: Home, description: 'Zurück zur Homepage' },
    { href: '/faq', label: 'Häufige Fragen', icon: HelpCircle, description: 'Antworten auf häufige Fragen' },
    { href: '/kontakt', label: 'Kontakt', icon: Mail, description: 'Nehmen Sie Kontakt mit uns auf' },
    { href: '/so-funktionierts', label: 'So funktioniert\'s', icon: Activity, description: 'Informationen zum Ablauf' },
  ]

  const fachbereiche = [
    { href: '/fachbereiche/kardiologie', label: 'Kardiologie', icon: Heart, color: 'text-red-600' },
    { href: '/fachbereiche/onkologie', label: 'Onkologie', icon: Stethoscope, color: 'text-purple-600' },
    { href: '/fachbereiche/intensivmedizin', label: 'Intensivmedizin', icon: Activity, color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        <p className="text-sm md:text-base">
          <span className="font-medium">Medizinischer Notfall?</span>{' '}
          <a
            href="tel:+4980080441100"
            className="underline hover:text-healthcare-accent-green transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-healthcare-primary rounded px-1"
            aria-label="Notfall-Hotline anrufen: +49 800 80 44 100"
          >
            <Phone className="inline-block w-4 h-4 mr-1" aria-hidden="true" />
            +49 800 80 44 100
          </a>
        </p>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* 404 Icon & Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-healthcare-primary/10 rounded-full mb-6">
            <FileQuestion
              className="w-12 h-12 md:w-16 md:h-16 text-healthcare-primary"
              aria-hidden="true"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-healthcare-primary mb-4">
            Seite nicht gefunden
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Die von Ihnen gesuchte Seite existiert leider nicht.
          </p>

          <p className="text-base text-gray-500">
            Möglicherweise wurde die Seite verschoben oder die URL ist nicht korrekt.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-healthcare-primary mb-6 text-center">
            Wie können wir Ihnen helfen?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-healthcare-primary-light focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2 min-h-[120px] flex flex-col justify-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center group-hover:bg-healthcare-primary-light group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 text-healthcare-primary group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-healthcare-primary mb-1 group-hover:text-healthcare-primary-light transition-colors">
                        {link.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Medical Specialties */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-healthcare-primary mb-4 text-center">
            Suchen Sie eine medizinische Zweitmeinung?
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Unsere Fachbereiche stehen Ihnen zur Verfügung:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fachbereiche.map((bereich) => {
              const Icon = bereich.icon
              return (
                <Link
                  key={bereich.href}
                  href={bereich.href}
                  className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-100 hover:border-healthcare-primary-light hover:bg-healthcare-background transition-all focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2 min-h-[64px]"
                >
                  <Icon className={`w-6 h-6 ${bereich.color} flex-shrink-0`} aria-hidden="true" />
                  <span className="font-medium text-healthcare-primary group-hover:text-healthcare-primary-light transition-colors">
                    {bereich.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-healthcare-primary/5 rounded-2xl p-8 text-center border-2 border-healthcare-primary/10">
          <h2 className="text-xl font-semibold text-healthcare-primary mb-3">
            Weitere Unterstützung benötigt?
          </h2>

          <p className="text-gray-600 mb-6">
            Unser Team steht Ihnen gerne zur Verfügung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-healthcare-primary-light text-white font-medium px-8 py-4 rounded-lg hover:bg-healthcare-primary transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2 min-h-[56px] min-w-[200px]"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              Kontakt aufnehmen
            </Link>

            <a
              href="tel:+4980080441100"
              className="inline-flex items-center justify-center gap-2 bg-white text-healthcare-primary font-medium px-8 py-4 rounded-lg border-2 border-healthcare-primary hover:bg-healthcare-primary hover:text-white transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary focus:ring-offset-2 min-h-[56px] min-w-[200px]"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              +49 800 80 44 100
            </a>
          </div>
        </div>

        {/* Footer Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Fehler-Code: 404 | Seite nicht gefunden
          </p>
        </div>
      </main>
    </div>
  )
}
