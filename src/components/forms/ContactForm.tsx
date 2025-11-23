'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import type { ContactFormData } from '@/types/contact'
import { MEDICAL_SPECIALTIES, URGENCY_LEVELS, CONTACT_PREFERENCES } from '@/types/contact'
import { AlertCircle, CheckCircle, Loader2, Mail, Phone, User, MessageSquare } from 'lucide-react'

interface ContactFormProps {
  onSuccess?: () => void
  className?: string
}

export function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    defaultValues: {
      urgency: 'medium',
      preferredContact: 'email',
      consent: false,
      newsletter: false
    }
  })

  const urgency = watch('urgency')
  const captchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === 'true' &&
                         process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY !== undefined

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Get CAPTCHA token if enabled
      let captchaToken: string | undefined
      if (captchaEnabled && captchaRef.current) {
        captchaToken = await captchaRef.current.execute({ async: true })
      }

      // Submit form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          captchaToken
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Senden der Nachricht')
      }

      // Success
      setSubmitSuccess(true)
      reset()

      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }

      if (onSuccess) {
        onSuccess()
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)

    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten'
      )

      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get urgency color for visual feedback
  const getUrgencyColor = (level: string) => {
    const urgencyData = URGENCY_LEVELS.find(u => u.value === level)
    return urgencyData?.color || '#1278B3'
  }

  return (
    <div className={`healthcare-contact-form ${className}`}>
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-green-900 font-medium text-lg mb-1">
              ✓ Nachricht erfolgreich gesendet!
            </h3>
            <p className="text-green-700 text-sm">
              Vielen Dank für Ihre Kontaktanfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 mb-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-900 font-medium text-lg mb-1">Fehler beim Senden</h3>
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Emergency Notice for high urgency */}
      {urgency === 'emergency' && (
        <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-6 mb-6">
          <h3 className="text-red-900 font-medium text-lg mb-2 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            ⚠️ Medizinischer Notfall
          </h3>
          <p className="text-red-800 mb-3">
            Bei lebensbedrohlichen Situationen wenden Sie sich bitte sofort an:
          </p>
          <div className="space-y-2 text-red-900 font-medium">
            <div>📞 <a href="tel:112" className="underline hover:text-red-700">Notruf: 112</a></div>
            <div>📞 <a href="tel:116117" className="underline hover:text-red-700">Ärztlicher Bereitschaftsdienst: 116 117</a></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-healthcare-primary text-xl font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Persönliche Daten
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="field-group">
              <label htmlFor="firstName" className="block text-sm font-medium text-healthcare-primary mb-2">
                Vorname <span className="text-red-600">*</span>
              </label>
              <input
                {...register('firstName', {
                  required: 'Vorname ist erforderlich',
                  minLength: { value: 2, message: 'Mindestens 2 Zeichen' },
                  maxLength: { value: 50, message: 'Maximal 50 Zeichen' }
                })}
                id="firstName"
                type="text"
                className={`w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Ihr Vorname"
                aria-invalid={errors.firstName ? 'true' : 'false'}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="field-group">
              <label htmlFor="lastName" className="block text-sm font-medium text-healthcare-primary mb-2">
                Nachname <span className="text-red-600">*</span>
              </label>
              <input
                {...register('lastName', {
                  required: 'Nachname ist erforderlich',
                  minLength: { value: 2, message: 'Mindestens 2 Zeichen' },
                  maxLength: { value: 50, message: 'Maximal 50 Zeichen' }
                })}
                id="lastName"
                type="text"
                className={`w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Ihr Nachname"
                aria-invalid={errors.lastName ? 'true' : 'false'}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="field-group mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-healthcare-primary mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Mail-Adresse <span className="text-red-600">*</span>
            </label>
            <input
              {...register('email', {
                required: 'E-Mail-Adresse ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse'
                }
              })}
              id="email"
              type="email"
              className={`w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="ihre.email@beispiel.de"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="field-group mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-healthcare-primary mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefonnummer <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              {...register('phone', {
                pattern: {
                  value: /^(\+49|0)[1-9]\d{1,14}$/,
                  message: 'Bitte geben Sie eine gültige deutsche Telefonnummer ein'
                }
              })}
              id="phone"
              type="tel"
              className={`w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light ${
                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="+49 800 80 44 100"
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Message Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-healthcare-primary text-xl font-medium mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ihre Nachricht
          </h3>

          {/* Subject */}
          <div className="field-group mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-healthcare-primary mb-2">
              Betreff <span className="text-red-600">*</span>
            </label>
            <input
              {...register('subject', {
                required: 'Betreff ist erforderlich',
                minLength: { value: 5, message: 'Mindestens 5 Zeichen' },
                maxLength: { value: 200, message: 'Maximal 200 Zeichen' }
              })}
              id="subject"
              type="text"
              className={`w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light ${
                errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Kurze Zusammenfassung Ihres Anliegens"
              aria-invalid={errors.subject ? 'true' : 'false'}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Specialty (Optional) */}
          <div className="field-group mb-4">
            <label htmlFor="specialty" className="block text-sm font-medium text-healthcare-primary mb-2">
              Fachbereich <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <select
              {...register('specialty')}
              id="specialty"
              className="w-full min-h-[56px] px-4 py-3 rounded-lg border-2 border-gray-300 bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light"
              aria-label="Medizinischer Fachbereich"
            >
              {MEDICAL_SPECIALTIES.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div className="field-group mb-4">
            <label htmlFor="urgency" className="block text-sm font-medium text-healthcare-primary mb-2">
              Dringlichkeit <span className="text-red-600">*</span>
            </label>
            <select
              {...register('urgency', { required: 'Bitte wählen Sie eine Dringlichkeitsstufe' })}
              id="urgency"
              className="w-full min-h-[56px] px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light"
              style={{
                borderColor: urgency ? getUrgencyColor(urgency) : '#d1d5db',
                backgroundColor: '#ffffff'
              }}
              aria-label="Dringlichkeitsstufe der Anfrage"
            >
              {URGENCY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.urgency && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.urgency.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="field-group mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-healthcare-primary mb-2">
              Nachricht <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register('message', {
                required: 'Nachricht ist erforderlich',
                minLength: { value: 20, message: 'Mindestens 20 Zeichen' },
                maxLength: { value: 2000, message: 'Maximal 2000 Zeichen' }
              })}
              id="message"
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light resize-y ${
                errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Bitte beschreiben Sie Ihr Anliegen so detailliert wie möglich..."
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
            />
            <div id="message-help" className="mt-2 text-xs text-gray-600">
              Alle Angaben werden vertraulich behandelt (DSGVO-konform)
            </div>
            {errors.message && (
              <p id="message-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="field-group">
            <label htmlFor="preferredContact" className="block text-sm font-medium text-healthcare-primary mb-2">
              Bevorzugter Kontaktweg <span className="text-red-600">*</span>
            </label>
            <select
              {...register('preferredContact', { required: 'Bitte wählen Sie einen Kontaktweg' })}
              id="preferredContact"
              className="w-full min-h-[56px] px-4 py-3 rounded-lg border-2 border-gray-300 bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:border-healthcare-primary-light"
              aria-label="Bevorzugter Kommunikationsweg"
            >
              {CONTACT_PREFERENCES.map((pref) => (
                <option key={pref.value} value={pref.value}>
                  {pref.label}
                </option>
              ))}
            </select>
            {errors.preferredContact && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.preferredContact.message}
              </p>
            )}
          </div>
        </div>

        {/* GDPR Consent & Newsletter */}
        <div className="bg-healthcare-background rounded-2xl p-6 border border-gray-200">
          <div className="space-y-4">
            {/* Privacy Consent (Required) */}
            <div className="flex items-start gap-3">
              <input
                {...register('consent', {
                  required: 'Zustimmung zur Datenschutzerklärung ist erforderlich'
                })}
                id="consent"
                type="checkbox"
                className="mt-1 w-5 h-5 min-w-[20px] min-h-[20px] rounded border-2 border-healthcare-primary text-healthcare-primary-light focus:ring-3 focus:ring-healthcare-primary-light cursor-pointer"
                aria-invalid={errors.consent ? 'true' : 'false'}
                aria-describedby={errors.consent ? 'consent-error' : 'consent-help'}
              />
              <div className="flex-1">
                <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
                  Ich habe die{' '}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-healthcare-primary-light underline hover:text-healthcare-primary"
                  >
                    Datenschutzerklärung
                  </a>{' '}
                  gelesen und akzeptiert. <span className="text-red-600">*</span>
                </label>
                <p id="consent-help" className="text-xs text-gray-600 mt-1">
                  Ihre Daten werden nur zur Bearbeitung Ihrer Anfrage verwendet.
                </p>
                {errors.consent && (
                  <p id="consent-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.consent.message}
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter Opt-in (Optional) */}
            <div className="flex items-start gap-3">
              <input
                {...register('newsletter')}
                id="newsletter"
                type="checkbox"
                className="mt-1 w-5 h-5 min-w-[20px] min-h-[20px] rounded border-2 border-gray-300 text-healthcare-primary-light focus:ring-3 focus:ring-healthcare-primary-light cursor-pointer"
                aria-describedby="newsletter-help"
              />
              <div className="flex-1">
                <label htmlFor="newsletter" className="text-sm text-gray-700 cursor-pointer">
                  Ich möchte den Newsletter mit medizinischen Fachartikeln erhalten (optional)
                </label>
                <p id="newsletter-help" className="text-xs text-gray-600 mt-1">
                  Abmeldung jederzeit möglich
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* hCaptcha */}
        {captchaEnabled && (
          <div className="flex justify-center">
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              size="normal"
              theme="light"
              onError={(err) => console.error('hCaptcha error:', err)}
              onExpire={() => captchaRef.current?.resetCaptcha()}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[64px] min-w-[280px] px-8 py-4 bg-healthcare-primary-light hover:bg-healthcare-primary text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-healthcare-primary-light focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            aria-label={isSubmitting ? 'Nachricht wird gesendet...' : 'Kontaktformular absenden'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                <Mail className="w-6 h-6" />
                Nachricht senden
              </>
            )}
          </button>
        </div>

        {/* Support Information */}
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p>Bei dringenden medizinischen Fragen:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <a href="tel:112" className="text-healthcare-primary-light hover:underline font-medium">
              📞 Notruf: 112
            </a>
            <a href="tel:116117" className="text-healthcare-primary-light hover:underline font-medium">
              📞 Bereitschaftsdienst: 116 117
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
