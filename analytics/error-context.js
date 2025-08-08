/**
 * Healthcare User Context for Error Reports
 * GDPR-compliant context collection for medical error tracking
 * 
 * @version 1.0.0
 */

import { 
  MEDICAL_SPECIALTIES, 
  HEALTHCARE_USER_PERSONAS, 
  HEALTHCARE_ERROR_CONTEXT 
} from './medical-error-categories.js';

/**
 * Healthcare Error Context Collector
 * Collects anonymized context information for better error diagnosis
 */
class HealthcareErrorContextCollector {
  constructor() {
    this.sessionContext = null;
    this.initializeContext();
  }

  /**
   * Initialize Healthcare Context Collection
   */
  initializeContext() {
    if (typeof window === 'undefined') return;

    this.sessionContext = {
      sessionId: this.generateAnonymousSessionId(),
      startTime: new Date().toISOString(),
      userAgent: this.sanitizeUserAgent(),
      viewport: this.getViewportInfo(),
      accessibility: this.detectAccessibilityContext(),
      deviceContext: this.detectDeviceContext()
    };
  }

  /**
   * Collect Complete Healthcare Context for Error
   * @param {Object} additionalContext - Additional context from error site
   * @returns {Object} Complete GDPR-compliant context
   */
  collectHealthcareContext(additionalContext = {}) {
    const baseContext = {
      // Session Information (anonymized)
      session: {
        id: this.sessionContext?.sessionId || 'unknown',
        duration: this.getSessionDuration(),
        timestamp: new Date().toISOString()
      },

      // Medical Platform Context
      healthcare: {
        specialty: this.detectMedicalSpecialty(additionalContext),
        userPersona: this.detectUserPersona(additionalContext),
        journeyStage: this.detectJourneyStage(additionalContext),
        emergencyContext: this.detectEmergencyContext(additionalContext)
      },

      // Technical Context (privacy-safe)
      technical: {
        browser: this.getBrowserInfo(),
        device: this.getDeviceInfo(), 
        viewport: this.getViewportInfo(),
        connection: this.getConnectionInfo(),
        performance: this.getPerformanceContext()
      },

      // Accessibility Context
      accessibility: this.getAccessibilityContext(),

      // Component/Page Context
      component: {
        name: additionalContext.componentName || 'unknown',
        route: this.sanitizeRoute(additionalContext.route),
        action: additionalContext.userAction || null,
        formStep: additionalContext.formStep || null
      },

      // Error Environment
      environment: {
        isDevelopment: process.env.NODE_ENV === 'development',
        buildTime: process.env.BUILD_TIME || null,
        version: process.env.APP_VERSION || null
      }
    };

    // Merge with additional context (sanitized)
    return this.sanitizeContext({
      ...baseContext,
      ...this.sanitizeAdditionalContext(additionalContext)
    });
  }

  /**
   * Detect Medical Specialty Context
   */
  detectMedicalSpecialty(context) {
    // From URL path
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      
      for (const [key, value] of Object.entries(MEDICAL_SPECIALTIES)) {
        if (pathname.includes(value)) {
          return value;
        }
      }
    }

    // From explicit context
    if (context.medicalSpecialty) {
      return context.medicalSpecialty;
    }

    // From component context
    if (context.componentName) {
      const componentName = context.componentName.toLowerCase();
      if (componentName.includes('cardio') || componentName.includes('heart')) {
        return MEDICAL_SPECIALTIES.KARDIOLOGIE;
      }
      if (componentName.includes('onko') || componentName.includes('cancer')) {
        return MEDICAL_SPECIALTIES.ONKOLOGIE;
      }
      // Add more specialty detection logic
    }

    return MEDICAL_SPECIALTIES.UNKNOWN;
  }

  /**
   * Detect User Persona from Context
   */
  detectUserPersona(context) {
    // Emergency detection
    if (this.detectEmergencyContext(context)) {
      return HEALTHCARE_USER_PERSONAS.EMERGENCY_USER.code;
    }

    // From explicit context
    if (context.userPersona && 
        Object.values(HEALTHCARE_USER_PERSONAS).some(p => p.code === context.userPersona)) {
      return context.userPersona;
    }

    // From URL/route detection
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      
      if (pathname.includes('/professional') || pathname.includes('/doctor')) {
        return HEALTHCARE_USER_PERSONAS.HEALTHCARE_PROFESSIONAL.code;
      }
      
      if (pathname.includes('/emergency') || pathname.includes('/urgent')) {
        return HEALTHCARE_USER_PERSONAS.EMERGENCY_USER.code;
      }
    }

    // Default to patient
    return HEALTHCARE_USER_PERSONAS.PATIENT.code;
  }

  /**
   * Detect Healthcare Journey Stage
   */
  detectJourneyStage(context) {
    if (this.detectEmergencyContext(context)) {
      return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.EMERGENCY;
    }

    // From URL analysis
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      
      if (pathname.includes('/consultation') || pathname.includes('/appointment')) {
        return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.CONSULTATION;
      }
      
      if (pathname.includes('/select') || pathname.includes('/choose')) {
        return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.SELECTION;
      }
      
      if (pathname.includes('/follow') || pathname.includes('/result')) {
        return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.FOLLOW_UP;
      }
    }

    // From component context
    if (context.componentName) {
      const componentName = context.componentName.toLowerCase();
      if (componentName.includes('selector') || componentName.includes('choose')) {
        return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.SELECTION;
      }
    }

    return HEALTHCARE_ERROR_CONTEXT.MEDICAL_JOURNEY_STAGES.DISCOVERY;
  }

  /**
   * Detect Emergency Context
   */
  detectEmergencyContext(context) {
    // Explicit emergency context
    if (context.emergencyContext === true) {
      return true;
    }

    // URL-based detection
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      const emergencyKeywords = ['emergency', 'urgent', 'notfall', 'sofort'];
      
      if (emergencyKeywords.some(keyword => pathname.includes(keyword))) {
        return true;
      }
    }

    // Component-based detection
    if (context.componentName) {
      const componentName = context.componentName.toLowerCase();
      const emergencyComponents = ['emergency', 'urgent', 'critical', 'notfall'];
      
      if (emergencyComponents.some(keyword => componentName.includes(keyword))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Detect Accessibility Context
   */
  detectAccessibilityContext() {
    if (typeof window === 'undefined') return null;

    const accessibility = {};

    // Check for accessibility preferences
    if (window.matchMedia) {
      accessibility.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      accessibility.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      accessibility.increasedContrast = window.matchMedia('(prefers-contrast: more)').matches;
    }

    // Check for screen reader indicators
    accessibility.screenReader = this.detectScreenReader();

    // Check for keyboard navigation
    accessibility.keyboardNavigation = document.documentElement.dataset.keyboardUser === 'true';

    return accessibility;
  }

  /**
   * Detect Screen Reader Usage
   */
  detectScreenReader() {
    if (typeof window === 'undefined') return false;

    // Check for screen reader specific properties
    const indicators = [
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      window.speechSynthesis && window.speechSynthesis.speaking,
      document.documentElement.hasAttribute('data-screen-reader')
    ];

    return indicators.some(indicator => indicator);
  }

  /**
   * Detect Device Context for Healthcare
   */
  detectDeviceContext() {
    if (typeof window === 'undefined') return HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.MOBILE_STANDARD;

    const viewport = this.getViewportInfo();
    const isMobile = viewport.width <= 768;
    const isTablet = viewport.width > 768 && viewport.width <= 1024;
    
    // Emergency context detection
    if (this.detectEmergencyContext({})) {
      return isMobile 
        ? HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.MOBILE_EMERGENCY
        : HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.DESKTOP_PROFESSIONAL;
    }

    // Professional context (larger screens during work hours)
    const workHours = new Date().getHours() >= 8 && new Date().getHours() <= 18;
    if (!isMobile && workHours) {
      return HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.DESKTOP_PROFESSIONAL;
    }

    // Tablet context
    if (isTablet) {
      return HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.TABLET_BEDSIDE;
    }

    // Default mobile
    return HEALTHCARE_ERROR_CONTEXT.DEVICE_CONTEXTS.MOBILE_STANDARD;
  }

  /**
   * Get Browser Information (anonymized)
   */
  getBrowserInfo() {
    if (typeof window === 'undefined') return null;

    const ua = navigator.userAgent;
    return {
      name: this.getBrowserName(ua),
      version: this.getBrowserVersion(ua),
      engine: this.getBrowserEngine(ua),
      mobile: /Mobile|Android|iPhone|iPad/.test(ua)
    };
  }

  /**
   * Get Device Information (privacy-safe)
   */
  getDeviceInfo() {
    if (typeof window === 'undefined') return null;

    return {
      type: this.getDeviceType(),
      platform: navigator.platform || 'unknown',
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      // Don't collect specific device models for privacy
      screenSize: this.getScreenSizeCategory()
    };
  }

  /**
   * Get Viewport Information
   */
  getViewportInfo() {
    if (typeof window === 'undefined') return { width: 0, height: 0 };

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      pixelRatio: window.devicePixelRatio || 1
    };
  }

  /**
   * Get Connection Information
   */
  getConnectionInfo() {
    if (typeof navigator === 'undefined' || !navigator.connection) return null;

    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData || false
    };
  }

  /**
   * Get Performance Context
   */
  getPerformanceContext() {
    if (typeof window === 'undefined' || !window.performance) return null;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return null;

    return {
      loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
      firstPaint: this.getFirstPaint(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Get Accessibility Context
   */
  getAccessibilityContext() {
    const baseAccessibility = this.detectAccessibilityContext();
    if (!baseAccessibility) return null;

    // Add healthcare-specific accessibility context
    return {
      ...baseAccessibility,
      fontSize: this.getFontSizePreference(),
      colorScheme: this.getColorSchemePreference(),
      animations: !baseAccessibility.reducedMotion
    };
  }

  /**
   * Generate Anonymous Session ID
   */
  generateAnonymousSessionId() {
    // Generate a session-only ID that doesn't persist or identify users
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `healthcare-session-${timestamp}-${random}`;
  }

  /**
   * Get Session Duration
   */
  getSessionDuration() {
    if (!this.sessionContext?.startTime) return 0;
    
    const start = new Date(this.sessionContext.startTime);
    const now = new Date();
    return Math.round((now - start) / 1000); // Duration in seconds
  }

  /**
   * Sanitize User Agent for Privacy
   */
  sanitizeUserAgent() {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    // Remove specific version numbers and identifying information
    return ua
      .replace(/\d+\.\d+\.\d+/g, 'X.X.X')
      .replace(/Version\/\d+\.\d+/g, 'Version/X.X')
      .substring(0, 100); // Truncate for privacy
  }

  /**
   * Sanitize Route for Privacy
   */
  sanitizeRoute(route) {
    if (!route) return 'unknown';
    
    // Remove any potential PII from routes
    return route
      .replace(/\/user\/\d+/g, '/user/[id]')
      .replace(/\/patient\/\d+/g, '/patient/[id]')
      .replace(/\/appointment\/\d+/g, '/appointment/[id]')
      .replace(/\?.*/, '') // Remove query parameters
      .substring(0, 50); // Limit length
  }

  /**
   * Sanitize Additional Context
   */
  sanitizeAdditionalContext(context) {
    const sanitized = { ...context };
    
    // Remove any PII fields
    const piiFields = [
      'patientId', 'userId', 'patientName', 'userName',
      'email', 'phone', 'address', 'medicalId',
      'socialSecurityNumber', 'insuranceId'
    ];
    
    piiFields.forEach(field => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }

  /**
   * Sanitize Complete Context
   */
  sanitizeContext(context) {
    // Remove any nested PII
    const sanitized = JSON.parse(JSON.stringify(context));
    
    // Recursively check for PII in nested objects
    const removePII = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          removePII(obj[key]);
        } else if (typeof obj[key] === 'string') {
          // Remove email patterns
          obj[key] = obj[key].replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[email]');
          // Remove phone patterns
          obj[key] = obj[key].replace(/\+?\d{1,3}[\s-]?\d{3,14}/g, '[phone]');
          // Remove potential ID patterns
          obj[key] = obj[key].replace(/\b\d{6,}\b/g, '[id]');
        }
      }
    };

    removePII(sanitized);
    return sanitized;
  }

  // Helper methods for browser/device detection
  getBrowserName(ua) {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  getBrowserVersion(ua) {
    const match = ua.match(/(Firefox|Chrome|Safari|Edge)\/(\d+)/);
    return match ? match[2] : 'unknown';
  }

  getBrowserEngine(ua) {
    if (ua.includes('Gecko')) return 'Gecko';
    if (ua.includes('WebKit')) return 'WebKit';
    if (ua.includes('Blink')) return 'Blink';
    return 'Other';
  }

  getDeviceType() {
    const viewport = this.getViewportInfo();
    if (viewport.width <= 768) return 'mobile';
    if (viewport.width <= 1024) return 'tablet'; 
    return 'desktop';
  }

  getScreenSizeCategory() {
    const viewport = this.getViewportInfo();
    if (viewport.width <= 480) return 'small';
    if (viewport.width <= 768) return 'medium';
    if (viewport.width <= 1024) return 'large';
    return 'xlarge';
  }

  getFirstPaint() {
    if (!window.performance || !window.performance.getEntriesByType) return null;
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }

  getMemoryUsage() {
    if (!window.performance || !window.performance.memory) return null;
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
    };
  }

  getFontSizePreference() {
    if (typeof window === 'undefined') return 'normal';
    const fontSize = window.getComputedStyle(document.documentElement).fontSize;
    return parseInt(fontSize) > 16 ? 'large' : 'normal';
  }

  getColorSchemePreference() {
    if (typeof window === 'undefined') return 'light';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}

// Singleton instance
const healthcareContextCollector = new HealthcareErrorContextCollector();

// Export convenience function
export function collectHealthcareErrorContext(additionalContext = {}) {
  return healthcareContextCollector.collectHealthcareContext(additionalContext);
}

export default healthcareContextCollector;