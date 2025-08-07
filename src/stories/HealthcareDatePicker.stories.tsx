import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareDatePicker, DoctorAvailability, TimeSlot } from './HealthcareDatePicker'

// Extended doctor data for different scenarios
const extendedDoctorData: DoctorAvailability[] = [
  {
    doctorId: 'dr-weber-emergency',
    name: 'Dr. med. Sarah Weber',
    specialty: 'Notfallmedizin',
    timezone: 'Europe/Berlin',
    rating: 4.9,
    availableDates: [
      new Date(2025, 7, 7), // Today
      new Date(2025, 7, 8), // Tomorrow
      new Date(2025, 7, 9), // Day after tomorrow
    ],
    timeSlots: {
      '2025-08-07': [
        {
          id: 'emergency-now',
          startTime: new Date(2025, 7, 7, 15, 0),
          endTime: new Date(2025, 7, 7, 15, 30),
          available: true,
          doctorId: 'dr-weber-emergency',
          doctorName: 'Dr. med. Sarah Weber',
          type: 'emergency',
          cost: 250,
          locationType: 'video',
          isEmergency: true,
          notes: 'Sofort verfügbar - Notfall-Sprechstunde'
        },
        {
          id: 'emergency-today-2',
          startTime: new Date(2025, 7, 7, 18, 0),
          endTime: new Date(2025, 7, 7, 18, 30),
          available: true,
          doctorId: 'dr-weber-emergency',
          doctorName: 'Dr. med. Sarah Weber',
          type: 'emergency',
          cost: 280,
          locationType: 'in-person',
          isEmergency: true,
          notes: 'Präsenz-Notfalltermin verfügbar'
        }
      ],
      '2025-08-08': [
        {
          id: 'emergency-tomorrow',
          startTime: new Date(2025, 7, 8, 8, 0),
          endTime: new Date(2025, 7, 8, 8, 30),
          available: true,
          doctorId: 'dr-weber-emergency',
          doctorName: 'Dr. med. Sarah Weber',
          type: 'emergency',
          cost: 250,
          locationType: 'video',
          isEmergency: true,
          notes: 'Früher Notfall-Termin'
        }
      ]
    }
  },
  {
    doctorId: 'dr-fischer-cardio',
    name: 'Dr. med. Michael Fischer',
    specialty: 'Kardiologie',
    timezone: 'Europe/Berlin',
    rating: 4.7,
    availableDates: [
      new Date(2025, 7, 8),
      new Date(2025, 7, 10),
      new Date(2025, 7, 11),
      new Date(2025, 7, 15),
    ],
    timeSlots: {
      '2025-08-08': [
        {
          id: 'cardio-consult-1',
          startTime: new Date(2025, 7, 8, 9, 0),
          endTime: new Date(2025, 7, 8, 10, 0),
          available: true,
          doctorId: 'dr-fischer-cardio',
          doctorName: 'Dr. med. Michael Fischer',
          type: 'consultation',
          cost: 180,
          locationType: 'in-person',
          requiresPreparation: true,
          notes: 'Bitte EKG und Laborwerte mitbringen'
        },
        {
          id: 'cardio-consult-2',
          startTime: new Date(2025, 7, 8, 14, 30),
          endTime: new Date(2025, 7, 8, 15, 0),
          available: false,
          doctorId: 'dr-fischer-cardio',
          doctorName: 'Dr. med. Michael Fischer',
          type: 'consultation',
          cost: 150,
          locationType: 'video',
          notes: 'Bereits vergeben'
        }
      ],
      '2025-08-10': [
        {
          id: 'cardio-weekend',
          startTime: new Date(2025, 7, 10, 10, 0),
          endTime: new Date(2025, 7, 10, 10, 30),
          available: true,
          doctorId: 'dr-fischer-cardio',
          doctorName: 'Dr. med. Michael Fischer',
          type: 'consultation',
          cost: 200,
          locationType: 'video',
          notes: 'Wochenend-Sprechstunde (Aufpreis)'
        }
      ]
    }
  },
  {
    doctorId: 'dr-hoffmann-onko',
    name: 'Prof. Dr. med. Anna Hoffmann',
    specialty: 'Onkologie',
    timezone: 'Europe/Berlin',
    rating: 5.0,
    availableDates: [
      new Date(2025, 7, 12),
      new Date(2025, 7, 14),
      new Date(2025, 7, 19),
    ],
    timeSlots: {
      '2025-08-12': [
        {
          id: 'onko-expert-1',
          startTime: new Date(2025, 7, 12, 11, 0),
          endTime: new Date(2025, 7, 12, 12, 0),
          available: true,
          doctorId: 'dr-hoffmann-onko',
          doctorName: 'Prof. Dr. med. Anna Hoffmann',
          type: 'consultation',
          cost: 250,
          locationType: 'in-person',
          requiresPreparation: true,
          notes: 'Ausführliche Krebsberatung - Alle Befunde erforderlich'
        },
        {
          id: 'onko-followup',
          startTime: new Date(2025, 7, 12, 15, 0),
          endTime: new Date(2025, 7, 12, 15, 30),
          available: true,
          doctorId: 'dr-hoffmann-onko',
          doctorName: 'Prof. Dr. med. Anna Hoffmann',
          type: 'follow-up',
          cost: 120,
          locationType: 'phone',
          notes: 'Telefonische Nachbesprechung'
        }
      ]
    }
  }
]

// Weekend and holiday test data
const weekendDoctorData: DoctorAvailability[] = [
  {
    doctorId: 'dr-weekend',
    name: 'Dr. med. Weekend Service',
    specialty: 'Allgemeinmedizin',
    timezone: 'Europe/Berlin',
    rating: 4.5,
    availableDates: [
      new Date(2025, 7, 9),  // Saturday
      new Date(2025, 7, 10), // Sunday
      new Date(2025, 7, 16), // Saturday
      new Date(2025, 7, 17), // Sunday
    ],
    timeSlots: {
      '2025-08-09': [
        {
          id: 'weekend-sat',
          startTime: new Date(2025, 7, 9, 9, 0),
          endTime: new Date(2025, 7, 9, 9, 30),
          available: true,
          doctorId: 'dr-weekend',
          doctorName: 'Dr. med. Weekend Service',
          type: 'consultation',
          cost: 180,
          locationType: 'video',
          notes: 'Wochenend-Sprechstunde verfügbar'
        }
      ],
      '2025-08-10': [
        {
          id: 'weekend-sun',
          startTime: new Date(2025, 7, 10, 14, 0),
          endTime: new Date(2025, 7, 10, 14, 30),
          available: true,
          doctorId: 'dr-weekend',
          doctorName: 'Dr. med. Weekend Service',
          type: 'consultation',
          cost: 200,
          locationType: 'video',
          notes: 'Sonntags-Sprechstunde (Aufpreis)'
        }
      ]
    }
  }
]

const meta: Meta<typeof HealthcareDatePicker> = {
  title: 'Healthcare/HealthcareDatePicker',
  component: HealthcareDatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare Date Picker Component - Medizinische Terminbuchung für zweitmeinung.ng

**Healthcare-Optimierungen:**
- Intelligente Arztauswahl mit Fachbereich-Filterung
- Verfügbarkeitskalender mit medizinischen Kontexten
- Notfall-Slot Hervorhebung für kritische Termine
- Zeitzone-Unterstützung für Remote-Konsultationen
- Wochenend- und Feiertags-Berücksichtigung
- WCAG 2.1 AA konform mit 56px+ Touch-Targets

**Terminarten:**
- Consultation - Standard medizinische Beratung
- Follow-up - Nachbesprechung bestehender Behandlung
- Emergency - Notfall-Termine mit Priorisierung
- Surgery - Chirurgische Beratungen mit Vorbereitung

**Beratungsformen:**
- Video - Videosprechstunde (Standard)
- Phone - Telefonberatung für Follow-ups
- In-person - Präsenztermin in der Praxis

**Anwendungsfälle:**
- Zweitmeinungsanfragen mit Facharzt-Auswahl
- Notfall-Terminvereinbarung mit Sofort-Verfügbarkeit
- Routinetermine mit Wochenend-Optionen
- Spezialistenberatung mit Vorbereitungsanforderungen
- Remote-Konsultationen mit Zeitzone-Management

**Accessibility Features:**
- Keyboard Navigation durch Kalender und Zeitslots
- Screen Reader Support für komplexe Terminauswahl
- Touch-optimiert für mobile Healthcare-Nutzer
- High Contrast Mode für medizinische Lesbarkeit
- Reduced Motion Support für empfindliche Nutzer
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline', 'modal'],
      description: 'Layout-Variante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    showDoctorSelection: {
      control: 'boolean',
      description: 'Arztauswahl anzeigen'
    },
    showSlotDetails: {
      control: 'boolean',
      description: 'Termin-Details anzeigen'
    },
    highlightEmergencySlots: {
      control: 'boolean',
      description: 'Notfall-Slots hervorheben'
    },
    showCosts: {
      control: 'boolean',
      description: 'Kosten anzeigen'
    },
    showLocationTypes: {
      control: 'boolean',
      description: 'Beratungsart anzeigen (Video/Telefon/Präsenz)'
    },
    allowEmergencySlots: {
      control: 'boolean',
      description: 'Notfall-Slots erlauben'
    },
    emergencyMode: {
      control: 'boolean',
      description: 'Notfall-Modus (nur Emergency-Slots)'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'default',
    size: 'medium',
    showDoctorSelection: true,
    showSlotDetails: true,
    highlightEmergencySlots: true,
    showCosts: true,
    showLocationTypes: true,
    allowEmergencySlots: true,
    userTimezone: 'Europe/Berlin',
    emergencyMode: false,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareDatePicker>

// Default Story - Standard Medical Appointment Booking
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard medizinische Terminbuchung mit Arztauswahl, Kalender und Zeitslot-Auswahl.'
      }
    }
  }
}

// Emergency Mode - Critical Medical Appointments
export const EmergencyMode: Story = {
  args: {
    doctors: extendedDoctorData,
    emergencyMode: true,
    highlightEmergencySlots: true,
    allowEmergencySlots: true,
    onDoctorSelect: (doctorId) => {
      console.log('Emergency doctor selected:', doctorId)
    },
    onTimeSlotSelect: (timeSlot) => {
      console.log('Emergency slot selected:', timeSlot)
    },
    onConfirm: (appointment) => {
      alert(`🚨 NOTFALL-TERMIN BESTÄTIGT:\nArzt: ${appointment.doctor.name}\nTermin: ${appointment.timeSlot.startTime.toLocaleString('de-DE')}\nTyp: ${appointment.timeSlot.locationType}\nKosten: ${appointment.timeSlot.cost}€`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modus zeigt nur Ärzte und Termine mit Emergency-Verfügbarkeit für kritische medizinische Situationen.'
      }
    }
  }
}

// Extended Doctor Selection - Multiple Specialists
export const ExtendedDoctorSelection: Story = {
  args: {
    doctors: extendedDoctorData,
    showDoctorSelection: true,
    showSlotDetails: true,
    showCosts: true,
    showLocationTypes: true,
    onDoctorSelect: (doctorId) => {
      console.log('Doctor selected:', doctorId)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Erweiterte Arztauswahl mit verschiedenen Fachbereichen: Notfallmedizin, Kardiologie, Onkologie.'
      }
    }
  }
}

// Compact Variant - Sidebar Integration
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    showDoctorSelection: false,
    showSlotDetails: false,
    showCosts: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für Integration in Seitenbereiche mit reduzierter Information.'
      }
    }
  }
}

// Modal Variant - Overlay Appointment Booking
export const ModalVariant: Story = {
  args: {
    variant: 'modal',
    doctors: extendedDoctorData,
    onCancel: () => {
      alert('Terminbuchung abgebrochen')
    },
    onConfirm: (appointment) => {
      alert(`Termin bestätigt: ${appointment.doctor.name} - ${appointment.timeSlot.startTime.toLocaleDateString('de-DE')}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal-Darstellung für Overlay-basierte Terminbuchung mit Schließen-Button.'
      }
    }
  }
}

// Weekend and Holiday Scheduling
export const WeekendHolidayScheduling: Story = {
  args: {
    doctors: weekendDoctorData,
    showCosts: true,
    showLocationTypes: true,
    showSlotDetails: true,
    title: 'Wochenend-Termine',
    subtitle: 'Verfügbare Termine am Wochenende'
  },
  parameters: {
    docs: {
      description: {
        story: 'Wochenend- und Feiertags-Terminbuchung mit speziellen Tarifen und Verfügbarkeiten.'
      }
    }
  }
}

// Large Size - Desktop Experience
export const LargeSize: Story = {
  args: {
    size: 'large',
    doctors: extendedDoctorData,
    showDoctorSelection: true,
    showSlotDetails: true,
    showCosts: true,
    showLocationTypes: true,
    highlightEmergencySlots: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Große Darstellung für Desktop-Anwendungen mit maximaler Informationsdichte.'
      }
    }
  }
}

// No Doctor Selection - Single Specialist
export const SingleSpecialist: Story = {
  args: {
    doctors: [extendedDoctorData[2]], // Only oncologist
    showDoctorSelection: false,
    showSlotDetails: true,
    showCosts: true,
    selectedDoctorId: 'dr-hoffmann-onko'
  },
  parameters: {
    docs: {
      description: {
        story: 'Terminbuchung für einen spezifischen Arzt ohne Auswahlmöglichkeit anderer Spezialisten.'
      }
    }
  }
}

// Cost Focus - Price Transparency
export const CostFocus: Story = {
  args: {
    doctors: extendedDoctorData,
    showCosts: true,
    showSlotDetails: true,
    showLocationTypes: true,
    title: 'Terminbuchung mit Kostenübersicht',
    subtitle: 'Transparente Preise für alle Beratungsarten'
  },
  parameters: {
    docs: {
      description: {
        story: 'Fokus auf Kostentransparenz mit detaillierten Preisen für verschiedene Terminarten.'
      }
    }
  }
}

// Pre-selected Date and Time - Guided Booking
export const PreselectedDateTime: Story = {
  args: {
    doctors: extendedDoctorData,
    selectedDoctorId: 'dr-fischer-cardio',
    selectedDate: new Date(2025, 7, 8),
    showDoctorSelection: false,
    showSlotDetails: true,
    showCosts: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Vordefinierte Arzt- und Datumsauswahl für geführte Terminbuchung aus anderen Bereichen.'
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

// High Information Density - All Features
export const HighInformationDensity: Story = {
  args: {
    size: 'large',
    doctors: extendedDoctorData,
    showDoctorSelection: true,
    showSlotDetails: true,
    highlightEmergencySlots: true,
    showCosts: true,
    showLocationTypes: true,
    allowEmergencySlots: true,
    userTimezone: 'Europe/Berlin'
  },
  parameters: {
    docs: {
      description: {
        story: 'Maximale Informationsdichte mit allen verfügbaren Features für Experten-Nutzung.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    doctors: extendedDoctorData,
    showDoctorSelection: true,
    showSlotDetails: true,
    showCosts: true,
    showLocationTypes: true,
    highlightEmergencySlots: true,
    allowEmergencySlots: true,
    onDoctorSelect: (doctorId) => {
      console.log(`👨‍⚕️ Doctor selected: ${doctorId}`)
      const doctor = extendedDoctorData.find(d => d.doctorId === doctorId)
      if (doctor) {
        console.log('Doctor details:', {
          name: doctor.name,
          specialty: doctor.specialty,
          rating: doctor.rating,
          availableDates: doctor.availableDates.length
        })
      }
    },
    onDateSelect: (date) => {
      console.log(`📅 Date selected: ${date.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`)
    },
    onTimeSlotSelect: (timeSlot) => {
      console.log(`⏰ Time slot selected:`, {
        time: `${timeSlot.startTime.toLocaleTimeString('de-DE')} - ${timeSlot.endTime.toLocaleTimeString('de-DE')}`,
        type: timeSlot.type,
        location: timeSlot.locationType,
        cost: `${timeSlot.cost}€`,
        isEmergency: timeSlot.isEmergency
      })
    },
    onConfirm: (appointment) => {
      const confirmationData = {
        doctor: appointment.doctor.name,
        specialty: appointment.doctor.specialty,
        date: appointment.date.toLocaleDateString('de-DE'),
        time: `${appointment.timeSlot.startTime.toLocaleTimeString('de-DE')} - ${appointment.timeSlot.endTime.toLocaleTimeString('de-DE')}`,
        type: appointment.timeSlot.type,
        location: appointment.timeSlot.locationType,
        cost: appointment.timeSlot.cost,
        notes: appointment.timeSlot.notes
      }
      
      console.log('🎉 Appointment confirmed:', confirmationData)
      
      alert(`✅ TERMIN BESTÄTIGT!

👨‍⚕️ Arzt: ${confirmationData.doctor}
🏥 Fachbereich: ${confirmationData.specialty}
📅 Datum: ${confirmationData.date}
⏰ Zeit: ${confirmationData.time}
📍 Art: ${confirmationData.location === 'video' ? 'Videosprechstunde' : 
           confirmationData.location === 'phone' ? 'Telefonberatung' : 'Präsenztermin'}
💰 Kosten: ${confirmationData.cost}€
📝 Hinweis: ${confirmationData.notes}

Sie erhalten eine Bestätigungs-E-Mail mit allen Details.`)
    },
    onCancel: () => {
      console.log('❌ Appointment booking cancelled')
      if (confirm('Möchten Sie die Terminbuchung wirklich abbrechen?')) {
        alert('Terminbuchung wurde abgebrochen.')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktive Terminbuchung mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}

// Accessibility Demonstration - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Medizinische Terminbuchung für Zweitmeinung',
    doctors: [
      {
        doctorId: 'dr-accessibility',
        name: 'Dr. med. Accessibility Expert',
        specialty: 'Barrierefreie Medizin',
        timezone: 'Europe/Berlin',
        rating: 5.0,
        availableDates: [new Date(2025, 7, 8)],
        timeSlots: {
          '2025-08-08': [
            {
              id: 'accessible-slot',
              startTime: new Date(2025, 7, 8, 10, 0),
              endTime: new Date(2025, 7, 8, 10, 30),
              available: true,
              doctorId: 'dr-accessibility',
              doctorName: 'Dr. med. Accessibility Expert',
              type: 'consultation',
              cost: 150,
              locationType: 'video',
              notes: 'Barrierefreie Beratung mit Screen Reader Support'
            }
          ]
        }
      }
    ],
    showDoctorSelection: true,
    showSlotDetails: true,
    showCosts: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreie Terminbuchung mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Optimierung.'
      }
    }
  }
}