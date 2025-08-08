import type { Meta, StoryObj } from '@storybook/react'
import { MedicalFAQ, FAQ } from './MedicalFAQ'
import { Search, ChevronDown, Plus, Minus, Filter, X } from 'lucide-react'

// Sample FAQ data for different scenarios
const emergencyFAQs: FAQ[] = [
  {
    id: 'emergency-heart-symptoms',
    question: 'Was sind Notfall-Symptome bei Herzproblemen?',
    answer: 'Rufen Sie sofort 112 bei: starke Brustschmerzen, Atemnot, Übelkeit mit Brustschmerzen, Schmerzen im Arm/Kiefer, kalter Schweiß. Bei akuten Herzproblemen ist keine Zeit für eine Zweitmeinung - gehen Sie sofort ins Krankenhaus!',
    category: 'Notfall',
    specialty: 'kardiologie',
    tags: ['notfall', 'herzinfarkt', 'brustschmerzen', '112', 'atemnot'],
    viewCount: 234,
    importance: 'critical',
    medicallyVerified: true,
    audience: 'general'
  },
  {
    id: 'stroke-symptoms',
    question: 'Wie erkenne ich einen Schlaganfall?',
    answer: 'FAST-Test: Face (hängender Mundwinkel), Arms (Arm sinkt ab), Speech (undeutliche Sprache), Time (sofort 112 rufen). Weitere Symptome: plötzliche Lähmung, Sehstörungen, starke Kopfschmerzen, Schwindel. Jede Minute zählt!',
    category: 'Notfall',
    specialty: 'intensivmedizin',
    tags: ['schlaganfall', 'fast-test', 'lähmung', 'notfall'],
    viewCount: 156,
    importance: 'critical',
    medicallyVerified: true,
    audience: 'general'
  }
]

const cardiologyFAQs: FAQ[] = [
  {
    id: 'heart-surgery-zweitmeinung',
    question: 'Sollte ich vor einer Herzoperation eine Zweitmeinung einholen?',
    answer: 'Bei geplanten Herz-OPs ist eine Zweitmeinung sehr empfehlenswert. Kardiochirurgische Eingriffe sind komplex und verschiedene Behandlungsansätze möglich. Eine zweite Expertenmeinung kann alternative Therapien aufzeigen oder die geplante Operation bestätigen.',
    category: 'Kardiologie',
    specialty: 'kardiologie',
    tags: ['herzoperation', 'kardiochirurgie', 'herzeingriff'],
    relatedIds: ['when-need-zweitmeinung', 'emergency-heart-symptoms'],
    viewCount: 423,
    importance: 'high',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'heart-medication-side-effects',
    question: 'Welche Nebenwirkungen haben Herzmedikamente?',
    answer: 'Häufige Nebenwirkungen von Herzmedikamenten können sein: Müdigkeit, Schwindel, niedriger Blutdruck, Husten (bei ACE-Hemmern), Schwellungen. Wichtig: Setzen Sie Medikamente nie ohne Rücksprache ab. Bei Nebenwirkungen kontaktieren Sie Ihren Arzt.',
    category: 'Kardiologie',
    specialty: 'kardiologie',
    tags: ['medikamente', 'nebenwirkungen', 'herzmedizin'],
    relatedIds: ['heart-surgery-zweitmeinung'],
    viewCount: 287,
    importance: 'medium',
    medicallyVerified: true,
    audience: 'patient'
  }
]

const searchableFAQs: FAQ[] = [
  {
    id: 'diabetes-management',
    question: 'Wie kann ich meinen Diabetes besser kontrollieren?',
    answer: 'Diabetes-Management umfasst: regelmäßige Blutzuckermessung, gesunde Ernährung, körperliche Aktivität, Medikamenten-Compliance, regelmäßige Arzttermine. Eine strukturierte Schulung und kontinuierliches Monitoring sind essentiell.',
    category: 'Endokrinologie',
    specialty: 'allgemeine-fragen',
    tags: ['diabetes', 'blutzucker', 'ernährung', 'bewegung', 'selbstmanagement'],
    viewCount: 634,
    importance: 'high',
    medicallyVerified: true,
    audience: 'patient'
  },
  {
    id: 'blood-pressure-control',
    question: 'Was kann ich gegen hohen Blutdruck tun?',
    answer: 'Bluthochdruck-Kontrolle: salzarme Ernährung, regelmäßiger Sport, Gewichtsreduktion, Stressmanagement, Verzicht auf Rauchen, moderate Alkoholmengen. Medikamente nach ärztlicher Verordnung konsequent einnehmen.',
    category: 'Kardiologie',
    specialty: 'kardiologie',
    tags: ['bluthochdruck', 'ernährung', 'sport', 'lifestyle', 'medikamente'],
    viewCount: 512,
    importance: 'high',
    medicallyVerified: true,
    audience: 'patient'
  }
]

const meta: Meta<typeof MedicalFAQ> = {
  title: 'Healthcare/MedicalFAQ',
  component: MedicalFAQ,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Medical FAQ Component - Interaktive Q&A-Plattform für medizinische Zweitmeinungen

**Healthcare-Optimierungen:**
- Intelligente Kategorisierung nach medizinischen Fachbereichen
- Echtzeit-Suchfunktion für Symptome und Erkrankungen
- Medizinische Verifikations-Badges für ärztlich geprüfte Inhalte
- Wichtigkeits-Level (Critical, High, Medium, Low) für Priorisierung
- Verwandte Fragen-Algorithmus für bessere Navigation
- WCAG 2.1 AA konform mit Screen Reader Support

**Medizinische Kategorien:**
- Allgemein - Grundlegende Informationen zu medizinischen Zweitmeinungen
- Kardiologie - Herz- und Kreislauferkrankungen
- Onkologie - Krebserkrankungen und Tumore
- Notfall - Kritische medizinische Situationen (Emergency Mode)
- Prozess - Ablauf und Durchführung von Zweitmeinungen
- Kosten - Kostenübernahme und Versicherungsfragen

**Anwendungsfälle:**
- Patienten-Aufklärung über Zweitmeinungsprozess
- Medizinische Wissensdatenbank mit Suchfunktion
- Notfall-Informationen mit kritischen Symptomen
- FAQ-Support für Healthcare-Plattformen
- Arzt-Patienten-Kommunikation zur Vorbereitung

**Accessibility Features:**
- Keyboard Navigation (Tab, Enter, Space für Expand/Collapse)
- Screen Reader Support mit ARIA-Labels und Regions
- High Contrast Mode für medizinische Lesbarkeit
- Touch-optimiert für mobile Healthcare-Nutzer (56px+ Targets)
- Reduced Motion Support für empfindliche Nutzer
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'cards', 'list'],
      description: 'Layout-Variante für verschiedene Anwendungsfälle'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    searchable: {
      control: 'boolean',
      description: 'Suchfunktion aktivieren'
    },
    showCategoryFilter: {
      control: 'boolean',
      description: 'Kategorie-Filter anzeigen'
    },
    showRelatedQuestions: {
      control: 'boolean',
      description: 'Verwandte Fragen anzeigen'
    },
    showViewCounts: {
      control: 'boolean',
      description: 'Aufrufzahlen anzeigen'
    },
    showVerificationBadges: {
      control: 'boolean',
      description: 'Ärztliche Verifikations-Badges anzeigen'
    },
    showImportanceLevels: {
      control: 'boolean',
      description: 'Wichtigkeits-Level anzeigen'
    },
    autoExpandImportant: {
      control: 'boolean',
      description: 'Wichtige FAQs automatisch aufklappen'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus (nur kritische FAQs)'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'default',
    size: 'medium',
    searchable: true,
    showCategoryFilter: true,
    showSpecialtyFilter: false,
    showRelatedQuestions: true,
    showViewCounts: false,
    showVerificationBadges: true,
    showImportanceLevels: true,
    maxRelatedQuestions: 3,
    autoExpandImportant: true,
    emergencyMode: false,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MedicalFAQ>

// Default Story - Standard Medical FAQ Platform
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard medizinische FAQ-Plattform mit allen Default-Funktionen für die zweitmeinung.ng Website.'
      }
    }
  }
}

// Emergency Mode - Critical Medical Situations
export const EmergencyMode: Story = {
  args: {
    emergencyMode: true,
    faqs: emergencyFAQs,
    autoExpandImportant: true,
    showImportanceLevels: true,
    showVerificationBadges: true,
    onFAQToggle: (faqId, expanded) => {
      console.log(`Emergency FAQ ${faqId} ${expanded ? 'expanded' : 'collapsed'}`)
    },
    onFAQClick: (faq) => {
      console.log('Emergency FAQ clicked:', faq.question)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus zeigt nur kritische medizinische FAQs mit sofortigen Handlungsanweisungen.'
      }
    }
  }
}

// With Search and Filtering - Interactive Experience
export const WithSearchAndFiltering: Story = {
  args: {
    searchable: true,
    showCategoryFilter: true,
    showSpecialtyFilter: false,
    faqs: [...cardiologyFAQs, ...searchableFAQs],
    searchTerm: '',
    onSearchChange: (searchTerm) => {
      console.log('Search term:', searchTerm)
    },
    onCategoryChange: (categories) => {
      console.log('Selected categories:', categories)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive FAQ-Suche mit Kategorie-Filtern für effiziente medizinische Information.'
      }
    }
  }
}

// Cardiology Focused - Specialty FAQs
export const CardiologyFocused: Story = {
  args: {
    faqs: cardiologyFAQs,
    selectedCategories: ['Kardiologie'],
    showRelatedQuestions: true,
    showViewCounts: true,
    showVerificationBadges: true,
    title: 'Kardiologie FAQ',
    subtitle: 'Häufige Fragen zu Herzerkrankungen und Behandlungen'
  },
  parameters: {
    docs: {
      description: {
        story: 'Spezialisierte FAQ-Sammlung für Kardiologie mit verwandten Fragen und Expertenwissen.'
      }
    }
  }
}

// Compact Variant - Sidebar Integration
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    showCategoryFilter: false,
    showRelatedQuestions: false,
    showViewCounts: false,
    showImportanceLevels: false,
    maxRelatedQuestions: 2
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für Integration in Seitenbereiche oder mobile Ansichten.'
      }
    }
  }
}

// Cards Layout - Visual Enhancement
export const CardsLayout: Story = {
  args: {
    variant: 'cards',
    size: 'large',
    showCategoryFilter: true,
    showRelatedQuestions: true,
    showViewCounts: true,
    showVerificationBadges: true,
    showImportanceLevels: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Karten-Layout mit verbesserter visueller Darstellung für Desktop-Anwendungen.'
      }
    }
  }
}

// List Layout - Minimal Design
export const ListLayout: Story = {
  args: {
    variant: 'list',
    showCategoryFilter: true,
    showRelatedQuestions: false,
    showViewCounts: false,
    showImportanceLevels: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Layout für minimale Darstellung mit Fokus auf Inhalte.'
      }
    }
  }
}

// Mobile Optimized - Touch Friendly
export const MobileOptimized: Story = {
  args: {
    size: 'small',
    variant: 'default',
    searchable: true,
    showCategoryFilter: true,
    showRelatedQuestions: true,
    maxRelatedQuestions: 2,
    autoExpandImportant: false // Better for mobile UX
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung mit Touch-freundlichen Interaktionen.'
      }
    }
  }
}

// High Information Density - All Features
export const HighInformationDensity: Story = {
  args: {
    variant: 'cards',
    size: 'large',
    searchable: true,
    showCategoryFilter: true,
    showSpecialtyFilter: true,
    showRelatedQuestions: true,
    showViewCounts: true,
    showVerificationBadges: true,
    showImportanceLevels: true,
    maxRelatedQuestions: 5,
    autoExpandImportant: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Maximale Informationsdichte mit allen verfügbaren Features für Experten-Nutzung.'
      }
    }
  }
}

// Auto-Expanded Important - Pre-opened Critical FAQs
export const AutoExpandedImportant: Story = {
  args: {
    autoExpandImportant: true,
    showImportanceLevels: true,
    showVerificationBadges: true,
    faqs: [...emergencyFAQs, ...cardiologyFAQs].slice(0, 4)
  },
  parameters: {
    docs: {
      description: {
        story: 'Automatisch aufgeklappte wichtige FAQs für sofortige Sichtbarkeit kritischer Informationen.'
      }
    }
  }
}

// Search Demonstration - Pre-filled Search
export const SearchDemonstration: Story = {
  args: {
    searchTerm: 'herz',
    searchable: true,
    showCategoryFilter: true,
    faqs: [...cardiologyFAQs, ...searchableFAQs],
    onSearchChange: (searchTerm) => {
      console.log('Searching for:', searchTerm)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration der Suchfunktion mit vorausgefülltem Suchbegriff "herz".'
      }
    }
  }
}

// Related Questions Focus - Navigation Enhancement
export const RelatedQuestionsFocus: Story = {
  args: {
    showRelatedQuestions: true,
    maxRelatedQuestions: 4,
    autoExpandImportant: true,
    faqs: [
      {
        id: 'main-question',
        question: 'Was ist eine medizinische Zweitmeinung?',
        answer: 'Eine medizinische Zweitmeinung ist die unabhängige Einschätzung eines zweiten Arztes zu Ihrer Diagnose oder Behandlung.',
        category: 'Allgemein',
        specialty: 'allgemeine-fragen',
        tags: ['zweitmeinung', 'diagnose'],
        relatedIds: ['related-1', 'related-2', 'related-3', 'related-4'],
        importance: 'high',
        medicallyVerified: true,
        audience: 'general'
      },
      {
        id: 'related-1',
        question: 'Wann sollte ich eine Zweitmeinung einholen?',
        answer: 'Bei schwerwiegenden Diagnosen oder vor größeren Operationen.',
        category: 'Allgemein',
        importance: 'medium',
        medicallyVerified: true,
        audience: 'patient'
      },
      {
        id: 'related-2',
        question: 'Wie läuft der Prozess ab?',
        answer: 'Nach der Anmeldung erhalten Sie einen Fragebogen und können Befunde hochladen.',
        category: 'Prozess',
        importance: 'medium',
        medicallyVerified: true,
        audience: 'patient'
      },
      {
        id: 'related-3',
        question: 'Übernimmt die Krankenkasse die Kosten?',
        answer: 'In vielen Fällen ja, besonders bei bestimmten medizinischen Eingriffen.',
        category: 'Kosten',
        importance: 'high',
        medicallyVerified: true,
        audience: 'patient'
      },
      {
        id: 'related-4',
        question: 'Welche Unterlagen benötige ich?',
        answer: 'Arztbriefe, Laborwerte, Bildgebung und aktuelle Medikamentenliste.',
        category: 'Unterlagen',
        importance: 'medium',
        medicallyVerified: true,
        audience: 'patient'
      }
    ],
    onFAQToggle: (faqId, expanded) => {
      console.log(`FAQ ${faqId} navigation:`, expanded ? 'opened' : 'closed')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokus auf verwandte Fragen-Funktionalität zur Verbesserung der Navigation zwischen medizinischen Themen.'
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
        story: 'Ladezustand während der FAQ-Datenabfrage mit Skeleton-Elementen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    searchable: true,
    showCategoryFilter: true,
    showRelatedQuestions: true,
    showViewCounts: true,
    showVerificationBadges: true,
    showImportanceLevels: true,
    autoExpandImportant: true,
    onFAQToggle: (faqId, expanded) => {
      console.log(`FAQ Toggle: ${faqId} - ${expanded ? 'Expanded' : 'Collapsed'}`)
    },
    onSearchChange: (searchTerm) => {
      console.log(`Search: "${searchTerm}"`)
      // Simulate search analytics
      if (searchTerm.length > 2) {
        console.log('📊 Search Analytics:', {
          term: searchTerm,
          timestamp: new Date().toISOString(),
          category: 'FAQ_Search'
        })
      }
    },
    onCategoryChange: (categories) => {
      console.log('Category Filter:', categories)
    },
    onFAQClick: (faq) => {
      console.log(`FAQ Clicked: "${faq.question}"`)
      // Simulate view tracking
      console.log('📈 FAQ Analytics:', {
        faqId: faq.id,
        category: faq.category,
        importance: faq.importance,
        medicallyVerified: faq.medicallyVerified,
        timestamp: new Date().toISOString()
      })
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive FAQ-Komponente mit allen Event-Handlers und Analytics für die Produktionsintegration.'
      }
    }
  }
}

// Accessibility Demonstration - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Medizinische FAQ-Datenbank für Zweitmeinungen',
    searchable: true,
    showCategoryFilter: true,
    showRelatedQuestions: true,
    showVerificationBadges: true,
    showImportanceLevels: true,
    faqs: [
      {
        id: 'accessibility-example',
        question: 'Wie ist die Barrierefreiheit der Plattform gewährleistet?',
        answer: 'Unsere Plattform folgt den WCAG 2.1 AA-Richtlinien mit Screen Reader Support, Keyboard Navigation, High Contrast Modi und Touch-optimierten Bedienelementen für Healthcare-Nutzer.',
        category: 'Barrierefreiheit',
        specialty: 'allgemeine-fragen',
        tags: ['wcag', 'accessibility', 'screen-reader', 'keyboard'],
        importance: 'high',
        medicallyVerified: true,
        audience: 'general'
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreie FAQ-Implementierung mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Optimierung.'
      }
    }
  }
}