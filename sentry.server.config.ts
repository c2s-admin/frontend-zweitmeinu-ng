import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  tracesSampleRate: 0.05,
  beforeSend(event) {
    // Server-side scrubbing: remove filepaths and PII-like vars
    if (event.exception) {
      event.exception.values?.forEach((exception) => {
        if (exception.stacktrace) {
          exception.stacktrace.frames?.forEach((frame) => {
            if (frame.filename) {
              frame.filename = frame.filename.replace(/\/home\/[^\/]+/g, '/home/[user]')
            }
            const vars = (frame as unknown as { vars?: Record<string, string> }).vars
            if (vars) {
              Object.keys(vars).forEach((key) => {
                if (/patient|email|name/i.test(key)) {
                  vars[key] = '[redacted]'
                }
              })
            }
          })
        }
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
  release: process.env.APP_VERSION || process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
})

