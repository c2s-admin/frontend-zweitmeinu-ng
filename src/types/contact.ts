// Contact Form Types
export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  specialty?: string
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  preferredContact: 'email' | 'phone' | 'both'
  consent: boolean
  newsletter?: boolean
  captchaToken?: string
}

export interface ContactSubmission {
  id?: number
  attributes?: ContactFormData & {
    status: 'new' | 'in_progress' | 'resolved' | 'archived'
    createdAt: string
    updatedAt: string
    submittedAt: string
    ipAddress?: string
    userAgent?: string
  }
}

export interface ContactAPIResponse {
  data: ContactSubmission
  meta?: Record<string, unknown>
}

export interface ContactAPIError {
  error: {
    status: number
    name: string
    message: string
    details?: {
      errors?: Array<{
        path: string[]
        message: string
        name: string
      }>
    }
  }
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

export interface FormFieldConfig {
  name: keyof Omit<ContactFormData, 'captchaToken'>
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox'
  required: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  }
}

// Medical specialties for the contact form
export const MEDICAL_SPECIALTIES = [
  { value: '', label: 'Fachbereich auswählen...' },
  { value: 'kardiologie', label: 'Kardiologie - Herz & Kreislauf' },
  { value: 'onkologie', label: 'Onkologie - Krebstherapie' },
  { value: 'intensivmedizin', label: 'Intensivmedizin' },
  { value: 'chirurgie', label: 'Chirurgie - Operationen' },
  { value: 'radiologie', label: 'Radiologie - Bildgebung' },
  { value: 'neurologie', label: 'Neurologie' },
  { value: 'orthopaedie', label: 'Orthopädie' },
  { value: 'dermatologie', label: 'Dermatologie' },
  { value: 'paediatrie', label: 'Pädiatrie - Kinderheilkunde' },
  { value: 'other', label: 'Anderer Fachbereich' }
] as const

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Niedrig - Allgemeine Beratung', color: '#10B981' },
  { value: 'medium', label: 'Mittel - Zeitnahe Antwort gewünscht', color: '#F59E0B' },
  { value: 'high', label: 'Hoch - Wichtige medizinische Frage', color: '#EF4444' },
  { value: 'emergency', label: 'Notfall - Sofortige Hilfe benötigt', color: '#DC2626' }
] as const

export const CONTACT_PREFERENCES = [
  { value: 'email', label: 'E-Mail bevorzugt' },
  { value: 'phone', label: 'Telefon bevorzugt' },
  { value: 'both', label: 'E-Mail und Telefon' }
] as const
