import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareTextarea } from './HealthcareTextarea'


const meta: Meta<typeof HealthcareTextarea> = {
  title: 'Healthcare/Textarea',
  component: HealthcareTextarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Textarea Component - Mehrzeilige Eingabefelder für medizinische Anamnese

**Healthcare-Optimierungen:**
- Medizinische Anamnese und Symptombeschreibung
- Auto-Resize für dynamische Inhalte
- Zeichenzähler für medizinische Berichte
- Medizinische Datenschutz-Indikatoren
- WCAG 2.1 AA konform mit Screen Reader Support
- Clear-Funktion für einfache Neueingabe

**Medizinische Anwendungsfälle:**
- Symptombeschreibung und Anamnese
- Medizinische Vorgeschichte
- Aktuelle Beschwerden und Schmerzen
- Medikamenteneinnahme und Allergien
- Behandlungswünsche und Fragen

**Accessibility Features:**
- Semantic HTML mit Labels und ARIA
- Auto-Resize für bessere Usability
- Keyboard Navigation vollständig unterstützt
- Character Count für medizinische Berichte
- High Contrast & Reduced Motion Support
        `
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Textarea Label'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Textarea-Größe'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Privacy-Indikatoren'
    },
    autoResize: {
      control: 'boolean',
      description: 'Auto-Resize aktivieren'
    },
    showCharacterCount: {
      control: 'boolean',
      description: 'Zeichenzähler anzeigen'
    },
    maxLength: {
      control: 'number',
      description: 'Maximale Zeichenanzahl'
    },
    minRows: {
      control: 'number',
      description: 'Mindestzeilen'
    },
    maxRows: {
      control: 'number',
      description: 'Maximale Zeilen'
    },
    required: {
      control: 'boolean',
      description: 'Pflichtfeld'
    },
    disabled: {
      control: 'boolean',
      description: 'Deaktiviert'
    },
    readOnly: {
      control: 'boolean',
      description: 'Schreibgeschützt'
    }
  },
  args: {
    label: 'Beschreibung Ihrer Beschwerden',
    placeholder: 'Beschreiben Sie bitte ausführlich Ihre aktuellen Beschwerden, Symptome und den zeitlichen Verlauf...',
    size: 'medium',
    fullWidth: true,
    autoResize: true,
    minRows: 4,
    maxRows: 12,
    spellCheck: true
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareTextarea>

// Default Story - Patient Complaint Description
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Textarea für Patientenbeschwerden mit Auto-Resize und medizinischem Kontext.'
      }
    }
  }
}

// Medical Context - Patient History
export const MedicalContext: Story = {
  args: {
    label: 'Medizinische Vorgeschichte',
    placeholder: 'Beschreiben Sie Ihre medizinische Vorgeschichte, chronische Erkrankungen, Operationen, Allergien...',
    medicalContext: true,
    required: true,
    maxLength: 2000,
    showCharacterCount: true,
    helpText: 'Diese Informationen helfen unserem Fachpersonal bei einer umfassenden Diagnose.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinischer Kontext mit Datenschutz-Indikatoren und Zeichenzähler für ausführliche Anamnese.'
      }
    }
  }
}

// Current Symptoms - Detailed Description
export const CurrentSymptoms: Story = {
  args: {
    label: 'Aktuelle Symptome',
    placeholder: 'Wann haben die Beschwerden begonnen? Wie äußern sie sich? Was verstärkt/lindert die Symptome?',
    medicalContext: true,
    autoResize: true,
    minRows: 6,
    maxRows: 15,
    maxLength: 1500,
    showCharacterCount: true,
    onClear: () => console.log('Symptoms cleared'),
    helpText: 'Je detaillierter Ihre Beschreibung, desto besser können wir Ihnen helfen.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Symptombeschreibung mit erweiterten Zeilen und Clear-Button für Neueingabe.'
      }
    }
  }
}

// Medication History - Comprehensive List
export const MedicationHistory: Story = {
  args: {
    label: 'Aktuelle Medikamenteneinnahme',
    placeholder: 'Listen Sie alle aktuell eingenommenen Medikamente auf:\n\n- Medikament 1: Dosierung, Häufigkeit\n- Medikament 2: Dosierung, Häufigkeit\n- ...',
    defaultValue: '- Metoprolol 50mg, 1x täglich morgens\n- ASS 100mg, 1x täglich abends',
    medicalContext: true,
    size: 'large',
    maxLength: 3000,
    showCharacterCount: true,
    helpText: 'Bitte geben Sie auch rezeptfreie Medikamente, Nahrungsergänzungsmittel und Dosierungen an.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Medikamentenliste mit vorausgefüllten Beispieldaten und großer Textarea für umfassende Listen.'
      }
    }
  }
}

// Error State - Incomplete Information
export const ErrorState: Story = {
  args: {
    label: 'Beschwerden',
    value: 'Zu kurz',
    error: 'Die Beschreibung ist zu kurz. Bitte beschreiben Sie Ihre Beschwerden ausführlicher (mindestens 50 Zeichen).',
    required: true,
    medicalContext: true,
    maxLength: 2000,
    showCharacterCount: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Zustand bei unvollständigen medizinischen Angaben mit hilfreichen Hinweisen.'
      }
    }
  }
}

// Success State - Complete Information
export const SuccessState: Story = {
  args: {
    label: 'Medizinische Anamnese',
    value: 'Seit etwa 3 Monaten leide ich unter wiederkehrenden Brustschmerzen, die vor allem bei körperlicher Anstrengung auftreten. Die Schmerzen strahlen gelegentlich in den linken Arm aus. Ruhe und Entspannung lindern die Beschwerden meist innerhalb von 10-15 Minuten. Ich bin 55 Jahre alt, habe erhöhten Blutdruck und nehme seit 2 Jahren Blutdrucksenker ein.',
    success: 'Vollständige Anamnese erfolgreich erfasst. Ihre Daten werden jetzt an einen Kardiologen weitergeleitet.',
    medicalContext: true,
    readOnly: true,
    maxLength: 2000,
    showCharacterCount: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Success-Zustand nach vollständiger Eingabe mit schreibgeschützter Anzeige der erfassten Daten.'
      }
    }
  }
}

// Small Size - Compact Notes
export const SmallSize: Story = {
  args: {
    label: 'Zusätzliche Notizen',
    placeholder: 'Weitere wichtige Informationen...',
    size: 'small',
    minRows: 2,
    maxRows: 5,
    maxLength: 500,
    showCharacterCount: true,
    onClear: () => console.log('Notes cleared')
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Textarea für zusätzliche Notizen und kurze Ergänzungen.'
      }
    }
  }
}

// Large Size - Comprehensive Report
export const LargeSize: Story = {
  args: {
    label: 'Ausführlicher Bericht',
    placeholder: 'Beschreiben Sie ausführlich Ihren Krankheitsverlauf, bisherige Behandlungen, Untersuchungsergebnisse...',
    size: 'large',
    medicalContext: true,
    minRows: 8,
    maxRows: 20,
    maxLength: 5000,
    showCharacterCount: true,
    helpText: 'Für eine optimale zweite Meinung sind ausführliche Informationen sehr hilfreich.',
    onClear: () => console.log('Report cleared')
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Textarea für ausführliche medizinische Berichte und umfassende Patientengeschichte.'
      }
    }
  }
}

// Character Limit Warning - Near Limit
export const CharacterLimitWarning: Story = {
  args: {
    label: 'Kurze Beschreibung',
    value: 'Dies ist eine sehr lange Beschreibung die sich dem Zeichenlimit nähert und bald das Maximum erreichen wird. Noch wenige Zeichen verfügbar.',
    maxLength: 200,
    showCharacterCount: true,
    medicalContext: true,
    helpText: 'Fassen Sie sich bitte kurz und prägnant.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Zeichenlimit-Warnung wenn sich der Text dem Maximum nähert (80% des Limits erreicht).'
      }
    }
  }
}

// Disabled State - Read-only Medical Record
export const DisabledState: Story = {
  args: {
    label: 'Arztbericht',
    value: 'Patientenangaben wurden durch Dr. med. Schmidt am 15.03.2024 überprüft und in die elektronische Patientenakte übernommen. Diagnose: Hypertonie Grad I. Empfohlene Therapie: ACE-Hemmer, Lebensstiländerung.',
    disabled: true,
    size: 'medium',
    helpText: 'Dieser Bericht wurde vom behandelnden Arzt erstellt und kann nicht bearbeitet werden.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Deaktivierte Textarea für schreibgeschützte Arztberichte und offizielle medizinische Dokumente.'
      }
    }
  }
}

// Auto-resize Demo - Dynamic Content
export const AutoResizeDemo: Story = {
  args: {
    label: 'Dynamischer Inhalt',
    placeholder: 'Beginnen Sie zu tippen und beobachten Sie, wie die Textarea automatisch mitwächst...',
    autoResize: true,
    minRows: 3,
    maxRows: 10,
    medicalContext: true,
    onClear: () => console.log('Content cleared'),
    helpText: 'Die Textarea passt sich automatisch der Textlänge an.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo der Auto-Resize-Funktion - die Textarea wächst automatisch mit dem Inhalt mit.'
      }
    }
  }
}

// Fixed Height - Traditional Textarea
export const FixedHeight: Story = {
  args: {
    label: 'Feste Höhe',
    placeholder: 'Diese Textarea hat eine feste Höhe und kann manuell in der Höhe verändert werden...',
    autoResize: false,
    minRows: 6,
    medicalContext: false,
    helpText: 'Ziehen Sie am unteren rechten Rand, um die Größe anzupassen.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Traditionelle Textarea mit fester Höhe und manueller Größenanpassung durch den Benutzer.'
      }
    }
  }
}