import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareTooltip } from './HealthcareTooltip'
import * as React from 'react'

const meta: Meta<typeof HealthcareTooltip> = {
  title: 'Healthcare/Tooltip',
  component: HealthcareTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Healthcare Tooltip Component - Medizinische Begriffserklärungen und Kontextinformationen

**Healthcare-Optimierungen:**
- Medizinische Begriffserklärungen mit ICD-10 Codes
- Fachbereichsspezifische Farbkodierung (Kardiologie, Onkologie, etc.)
- Erweiterte Inhalte für komplexe medizinische Zusammenhänge
- Ärztliche Haftungsausschlüsse bei medizinischen Informationen
- WCAG 2.1 AA konform mit Keyboard- und Screen Reader Support
- Mobile-optimierte Darstellung als Modal auf kleinen Bildschirmen

**Medizinische Anwendungsfälle:**
- Erklärung medizinischer Fachbegriffe für Patienten
- Symptombeschreibungen und Krankheitsbilder
- Medikamenteninformationen und Nebenwirkungen
- ICD-10 Diagnoseerklärungen
- Behandlungsverfahren und Therapieoptionen
- Anatomische Begriffe und Körperfunktionen

**Accessibility Features:**
- Hover, Click, Focus und Manual Trigger-Modi
- Screen Reader Support mit role="tooltip"
- Keyboard Navigation (Enter, Space, Escape)
- Automatic Positioning basierend auf verfügbarem Platz
- High Contrast und Reduced Motion Support
- Mobile Modal-Darstellung für bessere Lesbarkeit
        `
      }
    }
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip Inhalt'
    },
    title: {
      control: 'text',
      description: 'Tooltip Titel'
    },
    type: {
      control: 'select',
      options: ['default', 'medical', 'warning', 'info', 'definition', 'symptom'],
      description: 'Tooltip-Typ für Styling'
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'auto'],
      description: 'Tooltip-Position'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tooltip-Größe'
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'manual'],
      description: 'Auslöser-Typ'
    },
    medicalTerm: {
      control: 'boolean',
      description: 'Medizinischer Begriff mit Haftungsausschluss'
    },
    specialty: {
      control: 'select',
      options: ['kardiologie', 'onkologie', 'gallenblase', 'nephrologie', 'schilddruese', 'intensivmedizin'],
      description: 'Medizinischer Fachbereich'
    },
    showArrow: {
      control: 'boolean',
      description: 'Pfeil anzeigen'
    },
    showDelay: {
      control: 'number',
      description: 'Verzögerung beim Anzeigen (ms)'
    },
    hideDelay: {
      control: 'number',
      description: 'Verzögerung beim Ausblenden (ms)'
    }
  },
  args: {
    content: 'Dies ist eine medizinische Begriffserklärung für Patienten.',
    type: 'medical',
    position: 'auto',
    size: 'medium',
    trigger: 'hover',
    showArrow: true,
    showDelay: 500,
    hideDelay: 300,
    medicalTerm: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareTooltip>

// Default Story - Basic Medical Term
export const Default: Story = {
  args: {
    content: 'Ein Herzschrittmacher ist ein medizinisches Gerät, das bei Herzrhythmusstörungen eingesetzt wird.',
    children: React.createElement('span', { style: { borderBottom: '1px dotted #1278B3', cursor: 'help' } }, 'Herzschrittmacher')
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard Tooltip für medizinische Begriffserklärungen mit Hover-Trigger.'
      }
    }
  }
}

// Medical Term with ICD Code
export const MedicalTermWithICD: Story = {
  args: {
    title: 'Hypertonie',
    content: 'Arterielle Hypertonie bezeichnet einen dauerhaft erhöhten Blutdruck in den Arterien.',
    extendedContent: 'Ein systolischer Wert über 140 mmHg oder ein diastolischer Wert über 90 mmHg gelten als erhöht. Unbehandelt kann Bluthochdruck zu Herzinfarkt, Schlaganfall und anderen kardiovaskulären Komplikationen führen.',
    type: 'medical',
    medicalTerm: true,
    icdCode: 'I10.90',
    specialty: 'kardiologie',
    children: React.createElement('strong', { 
      style: { 
        color: '#dc2626', 
        borderBottom: '1px dotted #dc2626', 
        cursor: 'help',
        fontWeight: '600'
      } 
    }, 'Bluthochdruck')
  },
  parameters: {
    docs: {
      description: {
        story: 'Medizinischer Begriff mit ICD-10 Code, Fachbereichszuordnung und erweiterten Informationen.'
      }
    }
  }
}

// Symptom Description - Emergency Context
export const SymptomDescription: Story = {
  args: {
    title: 'Brustschmerzen',
    content: 'Starke, drückende Schmerzen in der Brust können auf einen Herzinfarkt hinweisen.',
    extendedContent: 'Wenn Brustschmerzen länger als 15 Minuten anhalten, in Arm, Kiefer oder Rücken ausstrahlen oder von Atemnot, Übelkeit oder Schweißausbrüchen begleitet werden, sollten Sie sofort den Notarzt unter 112 rufen.',
    type: 'symptom',
    medicalTerm: true,
    specialty: 'kardiologie',
    size: 'large',
    children: React.createElement('span', { 
      style: { 
        color: '#dc2626', 
        fontWeight: '700',
        backgroundColor: '#fef2f2',
        padding: '2px 6px',
        borderRadius: '4px',
        cursor: 'help'
      } 
    }, '⚠️ Brustschmerzen')
  },
  parameters: {
    docs: {
      description: {
        story: 'Symptombeschreibung mit Notfall-Kontext und erweiterten Handlungsempfehlungen.'
      }
    }
  }
}

// Medication Information  
export const MedicationInfo: Story = {
  args: {
    title: 'ASS 100 (Acetylsalicylsäure)',
    content: 'Niedrigdosierte Acetylsalicylsäure zur Blutverdünnung und Herzinfarkt-Prophylaxe.',
    extendedContent: 'Wirkmechanismus: Hemmt die Cyclooxygenase und reduziert die Bildung von Thromboxan A2, was zu einer verminderten Thrombozytenaggregation führt. Typische Dosierung: 100mg täglich. Nebenwirkungen können Magenbeschwerden und erhöhte Blutungsneigung sein.',
    type: 'info',
    medicalTerm: true,
    specialty: 'kardiologie',
    maxWidth: 400,
    children: React.createElement('code', { 
      style: { 
        backgroundColor: '#f1f5f9',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        color: '#1f2937',
        cursor: 'help',
        border: '1px solid #e2e8f0'
      } 
    }, 'ASS 100')
  },
  parameters: {
    docs: {
      description: {
        story: 'Medikamenteninformation mit detaillierter Wirkungsweise und Dosierungshinweisen.'
      }
    }
  }
}

// Warning - Drug Interaction
export const DrugInteractionWarning: Story = {
  args: {
    title: 'Arzneimittelwechselwirkung',
    content: 'Die gleichzeitige Einnahme von Marcumar und ASS kann zu verstärkten Blutungen führen.',
    extendedContent: 'Diese Kombination sollte nur unter strenger ärztlicher Überwachung erfolgen. Regelmäßige INR-Kontrollen sind erforderlich. Bei Blutungszeichen (Nasenbluten, blaue Flecken, dunkler Stuhl) sofort den Arzt kontaktieren.',
    type: 'warning',
    medicalTerm: true,
    trigger: 'click',
    children: React.createElement('span', { 
      style: { 
        color: '#f59e0b',
        backgroundColor: '#fffbeb',
        padding: '4px 8px',
        borderRadius: '6px',
        border: '2px solid #fbbf24',
        cursor: 'pointer',
        fontWeight: '600'
      } 
    }, '⚠️ Wechselwirkung')
  },
  parameters: {
    docs: {
      description: {
        story: 'Warnhinweis bei Arzneimittelwechselwirkungen mit Click-Trigger für wichtige Informationen.'
      }
    }
  }
}

// Medical Definition - Complex Term
export const MedicalDefinition: Story = {
  args: {
    title: 'Myokardinfarkt',
    content: 'Absterben von Herzmuskelgewebe aufgrund mangelnder Durchblutung.',
    extendedContent: 'Ein Myokardinfarkt entsteht meist durch den Verschluss einer Herzkranzarterie durch ein Blutgerinnsel (Thrombus). Dies führt zu einer akuten Sauerstoffunterversorgung des dahinterliegenden Herzmuskelgewebes. Ohne sofortige Behandlung stirbt das Gewebe ab und kann nicht regeneriert werden. Typische Symptome sind starke Brustschmerzen, Atemnot und Schweißausbrüche.',
    type: 'definition',
    medicalTerm: true,
    specialty: 'kardiologie',
    icdCode: 'I21.9',
    size: 'large',
    children: React.createElement('button', { 
      style: { 
        background: 'none',
        border: '1px solid #8b5cf6',
        color: '#8b5cf6',
        padding: '6px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500'
      } 
    }, '📚 Myokardinfarkt')
  },
  parameters: {
    docs: {
      description: {
        story: 'Ausführliche medizinische Definition mit ICD-Code und detaillierter Erklärung der Pathophysiologie.'
      }
    }
  }
}

// Anatomy Explanation  
export const AnatomyExplanation: Story = {
  args: {
    title: 'Gallenblase',
    content: 'Die Gallenblase ist ein kleines birnenförmiges Organ unter der Leber.',
    extendedContent: 'Sie speichert und konzentriert die von der Leber produzierte Gallenflüssigkeit. Bei der Nahrungsaufnahme, besonders von fetthaltigen Speisen, zieht sich die Gallenblase zusammen und gibt Gallenflüssigkeit über den Gallengang in den Zwölffingerdarm ab. Dies unterstützt die Fettverdauung.',
    type: 'info',
    specialty: 'gallenblase',
    medicalTerm: true,
    position: 'bottom',
    children: React.createElement('div', { 
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: '#f59e0b',
        cursor: 'help',
        borderBottom: '1px dotted #f59e0b'
      }
    }, [
      React.createElement('span', { key: 'emoji' }, '🫁'),
      React.createElement('span', { key: 'text' }, 'Gallenblase')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Anatomische Erklärung mit Fachbereichszuordnung und Funktionsbeschreibung.'
      }
    }
  }
}

// Click Trigger - Interactive Medical Info
export const ClickTrigger: Story = {
  args: {
    title: 'Weitere Informationen',
    content: 'Klicken Sie hier für detaillierte Informationen zu dieser Behandlung.',
    extendedContent: 'Diese minimal-invasive Behandlungsmethode wird ambulant durchgeführt und hat eine hohe Erfolgsrate. Die Nachsorge umfasst regelmäßige Kontrolltermine und spezielle Verhaltensregeln für die ersten Wochen nach dem Eingriff.',
    type: 'info',
    trigger: 'click',
    size: 'large',
    children: React.createElement('button', { 
      style: { 
        backgroundColor: '#1278B3',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500'
      } 
    }, 'ℹ️ Mehr erfahren')
  },
  parameters: {
    docs: {
      description: {
        story: 'Click-Trigger für interaktive medizinische Informationen mit erweiterbarem Inhalt.'
      }
    }
  }
}

// Focus Trigger - Keyboard Navigation
export const FocusTrigger: Story = {
  args: {
    title: 'Tastatur-Navigation',
    content: 'Verwenden Sie Tab, Enter oder Space, um diese medizinischen Informationen anzuzeigen.',
    type: 'info',
    trigger: 'focus',
    children: React.createElement('a', { 
      href: '#',
      onClick: (e: React.MouseEvent) => e.preventDefault(),
      style: {
        color: '#1278B3',
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    }, 'Barrierefreie Bedienung')
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus-Trigger für vollständige Keyboard-Navigation und Barrierefreiheit.'
      }
    }
  }
}

// Small Size - Compact Medical Info
export const SmallSize: Story = {
  args: {
    content: 'Kurze medizinische Erklärung.',
    size: 'small',
    type: 'medical',
    children: React.createElement('span', { 
      style: { 
        fontSize: '12px',
        color: '#10b981',
        cursor: 'help',
        textDecoration: 'underline dotted'
      } 
    }, 'Kompakt')
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Tooltip-Variante für kurze medizinische Hinweise in begrenztem Raum.'
      }
    }
  }
}

// Large Size - Comprehensive Medical Information
export const LargeSize: Story = {
  args: {
    title: 'Umfassende medizinische Information',
    content: 'Dies ist eine ausführliche medizinische Erklärung, die viel Platz benötigt, um alle relevanten Informationen zu vermitteln.',
    extendedContent: 'Zusätzliche Details zur Pathophysiologie, Diagnostik und Therapieoptionen. Diese erweiterten Informationen helfen Patienten dabei, ihre Erkrankung besser zu verstehen und informierte Entscheidungen über ihre Behandlung zu treffen.',
    size: 'large',
    type: 'medical',
    medicalTerm: true,
    maxWidth: 480,
    children: React.createElement('div', { 
      style: {
        padding: '12px 16px',
        border: '2px solid #10b981',
        borderRadius: '8px',
        backgroundColor: '#f0fdf4',
        cursor: 'help',
        display: 'inline-block'
      }
    }, [
      React.createElement('strong', { key: 'title' }, 'Detaillierte Aufklärung'),
      React.createElement('div', { 
        key: 'subtitle',
        style: { fontSize: '12px', color: '#166534', marginTop: '4px' }
      }, 'Hover für mehr Informationen')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Tooltip-Variante für umfassende medizinische Aufklärung und detaillierte Informationen.'
      }
    }
  }
}

// Multiple Specialties Demo
export const MultipleSpecialties: Story = {
  args: {},
  render: () => React.createElement('div', { 
    style: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '16px',
      alignItems: 'center',
      justifyContent: 'center'
    } 
  }, [
    React.createElement(HealthcareTooltip, {
      key: 'cardio',
      content: 'Kardiologie befasst sich mit Herz- und Kreislauferkrankungen.',
      specialty: 'kardiologie',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#dc2626', fontWeight: '600', cursor: 'help' } }, '❤️ Kardiologie')),
    
    React.createElement(HealthcareTooltip, {
      key: 'onko',
      content: 'Onkologie ist die Lehre von den Tumorkrankheiten.',
      specialty: 'onkologie',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#7c3aed', fontWeight: '600', cursor: 'help' } }, '🎗️ Onkologie')),
    
    React.createElement(HealthcareTooltip, {
      key: 'nephro',
      content: 'Nephrologie beschäftigt sich mit Nierenerkrankungen.',
      specialty: 'nephrologie',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#2563eb', fontWeight: '600', cursor: 'help' } }, '🫘 Nephrologie')),
    
    React.createElement(HealthcareTooltip, {
      key: 'galle',
      content: 'Behandlung von Gallenblase und Gallenwegen.',
      specialty: 'gallenblase',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#f59e0b', fontWeight: '600', cursor: 'help' } }, '🫁 Gallenblase')),
    
    React.createElement(HealthcareTooltip, {
      key: 'schild',
      content: 'Schilddrüsenerkrankungen und Hormontherapie.',
      specialty: 'schilddruese',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#10b981', fontWeight: '600', cursor: 'help' } }, '🦋 Schilddrüse')),
    
    React.createElement(HealthcareTooltip, {
      key: 'intensiv',
      content: 'Intensivmedizin für kritisch kranke Patienten.',
      specialty: 'intensivmedizin',
      type: 'medical'
    }, React.createElement('span', { style: { color: '#ea580c', fontWeight: '600', cursor: 'help' } }, '🏥 Intensivmedizin'))
  ]),
  parameters: {
    docs: {
      description: {
        story: 'Demo aller medizinischen Fachbereiche mit fachbereichsspezifischer Farbkodierung.'
      }
    }
  }
}