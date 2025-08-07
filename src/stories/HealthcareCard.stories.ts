import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareCard } from './HealthcareCard'

const meta: Meta<typeof HealthcareCard> = {
  title: 'Healthcare/Card',
  component: HealthcareCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Card Component - Container für medizinische Inhalte

**Healthcare-Optimierungen:**
- Medizinische Fachbereich-Badges mit Farbkodierung
- Bewertungssystem für Ärzte und Services
- Trust-Indikatoren (DSGVO, Zertifizierungen)
- 56px Touch-Targets für Healthcare-Nutzer
- Status-System für Dringlichkeit und Bearbeitung
- WCAG 2.1 AA konform mit 4.5:1 Kontrast

**Medizinische Spezialisierungen:**
- Kardiologie (rot), Onkologie (lila), Gallenblase (gelb)
- Nephrologie (blau), Schilddrüse (grün), Intensivmedizin (orange)

**Accessibility Features:**
- Semantic HTML (article, headings)
- ARIA Labels für Screen Reader
- Keyboard Navigation
- High Contrast & Reduced Motion Support
        `
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Titel der medizinischen Karte'
    },
    specialty: {
      control: 'select',
      options: ['kardiologie', 'onkologie', 'gallenblase', 'nephrologie', 'schilddruese', 'intensivmedizin', 'allgemeine-fragen'],
      description: 'Medizinischer Fachbereich'
    },
    rating: {
      control: { type: 'range', min: 1, max: 5, step: 0.1 },
      description: 'Bewertung (1-5 Sterne)'
    },
    status: {
      control: 'select',
      options: ['default', 'featured', 'urgent', 'completed', 'disabled'],
      description: 'Status der Karte'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Größe der Karte'
    },
    showAction: {
      control: 'boolean',
      description: 'Action Button anzeigen'
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading-Zustand'
    }
  },
  args: {
    title: 'Kardiologische Untersuchung',
    description: 'Umfassende Herzdiagnostik mit EKG, Echokardiographie und Belastungstest. Erfahrene Fachärzte analysieren Ihre Befunde.',
    specialty: 'kardiologie',
    rating: 4.8,
    reviewCount: 127,
    price: 'Kostenfrei',
    processingTime: '2-3 Werktage',
    size: 'medium',
    showAction: true,
    actionText: 'Jetzt anfragen',
    trustIndicators: [
      { icon: 'shield' as const, label: 'DSGVO-konform' },
      { icon: 'certificate' as const, label: 'Zertifiziert' }
    ]
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareCard>

// Default Story - Kardiologie Service
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Healthcare Card für kardiologische Dienste mit Bewertung und Trust-Indikatoren.'
      }
    }
  }
}

// Doctor Profile Card
export const DoctorProfile: Story = {
  args: {
    title: 'Dr. med. Maria Schmidt',
    description: 'Fachärztin für Kardiologie mit 15 Jahren Erfahrung. Spezialisiert auf interventionelle Kardiologie und Herzchirurgie.',
    specialty: 'kardiologie',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face',
    imageAlt: 'Porträt Dr. med. Maria Schmidt',
    rating: 4.9,
    reviewCount: 89,
    processingTime: 'Verfügbar heute',
    trustIndicators: [
      { icon: 'certificate' as const, label: 'Facharzt' },
      { icon: 'shield' as const, label: 'Schweigepflicht' }
    ],
    actionText: 'Termin buchen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Arztprofil-Karte mit Foto, Credentials und Verfügbarkeit für direkte Terminbuchung.'
      }
    }
  }
}

// Emergency/Urgent Card
export const Emergency: Story = {
  args: {
    title: 'Dringliche Herzrhythmusstörungen',
    description: 'Sofortige fachärztliche Beurteilung bei akuten Herzrhythmusstörungen. 24/7 verfügbare Notfallmediziner.',
    specialty: 'kardiologie',
    status: 'urgent',
    processingTime: 'Sofort verfügbar',
    price: 'Notfalltarif',
    trustIndicators: [
      { icon: 'clock' as const, label: '24/7 Service' }
    ],
    actionText: 'Sofort kontaktieren'
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Karte mit urgency status für dringliche medizinische Situationen.'
      }
    }
  }
}

// Featured/Recommended Service
export const Featured: Story = {
  args: {
    title: 'Präventive Krebsvorsorge',
    description: 'Umfassendes Screening-Programm mit modernster Diagnostik. Früherkennung rettet Leben.',
    specialty: 'onkologie',
    status: 'featured',
    rating: 4.9,
    reviewCount: 203,
    price: 'Ab 89€',
    processingTime: '1-2 Werktage',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    imageAlt: 'Moderne medizinische Diagnostikgeräte',
    trustIndicators: [
      { icon: 'certificate' as const, label: 'Zertifiziertes Labor' },
      { icon: 'shield' as const, label: 'ISO 15189' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Featured Karte für empfohlene Services mit besonderer Hervorhebung und Image.'
      }
    }
  }
}

// Small Card - Mobile Optimized
export const SmallSize: Story = {
  args: {
    size: 'small',
    title: 'Schilddrüsencheck',
    description: 'Schnelle Schilddrüsenfunktionsprüfung',
    specialty: 'schilddruese',
    rating: 4.7,
    reviewCount: 45,
    processingTime: '24h',
    showAction: true,
    actionText: 'Details'
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Karte für mobile Ansichten und Sidebar-Bereiche mit reduzierten Inhalten.'
      }
    }
  }
}

// Large Card - Detailed Information
export const LargeSize: Story = {
  args: {
    size: 'large',
    title: 'Intensivmedizinische Betreuung',
    description: 'Spezialisierte Intensivpflege mit modernster Überwachungstechnologie. 24/7 Betreuung durch erfahrene Intensivmediziner und qualifiziertes Pflegepersonal. Individuelle Therapiepläne für kritische Patienten.',
    specialty: 'intensivmedizin',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop',
    imageAlt: 'Intensivstation mit moderner Medizintechnik',
    rating: 4.9,
    reviewCount: 156,
    price: 'Nach Aufwand',
    processingTime: 'Sofort verfügbar',
    trustIndicators: [
      { icon: 'certificate' as const, label: 'DIN ISO 9001' },
      { icon: 'shield' as const, label: 'Qualitätssiegel' },
      { icon: 'clock' as const, label: '24/7 Verfügbar' }
    ],
    actionText: 'Kontakt aufnehmen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Karte mit ausführlichen Informationen für komplexe medizinische Services.'
      }
    }
  }
}

// Completed Service - Patient History
export const Completed: Story = {
  args: {
    title: 'Gallenblasen-Konsultation',
    description: 'Beratung zu Gallenblasenentfernung durchgeführt. Zweitmeinung erhalten und Therapie erfolgreich abgeschlossen.',
    specialty: 'gallenblase',
    status: 'completed',
    processingTime: 'Abgeschlossen',
    showAction: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Abgeschlossene Behandlung in der Patientenhistorie ohne weitere Aktionen.'
      }
    }
  }
}

// Disabled/Unavailable Service
export const Disabled: Story = {
  args: {
    title: 'Nierentransplantation',
    description: 'Spezialisierte Nierentransplantation derzeit nicht verfügbar. Warteschlange für Organspende.',
    specialty: 'nephrologie',
    status: 'disabled',
    processingTime: 'Nicht verfügbar'
  },
  parameters: {
    docs: {
      description: {
        story: 'Nicht verfügbarer Service mit deaktiviertem Zustand für temporär ausgesetzte Behandlungen.'
      }
    }
  }
}

// Loading State
export const Loading: Story = {
  args: {
    isLoading: true,
    title: 'Medizinische Daten werden geladen...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading-Zustand während medizinische Daten vom Server geladen werden.'
      }
    }
  }
}

// Without Action Button - Information Only
export const InformationOnly: Story = {
  args: {
    title: 'Gesundheitstipps Kardiologie',
    description: 'Präventive Maßnahmen für ein gesundes Herz. Ernährung, Sport und Stressmanagement.',
    specialty: 'kardiologie',
    showAction: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Informationskarte ohne Action Button für reine Gesundheitstipps und Aufklärung.'
      }
    }
  }
}