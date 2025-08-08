#!/usr/bin/env node

/**
 * WCAG 2.1 AA Healthcare Validation Engine
 * Medical-specific accessibility validation beyond standard axe-core
 * 
 * @healthcare-standards WCAG 2.1 AA + Healthcare Industry Requirements
 * @medical-context German medical terminology and patient safety
 * @emergency-ready Critical medical workflow accessibility
 */

const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');

// Healthcare WCAG 2.1 AA Validation Rules
const HEALTHCARE_WCAG_RULES = {
  // Healthcare Color Contrast - Stricter than standard
  colorContrast: {
    id: 'healthcare-color-contrast',
    wcagLevel: 'AA',
    healthcareLevel: 'Enhanced',
    requirements: {
      normal: 4.5,      // Standard WCAG AA
      large: 3.0,       // Large text
      emergency: 7.0,   // Emergency elements (AAA level)
      medical: 5.0      // Medical data/forms (enhanced)
    },
    description: 'Healthcare applications require enhanced color contrast for medical safety'
  },

  // Healthcare Touch Targets - Medical User Optimized
  touchTargets: {
    id: 'healthcare-touch-targets',
    wcagLevel: 'AA',
    healthcareLevel: 'Enhanced',
    requirements: {
      minimum: 44,      // WCAG 2.1 AA standard
      healthcare: 56,   // Healthcare recommendation (stressed users)
      primary: 64,      // Primary medical CTAs
      emergency: 72     // Emergency actions
    },
    description: 'Healthcare touch targets must accommodate stressed and elderly users'
  },

  // Medical Terminology Accessibility
  medicalTerminology: {
    id: 'healthcare-medical-terminology',
    wcagLevel: 'AA',
    healthcareLevel: 'Medical',
    requirements: {
      definitionsRequired: true,     // Medical terms need definitions
      pronunciationGuide: false,    // Optional but recommended
      icd10Support: true,           // ICD-10 medical codes
      germanMedicalTerms: true      // German medical language
    },
    description: 'Medical terminology must be accessible to non-medical users'
  },

  // Emergency Accessibility Requirements
  emergencyAccess: {
    id: 'healthcare-emergency-access',
    wcagLevel: 'AAA',  // Emergency elements require AAA
    healthcareLevel: 'Critical',
    requirements: {
      alwaysVisible: true,          // Emergency contacts always visible
      keyboardAccessible: true,     // Must work with keyboard only
      screenReaderOptimized: true,  // Screen reader announcements
      noMotionRequired: true,       // No hover-only interactions
      fastLoading: 3000            // Must load within 3 seconds
    },
    description: 'Emergency features must meet highest accessibility standards'
  },

  // Patient Data Privacy & GDPR
  patientDataPrivacy: {
    id: 'healthcare-patient-privacy',
    wcagLevel: 'AA',
    healthcareLevel: 'Legal',
    requirements: {
      consentIndicators: true,      // GDPR consent indicators
      privacyLabels: true,         // Privacy level indicators
      secureTransmission: true,    // HTTPS required
      dataRetentionInfo: true,     // Clear data retention policies
      gdprCompliance: true         // German GDPR compliance
    },
    description: 'Patient data collection must meet GDPR accessibility requirements'
  },

  // Medical Form Accessibility
  medicalForms: {
    id: 'healthcare-medical-forms',
    wcagLevel: 'AA',
    healthcareLevel: 'Enhanced',
    requirements: {
      explicitLabels: true,        // All fields must have explicit labels
      errorMessages: true,         // Clear, helpful error messages
      requiredFieldIndicators: true, // Visual and programmatic required indicators
      medicalContext: true,        // Medical context in field descriptions
      multiStepProgress: true,     // Progress indicators for multi-step forms
      saveProgress: false          // Optional: save form progress
    },
    description: 'Medical forms require enhanced accessibility for patient safety'
  },

  // Healthcare Navigation
  healthcareNavigation: {
    id: 'healthcare-navigation',
    wcagLevel: 'AA',
    healthcareLevel: 'Enhanced',
    requirements: {
      skipToEmergency: true,       // Skip link to emergency contacts
      medicalBreadcrumbs: true,    // Clear navigation breadcrumbs
      specialtyNavigation: true,   // Medical specialty navigation
      searchAccessibility: true,   // Accessible search for medical content
      mobileOptimized: true        // Mobile healthcare navigation
    },
    description: 'Healthcare navigation must guide users efficiently to medical services'
  }
};

class HealthcareWCAGValidator {
  constructor(options = {}) {
    this.options = {
      strictMode: true,        // Enforce all healthcare rules
      emergencyRequired: true, // Emergency access must be present
      germanLanguage: true,    // German medical terminology
      mobileFirst: true,       // Mobile healthcare optimization
      ...options
    };
    
    this.results = {
      summary: {},
      violations: [],
      warnings: [],
      passes: [],
      healthcareSpecific: [],
      timestamp: new Date().toISOString()
    };
  }

  async validateHealthcareHTML(htmlContent, url = null) {
    console.log('🏥 Starting Healthcare WCAG 2.1 AA validation...');
    
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Run all healthcare validation rules
    await Promise.all([
      this.validateHealthcareColorContrast(document),
      this.validateHealthcareTouchTargets(document),
      this.validateMedicalTerminology(document),
      this.validateEmergencyAccess(document),
      this.validatePatientDataPrivacy(document),
      this.validateMedicalForms(document),
      this.validateHealthcareNavigation(document)
    ]);
    
    // Generate summary
    this.results.summary = this.generateHealthcareSummary();
    
    console.log(`✅ Healthcare WCAG validation completed: ${this.results.summary.overallScore}% compliant`);
    
    return this.results;
  }

  async validateHealthcareColorContrast(document) {
    const rule = HEALTHCARE_WCAG_RULES.colorContrast;
    console.log(`🎨 Validating ${rule.id}...`);
    
    // Get all elements with text content
    const textElements = document.querySelectorAll('*');
    const violations = [];
    const passes = [];
    
    for (const element of textElements) {
      if (!element.textContent || !element.textContent.trim()) continue;
      
      try {
        const styles = dom.window.getComputedStyle(element);
        const color = this.parseColor(styles.color);
        const backgroundColor = this.parseColor(styles.backgroundColor);
        
        if (!color || !backgroundColor) continue;
        
        const contrast = this.calculateContrastRatio(color, backgroundColor);
        const elementType = this.getHealthcareElementType(element);
        
        // Determine required contrast based on healthcare context
        let requiredContrast;
        if (elementType === 'emergency') {
          requiredContrast = rule.requirements.emergency;
        } else if (elementType === 'medical') {
          requiredContrast = rule.requirements.medical;
        } else if (this.isLargeText(element, styles)) {
          requiredContrast = rule.requirements.large;
        } else {
          requiredContrast = rule.requirements.normal;
        }
        
        if (contrast < requiredContrast) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            severity: elementType === 'emergency' ? 'critical' : 'high',
            found: contrast.toFixed(2),
            required: requiredContrast,
            healthcareContext: elementType,
            fix: `Erhöhen Sie den Kontrast auf mindestens ${requiredContrast}:1 für ${elementType}-Elemente`
          });
        } else {
          passes.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            contrast: contrast.toFixed(2),
            healthcareContext: elementType
          });
        }
        
      } catch (error) {
        // Skip elements where contrast can't be calculated
        continue;
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validateHealthcareTouchTargets(document) {
    const rule = HEALTHCARE_WCAG_RULES.touchTargets;
    console.log(`👆 Validating ${rule.id}...`);
    
    // Get all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex], [onclick]'
    );
    
    const violations = [];
    const passes = [];
    
    for (const element of interactiveElements) {
      const rect = element.getBoundingClientRect();
      const minDimension = Math.min(rect.width, rect.height);
      
      const elementType = this.getHealthcareElementType(element);
      
      // Determine required size based on healthcare context
      let requiredSize;
      if (elementType === 'emergency') {
        requiredSize = rule.requirements.emergency;
      } else if (elementType === 'primary') {
        requiredSize = rule.requirements.primary;
      } else if (elementType === 'healthcare') {
        requiredSize = rule.requirements.healthcare;
      } else {
        requiredSize = rule.requirements.minimum;
      }
      
      if (minDimension < requiredSize) {
        violations.push({
          rule: rule.id,
          element: this.getElementSelector(element),
          severity: elementType === 'emergency' ? 'critical' : 'high',
          found: `${minDimension}px`,
          required: `${requiredSize}px`,
          healthcareContext: elementType,
          fix: `Vergrößern Sie das Touch-Target auf mindestens ${requiredSize}px für ${elementType}-Elemente`
        });
      } else {
        passes.push({
          rule: rule.id,
          element: this.getElementSelector(element),
          size: `${minDimension}px`,
          healthcareContext: elementType
        });
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validateMedicalTerminology(document) {
    const rule = HEALTHCARE_WCAG_RULES.medicalTerminology;
    console.log(`🏥 Validating ${rule.id}...`);
    
    // Medical terms that should have definitions or explanations
    const medicalTerms = [
      // German medical terms commonly used in zweitmeinung.ng
      'kardiologie', 'onkologie', 'nephrologie', 'gallenblase', 'schilddrüse',
      'intensivmedizin', 'zweitmeinung', 'diagnose', 'anamnese', 'therapie',
      'pathologie', 'radiologie', 'endokrinologie', 'gastroenterologie',
      'dermatologie', 'pneumologie', 'rheumatologie', 'neurologie',
      'orthopädie', 'urologie', 'gynäkologie', 'hno', 'ophthalmologie'
    ];
    
    const violations = [];
    const passes = [];
    
    // Check for medical terms without explanations
    const textContent = document.body.textContent.toLowerCase();
    
    for (const term of medicalTerms) {
      if (textContent.includes(term)) {
        // Check if term has explanation nearby
        const termElements = this.findElementsContainingText(document, term);
        
        for (const element of termElements) {
          const hasExplanation = this.checkForMedicalExplanation(element, term);
          const hasAriaDescribedBy = element.getAttribute('aria-describedby');
          const hasTitle = element.getAttribute('title');
          const hasTooltip = element.querySelector('[role="tooltip"]');
          
          if (!hasExplanation && !hasAriaDescribedBy && !hasTitle && !hasTooltip) {
            violations.push({
              rule: rule.id,
              element: this.getElementSelector(element),
              severity: 'medium',
              medicalTerm: term,
              fix: `Fügen Sie eine Erklärung für den medizinischen Begriff "${term}" hinzu (aria-describedby, title, oder Tooltip)`
            });
          } else {
            passes.push({
              rule: rule.id,
              element: this.getElementSelector(element),
              medicalTerm: term,
              explanation: hasExplanation ? 'text' : hasAriaDescribedBy ? 'aria-describedby' : 'title'
            });
          }
        }
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validateEmergencyAccess(document) {
    const rule = HEALTHCARE_WCAG_RULES.emergencyAccess;
    console.log(`🚨 Validating ${rule.id}...`);
    
    const violations = [];
    const passes = [];
    
    // Check for emergency contact visibility
    const emergencyElements = document.querySelectorAll(
      '[data-healthcare="emergency"], .emergency-banner, .emergency-contact, [aria-label*="notfall" i], [aria-label*="emergency" i]'
    );
    
    if (emergencyElements.length === 0) {
      violations.push({
        rule: rule.id,
        element: 'document',
        severity: 'critical',
        issue: 'No emergency contact elements found',
        fix: 'Fügen Sie sichtbare Notfall-Kontaktinformationen hinzu (Banner, Button, oder Link)'
      });
    } else {
      // Validate each emergency element
      for (const element of emergencyElements) {
        const isVisible = element.offsetParent !== null;
        const isKeyboardAccessible = element.tabIndex >= 0 || element.tagName === 'A' || element.tagName === 'BUTTON';
        const hasAriaLabel = element.getAttribute('aria-label');
        const hasRole = element.getAttribute('role');
        
        if (!isVisible) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            severity: 'critical',
            issue: 'Emergency element not visible',
            fix: 'Stellen Sie sicher, dass Notfall-Elemente immer sichtbar sind'
          });
        }
        
        if (!isKeyboardAccessible) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            severity: 'critical',
            issue: 'Emergency element not keyboard accessible',
            fix: 'Fügen Sie tabindex="0" hinzu oder verwenden Sie button/a Element'
          });
        }
        
        if (!hasAriaLabel && !element.textContent?.trim()) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            severity: 'high',
            issue: 'Emergency element missing accessible name',
            fix: 'Fügen Sie aria-label mit Notfall-Kontext hinzu'
          });
        }
        
        if (violations.length === 0) {
          passes.push({
            rule: rule.id,
            element: this.getElementSelector(element),
            emergencyFeatures: {
              visible: isVisible,
              keyboardAccessible: isKeyboardAccessible,
              hasAccessibleName: !!(hasAriaLabel || element.textContent?.trim())
            }
          });
        }
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validatePatientDataPrivacy(document) {
    const rule = HEALTHCARE_WCAG_RULES.patientDataPrivacy;
    console.log(`🛡️ Validating ${rule.id}...`);
    
    const violations = [];
    const passes = [];
    
    // Check forms for privacy indicators
    const forms = document.querySelectorAll('form, [data-healthcare="form"]');
    
    for (const form of forms) {
      const hasPrivacyIndicator = !!(
        form.querySelector('[data-privacy], .privacy-indicator') ||
        form.querySelector('[aria-label*="dsgvo" i], [aria-label*="datenschutz" i]') ||
        form.querySelector('input[type="checkbox"][name*="privacy"], input[type="checkbox"][name*="consent"]')
      );
      
      const hasSecureTransmission = form.action ? form.action.startsWith('https://') : true;
      
      // Check for patient data fields
      const medicalFields = form.querySelectorAll(
        'input[name*="medical"], input[name*="health"], input[name*="patient"], textarea[name*="symptom"], textarea[name*="concern"]'
      );
      
      if (medicalFields.length > 0) {
        if (!hasPrivacyIndicator) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(form),
            severity: 'high',
            issue: 'Medical form missing privacy indicator',
            fix: 'Fügen Sie DSGVO/Datenschutz Indikatoren für medizinische Formulare hinzu'
          });
        }
        
        if (!hasSecureTransmission) {
          violations.push({
            rule: rule.id,
            element: this.getElementSelector(form),
            severity: 'critical',
            issue: 'Medical form not using HTTPS',
            fix: 'Verwenden Sie HTTPS für alle medizinischen Datenübertragungen'
          });
        }
        
        if (hasPrivacyIndicator && hasSecureTransmission) {
          passes.push({
            rule: rule.id,
            element: this.getElementSelector(form),
            privacyFeatures: {
              privacyIndicator: hasPrivacyIndicator,
              secureTransmission: hasSecureTransmission,
              medicalFieldCount: medicalFields.length
            }
          });
        }
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validateMedicalForms(document) {
    const rule = HEALTHCARE_WCAG_RULES.medicalForms;
    console.log(`📋 Validating ${rule.id}...`);
    
    const violations = [];
    const passes = [];
    
    // Get all form controls
    const formControls = document.querySelectorAll(
      'input, select, textarea, [role="textbox"], [role="combobox"], [role="listbox"]'
    );
    
    for (const control of formControls) {
      const issues = [];
      const features = [];
      
      // Check for explicit labels
      const labelId = control.getAttribute('id');
      const ariaLabel = control.getAttribute('aria-label');
      const ariaLabelledBy = control.getAttribute('aria-labelledby');
      const associatedLabel = labelId ? document.querySelector(`label[for="${labelId}"]`) : null;
      
      if (!ariaLabel && !ariaLabelledBy && !associatedLabel) {
        issues.push('Missing explicit label');
      } else {
        features.push('Has explicit label');
      }
      
      // Check for required field indicators
      const isRequired = control.hasAttribute('required') || control.getAttribute('aria-required') === 'true';
      const hasRequiredIndicator = !!(
        associatedLabel?.textContent.includes('*') ||
        control.parentElement?.querySelector('.required-indicator') ||
        control.getAttribute('aria-describedby')?.includes('required')
      );
      
      if (isRequired && !hasRequiredIndicator) {
        issues.push('Required field missing visual indicator');
      } else if (isRequired) {
        features.push('Required field properly indicated');
      }
      
      // Check for error message accessibility
      const ariaDescribedBy = control.getAttribute('aria-describedby');
      const hasErrorDescription = ariaDescribedBy ? 
        !!document.querySelector(`#${ariaDescribedBy}`) : false;
      
      if (control.getAttribute('aria-invalid') === 'true' && !hasErrorDescription) {
        issues.push('Invalid field missing error description');
      } else if (hasErrorDescription) {
        features.push('Has error description');
      }
      
      // Check for medical context in descriptions
      const isMedicalField = !!(
        control.name?.includes('medical') ||
        control.name?.includes('health') ||
        control.name?.includes('symptom') ||
        control.placeholder?.toLowerCase().includes('medizin') ||
        associatedLabel?.textContent.toLowerCase().includes('medizin')
      );
      
      if (isMedicalField) {
        features.push('Medical context field');
        
        // Medical fields should have helpful descriptions
        if (!ariaDescribedBy) {
          issues.push('Medical field missing helpful description');
        }
      }
      
      if (issues.length > 0) {
        violations.push({
          rule: rule.id,
          element: this.getElementSelector(control),
          severity: isMedicalField ? 'high' : 'medium',
          issues: issues,
          fix: `Beheben Sie die folgenden Formular-Probleme: ${issues.join(', ')}`
        });
      } else {
        passes.push({
          rule: rule.id,
          element: this.getElementSelector(control),
          features: features
        });
      }
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  async validateHealthcareNavigation(document) {
    const rule = HEALTHCARE_WCAG_RULES.healthcareNavigation;
    console.log(`🧭 Validating ${rule.id}...`);
    
    const violations = [];
    const passes = [];
    
    // Check for skip to emergency link
    const skipLinks = document.querySelectorAll('a[href*="#emergency"], a[href*="#notfall"], .skip-to-emergency');
    
    if (skipLinks.length === 0) {
      violations.push({
        rule: rule.id,
        element: 'document',
        severity: 'high',
        issue: 'No skip-to-emergency link found',
        fix: 'Fügen Sie einen Skip-Link zu Notfall-Kontakten hinzu'
      });
    } else {
      passes.push({
        rule: rule.id,
        element: 'skip-links',
        feature: 'Skip-to-emergency link present'
      });
    }
    
    // Check for healthcare navigation structure
    const nav = document.querySelector('nav, [role="navigation"]');
    
    if (nav) {
      const hasAriaLabel = nav.getAttribute('aria-label');
      const medicalLinks = nav.querySelectorAll('a[href*="kardiologie"], a[href*="onkologie"], a[href*="gallenblase"]');
      
      if (!hasAriaLabel) {
        violations.push({
          rule: rule.id,
          element: this.getElementSelector(nav),
          severity: 'medium',
          issue: 'Navigation missing aria-label',
          fix: 'Fügen Sie aria-label="Hauptnavigation für medizinische Dienste" hinzu'
        });
      }
      
      if (medicalLinks.length > 0) {
        passes.push({
          rule: rule.id,
          element: this.getElementSelector(nav),
          feature: `Medical specialty navigation (${medicalLinks.length} specialties)`
        });
      }
    } else {
      violations.push({
        rule: rule.id,
        element: 'document',
        severity: 'medium',
        issue: 'No main navigation found',
        fix: 'Fügen Sie eine Hauptnavigation mit role="navigation" hinzu'
      });
    }
    
    this.results.violations.push(...violations);
    this.results.passes.push(...passes);
  }

  // Helper methods
  getHealthcareElementType(element) {
    const classList = element.classList.toString().toLowerCase();
    const dataHealthcare = element.getAttribute('data-healthcare')?.toLowerCase();
    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase();
    const textContent = element.textContent?.toLowerCase();
    
    // Check for emergency context
    if (
      classList.includes('emergency') ||
      dataHealthcare === 'emergency' ||
      ariaLabel?.includes('notfall') ||
      ariaLabel?.includes('emergency') ||
      textContent?.includes('notfall')
    ) {
      return 'emergency';
    }
    
    // Check for medical context
    if (
      classList.includes('medical') ||
      classList.includes('healthcare') ||
      dataHealthcare === 'form' ||
      dataHealthcare === 'medical' ||
      ariaLabel?.includes('medizin') ||
      textContent?.includes('medizin')
    ) {
      return 'medical';
    }
    
    // Check for primary CTA
    if (
      classList.includes('primary') ||
      classList.includes('cta') ||
      element.tagName === 'BUTTON' && classList.includes('healthcare')
    ) {
      return 'primary';
    }
    
    return 'general';
  }

  calculateContrastRatio(color1, color2) {
    const l1 = this.relativeLuminance(color1);
    const l2 = this.relativeLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  relativeLuminance(rgb) {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  parseColor(colorString) {
    if (!colorString || colorString === 'transparent') return null;
    
    // Handle RGB/RGBA
    const rgbMatch = colorString.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(',').map(v => parseInt(v.trim()));
      return values.slice(0, 3);
    }
    
    // Handle hex colors
    if (colorString.startsWith('#')) {
      const hex = colorString.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      } else if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }
    
    return null;
  }

  isLargeText(element, styles) {
    const fontSize = parseInt(styles.fontSize);
    const fontWeight = styles.fontWeight;
    
    // Large text: 18px+ or 14px+ bold
    return fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
  }

  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  findElementsContainingText(document, text) {
    const walker = document.createTreeWalker(
      document.body,
      4, // NodeFilter.SHOW_TEXT
      null,
      false
    );
    
    const elements = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.textContent.toLowerCase().includes(text.toLowerCase())) {
        elements.push(node.parentElement);
      }
    }
    
    return elements;
  }

  checkForMedicalExplanation(element, term) {
    // Check for explanation text near the medical term
    const siblings = Array.from(element.parentElement?.children || []);
    const nextElements = siblings.slice(siblings.indexOf(element) + 1, siblings.indexOf(element) + 3);
    
    for (const next of nextElements) {
      const text = next.textContent?.toLowerCase();
      if (text?.includes('bedeutet') || text?.includes('ist') || text?.includes('bezeichnet')) {
        return true;
      }
    }
    
    return false;
  }

  generateHealthcareSummary() {
    const totalViolations = this.results.violations.length;
    const totalPasses = this.results.passes.length;
    const totalChecks = totalViolations + totalPasses;
    
    const overallScore = totalChecks > 0 ? Math.round((totalPasses / totalChecks) * 100) : 0;
    
    // Categorize violations by healthcare severity
    const violationsBySeverity = {
      critical: this.results.violations.filter(v => v.severity === 'critical').length,
      high: this.results.violations.filter(v => v.severity === 'high').length,
      medium: this.results.violations.filter(v => v.severity === 'medium').length,
      low: this.results.violations.filter(v => v.severity === 'low').length
    };
    
    // Healthcare compliance determination
    const healthcareCompliance = overallScore >= 85 && violationsBySeverity.critical === 0;
    const emergencyCompliance = !this.results.violations.some(v => 
      v.healthcareContext === 'emergency' || v.element?.includes('emergency')
    );
    
    return {
      overallScore,
      totalChecks,
      totalViolations,
      totalPasses,
      violationsBySeverity,
      healthcareCompliance,
      emergencyCompliance,
      wcagLevel: healthcareCompliance ? 'AA' : 'Below AA',
      recommendations: this.generateTopRecommendations()
    };
  }

  generateTopRecommendations() {
    // Group violations by rule and count frequency
    const ruleCount = {};
    
    this.results.violations.forEach(v => {
      if (!ruleCount[v.rule]) {
        ruleCount[v.rule] = { count: 0, severity: v.severity, fixes: [] };
      }
      ruleCount[v.rule].count++;
      if (!ruleCount[v.rule].fixes.includes(v.fix)) {
        ruleCount[v.rule].fixes.push(v.fix);
      }
    });
    
    // Sort by severity and frequency
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    return Object.entries(ruleCount)
      .sort(([,a], [,b]) => {
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        return severityDiff !== 0 ? severityDiff : b.count - a.count;
      })
      .slice(0, 5)
      .map(([rule, data]) => ({
        rule,
        severity: data.severity,
        count: data.count,
        fixes: data.fixes
      }));
  }

  async saveResults(outputPath = null) {
    if (!outputPath) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      outputPath = path.join(process.cwd(), 'accessibility', 'reports', `wcag-validation-${timestamp}.json`);
    }
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`📋 WCAG validation results saved: ${outputPath}`);
    
    return outputPath;
  }
}

// CLI Interface
async function validateHealthcareWCAG(inputPath, options = {}) {
  const validator = new HealthcareWCAGValidator(options);
  
  try {
    let htmlContent;
    
    if (inputPath.startsWith('http')) {
      // Fetch from URL
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.goto(inputPath, { waitUntil: 'networkidle0' });
      htmlContent = await page.content();
      await browser.close();
    } else {
      // Read from file
      htmlContent = await fs.readFile(inputPath, 'utf8');
    }
    
    const results = await validator.validateHealthcareWCAG(htmlContent, inputPath);
    
    // Save results
    const outputPath = await validator.saveResults();
    
    // Print summary
    console.log('\n🏥 Healthcare WCAG 2.1 AA Validation Summary:');
    console.log(`📊 Overall Score: ${results.summary.overallScore}%`);
    console.log(`🏥 Healthcare Compliance: ${results.summary.healthcareCompliance ? 'PASSED' : 'FAILED'}`);
    console.log(`🚨 Emergency Compliance: ${results.summary.emergencyCompliance ? 'PASSED' : 'FAILED'}`);
    console.log(`❌ Critical Violations: ${results.summary.violationsBySeverity.critical}`);
    console.log(`⚠️  High Priority Violations: ${results.summary.violationsBySeverity.high}`);
    
    // Exit with appropriate code
    if (!results.summary.healthcareCompliance || results.summary.violationsBySeverity.critical > 0) {
      process.exit(1);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Healthcare WCAG validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node wcag-validation.js <file-path-or-url>');
    process.exit(1);
  }
  
  const options = {
    strictMode: process.argv.includes('--strict'),
    emergencyRequired: !process.argv.includes('--no-emergency'),
    mobileFirst: !process.argv.includes('--no-mobile')
  };
  
  validateHealthcareWCAG(inputPath, options);
}

module.exports = {
  HealthcareWCAGValidator,
  HEALTHCARE_WCAG_RULES,
  validateHealthcareWCAG
};