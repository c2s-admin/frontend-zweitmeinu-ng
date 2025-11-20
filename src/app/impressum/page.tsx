import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Building2, FileText, Scale } from 'lucide-react'
import { getLegalPage } from '@/lib/strapi/legal-pages'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Impressum | Zweitmeinung.ng',
  description: 'Impressum und rechtliche Angaben der complex care solutions GmbH - Ihr Partner für medizinische Zweitmeinungen.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ImpressumPage() {
  // Load impressum data from Strapi
  const impressumData = await getLegalPage('impressum')

  // If no data found in Strapi, show 404
  if (!impressumData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-healthcare-background">
      {/* Emergency Banner */}
      <div className="bg-healthcare-primary text-white text-center py-3 px-4">
        <p className="text-sm md:text-base">
          Medizinischer Notfall?{' '}
          <a
            href="tel:+4980080441100"
            className="font-semibold underline hover:text-healthcare-accent-green transition-colors"
            aria-label="Notfall-Hotline anrufen: 0800 80 44 100"
          >
            📞 0800 80 44 100
          </a>
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-healthcare-primary mb-4">
            Impressum
          </h1>
          <p className="text-lg text-healthcare-text-muted">
            Angaben gemäß § 5 TMG
          </p>
        </header>

        {/* Company Information */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="company-info">
          <div className="flex items-start gap-3 mb-6">
            <Building2 className="w-6 h-6 text-healthcare-primary-light flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h2 id="company-info" className="text-2xl font-semibold text-healthcare-primary mb-4">
                Firmeninformation
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-healthcare-text">
            <div>
              <p className="font-semibold text-lg">complex care solutions GmbH</p>
              <p className="text-healthcare-text-muted">Ihr Partner für medizinische Zweitmeinungen</p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-healthcare-primary-light flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="font-medium">Anschrift:</p>
                <p>Hans-Böckler-Str. 19</p>
                <p>46236 Bottrop</p>
                <p>Deutschland</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="contact-info">
          <div className="flex items-start gap-3 mb-6">
            <Phone className="w-6 h-6 text-healthcare-primary-light flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h2 id="contact-info" className="text-2xl font-semibold text-healthcare-primary mb-4">
                Kontakt
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-healthcare-text">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-healthcare-primary-light" aria-hidden="true" />
              <div>
                <span className="font-medium">Telefon: </span>
                <a
                  href="tel:+4980080441100"
                  className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
                  aria-label="Telefonnummer anrufen"
                >
                  0800 80 44 100
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-healthcare-primary-light" aria-hidden="true" />
              <div>
                <span className="font-medium">Fax: </span>
                <span>0800 80 44 190</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-healthcare-primary-light" aria-hidden="true" />
              <div>
                <span className="font-medium">E-Mail: </span>
                <a
                  href="mailto:kontakt@complexcaresolutions.de"
                  className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
                  aria-label="E-Mail senden an kontakt@complexcaresolutions.de"
                >
                  kontakt@complexcaresolutions.de
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-healthcare-background rounded-lg">
              <p className="text-sm text-healthcare-text-muted">
                <strong>Öffnungszeiten:</strong>
              </p>
              <ul className="text-sm text-healthcare-text mt-2 space-y-1">
                <li>Montag - Freitag: 09:00 - 16:00 Uhr</li>
                <li>Samstag - Sonntag: geschlossen</li>
                <li className="text-healthcare-primary-light font-medium mt-2">
                  24/7 Notfall-Hotline verfügbar
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal Representatives */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="legal-info">
          <div className="flex items-start gap-3 mb-6">
            <Scale className="w-6 h-6 text-healthcare-primary-light flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h2 id="legal-info" className="text-2xl font-semibold text-healthcare-primary mb-4">
                Rechtliche Angaben
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-healthcare-text">
            <div>
              <p className="font-medium mb-2">Vertretungsberechtigte Geschäftsführung:</p>
              <p className="text-healthcare-text-muted">
                Martin Porwoll
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Registergericht:</p>
              <p className="text-healthcare-text-muted">
                Amtsgericht Gelsenkirchen
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Handelsregisternummer:</p>
              <p className="text-healthcare-text-muted">
                HRB 15753
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Umsatzsteuer-Identifikationsnummer:</p>
              <p className="text-healthcare-text-muted">
                gemäß §27 a Umsatzsteuergesetz:<br />
                DE334815479
              </p>
            </div>

            <div className="pt-4 border-t border-healthcare-background">
              <p className="font-medium mb-2">Redaktionell verantwortlich:</p>
              <p className="text-healthcare-text-muted">
                Martin Porwoll<br />
                Hans-Böckler-Str. 19<br />
                46236 Bottrop
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="dispute-resolution">
          <h2 id="dispute-resolution" className="text-2xl font-semibold text-healthcare-primary mb-4">
            EU-Streitschlichtung
          </h2>
          <div className="space-y-4 text-healthcare-text">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
                aria-label="EU Online-Streitbeilegungsplattform öffnen (öffnet in neuem Fenster)"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="consumer-dispute">
          <h2 id="consumer-dispute" className="text-2xl font-semibold text-healthcare-primary mb-4">
            Verbraucherstreitbeilegung/Universalschlichtungsstelle
          </h2>
          <div className="space-y-4 text-healthcare-text">
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        {/* Copyright and Liability */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="copyright-info">
          <h2 id="copyright-info" className="text-2xl font-semibold text-healthcare-primary mb-4">
            Haftung für Inhalte
          </h2>
          <div className="space-y-4 text-healthcare-text text-sm">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
              Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
              der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" aria-labelledby="links-info">
          <h2 id="links-info" className="text-2xl font-semibold text-healthcare-primary mb-4">
            Haftung für Links
          </h2>
          <div className="space-y-4 text-healthcare-text text-sm">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
              Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-8" aria-labelledby="copyright-section">
          <h2 id="copyright-section" className="text-2xl font-semibold text-healthcare-primary mb-4">
            Urheberrecht
          </h2>
          <div className="space-y-4 text-healthcare-text text-sm">
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
              deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
              außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
              Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
              Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem
              auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="mt-8 p-6 bg-healthcare-primary/5 border-l-4 border-healthcare-primary-light rounded-r-lg" aria-labelledby="medical-disclaimer">
          <h3 id="medical-disclaimer" className="text-lg font-semibold text-healthcare-primary mb-3">
            Medizinischer Hinweis
          </h3>
          <p className="text-sm text-healthcare-text">
            Die auf dieser Website bereitgestellten Informationen dienen ausschließlich allgemeinen
            Informationszwecken und ersetzen keine professionelle medizinische Beratung, Diagnose oder
            Behandlung. Konsultieren Sie bei gesundheitlichen Fragen oder Beschwerden immer einen Arzt
            oder qualifizierten Gesundheitsdienstleister.
          </p>
        </section>

        {/* Footer Links */}
        <nav className="mt-12 pt-8 border-t border-healthcare-background" aria-label="Rechtliche Seiten">
          <p className="text-sm text-healthcare-text-muted mb-4">
            Weitere rechtliche Informationen:
          </p>
          <ul className="flex flex-wrap gap-4 text-sm">
            <li>
              <a
                href="/datenschutz"
                className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
              >
                Datenschutzerklärung
              </a>
            </li>
            <li>
              <a
                href="/agb"
                className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
              >
                AGB
              </a>
            </li>
            <li>
              <a
                href="/kontakt"
                className="text-healthcare-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:ring-offset-2 rounded"
              >
                Kontakt
              </a>
            </li>
          </ul>
        </nav>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-xs text-healthcare-text-muted">
            Version: {impressumData.version} | Stand: {new Date(impressumData.updatedAt).toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
