import { Metadata } from 'next'
import { Award, Shield, Users, CheckCircle, Phone, Mail, ArrowRight, FileText, Video, Stethoscope, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zweitmeinung Onkologie – fundierte Einschätzung bei Krebs | zweitmeinung.ng',
  description: 'Unabhängige ärztliche Zweitmeinung bei Krebs. Behandlungsalternativen prüfen – mit komplexer Expertise und verständlicher Beratung.',
  keywords: 'Zweitmeinung Onkologie, ärztliche Zweitmeinung Krebs, Krebsbehandlung Beratung, Zweitmeinung Chemotherapie, Krebstherapie Alternativen, Onkologie Zweitgutachten, Zweitmeinung Tumorzentrum, Patientenrechte Onkologie',
  robots: 'index, follow',
}

export default function OnkologiePage() {
  return (
    <div className="min-h-screen bg-white">
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
              <div className="w-20 h-20 bg-healthcare-accent-green/20 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-healthcare-accent-green" />
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="text-sm text-white/70 mb-6">
              <span>Fachbereiche</span> / <span className="text-healthcare-accent-green">Onkologie</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Zweitmeinung Onkologie – fundierte Entscheidungshilfe bei Krebsdiagnosen
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Eine Krebsdiagnose ist ein Einschnitt. Neben der seelischen Belastung stellt sich oft eine ganz zentrale Frage: <strong>Ist die empfohlene Behandlung wirklich die beste Wahl?</strong> Oder gibt es schonendere oder effektivere Alternativen?
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+4980080441100"
                className="bg-healthcare-accent-green hover:bg-healthcare-accent-green/90 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                Jetzt beraten lassen
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-8">
              Strukturierte, unabhängige und hochqualifizierte Einschätzung
            </h2>
            <p className="text-xl text-healthcare-text-muted leading-relaxed mb-12">
              Mit unserer Dienstleistung <strong>„Zweitmeinung Onkologie"</strong> bieten wir Ihnen eine strukturierte, unabhängige und hochqualifizierte Einschätzung Ihrer Diagnose und Therapieempfehlung. Unsere spezialisierten Fachärzt:innen für Onkologie und verwandte Disziplinen prüfen medizinische Unterlagen, bewerten Therapiepläne anhand aktueller Leitlinien und zeigen Ihnen mögliche Alternativen auf – <strong>individuell, empathisch und medizinisch fundiert</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do For You */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Was wir für Sie tun
              </h2>
              <p className="text-xl text-healthcare-text-muted">
                Umfassende onkologische Beratung mit höchster fachlicher Expertise
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Auswertung Ihrer Diagnose und Befunde durch erfahrene Fachärzt:innen
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Gründliche Analyse aller medizinischen Unterlagen durch spezialisierte Onkolog:innen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Bewertung der geplanten Therapie im Hinblick auf Wirksamkeit, Nebenwirkungen und Lebensqualität
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Umfassende Einschätzung aller Behandlungsaspekte für Ihre individuelle Situation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <FileText className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Schriftliches Zweitmeinungsgutachten mit verständlicher Empfehlung
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Detaillierte, laienverständliche Dokumentation für Ihre Entscheidungsfindung
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Video className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Optionales Gespräch zur Erläuterung der Einschätzung – telefonisch oder per Video
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Persönlicher Austausch mit unseren Onkologie-Expert:innen für alle Ihre Fragen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Auf Wunsch: Einbindung von Case Management und Palliativberatung
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Ganzheitliche Betreuung und Unterstützung in allen Phasen der Behandlung
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When is Second Opinion Useful */}
      <section className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Wann ist eine Zweitmeinung sinnvoll?
              </h2>
              <p className="text-xl text-healthcare-text-muted leading-relaxed mb-8">
                Unser Angebot richtet sich an Menschen mit <strong>neu gestellter oder fortgeschrittener Krebsdiagnose</strong> – z. B. bei Empfehlung einer <strong>Chemotherapie, Operation, Immun- oder Strahlentherapie</strong>. Besonders bei komplexen Krankheitsbildern oder Therapien mit hohem Risiko lohnt sich die zusätzliche Einschätzung.
              </p>
              <p className="text-lg text-healthcare-text-muted leading-relaxed">
                Auch <strong>Angehörige oder gesetzliche Vertreter:innen</strong> können das Verfahren in Ihrem Namen in Anspruch nehmen – etwa, wenn Sie durch Ihre Erkrankung entlastet werden möchten oder selbst nicht entscheidungsfähig sind.
              </p>
            </div>

            {/* Benefits from API */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Medizinisch fundierte Zweitmeinung auf dem aktuellen Stand der Leitlinien
                </h3>
                <p className="text-healthcare-text-muted">
                  Evidenzbasierte Bewertung nach neuesten wissenschaftlichen Erkenntnissen
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Transparente und verständliche Aufklärung über Ihre Optionen
                </h3>
                <p className="text-healthcare-text-muted">
                  Klare Kommunikation aller Behandlungsmöglichkeiten und deren Auswirkungen
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Vermeidung unnötiger oder belastender Therapien
                </h3>
                <p className="text-healthcare-text-muted">
                  Schutz vor überflüssigen Behandlungen durch unabhängige medizinische Bewertung
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Bessere Entscheidungsbasis – für mehr Sicherheit und Selbstbestimmung
                </h3>
                <p className="text-healthcare-text-muted">
                  Fundierte Grundlage für informierte Entscheidungen über Ihre Krebsbehandlung
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
              Unsere Gutachter:innen sind <strong>unabhängig</strong> und ausschließlich Ihrem Wohl verpflichtet – ohne Interessenkonflikte oder wirtschaftliche Zielvorgaben. Wir kennen die Herausforderungen einer Krebsdiagnose – <strong>medizinisch, emotional und sozial</strong>. Deshalb begleiten wir Sie auf Augenhöhe und mit höchster fachlicher Präzision.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  1000+
                </div>
                <div className="text-lg text-white/80">
                  Onkologische Zweitmeinungen
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  20+
                </div>
                <div className="text-lg text-white/80">
                  Jahre Erfahrung
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  98%
                </div>
                <div className="text-lg text-white/80">
                  Patientenzufriedenheit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section from API */}
      <section className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Häufig gestellte Fragen
              </h2>
              <p className="text-xl text-healthcare-text-muted">
                Antworten auf die wichtigsten Fragen zur onkologischen Zweitmeinung
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Wann ist eine Zweitmeinung bei einer Krebsdiagnose sinnvoll?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Eine Zweitmeinung ist besonders sinnvoll vor Beginn einer geplanten Chemotherapie, Operation oder Bestrahlung. Sie kann helfen, die Therapieentscheidung abzusichern oder Alternativen aufzuzeigen – insbesondere bei komplexen oder risikobehafteten Behandlungen.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Wer erstellt die Zweitmeinung?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Die Zweitmeinung wird von erfahrenen, unabhängigen Fachärzt:innen für Onkologie erstellt. Sie arbeiten evidenzbasiert nach aktuellen Leitlinien und sind nicht wirtschaftlich an das Behandlungsergebnis gebunden.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Kostet mich die Zweitmeinung etwas?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Für Versicherte teilnehmender Krankenkassen (z. B. DAK-Gesundheit, IKK classic) ist die Zweitmeinung kostenfrei. Es entstehen keine versteckten Kosten für Patient:innen oder Angehörige.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Kann ich auch als Angehörige:r eine Zweitmeinung anstoßen?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Ja. Bevollmächtigte, Angehörige oder gesetzliche Betreuer:innen können eine Zweitmeinung im Namen des Versicherten beantragen – insbesondere wenn dieser selbst nicht entscheidungsfähig ist.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Was bekomme ich am Ende des Verfahrens?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Sie erhalten ein schriftliches ärztliches Gutachten mit einer fachlich begründeten Empfehlung zur weiteren Behandlung. Auf Wunsch erläutern wir das Ergebnis zusätzlich telefonisch oder per Videoberatung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-healthcare-background rounded-3xl p-12 shadow-xl">
              <div className="w-16 h-16 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Award className="w-8 h-8 text-healthcare-accent-green" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Zweitmeinung Onkologie – für Klarheit, Sicherheit und einen Weg, der zu Ihnen passt
              </h2>
              
              <p className="text-xl text-healthcare-text-muted mb-8">
                Kontaktieren Sie uns für eine unabhängige, professionelle Einschätzung Ihrer onkologischen Behandlung
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+4980080441100"
                  className="bg-healthcare-accent-green hover:bg-healthcare-accent-green/90 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  +49 800 80 44 100
                </a>
                
                <a 
                  href="mailto:kontakt@zweitmeinu.ng"
                  className="bg-healthcare-primary hover:bg-healthcare-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  E-Mail schreiben
                </a>
              </div>
              
              <div className="mt-8 text-sm text-healthcare-text-muted">
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-healthcare-success" />
                  Kostenlos für Versicherte teilnehmender Krankenkassen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}