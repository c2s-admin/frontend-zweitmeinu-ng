import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareList, HealthcareListItem } from './HealthcareList'
import { User, Calendar, Stethoscope, Pill, Phone, TestTube, AlertTriangle } from 'lucide-react'
import * as React from 'react'

// Sample data for different healthcare list types
const medicalRecords: HealthcareListItem[] = [
  {
    id: 'record-1',
    title: 'Hypertonie Grad I',
    subtitle: 'Arterielle Hypertonie, primär',
    value: 'Diagnostiziert: 15.03.2024',
    status: 'warning',
    specialty: 'kardiologie',
    priority: 'medium',
    icdCode: 'I10.90',
    icon: React.createElement(Heart, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-03-15T10:30:00'),
    metadata: {
      professional: 'Dr. med. Schmidt',
      facility: 'Kardiologie Zentrum',
      notes: 'Regelmäßige Kontrollen alle 3 Monate erforderlich'
    },
    clickable: true
  },
  {
    id: 'record-2',
    title: 'Diabetes mellitus Typ 2',
    subtitle: 'Gut eingestellter Diabetes',
    value: 'HbA1c: 6.8%',
    status: 'success',
    specialty: 'nephrologie',
    priority: 'low',
    icdCode: 'E11.9',
    timestamp: new Date('2024-02-20T14:15:00'),
    metadata: {
      professional: 'Dr. med. Weber',
      facility: 'Endokrinologie Praxis',
      notes: 'Hervorragende Blutzuckerwerte, Therapie fortsetzen'
    },
    clickable: true
  },
  {
    id: 'record-3',
    title: 'Gallenstein',
    subtitle: 'Cholelithiasis ohne Entzündung',
    value: 'Größe: 12mm',
    status: 'pending',
    specialty: 'gallenblase',
    priority: 'medium',
    icdCode: 'K80.2',
    timestamp: new Date('2024-01-10T09:45:00'),
    metadata: {
      professional: 'Dr. med. Wagner',
      facility: 'Gastroenterologie Klinik',
      notes: 'OP-Termin geplant für April 2024'
    },
    clickable: true
  }
]

const appointments: HealthcareListItem[] = [
  {
    id: 'appointment-1',
    title: 'Kardiologe Kontrolltermin',
    subtitle: 'Dr. med. Schmidt',
    value: '15.04.2024, 10:30',
    status: 'pending',
    specialty: 'kardiologie',
    priority: 'medium',
    icon: React.createElement(Calendar, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-04-15T10:30:00'),
    metadata: {
      professional: 'Dr. med. Schmidt',
      facility: 'Kardiologie Zentrum München'
    },
    clickable: true
  },
  {
    id: 'appointment-2',
    title: 'Blutabnahme Labor',
    subtitle: 'Nüchtern-Blutzucker',
    value: '12.04.2024, 08:00',
    status: 'success',
    priority: 'low',
    icon: React.createElement(TestTube, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-04-12T08:00:00'),
    metadata: {
      facility: 'Labor Diagnostik GmbH',
      notes: 'Nüchtern erscheinen, letzte Mahlzeit 22:00 Uhr am Vorabend'
    },
    clickable: true
  },
  {
    id: 'appointment-3',
    title: 'Gallenblasen-OP',
    subtitle: 'Laparoskopische Cholezystektomie',
    value: '25.04.2024, 07:00',
    status: 'warning',
    specialty: 'gallenblase',
    priority: 'high',
    icon: React.createElement(Stethoscope, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-04-25T07:00:00'),
    metadata: {
      professional: 'Prof. Dr. Wagner',
      facility: 'Chirurgische Klinik München',
      notes: 'Aufnahme am Vortag, nüchtern ab 22:00 Uhr'
    },
    clickable: true
  }
]

const medications: HealthcareListItem[] = [
  {
    id: 'med-1',
    title: 'Metoprolol 50mg',
    subtitle: 'Betablocker',
    value: '1x täglich morgens',
    status: 'success',
    specialty: 'kardiologie',
    icon: React.createElement(Pill, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-03-15T00:00:00'),
    metadata: {
      professional: 'Dr. med. Schmidt',
      notes: 'Bei Nebenwirkungen sofort Arzt kontaktieren'
    },
    clickable: true
  },
  {
    id: 'med-2',
    title: 'Metformin 1000mg',
    subtitle: 'Antidiabetikum',
    value: '2x täglich zu den Mahlzeiten',
    status: 'success',
    specialty: 'nephrologie',
    timestamp: new Date('2024-02-20T00:00:00'),
    metadata: {
      professional: 'Dr. med. Weber',
      notes: 'Immer zu den Mahlzeiten einnehmen um Magen-Darm-Beschwerden zu vermeiden'
    },
    clickable: true
  },
  {
    id: 'med-3',
    title: 'Ibuprofen 400mg',
    subtitle: 'Schmerzmittel (bei Bedarf)',
    value: 'Max. 3x täglich',
    status: 'warning',
    priority: 'medium',
    icon: React.createElement(AlertTriangle, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-01-10T00:00:00'),
    metadata: {
      professional: 'Dr. med. Wagner',
      notes: 'Nicht länger als 3 Tage ohne ärztliche Rücksprache einnehmen'
    },
    clickable: true
  }
]

const testResults: HealthcareListItem[] = [
  {
    id: 'test-1',
    title: 'Großes Blutbild',
    subtitle: 'Laborwerte vom 12.04.2024',
    value: 'Alle Werte im Normbereich',
    status: 'success',
    icon: React.createElement(TestTube, { className: 'healthcare-list-item-icon' }),
    timestamp: new Date('2024-04-12T15:30:00'),
    metadata: {
      facility: 'Labor Diagnostik GmbH',
      notes: 'Hb: 14.2 g/dl, Leukozyten: 6.800/µl, Thrombozyten: 285.000/µl'
    },
    clickable: true
  },
  {
    id: 'test-2',
    title: 'EKG Ruhe',
    subtitle: 'Elektrokardiogramm',
    value: 'Sinusrhythmus, 72 bpm',
    status: 'success',
    specialty: 'kardiologie',
    timestamp: new Date('2024-03-15T10:45:00'),
    metadata: {
      professional: 'Dr. med. Schmidt',
      facility: 'Kardiologie Zentrum',
      notes: 'Normales EKG ohne Auffälligkeiten'
    },
    clickable: true
  },
  {
    id: 'test-3',
    title: 'Sonographie Abdomen',
    subtitle: 'Bauchultraschall',
    value: 'Gallenstein bestätigt',
    status: 'warning',
    specialty: 'gallenblase',
    priority: 'medium',
    timestamp: new Date('2024-01-10T11:20:00'),
    metadata: {
      professional: 'Dr. med. Wagner',
      facility: 'Gastroenterologie Klinik',
      notes: 'Gallenstein 12mm, keine akute Entzündung sichtbar'
    },
    clickable: true
  }
]

const emergencyContacts: HealthcareListItem[] = [
  {
    id: 'emergency-1',
    title: 'Notarzt',
    subtitle: 'Bei lebensbedrohlichen Notfällen',
    value: '112',
    status: 'error',
    priority: 'critical',
    icon: React.createElement(Phone, { className: 'healthcare-list-item-icon' }),
    metadata: {
      notes: 'Herzinfarkt, Schlaganfall, schwere Unfälle'
    },
    clickable: true
  },
  {
    id: 'emergency-2',
    title: 'Ärztlicher Bereitschaftsdienst',
    subtitle: 'Bei dringenden aber nicht lebensbedrohlichen Fällen',
    value: '116 117',
    status: 'warning',
    priority: 'high',
    icon: React.createElement(User, { className: 'healthcare-list-item-icon' }),
    metadata: {
      notes: 'Außerhalb der Sprechzeiten, Wochenende, Feiertage'
    },
    clickable: true
  },
  {
    id: 'emergency-3',
    title: 'Giftnotruf',
    subtitle: 'Bei Vergiftungen',
    value: '+49 800 80 44 100',
    status: 'error',
    priority: 'critical',
    icon: React.createElement(AlertTriangle, { className: 'healthcare-list-item-icon' }),
    metadata: {
      notes: '24h erreichbar, kostenlos aus allen Netzen'
    },
    clickable: true
  }
]

const meta: Meta<typeof HealthcareList> = {
  title: 'Healthcare/List',
  component: HealthcareList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare List Component - Strukturierte Darstellung medizinischer Daten und Informationen

**Healthcare-Optimierungen:**
- Medizinische Datentypen (Krankenakten, Termine, Medikamente, Laborwerte, Notfallkontakte)
- Fachbereichsspezifische Farbkodierung und Priorisierung
- ICD-10 Codes und medizinische Metadaten
- Zeitstempel für medizinische Dokumentation
- WCAG 2.1 AA konform mit Screen Reader Support
- 56px Touch-Targets für Healthcare-Nutzer

**Medizinische Anwendungsfälle:**
- Patientenakten mit Diagnosen und ICD-10 Codes
- Terminlisten mit Fachbereichszuordnung
- Medikamentenpläne mit Dosierungsangaben
- Laborergebnisse und Untersuchungsbefunde
- Notfallkontakte mit Prioritätseinstufung
- Medizinische Verlaufsdokumentation

**Accessibility Features:**
- Keyboard Navigation mit Enter/Space Aktivierung
- Screen Reader Support mit detaillierten Beschreibungen
- High Contrast Mode für bessere Lesbarkeit
- Flexible Layouts für verschiedene Viewport-Größen
- Status-Icons für schnelle visuelle Orientierung
- Medizinische Metadaten für Kontext-Information
        `
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'medical-records', 'appointments', 'medications', 'test-results', 'emergency-contacts'],
      description: 'Liste Typ für medizinischen Kontext'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Listen-Größe'
    },
    showIcons: {
      control: 'boolean',
      description: 'Icons anzeigen'
    },
    showMetadata: {
      control: 'boolean',
      description: 'Medizinische Metadaten anzeigen'
    },
    showTimestamp: {
      control: 'boolean',
      description: 'Zeitstempel anzeigen'
    },
    showIcdCodes: {
      control: 'boolean',
      description: 'ICD-10 Codes anzeigen'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Datenschutz-Footer'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    items: medicalRecords,
    title: 'Medizinische Daten',
    type: 'medical-records',
    size: 'medium',
    showIcons: true,
    showMetadata: false,
    showTimestamp: false,
    showIcdCodes: false,
    medicalContext: false,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareList>

// Default Story - Medical Records
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard medizinische Datenliste mit Diagnosen, Status-Indikatoren und Fachbereichszuordnung.'
      }
    }
  }
}

// Medical Records - Complete Information
export const MedicalRecordsComplete: Story = {
  args: {
    items: medicalRecords,
    title: 'Patientenakte - Aktive Diagnosen',
    type: 'medical-records',
    showMetadata: true,
    showTimestamp: true,
    showIcdCodes: true,
    medicalContext: true,
    onItemClick: (item) => console.log('Medical record clicked:', item.title)
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständige Patientenakte mit ICD-10 Codes, Metadaten und medizinischem Kontext.'
      }
    }
  }
}

// Appointments List - Patient Schedule
export const AppointmentsList: Story = {
  args: {
    items: appointments,
    title: 'Nächste Termine',
    type: 'appointments',
    showMetadata: true,
    showTimestamp: true,
    onItemClick: (item) => console.log('Appointment clicked:', item.title)
  },
  parameters: {
    docs: {
      description: {
        story: 'Terminliste mit Ärzten, Behandlungen und wichtigen Hinweisen für die Vorbereitung.'
      }
    }
  }
}

// Medications List - Current Prescriptions
export const MedicationsList: Story = {
  args: {
    items: medications,
    title: 'Aktuelle Medikation',
    type: 'medications',
    showMetadata: true,
    showTimestamp: true,
    medicalContext: true,
    onItemClick: (item) => console.log('Medication clicked:', item.title)
  },
  parameters: {
    docs: {
      description: {
        story: 'Medikamentenplan mit Dosierungen, Einnahmezeiten und wichtigen Warnhinweisen.'
      }
    }
  }
}

// Test Results - Laboratory Values
export const TestResults: Story = {
  args: {
    items: testResults,
    title: 'Laborwerte & Untersuchungen',
    type: 'test-results',
    showMetadata: true,
    showTimestamp: true,
    medicalContext: true,
    onItemClick: (item) => console.log('Test result clicked:', item.title)
  },
  parameters: {
    docs: {
      description: {
        story: 'Untersuchungsergebnisse mit Laborwerten, Bildgebung und medizinischen Befunden.'
      }
    }
  }
}

// Emergency Contacts - Critical Information
export const EmergencyContacts: Story = {
  args: {
    items: emergencyContacts,
    title: 'Notfallkontakte',
    type: 'emergency-contacts',
    showMetadata: true,
    emergencyContact: {
      number: '+49 112',
      text: 'Lebensbedrohlicher Notfall?'
    },
    onItemClick: (item) => {
      if (item.value) {
        window.open(`tel:${item.value}`, '_self')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfallkontakte mit Priorisierung und direkter Anruffunktion für kritische Situationen.'
      }
    }
  }
}

// Small Size - Compact Display
export const SmallSize: Story = {
  args: {
    items: medications.slice(0, 2),
    title: 'Tägliche Medikation',
    size: 'small',
    type: 'medications',
    showTimestamp: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Listen-Darstellung für begrenzte Bereiche und mobile Ansichten.'
      }
    }
  }
}

// Large Size - Detailed Display
export const LargeSize: Story = {
  args: {
    items: medicalRecords,
    title: 'Detaillierte Patientenakte',
    size: 'large',
    type: 'medical-records',
    showMetadata: true,
    showTimestamp: true,
    showIcdCodes: true,
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Listen-Darstellung mit allen verfügbaren medizinischen Details und Metadaten.'
      }
    }
  }
}

// Loading State - Data Fetching
export const LoadingState: Story = {
  args: {
    title: 'Laden der medizinischen Daten...',
    type: 'medical-records',
    loading: true,
    items: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Datenabfrage mit Skeleton-Elementen für bessere UX.'
      }
    }
  }
}

// Empty State - No Data Available
export const EmptyState: Story = {
  args: {
    items: [],
    title: 'Medizinische Daten',
    type: 'medical-records',
    emptyMessage: 'Keine medizinischen Daten verfügbar. Kontaktieren Sie Ihren Arzt für weitere Informationen.',
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Leerzustand wenn keine medizinischen Daten verfügbar sind mit hilfreichen Hinweisen.'
      }
    }
  }
}

// Priority Levels - Critical Patient Data
export const PriorityLevels: Story = {
  args: {
    items: [
      {
        id: 'critical-1',
        title: 'Akuter Myokardinfarkt',
        subtitle: 'STEMI - ST-Hebungsinfarkt',
        value: 'Sofortige Behandlung erforderlich',
        status: 'error',
        priority: 'critical',
        specialty: 'kardiologie',
        icdCode: 'I21.0',
        timestamp: new Date(),
        clickable: true
      },
      {
        id: 'high-1',
        title: 'Hypertensive Krise',
        subtitle: 'RR 210/120 mmHg',
        value: 'Dringend behandlungsbedürftig',
        status: 'warning',
        priority: 'high',
        specialty: 'kardiologie',
        icdCode: 'I16.0',
        timestamp: new Date(),
        clickable: true
      },
      {
        id: 'medium-1',
        title: 'Diabetes mellitus',
        subtitle: 'HbA1c leicht erhöht',
        value: 'Therapieanpassung erwägen',
        status: 'warning',
        priority: 'medium',
        specialty: 'nephrologie',
        icdCode: 'E11.9',
        timestamp: new Date(),
        clickable: true
      },
      {
        id: 'low-1',
        title: 'Kontrolltermin',
        subtitle: 'Routineuntersuchung',
        value: 'Nächster Termin in 6 Monaten',
        status: 'success',
        priority: 'low',
        timestamp: new Date(),
        clickable: true
      }
    ],
    title: 'Prioritätsstufen',
    type: 'medical-records',
    showIcdCodes: true,
    showTimestamp: true,
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinische Daten mit verschiedenen Prioritätsstufen von kritisch bis niedrig.'
      }
    }
  }
}

// Specialty Colors - Multi-disciplinary Case
export const SpecialtyColors: Story = {
  args: {
    items: [
      {
        id: 'cardio',
        title: 'Herzinsuffizienz',
        subtitle: 'NYHA-Stadium II',
        specialty: 'kardiologie',
        status: 'warning',
        icdCode: 'I50.9',
        clickable: true
      },
      {
        id: 'onko',
        title: 'Tumor-Nachsorge',
        subtitle: 'Post-operative Kontrolle',
        specialty: 'onkologie',
        status: 'success',
        icdCode: 'Z08',
        clickable: true
      },
      {
        id: 'nephro',
        title: 'Chronische Niereninsuffizienz',
        subtitle: 'Stadium 3a',
        specialty: 'nephrologie',
        status: 'warning',
        icdCode: 'N18.3',
        clickable: true
      },
      {
        id: 'galle',
        title: 'Gallensteine',
        subtitle: 'Asymptomatisch',
        specialty: 'gallenblase',
        status: 'pending',
        icdCode: 'K80.2',
        clickable: true
      },
      {
        id: 'schild',
        title: 'Hypothyreose',
        subtitle: 'L-Thyroxin-pflichtig',
        specialty: 'schilddruese',
        status: 'success',
        icdCode: 'E03.9',
        clickable: true
      },
      {
        id: 'intensiv',
        title: 'Post-ICU Syndrom',
        subtitle: 'Nachbetreuung Intensivstation',
        specialty: 'intensivmedizin',
        status: 'warning',
        icdCode: 'F43.1',
        clickable: true
      }
    ],
    title: 'Multidisziplinäre Behandlung',
    type: 'medical-records',
    showIcdCodes: true,
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinische Daten aus verschiedenen Fachbereichen mit fachspezifischer Farbkodierung.'
      }
    }
  }
}

// Interactive Example - Click Handlers
export const InteractiveExample: Story = {
  args: {
    items: appointments,
    title: 'Interaktive Terminliste',
    type: 'appointments',
    showMetadata: true,
    showTimestamp: true,
    onItemClick: (item) => {
      alert(`Termin angeklickt: ${item.title}\nZeit: ${item.value}\nStatus: ${item.status}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Liste mit Click-Handlers für Navigation und Detailansichten.'
      }
    }
  }
}

// Without Icons - Text-Only Display
export const WithoutIcons: Story = {
  args: {
    items: medicalRecords,
    title: 'Textbasierte Darstellung',
    type: 'medical-records',
    showIcons: false,
    showMetadata: true,
    showIcdCodes: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Darstellung ohne Icons für fokussierte Textinformationen.'
      }
    }
  }
}

// Medical Context - Privacy Footer
export const MedicalContextPrivacy: Story = {
  args: {
    items: medicalRecords,
    title: 'Streng vertrauliche Patientenakte',
    type: 'medical-records',
    medicalContext: true,
    showMetadata: true,
    showTimestamp: true,
    showIcdCodes: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinische Liste mit Datenschutz-Footer und ärztlicher Schweigepflicht-Hinweis.'
      }
    }
  }
}