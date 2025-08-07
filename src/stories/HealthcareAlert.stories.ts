import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareAlert } from './HealthcareAlert'
import { Heart, Clock, Shield } from 'lucide-react'
import React from 'react'

const meta: Meta<typeof HealthcareAlert> = {
  title: 'Healthcare/Alert',
  component: HealthcareAlert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Alert Component - Medizinische Benachrichtigungen und Status-Meldungen

**Healthcare-Optimierungen:**
- Notfall-Alerts mit direktem Telefon-Kontakt
- Medizinische Status-Meldungen (Behandlung, Termine, Diagnose)
- WCAG 2.1 AA konform mit role="alert"/"status" für Screen Reader
- 56px Touch-Targets für Healthcare-Nutzer
- Pulse-Animation für Notfälle (Reduced Motion Support)
- Hochkontrast-Modus für Sehbeeinträchtigte

**Medizinische Anwendungsfälle:**
- Behandlungserfolg und Diagnose-Updates
- Termine und Sprechstunden-Benachrichtigungen
- Notfall-Alerts mit sofortigem Kontakt
- Datenschutz und Einverständnis-Hinweise
- Medikamenten- und Therapie-Erinnerungen

**Accessibility Features:**
- ARIA live regions für dynamische Updates
- Semantic HTML für Kontext
- Keyboard Navigation für alle Aktionen
        `
      }
    }
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Alert-Nachricht'
    },
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'emergency'],
      description: 'Alert-Typ'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Alert-Größe'
    },
    closable: {
      control: 'boolean',
      description: 'Schließbar'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext (spezielle Styling)'
    },
    emergencyNumber: {
      control: 'text',
      description: 'Notfall-Telefonnummer'
    },
    title: {
      control: 'text',
      description: 'Alert-Titel'
    }
  },
  args: {
    message: 'Ihre medizinische Anfrage wurde erfolgreich übermittelt und wird innerhalb von 48 Stunden bearbeitet.',
    type: 'success',
    size: 'medium'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareAlert>

// Default Story - Treatment Success
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Erfolgs-Alert für medizinische Prozesse wie Antragsstellung oder Terminbuchung.'
      }
    }
  }
}

// Emergency Alert - Critical Medical Situation  
export const Emergency: Story = {
  args: {
    title: 'Medizinischer Notfall',
    message: 'Bei lebensbedrohlichen Situationen kontaktieren Sie sofort den Rettungsdienst!',
    type: 'emergency',
    emergencyNumber: '+49 112'
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Alert mit Pulse-Animation und direktem Notruf-Kontakt für kritische medizinische Situationen.'
      }
    }
  }
}

// Medical Success - Diagnosis Complete
export const MedicalSuccess: Story = {
  args: {
    title: 'Diagnose abgeschlossen',
    message: 'Ihre kardiologische Untersuchung ist abgeschlossen. Die Ergebnisse zeigen keine Auffälligkeiten.',
    type: 'success',
    medicalContext: true,
    customIcon: React.createElement(Heart, { size: 24 }),
    actionText: 'Befund herunterladen',
    closable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Erfolgs-Alert für abgeschlossene medizinische Diagnosen mit Custom-Icon und Download-Aktion.'
      }
    }
  }
}

// Error Alert - Medical Data Issue
export const Error: Story = {
  args: {
    title: 'Übertragungsfehler',
    message: 'Ihre medizinischen Daten konnten nicht übertragen werden. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.',
    type: 'error',
    actionText: 'Erneut versuchen',
    closable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Alert für fehlgeschlagene medizinische Datenübertragung mit Retry-Aktion.'
      }
    }
  }
}

// Warning Alert - Appointment Reminder
export const Warning: Story = {
  args: {
    title: 'Terminerinnerung',
    message: 'Ihr Termin zur kardiologischen Untersuchung ist morgen um 14:30 Uhr. Bringen Sie bitte Ihren Versicherungsausweis mit.',
    type: 'warning',
    customIcon: React.createElement(Clock, { size: 24 }),
    actionText: 'Termin bestätigen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning-Alert für wichtige medizinische Termine und Erinnerungen.'
      }
    }
  }
}

// Info Alert - Privacy Notice
export const Info: Story = {
  args: {
    title: 'Datenschutzhinweis',
    message: 'Alle medizinischen Daten werden nach DSGVO-Standards verschlüsselt gespeichert und unterliegen der ärztlichen Schweigepflicht.',
    type: 'info',
    medicalContext: true,
    customIcon: React.createElement(Shield, { size: 24 }),
    closable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Info-Alert für Datenschutz und Compliance-Hinweise im medizinischen Kontext.'
      }
    }
  }
}

// Small Size - Compact Notification
export const SmallSize: Story = {
  args: {
    message: 'Neue Nachricht von Dr. Schmidt',
    type: 'info',
    size: 'small',
    closable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Alert-Variante für Sidebar-Benachrichtigungen und Mobile-Ansichten.'
      }
    }
  }
}

// Large Size - Important Medical Information
export const LargeSize: Story = {
  args: {
    title: 'Wichtige medizinische Information',
    message: 'Aufgrund neuer medizinischer Erkenntnisse empfehlen wir eine Nachuntersuchung. Diese ist kostenfrei und dauert ca. 30 Minuten. Vereinbaren Sie bitte zeitnah einen Termin.',
    type: 'warning',
    size: 'large',
    medicalContext: true,
    actionText: 'Termin vereinbaren'
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Alert-Variante für wichtige medizinische Mitteilungen und ausführliche Informationen.'
      }
    }
  }
}

// Medication Reminder
export const MedicationReminder: Story = {
  args: {
    title: 'Medikamenten-Erinnerung',
    message: 'Zeit für Ihre Herzmedikation (Metoprolol 50mg). Vergessen Sie nicht die Einnahme nach dem Essen.',
    type: 'info',
    customIcon: React.createElement(Clock, { size: 24 }),
    actionText: 'Einnahme bestätigen',
    closable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Spezielle Alert für Medikamenten-Erinnerungen mit Bestätigungs-Funktion.'
      }
    }
  }
}

// GDPR Compliance Notice
export const GDPRCompliance: Story = {
  args: {
    title: 'Einverständniserklärung erforderlich',
    message: 'Für die Verarbeitung Ihrer medizinischen Daten benötigen wir Ihr ausdrückliches Einverständnis gemäß DSGVO Art. 9.',
    type: 'warning',
    medicalContext: true,
    actionText: 'Einverständnis erteilen'
  },
  parameters: {
    docs: {
      description: {
        story: 'GDPR-Compliance Alert für medizinische Datenverarbeitung und Einverständniserklärungen.'
      }
    }
  }
}