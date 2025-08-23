import * as Sentry from "@sentry/nextjs";
import React from "react";
import { env } from "@/lib/env";

if (env.SENTRY_DSN) {
  Sentry.init({ 
    dsn: env.SENTRY_DSN,
    
    // Healthcare-specific Sentry configuration
    environment: env.NODE_ENV || 'development',
    
    // Enhanced error filtering for healthcare
    beforeSend(event, hint) {
      // GDPR Compliance: Scrub any PII from healthcare errors
      if (event.exception) {
        event.exception.values?.forEach(exception => {
          if (exception.stacktrace) {
            exception.stacktrace.frames?.forEach(frame => {
              // Remove sensitive file paths
              if (frame.filename) {
                frame.filename = frame.filename.replace(/\/home\/[^\/]+/g, '/home/[user]');
              }
              // Remove query parameters that might contain PII
              if (frame.vars) {
                Object.keys(frame.vars).forEach(key => {
                  if (key.toLowerCase().includes('patient') || 
                      key.toLowerCase().includes('email') ||
                      key.toLowerCase().includes('name')) {
                    frame.vars[key] = '[redacted]';
                  }
                });
              }
            });
          }
          
          // Scrub error messages for PII
          if (exception.value) {
            exception.value = exception.value
              .replace(/patient_id=\w+/gi, 'patient_id=[redacted]')
              .replace(/email=[^&\s]+/gi, 'email=[redacted]')
              .replace(/name=[^&\s]+/gi, 'name=[redacted]');
          }
        });
      }

      return event;
    },

    // Healthcare-specific error sampling
    sampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% sampling in prod
    
    // Enable performance monitoring for healthcare UX
    tracesSampleRate: 0.05, // 5% performance tracing
    
    // Healthcare platform tags
    initialScope: {
      tags: {
        platform: 'zweitmeinung.ng',
        healthcare: true,
        gdpr_compliant: true,
        patient_safety_critical: true
      },
      contexts: {
        healthcare: {
          platform_type: 'medical_consultation',
          compliance: ['GDPR', 'Medical_Data_Protection'],
          emergency_support: true,
          accessibility: 'WCAG_2.1_AA'
        }
      }
    },

    // Enhanced integrations for healthcare (simplified)
    integrations: [],

    // Release tracking for healthcare deployments
    release: env.APP_VERSION || 'unknown',
    
    // Enhanced error fingerprinting for healthcare
    fingerprint: ['{{ default }}', 'healthcare-platform'],
  });

  console.log('🏥 Healthcare Sentry integration initialized');
}

// Healthcare Error Boundary Component
export function HealthcareErrorBoundary({ children, fallback, onError }: { 
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  onError?: (error: Error, errorInfo: any) => void;
}) {
  const errorFallback = fallback || HealthcareErrorFallback;
  
  return React.createElement(
    Sentry.ErrorBoundary,
    {
      fallback: errorFallback,
      beforeCapture: (scope: any, error: Error, errorInfo: any) => {
        scope.setTag('error_boundary', true);
        scope.setTag('component_crash', true);
        
        // Call custom error handler if provided
        if (onError) {
          onError(error, errorInfo);
        }
      }
    },
    children
  );
}

// Healthcare Error Fallback UI
function HealthcareErrorFallback({ error, resetError }: {
  error: Error;
  resetError: () => void;
}) {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-healthcare-background flex items-center justify-center p-6' },
    React.createElement(
      'div',
      { className: 'bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg' },
      React.createElement(
        'div',
        { className: 'w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4' },
        React.createElement('span', { className: 'text-2xl' }, '⚠️')
      ),
      React.createElement(
        'h2',
        { className: 'text-xl font-semibold text-healthcare-primary mb-3' },
        'Technischer Fehler aufgetreten'
      ),
      React.createElement(
        'p',
        { className: 'text-healthcare-text-muted mb-6' },
        'Ein unerwarteter Fehler ist aufgetreten. Ihre medizinischen Daten sind sicher. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.'
      ),
      React.createElement(
        'div',
        { className: 'space-y-3' },
        React.createElement(
          'button',
          {
            onClick: resetError,
            className: 'w-full bg-healthcare-primary-light hover:bg-healthcare-primary text-white py-3 px-6 rounded-xl font-medium transition-colors'
          },
          'Erneut versuchen'
        ),
        React.createElement(
          'div',
          { className: 'text-sm text-healthcare-text-muted' },
          React.createElement('p', { className: 'mb-2' }, 'Bei kritischen medizinischen Fragen:'),
          React.createElement(
            'a',
            {
              href: 'tel:+4980080441100',
              className: 'text-red-600 font-semibold hover:underline'
            },
            '📞 Notfall-Hotline: +49 800 80 44 100'
          )
        )
      )
    )
  );
}

// Export enhanced Sentry with healthcare tracking
export { 
  Sentry
};
