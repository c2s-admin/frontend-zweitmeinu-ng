import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

// Healthcare Error Tracking Integration
import healthcareErrorTracking, { 
  trackEmergencyComponentError,
  trackPatientFormError,
  trackAccessibilityError,
  trackMedicalAPIError 
} from "../../analytics/error-tracking.js";

import { processEmergencyError } from "../../analytics/emergency-error-alerts.js";
import { collectHealthcareErrorContext } from "../../analytics/error-context.js";

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

    // Enhanced integrations for healthcare
    integrations: [
      // Default integrations with healthcare optimizations
      new Sentry.Integrations.Breadcrumbs({
        console: true, // Log console errors for healthcare debugging
        dom: true,     // Track DOM interactions for healthcare UX
        fetch: true,   // Track API calls for medical data
        history: true, // Track navigation for medical workflows
        sentry: true,  // Include Sentry breadcrumbs
        xhr: true      // Track XHR requests for medical APIs
      }),
      
      // Performance monitoring for healthcare
      new Sentry.Integrations.BrowserTracing({
        // Healthcare-specific transaction names
        beforeNavigate: context => ({
          ...context,
          name: context.location.pathname.includes('/emergency') 
            ? 'Emergency Healthcare Navigation'
            : context.location.pathname.includes('/medical')
            ? 'Medical Service Navigation'
            : context.name
        }),
        
        // Track Core Web Vitals for healthcare UX
        markBackgroundTransactions: true,
        
        // Healthcare route instrumentation
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          React.useLocation,
          React.useNavigationType,
          React.createRoutesFromChildren,
          React.matchRoutes
        ),
      }),
    ],

    // Release tracking for healthcare deployments
    release: env.APP_VERSION || 'unknown',
    
    // Enhanced error fingerprinting for healthcare
    fingerprint: ['{{ default }}', 'healthcare-platform'],
  });

  // Register emergency error callback
  healthcareErrorTracking.registerEmergencyCallback((error, context, eventId) => {
    // Process emergency error with alert system
    processEmergencyError(error, context, eventId);
  });

  console.log('🏥 Healthcare Sentry integration initialized');
}

// Healthcare Error Boundary Component
export function HealthcareErrorBoundary({ children, fallback, onError }) {
  return (
    <Sentry.ErrorBoundary 
      fallback={fallback || HealthcareErrorFallback}
      beforeCapture={(scope, error, errorInfo) => {
        // Collect healthcare context for error boundary errors
        const healthcareContext = collectHealthcareErrorContext({
          componentName: errorInfo.componentStack?.split('\n')[1]?.trim(),
          errorBoundary: true,
          patientSafetyImpact: true // Component crashes affect patient experience
        });

        scope.setContext('healthcare_error_boundary', healthcareContext);
        scope.setTag('error_boundary', true);
        scope.setTag('component_crash', true);
        
        // Call custom error handler if provided
        if (onError) {
          onError(error, errorInfo, healthcareContext);
        }
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

// Healthcare Error Fallback UI
function HealthcareErrorFallback({ error, resetError }) {
  return (
    <div className="min-h-screen bg-healthcare-background flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        
        <h2 className="text-xl font-semibold text-healthcare-primary mb-3">
          Technischer Fehler aufgetreten
        </h2>
        
        <p className="text-healthcare-text-muted mb-6">
          Ein unerwarteter Fehler ist aufgetreten. Ihre medizinischen Daten sind sicher.
          Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={resetError}
            className="w-full bg-healthcare-primary-light hover:bg-healthcare-primary text-white py-3 px-6 rounded-xl font-medium transition-colors"
          >
            Erneut versuchen
          </button>
          
          <div className="text-sm text-healthcare-text-muted">
            <p className="mb-2">Bei kritischen medizinischen Fragen:</p>
            <a 
              href="tel:+4980080441100" 
              className="text-red-600 font-semibold hover:underline"
            >
              📞 Notfall-Hotline: +49 800 80 44 100
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export enhanced Sentry with healthcare tracking
export { 
  Sentry,
  
  // Healthcare error tracking functions
  trackEmergencyComponentError,
  trackPatientFormError,
  trackAccessibilityError,
  trackMedicalAPIError,
  
  // Healthcare error context
  collectHealthcareErrorContext,
  
  // Emergency error processing
  processEmergencyError,
  
  // Healthcare error tracking instance
  healthcareErrorTracking
};
