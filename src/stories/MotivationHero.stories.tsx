import type { Meta, StoryObj } from '@storybook/react'
import { MotivationHero, HealthcareStatistic, PatientTestimonial, EmergencyContact } from './MotivationHero'

// Extended healthcare statistics for different scenarios
const comprehensiveStatistics: HealthcareStatistic[] = [
  {
    id: 'patients-helped',
    value: '75.000+',
    label: 'Behandelte Patienten',
    description: 'Erfolgreiche medizinische Zweitmeinungsberatungen',
    trend: 'up',
    trendValue: '+15%'
  },
  {
    id: 'specialist-network',
    value: '2.500+',
    label: 'Fachärzte',
    description: 'Zertifizierte Spezialisten in allen Fachrichtungen',
    trend: 'up',
    trendValue: '+12%'
  },
  {
    id: 'response-time',
    value: '< 18h',
    label: 'Antwortzeit',
    description: 'Durchschnittliche Bearbeitungszeit für Zweitmeinungen',
    trend: 'up',
    trendValue: '-6h'
  },
  {
    id: 'satisfaction',
    value: '98.7%',
    label: 'Patientenzufriedenheit',
    description: 'Bewertung der medizinischen Beratungsqualität',
    trend: 'up',
    trendValue: '+1.2%'
  },
  {
    id: 'cost-savings',
    value: '€2.8M',
    label: 'Kosteneinsparungen',
    description: 'Vermiedene unnötige Behandlungen pro Jahr',
    trend: 'up',
    trendValue: '+18%'
  },
  {
    id: 'specialties',
    value: '45+',
    label: 'Fachrichtungen',
    description: 'Medizinische Spezialisierungen verfügbar',
    trend: 'stable'
  }
]

// Diverse patient testimonials
const patientTestimonials: PatientTestimonial[] = [
  {
    id: 'testimonial-cardiac',
    patientName: 'Maria S.',
    condition: 'Kardiologie - Bypassoperation',
    testimonial: 'Die Zweitmeinung bestätigte, dass eine weniger invasive Behandlung möglich war. Dadurch konnte ich eine große Operation vermeiden und bin heute vollkommen gesund.',
    ageRange: '55-65',
    outcome: 'positive',
    rating: 5,
    date: new Date('2024-07-15')
  },
  {
    id: 'testimonial-oncology',
    patientName: 'Dr. Thomas M.',
    condition: 'Onkologie - Prostatakrebs',
    testimonial: 'Als Arzt wollte ich eine unabhängige Meinung zu meiner eigenen Diagnose. Die Experten von zweitmeinung.ng gaben mir die Sicherheit für die richtige Therapieentscheidung.',
    ageRange: '60-70',
    outcome: 'improved',
    rating: 5,
    date: new Date('2024-07-10'),
    videoUrl: '/testimonials/thomas-m-video.mp4'
  },
  {
    id: 'testimonial-orthopedics',
    patientName: 'Anna K.',
    condition: 'Orthopädie - Knieprothese',
    testimonial: 'Ich war unsicher, ob eine Knie-OP wirklich notwendig ist. Die zweite Meinung zeigte alternative Behandlungen auf, die sehr erfolgreich waren.',
    ageRange: '45-55',
    outcome: 'positive',
    rating: 5,
    date: new Date('2024-07-20')
  },
  {
    id: 'testimonial-rare-disease',
    patientName: 'Familie Weber',
    condition: 'Seltene Krankheit - Kindergenetik',
    testimonial: 'Unser Kind litt an einer seltenen genetischen Erkrankung. Die Spezialisten halfen uns, die beste Therapie zu finden und gaben uns neue Hoffnung.',
    ageRange: '0-10',
    outcome: 'ongoing',
    rating: 5,
    date: new Date('2024-06-30')
  },
  {
    id: 'testimonial-emergency',
    patientName: 'Robert H.',
    condition: 'Neurologie - Schlaganfall',
    testimonial: 'Nach meinem Schlaganfall war ich unsicher über die vorgeschlagene Rehabilitation. Die Zweitmeinung half mir, den optimalen Therapieplan zu finden.',
    ageRange: '70+',
    outcome: 'improved',
    rating: 5,
    date: new Date('2024-07-05')
  }
]

// Extended emergency contacts
const emergencyContacts: EmergencyContact[] = [
  {
    id: 'emergency-112',
    name: 'Notruf',
    phone: '112',
    type: 'emergency',
    availability: '24/7'
  },
  {
    id: 'medical-116117',
    name: 'Ärztlicher Bereitschaftsdienst',
    phone: '116117',
    type: 'medical',
    availability: '24/7'
  },
  {
    id: 'support-hotline',
    name: 'zweitmeinung.ng Notfall-Support',
    phone: '+49 800 80 44 100',
    type: 'support',
    availability: 'business_hours'
  }
]

const meta: Meta<typeof MotivationHero> = {
  title: 'Healthcare/MotivationHero',
  component: MotivationHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Healthcare Motivation Hero Component - Inspirierende Landingpage für medizinische Plattformen

**Healthcare-Optimierungen:**
- Medizinische Zweitmeinungs-fokussierte Inhalte und CTAs
- Patientenbewertungen und Erfolgsstatistiken
- Notfallkontakte prominent sichtbar (112, 116117)
- Vertrauensindikatoren (DSGVO, Zertifizierungen, Kassenerstattung)
- Emotionale Patiententestimonials mit medizinischen Outcomes
- WCAG 2.1 AA konform mit Screen Reader Support

**Layout-Varianten:**
- Standard - Klassisches Hero-Layout mit Text links, Medien rechts
- Centered - Zentralisierte Darstellung für maximale Wirkung
- Split - Geteiltes Layout für Video-Content
- Video - Vollständige Video-Integration mit Playback-Kontrollen
- Emergency - Notfall-Modus mit hervorgehobenen Kontakten

**Medizinische Inhalte:**
- Patientenstatistiken (Behandelte Patienten, Fachärzte, Zufriedenheit)
- Authentische Patientenbewertungen mit medizinischen Kontexten
- Spezialisierungen und Fachrichtungen
- Kosteneinsparungen durch Zweitmeinungen
- Notfallkontakte und Support-Hotlines

**Anwendungsfälle:**
- Landingpage für medizinische Zweitmeinungsplattformen
- Homepage-Hero für Healthcare-Startups
- Vertrauensaufbau durch Patientenerfahrungen
- Notfall-Informationsseiten mit Kontakten
- Marketing-Seiten für medizinische Dienstleistungen

**Interaktive Features:**
- Video-Testimonials mit Playback-Kontrollen
- Statistik-Animationen mit Trend-Indikatoren
- Patientenbewertungen-Karussell
- Notfallkontakte mit direkter Anruf-Funktion
- Audio-Steuerung für Barrierefreiheit

**Trust-Building Elemente:**
- Medizinische Zertifizierungen und Akkreditierungen
- DSGVO-Compliance-Badges
- Kassenerstattungs-Hinweise
- Fachärzte-Credentials und Qualifikationen
- Patientendatenschutz-Versicherungen

**Accessibility Features:**
- Keyboard Navigation zu allen interaktiven Elementen
- Screen Reader Support mit medizinischen ARIA-Labels
- Touch-optimiert für Healthcare-Tablets (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Audio-Steuerung für Hörgeschädigte
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'centered', 'split', 'video', 'emergency'],
      description: 'Layout-Variante für verschiedene Anwendungsfälle'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showVideoControls: {
      control: 'boolean',
      description: 'Video-Steuerung anzeigen'
    },
    showEmergencyBanner: {
      control: 'boolean',
      description: 'Notfall-Banner anzeigen'
    },
    showTrustIndicators: {
      control: 'boolean',
      description: 'Vertrauensindikatoren anzeigen'
    },
    showTestimonials: {
      control: 'boolean',
      description: 'Patientenbewertungen anzeigen'
    },
    showStatistics: {
      control: 'boolean',
      description: 'Statistiken anzeigen'
    },
    autoPlayVideo: {
      control: 'boolean',
      description: 'Video automatisch abspielen'
    },
    enableAudio: {
      control: 'boolean',
      description: 'Audio aktivieren'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Disclaimer'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus (kritische Darstellung)'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'standard',
    size: 'medium',
    title: 'Medizinische Zweitmeinung online',
    subtitle: 'Sicherheit durch Expertise',
    description: 'Erhalten Sie eine professionelle zweite Meinung von führenden Fachärzten. Schnell, diskret und von Ihrer Krankenkasse erstattet.',
    primaryCTA: 'Jetzt Zweitmeinung anfordern',
    secondaryCTA: 'Mehr erfahren',
    statistics: comprehensiveStatistics.slice(0, 4),
    testimonials: patientTestimonials.slice(0, 3),
    emergencyContacts,
    showVideoControls: true,
    showEmergencyBanner: true,
    showTrustIndicators: true,
    showTestimonials: true,
    showStatistics: true,
    autoPlayVideo: false,
    enableAudio: false,
    medicalContext: true,
    emergencyMode: false,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MotivationHero>

// Default Story - Standard Medical Hero
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Hero-Layout für medizinische Zweitmeinungsplattformen mit allen wichtigen Vertrauenselementen.'
      }
    }
  }
}

// Centered Layout - Maximum Impact
export const CenteredLayout: Story = {
  args: {
    variant: 'centered',
    size: 'large',
    title: 'Ihre Gesundheit verdient eine zweite Meinung',
    subtitle: 'Vertrauen durch Expertenwissen',
    description: 'Mehr als 75.000 Patienten vertrauen bereits auf unsere medizinischen Experten. Erhalten Sie binnen 24 Stunden eine fundierte Zweitmeinung.',
    onPrimaryCTA: () => {
      console.log('🏥 Primary CTA clicked - Request second opinion')
      alert('Zweitmeinung anfordern\n\n✅ Kostenlos und unverbindlich\n📋 Einfacher Upload Ihrer Unterlagen\n⏱️ Antwort binnen 24 Stunden\n🏥 2.500+ Fachärzte verfügbar')
    },
    onSecondaryCTA: () => {
      console.log('ℹ️ Secondary CTA clicked - Learn more')
      alert('Mehr über zweitmeinung.ng erfahren\n\n🔍 Wie funktioniert eine medizinische Zweitmeinung?\n💰 Kostenerstattung durch Krankenkassen\n🎓 Unsere Fachärzte und Qualifikationen\n📊 Erfolgsstatistiken und Patientenbewertungen')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Zentriertes Hero-Layout für maximale visuelle Wirkung und Fokus auf die Hauptbotschaft.'
      }
    }
  }
}

// Video Hero - Rich Media Experience
export const VideoHero: Story = {
  args: {
    variant: 'video',
    backgroundVideo: '/hero-videos/medical-consultation.mp4',
    title: 'Erleben Sie medizinische Exzellenz',
    subtitle: 'Ihre Gesundheit, unsere Expertise',
    description: 'Sehen Sie, wie unsere Fachärzte Ihnen zu besseren Behandlungsentscheidungen verhelfen.',
    showVideoControls: true,
    autoPlayVideo: false,
    enableAudio: false,
    onVideoPlay: () => {
      console.log('▶️ Hero video started playing')
      alert('Video gestartet\n\nErleben Sie echte Patientengeschichten und medizinische Expertisen.')
    },
    onVideoPause: () => {
      console.log('⏸️ Hero video paused')
    },
    onAudioToggle: (enabled) => {
      console.log(`🔊 Hero video audio ${enabled ? 'enabled' : 'disabled'}`)
      alert(`Audio ${enabled ? 'aktiviert' : 'deaktiviert'}\n\nHören Sie Originalstimmen von Ärzten und Patienten.`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Video-basierte Hero-Sektion mit medizinischen Inhalten und Playback-Kontrollen.'
      }
    }
  }
}

// Emergency Mode - Critical Situations
export const EmergencyMode: Story = {
  args: {
    variant: 'emergency',
    emergencyMode: true,
    title: '🚨 Medizinischer Notfall?',
    subtitle: 'Sofortige Hilfe verfügbar',
    description: 'Bei lebensbedrohlichen Situationen zählt jede Sekunde. Nutzen Sie unsere Notfallkontakte oder fordern Sie eine Eilberatung an.',
    primaryCTA: 'Notfall-Beratung anfordern',
    secondaryCTA: 'Notfallkontakte anzeigen',
    showEmergencyBanner: true,
    showTrustIndicators: true,
    showTestimonials: false,
    showStatistics: false,
    onPrimaryCTA: () => {
      console.log('🚨 Emergency consultation requested')
      alert('🚨 Notfall-Beratung\n\n⚡ Express-Bearbeitung in <2 Stunden\n📞 Direkter Kontakt zu Notfall-Spezialisten\n🏥 Weiterleitung an nächste Klinik möglich\n💰 Kostenübernahme in Notfällen')
    },
    onEmergencyCall: (contact) => {
      console.log('🚨 Emergency call initiated:', contact.name, contact.phone)
      alert(`🚨 NOTFALL-ANRUF\n\n${contact.name}\n📞 ${contact.phone}\n\nDer Anruf wird sofort weitergeleitet...`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus mit hervorgehobenen Notfallkontakten und kritischen Handlungsaufforderungen.'
      }
    }
  }
}

// Split Layout - Balanced Content
export const SplitLayout: Story = {
  args: {
    variant: 'split',
    backgroundImage: '/hero-images/medical-team.jpg',
    statistics: comprehensiveStatistics,
    testimonials: patientTestimonials,
    onTestimonialClick: (testimonial) => {
      console.log('👤 Patient testimonial clicked:', testimonial.patientName, testimonial.condition)
      
      const outcomeEmoji = {
        'positive': '✅',
        'improved': '📈', 
        'ongoing': '⏳'
      }[testimonial.outcome || 'positive']
      
      const stars = '⭐'.repeat(testimonial.rating || 5)
      
      alert(`${outcomeEmoji} Patientenerfahrung\n\n👤 ${testimonial.patientName}\n🏥 ${testimonial.condition}\n${stars} ${testimonial.rating}/5 Sterne\n\n"${testimonial.testimonial}"\n\n📅 ${testimonial.date?.toLocaleDateString('de-DE')}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Geteiltes Layout mit ausgewogener Darstellung von Text-Content und visuellen Elementen.'
      }
    }
  }
}

// Patient Testimonials Focus
export const PatientTestimonialsFocus: Story = {
  args: {
    title: 'Unsere Patienten vertrauen uns',
    subtitle: 'Echte Erfahrungen, echte Erfolge',
    description: 'Lesen Sie, wie wir bereits tausenden Patienten zu besseren Behandlungsentscheidungen verholfen haben.',
    showTestimonials: true,
    showStatistics: true,
    testimonials: patientTestimonials,
    statistics: comprehensiveStatistics.slice(0, 3),
    onTestimonialClick: (testimonial) => {
      console.log('📋 Detailed testimonial view requested:', testimonial.id)
      
      const detailsModal = `
📋 Ausführliche Patientenerfahrung

👤 Patient: ${testimonial.patientName}
🏥 Medizinischer Bereich: ${testimonial.condition}
👥 Altersgruppe: ${testimonial.ageRange}
📈 Behandlungsergebnis: ${testimonial.outcome}
⭐ Bewertung: ${testimonial.rating}/5 Sterne
📅 Datum: ${testimonial.date?.toLocaleDateString('de-DE')}

💬 Erfahrungsbericht:
"${testimonial.testimonial}"

${testimonial.videoUrl ? '🎥 Video-Testimonial verfügbar' : ''}
${testimonial.audioUrl ? '🔊 Audio-Testimonial verfügbar' : ''}
      `.trim()
      
      alert(detailsModal)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokus auf Patientenbewertungen und Erfolgsgeschichten zur Vertrauensbildung.'
      }
    }
  }
}

// Statistics Showcase - Data-Driven Trust
export const StatisticsShowcase: Story = {
  args: {
    title: 'Medizinische Exzellenz in Zahlen',
    subtitle: 'Messbare Qualität, nachweisbare Erfolge',
    description: 'Unsere Leistungsdaten sprechen für sich. Sehen Sie, warum Patienten und Ärzte uns vertrauen.',
    showStatistics: true,
    showTestimonials: false,
    statistics: comprehensiveStatistics,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Datengetriebene Darstellung mit umfassenden Statistiken zur Vertrauensbildung.'
      }
    }
  }
}

// Mobile Optimized - Touch Interface
export const MobileOptimized: Story = {
  args: {
    size: 'small',
    variant: 'centered',
    title: 'Zweitmeinung mobil',
    subtitle: 'Überall verfügbar',
    description: 'Ihre medizinische Zweitmeinung - jederzeit und überall auf Ihrem Smartphone verfügbar.',
    statistics: comprehensiveStatistics.slice(0, 2),
    testimonials: patientTestimonials.slice(0, 2),
    showEmergencyBanner: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung mit Touch-freundlichen Elementen und reduzierten Inhalten.'
      }
    }
  }
}

// Accessibility Demo - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Medizinische Zweitmeinung Hero-Bereich für zweitmeinung.ng mit Patientenbewertungen und Notfallkontakten',
    title: 'Barrierefreie medizinische Beratung',
    subtitle: 'Zugänglich für alle Patienten',
    description: 'Unsere Plattform ist vollständig barrierefrei und für Screen Reader optimiert.',
    showTrustIndicators: true,
    medicalContext: true,
    emergencyContacts: [
      {
        ...emergencyContacts[0],
        name: 'Notruf 112 - Feuerwehr und Rettungsdienst'
      },
      {
        ...emergencyContacts[1], 
        name: 'Ärztlicher Bereitschaftsdienst 116117'
      }
    ],
    testimonials: [
      {
        ...patientTestimonials[0],
        testimonial: 'Die barrierefreie Plattform ermöglichte es mir, trotz meiner Sehbehinderung einfach eine medizinische Zweitmeinung zu erhalten.'
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreie Hero-Sektion mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Optimierung.'
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
        story: 'Ladezustand während der Initialisierung mit Skeleton-Elementen für alle Inhalte.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    variant: 'standard',
    size: 'large',
    title: 'Vollständige Hero-Experience',
    subtitle: 'Alle Features in Aktion',
    statistics: comprehensiveStatistics,
    testimonials: patientTestimonials,
    emergencyContacts,
    showVideoControls: true,
    showEmergencyBanner: true,
    showTrustIndicators: true,
    showTestimonials: true,
    showStatistics: true,
    backgroundVideo: '/hero-videos/medical-platform.mp4',
    medicalContext: true,
    onPrimaryCTA: () => {
      console.log('✅ Primary CTA: Request Medical Second Opinion')
      
      const ctaAnalytics = {
        action: 'primary_cta_clicked',
        component: 'motivation_hero',
        timestamp: new Date().toISOString(),
        userJourney: 'hero_conversion'
      }
      
      console.log('📊 CTA Analytics:', ctaAnalytics)
      
      alert(`🏥 Medizinische Zweitmeinung anfordern

✅ Schritt 1: Unterlagen hochladen
📋 Schritt 2: Fachrichtung wählen
👨‍⚕️ Schritt 3: Expertenauswahl
⏱️ Schritt 4: Antwort binnen 24h

💰 Kostenerstattung durch Krankenkassen
🔒 DSGVO-konforme Datenverarbeitung
🏆 2.500+ zertifizierte Fachärzte

Möchten Sie jetzt beginnen?`)
    },
    onSecondaryCTA: () => {
      console.log('ℹ️ Secondary CTA: Learn More')
      
      const learnMoreData = {
        platform_benefits: [
          'Kostenerstattung durch Krankenkassen',
          'DSGVO-konforme Datenverarbeitung',
          'Zertifizierte Fachärzte',
          '24h Antwortzeit garantiert'
        ],
        specialties: [
          'Kardiologie', 'Onkologie', 'Orthopädie', 
          'Neurologie', 'Radiologie', 'Pathologie'
        ],
        success_metrics: {
          satisfaction_rate: '98.7%',
          cost_savings: '€2.8M',
          response_time: '<18h'
        }
      }
      
      console.log('📊 Platform Information:', learnMoreData)
      
      alert(`ℹ️ Über zweitmeinung.ng

🏥 Führende Plattform für medizinische Zweitmeinungen
📊 75.000+ erfolgreich behandelte Patienten
🎓 2.500+ zertifizierte Fachärzte
⭐ 98.7% Patientenzufriedenheit

💡 Vorteile:
• Kostenerstattung durch Krankenkassen
• Sichere DSGVO-konforme Plattform  
• Schnelle Antwortzeiten (<18h)
• Alle medizinischen Fachrichtungen

🔍 Entdecken Sie unsere Erfolgsgeschichten!`)
    },
    onVideoPlay: () => {
      console.log('▶️ Background video started')
      console.log('🎥 Video engagement tracking started')
    },
    onVideoPause: () => {
      console.log('⏸️ Background video paused')
      console.log('📊 Video engagement data saved')
    },
    onAudioToggle: (enabled) => {
      console.log(`🔊 Audio ${enabled ? 'enabled' : 'disabled'}`)
      
      if (enabled) {
        alert('🔊 Audio aktiviert\n\nSie hören jetzt:\n• Originalstimmen von Patienten\n• Fachmeinungen von Ärzten\n• Erklärungen zum Behandlungsablauf')
      } else {
        alert('🔇 Audio deaktiviert\n\nVideo läuft weiter ohne Ton.')
      }
    },
    onEmergencyCall: (contact) => {
      console.log(`🚨 Emergency call initiated: ${contact.name} (${contact.phone})`)
      
      const emergencyCallData = {
        contactId: contact.id,
        contactName: contact.name,
        phone: contact.phone,
        type: contact.type,
        timestamp: new Date().toISOString(),
        source: 'motivation_hero_emergency_banner'
      }
      
      console.log('📊 Emergency Call Analytics:', emergencyCallData)
      
      switch (contact.type) {
        case 'emergency':
          alert(`🚨 NOTRUF ${contact.phone}

⚡ Lebensbedrohlicher Notfall
🚑 Feuerwehr & Rettungsdienst
📍 Automatische Standortermittlung
🏥 Weiterleitung an nächste Klinik

Der Anruf wird SOFORT weitergeleitet!`)
          break
        case 'medical':
          alert(`🏥 Ärztlicher Bereitschaftsdienst ${contact.phone}

⏰ 24/7 verfügbar
👨‍⚕️ Medizinische Beratung
🏥 Nicht-lebensbedrohliche Fälle
💰 Kostenlos aus allen deutschen Netzen

Verbindung wird hergestellt...`)
          break
        case 'support':
          alert(`📞 zweitmeinung.ng Support ${contact.phone}

🕐 Geschäftszeiten: Mo-Fr 8-18 Uhr
💬 Technischer Support
📋 Beratung zu Zweitmeinungen  
❓ Fragen zur Plattform

Anruf wird weitergeleitet...`)
          break
      }
    },
    onTestimonialClick: (testimonial) => {
      console.log('👤 Patient testimonial interaction:', testimonial.id, testimonial.patientName)
      
      const testimonialAnalytics = {
        testimonialId: testimonial.id,
        patientCondition: testimonial.condition,
        rating: testimonial.rating,
        outcome: testimonial.outcome,
        interactionTime: new Date().toISOString(),
        hasVideo: !!testimonial.videoUrl,
        hasAudio: !!testimonial.audioUrl
      }
      
      console.log('📊 Testimonial Analytics:', testimonialAnalytics)
      
      const outcomeText = {
        'positive': '✅ Vollständig geheilt',
        'improved': '📈 Deutliche Verbesserung',
        'ongoing': '⏳ Behandlung läuft'
      }[testimonial.outcome || 'positive']
      
      const detailedView = `
👤 ${testimonial.patientName} - Detailansicht

🏥 Medizinischer Bereich: ${testimonial.condition}
👥 Altersgruppe: ${testimonial.ageRange}
${outcomeText}
⭐ Bewertung: ${testimonial.rating}/5 Sterne
📅 Behandlung: ${testimonial.date?.toLocaleDateString('de-DE')}

💬 Ausführlicher Erfahrungsbericht:
"${testimonial.testimonial}"

${testimonial.videoUrl ? '🎥 Video-Interview verfügbar' : ''}
${testimonial.audioUrl ? '🔊 Audio-Testimonial verfügbar' : ''}

📊 Diese Bewertung wurde verifiziert und entspricht unseren Qualitätsstandards.
      `.trim()
      
      alert(detailedView)
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Vollständig interaktive Hero-Sektion mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}