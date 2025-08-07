import type { Meta, StoryObj } from '@storybook/react'
import AccessibilityDemo from './AccessibilityDemo'
import './AccessibilityDemo.css'

const meta: Meta<typeof AccessibilityDemo> = {
  title: 'Healthcare/Advanced Accessibility',
  component: AccessibilityDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Healthcare Advanced Accessibility Demo

Umfassende Demonstration der erweiterten Barrierefreiheit-Features für medizinische Anwendungen.

## 🏥 Healthcare-spezifische Accessibility Features

### **Screen Reader Optimierungen**
- Medizinische Kontextankündigungen
- ARIA-optimierte Formulare
- Notfall-Prioritäts-Ansagen
- Datenschutz-sichere Ankündigungen

### **Tastatur-Navigation**
- Healthcare-spezifische Shortcuts (F1 für Notfall)
- Focus-Trap für medizinische Modals
- Sequenzielle Formular-Navigation
- Emergency-First Fokussierung

### **Visuelle Anpassungen**
- Hochkontrast-Modus für medizinische Umgebungen
- Vergrößerte Touch-Targets (56px+) für gestresste Patienten
- Reduzierte Bewegungen für empfindliche Benutzer
- Anpassbare Textgrößen

### **Medizinische Kontexte**
- GDPR-konforme Datenverarbeitung
- Ärztliche Schweigepflicht Integration
- Notfall-Accessibility Features
- Patientendaten-sichere Ankündigungen

## 🧪 Testing Guidelines

### **Screen Reader Testing**
1. Verwenden Sie NVDA, JAWS oder VoiceOver
2. Testen Sie alle Formular-Validierungen
3. Prüfen Sie Notfall-Ankündigungen
4. Validieren Sie medizinische Datenschutz-Hinweise

### **Keyboard Testing** 
1. Tab-Navigation durch alle Elemente
2. F1 für Notfall-Hotline testen
3. Escape für Modal-Schließung
4. Alt+Shortcuts für Navigation

### **Visual Testing**
1. Hochkontrast-Modus aktivieren
2. Verschiedene Textgrößen testen
3. Reduzierte Bewegungen prüfen
4. Touch-Target-Größen validieren

## 🔧 Integration

\`\`\`tsx
import { useHealthcareAccessibility } from '@/hooks/useHealthcareAccessibility'

function MyHealthcareComponent() {
  const {
    announce,
    announceEmergency,
    toggleHighContrast,
    focusFirstError
  } = useHealthcareAccessibility({
    context: 'form',
    medicalContext: true
  })

  // Verwenden Sie die Accessibility-Funktionen...
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    scenario: {
      control: 'select',
      options: ['form', 'navigation', 'emergency', 'medical-data', 'comprehensive'],
      description: 'Demo-Szenario für verschiedene Accessibility-Features'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext für erweiterte Healthcare-Features'
    },
    showControls: {
      control: 'boolean', 
      description: 'Accessibility-Einstellungen anzeigen'
    },
    initialSettings: {
      control: 'object',
      description: 'Initiale Accessibility-Einstellungen'
    },
    onClose: {
      action: 'closed',
      description: 'Demo geschlossen (nur für Test-Zwecke)',
      table: {
        category: 'Events'
      }
    }
  },
  args: {
    scenario: 'comprehensive',
    medicalContext: true,
    showControls: true,
    initialSettings: {}
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AccessibilityDemo>

// Comprehensive Demo - All Accessibility Features
export const Comprehensive: Story = {
  args: {},
  play: async () => {
    console.log('Accessibility demo loaded')
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständige Demonstration aller Healthcare-Accessibility-Features mit interaktiven Einstellungen, Screen Reader Tests und medizinischen Kontexten.'
      }
    }
  }
}

// Form Accessibility Demo
export const FormAccessibility: Story = {
  args: {
    scenario: 'form',
    initialSettings: {
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Spezialisierte Demo für Formular-Accessibility mit medizinischen Eingabefeldern, Validierung und ARIA-Optimierungen.'
      }
    }
  }
}

// Emergency Accessibility Demo
export const EmergencyAccessibility: Story = {
  args: {
    scenario: 'emergency',
    medicalContext: true,
    initialSettings: {
      highContrast: true,
      textSize: 'large'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Accessibility Demo mit hochkontrastiger Darstellung, vergrößerten Elementen und kritischen Ankündigungen.'
      }
    }
  }
}

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  args: {
    scenario: 'navigation',
    showControls: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokussierte Demo der Tastatur-Navigation mit Healthcare-spezifischen Shortcuts und Focus-Management.'
      }
    }
  }
}

// Medical Data Privacy Demo
export const MedicalDataPrivacy: Story = {
  args: {
    scenario: 'medical-data',
    medicalContext: true,
    initialSettings: {
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo für datenschutzkonformes Handling medizinischer Daten mit Screen Reader-optimierten GDPR-Hinweisen.'
      }
    }
  }
}

// High Contrast Mode Demo
export const HighContrastMode: Story = {
  args: {
    scenario: 'comprehensive',
    initialSettings: {
      highContrast: true,
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Hochkontrast-Modus Demo für Benutzer mit Sehbeeinträchtigungen in medizinischen Umgebungen.'
      }
    }
  }
}

// Reduced Motion Demo
export const ReducedMotionMode: Story = {
  args: {
    scenario: 'comprehensive',
    initialSettings: {
      reducedMotion: true,
      textSize: 'large'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo mit reduzierten Bewegungen für Benutzer mit Bewegungsempfindlichkeit oder vestibulären Störungen.'
      }
    }
  }
}

// Large Text Size Demo
export const LargeTextSize: Story = {
  args: {
    scenario: 'form',
    initialSettings: {
      textSize: 'extra-large',
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo mit vergrößerter Textdarstellung für Benutzer mit Sehbeeinträchtigungen oder ältere Patienten.'
      }
    }
  }
}

// Mobile Accessibility Demo
export const MobileAccessibility: Story = {
  args: {
    scenario: 'emergency',
    initialSettings: {
      textSize: 'large',
      enhancedFocus: true
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Accessibility-Demo mit vergrößerten Touch-Targets und vereinfachter Navigation für Smartphone-Benutzer.'
      }
    }
  }
}

// Screen Reader Optimized Demo
export const ScreenReaderOptimized: Story = {
  args: {
    scenario: 'medical-data',
    medicalContext: true,
    showControls: false,
    initialSettings: {
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Screen Reader-optimierte Demo mit medizinischen Kontextankündigungen, ARIA-Labels und strukturierter Navigation.'
      }
    }
  }
}

// Complete Accessibility Suite Demo
export const CompleteAccessibilitySuite: Story = {
  args: {
    scenario: 'comprehensive',
    medicalContext: true,
    showControls: true,
    initialSettings: {
      highContrast: false,
      reducedMotion: false,
      textSize: 'medium',
      enhancedFocus: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständige Accessibility-Suite mit allen Features: Screen Reader, Tastatur-Navigation, visuelle Anpassungen und medizinische Kontexte. Ideal für umfassende Tests und Demonstrationen.'
      }
    }
  }
}