/**
 * Healthcare Analytics Configuration
 * GDPR-compliant analytics setup for zweitmeinung.ng medical platform
 */

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

// Healthcare-specific configuration
const HEALTHCARE_CONFIG = {
  // GDPR Compliance Settings
  privacy: {
    anonymizeIp: true,
    cookieFlags: 'SameSite=Strict; Secure',
    cookieDomain: process.env.NODE_ENV === 'production' ? '.zweitmeinung.ng' : 'localhost',
    respectDNT: true, // Respect Do Not Track headers
    consentRequired: true,
  },
  
  // Medical Context Settings  
  medical: {
    // Never track sensitive medical data
    sensitiveDataFilters: [
      'medicalConcern',
      'patientData', 
      'symptoms',
      'diagnosis',
      'personalHealthInfo'
    ],
    
    // Healthcare user personas
    userTypes: [
      'patient',
      'healthcare_professional', 
      'designer',
      'developer',
      'medical_reviewer'
    ],
    
    // Medical urgency levels
    urgencyLevels: [
      'emergency',
      'urgent', 
      'routine',
      'preventive'
    ]
  },
  
  // Component tracking settings
  components: {
    trackViews: true,
    trackInteractions: true,
    trackAccessibility: true,
    trackPerformance: true
  }
}

// Initialize Analytics with Healthcare Configuration
const analytics = Analytics({
  app: 'zweitmeinung-healthcare-design-system',
  version: '1.0.0',
  debug: process.env.NODE_ENV === 'development',
  
  plugins: [
    googleAnalytics({
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      customMap: {
        // Healthcare custom dimensions
        'healthcare_context': 'custom_map.healthcare_context',
        'user_persona': 'custom_map.user_persona', 
        'accessibility_mode': 'custom_map.accessibility_mode',
        'medical_specialty': 'custom_map.medical_specialty'
      },
      
      // GDPR compliance
      anonymize_ip: HEALTHCARE_CONFIG.privacy.anonymizeIp,
      cookie_flags: HEALTHCARE_CONFIG.privacy.cookieFlags,
      cookie_domain: HEALTHCARE_CONFIG.privacy.cookieDomain,
      
      // Healthcare-specific settings
      custom_map: {
        healthcare_context: 'dimension1',
        user_persona: 'dimension2', 
        accessibility_mode: 'dimension3',
        medical_specialty: 'dimension4'
      }
    })
  ],
  
  // Global event middleware for healthcare compliance
  middleware: [
    // Filter sensitive medical data
    ({ payload, next }) => {
      // Remove any sensitive medical information
      const filteredPayload = { ...payload }
      
      HEALTHCARE_CONFIG.medical.sensitiveDataFilters.forEach(field => {
        if (filteredPayload.properties && filteredPayload.properties[field]) {
          delete filteredPayload.properties[field]
        }
      })
      
      next(filteredPayload)
    },
    
    // Add healthcare context
    ({ payload, next }) => {
      const enrichedPayload = {
        ...payload,
        properties: {
          ...payload.properties,
          healthcare_platform: 'zweitmeinung.ng',
          platform_type: 'medical_second_opinion',
          gdpr_compliant: true,
          timestamp: new Date().toISOString()
        }
      }
      
      next(enrichedPayload)
    }
  ]
})

export default analytics
export { HEALTHCARE_CONFIG }