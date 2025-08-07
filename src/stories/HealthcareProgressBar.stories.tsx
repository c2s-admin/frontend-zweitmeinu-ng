import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareProgressBar, HealthcareProgressStep } from './HealthcareProgressBar'
import { Calendar, FileText, Stethoscope, Heart, CheckCircle } from 'lucide-react'
import * as React from 'react'

// Sample data for different medical processes
const appointmentSteps: HealthcareProgressStep[] = [
  {
    id: 'select-specialty',
    label: 'Fachbereich',
    description: 'Medizinischen Fachbereich auswählen',
    status: 'completed',
    icon: React.createElement(Heart, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '2 Min',
      specialty: 'kardiologie'
    }
  },
  {
    id: 'select-doctor',
    label: 'Arzt wählen',
    description: 'Verfügbaren Facharzt auswählen',
    status: 'completed',
    medicalInfo: {
      duration: '3 Min',
      professional: 'Dr. med. Schmidt'
    }
  },
  {
    id: 'select-time',
    label: 'Termin wählen',
    description: 'Verfügbare Zeit auswählen',
    status: 'current',
    icon: React.createElement(Calendar, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '5 Min'
    }
  },
  {
    id: 'confirm',
    label: 'Bestätigung',
    description: 'Termin bestätigen und buchen',
    status: 'pending',
    medicalInfo: {
      duration: '1 Min'
    }
  }
]

const treatmentSteps: HealthcareProgressStep[] = [
  {
    id: 'anamnesis',
    label: 'Anamnese',
    description: 'Medizinische Vorgeschichte erfassen',
    status: 'completed',
    icon: React.createElement(FileText, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '15 Min',
      professional: 'Dr. med. Weber',
      specialty: 'kardiologie'
    }
  },
  {
    id: 'examination',
    label: 'Untersuchung',
    description: 'Körperliche Untersuchung',
    status: 'completed',
    icon: React.createElement(Stethoscope, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '20 Min',
      professional: 'Dr. med. Weber'
    }
  },
  {
    id: 'diagnostics',
    label: 'Diagnostik',
    description: 'EKG und Blutanalyse',
    status: 'current',
    medicalInfo: {
      duration: '30 Min',
      professional: 'MFA Müller'
    }
  },
  {
    id: 'diagnosis',
    label: 'Diagnose',
    description: 'Befundbesprechung',
    status: 'pending',
    medicalInfo: {
      duration: '10 Min',
      professional: 'Dr. med. Weber'
    }
  },
  {
    id: 'therapy',
    label: 'Therapie',
    description: 'Behandlungsplan erstellen',
    status: 'pending',
    medicalInfo: {
      duration: '15 Min',
      professional: 'Dr. med. Weber'
    }
  }
]

const emergencySteps: HealthcareProgressStep[] = [
  {
    id: 'triage',
    label: 'Ersteinschätzung',
    description: 'Dringlichkeit bewerten',
    status: 'completed',
    medicalInfo: {
      duration: '< 1 Min',
      professional: 'Triage-Schwester',
      specialty: 'intensivmedizin'
    }
  },
  {
    id: 'emergency-treatment',
    label: 'Notbehandlung',
    description: 'Sofortmaßnahmen einleiten',
    status: 'current',
    medicalInfo: {
      duration: '15 Min',
      professional: 'Notarzt',
      specialty: 'intensivmedizin'
    }
  },
  {
    id: 'stabilization',
    label: 'Stabilisierung',
    description: 'Patient stabilisieren',
    status: 'pending',
    medicalInfo: {
      duration: '30 Min',
      specialty: 'intensivmedizin'
    }
  },
  {
    id: 'transfer',
    label: 'Verlegung',
    description: 'Auf Station verlegen',
    status: 'pending',
    medicalInfo: {
      duration: '10 Min'
    }
  }
]

const consentSteps: HealthcareProgressStep[] = [
  {
    id: 'information',
    label: 'Aufklärung',
    description: 'Medizinische Aufklärung',
    status: 'completed',
    medicalInfo: {
      duration: '20 Min',
      professional: 'Dr. med. Wagner'
    }
  },
  {
    id: 'consent-form',
    label: 'Einverständnis',
    description: 'Einverständniserklärung',
    status: 'current',
    icon: React.createElement(FileText, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '5 Min'
    }
  },
  {
    id: 'confirmation',
    label: 'Bestätigung',
    description: 'Rechtliche Bestätigung',
    status: 'pending',
    icon: React.createElement(CheckCircle, { className: 'healthcare-progress-step-icon' }),
    medicalInfo: {
      duration: '2 Min'
    }
  }
]

const meta: Meta<typeof HealthcareProgressBar> = {
  title: 'Healthcare/ProgressBar',
  component: HealthcareProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Progress Bar Component - Medizinische Prozessanzeige und Patientenführung

**Healthcare-Optimierungen:**
- Medizinische Prozesstypen (Termin, Behandlung, Notfall, Diagnose, Einverständnis)
- Fachbereichsspezifische Farbkodierung und Icons
- Ärztliche Zeitangaben und Personalzuordnung
- Notfall-Banner mit direkten Kontaktinformationen
- WCAG 2.1 AA konform mit Screen Reader Support
- Medizinische Schweigepflicht Indikatoren

**Medizinische Anwendungsfälle:**
- Terminbuchungsprozess mit Fachbereichsauswahl
- Behandlungsablauf mit Zeitschätzungen
- Notfallbehandlung mit Triage-Stufen
- Diagnoseverfahren und Untersuchungsschritte
- Einverständniserklärungen und Aufklärungsbögen
- Therapieverlauf und Nachsorge-Termine

**Accessibility Features:**
- Keyboard Navigation mit Schritt-Navigation
- Screen Reader Support mit detaillierten Beschreibungen
- High Contrast Mode für bessere Sichtbarkeit
- Touch-optimierte Interaktion (44px+ Targets)
- Medizinische Kontext-Informationen für Orientierung
        `
      }
    }
  },
  argTypes: {
    processType: {
      control: 'select',
      options: ['appointment', 'treatment', 'diagnosis', 'emergency', 'consent'],
      description: 'Medizinischer Prozesstyp'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Progress Bar Größe'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Ausrichtung'
    },
    currentStep: {
      control: 'number',
      description: 'Aktueller Schritt (Index)'
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Fortschritt in Prozent'
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Schritt-Nummern anzeigen'
    },
    showPercentage: {
      control: 'boolean',
      description: 'Fortschritt in Prozent anzeigen'
    },
    showTimeline: {
      control: 'boolean',
      description: 'Timeline-Info anzeigen'
    },
    animated: {
      control: 'boolean',
      description: 'Animierte Fortschrittsanzeige'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Datenschutz-Footer'
    }
  },
  args: {
    steps: appointmentSteps,
    currentStep: 2,
    processType: 'appointment',
    size: 'medium',
    orientation: 'horizontal',
    showStepNumbers: true,
    showPercentage: false,
    showTimeline: true,
    animated: true,
    medicalContext: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareProgressBar>

// Default Story - Appointment Booking Process
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Terminbuchungsprozess mit Fachbereichsauswahl und Arztwahl.'
      }
    }
  }
}

// Treatment Process - Medical Context
export const TreatmentProcess: Story = {
  args: {
    steps: treatmentSteps,
    currentStep: 2,
    processType: 'treatment',
    medicalContext: true,
    showPercentage: true,
    onStepClick: (step, index) => console.log('Step clicked:', step.label, 'at index:', index)
  },
  parameters: {
    docs: {
      description: {
        story: 'Umfassender Behandlungsprozess von Anamnese bis Therapieplan mit medizinischem Kontext.'
      }
    }
  }
}

// Emergency Process - Critical Timeline
export const EmergencyProcess: Story = {
  args: {
    steps: emergencySteps,
    currentStep: 1,
    processType: 'emergency',
    size: 'large',
    animated: true,
    emergencyContact: {
      number: '+49 112',
      text: 'Lebensbedrohlicher Notfall?'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfallbehandlung mit Emergency-Banner und kritischer Zeitschiene von Triage bis Verlegung.'
      }
    }
  }
}

// Consent Process - Legal Documentation
export const ConsentProcess: Story = {
  args: {
    steps: consentSteps,
    currentStep: 1,
    processType: 'consent',
    medicalContext: true,
    showTimeline: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Einverständniserklärungsprozess mit medizinischer Aufklärung und rechtlicher Dokumentation.'
      }
    }
  }
}

// Diagnosis Process - Complex Medical Workflow
export const DiagnosisProcess: Story = {
  args: {
    steps: [
      {
        id: 'symptoms',
        label: 'Symptome',
        description: 'Symptome erfassen',
        status: 'completed',
        medicalInfo: {
          duration: '10 Min',
          specialty: 'kardiologie'
        }
      },
      {
        id: 'tests',
        label: 'Tests',
        description: 'Laboruntersuchungen',
        status: 'completed',
        medicalInfo: {
          duration: '45 Min',
          professional: 'Labor-Team'
        }
      },
      {
        id: 'imaging',
        label: 'Bildgebung',
        description: 'CT/MRT Untersuchung',
        status: 'current',
        medicalInfo: {
          duration: '30 Min',
          professional: 'Radiologe'
        }
      },
      {
        id: 'analysis',
        label: 'Auswertung',
        description: 'Befunde analysieren',
        status: 'pending',
        medicalInfo: {
          duration: '60 Min',
          professional: 'Facharzt'
        }
      },
      {
        id: 'result',
        label: 'Ergebnis',
        description: 'Diagnose mitteilen',
        status: 'pending',
        medicalInfo: {
          duration: '15 Min',
          professional: 'Dr. med. Schmidt',
          specialty: 'kardiologie'
        }
      }
    ],
    currentStep: 2,
    processType: 'diagnosis',
    showPercentage: true,
    medicalContext: true,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Komplexer Diagnoseprozess mit Laboruntersuchungen, Bildgebung und Befundauswertung.'
      }
    }
  }
}

// Small Size - Compact Progress
export const SmallSize: Story = {
  args: {
    steps: [
      {
        id: 'step1',
        label: 'Anmeldung',
        status: 'completed'
      },
      {
        id: 'step2',
        label: 'Wartezimmer',
        status: 'current'
      },
      {
        id: 'step3',
        label: 'Behandlung',
        status: 'pending'
      }
    ],
    currentStep: 1,
    size: 'small',
    showPercentage: false,
    showTimeline: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Progress Bar für einfache Prozesse und mobile Ansichten.'
      }
    }
  }
}

// Large Size - Detailed Process
export const LargeSize: Story = {
  args: {
    steps: treatmentSteps,
    currentStep: 2,
    processType: 'treatment',
    size: 'large',
    showPercentage: true,
    showTimeline: true,
    medicalContext: true,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Progress Bar für detaillierte medizinische Prozesse mit umfassenden Informationen.'
      }
    }
  }
}

// Vertical Orientation - Space-Efficient
export const VerticalOrientation: Story = {
  args: {
    steps: appointmentSteps,
    currentStep: 2,
    orientation: 'vertical',
    showPercentage: true,
    showTimeline: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertikale Ausrichtung für platzsparende Darstellung in Seitenleisten.'
      }
    }
  }
}

// Error State - Failed Process Step
export const ErrorState: Story = {
  args: {
    steps: [
      {
        id: 'data-entry',
        label: 'Daten erfassen',
        description: 'Patientendaten eingeben',
        status: 'completed'
      },
      {
        id: 'validation',
        label: 'Validierung',
        description: 'Daten überprüfen',
        status: 'error',
        medicalInfo: {
          duration: 'Fehler'
        }
      },
      {
        id: 'confirmation',
        label: 'Bestätigung',
        description: 'Termin bestätigen',
        status: 'pending'
      }
    ],
    currentStep: 1,
    processType: 'appointment'
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Zustand bei fehlgeschlagenen Prozessschritten mit Fehlerdokumentation.'
      }
    }
  }
}

// Warning State - Attention Required
export const WarningState: Story = {
  args: {
    steps: [
      {
        id: 'preparation',
        label: 'Vorbereitung',
        description: 'OP-Vorbereitung',
        status: 'completed'
      },
      {
        id: 'consent-check',
        label: 'Einverständnis',
        description: 'Dokumente prüfen',
        status: 'warning',
        medicalInfo: {
          duration: 'Achtung',
          professional: 'Rechtsabteilung'
        }
      },
      {
        id: 'surgery',
        label: 'Operation',
        description: 'Chirurgischer Eingriff',
        status: 'pending'
      }
    ],
    currentStep: 1,
    processType: 'treatment',
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning-Zustand bei Schritten die besondere Aufmerksamkeit erfordern.'
      }
    }
  }
}

// Custom Progress Percentage
export const CustomProgressPercentage: Story = {
  args: {
    steps: treatmentSteps,
    progress: 75,
    currentStep: 3,
    processType: 'treatment',
    showPercentage: true,
    animated: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Benutzerdefinierte Fortschrittsanzeige unabhängig vom aktuellen Schritt.'
      }
    }
  }
}

// Interactive Steps - Clickable Navigation
export const InteractiveSteps: Story = {
  args: {
    steps: appointmentSteps.map(step => ({
      ...step,
      onClick: () => console.log(`Clicked on step: ${step.label}`)
    })),
    currentStep: 2,
    processType: 'appointment',
    showTimeline: true,
    onStepClick: (step, index) => {
      console.log(`Global handler: Step ${step.label} at index ${index}`)
      // Here you could implement navigation logic
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Schritte mit Click-Handlers für Navigation zwischen Prozessschritten.'
      }
    }
  }
}

// Multi-Specialty Process - Complex Medical Case
export const MultiSpecialtyProcess: Story = {
  args: {
    steps: [
      {
        id: 'cardio-consult',
        label: 'Kardiologie',
        description: 'Herz-Untersuchung',
        status: 'completed',
        medicalInfo: {
          duration: '45 Min',
          professional: 'Dr. med. Schmidt',
          specialty: 'kardiologie'
        }
      },
      {
        id: 'nephro-consult',
        label: 'Nephrologie',
        description: 'Nieren-Check',
        status: 'completed',
        medicalInfo: {
          duration: '30 Min',
          professional: 'Dr. med. Weber',
          specialty: 'nephrologie'
        }
      },
      {
        id: 'onko-consult',
        label: 'Onkologie',
        description: 'Tumor-Screening',
        status: 'current',
        medicalInfo: {
          duration: '60 Min',
          professional: 'Prof. Dr. Müller',
          specialty: 'onkologie'
        }
      },
      {
        id: 'case-review',
        label: 'Fallkonferenz',
        description: 'Interdisziplinäre Besprechung',
        status: 'pending',
        medicalInfo: {
          duration: '90 Min',
          professional: 'Ärzteteam'
        }
      },
      {
        id: 'treatment-plan',
        label: 'Therapieplan',
        description: 'Behandlung festlegen',
        status: 'pending',
        medicalInfo: {
          duration: '30 Min',
          professional: 'Leitender Arzt'
        }
      }
    ],
    currentStep: 2,
    processType: 'treatment',
    size: 'large',
    medicalContext: true,
    showPercentage: true,
    showTimeline: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Komplexer multidisziplinärer Behandlungsprozess mit verschiedenen Fachbereichen.'
      }
    }
  }
}