import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { Mail, Phone, MapPin, Clock, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt | Zweitmeinung.ng - Wir sind für Sie da',
  description: 'Nehmen Sie Kontakt mit unserem medizinischen Team auf. Wir beantworten Ihre Fragen zu medizinischen Zweitmeinungen innerhalb von 24 Stunden.',
  keywords: 'kontakt, zweitmeinung, medizinische beratung, kontaktformular, healthcare support',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Kontakt | Zweitmeinung.ng',
    description: 'Nehmen Sie Kontakt mit unserem medizinischen Team auf.',
    type: 'website',
  }
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4 text-sm md:text-base">
        <p className="font-medium">
          🚨 Medizinischer Notfall?{' '}
          <a href="tel:112" className="underline hover:text-healthcare-accent-green transition-colors">
            Notruf: 112
          </a>
          {' '}|{' '}
          <a href="tel:116117" className="underline hover:text-healthcare-accent-green transition-colors">
            Ärztlicher Bereitschaftsdienst: 116 117
          </a>
        </p>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-healthcare-primary via-healthcare-primary-light to-healthcare-primary py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
            Wir sind für Sie da
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Haben Sie Fragen zu unseren medizinischen Zweitmeinungen? Unser Team antwortet innerhalb von 24 Stunden.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-healthcare-primary text-2xl font-medium mb-6 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  Kontaktdaten
                </h2>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-healthcare-primary-light mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">E-Mail</div>
                      <a
                        href="mailto:kontakt@zweitmeinu.ng"
                        className="text-healthcare-primary-light hover:text-healthcare-primary font-medium hover:underline"
                      >
                        kontakt@zweitmeinu.ng
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-healthcare-primary-light mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Telefon</div>
                      <a
                        href="tel:+4980080441100"
                        className="text-healthcare-primary-light hover:text-healthcare-primary font-medium hover:underline"
                      >
                        +49 800 80 44 100
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-healthcare-primary-light mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Adresse</div>
                      <address className="text-healthcare-primary not-italic">
                        Complex Care Solutions GmbH<br />
                        Hans-Böckler-Str. 19<br />
                        46236 Bottrop<br />
                        Deutschland
                      </address>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-healthcare-primary-light mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Erreichbarkeit</div>
                      <div className="text-healthcare-primary space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="font-medium">Mo-Fr:</span>
                          <span>09:00 - 16:00 Uhr</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="font-medium">Sa-So:</span>
                          <span>Geschlossen</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          An Feiertagen eingeschränkte Verfügbarkeit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy & Security Notice */}
              <div className="bg-healthcare-background rounded-2xl p-6 border border-gray-200">
                <h3 className="text-healthcare-primary text-lg font-medium mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Datenschutz & Sicherheit
                </h3>
                <div className="text-sm text-gray-700 space-y-3">
                  <p>
                    ✓ <strong>DSGVO-konform:</strong> Alle Daten werden gemäß DSGVO verarbeitet
                  </p>
                  <p>
                    ✓ <strong>Vertraulich:</strong> Ärztliche Schweigepflicht wird gewahrt
                  </p>
                  <p>
                    ✓ <strong>Verschlüsselt:</strong> SSL/TLS-gesicherte Datenübertragung
                  </p>
                  <p className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                    Ihre Anfrage wird nur zur Bearbeitung Ihres Anliegens verwendet.
                  </p>
                </div>
              </div>

              {/* Response Time Notice */}
              <div className="bg-gradient-to-br from-healthcare-primary-light to-healthcare-primary text-white rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-3">⏱️ Antwortzeit</h3>
                <p className="text-white/90 text-sm">
                  Wir antworten in der Regel innerhalb von <strong>24 Stunden</strong> auf Ihre Anfrage.
                </p>
                <p className="text-white/80 text-xs mt-3">
                  Bei Notfällen nutzen Sie bitte die Notrufnummern oben.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-healthcare-primary text-3xl font-medium mb-3">
                    Kontaktformular
                  </h2>
                  <p className="text-gray-600">
                    Füllen Sie das folgende Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="bg-white py-12 md:py-16 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-healthcare-primary text-3xl font-medium text-center mb-12">
            Häufig gestellte Fragen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ Item 1 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Wie schnell erhalte ich eine Antwort?
              </h3>
              <p className="text-gray-700 text-sm">
                Wir bemühen uns, alle Anfragen innerhalb von 24 Stunden zu beantworten. In dringenden Fällen melden wir uns schneller.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Ist das Kontaktformular sicher?
              </h3>
              <p className="text-gray-700 text-sm">
                Ja, alle Daten werden verschlüsselt übertragen (SSL/TLS) und DSGVO-konform verarbeitet.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Was passiert mit meinen Daten?
              </h3>
              <p className="text-gray-700 text-sm">
                Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Kann ich auch telefonisch Kontakt aufnehmen?
              </h3>
              <p className="text-gray-700 text-sm">
                Ja, Sie erreichen uns telefonisch unter +49 800 80 44 100 während unserer Öffnungszeiten.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Welche Informationen sollte ich angeben?
              </h3>
              <p className="text-gray-700 text-sm">
                Bitte beschreiben Sie Ihr Anliegen so detailliert wie möglich, damit wir Ihnen optimal helfen können.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-healthcare-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-healthcare-primary font-medium text-lg mb-3">
                Was ist bei Notfällen zu tun?
              </h3>
              <p className="text-gray-700 text-sm">
                Bei medizinischen Notfällen rufen Sie bitte sofort die 112 an. Unser Formular ist nicht für Notfälle geeignet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
