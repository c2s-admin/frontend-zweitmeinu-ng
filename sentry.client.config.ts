import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  tracesSampleRate: 0.05,
  initialScope: {
    tags: {
      platform: 'zweitmeinung.ng',
      healthcare: true,
      gdpr_compliant: true,
      patient_safety_critical: true,
    },
    contexts: {
      healthcare: {
        platform_type: 'medical_consultation',
        compliance: ['GDPR', 'Medical_Data_Protection'],
        emergency_support: true,
        accessibility: 'WCAG_2.1_AA',
      },
    },
  },
  beforeSend(event) {
    // Scrub potential PII in messages (client-side)
    if (event.exception) {
      event.exception.values?.forEach((exception) => {
        if (exception.value) {
          exception.value = exception.value
            .replace(/patient_id=\w+/gi, 'patient_id=[redacted]')
            .replace(/email=[^&\s]+/gi, 'email=[redacted]')
            .replace(/name=[^&\s]+/gi, 'name=[redacted]')
        }
      })
    }
    return event
  },
  release: process.env.NEXT_PUBLIC_APP_VERSION || process.env.APP_VERSION || 'unknown',
})

