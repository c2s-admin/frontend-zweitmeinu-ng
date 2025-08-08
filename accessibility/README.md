# 🏥 Healthcare Accessibility Automation

Comprehensive WCAG 2.1 AA Accessibility Testing für zweitmeinung.ng Healthcare Platform

## 🎯 Healthcare Standards

- **WCAG 2.1 AA Compliance** + Healthcare Extensions
- **56px+ Touch Targets** für gestresste Patienten
- **4.5:1 Contrast Ratio** minimum (7:1 für Notfall-Elemente)
- **Emergency Accessibility** AAA Level (100% erforderlich)
- **German Medical Terminology** Support
- **DSGVO Privacy Indicators** für Patientendaten

## 🛠️ Tools Overview

### Healthcare WCAG Configuration
- **`axe-config.js`** - Healthcare-spezifische Axe-Core Rules
- **`wcag-validation.js`** - Medical-specific WCAG 2.1 AA Validation
- **`a11y-test.js`** - Automated Healthcare Accessibility Testing
- **`generate-report.js`** - Comprehensive Healthcare Reports

## 🚀 Quick Start

### Run Full Healthcare Accessibility Suite
```bash
# Complete healthcare accessibility validation
npm run accessibility:full

# CI/CD pipeline testing
npm run accessibility:ci

# Emergency components only (fastest)
npm run accessibility:emergency
```

### Individual Tests
```bash
# Axe-Core accessibility testing
npm run a11y

# WCAG 2.1 AA validation
npm run wcag

# Generate comprehensive report
npm run a11y:report

# Test specific healthcare contexts
npm run a11y:emergency  # Emergency components
npm run a11y:forms      # Medical forms
```

## 🏥 Healthcare Component Testing

### Emergency Components (Critical Priority)
- **EmergencyBanner** - Always visible, AAA compliance
- **Emergency Buttons** - 72px+ touch targets
- **Emergency Navigation** - Keyboard accessible

### Medical Forms (High Priority)  
- **HealthcareInput** - GDPR indicators, ARIA labels
- **HealthcareTextarea** - Medical context descriptions
- **HealthcareSelect** - Specialty selection accessibility

### Healthcare Navigation (High Priority)
- **HealthcareHeader** - Skip-to-emergency links
- **Medical Specialties** - Screen reader optimization
- **Breadcrumb Navigation** - Medical workflow support

### Trust Elements (Medium Priority)
- **DoctorProfile** - Credential accessibility
- **Trust Indicators** - GDPR compliance badges
- **Medical Credentials** - Screen reader support

## 📊 Healthcare Scoring

### Scoring Thresholds
- **Emergency Components:** 100% (AAA required)
- **Medical Forms:** 95% (near perfect for patient data)
- **Navigation:** 90% (excellent for medical workflows)
- **General Components:** 85% (high healthcare standard)

### Compliance Gates
- ✅ **Healthcare Compliance:** Overall 85%+ score
- 🚨 **Emergency Compliance:** 100% für Notfall-Komponenten
- 📋 **WCAG 2.1 AA:** Standard web accessibility
- 🛡️ **GDPR Compliance:** Privacy accessibility indicators

## 🔧 Configuration

### Healthcare User Profiles
```javascript
// Stressed Patient (Mobile)
{
  name: 'Stressed Patient',
  viewport: { width: 375, height: 667 },
  accessibility: {
    reducedMotion: true,
    highContrast: false,
    largeText: false
  }
}

// Elderly Patient (Tablet)
{
  name: 'Elderly Patient', 
  viewport: { width: 1024, height: 768 },
  accessibility: {
    reducedMotion: true,
    highContrast: true,
    largeText: true
  }
}

// Screen Reader User (Desktop)
{
  name: 'Screen Reader User',
  viewport: { width: 1280, height: 720 },
  accessibility: {
    screenReader: true,
    keyboardOnly: true
  }
}

// Motor Impairment User (Mobile)
{
  name: 'Motor Impairment User',
  viewport: { width: 375, height: 812 },
  accessibility: {
    largeTouch: true,
    voiceInput: true
  }
}
```

### Healthcare Rules Configuration
```javascript
// Touch Targets - Healthcare Enhanced
touchTargets: {
  minimum: 44,      // WCAG 2.1 AA standard
  healthcare: 56,   // Healthcare recommendation
  primary: 64,      // Primary medical CTAs  
  emergency: 72     // Emergency actions
}

// Color Contrast - Healthcare Enhanced
colorContrast: {
  normal: 4.5,      // Standard WCAG AA
  large: 3.0,       // Large text
  emergency: 7.0,   // Emergency elements (AAA)
  medical: 5.0      // Medical data/forms
}
```

## 🚨 Emergency Testing

### Critical Path Validation
```bash
# Test only emergency components (fastest feedback)
npm run accessibility:emergency

# Validate emergency accessibility in PR
# Runs automatically on pull requests
```

### Emergency Requirements
- **100% Axe Score** - No violations allowed
- **AAA Compliance** - Highest accessibility level
- **72px Touch Targets** - Large emergency buttons
- **7:1 Contrast Ratio** - Maximum visibility
- **Keyboard Navigation** - No mouse required
- **Screen Reader Priority** - Immediate announcements

## 📋 Reports

### Report Types Generated
- **HTML Report** - Visual dashboard with charts
- **JSON Report** - Machine-readable data
- **Markdown Report** - Developer-friendly summary
- **Healthcare Summary** - Executive overview

### Report Contents
- **Component Analysis** - Individual component scores
- **Violation Details** - Specific accessibility issues
- **Healthcare Recommendations** - Medical-context fixes
- **User Impact Assessment** - Affected patient groups
- **Compliance Status** - WCAG 2.1 AA + Healthcare

### Report Locations
```
accessibility/reports/
├── healthcare-comprehensive-report-YYYY-MM-DD.html
├── healthcare-comprehensive-YYYY-MM-DD.json
├── healthcare-report-YYYY-MM-DD.md
├── healthcare-summary.json
└── latest-healthcare-accessibility.json
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow
```yaml
# Comprehensive healthcare accessibility testing
- name: Run Healthcare Accessibility Tests
  run: node accessibility/a11y-test.js
  
# WCAG validation for screen readers  
- name: Validate HTML for Screen Readers
  run: node accessibility/wcag-validation.js http://localhost:6006

# Healthcare scoring gates (95% minimum)
- name: Accessibility Score Gate
  run: |
    if score < 95 || !healthcareCompliance || !emergencyCompliance:
      exit 1
```

### Quality Gates
1. **Accessibility Score** ≥ 95% for healthcare
2. **Healthcare Compliance** = PASSED
3. **Emergency Compliance** = PASSED (critical)
4. **Critical Violations** = 0
5. **Touch Target Violations** = 0

## 🎯 Healthcare-Specific Validations

### Medical Terminology
- German medical terms have explanations
- ICD-10 codes are screen reader accessible
- Medical abbreviations include descriptions

### Patient Data Privacy
- GDPR consent indicators present
- Privacy levels clearly marked
- Secure transmission (HTTPS) verified

### Emergency Accessibility
- Always visible emergency contacts
- Skip links to emergency information
- High contrast for emergency elements

### Mobile Healthcare
- 56px+ touch targets for stressed users
- Voice input compatibility
- Reduced motion respect

## 📚 Resources

### Healthcare Accessibility Guidelines
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Healthcare.gov Accessibility](https://www.healthcare.gov/accessibility/)
- [German DSGVO Accessibility Requirements](https://www.gesetze-im-internet.de/behindertengleichstellungsgesetz/)

### Testing Tools
- **Axe-Core:** Automated accessibility testing
- **Puppeteer:** Browser automation for testing
- **JSDOM:** HTML validation for screen readers
- **Colour Contrast Analyser:** Manual contrast testing

### Healthcare Resources
- **German Medical Dictionary:** Medical terminology support
- **ICD-10 Codes:** International medical classification
- **GDPR Compliance:** German privacy law requirements

## 🤝 Contributing

### Adding New Healthcare Rules
1. Update `axe-config.js` with new healthcare-specific rules
2. Add corresponding validation in `wcag-validation.js`
3. Update test scenarios in `a11y-test.js`
4. Document new requirements in this README

### Healthcare Component Testing
1. Add component to healthcare test suite
2. Define healthcare context (emergency/medical/navigation/trust)
3. Set appropriate scoring thresholds
4. Add medical-specific user scenarios

---

**Healthcare Accessibility is Patient Safety** 🏥

Every accessibility improvement directly impacts patient experience and medical outcomes on zweitmeinung.ng.

*Generated by Healthcare Accessibility Automation System*