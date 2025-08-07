import type { Meta, StoryObj } from '@storybook/react'
import { CoreValues, HealthcareValue } from './CoreValues'

// Comprehensive healthcare values for different scenarios
const comprehensiveHealthcareValues: HealthcareValue[] = [
  {
    id: 'patient-safety',
    name: 'Patientensicherheit',
    description: 'Höchste Sicherheitsstandards in der medizinischen Beratung und Datenverarbeitung',
    details: 'Patientensicherheit steht bei uns an erster Stelle. Wir gewährleisten die Sicherheit durch strenge Qualitätskontrollen, doppelte Fachvalidierung und sichere Datenübertragung. Jede medizinische Empfehlung wird durch mindestens zwei unabhängige Fachexperten validiert, bevor sie an den Patienten weitergegeben wird.',
    icon: 'Shield',
    color: '#dc2626',
    priority: 'high',
    metrics: [
      { label: 'Sicherheits-Score', value: '99.8%', description: 'Qualitätssicherung' },
      { label: 'Verifizierte Ärzte', value: '2.500+', description: 'Geprüfte Experten' },
      { label: 'Sichere Übertragungen', value: '750.000+', description: 'Verschlüsselte Daten' },
      { label: 'Audit-Compliance', value: '100%', description: 'Externe Prüfungen' }
    ],
    certifications: ['ISO 27001', 'DSGVO-konform', 'TÜV-zertifiziert', 'CE-Medizinprodukt', 'HIPAA-compliant'],
    examples: [
      'Ende-zu-Ende-Verschlüsselung aller medizinischen Daten nach AES-256-Standard',
      'Zweifach-Validierung aller medizinischen Empfehlungen durch unabhängige Fachärzte',
      'Regelmäßige Sicherheitsaudits durch externe Prüfer (TÜV, BSI)',
      'Anonymisierte Datenverarbeitung zum maximalen Patientenschutz',
      'Sichere Cloud-Infrastruktur in deutschen Rechenzentren'
    ]
  },
  {
    id: 'medical-excellence',
    name: 'Medizinische Exzellenz',
    description: 'Führende Fachärzte mit höchsten Qualifikationen und nachgewiesener Expertise',
    details: 'Unser Netzwerk umfasst ausschließlich Top-Mediziner mit nachgewiesener Expertise und langjähriger klinischer Erfahrung. Alle Ärzte durchlaufen ein strenges mehrstufiges Auswahlverfahren und werden kontinuierlich in ihrer fachlichen Qualifikation überprüft und weitergebildet.',
    icon: 'Award',
    color: '#7c2d12',
    priority: 'high',
    metrics: [
      { label: 'Ø Berufserfahrung', value: '18+ Jahre', description: 'Ärztliche Praxis' },
      { label: 'Publikationen', value: '15.000+', description: 'Wissenschaftliche Arbeiten' },
      { label: 'Fachrichtungen', value: '50+', description: 'Medizinische Spezialgebiete' },
      { label: 'Leitende Positionen', value: '75%', description: 'Chef-/Oberärzte' }
    ],
    certifications: ['Facharzt-Zertifizierung', 'Board Certification', 'Habilitation', 'Professur'],
    examples: [
      'Chefärzte aus führenden deutschen Universitätskliniken (Charité, LMU, etc.)',
      'Internationale Experten mit Publikationen in Nature, Lancet, NEJM',
      'Spezialisierte Zentrumsleiter für seltene Krankheiten',
      'Kontinuierliche Weiterbildung durch internationale Medical Conferences',
      'Interdisziplinäre Expertenteams für komplexe medizinische Fälle'
    ]
  },
  {
    id: 'accessibility',
    name: 'Barrierefreiheit',
    description: 'Medizinische Beratung für alle Menschen zugänglich und nutzbar machen',
    details: 'Wir sorgen dafür, dass jeder Patient unabhängig von körperlichen Einschränkungen, technischen Kenntnissen oder sozialer Situation Zugang zu hochwertiger medizinischer Beratung erhält. Unsere Plattform ist vollständig barrierefrei und unterstützt alle gängigen Hilfstechnologien.',
    icon: 'HeartHandshake',
    color: '#059669',
    priority: 'high',
    metrics: [
      { label: 'WCAG-Compliance', value: '2.1 AA', description: 'Web-Standards' },
      { label: 'Unterstützte Sprachen', value: '15+', description: 'Mehrsprachiger Support' },
      { label: 'Hilfstechnologien', value: '98%+', description: 'Kompatibilität' },
      { label: 'Mobile Optimierung', value: '100%', description: 'Responsive Design' }
    ],
    certifications: ['WCAG 2.1 AA', 'Section 508', 'EN 301 549', 'BITV 2.0'],
    examples: [
      'Screen Reader-optimierte Benutzeroberfläche mit ARIA-Labels',
      'Hochkontrast-Modus und anpassbare Schriftgrößen',
      'Vollständige Tastatur-Navigation für motorische Einschränkungen',
      'Mehrsprachige Übersetzungen und kulturelle Anpassungen',
      'Vereinfachte Bedienung für ältere Patienten'
    ]
  },
  {
    id: 'response-time',
    name: 'Schnelle Antwortzeiten',
    description: 'Zeitnahe medizinische Beratung genau dann, wenn Patienten sie benötigen',
    details: 'Zeit ist bei medizinischen Entscheidungen oft kritisch. Wir garantieren schnelle Bearbeitungszeiten durch optimierte Prozesse und dedizierte Ärzteteams, ohne dabei Kompromisse bei der Qualität der medizinischen Bewertung einzugehen.',
    icon: 'Clock',
    color: '#1278B3',
    priority: 'medium',
    metrics: [
      { label: 'Ø Antwortzeit', value: '< 16h', description: 'Standard-Bearbeitung' },
      { label: 'Express-Service', value: '< 3h', description: 'Kritische Fälle' },
      { label: 'Verfügbarkeit', value: '24/7/365', description: 'Support-Hotline' },
      { label: 'SLA-Erfüllung', value: '99.2%', description: 'Termintreue' }
    ],
    certifications: ['SLA-Garantie', 'Notfall-Bereitschaft', 'ISO 20000'],
    examples: [
      'Express-Bearbeitung für onkologische und kardiale Notfälle',
      'KI-gestützte Priorisierung nach medizinischer Dringlichkeit',
      '24/7 Support-Hotline mit direktem Arztkontakt',
      'Echtzeit-Status-Updates via SMS und E-Mail',
      'Dedizierte Notfall-Teams für lebensbedrohliche Situationen'
    ]
  },
  {
    id: 'transparency',
    name: 'Transparenz & Vertrauen',
    description: 'Offene Kommunikation und nachvollziehbare medizinische Entscheidungsprozesse',
    details: 'Vertrauen entsteht durch Transparenz. Wir informieren unsere Patienten umfassend über alle Aspekte ihrer Behandlung, Kosten und mögliche Alternativen. Jeder Schritt des medizinischen Bewertungsprozesses ist für den Patienten nachvollziehbar dokumentiert.',
    icon: 'Eye',
    color: '#0369a1',
    priority: 'medium',
    metrics: [
      { label: 'Kostenklarheit', value: '100%', description: 'Vorab transparent' },
      { label: 'Arzt-Profile', value: '100%', description: 'Vollständig einsehbar' },
      { label: 'Prozess-Dokumentation', value: '100%', description: 'Nachverfolgbar' },
      { label: 'Patientenzufriedenheit', value: '96.8%', description: 'Vertrauen' }
    ],
    certifications: ['Transparenz-Zertifikat', 'Ethik-Kodex', 'Fair-Trade-Medical'],
    examples: [
      'Vollständige Arzt-Profile mit CV, Publikationen und Spezialisierungen',
      'Transparente Kostenstruktur ohne versteckte Gebühren',
      'Offenlegung aller Behandlungsalternativen mit Vor- und Nachteilen',
      'Öffentlich einsehbare Patientenbewertungen und Erfolgsstatistiken',
      'Detaillierte Erklärung der medizinischen Bewertungskriterien'
    ]
  },
  {
    id: 'innovation',
    name: 'Innovation & Technologie',
    description: 'Modernste medizinische Technologien für präzisere Diagnosen und Behandlungen',
    details: 'Wir investieren kontinuierlich in innovative Technologien wie KI-Diagnoseunterstützung, Telemedizin und digitale Gesundheitsakten, um die bestmögliche medizinische Beratung zu bieten und gleichzeitig die Effizienz zu steigern.',
    icon: 'Zap',
    color: '#7c3aed',
    priority: 'low',
    metrics: [
      { label: 'KI-Genauigkeit', value: '94.2%', description: 'Diagnose-Support' },
      { label: 'Digital Health Tools', value: '30+', description: 'Integrierte Systeme' },
      { label: 'F&E-Investition', value: '15%', description: 'Vom Umsatz' },
      { label: 'Patent-Portfolio', value: '25+', description: 'Medtech-Innovationen' }
    ],
    certifications: ['Digital Health Certification', 'AI-Ethics Approved', 'Medical Device Regulation'],
    examples: [
      'KI-basierte Bildanalyse für radiologische Zweitmeinungen',
      'Telemedizinische Konsultationen in 4K-Qualität mit AR-Unterstützung',
      'Blockchain-basierte Patientenakten für maximale Datensicherheit',
      'Virtual Reality für immersive Patientenaufklärung',
      'Predictive Analytics für Therapieverlauf-Prognosen'
    ]
  },
  {
    id: 'cost-effectiveness',
    name: 'Kosteneffizienz',
    description: 'Hochwertige medizinische Beratung zu fairen und transparenten Preisen',
    details: 'Qualitative medizinische Beratung muss nicht teuer sein. Durch effiziente Prozesse und digitale Automatisierung können wir erstklassige medizinische Zweitmeinungen zu einem Bruchteil herkömmlicher Kosten anbieten.',
    icon: 'TrendingUp',
    color: '#059669',
    priority: 'medium',
    metrics: [
      { label: 'Kosteneinsparung', value: '65%', description: 'Vs. traditionell' },
      { label: 'Krankenkassen-Erstattung', value: '85%+', description: 'Abgedeckt' },
      { label: 'ROI für Patienten', value: '€4.200', description: 'Ø Ersparnis' },
      { label: 'Preis-Leistung', value: '9.2/10', description: 'Patientenbewertung' }
    ],
    certifications: ['Preis-Transparenz-Zertifikat', 'Value-Based Healthcare'],
    examples: [
      'Feste Paketpreise ohne versteckte Kosten',
      'Erstattungsgarantie durch alle großen Krankenkassen',
      'Kostenlose Zweitmeinungen für sozial schwächere Patienten',
      'Flexible Zahlungsmodelle und Ratenzahlung',
      'Geld-zurück-Garantie bei Unzufriedenheit'
    ]
  },
  {
    id: 'patient-empowerment',
    name: 'Patientenautonomie',
    description: 'Patienten befähigen, informierte Entscheidungen über ihre Gesundheit zu treffen',
    details: 'Wir glauben, dass gut informierte Patienten bessere Entscheidungen treffen. Unser Ansatz stärkt die Autonomie der Patienten durch umfassende Aufklärung und Einbindung in alle Entscheidungsprozesse.',
    icon: 'Users',
    color: '#dc2626',
    priority: 'high',
    metrics: [
      { label: 'Entscheidungsautonomie', value: '95%', description: 'Patienten-Feedback' },
      { label: 'Aufklärungsqualität', value: '4.8/5', description: 'Bewertung' },
      { label: 'Behandlungsalternativen', value: '3.2 Ø', description: 'Pro Fall' },
      { label: 'Shared Decision Making', value: '90%', description: 'Implementierung' }
    ],
    certifications: ['Patient-Centered Care', 'Shared Decision Making Certified'],
    examples: [
      'Verständliche Aufklärung medizinischer Sachverhalte',
      'Interaktive Entscheidungshilfen für Behandlungsoptionen',
      'Patientenportale mit Zugang zu allen medizinischen Daten',
      'Schulungsvideos und Webinare zu Gesundheitsthemen',
      'Patient Advisory Board für kontinuierliche Verbesserungen'
    ]
  }
]

// Specialized value collections
const coreValues = comprehensiveHealthcareValues.slice(0, 6)
const qualityValues = comprehensiveHealthcareValues.filter(v => 
  v.priority === 'high' || v.id.includes('excellence') || v.id.includes('safety')
)
const patientFocusedValues = comprehensiveHealthcareValues.filter(v =>
  v.id.includes('patient') || v.id.includes('accessibility') || v.id.includes('transparency')
)
const technologyValues = comprehensiveHealthcareValues.filter(v =>
  v.id.includes('innovation') || v.id.includes('response') || v.id.includes('efficiency')
)

const meta: Meta<typeof CoreValues> = {
  title: 'Healthcare/CoreValues',
  component: CoreValues,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Core Values Component - Unternehmenswerte und Qualitätsversprechen

**Healthcare-Optimierungen:**
- Medizinische Kernwerte mit messbaren Qualitätsindikatoren
- Patientensicherheit, medizinische Exzellenz und Barrierefreiheit
- Zertifizierungen und Compliance-Standards (ISO 27001, DSGVO, WCAG)
- Vertrauensaufbau durch Transparenz und nachprüfbare Metriken
- Priorisierte Werte nach medizinischer Bedeutung
- WCAG 2.1 AA konform mit Screen Reader Support

**Werte-Kategorien:**
- Patientensicherheit - Höchste Sicherheitsstandards und Datenschutz
- Medizinische Exzellenz - Führende Fachärzte und Qualifikationen  
- Barrierefreiheit - Inklusive medizinische Beratung für alle
- Schnelle Antwortzeiten - Zeitnahe Bearbeitung kritischer Fälle
- Transparenz - Offene Kommunikation und nachvollziehbare Prozesse
- Innovation - Modernste Medizintechnik und KI-Unterstützung
- Kosteneffizienz - Faire Preise und Krankenkassen-Erstattung
- Patientenautonomie - Informierte Entscheidungen und Selbstbestimmung

**Qualitäts-Features:**
- Messbare Metriken und KPIs für jeden Wert
- Externe Zertifizierungen und Audit-Ergebnisse
- Konkrete Umsetzungsbeispiele und Best Practices
- Prioritätskennzeichnung nach medizinischer Relevanz
- Detaillierte Erklärungen und Hintergrundinformationen

**Layout-Varianten:**
- Cards - Kartenbasierte Darstellung mit Metriken und Details
- Grid - Rasteransicht für strukturierte Übersicht
- List - Listenformat für detaillierte Informationen
- Featured - Hervorgehobene Hauptwerte mit kleineren Ergänzungen
- Compact - Platzsparende Darstellung für kleinere Bereiche

**Interaktive Features:**
- Aufklappbare Details für umfassende Informationen
- Zertifizierungs-Links zu externen Validierungen
- Prioritäts-Indikatoren für kritische vs. standard Werte
- Metriken-Anzeige mit Kontext und Erklärungen
- Learn-More-Links für weiterführende Informationen

**Trust-Building Elemente:**
- ISO 27001, DSGVO, TÜV-Zertifizierungen
- Messbare Qualitäts-KPIs (99.8% Sicherheit, <16h Antwortzeit)
- Transparente Arzt-Qualifikationen und Publikationen
- Externe Audits und Compliance-Nachweise
- Patientenfeedback und Zufriedenheitswerte

**Accessibility Features:**
- Keyboard Navigation durch alle Werte und Aktionen
- Screen Reader Support mit medizinischen ARIA-Labels
- Touch-optimiert für Healthcare-Tablets (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Flexible Layouts für verschiedene Bildschirmgrößen
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'cards', 'list', 'featured', 'compact'],
      description: 'Layout-Variante für Werte-Darstellung'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showMetrics: {
      control: 'boolean',
      description: 'Qualitäts-Metriken anzeigen'
    },
    showCertifications: {
      control: 'boolean',
      description: 'Zertifizierungen anzeigen'
    },
    showExamples: {
      control: 'boolean',
      description: 'Umsetzungsbeispiele anzeigen'
    },
    showDetails: {
      control: 'boolean',
      description: 'Detaillierte Beschreibungen anzeigen'
    },
    interactive: {
      control: 'boolean',
      description: 'Interaktive Elemente aktivieren'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Disclaimer'
    },
    showPriority: {
      control: 'boolean',
      description: 'Prioritäts-Indikatoren anzeigen'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'cards',
    size: 'medium',
    title: 'Unsere Healthcare-Werte',
    subtitle: 'Was uns als medizinische Plattform auszeichnet',
    description: 'Diese Grundprinzipien leiten unser Handeln und gewährleisten die bestmögliche medizinische Beratung für unsere Patienten.',
    values: coreValues,
    showMetrics: true,
    showCertifications: true,
    showExamples: false,
    showDetails: false,
    interactive: true,
    medicalContext: true,
    showPriority: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CoreValues>

// Default Story - Standard Healthcare Values
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Healthcare-Werte mit Metriken, Zertifizierungen und interaktiven Elementen.'
      }
    }
  }
}

// Cards Layout - Interactive Experience
export const CardsLayout: Story = {
  args: {
    variant: 'cards',
    values: comprehensiveHealthcareValues,
    interactive: true,
    showMetrics: true,
    showCertifications: true,
    onValueClick: (value) => {
      console.log('🏥 Healthcare value clicked:', value.name)
      
      const valueAnalytics = {
        valueId: value.id,
        valueName: value.name,
        priority: value.priority,
        hasMetrics: !!value.metrics?.length,
        hasCertifications: !!value.certifications?.length,
        interactionTime: new Date().toISOString()
      }
      
      console.log('📊 Value Analytics:', valueAnalytics)
      
      const detailedInfo = `
🏥 ${value.name}

💡 Beschreibung:
${value.description}

📋 Details:
${value.details || 'Keine weiteren Details verfügbar.'}

📊 Metriken:
${value.metrics?.map(m => `• ${m.label}: ${m.value} (${m.description})`).join('\n') || 'Keine Metriken verfügbar.'}

🏆 Zertifizierungen:
${value.certifications?.map(c => `• ${c}`).join('\n') || 'Keine Zertifizierungen aufgeführt.'}

🔧 Umsetzungsbeispiele:
${value.examples?.map(e => `• ${e}`).join('\n') || 'Keine Beispiele verfügbar.'}

⚡ Priorität: ${value.priority?.toUpperCase() || 'STANDARD'}
      `.trim()
      
      alert(detailedInfo)
    },
    onCertificationClick: (certification) => {
      console.log('🏆 Certification clicked:', certification)
      
      const certificationInfo = {
        'ISO 27001': 'Internationaler Standard für Informationssicherheits-Management',
        'DSGVO-konform': 'Compliance mit der Datenschutz-Grundverordnung',
        'TÜV-zertifiziert': 'Geprüft durch den Technischen Überwachungsverein',
        'WCAG 2.1 AA': 'Web Content Accessibility Guidelines Level AA',
        'CE-Medizinprodukt': 'Conformité Européenne für Medizinprodukte'
      }[certification] || 'Detaillierte Informationen zu dieser Zertifizierung'
      
      alert(`🏆 ${certification}\n\n${certificationInfo}\n\nMöchten Sie mehr über diese Zertifizierung erfahren?`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Karten-Ansicht mit allen verfügbaren Healthcare-Werten und Aktionen.'
      }
    }
  }
}

// Grid Layout - Structured Overview
export const GridLayout: Story = {
  args: {
    variant: 'grid',
    size: 'large',
    values: comprehensiveHealthcareValues,
    showMetrics: true,
    showCertifications: false,
    showDetails: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Strukturierte Grid-Ansicht mit detaillierten Beschreibungen für alle Werte.'
      }
    }
  }
}

// List Layout - Detailed Information
export const ListLayout: Story = {
  args: {
    variant: 'list',
    values: qualityValues,
    showMetrics: true,
    showExamples: true,
    showDetails: true,
    interactive: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Layout mit ausführlichen Details und Umsetzungsbeispielen für Qualitätswerte.'
      }
    }
  }
}

// Featured Layout - Priority Values
export const FeaturedLayout: Story = {
  args: {
    variant: 'featured',
    title: 'Unsere Qualitätsversprechen',
    subtitle: 'Messbare Exzellenz in der Medizin',
    values: [
      comprehensiveHealthcareValues[0], // Patient Safety as main
      ...comprehensiveHealthcareValues.slice(1, 5) // Supporting values
    ],
    showPriority: true,
    showMetrics: true,
    interactive: true,
    onLearnMore: (value) => {
      console.log('📚 Learn more clicked for:', value.name)
      
      const learnMoreContent = `
📚 ${value.name} - Vertiefende Informationen

🎯 Warum ist das wichtig?
${value.details}

📈 Messbare Ergebnisse:
${value.metrics?.map(m => `${m.label}: ${m.value}`).join(', ') || 'Metriken werden kontinuierlich erfasst'}

🔬 Wissenschaftlicher Hintergrund:
Unsere Ansätze basieren auf aktuellen medizinischen Studien und Best Practices aus führenden internationalen Gesundheitssystemen.

🌟 Patientennutzen:
Höhere Behandlungsqualität, bessere Outcomes und erhöhte Patientenzufriedenheit.

📞 Weitere Informationen:
Kontaktieren Sie unser Expert-Team für detaillierte Erläuterungen.
      `.trim()
      
      alert(learnMoreContent)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Featured-Layout mit Hauptwert und unterstützenden Elementen für maximale Aufmerksamkeit.'
      }
    }
  }
}

// Compact Layout - Space-Efficient
export const CompactLayout: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    values: patientFocusedValues,
    showMetrics: false,
    showCertifications: true,
    showDetails: false,
    interactive: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für platzsparende Integration mit Fokus auf patientenorientierte Werte.'
      }
    }
  }
}

// Patient Safety Focus - Critical Values
export const PatientSafetyFocus: Story = {
  args: {
    title: 'Patientensicherheit steht an erster Stelle',
    subtitle: 'Höchste Sicherheitsstandards für Ihre Gesundheit',
    description: 'Erfahren Sie, wie wir durch strenge Qualitätskontrollen und Zertifizierungen Ihre Sicherheit gewährleisten.',
    values: [
      comprehensiveHealthcareValues.find(v => v.id === 'patient-safety'),
      comprehensiveHealthcareValues.find(v => v.id === 'medical-excellence'),
      comprehensiveHealthcareValues.find(v => v.id === 'transparency')
    ].filter(Boolean) as HealthcareValue[],
    showMetrics: true,
    showCertifications: true,
    showExamples: true,
    interactive: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokussierte Darstellung der sicherheitskritischen Werte mit umfassenden Details.'
      }
    }
  }
}

// Technology Innovation - Modern Healthcare
export const TechnologyInnovation: Story = {
  args: {
    title: 'Innovation für bessere Medizin',
    subtitle: 'Modernste Technologie im Dienste Ihrer Gesundheit',
    description: 'Entdecken Sie, wie innovative Technologien unsere medizinischen Dienstleistungen verbessern.',
    values: technologyValues,
    variant: 'grid',
    showMetrics: true,
    showExamples: true,
    onLearnMore: (value) => {
      console.log('🚀 Technology innovation learn more:', value.name)
      
      const techDetails = `
🚀 ${value.name} - Technologische Innovation

💡 Innovative Ansätze:
${value.examples?.slice(0, 3).join('\n• ') || 'Kontinuierliche Weiterentwicklung unserer Technologien'}

🔬 Forschung & Entwicklung:
Wir arbeiten mit führenden Universitäten und Tech-Unternehmen zusammen, um die neuesten medizinischen Technologien zu entwickeln.

📊 Erfolgsmessung:
${value.metrics?.map(m => `${m.label}: ${m.value} - ${m.description}`).join('\n') || 'Kontinuierliche Überwachung der Technologie-Performance'}

🏆 Anerkennungen:
${value.certifications?.join(', ') || 'Verschiedene Technologie- und Innovation-Awards'}

🔮 Zukunft:
Unsere Roadmap umfasst weitere bahnbrechende Technologien wie Quantum Computing für medizinische Berechnungen.
      `.trim()
      
      alert(techDetails)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Technologie-fokussierte Werte mit Innovationen und zukunftsweisenden Entwicklungen.'
      }
    }
  }
}

// Quality Metrics Focus - Data-Driven Trust
export const QualityMetricsFocus: Story = {
  args: {
    title: 'Messbare Qualität, nachweisbare Erfolge',
    subtitle: 'Datenbasierte Qualitätssicherung',
    description: 'Unsere Qualitätsversprechen sind nicht nur Worte - sie sind messbar und extern validiert.',
    values: qualityValues,
    variant: 'cards',
    showMetrics: true,
    showCertifications: true,
    showDetails: false,
    interactive: true,
    onValueClick: (value) => {
      console.log('📊 Quality metrics focus:', value.name)
      
      const qualityData = `
📊 Qualitäts-Dashboard: ${value.name}

🎯 Zentrale KPIs:
${value.metrics?.map(m => `▶ ${m.label}: ${m.value}`).join('\n') || 'Metriken werden kontinuierlich erfasst'}

📈 Trend-Entwicklung:
Alle unsere Qualitätsindikatoren zeigen kontinuierliche Verbesserungen:
• Patientenzufriedenheit: +2.3% (letzte 6 Monate)
• Antwortzeiten: -15% (kontinuierliche Optimierung)
• Ärztliche Expertise: +8% (neue Fachärzte im Netzwerk)

🏆 Externe Validierung:
${value.certifications?.map(c => `✓ ${c}`).join('\n') || 'Regelmäßige externe Audits und Zertifizierungen'}

📋 Qualitätssicherung:
Unabhängige Qualitäts-Audits alle 6 Monate durch TÜV und externe Prüfgesellschaften.
      `.trim()
      
      alert(qualityData)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokus auf messbare Qualitätsindikatoren und datenbasierte Vertrauensbildung.'
      }
    }
  }
}

// Patient Empowerment - Accessibility Focus
export const PatientEmpowerment: Story = {
  args: {
    title: 'Medizin für alle zugänglich machen',
    subtitle: 'Barrierefreie Gesundheitsversorgung',
    description: 'Wir sorgen dafür, dass jeder Patient unabhängig von Einschränkungen oder Hintergrund Zugang zu erstklassiger medizinischer Beratung hat.',
    values: patientFocusedValues,
    variant: 'list',
    showExamples: true,
    showDetails: true,
    interactive: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Patientenorientierte Werte mit Fokus auf Barrierefreiheit und Inklusion.'
      }
    }
  }
}

// Mobile Optimized - Touch Interface
export const MobileOptimized: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    values: coreValues.slice(0, 4),
    showMetrics: false,
    showCertifications: true,
    showDetails: false,
    interactive: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung mit Touch-freundlichen Elementen und reduzierten Details.'
      }
    }
  }
}

// Loading State - Data Fetching
export const LoadingState: Story = {
  args: {
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Initialisierung der Healthcare-Werte mit Skeleton-Elementen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    variant: 'cards',
    size: 'medium',
    title: 'Vollständige Healthcare-Werte Experience',
    subtitle: 'Alle Interaktionen und Features',
    description: 'Erleben Sie alle verfügbaren Features und Interaktionen der Core Values Komponente.',
    values: comprehensiveHealthcareValues,
    showMetrics: true,
    showCertifications: true,
    showExamples: false,
    showDetails: false,
    interactive: true,
    medicalContext: true,
    showPriority: true,
    onValueClick: (value) => {
      console.log(`🏥 Healthcare value interaction: ${value.name} (${value.id})`)
      
      const valueAnalytics = {
        valueId: value.id,
        valueName: value.name,
        priority: value.priority,
        color: value.color,
        metricsCount: value.metrics?.length || 0,
        certificationsCount: value.certifications?.length || 0,
        examplesCount: value.examples?.length || 0,
        hasDetails: !!value.details,
        interactionTime: new Date().toISOString(),
        userAction: 'value_click'
      }
      
      console.log('📊 Value Interaction Analytics:', valueAnalytics)
      
      const priorityEmoji = {
        'high': '🔴',
        'medium': '🟡',
        'low': '🟢'
      }[value.priority || 'medium']
      
      const detailedView = `
🏥 ${value.name} ${priorityEmoji}

💡 Kurzbeschreibung:
${value.description}

📋 Detaillierte Erklärung:
${value.details || 'Weitere Details sind in unserem Qualitätshandbuch verfügbar.'}

📊 Qualitäts-KPIs (${value.metrics?.length || 0} Metriken):
${value.metrics?.map(m => `▶ ${m.label}: ${m.value}\n   └ ${m.description}`).join('\n\n') || 'Keine spezifischen Metriken verfügbar.'}

🏆 Zertifizierungen & Standards (${value.certifications?.length || 0}):
${value.certifications?.map(c => `✓ ${c}`).join('\n') || 'Weitere Zertifizierungen in Vorbereitung.'}

🔧 Konkrete Umsetzung (${value.examples?.length || 0} Beispiele):
${value.examples?.map(e => `• ${e}`).join('\n') || 'Praktische Beispiele sind in der Detailansicht verfügbar.'}

⚡ Prioritätsstufe: ${value.priority?.toUpperCase() || 'STANDARD'}
🎨 Theme-Color: ${value.color || '#1278B3'}

📞 Weitere Informationen erhalten Sie in einem persönlichen Beratungsgespräch.
      `.trim()
      
      alert(detailedView)
    },
    onCertificationClick: (certification) => {
      console.log('🏆 Certification details requested:', certification)
      
      const certificationAnalytics = {
        certification,
        clickTime: new Date().toISOString(),
        source: 'core_values_component'
      }
      
      console.log('📊 Certification Analytics:', certificationAnalytics)
      
      const certificationDatabase = {
        'ISO 27001': {
          fullName: 'ISO/IEC 27001 - Information Security Management',
          issuer: 'International Organization for Standardization',
          validity: '2024-2027',
          scope: 'Informationssicherheits-Managementsystem',
          details: 'Internationale Norm für Informationssicherheit, die systematische Ansätze zur Verwaltung sensibler Unternehmensinformationen definiert.'
        },
        'DSGVO-konform': {
          fullName: 'Datenschutz-Grundverordnung (EU-DSGVO)',
          issuer: 'Europäische Union',
          validity: 'Permanent compliance',
          scope: 'Datenschutz und Privatsphäre',
          details: 'Einhaltung aller Bestimmungen der EU-Datenschutz-Grundverordnung für den Schutz personenbezogener Daten.'
        },
        'TÜV-zertifiziert': {
          fullName: 'TÜV Süd Certification',
          issuer: 'TÜV Süd',
          validity: '2024-2025',
          scope: 'Medizinische Qualitätssicherung',
          details: 'Unabhängige Prüfung und Zertifizierung der medizinischen Qualitätsprozesse durch den TÜV.'
        },
        'WCAG 2.1 AA': {
          fullName: 'Web Content Accessibility Guidelines Level AA',
          issuer: 'W3C - World Wide Web Consortium',
          validity: 'Ongoing compliance',
          scope: 'Web-Barrierefreiheit',
          details: 'Internationale Standards für barrierefreie Webinhalte, Level AA Konformität.'
        }
      }
      
      const certInfo = certificationDatabase[certification as keyof typeof certificationDatabase] || {
        fullName: certification,
        issuer: 'Zertifizierungsstelle',
        validity: 'Gültig',
        scope: 'Qualitätssicherung',
        details: 'Detaillierte Informationen zu dieser Zertifizierung sind verfügbar.'
      }
      
      const certificationModal = `
🏆 ${certInfo.fullName}

🏢 Ausstellende Organisation:
${certInfo.issuer}

📅 Gültigkeit:
${certInfo.validity}

🎯 Anwendungsbereich:
${certInfo.scope}

📋 Beschreibung:
${certInfo.details}

🔍 Verifikation:
Diese Zertifizierung kann jederzeit bei der ausstellenden Organisation überprüft werden.

📞 Bei Fragen zu unseren Zertifizierungen kontaktieren Sie unser Qualitäts-Team.
      `.trim()
      
      alert(certificationModal)
    },
    onLearnMore: (value) => {
      console.log('📚 Learn more requested for:', value.name, value.id)
      
      const learnMoreAnalytics = {
        valueId: value.id,
        valueName: value.name,
        priority: value.priority,
        requestTime: new Date().toISOString(),
        source: 'learn_more_button'
      }
      
      console.log('📊 Learn More Analytics:', learnMoreAnalytics)
      
      const learningResources = `
📚 Vertiefende Informationen: ${value.name}

🎓 Lernressourcen verfügbar:

📖 Dokumentation:
• Detaillierte Whitepapers zu unseren Qualitätsstandards
• Wissenschaftliche Studien und Forschungsergebnisse
• Best Practice Guides aus der Implementierung

🎥 Video-Content:
• Erklärvideos zu unseren Qualitätsprozessen  
• Webinar-Aufzeichnungen mit unseren Experten
• Patientenstimmen und Erfahrungsberichte

📊 Daten & Berichte:
• Quartalsberichte zu Qualitätsindikatoren
• Benchmarking mit Industriestandards
• Trend-Analysen und Forecasting

🎯 Interaktive Inhalte:
• Online-Kurse zu Gesundheitsthemen
• Q&A-Sessions mit medizinischen Experten
• Community-Forum für Erfahrungsaustausch

📞 Persönliche Beratung:
Vereinbaren Sie einen Termin mit unserem Expert-Team für individuelle Fragen.

🌐 Online-Ressourcen:
Besuchen Sie unser Wissenszentrum auf der Website für aktuelle Informationen.
      `.trim()
      
      alert(learningResources)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive Core Values Sektion mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}