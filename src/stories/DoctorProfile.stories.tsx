import type { Meta, StoryObj } from '@storybook/react'
import { DoctorProfile, Doctor, DoctorReview } from './DoctorProfile'

// Sample doctor data for stories
const sampleDoctor: Doctor = {
  id: 'dr-schmidt-001',
  fullName: 'Dr. med. Maria Schmidt',
  title: 'Dr. med.',
  firstName: 'Maria',
  lastName: 'Schmidt',
  photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
  specialties: [
    {
      id: 'kardiologie',
      name: 'Kardiologie',
      yearsOfExperience: 12,
      boardCertified: true
    },
    {
      id: 'intensivmedizin',
      name: 'Intensivmedizin',
      yearsOfExperience: 8,
      boardCertified: true
    }
  ],
  primarySpecialty: 'kardiologie',
  yearsOfExperience: 15,
  credentials: [
    {
      type: 'degree',
      title: 'Dr. med. (Promotion)',
      institution: 'Ludwig-Maximilians-Universität München',
      year: 2009,
      verified: true
    },
    {
      type: 'board-certification',
      title: 'Facharzt für Innere Medizin und Kardiologie',
      institution: 'Bayerische Landesärztekammer',
      year: 2014,
      verified: true
    },
    {
      type: 'fellowship',
      title: 'Interventionelle Kardiologie',
      institution: 'Deutsches Herzzentrum München',
      year: 2016,
      verified: true
    },
    {
      type: 'award',
      title: 'Preis für herausragende Patientenbetreuung',
      institution: 'Klinikum München',
      year: 2022,
      verified: true
    }
  ],
  languages: [
    { code: 'de', name: 'Deutsch', proficiency: 'native' },
    { code: 'en', name: 'Englisch', proficiency: 'fluent' },
    { code: 'it', name: 'Italienisch', proficiency: 'conversational' }
  ],
  location: {
    city: 'München',
    country: 'Deutschland',
    address: 'Maximilianstraße 12',
    hospital: 'Klinikum München',
    department: 'Kardiologie'
  },
  rating: {
    average: 4.8,
    count: 127,
    distribution: {
      5: 89,
      4: 28,
      3: 7,
      2: 2,
      1: 1
    }
  },
  reviews: [
    {
      id: 'review-001',
      patientName: 'Anna M.',
      rating: 5,
      comment: 'Dr. Schmidt hat mich während meiner Herzoperation außergewöhnlich gut betreut. Ihre Erklärungen waren sehr verständlich und sie nahm sich viel Zeit für alle meine Fragen.',
      date: '2024-02-15',
      specialty: 'Kardiologie',
      verified: true
    },
    {
      id: 'review-002', 
      patientName: 'Thomas K.',
      rating: 5,
      comment: 'Sehr kompetente und einfühlsame Ärztin. Hat schnell die richtige Diagnose gestellt und eine effektive Behandlung eingeleitet.',
      date: '2024-01-28',
      specialty: 'Kardiologie',
      verified: true
    },
    {
      id: 'review-003',
      patientName: 'Elisabeth H.',
      rating: 4,
      comment: 'Fachlich sehr gut, allerdings waren die Wartezeiten etwas länger als erwartet.',
      date: '2024-01-10',
      specialty: 'Kardiologie',
      verified: false
    }
  ],
  bio: 'Dr. Maria Schmidt ist eine erfahrene Kardiologin mit über 15 Jahren klinischer Erfahrung. Sie spezialisiert sich auf interventionelle Kardiologie und Herzinsuffizienz-Behandlung. Nach ihrem Medizinstudium an der LMU München absolvierte sie ihre Facharztausbildung am Klinikum München und erweiterte ihre Kenntnisse durch eine Fellowship in interventioneller Kardiologie am Deutschen Herzzentrum München.',
  researchInterests: ['Interventionelle Kardiologie', 'Herzinsuffizienz', 'Präventive Kardiologie'],
  publicationsCount: 23,
  patientsCount: 1240,
  contact: {
    phone: '+49 89 1234567',
    email: 'dr.schmidt@klinikum-muenchen.de',
    website: 'https://www.klinikum-muenchen.de/kardiologie'
  },
  emergencyAvailable: true,
  onlineConsultationAvailable: true,
  nextAvailableSlot: '2024-03-15T10:30:00',
  memberships: ['Deutsche Gesellschaft für Kardiologie', 'European Society of Cardiology'],
  licenseVerified: true,
  gdprCompliant: true
}

const emergencyDoctor: Doctor = {
  id: 'dr-mueller-002',
  fullName: 'Dr. med. Andreas Müller',
  title: 'Dr. med.',
  firstName: 'Andreas',
  lastName: 'Müller',
  photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
  specialties: [
    {
      id: 'intensivmedizin',
      name: 'Intensivmedizin',
      yearsOfExperience: 10,
      boardCertified: true
    }
  ],
  primarySpecialty: 'intensivmedizin',
  yearsOfExperience: 10,
  credentials: [
    {
      type: 'degree',
      title: 'Dr. med.',
      institution: 'Charité Berlin',
      year: 2014,
      verified: true
    },
    {
      type: 'board-certification',
      title: 'Facharzt für Anästhesiologie und Intensivmedizin',
      institution: 'Ärztekammer Berlin',
      year: 2019,
      verified: true
    }
  ],
  languages: [
    { code: 'de', name: 'Deutsch', proficiency: 'native' },
    { code: 'en', name: 'Englisch', proficiency: 'fluent' }
  ],
  location: {
    city: 'Berlin',
    country: 'Deutschland',
    hospital: 'Charité Campus Virchow',
    department: 'Intensivmedizin'
  },
  rating: {
    average: 4.9,
    count: 56,
    distribution: {
      5: 48,
      4: 6,
      3: 1,
      2: 1,
      1: 0
    }
  },
  bio: 'Dr. Andreas Müller ist Spezialist für Intensivmedizin und Notfallversorgung mit über 10 Jahren Erfahrung.',
  contact: {
    phone: '+49 30 987654321'
  },
  emergencyAvailable: true,
  onlineConsultationAvailable: false,
  licenseVerified: true,
  gdprCompliant: true
}

const meta: Meta<typeof DoctorProfile> = {
  title: 'Healthcare/DoctorProfile',
  component: DoctorProfile,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Doctor Profile Component - Darstellung von Arztprofilen für die zweitmeinung.ng Plattform

**Healthcare-Optimierungen:**
- Vollständige Arztprofile mit Qualifikationen und Erfahrung
- Patientenbewertungen mit Verifikation
- Medizinische Fachbereiche mit Farbkodierung
- Kontaktmöglichkeiten und Terminbuchung
- WCAG 2.1 AA konform mit Screen Reader Support
- DSGVO-konforme Darstellung von Arztinformationen

**Profil-Varianten:**
- Card: Kompakte Karten für Suchergebnisse
- Detailed: Vollständige Profile mit allen Informationen
- Compact: Platzsparende Darstellung für Listen
- List: Horizontale Darstellung für Tabellen

**Medizinische Funktionen:**
- Qualifikationen und Board-Zertifizierungen
- Patientenbewertungen mit Verifikationsstatus
- Verfügbarkeit und Terminbuchung
- Notfall-Verfügbarkeit für kritische Fälle
- Sprachen und internationale Behandlung
- Kontaktdaten mit Datenschutz-Compliance

**Accessibility Features:**
- Screen Reader Support für medizinische Terminologie
- Keyboard Navigation für alle interaktiven Elemente
- High Contrast Mode für bessere Lesbarkeit
- Touch-optimiert für mobile Healthcare-Nutzer
- ARIA-Labels für komplexe medizinische Informationen
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'detailed', 'compact', 'list'],
      description: 'Profil-Darstellungsvariante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showReviews: {
      control: 'boolean',
      description: 'Patientenbewertungen anzeigen'
    },
    showAvailability: {
      control: 'boolean',
      description: 'Verfügbarkeit anzeigen'
    },
    showCredentials: {
      control: 'boolean',
      description: 'Qualifikationen anzeigen'
    },
    showContact: {
      control: 'boolean',
      description: 'Kontaktinformationen anzeigen'
    },
    showRatingDistribution: {
      control: 'boolean',
      description: 'Bewertungsverteilung anzeigen'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Datenschutz-Footer'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus Hervorhebung'
    },
    privacyMode: {
      control: 'boolean',
      description: 'Datenschutz-Modus (versteckt sensible Informationen)'
    },
    interactive: {
      control: 'boolean',
      description: 'Interaktive Elemente aktivieren'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    doctor: sampleDoctor,
    variant: 'card',
    size: 'medium',
    showReviews: false,
    showAvailability: false,
    showCredentials: true,
    showContact: true,
    showRatingDistribution: false,
    medicalContext: true,
    emergencyMode: false,
    privacyMode: false,
    interactive: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof DoctorProfile>

// Default Story - Standard Doctor Card
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard Arztprofil-Karte für Suchergebnisse und Übersichten mit grundlegenden Informationen.'
      }
    }
  }
}

// Detailed Profile - Complete Information
export const DetailedProfile: Story = {
  args: {
    variant: 'detailed',
    size: 'large',
    showReviews: true,
    showCredentials: true,
    showRatingDistribution: true,
    onContactClick: (doctor, contactType) => {
      console.log(`Contact ${doctor.fullName} via ${contactType}`)
    },
    onReviewClick: (review) => {
      console.log('Review clicked:', review.comment)
    },
    onProfileClick: (doctor) => {
      console.log('Profile clicked:', doctor.fullName)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständiges Arztprofil mit allen verfügbaren Informationen, Bewertungen und Qualifikationen.'
      }
    }
  }
}

// Emergency Mode - Critical Care Doctor
export const EmergencyMode: Story = {
  args: {
    doctor: emergencyDoctor,
    variant: 'card',
    emergencyMode: true,
    showCredentials: true,
    showContact: true,
    onContactClick: (doctor, contactType) => {
      if (contactType === 'phone') {
        window.open(`tel:${doctor.contact?.phone}`, '_self')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus für Intensivmediziner mit 24/7 Verfügbarkeit und direkter Kontaktmöglichkeit.'
      }
    }
  }
}

// Compact Display - Space Efficient
export const CompactDisplay: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    showCredentials: false,
    showContact: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für platzbeschränkte Bereiche oder Sidebar-Listen.'
      }
    }
  }
}

// List Layout - Horizontal Display
export const ListLayout: Story = {
  args: {
    variant: 'list',
    showCredentials: false,
    showContact: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontale Listen-Darstellung für Tabellen und strukturierte Übersichten.'
      }
    }
  }
}

// With Patient Reviews - Feedback Display
export const WithPatientReviews: Story = {
  args: {
    variant: 'detailed',
    showReviews: true,
    showRatingDistribution: true,
    showCredentials: false,
    onReviewClick: (review) => {
      alert(`Bewertung von ${review.patientName}:\n"${review.comment}"\n\nBewertung: ${review.rating}/5 Sterne`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Arztprofil mit Fokus auf Patientenbewertungen und Bewertungsverteilung.'
      }
    }
  }
}

// Privacy Mode - GDPR Compliant
export const PrivacyMode: Story = {
  args: {
    privacyMode: true,
    showReviews: false,
    showContact: false,
    medicalContext: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Datenschutz-Modus versteckt sensible Informationen und betont DSGVO-Konformität.'
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
        story: 'Ladezustand während der Datenabfrage mit Skeleton-Elementen für bessere UX.'
      }
    }
  }
}

// Without Photo - Text-Based Profile
export const WithoutPhoto: Story = {
  args: {
    doctor: {
      ...sampleDoctor,
      photoUrl: undefined
    },
    variant: 'card',
    showCredentials: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Arztprofil ohne Foto mit Platzhalter-Icon für Datenschutz oder fehlende Bilder.'
      }
    }
  }
}

// Multiple Specialties - Interdisciplinary Doctor
export const MultipleSpecialties: Story = {
  args: {
    doctor: {
      ...sampleDoctor,
      specialties: [
        ...sampleDoctor.specialties,
        {
          id: 'nephrologie',
          name: 'Nephrologie',
          yearsOfExperience: 5,
          boardCertified: false
        }
      ]
    },
    variant: 'detailed',
    showCredentials: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Arzt mit mehreren Fachbereichen und unterschiedlichen Zertifizierungsstatus.'
      }
    }
  }
}

// International Doctor - Multiple Languages
export const InternationalDoctor: Story = {
  args: {
    doctor: {
      ...sampleDoctor,
      languages: [
        { code: 'de', name: 'Deutsch', proficiency: 'fluent' },
        { code: 'en', name: 'Englisch', proficiency: 'native' },
        { code: 'fr', name: 'Französisch', proficiency: 'fluent' },
        { code: 'es', name: 'Spanisch', proficiency: 'conversational' },
        { code: 'it', name: 'Italienisch', proficiency: 'basic' }
      ],
      location: {
        ...sampleDoctor.location,
        city: 'München (International)'
      }
    },
    variant: 'detailed',
    showCredentials: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Internationaler Arzt mit mehreren Sprachen für internationale Patientenbetreuung.'
      }
    }
  }
}

// High Rating - Top Rated Doctor
export const HighRating: Story = {
  args: {
    doctor: {
      ...sampleDoctor,
      rating: {
        average: 4.9,
        count: 234,
        distribution: {
          5: 201,
          4: 28,
          3: 4,
          2: 1,
          1: 0
        }
      }
    },
    variant: 'card',
    showCredentials: true,
    showRatingDistribution: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Top-bewerteter Arzt mit sehr hoher Patientenzufriedenheit und vielen Bewertungen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    variant: 'detailed',
    size: 'large',
    showReviews: true,
    showCredentials: true,
    showRatingDistribution: true,
    onContactClick: (doctor, contactType) => {
      switch(contactType) {
        case 'phone':
          alert(`Anruf wird gestartet: ${doctor.contact?.phone}`)
          break
        case 'email':
          alert(`E-Mail wird geöffnet: ${doctor.contact?.email}`)
          break
        case 'booking':
          alert(`Terminbuchung für ${doctor.fullName} wird geöffnet`)
          break
      }
    },
    onReviewClick: (review) => {
      console.log('Review details:', review)
    },
    onProfileClick: (doctor) => {
      console.log('Navigate to full profile:', doctor.id)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive Arztprofil mit allen Event-Handlers und Funktionen für die Integration.'
      }
    }
  }
}

// Small Mobile View - Mobile Optimized
export const SmallMobileView: Story = {
  args: {
    size: 'small',
    variant: 'card',
    showCredentials: false,
    showContact: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimierte Darstellung für kleine Bildschirme und Touch-Bedienung.'
      }
    }
  }
}

// Medical Context Footer - GDPR Information
export const MedicalContextFooter: Story = {
  args: {
    variant: 'card',
    medicalContext: true,
    showCredentials: true,
    showContact: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Arztprofil mit medizinischem Kontext-Footer und Datenschutz-Hinweisen.'
      }
    }
  }
}