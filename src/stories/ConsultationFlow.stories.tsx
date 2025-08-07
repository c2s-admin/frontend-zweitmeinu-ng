import type { Meta, StoryObj } from '@storybook/react'
import { ConsultationFlow, ConsultationStep, ConsultationData } from './ConsultationFlow'
import { Heart, User, FileText, Clock, Shield, Check, Calendar, Phone } from 'lucide-react'

// Sample consultation data
const sampleData: ConsultationData = {
  personalInfo: {
    name: 'Max Mustermann',
    email: 'max.mustermann@email.com',
    phone: '+49 123 456789',
    age: 45,
    gender: 'male'
  },
  medicalConcern: {
    specialty: 'kardiologie',
    symptoms: 'Brustschmerzen und Kurzatmigkeit seit 3 Tagen',
    urgency: 'urgent',
    duration: '3 Tage',
    previousTreatment: false
  },
  medicalHistory: {
    conditions: ['Bluthochdruck', 'Diabetes Typ 2'],
    medications: ['Metformin 1000mg', 'Ramipril 5mg'],
    allergies: ['Penicillin'],
    surgeries: ['Appendektomie (2010)']
  },
  consent: {
    medicalAdvice: true,
    dataProcessing: true,
    communication: true,
    gdprConsent: true
  }
}

// Emergency consultation steps
const emergencySteps: ConsultationStep[] = [
  {
    id: 'emergency-triage',
    title: 'Notfall-Einschätzung',
    description: 'Bewertung der Dringlichkeit Ihres medizinischen Anliegens',
    required: true,
    estimatedTime: '1 Min'
  },
  {
    id: 'contact-info',
    title: 'Kontaktdaten',
    description: 'Ihre Kontaktdaten für die sofortige Rückmeldung',
    required: true,
    estimatedTime: '2 Min'
  },
  {
    id: 'symptoms',
    title: 'Symptome',
    description: 'Beschreibung Ihrer aktuellen Beschwerden',
    required: true,
    estimatedTime: '3 Min'
  },
  {
    id: 'emergency-summary',
    title: 'Notfall-Zusammenfassung',
    description: 'Überprüfung vor der prioritären Bearbeitung',
    required: true,
    estimatedTime: '1 Min'
  }
]

const meta: Meta<typeof ConsultationFlow> = {
  title: 'Healthcare/ConsultationFlow',
  component: ConsultationFlow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Consultation Flow Component - Mehrstufiger medizinischer Beratungsprozess für zweitmeinung.ng

**Healthcare-Optimierungen:**
- 7-stufiger Beratungsprozess von Begrüßung bis Zusammenfassung
- Echtzeit-Validierung und Fortschrittsanzeige
- DSGVO-konforme Einverständniserklärungen
- Notfall-Modus für kritische medizinische Situationen
- Automatische Speicherung des Fortschritts
- WCAG 2.1 AA konform mit Screen Reader Support

**Consultation Schritte:**
1. Willkommen - Informationen über den Beratungsprozess
2. Persönliche Angaben - Kontaktdaten mit Datenschutz
3. Medizinisches Anliegen - Symptombeschreibung und Dringlichkeit
4. Krankengeschichte - Vorerkrankungen und Medikamente
5. Medizinische Unterlagen - Datei-Upload für Befunde
6. Einverständniserklärung - DSGVO und medizinische Beratung
7. Zusammenfassung - Finale Überprüfung vor Absendung

**Anwendungsfälle:**
- Zweitmeinungsanfragen mit strukturiertem Ablauf
- Erstberatungen für neue Patienten
- Notfall-Triagierung mit verkürztem Prozess
- Spezialisierte Beratungen nach Fachbereichen
- Follow-up Konsultationen mit vorhandenen Daten

**Accessibility Features:**
- Keyboard Navigation durch alle Schritte
- Screen Reader Support für komplexe medizinische Formulare
- Progress Indicators mit ARIA-Unterstützung
- Touch-optimiert für mobile Healthcare-Nutzer
- High Contrast Mode für bessere Lesbarkeit
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'mobile', 'emergency'],
      description: 'Flow-Variante für verschiedene Anwendungsfälle'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    currentStep: {
      control: { type: 'range', min: 0, max: 6, step: 1 },
      description: 'Aktueller Schritt (0-6)'
    },
    showProgress: {
      control: 'boolean',
      description: 'Fortschrittsanzeige anzeigen'
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Schrittnummern anzeigen'
    },
    showEstimatedTime: {
      control: 'boolean',
      description: 'Geschätzte Zeit anzeigen'
    },
    allowSkipping: {
      control: 'boolean',
      description: 'Schritte überspringen erlauben'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus aktivieren'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Datenschutz-Footer'
    },
    autoSave: {
      control: 'boolean',
      description: 'Automatische Speicherung aktivieren'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'default',
    size: 'medium',
    currentStep: 0,
    data: {},
    showProgress: true,
    showStepNumbers: true,
    showEstimatedTime: true,
    allowSkipping: false,
    emergencyMode: false,
    medicalContext: true,
    autoSave: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ConsultationFlow>

// Default Story - Standard Consultation Process
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard 7-stufiger medizinischer Beratungsprozess für zweitmeinung.ng Konsultationen.'
      }
    }
  }
}

// Emergency Mode - Critical Medical Consultation
export const EmergencyMode: Story = {
  args: {
    steps: emergencySteps,
    variant: 'emergency',
    emergencyMode: true,
    currentStep: 0,
    onEmergencyContact: () => {
      alert('Notfall-Kontakt: 112 wird gewählt')
    },
    onStepChange: (stepIndex, data) => {
      console.log(`Emergency step ${stepIndex}:`, data)
    },
    onComplete: (data) => {
      alert('Notfall-Anfrage wurde prioritär übermittelt!')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Verkürzter Notfall-Beratungsprozess für kritische medizinische Situationen mit direktem Notfall-Kontakt.'
      }
    }
  }
}

// Step 2 - Personal Information
export const PersonalInformationStep: Story = {
  args: {
    currentStep: 1,
    data: {
      personalInfo: {
        name: 'Maria Müller',
        email: 'maria.mueller@email.com'
      }
    },
    onDataChange: (data) => {
      console.log('Personal data updated:', data.personalInfo)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Schritt 2: Erfassung der persönlichen Kontaktdaten mit DSGVO-Hinweisen.'
      }
    }
  }
}

// Step 3 - Medical Concern
export const MedicalConcernStep: Story = {
  args: {
    currentStep: 2,
    data: {
      medicalConcern: {
        specialty: 'kardiologie',
        symptoms: 'Herzschmerzen und Atemnot'
      }
    },
    onDataChange: (data) => {
      console.log('Medical concern updated:', data.medicalConcern)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Schritt 3: Beschreibung des medizinischen Anliegens mit Symptomen und Dringlichkeit.'
      }
    }
  }
}

// Step 6 - Consent
export const ConsentStep: Story = {
  args: {
    currentStep: 5,
    data: {
      consent: {
        medicalAdvice: true,
        gdprConsent: false
      }
    },
    onDataChange: (data) => {
      console.log('Consent updated:', data.consent)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Schritt 6: DSGVO-Einverständniserklärung und Zustimmung zur medizinischen Beratung.'
      }
    }
  }
}

// Final Step - Summary
export const SummaryStep: Story = {
  args: {
    currentStep: 6,
    data: sampleData,
    onComplete: (data) => {
      alert(`Beratungsanfrage abgesendet für: ${data.personalInfo?.name}\nAnliegen: ${data.medicalConcern?.symptoms}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Schritt 7: Zusammenfassung aller Angaben vor der finalen Übermittlung der Beratungsanfrage.'
      }
    }
  }
}

// Compact Variant - Space Efficient
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    showEstimatedTime: false,
    currentStep: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für eingebettete Bereiche oder mobile Ansichten.'
      }
    }
  }
}

// Mobile Variant - Touch Optimized
export const MobileVariant: Story = {
  args: {
    variant: 'mobile',
    size: 'medium',
    currentStep: 2,
    showStepNumbers: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung für Touch-Bedienung und kleine Bildschirme.'
      }
    }
  }
}

// With Validation Errors - Form Validation
export const WithValidationErrors: Story = {
  args: {
    currentStep: 1,
    onValidateStep: (stepIndex, data) => {
      if (stepIndex === 1) {
        const personalInfo = data.personalInfo || {}
        if (!personalInfo.name) {
          return 'Name ist erforderlich für die medizinische Beratung.'
        }
        if (!personalInfo.email || !personalInfo.email.includes('@')) {
          return 'Gültige E-Mail-Adresse ist erforderlich.'
        }
      }
      return true
    },
    data: {
      personalInfo: {
        name: '',
        email: 'invalid-email'
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Darstellung von Validierungsfehlern mit medizinischen Kontext-Meldungen.'
      }
    }
  }
}

// Skip-able Steps - Flexible Process
export const SkipableSteps: Story = {
  args: {
    allowSkipping: true,
    currentStep: 3,
    showEstimatedTime: true,
    onStepChange: (stepIndex, data) => {
      console.log(`Navigated to step ${stepIndex + 1}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Flexibler Prozess mit der Möglichkeit, optionale Schritte zu überspringen.'
      }
    }
  }
}

// Loading State - Data Processing
export const LoadingState: Story = {
  args: {
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Datenverarbeitung mit Skeleton-Elementen.'
      }
    }
  }
}

// Large Size - Desktop Experience
export const LargeSize: Story = {
  args: {
    size: 'large',
    variant: 'default',
    currentStep: 2,
    data: sampleData,
    showEstimatedTime: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Darstellung für Desktop-Anwendungen mit maximaler Information.'
      }
    }
  }
}

// Without Progress Indicator - Minimal UI
export const WithoutProgress: Story = {
  args: {
    showProgress: false,
    currentStep: 1,
    variant: 'compact'
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimale Benutzeroberfläche ohne Fortschrittsanzeige für fokussierte Eingabe.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    currentStep: 0,
    data: {},
    showProgress: true,
    showStepNumbers: true,
    showEstimatedTime: true,
    allowSkipping: false,
    autoSave: true,
    onStepChange: (stepIndex, data) => {
      console.log(`Step changed to ${stepIndex + 1}:`, data)
    },
    onDataChange: (data) => {
      console.log('Data updated:', data)
    },
    onValidateStep: (stepIndex, data) => {
      // Basic validation examples
      switch (stepIndex) {
        case 1: // Personal Info
          const personalInfo = data.personalInfo || {}
          if (!personalInfo.name) return 'Name ist erforderlich.'
          if (!personalInfo.email?.includes('@')) return 'Gültige E-Mail erforderlich.'
          break
        case 2: // Medical Concern
          const concern = data.medicalConcern || {}
          if (!concern.symptoms) return 'Bitte beschreiben Sie Ihre Symptome.'
          break
        case 5: // Consent
          const consent = data.consent || {}
          if (!consent.medicalAdvice || !consent.gdprConsent) {
            return 'Beide Einverständniserklärungen sind erforderlich.'
          }
          break
      }
      return true
    },
    onComplete: (data) => {
      alert(`🎉 Beratungsanfrage erfolgreich übermittelt!\n\nPatient: ${data.personalInfo?.name}\nE-Mail: ${data.personalInfo?.email}\nAnliegen: ${data.medicalConcern?.symptoms}\n\nSie erhalten innerhalb von 24-48 Stunden eine erste medizinische Einschätzung.`)
    },
    onCancel: () => {
      if (confirm('Möchten Sie den Beratungsprozess wirklich abbrechen?')) {
        alert('Beratungsprozess abgebrochen.')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktiver Beratungsprozess mit allen Event-Handlers und Validierungen für die Anwendungsintegration.'
      }
    }
  }
}

// Auto-Save Demo - Progress Preservation
export const AutoSaveDemo: Story = {
  args: {
    autoSave: true,
    currentStep: 1,
    data: {
      personalInfo: {
        name: 'Gespeicherter Name',
        email: 'autosave@example.com'
      }
    },
    onDataChange: (data) => {
      console.log('🔄 Auto-saving data:', data)
      // Simulate auto-save notification
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #10b981; color: white; 
        padding: 8px 16px; border-radius: 8px; 
        font-size: 14px; z-index: 1000;
      `
      notification.textContent = '✓ Automatisch gespeichert'
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 2000)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration der automatischen Speicherfunktion mit visueller Bestätigung.'
      }
    }
  }
}

// Medical Context Footer - Privacy Compliance
export const MedicalContextFooter: Story = {
  args: {
    medicalContext: true,
    currentStep: 1,
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Beratungsprozess mit medizinischem Kontext-Footer und Datenschutz-Hinweisen.'
      }
    }
  }
}