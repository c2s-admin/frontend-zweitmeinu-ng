import type { Meta, StoryObj } from '@storybook/react'
import { StorySection, PatientStory } from './StorySection'

// Extended patient stories for comprehensive testing
const comprehensivePatientStories: PatientStory[] = [
  {
    id: 'story-cardiac-1',
    patientName: 'Maria Schmidt',
    condition: 'Herzklappenfehler mit Stenose',
    title: 'Dank Zweitmeinung Operation vermieden',
    story: 'Nach der Diagnose eines Herzklappenfehlers war ich verzweifelt. Mein Kardiologe riet zu einer sofortigen Operation mit hohem Risiko. Die Zweitmeinung von zweitmeinung.ng zeigte jedoch, dass eine medikamentöse Behandlung kombiniert mit regelmäßiger Kontrolle ausreichend war. Heute, zwei Jahre später, geht es mir ausgezeichnet und die Klappenfunktion hat sich sogar leicht verbessert.',
    outcome: 'positive',
    ageRange: '55-65',
    treatmentDuration: '6 Monate medikamentös',
    hospital: 'Universitätsklinikum Hamburg-Eppendorf',
    specialty: 'Kardiologie',
    rating: 5,
    date: new Date('2024-07-15'),
    tags: ['Kardiologie', 'Operation vermieden', 'Medikamentöse Therapie', 'Herzklappe'],
    location: 'Hamburg',
    verified: true,
    avatar: '/avatars/maria-s.jpg'
  },
  {
    id: 'story-oncology-1',
    patientName: 'Thomas Müller',
    condition: 'Prostatakrebs (Gleason-Score 6)',
    title: 'Schonendere Therapie dank Expertenrat',
    story: 'Bei der Diagnose Prostatakrebs mit niedrigem Risiko wollte ich sicher sein, die richtige Behandlung zu wählen. Mein Urologe empfahl eine radikale Operation. Die Zweitmeinung bestätigte eine weniger aggressive Therapieform - Active Surveillance mit gezielter Fokus-Therapie. Meine Lebensqualität blieb vollständig erhalten und der Krebs ist nach 18 Monaten nicht mehr nachweisbar.',
    outcome: 'resolved',
    ageRange: '60-70',
    treatmentDuration: '18 Monate Überwachung',
    hospital: 'Charité - Universitätsmedizin Berlin',
    specialty: 'Urologie/Onkologie',
    rating: 5,
    date: new Date('2024-06-20'),
    videoUrl: '/testimonials/thomas-m-prostate-recovery.mp4',
    tags: ['Onkologie', 'Prostatakrebs', 'Active Surveillance', 'Fokus-Therapie'],
    location: 'Berlin',
    verified: true
  },
  {
    id: 'story-orthopedics-1',
    patientName: 'Anna Kowalski',
    condition: 'Bandscheibenvorfall L4/L5',
    title: 'Alternative zu Rücken-OP gefunden',
    story: 'Monatelange Rückenschmerzen mit Ausstrahlung ins Bein führten zur Empfehlung einer Bandscheiben-OP. Ich war skeptisch und suchte eine Zweitmeinung. Der Experte von zweitmeinung.ng schlug eine Kombination aus spezieller Physiotherapie, gezielten PRT-Injektionen und einem strukturierten Bewegungsprogramm vor. Nach 4 Monaten bin ich völlig schmerzfrei - ohne Operation und mit gestärkter Rückenmuskulatur.',
    outcome: 'positive',
    ageRange: '40-50',
    treatmentDuration: '4 Monate konservativ',
    hospital: 'Orthopädische Klinik München-Harlaching',
    specialty: 'Orthopädie/Wirbelsäulenchirurgie',
    rating: 5,
    date: new Date('2024-07-01'),
    tags: ['Orthopädie', 'Bandscheibenvorfall', 'Konservative Therapie', 'Physiotherapie'],
    location: 'München',
    verified: true,
    audioUrl: '/testimonials/anna-k-back-recovery.mp3'
  }
]

// Filtered story collections for different scenarios
const cardiacStories = comprehensivePatientStories.filter(story => 
  story.specialty?.includes('Kardiologie') || story.condition.includes('Herz')
)

const oncologyStories = comprehensivePatientStories.filter(story =>
  story.specialty?.includes('Onkologie') || story.tags?.some(tag => tag.includes('Krebs') || tag.includes('Onkologie'))
)

const surgeryAvoidedStories = comprehensivePatientStories.filter(story =>
  story.tags?.some(tag => tag.includes('Operation vermieden') || tag.includes('Konservative Therapie'))
)

const pediatricStories = comprehensivePatientStories.filter(story =>
  story.specialty?.includes('Kinder') || story.ageRange?.includes('0-10')
)

const meta: Meta<typeof StorySection> = {
  title: 'Healthcare/StorySection',
  component: StorySection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Story Section Component - Patientengeschichten und Erfahrungsberichte

**Healthcare-Optimierungen:**
- Authentische Patientengeschichten mit medizinischen Details
- Vertrauensaufbau durch verifizierte Testimonials und Bewertungen
- Medizinische Kategorien und Fachrichtungen (Kardiologie, Onkologie, etc.)
- Behandlungsergebnisse und Outcome-Tracking
- Video- und Audio-Testimonials für persönliche Verbindung
- WCAG 2.1 AA konform mit Screen Reader Support

**Accessibility Features:**
- Keyboard Navigation durch alle Stories und Filter
- Screen Reader Support mit medizinischen ARIA-Labels  
- Touch-optimiert für Healthcare-Tablets (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Video-Untertitel und Audio-Transkripte verfügbar
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'carousel', 'list', 'featured', 'modal'],
      description: 'Layout-Variante für Story-Darstellung'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    storiesPerPage: {
      control: 'number',
      min: 1,
      max: 20,
      description: 'Anzahl Stories pro Seite'
    },
    showSearch: {
      control: 'boolean',
      description: 'Suchfunktion anzeigen'
    },
    showFilters: {
      control: 'boolean',
      description: 'Filter-Optionen anzeigen'
    },
    showVideoControls: {
      control: 'boolean',
      description: 'Video-Steuerung anzeigen'
    },
    showVerification: {
      control: 'boolean',
      description: 'Verifizierungs-Badges anzeigen'
    },
    showMedicalDetails: {
      control: 'boolean',
      description: 'Medizinische Details anzeigen'
    },
    showRatings: {
      control: 'boolean',
      description: 'Patientenbewertungen anzeigen'
    },
    enableAudio: {
      control: 'boolean',
      description: 'Audio-Testimonials aktivieren'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Disclaimer'
    },
    autoPlayVideo: {
      control: 'boolean',
      description: 'Videos automatisch abspielen'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    },
    onStoryClick: {
      action: 'story-clicked',
      description: 'Story-Klick Handler',
      table: {
        category: 'Events'
      }
    },
    onVideoPlay: {
      action: 'video-played',
      description: 'Video-Wiedergabe Handler',
      table: {
        category: 'Events'
      }
    },
    onVideoPause: {
      action: 'video-paused',
      description: 'Video-Pause Handler',
      table: {
        category: 'Events'
      }
    },
    onAudioToggle: {
      action: 'audio-toggled',
      description: 'Audio-Toggle Handler',
      table: {
        category: 'Events'
      }
    },
    onSearch: {
      action: 'searched',
      description: 'Suche Handler',
      table: {
        category: 'Events'
      }
    },
    onFilter: {
      action: 'filtered',
      description: 'Filter Handler',
      table: {
        category: 'Events'
      }
    },
    onLoadMore: {
      action: 'load-more',
      description: 'Mehr laden Handler',
      table: {
        category: 'Events'
      }
    }
  },
  args: {
    variant: 'grid',
    size: 'medium',
    title: 'Patientengeschichten',
    subtitle: 'Echte Erfahrungen, echte Erfolge',
    description: 'Lesen Sie, wie unsere medizinischen Experten bereits tausenden Patienten zu besseren Behandlungsentscheidungen verholfen haben.',
    stories: comprehensivePatientStories.slice(0, 6),
    storiesPerPage: 6,
    showSearch: true,
    showFilters: true,
    showVideoControls: true,
    showVerification: true,
    showMedicalDetails: true,
    showRatings: true,
    enableAudio: false,
    medicalContext: true,
    autoPlayVideo: false,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof StorySection>

// Default Story - Standard Patient Stories Grid
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Patientengeschichten-Sektion mit Grid-Layout und allen wichtigen medizinischen Details.'
      }
    }
  }
}

// Grid Layout - Card View
export const GridLayout: Story = {
  args: {
    variant: 'grid',
    stories: comprehensivePatientStories,
    storiesPerPage: 9
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid-Layout mit allen verfügbaren Patientengeschichten in Kartenansicht.'
      }
    }
  }
}

// List Layout - Detailed View
export const ListLayout: Story = {
  args: {
    variant: 'list',
    size: 'large',
    stories: comprehensivePatientStories.slice(0, 4),
    showMedicalDetails: true,
    storiesPerPage: 4
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Layout mit detaillierten medizinischen Informationen für jeden Patienten.'
      }
    }
  }
}

// Carousel Layout - Featured Stories
export const CarouselLayout: Story = {
  args: {
    variant: 'carousel',
    title: 'Erfolgsgeschichten unserer Patienten',
    subtitle: 'Inspirierende Heilungsverläufe',
    stories: surgeryAvoidedStories,
    showSearch: false,
    showFilters: false,
    storiesPerPage: 8
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontales Karussell mit Featured Stories, ideal für Homepage-Integration.'
      }
    }
  }
}

// Featured Layout - Hero Story
export const FeaturedLayout: Story = {
  args: {
    variant: 'featured',
    title: 'Herausragende Behandlungserfolge',
    subtitle: 'Wenn eine Zweitmeinung alles verändert',
    stories: [
      comprehensivePatientStories[1], // Oncology story as main
      ...comprehensivePatientStories.slice(0, 3) // Supporting stories
    ],
    showVideoControls: true,
    enableAudio: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Featured-Layout mit einer Hauptgeschichte und kleineren Support-Stories für maximale Wirkung.'
      }
    }
  }
}

// Loading State - Data Fetching
export const LoadingState: Story = {
  args: {
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Abfrage von Patientengeschichten mit Skeleton-Elementen.'
      }
    }
  }
}

// Mobile Optimized - Touch Interface
export const MobileOptimized: Story = {
  args: {
    variant: 'list',
    size: 'small',
    stories: comprehensivePatientStories.slice(0, 4),
    storiesPerPage: 3,
    showSearch: true,
    showFilters: false,
    showMedicalDetails: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung mit Touch-freundlichen Elementen und reduzierter Information.'
      }
    }
  }
}