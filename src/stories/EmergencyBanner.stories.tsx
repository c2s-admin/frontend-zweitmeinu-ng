import type { Meta, StoryObj } from '@storybook/react'
import { EmergencyBanner, EmergencyContact, EmergencyNotification } from './EmergencyBanner'

// Extended emergency contacts for different scenarios
const germanyEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emergency-112',
    name: 'Notruf',
    phone: '112',
    type: 'emergency',
    availability: '24/7',
    coverage: 'national',
    description: 'Feuerwehr, Rettungsdienst, Notarzt',
    languages: ['Deutsch', 'Englisch'],
    notes: 'Für lebensbedrohliche Notfälle'
  },
  {
    id: 'police-110',
    name: 'Polizei',
    phone: '110',
    type: 'emergency',
    availability: '24/7',
    coverage: 'national',
    description: 'Polizeilicher Notruf',
    languages: ['Deutsch', 'Englisch'],
    notes: 'Bei Verbrechen und Gefahren'
  },
  {
    id: 'medical-116117',
    name: 'Ärztlicher Bereitschaftsdienst',
    phone: '116117',
    type: 'medical',
    availability: '24/7',
    coverage: 'national',
    description: 'Nicht-lebensbedrohliche medizinische Probleme',
    website: 'https://www.116117.de',
    languages: ['Deutsch'],
    notes: 'Kostenlos, wenn Hausarzt nicht verfügbar'
  },
  {
    id: 'poison-19240',
    name: 'Giftnotruf Berlin',
    phone: '+49 30 19240',
    type: 'poison',
    availability: '24/7',
    coverage: 'national',
    description: 'Vergiftungsnotfälle und Giftinformationen',
    website: 'https://www.giz-nord.de',
    languages: ['Deutsch', 'Englisch'],
    notes: 'Bei Verdacht auf Vergiftung'
  },
  {
    id: 'crisis-111-0-111',
    name: 'Telefonseelsorge',
    phone: '0800 111 0 111',
    type: 'crisis',
    availability: '24/7',
    coverage: 'national',
    description: 'Psychische Krisen und seelische Notlagen',
    website: 'https://www.telefonseelsorge.de',
    languages: ['Deutsch'],
    notes: 'Kostenfrei und anonym'
  },
  {
    id: 'telehealth-zweitmeinung',
    name: 'zweitmeinung.ng Notfall-Beratung',
    phone: '+49 800 80 44 100',
    type: 'telehealth',
    availability: '24/7',
    coverage: 'national',
    description: 'Medizinische Notfall-Teleberatung',
    website: 'https://zweitmeinung.ng/notfall',
    languages: ['Deutsch', 'Englisch'],
    notes: 'Spezialisiert auf Zweitmeinungen'
  }
]

const internationalContacts: EmergencyContact[] = [
  {
    id: 'emergency-112-eu',
    name: 'European Emergency Number',
    phone: '112',
    type: 'emergency',
    availability: '24/7',
    coverage: 'international',
    description: 'EU-wide emergency services',
    languages: ['English', 'Local languages'],
    notes: 'Works in all EU countries'
  },
  {
    id: 'us-911',
    name: 'US Emergency Services',
    phone: '911',
    type: 'emergency',
    availability: '24/7',
    coverage: 'international',
    description: 'US emergency services',
    languages: ['English', 'Spanish'],
    notes: 'For emergencies in the United States'
  }
]

const criticalNotifications: EmergencyNotification[] = [
  {
    id: 'system-critical-1',
    type: 'critical',
    title: 'Systemausfall - Notfallkontakte verfügbar',
    message: 'Aufgrund technischer Probleme sind einige Dienste nicht verfügbar. Alle Notfallkontakte funktionieren weiterhin.',
    priority: 'critical',
    timestamp: new Date(),
    actions: [
      {
        label: 'Status prüfen',
        url: '/status',
        primary: true
      },
      {
        label: 'Support kontaktieren',
        onClick: () => alert('Support wird kontaktiert...')
      }
    ]
  }
]

const warningNotifications: EmergencyNotification[] = [
  {
    id: 'maintenance-warning',
    type: 'warning',
    title: 'Geplante Wartungsarbeiten',
    message: 'Am 10.08.2024 zwischen 02:00-04:00 Uhr sind einige Services nicht verfügbar. Notfallkontakte bleiben erreichbar.',
    priority: 'high',
    timestamp: new Date(),
    autoDismiss: 30
  },
  {
    id: 'high-traffic-warning',
    type: 'warning',
    title: 'Erhöhtes Anrufaufkommen',
    message: 'Aktuell längere Wartezeiten beim ärztlichen Bereitschaftsdienst. Bei Notfällen wählen Sie 112.',
    priority: 'medium',
    timestamp: new Date()
  }
]

const infoNotifications: EmergencyNotification[] = [
  {
    id: 'new-feature-info',
    type: 'info',
    title: 'Neue Telemedizin-Hotline verfügbar',
    message: 'Ab sofort steht Ihnen unsere 24/7 Notfall-Teleberatung zur Verfügung.',
    priority: 'low',
    timestamp: new Date(),
    actions: [
      {
        label: 'Mehr erfahren',
        url: '/telemedizin',
        primary: true
      }
    ]
  }
]

const meta: Meta<typeof EmergencyBanner> = {
  title: 'Healthcare/EmergencyBanner',
  component: EmergencyBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Healthcare Emergency Banner Component - Kritische Notfallkontakte und Benachrichtigungen

**Healthcare-Optimierungen:**
- Immer sichtbare Notfallkontakte für medizinische Plattformen
- Deutsche Notfallnummern (112, 110, 116117) standardmäßig integriert
- Geografische Anpassung für verschiedene Länder
- Krisenhilfe und psychologische Unterstützung
- Audio-Alarme für kritische Benachrichtigungen
- WCAG 2.1 AA konform mit Screen Reader Support

**Notfallkontakt-Typen:**
- Emergency (112, 110) - Lebensbedrohliche Notfälle
- Medical (116117) - Ärztlicher Bereitschaftsdienst
- Poison - Giftnotruf für Vergiftungen
- Crisis - Telefonseelsorge für psychische Notlagen
- Telehealth - Medizinische Online-Beratung

**Benachrichtigungsarten:**
- Critical - System-kritische Meldungen mit sofortiger Aufmerksamkeit
- Warning - Wichtige Warnungen (Wartungsarbeiten, Ausfälle)
- Info - Informative Meldungen über neue Services
- Maintenance - Geplante Wartungsarbeiten

**Anwendungsfälle:**
- Permanente Notfallkontakte auf medizinischen Plattformen
- Krisensituationen mit sofortiger Hilfe
- Systemausfälle mit Notfallkontakt-Backup
- Wartungsankündigungen für Healthcare-Services
- Geografische Anpassung für internationale Nutzer

**Position & Layout:**
- Top Banner - Fixiert am oberen Bildschirmrand
- Bottom Banner - Fixiert am unteren Bildschirmrand  
- Floating - Schwebendes Widget (mobil-optimiert)
- Inline - Eingebettet in Seiteninhalt

**Accessibility Features:**
- Keyboard Navigation zu allen Notfallkontakten
- Screen Reader Support mit ARIA-Live-Regionen
- Touch-optimiert für stressige Notfallsituationen (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Audio-Alarme für kritische Benachrichtigungen
        `
      }
    }
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'floating'],
      description: 'Banner-Position'
    },
    variant: {
      control: 'select',
      options: ['minimal', 'standard', 'expanded', 'floating'],
      description: 'Layout-Variante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showContacts: {
      control: 'boolean',
      description: 'Notfallkontakte anzeigen'
    },
    showNotifications: {
      control: 'boolean',
      description: 'Benachrichtigungen anzeigen'
    },
    allowMinimize: {
      control: 'boolean',
      description: 'Banner minimieren erlauben'
    },
    enableAudioAlerts: {
      control: 'boolean',
      description: 'Audio-Alarme aktivieren'
    },
    showLocation: {
      control: 'boolean',
      description: 'Standort-Information anzeigen'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus (immer sichtbar, hervorgehoben)'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Disclaimer'
    },
    autoExpandCritical: {
      control: 'boolean',
      description: 'Automatisch bei kritischen Meldungen aufklappen'
    },
    sticky: {
      control: 'boolean',
      description: 'Sticky-Verhalten'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    position: 'top',
    variant: 'standard',
    size: 'medium',
    contacts: germanyEmergencyContacts,
    showContacts: true,
    showNotifications: true,
    allowMinimize: true,
    enableAudioAlerts: false,
    showLocation: true,
    userLocation: 'Deutschland',
    emergencyMode: false,
    medicalContext: true,
    autoExpandCritical: true,
    sticky: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof EmergencyBanner>

// Default Story - Standard Emergency Banner
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Notfall-Banner mit deutschen Notfallkontakten für medizinische Plattformen.'
      }
    }
  }
}

// Emergency Mode - Critical Situation
export const EmergencyMode: Story = {
  args: {
    emergencyMode: true,
    notifications: criticalNotifications,
    autoExpandCritical: true,
    enableAudioAlerts: true,
    allowMinimize: false,
    onEmergencyCall: (contact) => {
      console.log('🚨 EMERGENCY CALL:', contact.name, contact.phone)
      alert(`🚨 NOTFALL-ANRUF\n\n${contact.name}\n📞 ${contact.phone}\n\n${contact.description}\n\nRuft wird weitergeleitet...`)
    },
    onAudioToggle: (enabled) => {
      console.log('🔊 Audio alerts:', enabled ? 'ENABLED' : 'DISABLED')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus mit kritischen Benachrichtigungen und hervorgehobenen Notfallkontakten.'
      }
    }
  }
}

// Top Banner - Fixed Position
export const TopBanner: Story = {
  args: {
    position: 'top',
    variant: 'standard',
    notifications: warningNotifications,
    sticky: true,
    onContactClick: (contact) => {
      console.log('☎️ Contact clicked:', contact.name)
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Fest positionierter Top-Banner mit Wartungsbenachrichtigungen und Notfallkontakten.'
      }
    }
  }
}

// Bottom Banner - Mobile Friendly
export const BottomBanner: Story = {
  args: {
    position: 'bottom',
    size: 'small',
    variant: 'minimal',
    contacts: germanyEmergencyContacts.slice(0, 3),
    allowMinimize: true,
    showLocation: false
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierter Bottom-Banner mit reduzierten Kontakten und Minimier-Option.'
      }
    }
  }
}

// Floating Widget - Minimal Interface
export const FloatingWidget: Story = {
  args: {
    position: 'floating',
    variant: 'floating',
    size: 'small',
    contacts: [
      germanyEmergencyContacts[0], // 112
      germanyEmergencyContacts[2], // 116117
      germanyEmergencyContacts[5]  // zweitmeinung.ng
    ],
    showNotifications: false,
    allowMinimize: true,
    emergencyMode: false
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Schwebendes Widget mit den wichtigsten Notfallkontakten für diskrete Integration.'
      }
    }
  }
}

// Expanded View - Full Information
export const ExpandedView: Story = {
  args: {
    variant: 'expanded',
    size: 'large',
    contacts: germanyEmergencyContacts,
    showContacts: true,
    showNotifications: true,
    notifications: [...warningNotifications, ...infoNotifications],
    autoExpandCritical: false,
    onNotificationDismiss: (notificationId) => {
      console.log('🗑️ Notification dismissed:', notificationId)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig erweiterte Ansicht mit allen Kontakten, detaillierten Informationen und Benachrichtigungen.'
      }
    }
  }
}

// International Contacts - Multi-Country Support
export const InternationalContacts: Story = {
  args: {
    contacts: [...germanyEmergencyContacts.slice(0, 2), ...internationalContacts],
    userLocation: 'International',
    showLocation: true,
    onLocationChange: (location) => {
      console.log('📍 Location changed:', location)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Internationale Notfallkontakte für EU- und US-Nutzer mit geografischer Anpassung.'
      }
    }
  }
}

// Critical Notifications - System Alerts
export const CriticalNotifications: Story = {
  args: {
    notifications: criticalNotifications,
    autoExpandCritical: true,
    emergencyMode: true,
    enableAudioAlerts: true,
    onNotificationDismiss: (notificationId) => {
      console.log('🚨 Critical notification dismissed:', notificationId)
      if (confirm('Möchten Sie diese kritische Benachrichtigung wirklich schließen?')) {
        alert('Kritische Benachrichtigung wurde geschlossen.')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Kritische System-Benachrichtigungen mit automatischer Anzeige und Audio-Alarmen.'
      }
    }
  }
}

// Minimized State - Space Saving
export const MinimizedState: Story = {
  render: (args) => {
    return <EmergencyBanner {...args} />
  },
  args: {
    allowMinimize: true,
    notifications: infoNotifications,
    onMinimize: (minimized) => {
      console.log('📐 Banner minimized:', minimized)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimierte Ansicht für platzsparendes Design mit Aufklapp-Option.'
      }
    }
  }
}

// Medical Context - Healthcare Platform
export const MedicalContext: Story = {
  args: {
    medicalContext: true,
    contacts: [
      germanyEmergencyContacts[0], // 112 Notruf
      germanyEmergencyContacts[2], // 116117 Ärztlicher Bereitschaftsdienst
      germanyEmergencyContacts[3], // Giftnotruf
      germanyEmergencyContacts[5]  // zweitmeinung.ng
    ],
    notifications: [
      {
        id: 'medical-info',
        type: 'info',
        title: 'Medizinischer Hinweis',
        message: 'Bei akuten medizinischen Notfällen wenden Sie sich sofort an den Notruf 112.',
        priority: 'high',
        timestamp: new Date()
      }
    ],
    userLocation: 'Deutschland'
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinischer Kontext mit Healthcare-spezifischen Kontakten und medizinischen Disclaimern.'
      }
    }
  }
}

// Audio Alerts Enabled - Sound Notifications
export const AudioAlertsEnabled: Story = {
  args: {
    enableAudioAlerts: true,
    emergencyMode: false,
    notifications: [
      {
        id: 'audio-test',
        type: 'warning',
        title: 'Audio-Test verfügbar',
        message: 'Audio-Alarme sind aktiviert. Klicken Sie auf einen Notfallkontakt zum Testen.',
        priority: 'medium',
        timestamp: new Date()
      }
    ],
    onAudioToggle: (enabled) => {
      console.log('🔊 Audio alerts toggled:', enabled)
      alert(`🔊 Audio-Alarme ${enabled ? 'aktiviert' : 'deaktiviert'}\n\nBei kritischen Benachrichtigungen und Notfallkontakten werden Töne abgespielt.`)
    },
    onEmergencyCall: (contact) => {
      console.log('🔊 Audio alert triggered for:', contact.name)
      alert(`🔊 AUDIO-ALARM!\n\nNotfall-Anruf an ${contact.name}\n📞 ${contact.phone}\n\n*Simulierter Alarmton*`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Banner mit aktivierten Audio-Alarmen für kritische Benachrichtigungen und Notfallkontakte.'
      }
    }
  }
}

// Mobile Optimized - Touch Interface
export const MobileOptimized: Story = {
  args: {
    position: 'floating',
    size: 'medium',
    variant: 'floating',
    contacts: germanyEmergencyContacts.slice(0, 4),
    showNotifications: true,
    notifications: [
      {
        id: 'mobile-info',
        type: 'info',
        title: 'Mobile-optimiert',
        message: 'Touch-freundliche Bedienung für Notfallsituationen.',
        priority: 'low',
        timestamp: new Date(),
        autoDismiss: 10
      }
    ],
    allowMinimize: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung mit Touch-freundlichen Notfallkontakten.'
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
        story: 'Ladezustand während der Initialisierung der Notfallkontakte mit Skeleton-Elementen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    position: 'top',
    variant: 'standard',
    size: 'medium',
    contacts: germanyEmergencyContacts,
    notifications: [...criticalNotifications, ...warningNotifications, ...infoNotifications],
    showContacts: true,
    showNotifications: true,
    allowMinimize: true,
    enableAudioAlerts: true,
    showLocation: true,
    userLocation: 'Deutschland',
    medicalContext: true,
    autoExpandCritical: true,
    sticky: true,
    onContactClick: (contact) => {
      console.log(`📞 Emergency contact clicked: ${contact.name} (${contact.type})`)
      console.log('Contact details:', {
        phone: contact.phone,
        availability: contact.availability,
        description: contact.description,
        languages: contact.languages,
        coverage: contact.coverage
      })
    },
    onEmergencyCall: (contact) => {
      console.log(`🚨 EMERGENCY CALL INITIATED: ${contact.name}`)
      
      // Simulate emergency call tracking
      const emergencyCallData = {
        contactId: contact.id,
        contactName: contact.name,
        phone: contact.phone,
        type: contact.type,
        timestamp: new Date().toISOString(),
        userLocation: 'Deutschland',
        callMethod: 'direct_dial'
      }
      
      console.log('📊 Emergency Call Analytics:', emergencyCallData)
      
      alert(`🚨 NOTFALL-ANRUF

👤 Kontakt: ${contact.name}
📞 Nummer: ${contact.phone}
🏥 Typ: ${contact.type}
⏰ Verfügbarkeit: ${contact.availability}
🌍 Abdeckung: ${contact.coverage}

${contact.description}

${contact.notes ? `ℹ️ Hinweis: ${contact.notes}` : ''}

Der Anruf wird jetzt weitergeleitet...`)
    },
    onNotificationDismiss: (notificationId) => {
      console.log(`🗑️ Notification dismissed: ${notificationId}`)
      
      // Simulate notification analytics
      console.log('📊 Notification Analytics:', {
        notificationId,
        action: 'dismissed',
        timestamp: new Date().toISOString(),
        method: 'user_action'
      })
    },
    onMinimize: (minimized) => {
      console.log(`📐 Emergency banner ${minimized ? 'minimized' : 'expanded'}`)
      
      if (minimized) {
        alert('⚠️ Notfall-Banner minimiert\n\nDie Notfallkontakte sind weiterhin über das minimierte Banner erreichbar.')
      } else {
        alert('📋 Notfall-Banner erweitert\n\nAlle Notfallkontakte und Benachrichtigungen sind jetzt sichtbar.')
      }
    },
    onLocationChange: (location) => {
      console.log(`📍 Location changed to: ${location}`)
      alert(`📍 Standort geändert: ${location}\n\nNotfallkontakte werden entsprechend angepasst.`)
    },
    onAudioToggle: (enabled) => {
      console.log(`🔊 Audio alerts ${enabled ? 'enabled' : 'disabled'}`)
      
      if (enabled) {
        alert('🔊 Audio-Alarme aktiviert\n\nBei kritischen Benachrichtigungen und Notfallkontakten werden akustische Signale ausgegeben.')
      } else {
        alert('🔇 Audio-Alarme deaktiviert\n\nKeine akustischen Signale bei Benachrichtigungen.')
      }
    }
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Vollständig interaktive Notfall-Banner mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}

// Accessibility Demo - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Notfall-Banner mit wichtigen medizinischen Kontakten für zweitmeinung.ng',
    variant: 'standard',
    contacts: [
      {
        ...germanyEmergencyContacts[0],
        description: 'Notruf für lebensbedrohliche Notfälle - Feuerwehr, Rettungsdienst, Notarzt'
      },
      {
        ...germanyEmergencyContacts[2],
        description: 'Ärztlicher Bereitschaftsdienst für nicht-lebensbedrohliche medizinische Probleme außerhalb der Sprechzeiten'
      }
    ],
    notifications: [
      {
        id: 'accessibility-info',
        type: 'info',
        title: 'Barrierefreie Notfallhilfe',
        message: 'Dieses Banner ist für Screen Reader optimiert. Verwenden Sie Tab zur Navigation zwischen Notfallkontakten.',
        priority: 'medium',
        timestamp: new Date()
      }
    ],
    medicalContext: true,
    showLocation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreies Notfall-Banner mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Optimierung.'
      }
    }
  }
}