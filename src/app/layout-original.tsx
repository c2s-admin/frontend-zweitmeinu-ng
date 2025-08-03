import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCachedSiteConfig } from '@/lib/strapi/site-config'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteConfig = await getCachedSiteConfig()

    const siteName = siteConfig?.attributes.siteName || 'Zweitmeinung.ng'
    const domain = siteConfig?.attributes.domain || 'zweitmein.ng'

    return {
      title: {
        default: `${siteName} - Medizinische Zweitmeinung online`,
        template: `%s | ${siteName}`
      },
      description: 'Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten. Vertrauen Sie auf unsere Expertise für Ihre Gesundheit.',
      keywords: ['Zweitmeinung', 'Medizin', 'Gesundheit', 'Beratung', 'Facharzt', 'Online-Beratung'],
      authors: [{ name: siteName }],
      creator: siteName,
      publisher: siteName,
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(`https://${domain}`),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: `${siteName} - Medizinische Zweitmeinung online`,
        description: 'Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten.',
        url: `https://${domain}`,
        siteName: siteName,
        locale: 'de_DE',
        type: 'website',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${siteName} - Medizinische Zweitmeinung`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${siteName} - Medizinische Zweitmeinung online`,
        description: 'Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten.',
        images: ['/og-image.jpg'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: 'your-google-verification-code',
        // other verification codes
      },
    }
  } catch (error) {
    console.error('💥 Error generating metadata:', error)

    // Fallback metadata
    return {
      title: 'Zweitmeinung.ng - Medizinische Zweitmeinung online',
      description: 'Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten.',
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let siteConfig = null

  try {
    console.log('🏗️ Loading site configuration in layout...')
    siteConfig = await getCachedSiteConfig()
    console.log('✅ Site config loaded successfully:', siteConfig?.attributes?.siteName)
  } catch (error) {
    console.error('💥 Error loading site config in layout:', error)
  }

  if (!siteConfig) {
    console.log('⚠️ No site config available, using fallback layout')

    // Fallback Layout wenn Site Config nicht geladen werden kann
    return (
      <html lang="de">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="min-h-screen flex flex-col bg-healthcare-background">
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-healthcare-primary mb-4">
                Website wird geladen...
              </h1>
              <p className="text-healthcare-text-muted">
                Bitte haben Sie einen Moment Geduld, während wir die Website-Konfiguration laden.
              </p>
              <div className="mt-4 animate-spin w-8 h-8 border-4 border-healthcare-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        {siteConfig.attributes.favicon?.data ? (
          <link rel="icon" href={siteConfig.attributes.favicon.data.attributes.url} />
        ) : (
          <link rel="icon" href="/favicon.ico" />
        )}

        {/* Preload critical resources */}
        <link rel="dns-prefetch" href="https://st.zh3.de" />

        {/* SEO Meta Tags */}
        <meta name="theme-color" content="#004166" />
        <meta name="msapplication-TileColor" content="#004166" />

        {/* Structured Data for Healthcare */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": siteConfig.attributes.siteName,
              "url": `https://${siteConfig.attributes.domain}`,
              "logo": siteConfig.attributes.logo?.data?.attributes.url,
              "description": "Professionelle medizinische Zweitmeinung online",
              "telephone": siteConfig.attributes.contact?.phone,
              "email": siteConfig.attributes.contact?.email,
              "address": siteConfig.attributes.contact?.address ? {
                "@type": "PostalAddress",
                "addressLocality": "Deutschland",
                "addressRegion": "DE",
                "streetAddress": siteConfig.attributes.contact.address
              } : undefined,
              "sameAs": [
                siteConfig.attributes.socialMedia?.facebook,
                siteConfig.attributes.socialMedia?.linkedin,
                siteConfig.attributes.socialMedia?.instagram,
              ].filter(Boolean),
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Medizinische Leistungen",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "MedicalProcedure",
                      "name": "Medizinische Zweitmeinung"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-healthcare-primary text-white px-4 py-2 rounded-md z-50"
        >
          Zum Hauptinhalt springen
        </a>

        <Header siteConfig={siteConfig.attributes} />

        <main id="main-content" className="flex-grow pt-20">
          {children}
        </main>

        <Footer siteConfig={siteConfig.attributes} />

        {/* Cookie Consent Banner */}
        <div id="cookie-banner" className="fixed bottom-0 left-0 right-0 bg-healthcare-primary-dark text-white p-4 z-50 transform translate-y-full transition-transform duration-300">
          <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              Diese Website verwendet Cookies, um die bestmögliche Erfahrung zu gewährleisten.
            </p>
            <div className="flex gap-2">
              <button
                className="bg-healthcare-accent-green px-4 py-2 rounded text-sm hover:bg-healthcare-accent-hover transition-colors"
                onClick={() => {
                  document.getElementById('cookie-banner')?.classList.add('translate-y-full')
                  localStorage.setItem('cookieConsent', 'accepted')
                }}
              >
                Akzeptieren
              </button>
              <button
                className="bg-transparent border border-white px-4 py-2 rounded text-sm hover:bg-white hover:text-healthcare-primary transition-colors"
                onClick={() => {
                  document.getElementById('cookie-banner')?.classList.add('translate-y-full')
                  localStorage.setItem('cookieConsent', 'declined')
                }}
              >
                Ablehnen
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Banner Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const consent = localStorage.getItem('cookieConsent');
                if (!consent) {
                  setTimeout(() => {
                    const banner = document.getElementById('cookie-banner');
                    if (banner) banner.classList.remove('translate-y-full');
                  }, 2000);
                }
              })();
            `
          }}
        />
      </body>
    </html>
  )
}
