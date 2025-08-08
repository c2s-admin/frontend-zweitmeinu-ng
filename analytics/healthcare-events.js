/**
 * Healthcare-Specific Event Tracking
 * Medical context event definitions for zweitmeinung.ng design system
 */

import analytics from './analytics-config.js'

/**
 * Healthcare Component Events
 * Track component usage in medical contexts with GDPR compliance
 */
export const HealthcareEvents = {
  
  // Component View Events
  componentView: (componentName, context = {}) => {
    analytics.track('Healthcare Component View', {
      component_name: componentName,
      component_category: getComponentCategory(componentName),
      healthcare_context: context.healthcareContext || 'general',
      user_persona: context.userPersona || 'unknown',
      accessibility_mode: context.accessibilityMode || 'standard',
      medical_specialty: context.medicalSpecialty || 'general',
      
      // Performance context
      page_load_time: context.pageLoadTime,
      component_render_time: context.componentRenderTime,
      
      // No sensitive medical data - GDPR compliant
      timestamp: new Date().toISOString()
    })
  },
  
  // User Interaction Events  
  componentInteraction: (componentName, action, context = {}) => {
    analytics.track('Healthcare Component Interaction', {
      component_name: componentName,
      interaction_type: action,
      healthcare_context: context.healthcareContext || 'general',
      user_persona: context.userPersona || 'unknown',
      
      // Emergency context tracking (important for medical platform)
      is_emergency: context.isEmergency || false,
      urgency_level: context.urgencyLevel || 'routine',
      
      // Accessibility interaction tracking
      accessibility_method: context.accessibilityMethod, // keyboard, screen_reader, voice
      touch_target_size: context.touchTargetSize,
      
      // No sensitive data tracked
      timestamp: new Date().toISOString()
    })
  },
  
  // Accessibility Usage Events
  accessibilityFeature: (featureName, context = {}) => {
    analytics.track('Healthcare Accessibility Feature', {
      feature_name: featureName,
      feature_category: getAccessibilityCategory(featureName),
      healthcare_context: context.healthcareContext || 'general',
      user_needs: context.userNeeds || [], // e.g., ['high_contrast', 'screen_reader']
      
      // Medical accessibility context
      medical_stress_level: context.medicalStressLevel || 'normal', // normal, elevated, high
      emergency_access: context.emergencyAccess || false,
      
      // Success tracking
      feature_success: context.featureSuccess !== undefined ? context.featureSuccess : true,
      error_encountered: context.errorEncountered || false,
      
      timestamp: new Date().toISOString()
    })
  },
  
  // Design System Usage Events  
  designSystemUsage: (tokenName, context = {}) => {
    analytics.track('Healthcare Design System Usage', {
      token_name: tokenName,
      token_category: getTokenCategory(tokenName),
      usage_context: context.usageContext || 'component',
      
      // Healthcare design context
      medical_context: context.medicalContext || 'general',
      trust_element: context.trustElement || false, // medical credentials, certifications
      emergency_element: context.emergencyElement || false,
      
      // Design system metrics
      token_value: context.tokenValue, // color hex, size px, etc (no sensitive data)
      component_using_token: context.componentUsingToken,
      
      timestamp: new Date().toISOString()
    })
  },
  
  // Storybook-Specific Events
  storybook: {
    storyView: (storyName, context = {}) => {
      analytics.track('Healthcare Storybook Story View', {
        story_name: storyName,
        story_category: getStoryCategory(storyName),
        storybook_version: context.storybookVersion || '9.1.1',
        
        // Healthcare story context
        medical_scenario: context.medicalScenario || 'standard',
        accessibility_story: context.accessibilityStory || false,
        emergency_story: context.emergencyStory || false,
        
        // User context in Storybook
        viewer_type: context.viewerType || 'unknown', // designer, developer, medical_reviewer
        device_type: context.deviceType, // desktop, mobile, tablet
        
        timestamp: new Date().toISOString()
      })
    },
    
    addonUsage: (addonName, context = {}) => {
      analytics.track('Healthcare Storybook Addon Usage', {
        addon_name: addonName,
        addon_category: getAddonCategory(addonName),
        
        // Medical addon context
        accessibility_testing: context.accessibilityTesting || false,
        medical_review: context.medicalReview || false,
        
        // Usage metrics
        usage_duration: context.usageDuration,
        success_rate: context.successRate,
        
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // Healthcare Form Events (GDPR-compliant)
  medicalForm: {
    formStart: (formType, context = {}) => {
      analytics.track('Healthcare Form Started', {
        form_type: formType,
        healthcare_context: context.healthcareContext || 'general',
        user_persona: context.userPersona || 'patient',
        
        // Form context (no sensitive data)
        form_complexity: context.formComplexity || 'standard',
        estimated_completion_time: context.estimatedCompletionTime,
        accessibility_mode: context.accessibilityMode,
        
        // Emergency context
        is_emergency_form: context.isEmergencyForm || false,
        
        timestamp: new Date().toISOString()
      })
    },
    
    formComplete: (formType, context = {}) => {
      analytics.track('Healthcare Form Completed', {
        form_type: formType,
        completion_time: context.completionTime,
        healthcare_context: context.healthcareContext || 'general',
        
        // Success metrics (no sensitive data)
        validation_errors: context.validationErrors || 0,
        accessibility_assistance_used: context.accessibilityAssistanceUsed || false,
        
        // User experience metrics
        user_satisfaction: context.userSatisfaction, // optional rating
        
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // Error Tracking (Healthcare-Safe)
  healthcareError: (errorType, context = {}) => {
    analytics.track('Healthcare System Error', {
      error_type: errorType,
      error_category: getErrorCategory(errorType),
      healthcare_context: context.healthcareContext || 'general',
      
      // Error context (no sensitive data)
      component_name: context.componentName,
      error_severity: context.errorSeverity || 'medium',
      user_impact: context.userImpact || 'medium',
      
      // Emergency handling
      blocks_emergency_access: context.blocksEmergencyAccess || false,
      fallback_available: context.fallbackAvailable || true,
      
      // Recovery information
      error_recovered: context.errorRecovered || false,
      recovery_time: context.recoveryTime,
      
      timestamp: new Date().toISOString()
    })
  }
}

// Helper functions for categorization
function getComponentCategory(componentName) {
  const categories = {
    'HealthcareButton': 'form',
    'HealthcareCard': 'display',
    'HealthcareInput': 'form',
    'HealthcareSelect': 'form',
    'HealthcareModal': 'overlay',
    'HealthcareAlert': 'notification',
    'EmergencyBanner': 'emergency',
    'DoctorProfile': 'medical',
    'SpecialtySelector': 'medical',
    'MedicalFAQ': 'medical',
    'ConsentManager': 'privacy',
    'FileUpload': 'form'
  }
  
  return categories[componentName] || 'general'
}

function getAccessibilityCategory(featureName) {
  const categories = {
    'high_contrast': 'visual',
    'screen_reader': 'visual', 
    'keyboard_navigation': 'motor',
    'voice_input': 'motor',
    'large_touch_targets': 'motor',
    'reduced_motion': 'vestibular',
    'simplified_language': 'cognitive'
  }
  
  return categories[featureName] || 'general'
}

function getTokenCategory(tokenName) {
  if (tokenName.includes('color')) return 'color'
  if (tokenName.includes('font') || tokenName.includes('text')) return 'typography'
  if (tokenName.includes('space') || tokenName.includes('margin') || tokenName.includes('padding')) return 'spacing'
  if (tokenName.includes('size') || tokenName.includes('width') || tokenName.includes('height')) return 'sizing'
  return 'general'
}

function getStoryCategory(storyName) {
  if (storyName.includes('Emergency')) return 'emergency'
  if (storyName.includes('Accessibility')) return 'accessibility'  
  if (storyName.includes('Medical') || storyName.includes('Healthcare')) return 'medical'
  if (storyName.includes('Form')) return 'form'
  return 'general'
}

function getAddonCategory(addonName) {
  const categories = {
    'a11y': 'accessibility',
    'docs': 'documentation',
    'controls': 'development',
    'vitest': 'testing'
  }
  
  return categories[addonName] || 'general'
}

function getErrorCategory(errorType) {
  const categories = {
    'component_render': 'frontend',
    'api_failure': 'backend',
    'validation_error': 'form',
    'network_error': 'infrastructure',
    'accessibility_error': 'accessibility'
  }
  
  return categories[errorType] || 'general'
}

export default HealthcareEvents