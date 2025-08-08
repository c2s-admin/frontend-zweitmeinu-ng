/**
 * Healthcare WCAG 2.1 AA Accessibility Configuration
 * Specialized Axe-Core Rules for Medical Applications
 * 
 * @see https://www.deque.com/axe/core-documentation/api-documentation/
 * @healthcare-standards WCAG 2.1 AA + Healthcare Extensions
 */

const healthcareAxeConfig = {
  // Healthcare-Enhanced Rules Configuration
  rules: {
    // WCAG 2.1 AA Core Rules - Enhanced for Healthcare
    'color-contrast': {
      enabled: true,
      options: {
        // Healthcare requirement: 4.5:1 minimum (stricter than standard 3:1)
        normalText: 4.5,
        largeText: 3.0,
        // Emergency elements require AAA level
        emergency: 7.0
      }
    },

    // Touch Target Size - Healthcare Standard (56px minimum)
    'target-size': {
      enabled: true,
      options: {
        // Healthcare users often have motor impairments or are stressed
        minSize: 56, // 56px minimum (not standard 44px)
        primaryCTA: 64, // Primary medical CTAs need to be larger
        emergencyButton: 72 // Emergency buttons must be highly accessible
      }
    },

    // ARIA Labels - Medical Context Required
    'aria-label': {
      enabled: true,
      options: {
        // Medical forms require descriptive ARIA labels
        medicalContextRequired: true,
        germanLanguageRequired: true, // zweitmeinung.ng is German
        emergencyContextRequired: true
      }
    },

    // Form Labels - Healthcare Data Collection
    'label': {
      enabled: true,
      options: {
        // Patient data forms must have proper labels
        medicalDataRequired: true,
        privacyIndicatorRequired: true, // GDPR compliance
        requiredFieldIndicator: true
      }
    },

    // Focus Management - Healthcare Navigation
    'focus-order-semantics': {
      enabled: true,
      options: {
        // Medical workflows require logical focus order
        medicalWorkflowOptimized: true,
        emergencyBypassRequired: true, // Skip to emergency contact
        skipToMainContent: true
      }
    },

    // Keyboard Navigation - Healthcare Accessibility
    'keyboard': {
      enabled: true,
      options: {
        // All healthcare functions must be keyboard accessible
        emergencyAccessible: true,
        medicalFormAccessible: true,
        voiceInputCompatible: true // Many healthcare users use voice input
      }
    },

    // Screen Reader - Medical Terminology
    'screen-reader': {
      enabled: true,
      options: {
        // Medical terms need screen reader optimization
        medicalTerminologySupport: true,
        icd10CodeSupport: true, // International medical codes
        emergencyInstructionsClarity: true,
        germanMedicalTerms: true
      }
    },

    // Color Usage - Healthcare Visual Design
    'color-contrast-enhanced': {
      enabled: true,
      options: {
        // Healthcare color palette validation
        healthcareColors: {
          primary: '#004166',
          primaryLight: '#1278B3',
          accentGreen: '#B3AF09',
          error: '#dc2626',
          warning: '#f59e0b',
          success: '#10b981'
        },
        // Ensure medical context colors meet standards
        medicalStatusColors: true,
        emergencyRedCompliance: true
      }
    },

    // Motion & Animation - Healthcare Accessibility
    'prefers-reduced-motion': {
      enabled: true,
      options: {
        // Many healthcare users need reduced motion
        respectSystemPreferences: true,
        essentialAnimationsOnly: true,
        emergencyAnimationsDisabled: false // Emergency alerts can animate
      }
    },

    // Language & Content - Medical Communication
    'lang': {
      enabled: true,
      options: {
        // German medical platform requirements
        primaryLanguage: 'de-DE',
        medicalTerminologyLang: true,
        emergencyInstructionsLang: true
      }
    }
  },

  // Healthcare-Specific Tags for Component Testing
  tags: [
    'wcag2a',      // WCAG 2.1 A compliance
    'wcag2aa',     // WCAG 2.1 AA compliance (required)
    'wcag21aa',    // WCAG 2.1 AA specific rules
    'healthcare',  // Healthcare-specific rules
    'medical',     // Medical context rules
    'emergency',   // Emergency accessibility rules
    'german',      // German language rules
    'gdpr'         // GDPR privacy accessibility
  ],

  // Healthcare Component Selectors
  selectors: {
    // Emergency Elements - Highest Priority
    emergency: [
      '[data-healthcare="emergency"]',
      '.emergency-banner',
      '.emergency-contact',
      '[aria-label*="Notfall"]',
      '[aria-label*="Emergency"]'
    ],

    // Medical Forms - Patient Data Collection
    medicalForms: [
      '[data-healthcare="form"]',
      '.healthcare-form',
      '.medical-form',
      '.patient-data-form',
      'form[data-medical="true"]'
    ],

    // Healthcare Navigation - Medical Specialties
    medicalNavigation: [
      '[data-healthcare="navigation"]',
      '.healthcare-header',
      '.medical-specialty-nav',
      '.doctor-profile-nav'
    ],

    // Primary CTAs - Medical Actions
    medicalCTAs: [
      '[data-healthcare="cta"]',
      '.healthcare-button-primary',
      '.medical-consultation-cta',
      '.specialty-selector-cta'
    ],

    // Trust Indicators - Medical Credentials
    trustElements: [
      '[data-healthcare="trust"]',
      '.medical-credentials',
      '.doctor-certification',
      '.privacy-indicator'
    ]
  },

  // Exclude Non-Critical Elements from Strict Testing
  exclude: [
    // Third-party widgets that can't be modified
    '.captcha-widget',
    '.social-media-embed',
    
    // Decorative elements (but still test for color contrast)
    '.decorative-icon',
    '.background-pattern'
  ],

  // Healthcare Performance Thresholds
  performance: {
    // Accessibility tests shouldn't delay medical workflows
    timeout: 30000, // 30 seconds maximum
    maxRetries: 2,  // Limited retries for medical urgency
    
    // Scoring thresholds for healthcare
    scoring: {
      emergency: 100,    // Emergency elements must be perfect
      medicalForms: 95,  // Patient data forms must be near-perfect
      navigation: 90,    // Medical navigation must be excellent
      general: 85        // General healthcare content minimum
    }
  },

  // Healthcare-Specific Reporting
  reporting: {
    format: 'healthcare-detailed',
    includeFixSuggestions: true,
    medicalContextExplanations: true,
    germanTranslations: true,
    
    // Report categories for healthcare teams
    categories: [
      'Emergency Accessibility',
      'Medical Form Compliance',
      'Patient Data Privacy',
      'Doctor Profile Accessibility',
      'Healthcare Navigation',
      'Trust & Credibility Elements'
    ]
  }
};

// Healthcare Environment Detection
const isHealthcareEnvironment = () => {
  // Check if we're testing healthcare components
  const healthcareIndicators = [
    'healthcare',
    'medical',
    'patient',
    'doctor',
    'zweitmeinung'
  ];
  
  const currentURL = typeof window !== 'undefined' ? window.location.href : '';
  const testContext = process.env.TEST_CONTEXT || '';
  
  return healthcareIndicators.some(indicator => 
    currentURL.includes(indicator) || testContext.includes(indicator)
  );
};

// Export different configs based on environment
module.exports = {
  // Standard healthcare config
  healthcare: healthcareAxeConfig,
  
  // Emergency-only testing (for critical paths)
  emergency: {
    ...healthcareAxeConfig,
    rules: {
      ...healthcareAxeConfig.rules,
      // Only test emergency-critical rules
      'color-contrast': healthcareAxeConfig.rules['color-contrast'],
      'target-size': healthcareAxeConfig.rules['target-size'],
      'keyboard': healthcareAxeConfig.rules['keyboard'],
      'aria-label': healthcareAxeConfig.rules['aria-label']
    },
    tags: ['emergency', 'wcag21aa']
  },
  
  // Medical forms specific testing
  medicalForms: {
    ...healthcareAxeConfig,
    selectors: {
      primary: healthcareAxeConfig.selectors.medicalForms
    },
    tags: ['wcag21aa', 'healthcare', 'gdpr']
  },
  
  // Development environment (less strict for faster iteration)
  development: {
    ...healthcareAxeConfig,
    performance: {
      ...healthcareAxeConfig.performance,
      timeout: 10000, // Faster for dev
      scoring: {
        emergency: 95,   // Slightly relaxed for development
        medicalForms: 90,
        navigation: 85,
        general: 80
      }
    }
  },
  
  // Production environment (strictest requirements)
  production: {
    ...healthcareAxeConfig,
    performance: {
      ...healthcareAxeConfig.performance,
      scoring: {
        emergency: 100,    // No compromise on emergency accessibility
        medicalForms: 98,  // Nearly perfect for patient data
        navigation: 95,    // Excellent for medical navigation
        general: 90        // High standard for all healthcare content
      }
    }
  },
  
  // Utility functions
  utils: {
    isHealthcareEnvironment,
    getConfigForEnvironment: (env = 'healthcare') => {
      const configs = {
        healthcare: healthcareAxeConfig,
        emergency: module.exports.emergency,
        medicalForms: module.exports.medicalForms,
        development: module.exports.development,
        production: module.exports.production
      };
      return configs[env] || healthcareAxeConfig;
    }
  }
};