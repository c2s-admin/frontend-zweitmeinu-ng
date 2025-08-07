import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareInput } from './HealthcareInput'
import { User, Mail, Phone, Calendar, Clock, Shield } from 'lucide-react'
import React from 'react'

const meta: Meta<typeof HealthcareInput> = {
  title: 'Healthcare/Input',
  component: HealthcareInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Input Component - Formular-Eingabefelder für Patientendaten

**Healthcare-Optimierungen:**
- 56px Touch-Targets für gestresste medizinische Nutzer
- Medizinische Datenschutz-Indikatoren mit Schweigepflicht
- Password Toggle für sichere Authentifizierung
- Umfassende Fehlerstatus für medizinische Validierung
- WCAG 2.1 AA konform mit 4.5:1 Kontrast-Verhältnis
- Screen Reader optimiert mit ARIA Labels

**Medizinische Kontexte:**
- Patientendaten (Name, Alter, Kontakt)
- Medizinische Historie und Symptome
- Sichere Kommunikation (verschlüsselt)
- Notfall-Kontaktinformationen

**Accessibility Features:**
- Semantic HTML mit Labels und ARIA
- Keyboard Navigation vollständig unterstützt
- Error/Success States mit role="alert"/"status"
- High Contrast & Reduced Motion Support
        `
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Eingabefeld Label'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'number', 'date', 'time'],
      description: 'Input-Typ'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Eingabefeld-Größe'
    },
    required: {
      control: 'boolean',
      description: 'Pflichtfeld'
    },
    disabled: {
      control: 'boolean',
      description: 'Deaktiviert'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext (zeigt Schweigepflicht-Indikator)'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Volle Breite'
    },
    error: {
      control: 'text',
      description: 'Fehlermeldung'
    },
    success: {
      control: 'text',
      description: 'Erfolgsmeldung'
    },
    helpText: {
      control: 'text',
      description: 'Hilfetext'
    }
  },
  args: {
    label: 'Patientenname',
    placeholder: 'Vor- und Nachname eingeben',
    size: 'medium',
    fullWidth: true
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareInput>

// Default Story - Patient Name Input
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Eingabefeld für Patientendaten mit Healthcare-optimierter Größe und Styling.'
      }
    }
  }
}

// Medical Context - Patient Data with Privacy
export const MedicalContext: Story = {
  args: {
    label: 'Medizinische Beschwerden',
    placeholder: 'Beschreiben Sie Ihre Symptome...',
    medicalContext: true,
    required: true,
    helpText: 'Diese Informationen helfen unserem Fachpersonal bei der Diagnose.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Eingabefeld für medizinische Daten mit Schweigepflicht-Indikator und Datenschutz-Notice.'
      }
    }
  }
}

// Email Input - Patient Contact
export const EmailInput: Story = {
  args: {
    label: 'E-Mail-Adresse',
    type: 'email',
    placeholder: 'ihre.email@beispiel.de',
    leftIcon: React.createElement(Mail, { size: 20 }),
    required: true,
    helpText: 'Für wichtige Mitteilungen und Terminbestätigungen'
  },
  parameters: {
    docs: {
      description: {
        story: 'E-Mail-Eingabe mit Icon und Validierung für Patienten-Kontaktdaten.'
      }
    }
  }
}

// Password Input - Secure Healthcare Access
export const PasswordInput: Story = {
  args: {
    label: 'Sicheres Passwort',
    type: 'password',
    placeholder: 'Mindestens 8 Zeichen',
    required: true,
    showPasswordToggle: true,
    helpText: 'Passwort wird verschlüsselt gespeichert und ist DSGVO-konform'
  },
  parameters: {
    docs: {
      description: {
        story: 'Passwort-Eingabe mit Toggle-Funktion für sichere Healthcare-Authentifizierung.'
      }
    }
  }
}

// Phone Input - Emergency Contact
export const PhoneInput: Story = {
  args: {
    label: 'Notfall-Kontakt',
    type: 'tel',
    placeholder: '+49 123 456 789',
    leftIcon: React.createElement(Phone, { size: 20 }),
    required: true,
    medicalContext: true,
    helpText: 'Kontaktperson für medizinische Notfälle'
  },
  parameters: {
    docs: {
      description: {
        story: 'Telefon-Eingabe für Notfall-Kontakte mit medizinischem Kontext.'
      }
    }
  }
}

// Date Input - Appointment Scheduling
export const DateInput: Story = {
  args: {
    label: 'Wunschtermin',
    type: 'date',
    leftIcon: React.createElement(Calendar, { size: 20 }),
    helpText: 'Verfügbare Termine werden nach der Anfrage angezeigt'
  },
  parameters: {
    docs: {
      description: {
        story: 'Datum-Eingabe für medizinische Terminplanung mit Calendar-Icon.'
      }
    }
  }
}

// Error State - Invalid Medical Data
export const ErrorState: Story = {
  args: {
    label: 'Geburtsdatum',
    type: 'date',
    value: '1800-01-01',
    error: 'Geburtsdatum liegt zu weit in der Vergangenheit. Bitte überprüfen Sie Ihre Eingabe.',
    leftIcon: React.createElement(Calendar, { size: 20 }),
    required: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Zustand mit medizinischer Validierungslogik und klarer Fehlermeldung.'
      }
    }
  }
}

// Success State - Data Validated
export const SuccessState: Story = {
  args: {
    label: 'Versicherungsnummer',
    value: 'A123456789',
    success: 'Versicherungsdaten erfolgreich validiert',
    leftIcon: React.createElement(Shield, { size: 20 }),
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Success-Zustand nach erfolgreicher Validierung medizinischer Daten.'
      }
    }
  }
}

// Small Size - Mobile Optimized
export const SmallSize: Story = {
  args: {
    label: 'Alter',
    type: 'number',
    placeholder: '18',
    size: 'small',
    helpText: 'Jahre'
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Eingabe für mobile Ansichten und Seitenleisten.'
      }
    }
  }
}

// Large Size - Primary Information
export const LargeSize: Story = {
  args: {
    label: 'Hauptsymptome',
    placeholder: 'Beschreiben Sie Ihre Beschwerden ausführlich...',
    size: 'large',
    medicalContext: true,
    required: true,
    helpText: 'Je detaillierter Ihre Beschreibung, desto besser können wir Ihnen helfen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Eingabe für wichtige medizinische Informationen und ausführliche Beschreibungen.'
      }
    }
  }
}

// Disabled State - Read-only Information
export const DisabledState: Story = {
  args: {
    label: 'Patienten-ID',
    value: 'PAT-2024-001337',
    disabled: true,
    leftIcon: React.createElement(User, { size: 20 }),
    helpText: 'Wird automatisch vom System vergeben'
  },
  parameters: {
    docs: {
      description: {
        story: 'Deaktiviertes Eingabefeld für schreibgeschützte Patienteninformationen.'
      }
    }
  }
}

// Loading/Processing State
export const LoadingState: Story = {
  args: {
    label: 'Versicherungsstatus',
    placeholder: 'Wird überprüft...',
    disabled: true,
    helpText: 'Versicherungsdaten werden validiert...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading-Zustand während medizinische Daten verarbeitet werden.'
      }
    }
  }
}

// Time Input - Appointment Time
export const TimeInput: Story = {
  args: {
    label: 'Bevorzugte Uhrzeit',
    type: 'time',
    leftIcon: React.createElement(Clock, { size: 20 }),
    helpText: 'Sprechzeiten: Mo-Fr 8:00-18:00 Uhr'
  },
  parameters: {
    docs: {
      description: {
        story: 'Zeit-Eingabe für Terminwünsche mit Sprechzeiten-Information.'
      }
    }
  }
}