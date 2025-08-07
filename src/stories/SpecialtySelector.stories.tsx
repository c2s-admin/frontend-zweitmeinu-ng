import type { Meta, StoryObj } from '@storybook/react'
import { SpecialtySelector, MedicalSpecialty } from './SpecialtySelector'
import { Heart, Activity, Droplets, Zap, AlertTriangle, Circle } from 'lucide-react'
import * as React from 'react'

// Custom specialties for specific story scenarios
const emergencySpecialties: MedicalSpecialty[] = [
  {
    id: 'kardiologie',
    name: 'Kardiologie',
    description: 'Herz- und Kreislauferkrankungen',
    details: 'Sofortige Behandlung bei Herzproblemen verfügbar',
    color: '#dc2626',
    faqCount: 45,
    doctorCount: 8,
    responseTime: '15 Min',
    conditions: ['Herzinfarkt', 'Bluthochdruck', 'Herzrhythmusstörungen'],
    emergencyAvailable: true
  },
  {
    id: 'gallenblase',
    name: 'Gallenblase',
    description: 'Gallenblasen- und Gallenwegerkrankungen',
    details: 'Notfall-Chirurgie bei akuten Gallenkoliken',
    color: '#f59e0b',
    faqCount: 28,
    doctorCount: 6,
    responseTime: '30 Min',
    conditions: ['Gallensteine', 'Gallenkolik', 'Gallenblasenentzündung'],
    emergencyAvailable: true
  },
  {
    id: 'intensivmedizin',
    name: 'Intensivmedizin',
    description: 'Intensivpflege und Notfallmedizin',
    details: 'Rund-um-die-Uhr Verfügbarkeit für kritische Fälle',
    color: '#ea580c',
    faqCount: 34,
    doctorCount: 15,
    responseTime: '5 Min',
    conditions: ['Sepsis', 'Beatmung', 'Schockzustände'],
    emergencyAvailable: true
  }
]

const unavailableSpecialties: MedicalSpecialty[] = [
  {
    id: 'kardiologie',
    name: 'Kardiologie',
    description: 'Herz- und Kreislauferkrankungen',
    color: '#dc2626',
    faqCount: 45,
    doctorCount: 8,
    responseTime: '24h',
    emergencyAvailable: true
  },
  {
    id: 'onkologie',
    name: 'Onkologie',
    description: 'Krebserkrankungen und Tumore',
    color: '#7c3aed',
    faqCount: 67,
    doctorCount: 12,
    responseTime: '48h',
    unavailable: true
  },
  {
    id: 'nephrologie',
    name: 'Nephrologie',
    description: 'Nierenerkrankungen',
    color: '#2563eb',
    faqCount: 39,
    doctorCount: 7,
    responseTime: '32h',
    unavailable: true
  }
]

const meta: Meta<typeof SpecialtySelector> = {
  title: 'Healthcare/SpecialtySelector',
  component: SpecialtySelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Specialty Selector Component - Medizinische Fachbereichsauswahl für die zweitmeinung.ng Plattform

**Healthcare-Optimierungen:**
- 6 medizinische Fachbereiche mit farbkodierter Darstellung
- Notfall-Modus für kritische medizinische Situationen
- Suchfunktion für Erkrankungen und Fachbereiche
- Mehrfachauswahl für komplexe medizinische Fälle
- WCAG 2.1 AA konform mit 56px+ Touch-Targets
- Screen Reader Support für medizinische Terminologie

**Medizinische Fachbereiche:**
- Kardiologie (Herz- und Kreislauferkrankungen) - Rot
- Onkologie (Krebserkrankungen) - Violett  
- Gallenblase (Gallenblasen- und Gallenwege) - Gelb/Orange
- Nephrologie (Nierenerkrankungen) - Blau
- Schilddrüse (Schilddrüsen- und Stoffwechsel) - Grün
- Intensivmedizin (Notfallmedizin) - Orange

**Anwendungsfälle:**
- Patientenregistrierung mit Fachbereichsauswahl
- Arztsuche nach medizinischen Spezialgebieten
- Notfall-Triagierung mit Emergency-Modus
- Zweitmeinungsanfragen mit Fachbereichszuordnung
- FAQ-Kategorisierung nach medizinischen Bereichen

**Accessibility Features:**
- Keyboard Navigation (Tab, Enter, Space)
- Screen Reader Support mit medizinischen Beschreibungen
- High Contrast Mode für bessere Lesbarkeit
- Reduced Motion Support für empfindliche Nutzer
- Touch-optimiert für mobile Healthcare-Nutzer
        `
      }
    }
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Auswahlmodus für Fachbereiche'
    },
    layout: {
      control: 'select', 
      options: ['grid', 'list', 'cards'],
      description: 'Layout-Variante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus (zeigt nur Emergency-verfügbare Fachbereiche)'
    },
    searchable: {
      control: 'boolean',
      description: 'Suchfunktion aktivieren'
    },
    showDetails: {
      control: 'boolean',
      description: 'Detaillierte Beschreibungen anzeigen'
    },
    showDoctorCounts: {
      control: 'boolean',
      description: 'Anzahl verfügbarer Ärzte anzeigen'
    },
    showResponseTimes: {
      control: 'boolean',
      description: 'Antwortzeiten anzeigen'
    },
    showConditions: {
      control: 'boolean',
      description: 'Beispiel-Erkrankungen anzeigen'
    },
    showGeneralQuestions: {
      control: 'boolean',
      description: 'Allgemeine Fragen Option anzeigen'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    title: 'Wählen Sie Ihren Fachbereich',
    subtitle: 'Unsere Fachärzte stehen Ihnen zur Verfügung',
    mode: 'single',
    layout: 'grid',
    size: 'medium',
    emergencyMode: false,
    searchable: false,
    showDetails: false,
    showDoctorCounts: true,
    showResponseTimes: true,
    showConditions: false,
    showGeneralQuestions: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SpecialtySelector>

// Default Story - Standard Medical Specialty Selection
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Fachbereichsauswahl mit allen 6 medizinischen Spezialgebieten der zweitmeinung.ng Plattform.'
      }
    }
  }
}

// Emergency Mode - Critical Medical Situations
export const EmergencyMode: Story = {
  args: {
    emergencyMode: true,
    specialties: emergencySpecialties,
    title: '🚨 Notfall-Fachbereiche',
    subtitle: 'Nur Fachbereiche mit sofortiger Verfügbarkeit',
    showDetails: true,
    onSelectionChange: (selectedIds, selectedSpecialties) => {
      console.log('Emergency selection:', selectedIds, selectedSpecialties)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus zeigt nur Fachbereiche mit Notfall-Verfügbarkeit für kritische medizinische Situationen.'
      }
    }
  }
}

// Multiple Selection - Complex Medical Cases
export const MultipleSelection: Story = {
  args: {
    mode: 'multiple',
    title: 'Mehrere Fachbereiche auswählen',
    subtitle: 'Für komplexe medizinische Fälle können Sie mehrere Bereiche wählen',
    defaultSelectedIds: ['kardiologie', 'nephrologie'],
    showDetails: true,
    onSelectionChange: (selectedIds, selectedSpecialties) => {
      console.log('Multiple selection:', selectedIds, selectedSpecialties)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Mehrfachauswahl ermöglicht die Auswahl mehrerer Fachbereiche für interdisziplinäre medizinische Fälle.'
      }
    }
  }
}

// With Search - Find Specialties by Condition
export const WithSearch: Story = {
  args: {
    searchable: true,
    showConditions: true,
    showDetails: true,
    title: 'Fachbereich suchen',
    subtitle: 'Suchen Sie nach Fachbereich oder Erkrankung',
    onSearchChange: (searchTerm) => {
      console.log('Search term:', searchTerm)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Suchfunktion ermöglicht das Finden von Fachbereichen basierend auf Namen, Beschreibungen oder Erkrankungen.'
      }
    }
  }
}

// Detailed Information - Full Medical Context
export const DetailedInformation: Story = {
  args: {
    showDetails: true,
    showDoctorCounts: true,
    showResponseTimes: true,
    showConditions: true,
    showFaqCounts: true,
    title: 'Detaillierte Fachbereichsinformationen',
    subtitle: 'Alle verfügbaren Informationen zu unseren medizinischen Spezialgebieten'
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständige Darstellung mit allen verfügbaren Informationen zu Fachbereichen, Ärzten und Antwortzeiten.'
      }
    }
  }
}

// List Layout - Compact Display
export const ListLayout: Story = {
  args: {
    layout: 'list',
    showDoctorCounts: true,
    showResponseTimes: true,
    title: 'Kompakte Listendarstellung'
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Layout für kompakte Darstellung in seitlichen Bereichen oder mobilen Ansichten.'
      }
    }
  }
}

// Cards Layout - Enhanced Visual Display
export const CardsLayout: Story = {
  args: {
    layout: 'cards',
    showDetails: true,
    showConditions: true,
    showDoctorCounts: true,
    showResponseTimes: true,
    size: 'large',
    title: 'Karten-Darstellung',
    subtitle: 'Erweiterte visuelle Darstellung der Fachbereiche'
  },
  parameters: {
    docs: {
      description: {
        story: 'Karten-Layout mit erweiterten visuellen Elementen und detaillierten Informationen.'
      }
    }
  }
}

// Small Size - Mobile Optimized
export const SmallSize: Story = {
  args: {
    size: 'small',
    layout: 'grid',
    showDoctorCounts: true,
    title: 'Mobile Ansicht'
  },
  parameters: {
    docs: {
      description: {
        story: 'Kleine Größe optimiert für mobile Geräte und begrenzte Bildschirmflächen.'
      }
    }
  }
}

// Large Size - Desktop Experience
export const LargeSize: Story = {
  args: {
    size: 'large',
    layout: 'cards',
    showDetails: true,
    showConditions: true,
    showDoctorCounts: true,
    showResponseTimes: true,
    showFaqCounts: true,
    title: 'Desktop Vollansicht',
    subtitle: 'Optimiert für große Bildschirme mit maximaler Information'
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Größe mit allen verfügbaren Funktionen für Desktop-Anwendungen.'
      }
    }
  }
}

// Loading State - Data Fetching
export const LoadingState: Story = {
  args: {
    loading: true,
    title: 'Fachbereiche werden geladen...',
    subtitle: 'Bitte warten Sie einen Moment'
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Datenabfrage mit Skeleton-Elementen für bessere UX.'
      }
    }
  }
}

// Unavailable Specialties - Limited Availability
export const UnavailableSpecialties: Story = {
  args: {
    specialties: unavailableSpecialties,
    title: 'Begrenzte Verfügbarkeit',
    subtitle: 'Einige Fachbereiche sind derzeit nicht verfügbar',
    showDetails: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Darstellung nicht verfügbarer Fachbereiche mit entsprechender visueller Kennzeichnung.'
      }
    }
  }
}

// Without General Questions - Specialized Only
export const WithoutGeneralQuestions: Story = {
  args: {
    showGeneralQuestions: false,
    title: 'Nur Fachbereiche',
    subtitle: 'Spezialisierte medizinische Beratung',
    showDetails: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Auswahl ohne "Allgemeine Fragen" Option für reine Fachbereichs-Spezialisierung.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    mode: 'single',
    searchable: true,
    showDetails: true,
    showConditions: true,
    showDoctorCounts: true,
    showResponseTimes: true,
    title: 'Interaktive Fachbereichsauswahl',
    subtitle: 'Vollständige Funktionalität mit Such- und Auswahloptionen',
    onSelectionChange: (selectedIds, selectedSpecialties) => {
      alert(`Ausgewählte Fachbereiche:\n${selectedSpecialties.map(s => `- ${s.name}: ${s.description}`).join('\n')}`)
    },
    onSpecialtyClick: (specialty) => {
      console.log('Specialty clicked:', specialty.name)
    },
    onSearchChange: (searchTerm) => {
      console.log('Search for:', searchTerm)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive Auswahl mit allen Event-Handlers und Funktionen für die Integration in die Anwendung.'
      }
    }
  }
}

// Custom Specialties - Extended Medical Areas
export const CustomSpecialties: Story = {
  args: {
    specialties: [
      {
        id: 'dermatologie',
        name: 'Dermatologie',
        description: 'Haut- und Geschlechtskrankheiten',
        details: 'Diagnose und Behandlung von Hauterkrankungen, Allergien und dermatologischen Problemen',
        color: '#06b6d4',
        faqCount: 23,
        doctorCount: 4,
        responseTime: '24h',
        conditions: ['Ekzeme', 'Psoriasis', 'Hautkrebs', 'Allergien'],
        emergencyAvailable: false
      },
      {
        id: 'orthopaedie',
        name: 'Orthopädie',
        description: 'Erkrankungen des Bewegungsapparates',
        details: 'Behandlung von Knochen-, Gelenk- und Muskelerkrankungen',
        color: '#8b5cf6',
        faqCount: 41,
        doctorCount: 9,
        responseTime: '36h',
        conditions: ['Arthrose', 'Bandscheibenvorfall', 'Knochenbrüche', 'Sportverletzungen'],
        emergencyAvailable: true
      }
    ],
    showGeneralQuestions: false,
    title: 'Erweiterte Fachbereiche',
    subtitle: 'Zusätzliche medizinische Spezialgebiete',
    showDetails: true,
    showConditions: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Verwendung benutzerdefinierter Fachbereiche für erweiterte medizinische Gebiete.'
      }
    }
  }
}

// Accessibility Demonstration - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    title: 'Barrierefreie Fachbereichsauswahl',
    subtitle: 'Optimiert für Screen Reader und Tastaturnavigation',
    showDetails: true,
    showConditions: true,
    mode: 'single',
    'aria-label': 'Auswahl des medizinischen Fachbereichs für Ihre Zweitmeinung'
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig barrierefreie Implementierung mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Support.'
      }
    }
  }
}