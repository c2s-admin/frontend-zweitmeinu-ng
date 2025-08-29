/**
 * Healthcare Lazy Component Exports
 * 
 * Optimized lazy loading for healthcare components with:
 * - Emergency components preloaded
 * - Medical context prioritization
 * - Mobile-first loading strategies
 * - Memory-efficient chunking
 */

import { Suspense, ComponentType } from 'react'
import { createHealthcareLazy, type HealthcareLoadingConfig } from '../../lib/performance'

// Healthcare loading fallbacks
const HealthcareLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8" aria-label="Medizinische Komponente wird geladen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
    <span className="ml-3 text-healthcare-primary">Wird geladen...</span>
  </div>
)

const EmergencyLoadingFallback = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
    <div className="flex items-center gap-3">
      <div className="animate-pulse h-6 w-6 bg-red-600 rounded-full"></div>
      <div>
        <p className="font-medium text-red-800">Notfall-Komponente wird geladen...</p>
        <p className="text-sm text-red-600">
          Bei kritischen Fällen wählen Sie bitte direkt: <a href="tel:112" className="underline font-bold">112</a>
        </p>
      </div>
    </div>
  </div>
)

const MedicalLoadingFallback = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="animate-pulse h-6 w-6 bg-blue-600 rounded-full"></div>
      <div>
        <p className="font-medium text-blue-800">Medizinische Daten werden geladen...</p>
        <p className="text-sm text-blue-600">Ihre Daten sind sicher und verschlüsselt übertragen.</p>
      </div>
    </div>
  </div>
)

// Healthcare-specific loading configurations
const HEALTHCARE_CONFIGS: Record<string, HealthcareLoadingConfig> = {
  emergency: {
    priority: 'critical',
    preload: true,
    webpackPreload: true,
    medicalContext: true
  },
  critical: {
    priority: 'critical',
    preload: true,
    webpackPrefetch: true,
    medicalContext: true
  },
  important: {
    priority: 'important',
    preload: false,
    webpackPrefetch: true,
    medicalContext: true
  },
  standard: {
    priority: 'standard',
    preload: false,
    webpackPrefetch: false,
    medicalContext: true
  },
  deferred: {
    priority: 'deferred',
    preload: false,
    webpackPrefetch: false,
    medicalContext: false
  }
}

// Emergency Components (Critical - Always Preloaded)
export const LazyEmergencyBanner = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "emergency-banner" */
    /* webpackPreload: true */
    '../../stories/EmergencyBanner'
  ).then(module => ({ default: module.EmergencyBanner })),
  { 
    ...HEALTHCARE_CONFIGS.emergency,
    chunkName: 'emergency-banner'
  }
)

export const LazyHealthcareModal = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "healthcare-modal" */
    /* webpackPreload: true */
    '../../stories/HealthcareModal'
  ).then(module => ({ default: module.HealthcareModal })),
  { 
    ...HEALTHCARE_CONFIGS.emergency,
    chunkName: 'healthcare-modal'
  }
)

// Core Healthcare Components (Important)
export const LazyHealthcareButton = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "healthcare-button" */
    /* webpackPrefetch: true */
    '../../stories/Button'
  ).then(module => ({ default: module.Button })),
  { 
    ...HEALTHCARE_CONFIGS.important,
    chunkName: 'healthcare-button'
  }
)

export const LazyHealthcareCard = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "healthcare-card" */
    /* webpackPrefetch: true */
    '../../stories/HealthcareCard'
  ).then(module => ({ default: module.HealthcareCard })),
  { 
    ...HEALTHCARE_CONFIGS.important,
    chunkName: 'healthcare-card'
  }
)

export const LazyHealthcareInput = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "healthcare-input" */
    /* webpackPrefetch: true */
    '../../stories/HealthcareInput'
  ).then(module => ({ default: module.HealthcareInput })),
  { 
    ...HEALTHCARE_CONFIGS.important,
    chunkName: 'healthcare-input'
  }
)

// Medical Consultation Components (Standard)
export const LazyConsultationFlow = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "consultation-flow" */
    '../../stories/ConsultationFlow'
  ).then(module => ({ default: module.ConsultationFlow })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'consultation-flow'
  }
)

export const LazyDoctorProfile = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "doctor-profile" */
    '../../stories/DoctorProfile'
  ).then(module => ({ default: module.DoctorProfile })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'doctor-profile'
  }
)

export const LazySpecialtySelector = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "specialty-selector" */
    '../../stories/SpecialtySelector'
  ).then(module => ({ default: module.SpecialtySelector })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'specialty-selector'
  }
)

export const LazyMedicalFAQ = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "medical-faq" */
    '../../stories/MedicalFAQ'
  ).then(module => ({ default: module.MedicalFAQ })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'medical-faq'
  }
)

// Healthcare Date and Data Components
export const LazyHealthcareDatePicker = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "healthcare-datepicker" */
    '../../stories/HealthcareDatePicker'
  ).then(module => ({ default: module.HealthcareDatePicker })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'healthcare-datepicker'
  }
)

export const LazyFileUpload = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "file-upload" */
    '../../stories/FileUpload'
  ).then(module => ({ default: module.FileUpload })),
  { 
    ...HEALTHCARE_CONFIGS.deferred,
    chunkName: 'file-upload'
  }
)

// Content Section Components (Standard)
export const LazyMotivationHero = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "motivation-hero" */
    '../../stories/MotivationHero'
  ).then(module => ({ default: module.MotivationHero })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'motivation-hero'
  }
)

export const LazyStorySection = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "story-section" */
    '../../stories/StorySection'
  ).then(module => ({ default: module.StorySection })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'story-section'
  }
)

export const LazyCoreValues = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "core-values" */
    '../../stories/CoreValues'
  ).then(module => ({ default: module.CoreValues })),
  { 
    ...HEALTHCARE_CONFIGS.standard,
    chunkName: 'core-values'
  }
)

// Privacy and Compliance Components (Important)
export const LazyConsentManager = createHealthcareLazy(
  () => import(
    /* webpackChunkName: "consent-manager" */
    '../../stories/ConsentManager'
  ).then(module => ({ default: module.ConsentManager })),
  { 
    ...HEALTHCARE_CONFIGS.important,
    chunkName: 'consent-manager'
  }
)

// Healthcare Component Wrapper with Suspense
export interface HealthcareComponentWrapperProps {
  children: React.ReactNode
  fallback?: React.ComponentType
  priority?: 'emergency' | 'medical' | 'standard'
  'aria-label'?: string
}

export const HealthcareComponentWrapper = ({ 
  children, 
  fallback,
  priority = 'standard',
  'aria-label': ariaLabel
}: HealthcareComponentWrapperProps) => {
  const getFallback = () => {
    if (fallback) {
      const FallbackComponent = fallback
      return <FallbackComponent />
    }

    switch (priority) {
      case 'emergency':
        return <EmergencyLoadingFallback />
      case 'medical':
        return <MedicalLoadingFallback />
      default:
        return <HealthcareLoadingSpinner />
    }
  }

  return (
    <Suspense fallback={getFallback()}>
      <div aria-label={ariaLabel} role="region">
        {children}
      </div>
    </Suspense>
  )
}

// Healthcare Section Components with Optimized Loading
export const HealthcareEmergencySection = ({ children, ...props }: { children: React.ReactNode }) => (
  <HealthcareComponentWrapper priority="emergency" aria-label="Notfall-Bereich" {...props}>
    {children}
  </HealthcareComponentWrapper>
)

export const HealthcareMedicalSection = ({ children, ...props }: { children: React.ReactNode }) => (
  <HealthcareComponentWrapper priority="medical" aria-label="Medizinischer Bereich" {...props}>
    {children}
  </HealthcareComponentWrapper>
)

export const HealthcareStandardSection = ({ children, ...props }: { children: React.ReactNode }) => (
  <HealthcareComponentWrapper priority="standard" aria-label="Informations-Bereich" {...props}>
    {children}
  </HealthcareComponentWrapper>
)

// Preload utilities for healthcare components
export const preloadEmergencyComponents = async () => {
  await Promise.all([
    import('../../stories/EmergencyBanner'),
    import('../../stories/HealthcareModal'),
  ])
}

export const preloadCoreHealthcareComponents = async () => {
  await Promise.all([
    import('../../stories/Button'),
    import('../../stories/HealthcareCard'),
    import('../../stories/HealthcareInput'),
    import('../../stories/ConsentManager')
  ])
}

export const preloadConsultationComponents = async () => {
  await Promise.all([
    import('../../stories/ConsultationFlow'),
    import('../../stories/DoctorProfile'),
    import('../../stories/SpecialtySelector'),
    import('../../stories/MedicalFAQ')
  ])
}

// Component registry for dynamic loading
export const HEALTHCARE_COMPONENT_REGISTRY = {
  // Emergency components
  EmergencyBanner: LazyEmergencyBanner,
  HealthcareModal: LazyHealthcareModal,
  
  // Core components
  HealthcareButton: LazyHealthcareButton,
  HealthcareCard: LazyHealthcareCard,
  HealthcareInput: LazyHealthcareInput,
  
  // Medical components
  ConsultationFlow: LazyConsultationFlow,
  DoctorProfile: LazyDoctorProfile,
  SpecialtySelector: LazySpecialtySelector,
  MedicalFAQ: LazyMedicalFAQ,
  HealthcareDatePicker: LazyHealthcareDatePicker,
  FileUpload: LazyFileUpload,
  
  // Content components
  MotivationHero: LazyMotivationHero,
  StorySection: LazyStorySection,
  CoreValues: LazyCoreValues,
  
  // Privacy components
  ConsentManager: LazyConsentManager
} as const

export type HealthcareComponentName = keyof typeof HEALTHCARE_COMPONENT_REGISTRY

// Dynamic component loader with error boundary
export const loadHealthcareComponent = async (componentName: HealthcareComponentName): Promise<ComponentType<any>> => {
  try {
    const Component = HEALTHCARE_COMPONENT_REGISTRY[componentName]
    if (!Component) {
      throw new Error(`Healthcare component '${componentName}' not found`)
    }
    return Component
  } catch (error) {
    console.error(`Failed to load healthcare component '${componentName}':`, error)
    // Return error fallback component
    const FallbackComponent: React.FC = () => (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert">
        <p className="text-red-800 font-medium">Komponente konnte nicht geladen werden</p>
        <p className="text-red-600 text-sm">
          Bei dringenden medizinischen Fragen kontaktieren Sie bitte direkt: 
          <a href="tel:+4980080441100" className="underline font-bold ml-1">+49 800 80 44 100</a>
        </p>
      </div>
    )
    FallbackComponent.displayName = 'HealthcareErrorFallbackComponent'
    return FallbackComponent
  }
}
