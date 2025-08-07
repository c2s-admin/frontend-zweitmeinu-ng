import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareHeader } from './HealthcareHeader'

const meta: Meta<typeof HealthcareHeader> = {
  title: 'Healthcare/Header',
  component: HealthcareHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Healthcare Header Component - Navigation für medizinische Plattform

**Healthcare-Optimierungen:**
- Emergency Banner mit Notfall-Kontakt (immer sichtbar)
- WCAG 2.1 AA konform (56px Touch-Targets)
- Mobile-first Design für Healthcare-Nutzer
- Trust-Indikatoren für medizinisches Vertrauen
- Semantic HTML für Screen Reader
- Hochkontrast & Reduced Motion Support

**Medizinische Fachbereiche:** Kardiologie, Onkologie, Gallenblase, Nephrologie, Schilddrüse, Intensivmedizin

**Accessibility Features:**
- Minimum 56px touch targets (Healthcare-Standard)
- 4.5:1 Kontrast-Verhältnis
- ARIA Labels in deutscher medizinischer Terminologie
- Keyboard Navigation mit logischer Tab-Reihenfolge
- Screen Reader optimiert
        `
      }
    }
  },
  argTypes: {
    logo: {
      control: 'text',
      description: 'Logo text oder React component'
    },
    emergencyNumber: {
      control: 'text',
      description: 'Notfall-Telefonnummer für Emergency Banner'
    },
    showTrustIndicators: {
      control: 'boolean',
      description: 'DSGVO und Vertrauens-Indikatoren anzeigen'
    },
    currentPath: {
      control: 'select',
      options: ['/', '/kardiologie', '/onkologie', '/gallenblase', '/nephrologie', '/schilddruese', '/intensivmedizin', '/fachbereiche'],
      description: 'Aktueller Pfad für Active-State'
    },
    isMobileMenuOpen: {
      control: 'boolean',
      description: 'Mobile Menu Status (controlled)'
    }
  },
  args: {
    logo: 'zweitmeinung.ng',
    emergencyNumber: '+49 800 80 44 100',
    showTrustIndicators: true,
    currentPath: '/'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareHeader>

// Default Story - Standard Healthcare Header
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Healthcare Header mit allen medizinischen Fachbereichen und Emergency Banner. Optimiert für Desktop und Mobile.'
      }
    }
  }
}

// Active Medical Specialty - Kardiologie
export const ActiveCardiology: Story = {
  args: {
    currentPath: '/kardiologie'
  },
  parameters: {
    docs: {
      description: {
        story: 'Header mit aktivem Kardiologie-Bereich. Zeigt Active-State für medizinische Fachrichtung.'
      }
    }
  }
}

// Emergency Context - Critical Medical Situation
export const Emergency: Story = {
  args: {
    emergencyNumber: '+49 112',
    navigationItems: [
      { label: '🚨 Notfall', href: '/notfall' },
      { label: 'Kardiologie', href: '/kardiologie' },
      { label: 'Intensivmedizin', href: '/intensivmedizin' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Header im Notfall-Kontext mit Notfall-Nummer 112 und prioritisierten medizinischen Bereichen.'
      }
    }
    }
}

// Mobile Menu Open - Touch-Optimized
export const MobileMenuOpen: Story = {
  args: {
    isMobileMenuOpen: true,
    currentPath: '/onkologie'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile Navigation geöffnet mit 56px Touch-Targets für Healthcare-Nutzer. Inkl. Mobile Emergency Contact.'
      }
    }
  }
}

// Without Trust Indicators - Minimal Design
export const MinimalDesign: Story = {
  args: {
    showTrustIndicators: false,
    logo: 'Medical Platform'
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimales Design ohne Vertrauens-Indikatoren für einfachere medizinische Anwendungen.'
      }
    }
  }
}

// High Contrast Mode - Accessibility
export const HighContrast: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'High Contrast Mode für Nutzer mit Sehbeeinträchtigungen. WCAG 2.1 AA konform mit 4.5:1 Kontrast.'
      }
    }
  }
}

// Custom Medical Specialties
export const CustomSpecialties: Story = {
  args: {
    navigationItems: [
      { label: 'Pädiatrie', href: '/paediatrie' },
      { label: 'Geriatrie', href: '/geriatrie' },
      { label: 'Psychiatrie', href: '/psychiatrie' },
      { label: 'Radiologie', href: '/radiologie' },
      { label: 'Anesthesiologie', href: '/anaesthesiologie' }
    ],
    currentPath: '/psychiatrie'
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom medizinische Fachbereiche für spezialisierte Healthcare-Plattformen.'
      }
    }
  }
}

// Loading State - Healthcare Data Loading
export const LoadingState: Story = {
  args: {
    navigationItems: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading State während medizinische Daten geladen werden. Zeigt Emergency Banner weiterhin an.'
      }
    }
  }
}

// Interactive Demo - For Testing
export const InteractiveDemo: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Demo zum Testen aller Healthcare Header Funktionen. Klicken Sie auf Navigation und Mobile Menu.'
      }
    }
  }
}