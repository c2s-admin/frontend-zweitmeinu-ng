import React, { useState, useEffect, useMemo } from 'react'
import { Calendar, Clock, User, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, MapPin, Phone, Video, X } from 'lucide-react'
import './HealthcareDatePicker.css'

export interface TimeSlot {
  /** Time slot identifier */
  id: string
  /** Start time */
  startTime: Date
  /** End time */
  endTime: Date
  /** Slot availability */
  available: boolean
  /** Doctor ID */
  doctorId?: string
  /** Doctor name */
  doctorName?: string
  /** Appointment type */
  type?: 'consultation' | 'follow-up' | 'emergency' | 'surgery'
  /** Cost in EUR */
  cost?: number
  /** Location type */
  locationType?: 'in-person' | 'video' | 'phone'
  /** Special notes */
  notes?: string
  /** Is emergency slot */
  isEmergency?: boolean
  /** Requires preparation */
  requiresPreparation?: boolean
}

export interface DoctorAvailability {
  /** Doctor identifier */
  doctorId: string
  /** Doctor name */
  name: string
  /** Medical specialty */
  specialty: string
  /** Available dates */
  availableDates: Date[]
  /** Time slots per date */
  timeSlots: Record<string, TimeSlot[]>
  /** Timezone */
  timezone?: string
  /** Profile image URL */
  imageUrl?: string
  /** Rating */
  rating?: number
}

export interface HealthcareDatePickerProps {
  /** Available doctors and their schedules */
  doctors?: DoctorAvailability[]
  /** Selected doctor ID */
  selectedDoctorId?: string
  /** Selected date */
  selectedDate?: Date
  /** Selected time slot */
  selectedTimeSlot?: TimeSlot
  /** Minimum date (default: today) */
  minDate?: Date
  /** Maximum date (default: 3 months ahead) */
  maxDate?: Date
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Layout variant */
  variant?: 'default' | 'compact' | 'inline' | 'modal'
  /** Show doctor selection */
  showDoctorSelection?: boolean
  /** Show time slot details */
  showSlotDetails?: boolean
  /** Show emergency slots prominently */
  highlightEmergencySlots?: boolean
  /** Show cost information */
  showCosts?: boolean
  /** Show location types */
  showLocationTypes?: boolean
  /** Allow emergency appointments */
  allowEmergencySlots?: boolean
  /** User's timezone */
  userTimezone?: string
  /** Emergency mode */
  emergencyMode?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** Doctor selection handler */
  onDoctorSelect?: (doctorId: string) => void
  /** Date selection handler */
  onDateSelect?: (date: Date) => void
  /** Time slot selection handler */
  onTimeSlotSelect?: (timeSlot: TimeSlot) => void
  /** Appointment confirmation handler */
  onConfirm?: (appointment: { doctor: DoctorAvailability, date: Date, timeSlot: TimeSlot }) => void
  /** Cancel handler */
  onCancel?: () => void
}

// Default medical specialties and doctors
const defaultDoctors: DoctorAvailability[] = [
  {
    doctorId: 'dr-schmidt-cardio',
    name: 'Dr. med. Maria Schmidt',
    specialty: 'Kardiologie',
    timezone: 'Europe/Berlin',
    rating: 4.9,
    availableDates: [
      new Date(2025, 7, 8), // Today + 1
      new Date(2025, 7, 9), // Today + 2
      new Date(2025, 7, 10), // Today + 3
      new Date(2025, 7, 12), // Today + 5
    ],
    timeSlots: {
      '2025-08-08': [
        {
          id: 'slot-1',
          startTime: new Date(2025, 7, 8, 9, 0),
          endTime: new Date(2025, 7, 8, 9, 30),
          available: true,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'consultation',
          cost: 120,
          locationType: 'video',
          notes: 'Zweitmeinung Herz-OP'
        },
        {
          id: 'slot-2',
          startTime: new Date(2025, 7, 8, 10, 0),
          endTime: new Date(2025, 7, 8, 10, 30),
          available: true,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'consultation',
          cost: 120,
          locationType: 'in-person',
          notes: 'Präsenztermin möglich'
        },
        {
          id: 'slot-3',
          startTime: new Date(2025, 7, 8, 14, 0),
          endTime: new Date(2025, 7, 8, 14, 30),
          available: false,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'consultation',
          cost: 120,
          locationType: 'video'
        },
        {
          id: 'slot-emergency-1',
          startTime: new Date(2025, 7, 8, 16, 0),
          endTime: new Date(2025, 7, 8, 16, 30),
          available: true,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'emergency',
          cost: 200,
          locationType: 'video',
          isEmergency: true,
          notes: 'Notfall-Slot verfügbar'
        }
      ],
      '2025-08-09': [
        {
          id: 'slot-4',
          startTime: new Date(2025, 7, 9, 8, 30),
          endTime: new Date(2025, 7, 9, 9, 0),
          available: true,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'follow-up',
          cost: 80,
          locationType: 'phone',
          notes: 'Nachbesprechung'
        },
        {
          id: 'slot-5',
          startTime: new Date(2025, 7, 9, 11, 0),
          endTime: new Date(2025, 7, 9, 11, 30),
          available: true,
          doctorId: 'dr-schmidt-cardio',
          doctorName: 'Dr. med. Maria Schmidt',
          type: 'consultation',
          cost: 120,
          locationType: 'video'
        }
      ]
    }
  },
  {
    doctorId: 'dr-mueller-onko',
    name: 'Dr. med. Thomas Müller',
    specialty: 'Onkologie',
    timezone: 'Europe/Berlin',
    rating: 4.8,
    availableDates: [
      new Date(2025, 7, 9), // Today + 2
      new Date(2025, 7, 11), // Today + 4
      new Date(2025, 7, 12), // Today + 5
    ],
    timeSlots: {
      '2025-08-09': [
        {
          id: 'slot-onko-1',
          startTime: new Date(2025, 7, 9, 13, 0),
          endTime: new Date(2025, 7, 9, 14, 0),
          available: true,
          doctorId: 'dr-mueller-onko',
          doctorName: 'Dr. med. Thomas Müller',
          type: 'consultation',
          cost: 150,
          locationType: 'in-person',
          requiresPreparation: true,
          notes: 'Bitte Vorbefunde mitbringen'
        }
      ],
      '2025-08-11': [
        {
          id: 'slot-onko-2',
          startTime: new Date(2025, 7, 11, 15, 0),
          endTime: new Date(2025, 7, 11, 15, 30),
          available: true,
          doctorId: 'dr-mueller-onko',
          doctorName: 'Dr. med. Thomas Müller',
          type: 'consultation',
          cost: 150,
          locationType: 'video'
        },
        {
          id: 'slot-onko-emergency',
          startTime: new Date(2025, 7, 11, 18, 0),
          endTime: new Date(2025, 7, 11, 18, 30),
          available: true,
          doctorId: 'dr-mueller-onko',
          doctorName: 'Dr. med. Thomas Müller',
          type: 'emergency',
          cost: 250,
          locationType: 'in-person',
          isEmergency: true,
          notes: 'Notfall-Beratung verfügbar'
        }
      ]
    }
  }
]

// Format date for consistent key usage
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Get location type icon
const getLocationIcon = (locationType?: string) => {
  switch (locationType) {
    case 'video':
      return Video
    case 'phone':
      return Phone
    case 'in-person':
      return MapPin
    default:
      return Video
  }
}

// Get appointment type color
const getAppointmentTypeColor = (type?: string) => {
  switch (type) {
    case 'emergency':
      return '#dc2626'
    case 'surgery':
      return '#ea580c'
    case 'consultation':
      return '#1278B3'
    case 'follow-up':
      return '#10b981'
    default:
      return '#6b7280'
  }
}

// Check if date is weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// Check if date is holiday (simplified German holidays)
const isHoliday = (date: Date): boolean => {
  const month = date.getMonth()
  const day = date.getDate()
  
  // Some German holidays (simplified)
  const holidays = [
    { month: 0, day: 1 },   // New Year
    { month: 4, day: 1 },   // Labor Day
    { month: 9, day: 3 },   // German Unity Day
    { month: 11, day: 25 }, // Christmas Day
    { month: 11, day: 26 }  // Boxing Day
  ]
  
  return holidays.some(holiday => holiday.month === month && holiday.day === day)
}

export const HealthcareDatePicker = ({
  doctors = defaultDoctors,
  selectedDoctorId,
  selectedDate,
  selectedTimeSlot,
  minDate = new Date(),
  maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
  size = 'medium',
  variant = 'default',
  showDoctorSelection = true,
  showSlotDetails = true,
  highlightEmergencySlots = true,
  showCosts = true,
  showLocationTypes = true,
  allowEmergencySlots = true,
  userTimezone = 'Europe/Berlin',
  emergencyMode = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onDoctorSelect,
  onDateSelect,
  onTimeSlotSelect,
  onConfirm,
  onCancel,
  ...props
}: HealthcareDatePickerProps) => {
  const [internalSelectedDoctorId, setInternalSelectedDoctorId] = useState<string>(
    selectedDoctorId || doctors[0]?.doctorId || ''
  )
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate || null)
  const [internalSelectedTimeSlot, setInternalSelectedTimeSlot] = useState<TimeSlot | null>(selectedTimeSlot || null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [confirmationStep, setConfirmationStep] = useState(false)

  const selectedDoctor = doctors.find(d => d.doctorId === internalSelectedDoctorId)
  
  // Filter doctors for emergency mode
  const availableDoctors = emergencyMode 
    ? doctors.filter(doctor => 
        Object.values(doctor.timeSlots).some(slots => 
          slots.some(slot => slot.isEmergency && slot.available)
        )
      )
    : doctors

  // Get available dates for selected doctor
  const availableDates = useMemo(() => {
    if (!selectedDoctor) return []
    
    if (emergencyMode) {
      return selectedDoctor.availableDates.filter(date => {
        const dateKey = formatDateKey(date)
        const slots = selectedDoctor.timeSlots[dateKey] || []
        return slots.some(slot => slot.isEmergency && slot.available)
      })
    }
    
    return selectedDoctor.availableDates.filter(date => date >= minDate && date <= maxDate)
  }, [selectedDoctor, emergencyMode, minDate, maxDate])

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctor || !internalSelectedDate) return []
    
    const dateKey = formatDateKey(internalSelectedDate)
    const slots = selectedDoctor.timeSlots[dateKey] || []
    
    if (emergencyMode) {
      return slots.filter(slot => slot.isEmergency)
    }
    
    return allowEmergencySlots ? slots : slots.filter(slot => !slot.isEmergency)
  }, [selectedDoctor, internalSelectedDate, emergencyMode, allowEmergencySlots])

  const containerClasses = `
    healthcare-datepicker-container
    healthcare-datepicker-container--${size}
    healthcare-datepicker-container--${variant}
    ${emergencyMode ? 'healthcare-datepicker-container--emergency' : ''}
    ${loading ? 'healthcare-datepicker-container--loading' : ''}
    ${confirmationStep ? 'healthcare-datepicker-container--confirmation' : ''}
    ${className}
  `.trim()

  // Handle doctor selection
  const handleDoctorSelect = (doctorId: string) => {
    setInternalSelectedDoctorId(doctorId)
    setInternalSelectedDate(null)
    setInternalSelectedTimeSlot(null)
    setConfirmationStep(false)
    onDoctorSelect?.(doctorId)
  }

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setInternalSelectedDate(date)
    setInternalSelectedTimeSlot(null)
    setConfirmationStep(false)
    onDateSelect?.(date)
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return
    
    setInternalSelectedTimeSlot(timeSlot)
    setConfirmationStep(false)
    onTimeSlotSelect?.(timeSlot)
  }

  // Handle appointment confirmation
  const handleConfirm = () => {
    if (!selectedDoctor || !internalSelectedDate || !internalSelectedTimeSlot) return
    
    onConfirm?.({
      doctor: selectedDoctor,
      date: internalSelectedDate,
      timeSlot: internalSelectedTimeSlot
    })
  }

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1) // Start from Monday

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) { // 6 weeks
      const date = new Date(currentDate)
      const isCurrentMonth = date.getMonth() === month
      const isAvailable = availableDates.some(availableDate => 
        availableDate.toDateString() === date.toDateString()
      )
      const isSelected = internalSelectedDate?.toDateString() === date.toDateString()
      const isPast = date < minDate
      const isWeekendDay = isWeekend(date)
      const isHolidayDay = isHoliday(date)

      days.push({
        date,
        isCurrentMonth,
        isAvailable,
        isSelected,
        isPast,
        isWeekend: isWeekendDay,
        isHoliday: isHolidayDay
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Loading skeleton
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-datepicker-skeleton">
          <div className="healthcare-datepicker-skeleton-header" />
          <div className="healthcare-datepicker-skeleton-calendar" />
          <div className="healthcare-datepicker-skeleton-slots" />
        </div>
      </div>
    )
  }

  // Confirmation step
  if (confirmationStep && selectedDoctor && internalSelectedDate && internalSelectedTimeSlot) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-datepicker-confirmation">
          <div className="healthcare-datepicker-confirmation-header">
            <CheckCircle className="healthcare-datepicker-confirmation-icon" />
            <h3>Termin bestätigen</h3>
          </div>

          <div className="healthcare-datepicker-confirmation-details">
            <div className="healthcare-datepicker-confirmation-doctor">
              <User className="healthcare-datepicker-confirmation-detail-icon" />
              <div>
                <strong>{selectedDoctor.name}</strong>
                <span>{selectedDoctor.specialty}</span>
              </div>
            </div>

            <div className="healthcare-datepicker-confirmation-datetime">
              <Calendar className="healthcare-datepicker-confirmation-detail-icon" />
              <div>
                <strong>
                  {internalSelectedDate.toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </strong>
                <span>
                  {internalSelectedTimeSlot.startTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {internalSelectedTimeSlot.endTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="healthcare-datepicker-confirmation-location">
              {React.createElement(getLocationIcon(internalSelectedTimeSlot.locationType), {
                className: 'healthcare-datepicker-confirmation-detail-icon'
              })}
              <div>
                <strong>
                  {internalSelectedTimeSlot.locationType === 'video' && 'Videosprechstunde'}
                  {internalSelectedTimeSlot.locationType === 'phone' && 'Telefonberatung'}
                  {internalSelectedTimeSlot.locationType === 'in-person' && 'Präsenztermin'}
                </strong>
                <span>{internalSelectedTimeSlot.notes}</span>
              </div>
            </div>

            {showCosts && internalSelectedTimeSlot.cost && (
              <div className="healthcare-datepicker-confirmation-cost">
                <span className="healthcare-datepicker-confirmation-cost-label">Kosten:</span>
                <span className="healthcare-datepicker-confirmation-cost-value">
                  {internalSelectedTimeSlot.cost}€
                </span>
              </div>
            )}
          </div>

          <div className="healthcare-datepicker-confirmation-actions">
            <button
              className="healthcare-datepicker-action healthcare-datepicker-action--secondary"
              onClick={() => setConfirmationStep(false)}
            >
              Zurück
            </button>
            <button
              className="healthcare-datepicker-action healthcare-datepicker-action--primary"
              onClick={handleConfirm}
            >
              Termin bestätigen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Medizinische Terminbuchung'}
      {...props}
    >
      {/* Header */}
      <div className="healthcare-datepicker-header">
        <div className="healthcare-datepicker-title-container">
          <Calendar className="healthcare-datepicker-title-icon" />
          <div>
            <h2 className="healthcare-datepicker-title">
              {emergencyMode ? '🚨 Notfall-Termine' : 'Termin vereinbaren'}
            </h2>
            <p className="healthcare-datepicker-subtitle">
              {emergencyMode 
                ? 'Verfügbare Notfall-Termine' 
                : 'Wählen Sie Ihren gewünschten Termin'
              }
            </p>
          </div>
        </div>

        {onCancel && (
          <button 
            className="healthcare-datepicker-close"
            onClick={onCancel}
            aria-label="Terminbuchung schließen"
          >
            <X />
          </button>
        )}
      </div>

      {/* Doctor Selection */}
      {showDoctorSelection && availableDoctors.length > 1 && (
        <div className="healthcare-datepicker-doctors">
          <h3 className="healthcare-datepicker-section-title">Arzt wählen</h3>
          <div className="healthcare-datepicker-doctor-list">
            {availableDoctors.map(doctor => (
              <div
                key={doctor.doctorId}
                className={`healthcare-datepicker-doctor ${
                  internalSelectedDoctorId === doctor.doctorId
                    ? 'healthcare-datepicker-doctor--selected'
                    : ''
                }`}
                onClick={() => handleDoctorSelect(doctor.doctorId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleDoctorSelect(doctor.doctorId)
                  }
                }}
              >
                <div className="healthcare-datepicker-doctor-info">
                  <h4>{doctor.name}</h4>
                  <span>{doctor.specialty}</span>
                  {doctor.rating && (
                    <div className="healthcare-datepicker-doctor-rating">
                      ⭐ {doctor.rating}
                    </div>
                  )}
                </div>
                {internalSelectedDoctorId === doctor.doctorId && (
                  <CheckCircle className="healthcare-datepicker-doctor-check" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="healthcare-datepicker-calendar">
        <div className="healthcare-datepicker-calendar-header">
          <button
            className="healthcare-datepicker-nav-button"
            onClick={() => navigateMonth('prev')}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft />
          </button>
          
          <h3 className="healthcare-datepicker-month-title">
            {currentMonth.toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long'
            })}
          </h3>

          <button
            className="healthcare-datepicker-nav-button"
            onClick={() => navigateMonth('next')}
            aria-label="Nächster Monat"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="healthcare-datepicker-weekdays">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
            <div key={day} className="healthcare-datepicker-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="healthcare-datepicker-days">
          {calendarDays.map((day, index) => {
            const dayClasses = `
              healthcare-datepicker-day
              ${day.isCurrentMonth ? 'healthcare-datepicker-day--current-month' : 'healthcare-datepicker-day--other-month'}
              ${day.isAvailable ? 'healthcare-datepicker-day--available' : ''}
              ${day.isSelected ? 'healthcare-datepicker-day--selected' : ''}
              ${day.isPast ? 'healthcare-datepicker-day--past' : ''}
              ${day.isWeekend ? 'healthcare-datepicker-day--weekend' : ''}
              ${day.isHoliday ? 'healthcare-datepicker-day--holiday' : ''}
            `.trim()

            return (
              <div
                key={index}
                className={dayClasses}
                onClick={() => day.isAvailable && !day.isPast && handleDateSelect(day.date)}
                role={day.isAvailable && !day.isPast ? 'button' : undefined}
                tabIndex={day.isAvailable && !day.isPast ? 0 : -1}
                aria-label={
                  day.isAvailable 
                    ? `${day.date.toLocaleDateString('de-DE')} - Verfügbar`
                    : `${day.date.toLocaleDateString('de-DE')} - Nicht verfügbar`
                }
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && day.isAvailable && !day.isPast) {
                    e.preventDefault()
                    handleDateSelect(day.date)
                  }
                }}
              >
                <span className="healthcare-datepicker-day-number">
                  {day.date.getDate()}
                </span>
                {day.isHoliday && (
                  <div className="healthcare-datepicker-day-indicator healthcare-datepicker-day-indicator--holiday" />
                )}
                {day.isAvailable && (
                  <div className="healthcare-datepicker-day-indicator healthcare-datepicker-day-indicator--available" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {internalSelectedDate && (
        <div className="healthcare-datepicker-slots">
          <h3 className="healthcare-datepicker-section-title">
            Verfügbare Termine am {internalSelectedDate.toLocaleDateString('de-DE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </h3>

          {availableTimeSlots.length === 0 ? (
            <div className="healthcare-datepicker-no-slots">
              <Clock className="healthcare-datepicker-no-slots-icon" />
              <p>Keine Termine an diesem Tag verfügbar</p>
              <p className="healthcare-datepicker-no-slots-hint">
                Wählen Sie bitte einen anderen Tag oder Arzt
              </p>
            </div>
          ) : (
            <div className="healthcare-datepicker-slot-list">
              {availableTimeSlots.map(slot => {
                const slotClasses = `
                  healthcare-datepicker-slot
                  ${slot.available ? 'healthcare-datepicker-slot--available' : 'healthcare-datepicker-slot--unavailable'}
                  ${slot.isEmergency && highlightEmergencySlots ? 'healthcare-datepicker-slot--emergency' : ''}
                  ${internalSelectedTimeSlot?.id === slot.id ? 'healthcare-datepicker-slot--selected' : ''}
                `.trim()

                return (
                  <div
                    key={slot.id}
                    className={slotClasses}
                    onClick={() => handleTimeSlotSelect(slot)}
                    role="button"
                    tabIndex={slot.available ? 0 : -1}
                    aria-pressed={internalSelectedTimeSlot?.id === slot.id}
                    aria-disabled={!slot.available}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && slot.available) {
                        e.preventDefault()
                        handleTimeSlotSelect(slot)
                      }
                    }}
                  >
                    <div className="healthcare-datepicker-slot-time">
                      <Clock className="healthcare-datepicker-slot-time-icon" />
                      <span className="healthcare-datepicker-slot-time-text">
                        {slot.startTime.toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {slot.endTime.toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="healthcare-datepicker-slot-details">
                      {slot.isEmergency && (
                        <div className="healthcare-datepicker-slot-badge healthcare-datepicker-slot-badge--emergency">
                          <AlertTriangle />
                          Notfall
                        </div>
                      )}
                      
                      <div className="healthcare-datepicker-slot-type">
                        {slot.type === 'consultation' && 'Beratung'}
                        {slot.type === 'follow-up' && 'Nachbesprechung'}
                        {slot.type === 'emergency' && 'Notfall-Beratung'}
                        {slot.type === 'surgery' && 'OP-Beratung'}
                      </div>

                      {showLocationTypes && slot.locationType && (
                        <div className="healthcare-datepicker-slot-location">
                          {React.createElement(getLocationIcon(slot.locationType), {
                            className: 'healthcare-datepicker-slot-location-icon'
                          })}
                          <span>
                            {slot.locationType === 'video' && 'Video'}
                            {slot.locationType === 'phone' && 'Telefon'}
                            {slot.locationType === 'in-person' && 'Vor Ort'}
                          </span>
                        </div>
                      )}

                      {showCosts && slot.cost && (
                        <div className="healthcare-datepicker-slot-cost">
                          {slot.cost}€
                        </div>
                      )}
                    </div>

                    {showSlotDetails && slot.notes && (
                      <div className="healthcare-datepicker-slot-notes">
                        {slot.notes}
                      </div>
                    )}

                    {slot.requiresPreparation && (
                      <div className="healthcare-datepicker-slot-preparation">
                        <AlertTriangle className="healthcare-datepicker-slot-preparation-icon" />
                        <span>Vorbereitung erforderlich</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {internalSelectedTimeSlot && (
        <div className="healthcare-datepicker-actions">
          <button
            className="healthcare-datepicker-action healthcare-datepicker-action--secondary"
            onClick={() => {
              setInternalSelectedDate(null)
              setInternalSelectedTimeSlot(null)
            }}
          >
            Zurücksetzen
          </button>
          <button
            className="healthcare-datepicker-action healthcare-datepicker-action--primary"
            onClick={() => setConfirmationStep(true)}
          >
            Weiter zur Bestätigung
          </button>
        </div>
      )}
    </div>
  )
}

HealthcareDatePicker.displayName = 'HealthcareDatePicker'