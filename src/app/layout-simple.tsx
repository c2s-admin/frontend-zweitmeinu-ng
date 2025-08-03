import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zweitmeinung.ng - Medizinische Zweitmeinung online',
  description: 'Erhalten Sie schnell und unkompliziert eine professionelle medizinische Zweitmeinung von Fachärzten.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#004166" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Simplified Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-healthcare-border">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-healthcare-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <span className="text-2xl font-bold text-healthcare-primary">
                  Zweitmeinung.ng
                </span>
              </div>

              <div className="hidden lg:flex items-center space-x-8">
                <a href="/" className="text-healthcare-primary hover:text-healthcare-primary-light font-medium">Home</a>
                <a href="/zweitmeinung" className="text-healthcare-primary hover:text-healthcare-primary-light font-medium">Zweitmeinung</a>
                <a href="/fachbereiche" className="text-healthcare-primary hover:text-healthcare-primary-light font-medium">Fachbereiche</a>
                <a href="/kontakt" className="text-healthcare-primary hover:text-healthcare-primary-light font-medium">Kontakt</a>
                <a href="tel:+4917647870680" className="bg-healthcare-primary-light text-white px-6 py-3 rounded-lg font-medium hover:bg-healthcare-accent-hover transition-colors">
                  Notfall-Zweitmeinung
                </a>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Simplified Footer */}
        <footer className="bg-healthcare-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Zweitmeinung.ng</h3>
                <p className="text-gray-300">
                  Ihre Gesundheit verdient eine zweite Meinung. Vertrauen Sie auf unsere medizinische Expertise.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
                <div className="space-y-2 text-gray-300">
                  <p>E-Mail: info@zweitmein.ng</p>
                  <p>Telefon: +49 176 47870680</p>
                  <p className="text-healthcare-accent-green">24/7 Notfallberatung</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Medizinische Zweitmeinung</li>
                  <li>Online Beratung</li>
                  <li>Healthcare AI</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-healthcare-primary/30 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Zweitmeinung.ng. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
