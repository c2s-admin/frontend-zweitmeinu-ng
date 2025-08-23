import { Metadata } from 'next'
import { Heart, Shield, Users, Award, Phone, Mail, CheckCircle, ArrowRight, FileText, Video, Stethoscope } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zweitmeinung Kardiologie – Einschätzung vor Eingriffen | zweitmeinung.ng',
  description: 'Unabhängige Zweitmeinung bei geplanter PCI oder Herzoperation. CCS unterstützt Sie mit kardiologischer Expertise & neutraler Empfehlung.',
  keywords: 'Zweitmeinung Kardiologie, Herzkatheter Zweitmeinung, Zweitmeinung Stent, Herz-OP Beratung, Zweitmeinung PCI, Zweitmeinung Herzklappe, Bypass Zweitmeinung, unabhängiger Kardiologe',
  robots: 'index, follow',
}

export default function KardiologiePage() {
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
                <Heart className="w-10 h-10 text-healthcare-accent-green" />
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="text-sm text-white/70 mb-6">
              <span>Fachbereiche</span> / <span className="text-healthcare-accent-green">Kardiologie</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Zweitmeinung Kardiologie – klare Empfehlungen bei Herzentscheidungen
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Herzbeschwerden verunsichern – und geplante Eingriffe wie eine Stent-Implantation (PCI) werfen viele Fragen auf. <strong>Unsere ärztliche Zweitmeinung bietet Ihnen eine fundierte, neutrale Einschätzung durch erfahrene Herzspezialist:innen.</strong>
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

      {/* When is Second Opinion Useful */}
      <section id="details" className="py-24 bg-healthcare-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Wann ist eine Zweitmeinung sinnvoll?
              </h2>
              <p className="text-xl text-healthcare-text-muted leading-relaxed">
                Besonders vor planbaren Eingriffen wie der <strong>Stent-Implantation</strong>, einer <strong>Herzoperation</strong> oder einer <strong>interventionellen Ablation</strong>. Auch wenn Sie unsicher sind, ob Ihre Beschwerden eine invasive Therapie rechtfertigen, oder ob alternative Behandlungswege bestehen.
              </p>
            </div>

            {/* Benefits from API */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Unabhängige Beurteilung durch erfahrene Kardiolog:innen
                </h3>
                <p className="text-healthcare-text-muted">
                  Neutrale Einschätzung ohne wirtschaftliche Eigeninteressen – ausschließlich in Ihrem Interesse.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Vermeidung unnötiger Eingriffe bei fehlender Indikation
                </h3>
                <p className="text-healthcare-text-muted">
                  Schutz vor überflüssigen invasiven Behandlungen durch fundierte medizinische Bewertung.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Besseres Verständnis der Risiken und Therapieziele
                </h3>
                <p className="text-healthcare-text-muted">
                  Umfassende Aufklärung über alle Behandlungsoptionen und deren Auswirkungen.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-healthcare-accent-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-healthcare-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Stärkung Ihrer Entscheidungssicherheit und Eigenverantwortung
                </h3>
                <p className="text-healthcare-text-muted">
                  Fundierte Basis für selbstbestimmte Entscheidungen über Ihre Herzgesundheit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do For You - From API */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Was wir für Sie tun
              </h2>
              <p className="text-xl text-healthcare-text-muted">
                Wir prüfen Ihre Befunde, Behandlungspläne und Risiken auf Basis der aktuellen Leitlinien
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Bewertung Ihrer Diagnosen und EKG-/Katheterbefunde
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Durch spezialisierte Fachärzt:innen für Kardiologie mit umfassender klinischer Erfahrung
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Zweitmeinung bei geplanter PCI, Bypass-OP oder medikamentöser Umstellung
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Unabhängige Einschätzung aller kardiologischen Behandlungsoptionen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <FileText className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Schriftliches ärztliches Gutachten mit klarer Empfehlung
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Verständlich formuliert für Ihre weitere Behandlungsplanung
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <Video className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Persönliche Erläuterung der Einschätzung telefonisch oder per Video
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Direkter Austausch mit unseren Kardiologie-Expert:innen für all Ihre Fragen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-healthcare-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-healthcare-primary mb-3">
                    Bei Bedarf: Empfehlung weiterer diagnostischer Schritte oder Schontherapie
                  </h3>
                  <p className="text-healthcare-text-muted">
                    Individuelle Behandlungsalternativen basierend auf Ihrer spezifischen Situation
                  </p>
                </div>
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
              Unsere Kardiologie-Expert:innen arbeiten <strong>unabhängig</strong> und ausschließlich im Interesse der Patient:innen. Wir kombinieren <strong>klinische Erfahrung</strong> mit <strong>ethischer Verantwortung</strong> – für eine Versorgung, die nicht nur leitliniengerecht, sondern auch menschlich sinnvoll ist.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  500+
                </div>
                <div className="text-lg text-white/80">
                  Kardiologische Zweitmeinungen
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  15+
                </div>
                <div className="text-lg text-white/80">
                  Jahre Erfahrung
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-healthcare-accent-green mb-4">
                  95%
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
                Antworten auf die wichtigsten Fragen zur kardiologischen Zweitmeinung
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Wann ist eine Zweitmeinung vor einem Herzkatheter sinnvoll?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Immer dann, wenn ein planbarer Eingriff wie eine PCI (Stent) oder eine OP empfohlen wurde. Auch bei Unsicherheit über Nutzen und Risiken oder wenn Sie Alternativen in Betracht ziehen möchten, ist eine Zweitmeinung sinnvoll.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Wer erstellt die kardiologische Zweitmeinung?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Ausschließlich erfahrene, unabhängige Fachärzt:innen für Kardiologie mit Leitlinienexpertise und klinischer Erfahrung. Sie bewerten neutral, ob eine invasive Behandlung wirklich erforderlich ist.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Welche Unterlagen brauche ich für die Zweitmeinung?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Ideal sind aktuelle Befunde, EKGs, Herzkatheterberichte, Medikamente und ggf. OP-Empfehlungen. Wir helfen Ihnen gern bei der Beschaffung und Sichtung der Unterlagen.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Muss ich den Eingriff absagen, wenn ich eine Zweitmeinung einhole?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Nein. Die Zweitmeinung dient Ihrer persönlichen Entscheidungsfindung und ist freiwillig. Sie entscheiden selbst, wie Sie mit der Empfehlung umgehen – auch gemeinsam mit Ihrer behandelnden Ärztin oder Ihrem Arzt.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-healthcare-primary mb-4">
                  Was passiert, wenn die Einschätzung von der ursprünglichen Empfehlung abweicht?
                </h3>
                <p className="text-healthcare-text-muted leading-relaxed">
                  Dann besprechen wir mit Ihnen nachvollziehbar, warum das so ist – z. B. weil die Leitlinien andere Wege zulassen oder weil Ihre individuelle Situation eine andere Therapie sinnvoller macht. Die Entscheidung liegt immer bei Ihnen.
                </p>
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
              <div className="w-16 h-16 bg-healthcare-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-8 h-8 text-healthcare-accent-green" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-healthcare-primary mb-6">
                Bereit für Ihre kardiologische Zweitmeinung?
              </h2>
              
              <p className="text-xl text-healthcare-text-muted mb-8">
                Kontaktieren Sie uns für eine unabhängige, professionelle Einschätzung Ihrer Herzgesundheit
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