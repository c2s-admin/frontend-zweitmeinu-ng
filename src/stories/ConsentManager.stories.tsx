import type { Meta, StoryObj } from '@storybook/react'
import { ConsentManager, ConsentCategory, ConsentRecord } from './ConsentManager'

// Sample consent data for different scenarios
const emergencyConsentCategories: ConsentCategory[] = [
  {
    id: 'essential',
    name: 'Essentiell',
    description: 'Technisch notwendige Cookies für die Notfall-Plattform.',
    essential: true,
    consented: true,
    purposes: ['Notfall-Sitzung', 'Sicherheit'],
    retentionPeriod: 'Sitzung',
    legalBasis: 'contract',
    lastChanged: new Date(),
    consentMethod: 'explicit'
  },
  {
    id: 'emergency_medical',
    name: 'Notfall-Medizindaten',
    description: 'Sofortige Verarbeitung kritischer medizinischer Daten für Notfallberatung.',
    essential: false,
    consented: false,
    purposes: ['Notfall-Beratung', 'Lebensrettende Maßnahmen'],
    retentionPeriod: '10 Jahre',
    legalBasis: 'vital_interests',
    thirdParties: ['Notfall-Ärzte', 'Rettungsdienst'],
    consentMethod: 'explicit'
  }
]

const fullConsentCategories: ConsentCategory[] = [
  {
    id: 'essential',
    name: 'Essentiell',
    description: 'Technisch notwendige Cookies und Daten für die Grundfunktionen der Plattform.',
    essential: true,
    consented: true,
    purposes: ['Sitzungsverwaltung', 'Sicherheit', 'Funktionsfähigkeit', 'Login-Status'],
    retentionPeriod: 'Sitzung',
    legalBasis: 'contract',
    lastChanged: new Date('2024-08-01'),
    consentMethod: 'explicit'
  },
  {
    id: 'medical_data',
    name: 'Medizinische Datenverarbeitung',
    description: 'Verarbeitung und Speicherung Ihrer medizinischen Unterlagen für die Zweitmeinungsberatung.',
    essential: false,
    consented: true,
    purposes: ['Medizinische Beratung', 'Arzt-Patienten-Kommunikation', 'Befundanalyse', 'Diagnose-Support'],
    retentionPeriod: '10 Jahre (gesetzlich vorgeschrieben)',
    legalBasis: 'consent',
    thirdParties: ['Spezialisierte Fachärzte', 'Medizinische Bildanalysedienste', 'Laborpartner'],
    consentMethod: 'explicit'
  },
  {
    id: 'analytics',
    name: 'Analyse und Statistik',
    description: 'Anonymisierte Nutzungsstatistiken zur Verbesserung unserer Dienste.',
    essential: false,
    consented: false,
    purposes: ['Webseitenoptimierung', 'Nutzungsanalyse', 'Performance-Messung', 'A/B-Testing'],
    retentionPeriod: '26 Monate',
    legalBasis: 'legitimate_interests',
    thirdParties: ['Google Analytics (anonymisiert)', 'Hotjar (anonymisiert)'],
    consentMethod: 'explicit'
  },
  {
    id: 'marketing',
    name: 'Marketing und Kommunikation',
    description: 'Personalisierte Gesundheitsinformationen und Newsletter.',
    essential: false,
    consented: false,
    purposes: ['Newsletter', 'Serviceinformationen', 'Gesundheitstipps', 'Produktankündigungen'],
    retentionPeriod: 'Bis Widerruf',
    legalBasis: 'consent',
    thirdParties: ['E-Mail-Service-Provider', 'Marketing-Automation-Tools'],
    consentMethod: 'explicit'
  },
  {
    id: 'personalization',
    name: 'Personalisierung',
    description: 'Anpassung der Plattform an Ihre individuellen Präferenzen.',
    essential: false,
    consented: true,
    purposes: ['Benutzererfahrung', 'Inhaltspersonalisierung', 'Empfehlungen'],
    retentionPeriod: '2 Jahre',
    legalBasis: 'consent',
    consentMethod: 'explicit'
  }
]

const sampleConsentHistory: ConsentRecord[] = [
  {
    id: 'consent-2024-08-07-001',
    timestamp: new Date('2024-08-07T10:30:00'),
    userId: 'user-hash-abc123',
    categories: {
      essential: true,
      medical_data: true,
      analytics: false,
      marketing: false,
      personalization: true
    },
    method: 'settings',
    ipAddress: '192.168.1.xxx',
    userAgent: 'Mozilla/5.0...',
    policyVersion: '2.1'
  },
  {
    id: 'consent-2024-08-01-001',
    timestamp: new Date('2024-08-01T14:15:00'),
    userId: 'user-hash-abc123',
    categories: {
      essential: true,
      medical_data: false,
      analytics: false,
      marketing: false,
      personalization: false
    },
    method: 'banner',
    ipAddress: '192.168.1.xxx',
    userAgent: 'Mozilla/5.0...',
    policyVersion: '2.0'
  }
]

const meta: Meta<typeof ConsentManager> = {
  title: 'Healthcare/ConsentManager',
  component: ConsentManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Healthcare Consent Manager Component - DSGVO-konforme Einwilligungsverwaltung für medizinische Plattformen

**Healthcare-Optimierungen:**
- DSGVO/GDPR-konforme Einwilligungsverwaltung für medizinische Daten
- Granulare Kontrolle über verschiedene Datenkategorien (Essentiell, Medizinisch, Analytics, Marketing)
- Medizinische Datenschutz-Badges und Sicherheitshinweise
- Audit-Trail für alle Einwilligungsänderungen
- Rechtliche Grundlagen nach DSGVO (Einwilligung, Vertrag, berechtigte Interessen, etc.)
- WCAG 2.1 AA konform mit Screen Reader Support

**DSGVO-Compliance Features:**
- Explizite Einwilligung für nicht-essenzielle Cookies
- Granulare Kontrolle über Datenkategorien
- Widerrufsmöglichkeit jederzeit
- Dokumentation der Rechtsgrundlagen
- Kontaktinformationen für Datenschutzbeauftragte
- Datenportabilität (Download) und Löschungsrecht

**Medizinische Datenschutz-Kategorien:**
- Essentiell - Technisch notwendige Funktionen
- Medizinische Datenverarbeitung - HIPAA/DSGVO-konforme Speicherung medizinischer Unterlagen
- Analyse & Statistik - Anonymisierte Nutzungsstatistiken
- Marketing & Kommunikation - Newsletter und Gesundheitsinformationen
- Personalisierung - Anpassung der Benutzererfahrung

**Anwendungsfälle:**
- Cookie-Banner für neue Besucher
- Datenschutz-Einstellungen für registrierte Nutzer
- Einwilligungsverwaltung während Registrierungsprozess
- Notfall-Einwilligungen für kritische medizinische Situationen
- Vollständige GDPR-Compliance-Übersicht

**Accessibility Features:**
- Keyboard Navigation durch alle Einstellungen
- Screen Reader Support mit ARIA-Labels
- Touch-optimiert für Healthcare-Tablets (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Toggle-Steuerungen mit klaren Status-Anzeigen
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['banner', 'modal', 'settings', 'inline'],
      description: 'Layout-Variante für verschiedene Anwendungsfälle'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showDetails: {
      control: 'boolean',
      description: 'Detaillierte Kategorie-Informationen anzeigen'
    },
    showHistory: {
      control: 'boolean',
      description: 'Einwilligungs-Historie anzeigen'
    },
    showDataUsage: {
      control: 'boolean',
      description: 'Datennutzungs-Statistiken anzeigen'
    },
    allowGranular: {
      control: 'boolean',
      description: 'Granulare Einwilligungskontrolle erlauben'
    },
    gdprMode: {
      control: 'boolean',
      description: 'DSGVO-Compliance-Modus'
    },
    medicalMode: {
      control: 'boolean',
      description: 'Medizinischer Datenschutz-Modus'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'modal',
    size: 'medium',
    categories: fullConsentCategories,
    showDetails: false,
    showHistory: false,
    showDataUsage: true,
    allowGranular: true,
    gdprMode: true,
    medicalMode: true,
    policyVersion: '2.1',
    policyUrl: '/datenschutz',
    contactEmail: 'datenschutz@zweitmeinung.ng',
    organizationName: 'zweitmeinung.ng',
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ConsentManager>

// Default Story - Standard GDPR Consent Modal
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard DSGVO-konforme Einwilligungsverwaltung für medizinische Plattformen mit granularen Datenschutz-Kontrollen.'
      }
    }
  }
}

// Cookie Banner - First Visit Experience
export const CookieBanner: Story = {
  args: {
    variant: 'banner',
    size: 'medium',
    showDetails: false,
    allowGranular: true,
    onAcceptAll: () => {
      console.log('🍪 All cookies accepted')
      alert('Alle Cookies wurden akzeptiert!')
    },
    onRejectAll: () => {
      console.log('🚫 All non-essential cookies rejected')
      alert('Nur essenzielle Cookies wurden akzeptiert!')
    },
    onOpenSettings: () => {
      console.log('⚙️ Opening detailed settings')
      alert('Öffne detaillierte Einstellungen...')
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Cookie-Banner für Erstbesucher mit Optionen für Akzeptieren, Ablehnen oder detaillierte Einstellungen.'
      }
    }
  }
}

// Settings Page - Complete Privacy Controls
export const SettingsPage: Story = {
  args: {
    variant: 'settings',
    size: 'large',
    showDetails: true,
    showDataUsage: true,
    showHistory: false,
    allowGranular: true,
    onSavePreferences: (consents) => {
      console.log('💾 Preferences saved:', consents)
      alert(`Einstellungen gespeichert!\n\nAktivierte Kategorien:\n${Object.entries(consents).filter(([, enabled]) => enabled).map(([cat]) => `• ${cat}`).join('\n')}`)
    },
    onConsentChange: (categoryId, consented) => {
      console.log(`🔄 Consent changed: ${categoryId} = ${consented}`)
    }
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Vollständige Datenschutz-Einstellungsseite mit detaillierten Kategorien und granularer Kontrolle.'
      }
    }
  }
}

// Emergency Medical Consent - Critical Situations
export const EmergencyMedicalConsent: Story = {
  args: {
    variant: 'modal',
    size: 'medium',
    categories: emergencyConsentCategories,
    medicalMode: true,
    gdprMode: true,
    organizationName: 'Notfall-Telemedizin',
    title: '🚨 Notfall-Einwilligung',
    subtitle: 'Schnelle Einwilligung für medizinische Notfälle',
    onAcceptAll: () => {
      console.log('🚨 Emergency consent granted')
      alert('Notfall-Einwilligung erteilt!\nMedizinische Daten können sofort verarbeitet werden.')
    },
    onConsentChange: (categoryId, consented) => {
      console.log(`Emergency consent: ${categoryId} = ${consented}`)
      if (categoryId === 'emergency_medical' && consented) {
        alert('⚡ Notfall-Modus aktiviert!\nMedizinische Daten werden sofort für die Beratung freigegeben.')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vereinfachte Einwilligungsverwaltung für medizinische Notfälle mit schneller Freigabe kritischer Daten.'
      }
    }
  }
}

// Medical Data Focused - Healthcare Platform
export const MedicalDataFocused: Story = {
  args: {
    variant: 'modal',
    categories: fullConsentCategories.filter(cat => 
      cat.id === 'essential' || cat.id === 'medical_data' || cat.id === 'analytics'
    ),
    medicalMode: true,
    showDetails: true,
    currentConsents: {
      essential: true,
      medical_data: false,
      analytics: false
    },
    onConsentChange: (categoryId, consented) => {
      console.log(`Medical consent: ${categoryId} = ${consented}`)
      if (categoryId === 'medical_data') {
        if (consented) {
          alert('🏥 Medizinische Datenverarbeitung aktiviert!\n\nIhre medizinischen Unterlagen können nun sicher für die Zweitmeinungsberatung verwendet werden.')
        } else {
          alert('⚠️ Medizinische Datenverarbeitung deaktiviert!\n\nOhne diese Einwilligung können wir keine medizinische Beratung anbieten.')
        }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokussierte Einwilligungsverwaltung für medizinische Datenverarbeitung mit detaillierten Informationen über Datenschutz im Gesundheitswesen.'
      }
    }
  }
}

// Inline Settings - Embedded in Page
export const InlineSettings: Story = {
  args: {
    variant: 'inline',
    size: 'medium',
    showDetails: false,
    showDataUsage: true,
    allowGranular: true
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Eingebettete Datenschutz-Einstellungen für Integration in bestehende Seiten oder Dashboards.'
      }
    }
  }
}

// Compact Mobile - Touch Optimized
export const CompactMobile: Story = {
  args: {
    variant: 'modal',
    size: 'small',
    showDetails: false,
    showDataUsage: false,
    allowGranular: true,
    categories: fullConsentCategories.slice(0, 3) // Reduced for mobile
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Einwilligungsverwaltung mit Touch-freundlichen Controls und vereinfachter Darstellung.'
      }
    }
  }
}

// Detailed Information - Full Transparency
export const DetailedInformation: Story = {
  args: {
    variant: 'settings',
    size: 'large',
    showDetails: true,
    showDataUsage: true,
    showHistory: false,
    categories: fullConsentCategories,
    onDownloadData: () => {
      console.log('📥 Data download requested')
      alert('Ihr Datenexport wird vorbereitet.\n\nSie erhalten eine E-Mail mit dem Download-Link innerhalb der nächsten 30 Minuten.')
    },
    onDeleteData: () => {
      console.log('🗑️ Data deletion requested')
      if (confirm('⚠️ Achtung!\n\nMöchten Sie wirklich alle Ihre Daten löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden.')) {
        alert('Ihr Löschungsantrag wurde eingereicht.\n\nIhre Daten werden innerhalb von 30 Tagen vollständig gelöscht.')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständige Transparenz mit allen verfügbaren Informationen zu Datenschutz, Rechtsgrundlagen und Nutzungsrechten.'
      }
    }
  }
}

// Pre-configured Consents - Returning User
export const PreConfiguredConsents: Story = {
  args: {
    variant: 'settings',
    currentConsents: {
      essential: true,
      medical_data: true,
      analytics: false,
      marketing: true,
      personalization: true
    },
    showDetails: true,
    showDataUsage: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Vorkonfigurierte Einstellungen für wiederkehrende Nutzer mit bereits erteilten Einwilligungen.'
      }
    }
  }
}

// GDPR Rights Focus - Data Subject Rights
export const GDPRRightsFocus: Story = {
  args: {
    variant: 'settings',
    size: 'large',
    showDetails: true,
    gdprMode: true,
    categories: fullConsentCategories,
    onDownloadData: () => {
      console.log('📋 GDPR Data Portability - Article 20')
      alert(`📋 Datenportabilität (Art. 20 DSGVO)

Ihr Antrag auf Datenübertragbarkeit wurde registriert.

Sie erhalten innerhalb von einem Monat:
• Alle personenbezogenen Daten in maschinenlesbarem Format
• Informationen über Datenverarbeitungszwecke
• Empfänger Ihrer Daten
• Speicherdauer

Kontakt: datenschutz@zweitmeinung.ng`)
    },
    onDeleteData: () => {
      console.log('🗑️ GDPR Right to Erasure - Article 17')
      if (confirm('🗑️ Recht auf Löschung (Art. 17 DSGVO)\n\nMöchten Sie die Löschung Ihrer personenbezogenen Daten beantragen?\n\nHinweis: Medizinische Daten unterliegen gesetzlichen Aufbewahrungsfristen (10 Jahre).')) {
        alert(`✅ Löschungsantrag eingereicht

Ihr Antrag wird geprüft und innerhalb eines Monats bearbeitet.

Ausnahmen:
• Medizinische Daten (gesetzliche Aufbewahrungsfrist)
• Daten für Rechtsansprüche
• Daten mit berechtigtem Interesse

Sie erhalten eine Bestätigung per E-Mail.`)
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokus auf DSGVO-Betroffenenrechte mit vollständiger Implementierung von Datenportabilität und Löschungsrecht.'
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
        story: 'Ladezustand während der Abfrage der aktuellen Einwilligungseinstellungen mit Skeleton-Elementen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    variant: 'settings',
    size: 'large',
    showDetails: true,
    showDataUsage: true,
    allowGranular: true,
    gdprMode: true,
    medicalMode: true,
    onAcceptAll: () => {
      console.log('✅ All categories accepted')
      alert('🎉 Alle Einwilligungen erteilt!\n\nVielen Dank für Ihr Vertrauen. Alle Funktionen der Plattform stehen Ihnen nun zur Verfügung.')
    },
    onRejectAll: () => {
      console.log('❌ All non-essential rejected')
      alert('⚠️ Nur essenzielle Cookies akzeptiert\n\nEinige Funktionen sind möglicherweise eingeschränkt verfügbar.')
    },
    onSavePreferences: (consents) => {
      console.log('💾 Detailed consent preferences:', consents)
      const enabledCategories = Object.entries(consents).filter(([, enabled]) => enabled)
      const disabledCategories = Object.entries(consents).filter(([, enabled]) => !enabled)
      
      console.log('📊 Consent Analytics:', {
        total: Object.keys(consents).length,
        enabled: enabledCategories.length,
        disabled: disabledCategories.length,
        consentRate: Math.round((enabledCategories.length / Object.keys(consents).length) * 100) + '%'
      })
      
      alert(`💾 Einstellungen gespeichert!

✅ Aktiviert (${enabledCategories.length}):
${enabledCategories.map(([cat]) => `• ${cat}`).join('\n')}

❌ Deaktiviert (${disabledCategories.length}):
${disabledCategories.map(([cat]) => `• ${cat}`).join('\n')}

Ihre Präferenzen wurden sicher gespeichert.`)
    },
    onConsentChange: (categoryId, consented) => {
      console.log(`🔄 Consent Toggle: ${categoryId} = ${consented ? '✅ ENABLED' : '❌ DISABLED'}`)
      
      // Simulate category-specific actions
      switch (categoryId) {
        case 'medical_data':
          if (consented) {
            console.log('🏥 Medical data processing ENABLED - HIPAA compliance active')
          } else {
            console.log('🚫 Medical data processing DISABLED - Limited functionality')
          }
          break
        case 'analytics':
          if (consented) {
            console.log('📊 Analytics ENABLED - Anonymous usage tracking active')
          } else {
            console.log('🚫 Analytics DISABLED - No usage tracking')
          }
          break
        case 'marketing':
          if (consented) {
            console.log('📧 Marketing ENABLED - Newsletter and health tips active')
          } else {
            console.log('🚫 Marketing DISABLED - No promotional communications')
          }
          break
      }
    },
    onViewPolicy: () => {
      console.log('📄 Privacy policy viewed')
      alert(`📄 Datenschutzerklärung

Version: 2.1
Letzte Aktualisierung: 1. August 2024

Die vollständige Datenschutzerklärung wird in einem neuen Fenster geöffnet.

Kontakt bei Fragen:
📧 datenschutz@zweitmeinung.ng
📞 +49 800 80 44 100`)
    },
    onDownloadData: () => {
      console.log('📥 GDPR Data Export initiated')
      alert(`📥 Datenexport gestartet

Ihr personenbezogener Datenexport wird erstellt:

✅ Kontoinformationen
✅ Einwilligungshistorie  
✅ Nutzungsstatistiken (anonymisiert)
✅ Medizinische Metadaten (verschlüsselt)

📧 Download-Link wird an Ihre E-Mail-Adresse gesendet.
⏱️ Erstellung dauert ca. 15-30 Minuten.

Hinweis: Medizinische Originalunterlagen werden aus Datenschutzgründen nicht exportiert.`)
    },
    onDeleteData: () => {
      console.log('🗑️ GDPR Data Deletion requested')
      if (confirm('⚠️ DSGVO Löschungsantrag\n\nSind Sie sicher, dass Sie die Löschung Ihrer Daten beantragen möchten?\n\nDieser Vorgang kann nicht rückgängig gemacht werden.')) {
        alert(`🗑️ Löschungsantrag eingereicht

Ihr Antrag wird bearbeitet gemäß:
• DSGVO Art. 17 (Recht auf Löschung)
• Bundesdatenschutzgesetz (BDSG)
• Medizinische Aufbewahrungspflichten

⏱️ Bearbeitungszeit: Bis zu 30 Tage
📧 Bestätigung erfolgt per E-Mail

Ausnahmen:
• Medizinische Daten (10 Jahre Aufbewahrungspflicht)
• Rechnungsdaten (10 Jahre steuerlich)
• Rechtliche Ansprüche

Bei Fragen: datenschutz@zweitmeinung.ng`)
      }
    },
    onClose: () => {
      console.log('❌ Consent manager closed')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive Einwilligungsverwaltung mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}

// Accessibility Demo - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Medizinischer Datenschutz und Cookie-Einstellungen für zweitmeinung.ng',
    variant: 'modal',
    showDetails: true,
    allowGranular: true,
    gdprMode: true,
    categories: [
      {
        id: 'accessibility',
        name: 'Barrierefreiheit',
        description: 'Einstellungen zur Verbesserung der Barrierefreiheit für Nutzer mit besonderen Bedürfnissen.',
        essential: false,
        consented: true,
        purposes: ['Screen Reader Support', 'Keyboard Navigation', 'High Contrast', 'Reduced Motion'],
        retentionPeriod: 'Dauerhaft (bis Widerruf)',
        legalBasis: 'consent',
        consentMethod: 'explicit'
      },
      ...fullConsentCategories.slice(0, 2)
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreie Einwilligungsverwaltung mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Optimierung.'
      }
    }
  }
}