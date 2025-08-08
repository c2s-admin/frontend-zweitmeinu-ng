/**
 * Medical Error Classification System
 * Comprehensive categorization for healthcare error tracking
 * 
 * @version 1.0.0
 */

// Primary Medical Error Categories
export const MEDICAL_ERROR_CATEGORIES = {
  // CRITICAL - Patient Safety Impact
  EMERGENCY_COMPONENT: {
    code: 'emergency_component',
    name: 'Emergency Component Failure',
    severity: 'critical',
    responseTime: '5 minutes',
    patientSafetyImpact: true,
    description: 'Critical failure in emergency contact, banner, or urgent care components',
    examples: [
      'Emergency banner not displaying',
      'Emergency contact button broken', 
      'Urgent consultation form failure',
      'Critical medication alert system down'
    ],
    escalation: {
      immediate: true,
      notify: ['medical-team', 'tech-lead', 'patient-safety'],
      fallback: 'Show static emergency contacts'
    }
  },

  PATIENT_SAFETY: {
    code: 'patient_safety',
    name: 'Patient Safety Risk',
    severity: 'critical',
    responseTime: '5 minutes',
    patientSafetyImpact: true,
    description: 'Any error that could directly impact patient safety or medical care',
    examples: [
      'Medical specialty selector malfunction',
      'Doctor profile information incorrect',
      'Medical credentials display failure',
      'Patient data validation bypass'
    ],
    escalation: {
      immediate: true,
      notify: ['patient-safety', 'medical-director', 'compliance'],
      fallback: 'Disable affected functionality'
    }
  },

  // HIGH - Medical Workflow Disruption
  PATIENT_FORM: {
    code: 'patient_form',
    name: 'Patient Form Error',
    severity: 'high',
    responseTime: '30 minutes',
    patientSafetyImpact: false,
    description: 'Errors in patient data collection forms and medical intake',
    examples: [
      'Medical history form not submitting',
      'File upload for medical documents failing',
      'Consent form not loading',
      'Patient contact form validation errors'
    ],
    escalation: {
      immediate: false,
      notify: ['patient-experience', 'tech-support'],
      fallback: 'Provide alternative contact methods'
    }
  },

  API_FAILURE: {
    code: 'api_failure',
    name: 'Medical API Failure',
    severity: 'high',
    responseTime: '30 minutes',
    patientSafetyImpact: false,
    description: 'Backend API errors affecting medical data and services',
    examples: [
      'Doctor availability API down',
      'Medical specialties data not loading',
      'Patient inquiry submission failing',
      'Medical content API errors'
    ],
    escalation: {
      immediate: false,
      notify: ['backend-team', 'api-monitoring'],
      fallback: 'Show cached data or static content'
    }
  },

  AUTHENTICATION: {
    code: 'authentication',
    name: 'Medical Authentication Error',
    severity: 'high',
    responseTime: '30 minutes',
    patientSafetyImpact: false,
    description: 'Login, session, and medical data access errors',
    examples: [
      'Doctor login system failure',
      'Patient session expiration issues',
      'Medical professional verification errors',
      'GDPR consent system malfunction'
    ],
    escalation: {
      immediate: false,
      notify: ['security-team', 'patient-privacy'],
      fallback: 'Provide guest access to emergency information'
    }
  },

  // MEDIUM - User Experience Issues  
  ACCESSIBILITY: {
    code: 'accessibility',
    name: 'Healthcare Accessibility Error',
    severity: 'medium',
    responseTime: '2 hours',
    patientSafetyImpact: true, // A11y affects patient access
    description: 'Accessibility failures affecting healthcare users',
    examples: [
      'Screen reader compatibility broken',
      'High contrast mode not working',
      'Keyboard navigation failures',
      'Touch targets too small for healthcare users'
    ],
    escalation: {
      immediate: false,
      notify: ['accessibility-team', 'patient-experience'],
      fallback: 'Display accessibility help information'
    }
  },

  NAVIGATION: {
    code: 'navigation',
    name: 'Medical Navigation Error',
    severity: 'medium',
    responseTime: '2 hours',
    patientSafetyImpact: false,
    description: 'Navigation and routing issues in medical workflows',
    examples: [
      'Medical specialty pages not loading',
      'Doctor profile navigation broken',
      'Mobile menu not working',
      'Search functionality errors'
    ],
    escalation: {
      immediate: false,
      notify: ['frontend-team', 'patient-experience'],
      fallback: 'Provide site map and direct links'
    }
  },

  UI_COMPONENT: {
    code: 'ui_component',
    name: 'Healthcare UI Component Error',
    severity: 'medium', 
    responseTime: '2 hours',
    patientSafetyImpact: false,
    description: 'Non-critical UI component failures in healthcare interface',
    examples: [
      'Medical cards not rendering properly',
      'Healthcare tooltips broken',
      'Medical badge displays incorrect',
      'Styling issues in medical forms'
    ],
    escalation: {
      immediate: false,
      notify: ['design-system', 'frontend-team'],
      fallback: 'Use fallback UI components'
    }
  },

  // LOW - Non-blocking Issues
  PERFORMANCE: {
    code: 'performance',
    name: 'Healthcare Performance Issue',
    severity: 'low',
    responseTime: '24 hours',
    patientSafetyImpact: false,
    description: 'Performance degradation affecting healthcare user experience',
    examples: [
      'Slow loading medical content',
      'Doctor images loading slowly',
      'Large bundle size impact',
      'Memory leaks in medical components'
    ],
    escalation: {
      immediate: false,
      notify: ['performance-team'],
      fallback: 'Show loading indicators and skeleton UI'
    }
  },

  ANALYTICS: {
    code: 'analytics',
    name: 'Medical Analytics Error',
    severity: 'low',
    responseTime: '24 hours', 
    patientSafetyImpact: false,
    description: 'Non-critical analytics and tracking errors',
    examples: [
      'Medical event tracking not working',
      'Performance monitoring down',
      'Healthcare metrics collection failing',
      'Error reporting system issues'
    ],
    escalation: {
      immediate: false,
      notify: ['analytics-team'],
      fallback: 'Continue operation without analytics'
    }
  },

  DATA_PRIVACY: {
    code: 'data_privacy',
    name: 'Medical Data Privacy Error',
    severity: 'high', // Privacy is critical in healthcare
    responseTime: '15 minutes',
    patientSafetyImpact: false,
    description: 'GDPR and medical data privacy compliance errors',
    examples: [
      'Cookie consent not working',
      'Data deletion requests failing',
      'Medical data anonymization errors',
      'Privacy policy display issues'
    ],
    escalation: {
      immediate: true,
      notify: ['privacy-team', 'compliance', 'legal'],
      fallback: 'Disable data collection temporarily'
    }
  }
};

// Medical Specialties for Error Context
export const MEDICAL_SPECIALTIES = {
  KARDIOLOGIE: 'kardiologie',
  ONKOLOGIE: 'onkologie', 
  GALLENBLASE: 'gallenblase',
  NEPHROLOGIE: 'nephrologie',
  SCHILDDRUESE: 'schilddruese',
  INTENSIVMEDIZIN: 'intensivmedizin',
  ALLGEMEINE_FRAGEN: 'allgemeine-fragen',
  UNKNOWN: 'unknown'
};

// Healthcare User Personas for Error Context
export const HEALTHCARE_USER_PERSONAS = {
  PATIENT: {
    code: 'patient',
    name: 'Patient',
    description: 'Individual seeking medical second opinion',
    errorPriority: 'high', // Patient errors need quick resolution
    contextualInfo: {
      stressLevel: 'high', // Medical concerns create stress
      technicalExpertise: 'low',
      accessibilityNeeds: 'variable',
      mobileUsage: 'primary'
    }
  },
  
  HEALTHCARE_PROFESSIONAL: {
    code: 'healthcare_professional',
    name: 'Healthcare Professional',
    description: 'Doctor, nurse, or medical professional using platform',
    errorPriority: 'critical', // Medical professionals need immediate resolution
    contextualInfo: {
      stressLevel: 'medium',
      technicalExpertise: 'medium',
      accessibilityNeeds: 'standard',
      mobileUsage: 'frequent'
    }
  },

  MEDICAL_REVIEWER: {
    code: 'medical_reviewer',
    name: 'Medical Content Reviewer',
    description: 'Medical professional reviewing and approving content',
    errorPriority: 'high',
    contextualInfo: {
      stressLevel: 'low',
      technicalExpertise: 'high',
      accessibilityNeeds: 'standard',
      mobileUsage: 'desktop-primary'
    }
  },

  EMERGENCY_USER: {
    code: 'emergency_user', 
    name: 'Emergency User',
    description: 'User in medical emergency seeking immediate help',
    errorPriority: 'critical',
    contextualInfo: {
      stressLevel: 'critical', // Emergency = maximum stress
      technicalExpertise: 'variable',
      accessibilityNeeds: 'urgent',
      mobileUsage: 'exclusive'
    }
  },

  CAREGIVER: {
    code: 'caregiver',
    name: 'Patient Caregiver',
    description: 'Family member or caregiver acting on behalf of patient',
    errorPriority: 'high',
    contextualInfo: {
      stressLevel: 'high',
      technicalExpertise: 'variable',
      accessibilityNeeds: 'often-present',
      mobileUsage: 'primary'
    }
  }
};

// Error Priority Matrix
export const ERROR_PRIORITY_MATRIX = {
  // Emergency Users - Everything is critical
  [HEALTHCARE_USER_PERSONAS.EMERGENCY_USER.code]: {
    [MEDICAL_ERROR_CATEGORIES.EMERGENCY_COMPONENT.code]: 'P0', // Immediate
    [MEDICAL_ERROR_CATEGORIES.PATIENT_SAFETY.code]: 'P0',
    [MEDICAL_ERROR_CATEGORIES.PATIENT_FORM.code]: 'P1', // <15 min
    [MEDICAL_ERROR_CATEGORIES.API_FAILURE.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.ACCESSIBILITY.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.NAVIGATION.code]: 'P2' // <1 hour
  },

  // Healthcare Professionals - Need reliable tools
  [HEALTHCARE_USER_PERSONAS.HEALTHCARE_PROFESSIONAL.code]: {
    [MEDICAL_ERROR_CATEGORIES.EMERGENCY_COMPONENT.code]: 'P0',
    [MEDICAL_ERROR_CATEGORIES.PATIENT_SAFETY.code]: 'P0', 
    [MEDICAL_ERROR_CATEGORIES.AUTHENTICATION.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.API_FAILURE.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.PATIENT_FORM.code]: 'P2',
    [MEDICAL_ERROR_CATEGORIES.UI_COMPONENT.code]: 'P3'
  },

  // Regular Patients - Focus on core functionality
  [HEALTHCARE_USER_PERSONAS.PATIENT.code]: {
    [MEDICAL_ERROR_CATEGORIES.EMERGENCY_COMPONENT.code]: 'P0',
    [MEDICAL_ERROR_CATEGORIES.PATIENT_SAFETY.code]: 'P0',
    [MEDICAL_ERROR_CATEGORIES.PATIENT_FORM.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.ACCESSIBILITY.code]: 'P1',
    [MEDICAL_ERROR_CATEGORIES.NAVIGATION.code]: 'P2',
    [MEDICAL_ERROR_CATEGORIES.PERFORMANCE.code]: 'P3'
  }
};

// Healthcare Error Context Enrichment
export const HEALTHCARE_ERROR_CONTEXT = {
  MEDICAL_JOURNEY_STAGES: {
    DISCOVERY: 'discovery', // Learning about services
    SELECTION: 'selection', // Choosing specialty/doctor
    CONSULTATION: 'consultation', // Active medical consultation
    FOLLOW_UP: 'follow_up', // Post-consultation
    EMERGENCY: 'emergency' // Emergency medical situation
  },

  ACCESSIBILITY_MODES: {
    SCREEN_READER: 'screen_reader',
    HIGH_CONTRAST: 'high_contrast',
    REDUCED_MOTION: 'reduced_motion',
    LARGE_TEXT: 'large_text',
    VOICE_CONTROL: 'voice_control'
  },

  DEVICE_CONTEXTS: {
    MOBILE_EMERGENCY: 'mobile_emergency', // Mobile in emergency
    DESKTOP_PROFESSIONAL: 'desktop_professional', // Doctor at desk
    TABLET_BEDSIDE: 'tablet_bedside', // Bedside consultation
    MOBILE_STANDARD: 'mobile_standard' // Regular mobile usage
  }
};

/**
 * Get Error Category Details
 * @param {string} categoryCode - Error category code
 * @returns {Object} Category details with escalation info
 */
export function getMedicalErrorCategory(categoryCode) {
  const category = Object.values(MEDICAL_ERROR_CATEGORIES)
    .find(cat => cat.code === categoryCode);
  
  return category || MEDICAL_ERROR_CATEGORIES.UI_COMPONENT; // Default fallback
}

/**
 * Calculate Error Priority
 * @param {string} categoryCode - Error category
 * @param {string} userPersona - User persona code
 * @param {boolean} emergencyContext - Is this an emergency context?
 * @returns {string} Priority level (P0-P3)
 */
export function calculateErrorPriority(categoryCode, userPersona, emergencyContext = false) {
  // Emergency context overrides everything
  if (emergencyContext) {
    return 'P0';
  }

  // Check priority matrix
  const userMatrix = ERROR_PRIORITY_MATRIX[userPersona];
  if (userMatrix && userMatrix[categoryCode]) {
    return userMatrix[categoryCode];
  }

  // Default priority based on category severity
  const category = getMedicalErrorCategory(categoryCode);
  const priorityMap = {
    critical: 'P0',
    high: 'P1', 
    medium: 'P2',
    low: 'P3'
  };

  return priorityMap[category.severity] || 'P3';
}

/**
 * Get Required Response Time
 * @param {string} priority - Priority level
 * @returns {string} Response time requirement
 */
export function getResponseTime(priority) {
  const responseMap = {
    P0: '5 minutes', // Immediate
    P1: '30 minutes', // High priority
    P2: '2 hours', // Medium priority
    P3: '24 hours' // Low priority
  };

  return responseMap[priority] || '24 hours';
}

/**
 * Get Escalation Team
 * @param {string} categoryCode - Error category code
 * @returns {Array} List of teams to notify
 */
export function getEscalationTeam(categoryCode) {
  const category = getMedicalErrorCategory(categoryCode);
  return category.escalation?.notify || ['tech-support'];
}

export default {
  MEDICAL_ERROR_CATEGORIES,
  MEDICAL_SPECIALTIES,
  HEALTHCARE_USER_PERSONAS,
  ERROR_PRIORITY_MATRIX,
  HEALTHCARE_ERROR_CONTEXT,
  getMedicalErrorCategory,
  calculateErrorPriority,
  getResponseTime,
  getEscalationTeam
};