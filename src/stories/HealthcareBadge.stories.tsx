import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareBadge } from './HealthcareBadge'
import * as React from 'react'

const meta: Meta<typeof HealthcareBadge> = {
  title: 'Healthcare/Badge',
  component: HealthcareBadge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Badge Component - Status-Indikatoren für medizinische Kontexte

**Healthcare-Optimierungen:**
- Medizinische Fachbereich-Badges mit Farbkodierung
- Status-Indikatoren für Behandlungen und Termine
- Dringlichkeits-Badges mit Pulse-Animation
- 32px+ Touch-Targets für Healthcare-Nutzer
- WCAG 2.1 AA konform mit 4.5:1 Kontrast-Verhältnis
- Screen Reader optimiert mit ARIA Labels

**Medizinische Anwendungsfälle:**
- Fachbereich-Kennzeichnung (Kardiologie, Onkologie, etc.)
- Behandlungsstatus (Aktiv, Abgeschlossen, Wartend)
- Dringlichkeitsstufen (Normal, Urgent, Notfall)
- Zertifizierungen und Qualifikationen
- Patientenkategorien und Behandlungsarten

**Accessibility Features:**
- Semantic HTML mit ARIA Labels
- Keyboard Navigation für interaktive Badges
- High Contrast & Reduced Motion Support
        `
      }
    }
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge-Inhalt'
    },
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'urgent', 'specialty'],
      description: 'Badge-Variante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge-Größe'
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'square'],
      description: 'Badge-Form'
    },
    specialty: {
      control: 'select',
      options: ['kardiologie', 'onkologie', 'gallenblase', 'nephrologie', 'schilddruese', 'intensivmedizin', 'allgemeine-fragen'],
      description: 'Medizinischer Fachbereich (für specialty variant)'
    },
    showIcon: {
      control: 'boolean',
      description: 'Icon anzeigen'
    },
    clickable: {
      control: 'boolean',
      description: 'Klickbar'
    },
    removable: {
      control: 'boolean',
      description: 'Entfernbar'
    },
    loading: {
      control: 'boolean',
      description: 'Loading-Zustand'
    }
  },
  args: {
    children: 'Aktiv',
    variant: 'success',
    size: 'medium',
    shape: 'rounded',
    showIcon: true
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareBadge>

// Default Story - Treatment Status
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Status-Badge für aktive medizinische Behandlungen.'
      }
    }
  }
}

// Medical Specialties - All Specialties
export const MedicalSpecialties: Story = {
  render: () => React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "kardiologie" }, "Kardiologie"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "onkologie" }, "Onkologie"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "gallenblase" }, "Gallenblase"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "nephrologie" }, "Nephrologie"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "schilddruese" }, "Schilddrüse"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "intensivmedizin" }, "Intensivmedizin"),
    React.createElement(HealthcareBadge, { variant: "specialty", specialty: "allgemeine-fragen" }, "Allgemein")
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alle verfügbaren medizinischen Fachbereiche mit spezifischer Farbkodierung.'
      }
    }
  }
}

// Treatment Status Variants
export const TreatmentStatus: Story = {
  render: () => React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
    React.createElement(HealthcareBadge, { variant: "success" }, "Abgeschlossen"),
    React.createElement(HealthcareBadge, { variant: "info" }, "In Bearbeitung"),
    React.createElement(HealthcareBadge, { variant: "warning" }, "Warteliste"),
    React.createElement(HealthcareBadge, { variant: "error" }, "Abgebrochen"),
    React.createElement(HealthcareBadge, { variant: "urgent" }, "Dringend"),
    React.createElement(HealthcareBadge, { variant: "neutral" }, "Geplant")
  ),
  parameters: {
    docs: {
      description: {
        story: 'Verschiedene Status-Varianten für Behandlungsprozesse und Termine.'
      }
    }
  }
}

// Urgent Badge - Emergency Context
export const Urgent: Story = {
  args: {
    children: 'Notfall',
    variant: 'urgent',
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Dringlichkeits-Badge mit Pulse-Animation für Notfall-Situationen.'
      }
    }
  }
}

// Clickable Badge - Interactive
export const Clickable: Story = {
  args: {
    children: 'Termin buchen',
    variant: 'info',
    clickable: true,
    ariaLabel: 'Klicken um Termin zu buchen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Badge mit Hover-Effekten und Keyboard-Navigation.'
      }
    }
  }
}

// Removable Badge - Filter Tags
export const Removable: Story = {
  args: {
    children: 'Kardiologie',
    variant: 'specialty',
    specialty: 'kardiologie',
    removable: true,
    shape: 'pill'
  },
  parameters: {
    docs: {
      description: {
        story: 'Entfernbare Badge für Filter-Tags und temporäre Auswahl.'
      }
    }
  }
}

// Size Variations
export const SizeVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <HealthcareBadge size="small" variant="success">Klein</HealthcareBadge>
      <HealthcareBadge size="medium" variant="success">Medium</HealthcareBadge>
      <HealthcareBadge size="large" variant="success">Groß</HealthcareBadge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Verschiedene Größenvarianten für unterschiedliche UI-Kontexte.'
      }
    }
  }
}

// Shape Variations  
export const ShapeVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <HealthcareBadge shape="square" variant="info">Eckig</HealthcareBadge>
      <HealthcareBadge shape="rounded" variant="info">Abgerundet</HealthcareBadge>
      <HealthcareBadge shape="pill" variant="info">Pill-Form</HealthcareBadge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Verschiedene Formen für unterschiedliche Design-Anforderungen.'
      }
    }
  }
}

// Loading State - Processing
export const Loading: Story = {
  args: {
    children: 'Wird verarbeitet...',
    variant: 'info',
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading-Zustand während medizinische Daten verarbeitet werden.'
      }
    }
  }
}

// Doctor Qualifications
export const DoctorQualifications: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <HealthcareBadge variant="success" size="small">Facharzt</HealthcareBadge>
      <HealthcareBadge variant="info" size="small">15 Jahre Erfahrung</HealthcareBadge>
      <HealthcareBadge variant="neutral" size="small">Zertifiziert</HealthcareBadge>
      <HealthcareBadge variant="specialty" specialty="kardiologie" size="small">Kardiologie</HealthcareBadge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Kleinere Badges für Arzt-Qualifikationen und Zertifizierungen.'
      }
    }
  }
}

// Patient Priority Levels
export const PatientPriority: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ minWidth: '100px' }}>Routine:</span>
        <HealthcareBadge variant="neutral">Standard</HealthcareBadge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ minWidth: '100px' }}>Priorität:</span>
        <HealthcareBadge variant="warning">Erhöht</HealthcareBadge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ minWidth: '100px' }}>Notfall:</span>
        <HealthcareBadge variant="urgent">Kritisch</HealthcareBadge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Prioritätsstufen für Patienten und medizinische Behandlungen.'
      }
    }
  }
}

// Certification Badges
export const Certifications: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <HealthcareBadge variant="success" shape="pill">DSGVO-konform</HealthcareBadge>
      <HealthcareBadge variant="info" shape="pill">ISO 27001</HealthcareBadge>
      <HealthcareBadge variant="success" shape="pill">Ärztliche Schweigepflicht</HealthcareBadge>
      <HealthcareBadge variant="neutral" shape="pill">TÜV-zertifiziert</HealthcareBadge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Zertifizierungs-Badges für Vertrauen und Compliance-Indikatoren.'
      }
    }
  }
}