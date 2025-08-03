import SimplePage from './page-simple'
import { getPageBySlug, getPageMetadata } from '@/lib/strapi/pages'
import { renderSection, debugSectionTypes } from '@/components/sections'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageData = await getPageBySlug('home')

    if (!pageData) {
      return {
        title: 'Startseite',
        description: 'Willkommen bei Zweitmeinung.ng - Ihre medizinische Zweitmeinung online'
      }
    }

    const metadata = getPageMetadata(pageData)

    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      openGraph: {
        title: metadata.ogTitle,
        description: metadata.ogDescription,
        images: metadata.ogImage ? [metadata.ogImage] : undefined,
      },
      twitter: {
        card: metadata.twitterCard as any,
        title: metadata.ogTitle,
        description: metadata.ogDescription,
        images: metadata.ogImage ? [metadata.ogImage] : undefined,
      },
      alternates: {
        canonical: metadata.canonical || '/',
      },
      robots: {
        index: !metadata.noindex,
        follow: !metadata.nofollow,
      },
    }
  } catch (error) {
    console.error('💥 Error generating homepage metadata:', error)
    return {
      title: 'Startseite',
      description: 'Willkommen bei Zweitmeinung.ng - Ihre medizinische Zweitmeinung online'
    }
  }
}

export default async function HomePage() {
  let pageData = null

  try {
    console.log('🏠 Loading homepage data...')
    pageData = await getPageBySlug('home')
    console.log('📊 Homepage data loaded:', pageData ? 'SUCCESS' : 'FAILED')
  } catch (error) {
    console.error('💥 Error loading homepage:', error)
  }

  // Debug section types in development
  if (process.env.NODE_ENV === 'development' && pageData?.attributes.sections) {
    debugSectionTypes(pageData.attributes.sections)
  }

  // Test with real data if available
  if (!pageData || !pageData.attributes.sections || pageData.attributes.sections.length === 0) {
    console.log('🔧 Using simplified page - no sections available')
    return <SimplePage />
  }

  console.log('🎯 Using real Strapi data!')

  if (!pageData) {
    console.log('⚠️ No homepage data available, using fallback content')

    return (
      <div className="min-h-screen bg-healthcare-background">
        {/* Fallback Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-healthcare-medical-green via-healthcare-medical-mid to-healthcare-medical-yellow opacity-90" />

          <div className="relative h-full flex items-center justify-center">
            <div className="container-custom text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8">
                <span className="text-white font-medium text-lg">
                  🏥 Professionelle Medizin
                </span>
              </div>

              <h1 className="mb-8">
                <span className="block">Ihre Gesundheit</span>
                <span className="block text-healthcare-accent-green">verdient eine</span>
                <span className="block">zweite Meinung</span>
              </h1>

              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Erhalten Sie schnell und unkompliziert eine professionelle medizinische
                Zweitmeinung von erfahrenen Fachärzten. Vertrauen Sie auf unsere Expertise
                für Ihre Gesundheit und Ihr Wohlbefinden.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/kontakt"
                  className="bg-healthcare-primary-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-healthcare-accent-hover focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light/50"
                >
                  Beratung anfragen
                </a>
                <a
                  href="/leistungen"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-healthcare-primary focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  Unsere Leistungen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Fallback Features Section */}
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
                <div key={`fallback-feature-${index}`} className="card text-center">
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

        {/* Fallback CTA Section */}
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

  // Ensure sections exist and are valid
  const validSections = pageData.attributes.sections?.filter((section: any) => {
    const isValid = section &&
                   typeof section === 'object' &&
                   section.__component &&
                   typeof section.id === 'number' &&
                   section.id > 0

    if (!isValid) {
      console.warn('⚠️ Invalid section found:', section)
    }

    return isValid
  }) || []

  console.log(`✅ Rendering ${validSections.length} valid sections`)

  return (
    <>
      {/* Render Dynamic Sections from Strapi */}
      {validSections.map((section: any, index: number) => {
        try {
          return renderSection(section, index)
        } catch (error) {
          console.error(`💥 Error rendering section ${section.__component}:`, error)
          return (
            <div key={`error-section-${section.id}-${index}`} className="section-padding bg-red-50">
              <div className="container-custom text-center">
                <h3 className="text-red-600 font-semibold">
                  Fehler beim Laden des Inhalts
                </h3>
                <p className="text-red-500 text-sm">
                  Section: {section.__component} (ID: {section.id})
                </p>
              </div>
            </div>
          )
        }
      })}

      {/* Additional Content Sections */}
      {validSections.length > 0 && (
        <>
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
                  <div key={`feature-${index}`} className="card text-center group hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-healthcare-primary mb-4 group-hover:text-healthcare-primary-light transition-colors">
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
        </>
      )}

      {/* Fallback content if no valid sections */}
      {validSections.length === 0 && (
        <div className="section-padding bg-healthcare-background">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold text-healthcare-primary mb-6">
              {pageData.attributes.title}
            </h1>
            {pageData.attributes.description && (
              <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
                {pageData.attributes.description}
              </p>
            )}
            <div className="mt-8">
              <p className="text-healthcare-text-muted">
                Inhalt wird geladen oder ist noch nicht verfügbar.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
