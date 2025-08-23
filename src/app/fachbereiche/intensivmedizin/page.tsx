import { Metadata } from 'next'
import { Shield, Heart, Users, AlertTriangle, Phone, Mail, ArrowRight, FileText, UserCheck, Stethoscope, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zweitmeinung Intensivmedizin | zweitmeinung.ng',
  description: 'Unabhängige ärztliche Zweitmeinung bei intensivmedizinischer Behandlung. Jetzt fundierte Empfehlung einholen – mit CCS sicher entscheiden.',
  keywords: 'Zweitmeinung Intensiv, ärztliche Zweitmeinung, Intensivmedizin, Langzeitbeatmung, Wachkoma, palliative Versorgung, Zweitmeinung bei Intensivtherapie, Pflegegutachten, Patientenwille, Case Management',
  robots: 'index, follow',
}

export default function IntensivmedizinPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Emergency Notice */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
        <div className="container-custom">
          <AlertTriangle className="inline w-4 h-4 mr-2" />
          Medizinischer Notfall? Wählen Sie sofort 112 oder kontaktieren Sie Ihren Notarzt
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-healthcare-primary to-healthcare-primary-light py-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-healthcare-primary/90" />
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/10 rounded-full" />
          </div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-red-300" />
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="text-sm text-white/70 mb-6">
              <span>Fachbereiche</span> / <span className="text-healthcare-accent-green">Intensivmedizin</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Zweitmeinung Intensiv – fundierte Beratung in kritischen Situationen
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Wenn intensivmedizinische Entscheidungen anstehen, brauchen Patient:innen und ihre Angehörigen mehr als nur medizinische Information – <strong>sie brauchen Orientierung, Sicherheit und eine unabhängige fachliche Einschätzung.</strong>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+4980080441100"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                Notfall-Beratung
              </a>
              
              <a 
                href="#details"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-sm"
              >
                Mehr erfahren
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Introduction */}
      <section id="details" className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-xl mb-16">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                  Für Menschen in sehr schwerer gesundheitlicher Lage
                </h2>
              </div>
              
              <p className="text-xl text-healthcare-text-muted leading-relaxed text-center mb-8">
                <strong>Unsere Dienstleistung „Zweitmeinung Intensiv" richtet sich an Menschen in sehr schwerer gesundheitlicher Lage</strong>, etwa bei <strong>Langzeitbeatmung, Wachkoma oder im palliativen Kontext</strong>. Wir bieten Ihnen eine ärztliche Zweitmeinung durch hochqualifizierte Fachärzt:innen für Intensivmedizin, Anästhesie oder Palliativmedizin – ergänzt durch pflegefachliche Begleitung auf Augenhöhe.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-6 h-6 text-healthcare-primary" />
                  </div>
                  <h3 className="font-semibold text-healthcare-primary">Langzeitbeatmung</h3>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-healthcare-primary" />
                  </div>
                  <h3 className="font-semibold text-healthcare-primary">Wachkoma</h3>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-healthcare-primary" />
                  </div>
                  <h3 className="font-semibold text-healthcare-primary">Palliativkontext</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Was wir leisten
              </h2>
              <p className="text-xl text-healthcare-text-muted">
                Umfassende intensivmedizinische Beratung in kritischen Situationen
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Strukturierte Beratung durch erfahrene Case Manager:innen
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Professionelle Koordination und Begleitung durch alle Schritte des Beratungsprozesses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <FileText className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Unabhängige ärztliche Zweitmeinung inkl. schriftlichem Gutachten
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Detaillierte medizinische Einschätzung durch Fachärzt:innen für Intensivmedizin, Anästhesie oder Palliativmedizin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Bewertung von Therapiezielen, Indikationen, Patientenverfügung & Prognose
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Umfassende Analyse aller relevanten medizinischen und ethischen Aspekte
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Unterstützung bei der Umsetzung: von palliativer Umsteuerung bis Pflegeüberleitung
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Praktische Hilfe bei der Implementierung der empfohlenen Maßnahmen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Für wen ist das Angebot gedacht?
              </h2>
              <p className="text-xl text-healthcare-text-muted leading-relaxed">
                Die Zweitmeinung kann von Betroffenen selbst oder ihren rechtlichen Vertreter:innen beauftragt werden. <strong>In vielen Fällen übernehmen Angehörige die Kommunikation</strong> – wir begleiten Sie professionell und empathisch durch alle Schritte.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Für Betroffene
                </h3>
                <p className="text-healthcare-text-muted">
                  Patient:innen, die sich in intensivmedizinischer Behandlung befinden und eine unabhängige Einschätzung wünschen
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Für Angehörige
                </h3>
                <p className="text-healthcare-text-muted">
                  Rechtliche Vertreter:innen und Angehörige, die schwierige Entscheidungen für ihre Liebsten treffen müssen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Ihr Nutzen
              </h2>
              <p className="text-xl text-healthcare-text-muted">
                Schutz und Sicherheit in ethisch herausfordernden Situationen
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-healthcare-background rounded-2xl p-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Vermeidung nicht indizierter Eingriffe oder fortgesetzter Maximaltherapie
                </h3>
                <p className="text-healthcare-text-muted">
                  Schutz vor überflüssigen oder belastenden intensivmedizinischen Maßnahmen
                </p>
              </div>

              <div className="bg-healthcare-background rounded-2xl p-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Sicherung des Patientenwillens in ethisch sensiblen Situationen
                </h3>
                <p className="text-healthcare-text-muted">
                  Respekt und Umsetzung der Wünsche des Patienten auch in schwierigen Entscheidungen
                </p>
              </div>

              <div className="bg-healthcare-background rounded-2xl p-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Medizinisch und rechtlich belastbare Entscheidungsgrundlage
                </h3>
                <p className="text-healthcare-text-muted">
                  Fundierte Basis für alle weiteren Behandlungsentscheidungen mit rechtlicher Absicherung
                </p>
              </div>

              <div className="bg-healthcare-background rounded-2xl p-8">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Transparente Kommunikation und datenschutzkonformer Ablauf
                </h3>
                <p className="text-healthcare-text-muted">
                  Offene, verständliche Information bei höchstem Schutz sensibler medizinischer Daten
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Complex Care Solutions */}
      <section className="py-24 bg-healthcare-primary text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Warum complex care solutions?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
              Wir arbeiten <strong>vollständig unabhängig, neutral und ausschließlich auf Wunsch der Versicherten</strong>. Unsere Gutachten entstehen im Team mit langjährig erfahrenen Ärzt:innen und Pflegeexpert:innen, die komplexe Versorgungssituationen <strong>medizinisch, pflegerisch und ethisch</strong> bewerten – mit echtem Engagement für das Patientenwohl.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-300 mb-4">
                  200+
                </div>
                <div className="text-lg text-white/80">
                  Intensivmedizinische Zweitmeinungen
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-300 mb-4">
                  24/7
                </div>
                <div className="text-lg text-white/80">
                  Notfall-Erreichbarkeit
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-300 mb-4">
                  100%
                </div>
                <div className="text-lg text-white/80">
                  Unabhängige Bewertung
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Brauchen Sie intensivmedizinische Beratung?
              </h2>
              
              <p className="text-xl text-healthcare-text-muted mb-8">
                Kontaktieren Sie uns für eine unabhängige, professionelle Einschätzung in kritischen Situationen
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a 
                  href="tel:+4980080441100"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Notfall-Hotline: +49 800 80 44 100
                </a>
                
                <a 
                  href="mailto:kontakt@zweitmeinu.ng"
                  className="bg-healthcare-primary hover:bg-healthcare-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  E-Mail schreiben
                </a>
              </div>
              
              <div className="text-sm text-healthcare-text-muted space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-healthcare-success" />
                  Kostenlos für Versicherte teilnehmender Krankenkassen
                </p>
                <p className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Bei akuten medizinischen Notfällen wählen Sie bitte sofort 112
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}