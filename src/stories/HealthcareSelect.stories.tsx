import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareSelect, HealthcareSelectOption } from './HealthcareSelect'
import * as React from 'react'

const medicalSpecialties: HealthcareSelectOption[] = [
  {
    value: 'kardiologie',
    label: 'Kardiologie',
    description: 'Herz- und Kreislauferkrankungen',
    specialty: 'kardiologie'
  },
  {
    value: 'onkologie',
    label: 'Onkologie',
    description: 'Krebserkrankungen und Tumore',
    specialty: 'onkologie'
  },
  {
    value: 'gallenblase',
    label: 'Gallenblase',
    description: 'Gallenblasen- und Gallenwegerkrankungen',
    specialty: 'gallenblase'
  },
  {
    value: 'nephrologie',
    label: 'Nephrologie',
    description: 'Nierenerkrankungen',
    specialty: 'nephrologie'
  },
  {
    value: 'schilddruese',
    label: 'Schilddrüse',
    description: 'Schilddrüsen- und Stoffwechselerkrankungen',
    specialty: 'schilddruese'
  },
  {
    value: 'intensivmedizin',
    label: 'Intensivmedizin',
    description: 'Intensivpflege und Notfallmedizin',
    specialty: 'intensivmedizin'
  },
  {
    value: 'allgemeine-fragen',
    label: 'Allgemeine Fragen',
    description: 'Allgemeine medizinische Beratung'
  }
]

const doctors: HealthcareSelectOption[] = [
  {
    value: 'dr-schmidt',
    label: 'Dr. med. Maria Schmidt',
    description: 'Fachärztin für Kardiologie - 15 Jahre Erfahrung'
  },
  {
    value: 'dr-mueller',
    label: 'Dr. med. Thomas Müller',
    description: 'Facharzt für Onkologie - 20 Jahre Erfahrung'
  },
  {
    value: 'dr-weber',
    label: 'Dr. med. Anna Weber',
    description: 'Fachärztin für Nephrologie - 12 Jahre Erfahrung'
  },
  {
    value: 'dr-wagner',
    label: 'Prof. Dr. Klaus Wagner',
    description: 'Facharzt für Intensivmedizin - 25 Jahre Erfahrung'
  }
]

const appointmentTimes: HealthcareSelectOption[] = [
  { value: '08:00', label: '08:00 Uhr', description: 'Früher Termin' },
  { value: '10:00', label: '10:00 Uhr', description: 'Vormittag' },
  { value: '14:00', label: '14:00 Uhr', description: 'Nachmittag' },
  { value: '16:00', label: '16:00 Uhr', description: 'Später Nachmittag' },
  { value: '18:00', label: '18:00 Uhr', description: 'Abendtermin' }
]

const meta: Meta<typeof HealthcareSelect> = {
  title: 'Healthcare/Select',
  component: HealthcareSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Select Component - Dropdown-Auswahl für medizinische Formulare

**Healthcare-Optimierungen:**
- Medizinische Fachbereichsauswahl mit Farbkodierung
- Suchfunktion für große Optionslisten
- Multiple Selection für komplexe medizinische Fälle
- 56px Touch-Targets für Healthcare-Nutzer
- WCAG 2.1 AA konform mit vollständiger Keyboard-Navigation
- Screen Reader optimiert mit ARIA Labels

**Medizinische Anwendungsfälle:**
- Fachbereichsauswahl (Kardiologie, Onkologie, etc.)
- Ärzteverzeichnis und Terminbuchung
- Symptom- und Diagnoseauswahl
- Behandlungsarten und Therapieoptionen
- Medikamentenauswahl und Dosierung

**Accessibility Features:**
- Vollständige Keyboard-Navigation (Arrow Keys, Enter, Escape)
- Screen Reader Support mit role="combobox" und "listbox"
- Focus Management mit visuellen Indikatoren
- High Contrast & Reduced Motion Support
        `
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Select Label'
    },
    multiple: {
      control: 'boolean',
      description: 'Multiple Selection ermöglichen'
    },
    searchable: {
      control: 'boolean',
      description: 'Suchfunktion aktivieren'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Select-Größe'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit spezieller Styling'
    },
    clearable: {
      control: 'boolean',
      description: 'Clear-Button anzeigen'
    },
    disabled: {
      control: 'boolean',
      description: 'Deaktiviert'
    },
    required: {
      control: 'boolean',
      description: 'Pflichtfeld'
    },
    error: {
      control: 'text',
      description: 'Fehlermeldung'
    },
    success: {
      control: 'text',
      description: 'Erfolgsmeldung'
    }
  },
  args: {
    label: 'Medizinischer Fachbereich',
    options: medicalSpecialties,
    placeholder: 'Fachbereich auswählen...',
    size: 'medium',
    fullWidth: true,
    searchable: true,
    clearable: true
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareSelect>

// Default Story - Medical Specialty Selection
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Fachbereichsauswahl mit Suchfunktion und medizinischer Farbkodierung.'
      }
    }
  }
}

// Medical Context - Patient Form
export const MedicalContext: Story = {
  args: {
    label: 'Betroffener Fachbereich',
    medicalContext: true,
    required: true,
    helpText: 'Wählen Sie den Fachbereich aus, der Ihr medizinisches Anliegen am besten beschreibt.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Select im medizinischen Kontext mit Datenschutz-Styling und Hilftext.'
      }
    }
  }
}

// Multiple Selection - Complex Medical Cases
export const MultipleSelection: Story = {
  args: {
    label: 'Betroffene Fachbereiche',
    multiple: true,
    defaultValue: ['kardiologie', 'nephrologie'],
    helpText: 'Bei komplexen Fällen können mehrere Fachbereiche ausgewählt werden.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple Selection für komplexe medizinische Fälle mit mehreren betroffenen Fachbereichen.'
      }
    }
  }
}

// Doctor Selection - Appointment Booking
export const DoctorSelection: Story = {
  args: {
    label: 'Arzt auswählen',
    options: doctors,
    placeholder: 'Verfügbare Ärzte...',
    searchable: true,
    helpText: 'Alle Ärzte sind zertifizierte Fachärzte mit langjähriger Erfahrung.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Arztauswahl für Terminbuchung mit Qualifikationen und Erfahrungsangaben.'
      }
    }
  }
}

// Appointment Time Selection
export const AppointmentTimes: Story = {
  args: {
    label: 'Terminzeit',
    options: appointmentTimes,
    placeholder: 'Wunschzeit auswählen...',
    size: 'large',
    helpText: 'Sprechzeiten: Montag bis Freitag 8:00 - 18:00 Uhr'
  },
  parameters: {
    docs: {
      description: {
        story: 'Terminzeitauswahl mit verfügbaren Sprechstunden und Beschreibungen.'
      }
    }
  }
}

// Error State - Invalid Selection
export const ErrorState: Story = {
  args: {
    label: 'Fachbereich',
    value: 'invalid',
    error: 'Bitte wählen Sie einen gültigen medizinischen Fachbereich aus.',
    required: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Zustand bei ungültiger oder fehlender Auswahl mit medizinischem Kontext.'
      }
    }
  }
}

// Success State - Selection Validated
export const SuccessState: Story = {
  args: {
    label: 'Fachbereich',
    value: 'kardiologie',
    success: 'Fachbereich erfolgreich ausgewählt. Passende Ärzte werden geladen...',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Success-Zustand nach erfolgreicher Auswahl und Validierung.'
      }
    }
  }
}

// Small Size - Compact Forms
export const SmallSize: Story = {
  args: {
    label: 'Priorität',
    size: 'small',
    options: [
      { value: 'routine', label: 'Routine', description: 'Standard-Bearbeitung' },
      { value: 'urgent', label: 'Dringend', description: 'Priorisierte Bearbeitung' },
      { value: 'emergency', label: 'Notfall', description: 'Sofortige Bearbeitung' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Select-Variante für Sidebar-Bereiche und mobile Ansichten.'
      }
    }
  }
}

// Large Size - Primary Form Elements
export const LargeSize: Story = {
  args: {
    label: 'Hauptdiagnose',
    size: 'large',
    medicalContext: true,
    options: medicalSpecialties,
    searchable: true,
    required: true,
    helpText: 'Die Hauptdiagnose bestimmt die weitere Behandlung und den zuständigen Facharzt.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Select-Variante für wichtige Hauptformular-Elemente mit medizinischem Fokus.'
      }
    }
  }
}

// Disabled State - Read-only Information
export const DisabledState: Story = {
  args: {
    label: 'Zugewiesener Fachbereich',
    value: 'kardiologie',
    disabled: true,
    helpText: 'Wurde automatisch basierend auf Ihrer Anfrage zugewiesen.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Deaktivierter Zustand für bereits zugewiesene oder schreibgeschützte Auswahlen.'
      }
    }
  }
}

// Searchable without Results - Empty State
export const SearchableNoResults: Story = {
  args: {
    label: 'Seltene Erkrankungen',
    options: [],
    searchable: true,
    placeholder: 'Nach seltenen Erkrankungen suchen...',
    helpText: 'Geben Sie Suchbegriffe ein, um passende seltene Erkrankungen zu finden.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Searchable Select ohne Ergebnisse für dynamische Inhalte und seltene medizinische Fälle.'
      }
    }
  }
}

// Interactive Demo - All Features
export const InteractiveDemo: Story = {
  args: {
    label: 'Vollständige Funktionen',
    options: medicalSpecialties,
    multiple: true,
    searchable: true,
    clearable: true,
    medicalContext: true,
    helpText: 'Testen Sie alle Funktionen: Suchen, Multiple Selection, Clear Button, Keyboard Navigation.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Demo mit allen verfügbaren Features zum Testen der vollständigen Funktionalität.'
      }
    }
  }
}