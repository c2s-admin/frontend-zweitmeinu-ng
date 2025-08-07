/**
 * Healthcare Accessibility Demo Component
 * 
 * Demonstrates advanced accessibility features for healthcare applications
 * in Storybook, including:
 * - Screen reader optimizations
 * - Keyboard navigation
 * - Focus management
 * - High contrast mode
 * - Text size adjustments
 * - Emergency accessibility features
 */

import React, { useState } from 'react'
import { useHealthcareAccessibility } from '../hooks/useHealthcareAccessibility'
import { Volume2, Eye, Type, Keyboard, AlertTriangle, Heart, Shield, Settings } from 'lucide-react'
import '../styles/accessibility.css'

export interface AccessibilityDemoProps {
  /** Demo scenario to showcase */
  scenario?: 'form' | 'navigation' | 'emergency' | 'medical-data' | 'comprehensive'
  /** Enable medical context */
  medicalContext?: boolean
  /** Show accessibility controls */
  showControls?: boolean
  /** Initial accessibility settings */
  initialSettings?: {
    highContrast?: boolean
    reducedMotion?: boolean
    textSize?: 'small' | 'medium' | 'large' | 'extra-large'
    enhancedFocus?: boolean
  }
}

export const AccessibilityDemo: React.FC<AccessibilityDemoProps> = ({
  scenario = 'comprehensive',
  medicalContext = true,
  showControls = true,
  initialSettings = {}
}) => {
  const {
    accessibilityState,
    componentRef,
    announce,
    announceEmergency,
    announceMedicalData,
    announceFormValidation,
    announceProgress,
    focusFirst,
    focusNext,
    focusPrevious,
    trapFocus,
    releaseFocusTrap,
    toggleHighContrast,
    toggleReducedMotion,
    setTextSize,
    cycleTextSize,
    toggleEnhancedFocus
  } = useHealthcareAccessibility({
    context: scenario === 'comprehensive' ? 'content' : scenario,
    medicalContext,
    enableScreenReader: true,
    enableKeyboardShortcuts: true
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    patientName: '',
    symptoms: '',
    medicalHistory: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Apply initial settings
  React.useEffect(() => {
    if (initialSettings.highContrast !== undefined && initialSettings.highContrast !== accessibilityState.isHighContrast) {
      toggleHighContrast()
    }
    if (initialSettings.reducedMotion !== undefined && initialSettings.reducedMotion !== accessibilityState.isReducedMotion) {
      toggleReducedMotion()
    }
    if (initialSettings.textSize && initialSettings.textSize !== accessibilityState.textSize) {
      setTextSize(initialSettings.textSize)
    }
    if (initialSettings.enhancedFocus !== undefined && initialSettings.enhancedFocus !== accessibilityState.enhancedFocus) {
      toggleEnhancedFocus()
    }
  }, [initialSettings])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Name ist erforderlich'
    }
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptombeschreibung ist erforderlich'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([field, error]) => {
        announceFormValidation(field, error)
      })
      return
    }

    announce('Medizinische Daten erfolgreich übermittelt', 'success')
    setCurrentStep(3)
  }

  const handleEmergencyButton = () => {
    announceEmergency('Notfall-Protokoll aktiviert. Sofortige medizinische Hilfe wird angefordert.')
    announce('Notruf 112 wird gewählt', 'emergency', true)
  }

  const handleMedicalDataAnnouncement = () => {
    announceMedicalData('Patientendaten werden verarbeitet. Alle Informationen unterliegen der ärztlichen Schweigepflicht.', true)
  }

  const renderFormScenario = () => (
    <div className="accessibility-demo-scenario">
      <h3>Medizinische Anamnese - Barrierefreies Formular</h3>
      <div className="accessibility-demo-progress" aria-live="polite">
        Schritt {currentStep} von 3
      </div>
      
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="accessibility-demo-form-group">
          <label htmlFor="patient-name">
            Name des Patienten *
          </label>
          <input
            id="patient-name"
            type="text"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            aria-invalid={errors.patientName ? 'true' : 'false'}
            aria-describedby={errors.patientName ? 'patient-name-error' : 'patient-name-help'}
            className={errors.patientName ? 'error' : ''}
          />
          <div id="patient-name-help" className="accessibility-demo-help-text">
            Vollständiger Name für die medizinische Dokumentation
          </div>
          {errors.patientName && (
            <div id="patient-name-error" className="accessibility-demo-error" role="alert">
              {errors.patientName}
            </div>
          )}
        </div>

        <div className="accessibility-demo-form-group">
          <label htmlFor="symptoms">
            Aktuelle Symptome *
          </label>
          <textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
            aria-invalid={errors.symptoms ? 'true' : 'false'}
            aria-describedby={errors.symptoms ? 'symptoms-error' : 'symptoms-help'}
            className={errors.symptoms ? 'error' : ''}
            rows={4}
          />
          <div id="symptoms-help" className="accessibility-demo-help-text">
            Beschreiben Sie alle aktuellen Beschwerden detailliert
          </div>
          {errors.symptoms && (
            <div id="symptoms-error" className="accessibility-demo-error" role="alert">
              {errors.symptoms}
            </div>
          )}
        </div>

        <div className="accessibility-demo-form-group">
          <label htmlFor="medical-history">
            Medizinische Vorgeschichte
          </label>
          <textarea
            id="medical-history"
            value={formData.medicalHistory}
            onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
            aria-describedby="medical-history-help"
            rows={3}
          />
          <div id="medical-history-help" className="accessibility-demo-help-text">
            Chronische Erkrankungen, Allergien, Operationen (optional)
          </div>
        </div>

        <div className="accessibility-demo-form-actions">
          <button type="button" onClick={() => announce('Formulardaten zwischengespeichert')}>
            Zwischenspeichern
          </button>
          <button type="submit">
            Daten übermitteln
          </button>
        </div>
      </form>
    </div>
  )

  const renderEmergencyScenario = () => (
    <div className="accessibility-demo-scenario accessibility-demo-emergency">
      <div className="accessibility-demo-emergency-banner" role="alert">
        <AlertTriangle className="accessibility-demo-emergency-icon" />
        <h3>Medizinischer Notfall erkannt</h3>
      </div>
      
      <p>
        Ihre Eingaben deuten auf eine akute medizinische Situation hin. 
        Nutzen Sie die untenstehenden Optionen für sofortige Hilfe.
      </p>

      <div className="accessibility-demo-emergency-actions">
        <button
          className="accessibility-demo-emergency-button"
          onClick={handleEmergencyButton}
          aria-describedby="emergency-help"
        >
          🚨 Notruf 112 wählen
        </button>
        <div id="emergency-help" className="accessibility-demo-help-text">
          Direkter Anruf beim Notdienst für lebensbedrohliche Situationen
        </div>

        <button
          onClick={() => announce('Giftnotruf wird kontaktiert: +49 800 80 44 100', 'emergency')}
          aria-describedby="poison-help"
        >
          ☎️ Giftnotruf kontaktieren
        </button>
        <div id="poison-help" className="accessibility-demo-help-text">
          Spezielle Hilfe bei Vergiftungen rund um die Uhr
        </div>
      </div>
    </div>
  )

  const renderNavigationScenario = () => (
    <div className="accessibility-demo-scenario">
      <h3>Tastaturnavigation Demo</h3>
      <p>Verwenden Sie die Tab-Taste zur Navigation oder folgende Tastenkürzel:</p>
      
      <div className="accessibility-demo-shortcuts">
        <div className="accessibility-demo-shortcut">
          <kbd>Alt + H</kbd> - Hauptnavigation
        </div>
        <div className="accessibility-demo-shortcut">
          <kbd>Alt + M</kbd> - Hauptinhalt
        </div>
        <div className="accessibility-demo-shortcut">
          <kbd>Alt + S</kbd> - Suche
        </div>
        <div className="accessibility-demo-shortcut">
          <kbd>F1</kbd> - Notfall-Hotline
        </div>
        <div className="accessibility-demo-shortcut">
          <kbd>Escape</kbd> - Aktuelle Aktion abbrechen
        </div>
      </div>

      <div className="accessibility-demo-nav-buttons">
        <button onClick={focusFirst}>Erstes Element fokussieren</button>
        <button onClick={focusNext}>Nächstes Element</button>
        <button onClick={focusPrevious}>Vorheriges Element</button>
        <button onClick={trapFocus}>Focus einschließen</button>
        <button onClick={releaseFocusTrap}>Focus freigeben</button>
      </div>
    </div>
  )

  const renderMedicalDataScenario = () => (
    <div className="accessibility-demo-scenario">
      <h3>Medizinische Daten - Datenschutz Demo</h3>
      
      <div className="accessibility-demo-privacy-notice" role="region" aria-labelledby="privacy-title">
        <Shield className="accessibility-demo-privacy-icon" />
        <h4 id="privacy-title">Datenschutz und Vertraulichkeit</h4>
        <p>
          Alle medizinischen Daten werden gemäß DSGVO verarbeitet und unterliegen 
          der ärztlichen Schweigepflicht.
        </p>
      </div>

      <button onClick={handleMedicalDataAnnouncement}>
        Medizinische Daten verarbeiten
      </button>

      <div className="accessibility-demo-medical-data">
        <h4>Beispiel Patientendaten (anonymisiert)</h4>
        <div className="accessibility-demo-data-item">
          <span className="accessibility-demo-data-label">Alter:</span>
          <span className="accessibility-demo-data-value" aria-label="Patient Alter">45 Jahre</span>
        </div>
        <div className="accessibility-demo-data-item">
          <span className="accessibility-demo-data-label">Diagnose:</span>
          <span className="accessibility-demo-data-value" aria-label="Medizinische Diagnose">
            Bluthochdruck (ICD-10: I10)
          </span>
        </div>
      </div>
    </div>
  )

  const renderComprehensiveScenario = () => (
    <div className="accessibility-demo-scenario">
      <h3>Umfassende Accessibility-Demo</h3>
      
      <div className="accessibility-demo-sections">
        <section aria-labelledby="form-section-title">
          <h4 id="form-section-title">Formular-Accessibility</h4>
          {renderFormScenario()}
        </section>

        <section aria-labelledby="navigation-section-title">
          <h4 id="navigation-section-title">Tastatur-Navigation</h4>
          {renderNavigationScenario()}
        </section>

        <section aria-labelledby="medical-section-title">
          <h4 id="medical-section-title">Medizinischer Datenschutz</h4>
          {renderMedicalDataScenario()}
        </section>
      </div>
    </div>
  )

  const renderScenario = () => {
    switch (scenario) {
      case 'form':
        return renderFormScenario()
      case 'emergency':
        return renderEmergencyScenario()
      case 'navigation':
        return renderNavigationScenario()
      case 'medical-data':
        return renderMedicalDataScenario()
      default:
        return renderComprehensiveScenario()
    }
  }

  return (
    <div className="accessibility-demo" ref={componentRef}>
      {/* Skip Links */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Zum Hauptinhalt springen
        </a>
        <a href="#accessibility-controls" className="skip-link">
          Zu den Barrierefreiheit-Einstellungen springen
        </a>
      </div>

      {/* Accessibility Controls */}
      {showControls && (
        <div id="accessibility-controls" className="accessibility-demo-controls">
          <h2>
            <Settings className="accessibility-demo-controls-icon" />
            Barrierefreiheit-Einstellungen
          </h2>
          
          <div className="accessibility-demo-controls-grid">
            <button
              onClick={toggleHighContrast}
              className={`accessibility-demo-control ${accessibilityState.isHighContrast ? 'active' : ''}`}
              aria-pressed={accessibilityState.isHighContrast}
            >
              <Eye className="accessibility-demo-control-icon" />
              Hoher Kontrast
            </button>

            <button
              onClick={toggleReducedMotion}
              className={`accessibility-demo-control ${accessibilityState.isReducedMotion ? 'active' : ''}`}
              aria-pressed={accessibilityState.isReducedMotion}
            >
              <Heart className="accessibility-demo-control-icon" />
              Bewegung reduzieren
            </button>

            <button
              onClick={cycleTextSize}
              className="accessibility-demo-control"
              aria-label={`Textgröße ändern, aktuell: ${accessibilityState.textSize}`}
            >
              <Type className="accessibility-demo-control-icon" />
              Textgröße: {accessibilityState.textSize}
            </button>

            <button
              onClick={toggleEnhancedFocus}
              className={`accessibility-demo-control ${accessibilityState.enhancedFocus ? 'active' : ''}`}
              aria-pressed={accessibilityState.enhancedFocus}
            >
              <Keyboard className="accessibility-demo-control-icon" />
              Verstärkte Focus-Anzeige
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="accessibility-demo-main">
        <h1>Healthcare Accessibility Demo</h1>
        <p>
          Diese Demo zeigt erweiterte Barrierefreiheit-Features für medizinische Anwendungen.
          Testen Sie die Funktionen mit Tastatur, Screen Reader oder den obigen Einstellungen.
        </p>

        {renderScenario()}
      </main>

      {/* Announcement Buttons for Testing */}
      <div className="accessibility-demo-test-buttons">
        <h3>Screen Reader Test-Buttons</h3>
        <div className="accessibility-demo-test-grid">
          <button onClick={() => announce('Standard-Nachricht für Navigation')}>
            <Volume2 className="accessibility-demo-test-icon" />
            Standard Ansage
          </button>
          
          <button onClick={() => announce('Wichtige medizinische Information', 'medical-data', true)}>
            <Heart className="accessibility-demo-test-icon" />
            Medizinische Ansage
          </button>
          
          <button onClick={() => announceProgress(2, 5, 'Medizinische Datenerfassung')}>
            Fortschritt ansagen
          </button>
          
          <button onClick={() => announceEmergency('Test-Notfall-Nachricht')}>
            <AlertTriangle className="accessibility-demo-test-icon" />
            Notfall-Ansage
          </button>
        </div>
      </div>

      {/* Live Region for Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="accessibility-demo-announcements"></div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only" id="accessibility-demo-emergency-announcements"></div>
    </div>
  )
}

export default AccessibilityDemo