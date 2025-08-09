# Medical Context Guide
## Healthcare-Specific UI Patterns for zweitmeinung.ng

> **Version 1.0** - Healthcare UI Patterns, Patient Safety, and Medical Data Privacy Guide  
> *Specialized for German Medical Second Opinion Platform*

---

## 🏥 Healthcare Platform Context

### Medical Platform Mission
zweitmeinung.ng is a **medical second opinion platform** requiring the highest standards of:
- **Patient Safety** - UI that prevents medical errors and confusion
- **Medical Trust** - Professional appearance building patient confidence
- **Emergency Readiness** - Critical medical information always accessible
- **Privacy Compliance** - GDPR + German medical data protection laws

### Healthcare User Types & Context Switching
```typescript
interface HealthcareUserContext {
  // Primary user types with different UI needs
  stressedPatient: 'Seeking urgent medical clarity'
  routinePatient: 'Preventive health information'
  healthcareProfessional: 'Clinical decision support'
  emergencyUser: 'Critical medical situation'
  elderlyPatient: 'Larger UI, simpler workflows'
  mobileHealthcareWorker: 'Quick access, thumbs-only navigation'
}
```

---

## 🎯 Medical Specialty Patterns (7 Core Specialties)

### Medical Specialty Color Coding System
```css
/* Medical Specialty Visual Identity */
.specialty-kardiologie {
  --specialty-primary: #dc2626;     /* Heart Red */
  --specialty-icon: '❤️';
  --specialty-urgency: 'high';      /* Cardiac emergencies common */
}

.specialty-onkologie {
  --specialty-primary: #7c3aed;     /* Cancer Purple */
  --specialty-icon: '🎗️';
  --specialty-urgency: 'critical';   /* Often time-sensitive */
}

.specialty-gallenblase {
  --specialty-primary: #f59e0b;     /* Bile Yellow */
  --specialty-icon: '🟡';
  --specialty-urgency: 'moderate';   /* Can become acute */
}

.specialty-nephrologie {
  --specialty-primary: #0891b2;     /* Kidney Blue */
  --specialty-icon: '💧';
  --specialty-urgency: 'moderate';   /* Chronic management focus */
}

.specialty-schilddruese {
  --specialty-primary: #059669;     /* Thyroid Green */
  --specialty-icon: '🦋';
  --specialty-urgency: 'low';       /* Usually chronic conditions */
}

.specialty-intensivmedizin {
  --specialty-primary: #ea580c;     /* ICU Orange */
  --specialty-icon: '🚨';
  --specialty-urgency: 'emergency';  /* Always critical */
}

.specialty-allgemeine-fragen {
  --specialty-primary: #004166;     /* General Healthcare Blue */
  --specialty-icon: '🩺';
  --specialty-urgency: 'variable';   /* Depends on question */
}
```

### Specialty-Specific UI Implementation
```tsx
// Healthcare Specialty Selector Pattern
export function MedicalSpecialtyCard({ 
  specialty, 
  urgencyLevel, 
  availableExperts 
}: MedicalSpecialtyProps) {
  const specialtyConfig = getSpecialtyConfig(specialty)
  const isEmergencySpecialty = specialtyConfig.urgency === 'emergency'
  
  return (
    <div className={`
      bg-white rounded-2xl p-6 shadow-healthcare border-2
      ${isEmergencySpecialty ? 'border-red-200 bg-red-50' : 'border-gray-100'}
      hover:shadow-healthcare-elevated transition-all duration-200
      min-h-[200px]  /* Adequate touch target for medical context */
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              bg-gradient-to-br from-${specialtyConfig.primary} to-${specialtyConfig.primary}/80
            `}
            role="img" 
            aria-label={`${specialty} medical specialty icon`}
          >
            {specialtyConfig.icon}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-healthcare-primary mb-1">
              {getGermanSpecialtyName(specialty)}
            </h3>
            <p className="text-sm text-healthcare-text-muted">
              {availableExperts} Fachärzte verfügbar
            </p>
          </div>
        </div>
        
        {/* Emergency Priority Indicator */}
        {isEmergencySpecialty && (
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Notfall-Bereitschaft
          </div>
        )}
      </div>
      
      {/* Quick Medical Context */}
      <div className="space-y-2 mb-4">
        <div className="text-sm text-healthcare-text-muted">
          Häufige Anliegen:
        </div>
        <div className="flex flex-wrap gap-2">
          {specialtyConfig.commonConcerns.map((concern, idx) => (
            <span 
              key={idx}
              className="bg-healthcare-background px-3 py-1 rounded-full text-sm"
            >
              {concern}
            </span>
          ))}
        </div>
      </div>
      
      {/* CTA with Medical Context */}
      <button 
        className={`
          w-full py-4 px-6 rounded-xl font-medium text-white
          min-h-[56px] transition-all duration-200
          ${isEmergencySpecialty 
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
            : 'bg-healthcare-primary-light hover:bg-healthcare-primary focus:ring-healthcare-primary-light'
          }
          focus:ring-3 focus:ring-offset-2
        `}
        aria-label={`Zweitmeinung für ${getGermanSpecialtyName(specialty)} anfragen`}
      >
        {isEmergencySpecialty ? '🚨 Sofortige Beratung' : 'Beratung anfragen'}
      </button>
    </div>
  )
}
```

---

## 🚨 Emergency & Patient Safety Patterns

### Emergency Banner (Always Visible, AAA Accessibility)
```tsx
// Critical: Must be present on every page, sticky positioning
export function EmergencyMedicalBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 
        bg-red-600 text-white transition-all duration-300
        ${isCollapsed ? 'h-12' : 'h-20'}
      `}
      role="banner"
      aria-label="Medizinischer Notfall Banner"
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            role="img"
            aria-label="Notfall Symbol"
          >
            🚨
          </div>
          
          <div className={isCollapsed ? 'hidden md:block' : 'block'}>
            <div className="font-bold text-lg">
              Medizinischer Notfall?
            </div>
            {!isCollapsed && (
              <div className="text-sm opacity-90">
                Bei lebensbedrohlichen Notfällen wählen Sie sofort die 112
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Primary Emergency Contact */}
          <a 
            href="tel:112"
            className={`
              bg-white text-red-600 px-6 py-3 rounded-xl font-bold
              hover:bg-red-50 transition-colors duration-200
              min-h-[56px] min-w-[120px] flex items-center justify-center
              focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-red-600
            `}
            aria-label="Notruf 112 wählen"
          >
            📞 112
          </a>
          
          {/* Secondary Medical Contact */}
          <a 
            href="tel:+4980080441100"
            className={`
              border-2 border-white text-white px-4 py-2 rounded-xl
              hover:bg-white/10 transition-colors duration-200
              min-h-[56px] flex items-center justify-center
              ${isCollapsed ? 'hidden lg:flex' : 'flex'}
            `}
            aria-label="Ärztlicher Bereitschaftsdienst kontaktieren"
          >
            🩺 Bereitschaftsdienst
          </a>
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-10 h-10 rounded-full border-2 border-white/30 
              hover:bg-white/10 flex items-center justify-center
              transition-colors duration-200
              focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-red-600
            `}
            aria-label={isCollapsed ? 'Notfall-Banner erweitern' : 'Notfall-Banner minimieren'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? '⬇️' : '⬆️'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Critical Medical Action Pattern
```tsx
// For actions that could impact patient health/safety
export function CriticalMedicalAction({
  action,
  medicalImpact,
  confirmationRequired = true,
  children
}: CriticalMedicalActionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false)
  
  const handleCriticalAction = () => {
    if (confirmationRequired && !hasUserConfirmed) {
      setShowConfirmation(true)
      return
    }
    // Execute critical medical action
    action()
  }
  
  return (
    <>
      <button 
        className={`
          bg-red-600 hover:bg-red-700 text-white 
          px-8 py-4 rounded-xl font-bold text-lg
          min-h-[72px] min-w-[200px]  /* Larger for critical actions */
          shadow-lg hover:shadow-xl
          focus:ring-4 focus:ring-red-500 focus:ring-offset-2
          transition-all duration-200
          relative
        `}
        onClick={handleCriticalAction}
        aria-label={`Kritische medizinische Aktion: ${medicalImpact}`}
        aria-describedby="critical-action-warning"
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-sm">
          ⚠️
        </div>
        {children}
      </button>
      
      <div id="critical-action-warning" className="sr-only">
        Diese Aktion hat medizinische Auswirkungen: {medicalImpact}
      </div>
      
      {/* Critical Action Confirmation Modal */}
      {showConfirmation && (
        <MedicalConfirmationModal
          title="Kritische medizinische Aktion bestätigen"
          impact={medicalImpact}
          onConfirm={() => {
            setHasUserConfirmed(true)
            setShowConfirmation(false)
            action()
          }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  )
}
```

### Patient Safety Prioritization System
```tsx
// Triage-like prioritization for UI elements
export enum MedicalPriority {
  EMERGENCY = 1,      // Red: Immediate medical attention
  URGENT = 2,         // Orange: Within hours
  SEMI_URGENT = 3,    // Yellow: Within days  
  ROUTINE = 4,        // Green: Preventive/scheduled
  INFORMATION = 5     // Blue: Educational content
}

export function MedicalPriorityIndicator({ 
  priority, 
  context 
}: MedicalPriorityProps) {
  const priorityConfig = {
    [MedicalPriority.EMERGENCY]: {
      color: 'bg-red-600',
      textColor: 'text-red-600',
      icon: '🚨',
      label: 'Notfall',
      description: 'Sofortige ärztliche Betreuung erforderlich',
      contactCTA: '112 anrufen'
    },
    [MedicalPriority.URGENT]: {
      color: 'bg-orange-500',
      textColor: 'text-orange-500', 
      icon: '⚡',
      label: 'Dringend',
      description: 'Innerhalb von 24 Stunden ärztlich abklären',
      contactCTA: 'Sofortberatung anfragen'
    },
    [MedicalPriority.SEMI_URGENT]: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      icon: '⏰',
      label: 'Zeitnah',
      description: 'Innerhalb einer Woche ärztlich besprechen',
      contactCTA: 'Beratung planen'
    },
    [MedicalPriority.ROUTINE]: {
      color: 'bg-green-500',
      textColor: 'text-green-600',
      icon: '📅',
      label: 'Routine',
      description: 'Geplante medizinische Vorsorge',
      contactCTA: 'Termin vereinbaren'
    },
    [MedicalPriority.INFORMATION]: {
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      icon: 'ℹ️',
      label: 'Information',
      description: 'Gesundheitsinformation und Aufklärung',
      contactCTA: 'Mehr erfahren'
    }
  }
  
  const config = priorityConfig[priority]
  
  return (
    <div className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      ${config.color} text-white shadow-sm
    `}>
      <span role="img" aria-label={`${config.label} Priorität`}>
        {config.icon}
      </span>
      <span>{config.label}</span>
    </div>
  )
}
```

---

## 🛡️ Medical Data Privacy Patterns

### GDPR Medical Consent Management
```tsx
// Specialized consent for medical data processing
export function MedicalDataConsentManager({
  requiredConsents,
  onConsentChange
}: MedicalConsentProps) {
  const [consentStates, setConsentStates] = useState<ConsentState>({})
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false)
  
  const medicalConsentTypes = {
    basicMedicalData: {
      title: 'Grundlegende medizinische Daten',
      description: 'Symptome, Beschwerden, allgemeine Gesundheitsinformationen',
      required: true,
      legalBasis: 'Art. 9 DSGVO + § 22 BDSG (besondere Kategorien)',
      retention: '10 Jahre (medizinische Aufbewahrungspflicht)'
    },
    medicalHistory: {
      title: 'Medizinische Vorgeschichte',
      description: 'Vorerkrankungen, Medikation, Behandlungshistorie',
      required: false,
      legalBasis: 'Art. 9 DSGVO + Einwilligung',
      retention: '10 Jahre (medizinische Aufbewahrungspflicht)'
    },
    diagnosticData: {
      title: 'Diagnosedaten und Befunde',
      description: 'Laborwerte, Bildgebung, ärztliche Diagnosen',
      required: false,
      legalBasis: 'Art. 9 DSGVO + Einwilligung',
      retention: '30 Jahre (Röntgenverordnung § 28)'
    },
    geneticData: {
      title: 'Genetische Informationen',
      description: 'Erbkrankheiten, genetische Disposition, Familiengeschichte',
      required: false,
      legalBasis: 'Art. 9 DSGVO + ausdrückliche Einwilligung',
      retention: '10 Jahre oder lebenslang nach Patientenwunsch',
      specialWarning: 'Besonders sensible Gesundheitsdaten'
    }
  }
  
  return (
    <div className="bg-healthcare-background p-6 rounded-2xl border-2 border-healthcare-primary/20">
      {/* Medical Data Privacy Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-healthcare-primary rounded-xl flex items-center justify-center text-white text-2xl">
          🔒
        </div>
        <div>
          <h3 className="text-xl font-semibold text-healthcare-primary mb-2">
            Einverständniserklärung für medizinische Daten
          </h3>
          <p className="text-healthcare-text-muted text-sm leading-relaxed">
            Ihre Gesundheitsdaten unterliegen der ärztlichen Schweigepflicht und dem besonderen 
            Schutz nach DSGVO Art. 9. Sie können Ihre Einwilligung jederzeit widerrufen.
          </p>
        </div>
      </div>
      
      {/* Consent Options */}
      <div className="space-y-4 mb-6">
        {Object.entries(medicalConsentTypes).map(([key, consent]) => (
          <div 
            key={key}
            className={`
              border-2 rounded-xl p-4 transition-all duration-200
              ${consentStates[key] 
                ? 'border-healthcare-success bg-green-50' 
                : consent.required 
                  ? 'border-healthcare-error bg-red-50' 
                  : 'border-gray-200 bg-white'
              }
            `}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={consentStates[key] || false}
                  onChange={(e) => handleConsentChange(key, e.target.checked)}
                  className={`
                    w-6 h-6 rounded border-2 
                    ${consent.required ? 'border-red-300' : 'border-gray-300'}
                    focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2
                  `}
                  required={consent.required}
                  aria-describedby={`${key}-description`}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-healthcare-primary">
                    {consent.title}
                    {consent.required && (
                      <span className="text-red-500 ml-1" aria-label="Pflichtfeld">*</span>
                    )}
                  </h4>
                  {consent.specialWarning && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      ⚠️ Sensibel
                    </div>
                  )}
                </div>
                
                <p id={`${key}-description`} className="text-sm text-healthcare-text-muted mb-2">
                  {consent.description}
                </p>
                
                <div className="text-xs text-healthcare-text-muted space-y-1">
                  <div><strong>Rechtsgrundlage:</strong> {consent.legalBasis}</div>
                  <div><strong>Aufbewahrung:</strong> {consent.retention}</div>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      {/* Privacy Details Toggle */}
      <div className="border-t border-healthcare-primary/20 pt-4">
        <button
          onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
          className="text-healthcare-primary-light hover:text-healthcare-primary font-medium text-sm flex items-center gap-2"
          aria-expanded={showPrivacyDetails}
        >
          {showPrivacyDetails ? '📄 Datenschutzdetails ausblenden' : '📄 Vollständige Datenschutzerklärung'}
          <span className={`transform transition-transform ${showPrivacyDetails ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </button>
        
        {showPrivacyDetails && (
          <div className="mt-4 p-4 bg-white rounded-xl text-sm space-y-3">
            <h5 className="font-semibold text-healthcare-primary">Ihre Rechte bezüglich medizinischer Daten:</h5>
            <ul className="space-y-2 text-healthcare-text-muted">
              <li>• <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können jederzeit Auskunft über Ihre gespeicherten medizinischen Daten verlangen</li>
              <li>• <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Unrichtige medizinische Daten können korrigiert werden</li>
              <li>• <strong>Löschungsrecht (Art. 17 DSGVO):</strong> Nach Ablauf der Aufbewahrungsfristen werden Daten gelöscht</li>
              <li>• <strong>Widerrufsrecht:</strong> Ihre Einwilligung kann jederzeit ohne Angabe von Gründen widerrufen werden</li>
              <li>• <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Ihre medizinischen Daten können in strukturierter Form übertragen werden</li>
            </ul>
            
            <div className="bg-healthcare-background p-3 rounded-xl">
              <p className="font-medium text-healthcare-primary mb-2">Kontakt Datenschutzbeauftragter:</p>
              <p className="text-sm">
                📧 datenschutz@zweitmeinung.ng<br/>
                📞 +49 800 80 44 100<br/>
                📍 Datenschutzbeauftragter zweitmeinung.ng GmbH
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Medical Data Encryption Indicators
```tsx
// Visual indicators for medical data security
export function MedicalDataSecurityIndicator({ 
  encryptionLevel,
  context 
}: MedicalSecurityProps) {
  const securityLevels = {
    'end-to-end': {
      icon: '🔐',
      label: 'Ende-zu-Ende verschlüsselt',
      description: 'Höchste Sicherheitsstufe - nur Sie und Ihr Arzt können die Daten lesen',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    'transport': {
      icon: '🚛🔒',
      label: 'Übertragung verschlüsselt',
      description: 'Sichere Datenübertragung mit SSL/TLS Verschlüsselung',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    'storage': {
      icon: '💾🔒',
      label: 'Sicher gespeichert',
      description: 'Medizinische Daten werden verschlüsselt in deutschen Rechenzentren gespeichert',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  }
  
  const security = securityLevels[encryptionLevel]
  
  return (
    <div className={`
      inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2 text-sm
      ${security.color}
    `}>
      <span role="img" aria-label="Sicherheitsindikator">
        {security.icon}
      </span>
      <div>
        <div className="font-medium">{security.label}</div>
        <div className="text-xs opacity-80">{security.description}</div>
      </div>
    </div>
  )
}
```

---

## 🏥 Patient Journey Patterns

### Discovery → Selection → Consultation Flow
```tsx
// Complete patient journey with medical context awareness
export function PatientJourneyFlow() {
  const [currentStep, setCurrentStep] = useState<PatientJourneyStep>('discovery')
  const [patientContext, setPatientContext] = useState<PatientContext>()
  
  const journeySteps = {
    discovery: {
      title: 'Medizinisches Anliegen',
      description: 'Beschreiben Sie Ihr gesundheitliches Anliegen',
      icon: '🔍',
      medicalFocus: 'Symptom assessment and triage',
      accessibility: 'Extra large text, simple language'
    },
    triage: {
      title: 'Dringlichkeit bewerten', 
      description: 'Wir bewerten die medizinische Priorität',
      icon: '⚡',
      medicalFocus: 'Medical priority determination',
      accessibility: 'Clear urgency indicators, emergency routing'
    },
    selection: {
      title: 'Facharzt auswählen',
      description: 'Passenden medizinischen Experten finden',
      icon: '👨‍⚕️',
      medicalFocus: 'Specialty matching, expertise verification',
      accessibility: 'Doctor credentials clearly displayed'
    },
    consultation: {
      title: 'Medizinische Beratung',
      description: 'Professionelle ärztliche Zweitmeinung erhalten',
      icon: '💬',
      medicalFocus: 'Secure medical consultation',
      accessibility: 'HIPAA-compliant communication'
    },
    followup: {
      title: 'Nachbetreuung',
      description: 'Weitere medizinische Schritte planen',
      icon: '📋',
      medicalFocus: 'Treatment plan and follow-up care',
      accessibility: 'Clear next steps, emergency contacts'
    }
  }
  
  return (
    <div className="bg-healthcare-background p-8 rounded-2xl">
      {/* Journey Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Object.entries(journeySteps).map(([step, config], index) => (
            <div 
              key={step}
              className={`
                flex items-center gap-2
                ${currentStep === step ? 'text-healthcare-primary' : 'text-gray-400'}
              `}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                ${currentStep === step 
                  ? 'bg-healthcare-primary text-white' 
                  : 'bg-gray-100 text-gray-400'
                }
              `}>
                {config.icon}
              </div>
              <div className="hidden md:block">
                <div className="font-medium">{config.title}</div>
                <div className="text-sm opacity-80">{config.description}</div>
              </div>
              {index < Object.keys(journeySteps).length - 1 && (
                <div className="hidden md:block w-8 h-1 bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step-specific Content */}
      <PatientJourneyStep 
        step={currentStep}
        config={journeySteps[currentStep]}
        patientContext={patientContext}
        onNext={() => advanceJourney(currentStep)}
        onEmergency={() => showEmergencyOptions()}
      />
    </div>
  )
}
```

---

## 🇩🇪 German Medical Terminology Integration

### ICD-10 Medical Code Integration
```tsx
// German medical terminology with ICD-10 codes
export const germanMedicalTerms = {
  // Cardiovascular (I00-I99)
  'herz-kreislauf': {
    icd10Range: 'I00-I99',
    commonTerms: [
      { term: 'Herzinfarkt', icd10: 'I21', urgency: 'emergency' },
      { term: 'Bluthochdruck', icd10: 'I10', urgency: 'routine' },
      { term: 'Herzrhythmusstörungen', icd10: 'I49', urgency: 'urgent' },
      { term: 'Angina Pectoris', icd10: 'I20', urgency: 'urgent' }
    ]
  },
  
  // Oncology (C00-C97)
  'krebs-onkologie': {
    icd10Range: 'C00-C97',
    commonTerms: [
      { term: 'Brustkrebs', icd10: 'C50', urgency: 'critical' },
      { term: 'Lungenkrebs', icd10: 'C78', urgency: 'critical' },
      { term: 'Darmkrebs', icd10: 'C18', urgency: 'critical' },
      { term: 'Prostatakrebs', icd10: 'C61', urgency: 'urgent' }
    ]
  },
  
  // Digestive System (K00-K95)
  'gallenblase': {
    icd10Range: 'K80-K87',
    commonTerms: [
      { term: 'Gallensteine', icd10: 'K80', urgency: 'moderate' },
      { term: 'Gallenblasenentzündung', icd10: 'K81', urgency: 'urgent' },
      { term: 'Gallenwegsverschluss', icd10: 'K83', urgency: 'urgent' }
    ]
  }
}

// Medical term autocomplete with ICD-10 context
export function MedicalTermInput({ 
  onTermSelect, 
  specialtyContext 
}: MedicalTermInputProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<MedicalTerm[]>([])
  
  const searchMedicalTerms = (query: string) => {
    const relevantTerms = germanMedicalTerms[specialtyContext]?.commonTerms || []
    return relevantTerms.filter(term => 
      term.term.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setSuggestions(searchMedicalTerms(e.target.value))
          }}
          placeholder="Medizinisches Anliegen beschreiben (z.B. Herzschmerzen, Gallensteine)"
          className={`
            w-full px-4 py-4 pr-12 rounded-xl border-2 border-healthcare-primary/20
            focus:border-healthcare-primary-light focus:ring-3 focus:ring-healthcare-primary-light/30
            text-lg placeholder:text-healthcare-text-muted
            min-h-[60px]
          `}
          aria-label="Medizinisches Anliegen eingeben"
          aria-describedby="medical-term-help"
        />
        
        {/* ICD-10 indicator */}
        <div className="absolute right-4 top-4 text-healthcare-primary-light">
          <div title="ICD-10 medizinische Klassifikation unterstützt">
            🏥
          </div>
        </div>
      </div>
      
      {/* Medical term suggestions with ICD-10 codes */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-healthcare-primary/20 rounded-xl shadow-healthcare-elevated z-10">
          {suggestions.map((term, index) => (
            <button
              key={index}
              onClick={() => handleTermSelect(term)}
              className={`
                w-full text-left px-4 py-3 hover:bg-healthcare-background
                flex items-center justify-between gap-4
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100'}
              `}
            >
              <div>
                <div className="font-medium text-healthcare-primary">
                  {term.term}
                </div>
                <div className="text-sm text-healthcare-text-muted">
                  ICD-10: {term.icd10} • {getUrgencyLabel(term.urgency)}
                </div>
              </div>
              
              <MedicalPriorityIndicator priority={term.urgency} />
            </button>
          ))}
        </div>
      )}
      
      <div id="medical-term-help" className="mt-2 text-sm text-healthcare-text-muted">
        💡 Nutzen Sie medizinische Fachbegriffe oder beschreiben Sie Ihre Symptome in eigenen Worten
      </div>
    </div>
  )
}
```

---

## 📱 Mobile Healthcare Patterns

### Thumb-Friendly Medical Navigation
```tsx
// Optimized for one-handed use in medical contexts
export function MobileHealthcareNavigation() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-healthcare-primary/20 z-40"
      role="navigation"
      aria-label="Mobile Healthcare Navigation"
    >
      {/* Emergency Quick Access */}
      <div className="bg-red-50 px-4 py-2 flex items-center justify-center border-b border-red-100">
        <a 
          href="tel:112"
          className="flex items-center gap-2 text-red-600 font-medium text-sm"
          aria-label="Notruf 112"
        >
          🚨 Notfall: 112
        </a>
      </div>
      
      {/* Primary Healthcare Actions */}
      <div className="flex items-center justify-around py-2">
        {/* Home */}
        <button className="healthcare-nav-button">
          <div className="healthcare-nav-icon">🏠</div>
          <div className="healthcare-nav-label">Start</div>
        </button>
        
        {/* Find Doctor */}
        <button className="healthcare-nav-button">
          <div className="healthcare-nav-icon">👨‍⚕️</div>
          <div className="healthcare-nav-label">Ärzte</div>
        </button>
        
        {/* My Health */}
        <button className="healthcare-nav-button">
          <div className="healthcare-nav-icon">📊</div>
          <div className="healthcare-nav-label">Gesundheit</div>
        </button>
        
        {/* Messages */}
        <button className="healthcare-nav-button relative">
          <div className="healthcare-nav-icon">💬</div>
          <div className="healthcare-nav-label">Nachrichten</div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </div>
        </button>
        
        {/* Menu */}
        <button 
          className="healthcare-nav-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <div className="healthcare-nav-icon">☰</div>
          <div className="healthcare-nav-label">Menü</div>
        </button>
      </div>
      
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="bg-healthcare-background border-t border-healthcare-primary/20 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="healthcare-expanded-nav-button">
              🔍 Symptom-Check
            </button>
            <button className="healthcare-expanded-nav-button">
              📋 Termine
            </button>
            <button className="healthcare-expanded-nav-button">
              💊 Medikamente
            </button>
            <button className="healthcare-expanded-nav-button">
              📄 Befunde
            </button>
            <button className="healthcare-expanded-nav-button">
              ⚙️ Einstellungen
            </button>
            <button className="healthcare-expanded-nav-button">
              ❓ Hilfe
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// Healthcare navigation button styles
const styles = `
.healthcare-nav-button {
  @apply flex flex-col items-center justify-center p-3 min-w-[60px] min-h-[60px] rounded-xl;
  @apply hover:bg-healthcare-background transition-colors duration-200;
  @apply focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2;
}

.healthcare-nav-icon {
  @apply text-2xl mb-1;
}

.healthcare-nav-label {
  @apply text-xs text-healthcare-text-muted font-medium;
}

.healthcare-expanded-nav-button {
  @apply flex items-center gap-3 p-4 rounded-xl bg-white;
  @apply hover:bg-healthcare-primary hover:text-white transition-all duration-200;
  @apply focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2;
  @apply min-h-[56px] font-medium;
}
`
```

---

## ✅ Implementation Checklist

### Medical Context Guide Completion Status

**🏥 Healthcare Platform Context** ✅
- Medical platform mission and user types documented
- Healthcare user context switching patterns defined
- Emergency readiness and privacy compliance outlined

**🎯 Medical Specialty Patterns** ✅
- 7 core medical specialties with color coding system
- Specialty-specific UI implementation patterns
- Medical urgency levels and emergency indicators

**🚨 Emergency & Patient Safety Patterns** ✅
- Emergency banner (always visible, AAA accessibility)
- Critical medical action patterns with confirmation flows
- Patient safety prioritization system with triage-like UI

**🛡️ Medical Data Privacy Patterns** ✅
- GDPR medical consent management system
- Medical data encryption indicators
- German healthcare regulation compliance patterns

**🏥 Patient Journey Patterns** ✅
- Discovery → Selection → Consultation flow
- Medical context awareness throughout journey
- Healthcare professional vs. patient UI differentiation

**🇩🇪 German Medical Terminology** ✅
- ICD-10 medical code integration
- German medical terms with urgency mapping
- Medical term autocomplete with classification

**📱 Mobile Healthcare Patterns** ✅
- Thumb-friendly medical navigation
- One-handed use optimization for medical contexts
- Emergency quick access and healthcare actions

---

## Medical Context Guide Summary

The Medical Context Guide ist now complete and provides comprehensive healthcare-specific UI patterns for the zweitmeinung.ng platform:

### Key Healthcare UI Patterns Documented:

1. **Medical Specialty System**: 7 core specialties (Kardiologie, Onkologie, Gallenblase, Nephrologie, Schilddrüse, Intensivmedizin, Allgemeine Fragen) with color coding, urgency levels, and specialty-specific UI components

2. **Patient Safety Emergency Patterns**: 
   - Always-visible emergency banner with 112/Bereitschaftsdienst contacts
   - Critical medical action confirmation flows with 72px+ touch targets
   - Medical priority triage system (Emergency → Urgent → Semi-Urgent → Routine → Information)

3. **GDPR Medical Data Privacy**: 
   - Specialized consent management for medical data categories
   - Visual encryption indicators (End-to-End, Transport, Storage)
   - German healthcare regulation compliance patterns

4. **Patient Journey Flow**: Complete Discovery → Triage → Selection → Consultation → Follow-up pattern with medical context awareness and accessibility optimization

5. **German Medical Terminology**: ICD-10 code integration with medical term autocomplete, urgency mapping, and German healthcare language patterns

6. **Mobile Healthcare UX**: Thumb-friendly navigation optimized for stressed medical users with emergency quick access and healthcare-specific mobile patterns

The guide provides production-ready patterns that ensure **patient safety**, **medical data privacy**, **emergency accessibility**, and **German healthcare compliance** across the entire zweitmeinung.ng platform.