/**
 * Healthcare Error Tracking Integration with Sentry
 * GDPR-compliant error tracking for medical contexts
 * 
 * @version 1.0.0
 * @requires @sentry/nextjs ^10.1.0
 */

import { Sentry } from '@/lib/sentry';

// Medical Error Severity Levels
export const MEDICAL_ERROR_SEVERITY = {
  CRITICAL: 'critical',     // Patient Safety Impact - <5 min response
  HIGH: 'high',            // Medical Workflow Disruption  
  MEDIUM: 'medium',        // User Experience Issues
  LOW: 'low'               // Non-blocking Issues
};

// Medical Error Categories for Healthcare Context
export const MEDICAL_ERROR_CATEGORIES = {
  EMERGENCY_COMPONENT: 'emergency_component',
  PATIENT_FORM: 'patient_form', 
  API_FAILURE: 'api_failure',
  NAVIGATION: 'navigation',
  ACCESSIBILITY: 'accessibility',
  PERFORMANCE: 'performance',
  DATA_PRIVACY: 'data_privacy'
};

/**
 * Healthcare Error Tracking Class
 * Implements GDPR-compliant error reporting with medical context
 */
class HealthcareErrorTracking {
  constructor() {
    this.isInitialized = false;
    this.emergencyCallbacks = new Set();
    this.init();
  }

  /**
   * Initialize Healthcare Error Tracking
   */
  init() {
    if (this.isInitialized) return;

    // Configure Sentry for Healthcare
    Sentry.configureScope((scope) => {
      scope.setTag('healthcare_platform', 'zweitmeinung.ng');
      scope.setTag('gdpr_compliant', true);
      scope.setContext('healthcare', {
        platform_type: 'medical_consultation',
        compliance: ['GDPR', 'Medical_Data_Protection'],
        emergency_support: true
      });
    });

    // Set up global error handlers for medical contexts
    this.setupGlobalHandlers();
    this.isInitialized = true;

    console.log('🏥 Healthcare Error Tracking initialized with GDPR compliance');
  }

  /**
   * Track Medical Error with Healthcare Context
   * @param {Error} error - The error object
   * @param {Object} context - Medical context information
   */
  trackMedicalError(error, context = {}) {
    const {
      severity = MEDICAL_ERROR_SEVERITY.MEDIUM,
      category = MEDICAL_ERROR_CATEGORIES.API_FAILURE,
      medicalSpecialty = null,
      userPersona = 'patient',
      emergencyContext = false,
      accessibilityContext = null,
      patientSafetyImpact = false
    } = context;

    // GDPR Compliance: Scrub any potential PII
    const sanitizedError = this.sanitizeErrorForGDPR(error);
    const sanitizedContext = this.sanitizeMedicalContext(context);

    // Create healthcare-specific error fingerprint
    const healthcareFingerprint = this.generateHealthcareFingerprint(
      sanitizedError, 
      category, 
      medicalSpecialty
    );

    Sentry.withScope((scope) => {
      // Set healthcare-specific tags
      scope.setTag('medical_error_severity', severity);
      scope.setTag('medical_error_category', category);
      scope.setTag('medical_specialty', medicalSpecialty || 'general');
      scope.setTag('user_persona', userPersona);
      scope.setTag('emergency_context', emergencyContext);
      scope.setTag('patient_safety_impact', patientSafetyImpact);
      
      // Accessibility context if provided
      if (accessibilityContext) {
        scope.setTag('accessibility_mode', accessibilityContext.mode);
        scope.setTag('screen_reader', accessibilityContext.screenReader || false);
        scope.setTag('high_contrast', accessibilityContext.highContrast || false);
      }

      // Set healthcare context
      scope.setContext('healthcare_error', {
        ...sanitizedContext,
        healthcare_fingerprint: healthcareFingerprint,
        timestamp: new Date().toISOString(),
        platform: 'zweitmeinung.ng'
      });

      // Set fingerprint for similar medical errors
      scope.setFingerprint([healthcareFingerprint]);

      // Set appropriate Sentry level based on medical severity
      const sentryLevel = this.mapMedicalSeverityToSentryLevel(severity);
      scope.setLevel(sentryLevel);

      // Capture the error
      const eventId = Sentry.captureException(sanitizedError);

      // Handle critical errors immediately
      if (severity === MEDICAL_ERROR_SEVERITY.CRITICAL || emergencyContext) {
        this.handleCriticalMedicalError(sanitizedError, sanitizedContext, eventId);
      }

      return eventId;
    });
  }

  /**
   * Track Medical Performance Issue
   * @param {string} metric - Performance metric name
   * @param {number} value - Metric value
   * @param {Object} context - Medical context
   */
  trackMedicalPerformance(metric, value, context = {}) {
    const {
      medicalSpecialty,
      componentName,
      userPersona = 'patient',
      emergencyContext = false
    } = context;

    // Don't track performance issues for emergency contexts - focus on functionality
    if (emergencyContext) return;

    Sentry.addBreadcrumb({
      message: `Medical Performance: ${metric}`,
      category: 'performance.medical',
      data: {
        metric,
        value,
        medical_specialty: medicalSpecialty,
        component: componentName,
        user_persona: userPersona,
        timestamp: new Date().toISOString()
      },
      level: value > 3000 ? 'warning' : 'info' // Slow loading > 3s is concerning for healthcare
    });
  }

  /**
   * Track Medical User Action for Context
   * @param {string} action - User action
   * @param {Object} context - Medical context
   */
  trackMedicalUserAction(action, context = {}) {
    const sanitizedContext = this.sanitizeMedicalContext(context);
    
    Sentry.addBreadcrumb({
      message: `Medical User Action: ${action}`,
      category: 'user.medical',
      data: {
        action,
        ...sanitizedContext,
        timestamp: new Date().toISOString()
      },
      level: 'info'
    });
  }

  /**
   * Register Emergency Error Callback
   * @param {Function} callback - Callback for critical errors
   */
  registerEmergencyCallback(callback) {
    this.emergencyCallbacks.add(callback);
  }

  /**
   * GDPR-compliant error sanitization
   * Removes all PII and medical data from errors
   */
  sanitizeErrorForGDPR(error) {
    const sanitizedError = new Error(error.message);
    sanitizedError.name = error.name;
    
    // Remove stack trace locations that might contain sensitive paths
    if (error.stack) {
      sanitizedError.stack = error.stack
        .replace(/\/home\/[^\/]+/g, '/home/[user]')
        .replace(/patient_id=\w+/gi, 'patient_id=[redacted]')
        .replace(/email=[^&\s]+/gi, 'email=[redacted]')
        .replace(/name=[^&\s]+/gi, 'name=[redacted]');
    }

    return sanitizedError;
  }

  /**
   * Sanitize medical context for GDPR compliance
   */
  sanitizeMedicalContext(context) {
    const sanitized = { ...context };
    
    // Remove any PII fields
    const piiFields = ['patientId', 'patientName', 'email', 'phone', 'medicalHistory'];
    piiFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    // Keep only aggregated/anonymized medical context
    const allowedFields = [
      'medicalSpecialty', 'userPersona', 'emergencyContext', 
      'accessibilityContext', 'componentName', 'pageRoute',
      'browserInfo', 'deviceType'
    ];

    return Object.keys(sanitized)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = sanitized[key];
        return obj;
      }, {});
  }

  /**
   * Generate healthcare-specific error fingerprint
   */
  generateHealthcareFingerprint(error, category, specialty) {
    const components = [
      'healthcare',
      category,
      specialty || 'general',
      error.name || 'unknown',
      error.message ? error.message.substring(0, 50) : 'no-message'
    ];
    
    return components.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Map medical severity to Sentry level
   */
  mapMedicalSeverityToSentryLevel(severity) {
    const mapping = {
      [MEDICAL_ERROR_SEVERITY.CRITICAL]: 'fatal',
      [MEDICAL_ERROR_SEVERITY.HIGH]: 'error', 
      [MEDICAL_ERROR_SEVERITY.MEDIUM]: 'warning',
      [MEDICAL_ERROR_SEVERITY.LOW]: 'info'
    };
    
    return mapping[severity] || 'error';
  }

  /**
   * Handle Critical Medical Errors
   * <5 minute response time requirement
   */
  handleCriticalMedicalError(error, context, eventId) {
    console.error('🚨 CRITICAL MEDICAL ERROR - Patient Safety Impact', {
      eventId,
      error: error.message,
      context: context.medicalSpecialty,
      timestamp: new Date().toISOString()
    });

    // Execute all registered emergency callbacks
    this.emergencyCallbacks.forEach(callback => {
      try {
        callback(error, context, eventId);
      } catch (callbackError) {
        console.error('Emergency callback failed:', callbackError);
      }
    });

    // Additional critical error handling can be added here
    // e.g., immediate alerts, fallback UI, emergency contacts display
  }

  /**
   * Setup global error handlers for medical contexts
   */
  setupGlobalHandlers() {
    // Unhandled promise rejections in medical contexts
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.trackMedicalError(new Error(event.reason), {
          severity: MEDICAL_ERROR_SEVERITY.HIGH,
          category: MEDICAL_ERROR_CATEGORIES.API_FAILURE,
          emergencyContext: false,
          patientSafetyImpact: false
        });
      });

      // Resource loading errors that might affect medical components
      window.addEventListener('error', (event) => {
        if (event.target !== window) {
          this.trackMedicalError(new Error(`Resource load failed: ${event.target.src || event.target.href}`), {
            severity: MEDICAL_ERROR_SEVERITY.MEDIUM,
            category: MEDICAL_ERROR_CATEGORIES.PERFORMANCE,
            emergencyContext: false,
            patientSafetyImpact: false
          });
        }
      });
    }
  }
}

// Singleton instance
const healthcareErrorTracking = new HealthcareErrorTracking();

// Convenience methods for different medical error types
export const trackEmergencyComponentError = (error, context) => {
  healthcareErrorTracking.trackMedicalError(error, {
    ...context,
    severity: MEDICAL_ERROR_SEVERITY.CRITICAL,
    category: MEDICAL_ERROR_CATEGORIES.EMERGENCY_COMPONENT,
    emergencyContext: true,
    patientSafetyImpact: true
  });
};

export const trackPatientFormError = (error, context) => {
  healthcareErrorTracking.trackMedicalError(error, {
    ...context,
    severity: MEDICAL_ERROR_SEVERITY.HIGH,
    category: MEDICAL_ERROR_CATEGORIES.PATIENT_FORM,
    patientSafetyImpact: false
  });
};

export const trackAccessibilityError = (error, context) => {
  healthcareErrorTracking.trackMedicalError(error, {
    ...context,
    severity: MEDICAL_ERROR_SEVERITY.HIGH,
    category: MEDICAL_ERROR_CATEGORIES.ACCESSIBILITY,
    patientSafetyImpact: true // A11y issues affect patient access
  });
};

export const trackMedicalAPIError = (error, context) => {
  healthcareErrorTracking.trackMedicalError(error, {
    ...context,
    severity: MEDICAL_ERROR_SEVERITY.HIGH,
    category: MEDICAL_ERROR_CATEGORIES.API_FAILURE,
    patientSafetyImpact: context.emergencyAPI || false
  });
};

export default healthcareErrorTracking;