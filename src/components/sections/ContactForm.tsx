'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import type { ContactForm as ContactFormType } from '@/types/strapi'

export default function ContactForm({
  title,
  subtitle,
  fields = [],
  submitButtonText = 'Nachricht senden',
  successMessage = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.',
  errorMessage = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
}: ContactFormType) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({})
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="section-padding bg-healthcare-background">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <div className="text-center mb-16">
              {title && (
                <h2 className="text-healthcare-primary mb-6">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-healthcare-primary mb-4">
                  Erfolgreich gesendet!
                </h3>
                <p className="text-healthcare-text-muted mb-8">
                  {successMessage}
                </p>
                <button type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="btn-primary"
                >
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-healthcare-primary mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-healthcare-border rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:border-transparent"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-healthcare-border rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:border-transparent"
                      >
                        <option value="">Bitte wählen...</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-healthcare-border rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary-light focus:border-transparent"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {submitButtonText}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
