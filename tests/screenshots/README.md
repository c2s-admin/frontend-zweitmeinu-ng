# Healthcare Component Screenshot Testing

This directory contains Playwright-based screenshot tests for all healthcare components in the zweitmeinung.ng platform.

## Healthcare Components Tested (28+ Components)

### Core Healthcare UI Components (13)
- **Button** - Healthcare CTA buttons with 56px+ touch targets
- **HealthcareCard** - Medical content containers with ratings
- **HealthcareInput** - Patient data input fields with privacy indicators
- **HealthcareSelect** - Medical specialty selection with search
- **HealthcareTextarea** - Medical history input with auto-resize
- **HealthcareAlert** - Medical notifications with emergency contacts
- **HealthcareModal** - GDPR consent forms and medical dialogs
- **HealthcareTooltip** - Medical term explanations with ICD-10 codes
- **HealthcareBadge** - Status indicators with medical priority levels
- **HealthcareProgressBar** - Medical process tracking and patient journey
- **HealthcareList** - Structured medical data presentation
- **HealthcareHeader** - Navigation with emergency contacts
- **HealthcareDatePicker** - Appointment scheduling with medical availability

### Medical-Specific Components (8)
- **DoctorProfile** - Healthcare professional profiles with credentials
- **SpecialtySelector** - Medical specialty selection interface
- **ConsultationFlow** - Patient consultation workflow steps
- **FileUpload** - Medical document upload with HIPAA compliance
- **ConsentManager** - GDPR and medical consent management
- **EmergencyBanner** - Critical medical emergency contact information
- **MedicalFAQ** - Healthcare-specific FAQ with medical terminology

### Healthcare Content Components (3)
- **MotivationHero** - Patient motivation and trust-building sections
- **CoreValues** - Medical platform values and certifications
- **StorySection** - Patient success stories and testimonials

### Accessibility & Testing (4)
- **AccessibilityDemo** - WCAG 2.1 AA compliance demonstrations
- **AccessibilityTest** - Comprehensive accessibility testing suite

## Healthcare States Tested

### Standard States
- **default** - Normal healthcare component appearance
- **disabled** - Disabled state for medical form controls
- **error** - Error states with medical context and recovery guidance

### Healthcare-Specific States  
- **emergency** - Emergency medical contexts with red styling
- **high-contrast** - WCAG 2.1 AA high contrast mode
- **reduced-motion** - Reduced motion for accessibility compliance

## Healthcare Viewports

### Mobile Healthcare (375x667)
- Primary healthcare user device (iPhone SE)
- Tests 56px+ touch targets for stressed medical users
- Validates thumb-friendly mobile medical interfaces

### Clinical Tablet (768x1024) 
- iPad dimensions used in clinical settings
- Tests healthcare professional tablet workflows
- Validates medical data presentation on tablets

### Clinical Desktop (1440x900)
- Standard clinical workstation dimensions
- Tests healthcare professional desktop workflows
- Validates comprehensive medical data layouts

### Healthcare Accessibility (1200x800)
- Dedicated accessibility testing viewport
- Tests reduced motion and high contrast modes
- Validates WCAG 2.1 AA compliance visually

## Healthcare-Specific Requirements

### Touch Target Validation
- All interactive elements must be minimum 44px (WCAG 2.1 AA)
- Healthcare components prefer 56px+ for stressed users
- Emergency actions use 64px+ for critical healthcare situations

### Color Accuracy
- Healthcare color palette must be preserved exactly
- Medical trust colors: #004166 (primary), #1278B3 (links), #B3AF09 (accent)
- Emergency red: #dc2626 must be clearly visible in screenshots

### Accessibility Compliance
- High contrast modes must pass 4.5:1 ratio minimum
- Focus indicators must be 3px solid outline visible
- Reduced motion must disable all animations properly

### Medical Context Validation
- Emergency states must show red styling and contact information
- Privacy indicators must be visible in medical form components
- Medical specialization colors must be consistent across components

## Running Healthcare Screenshot Tests

### Full Test Suite
```bash
npm run screenshot
```

### Update All Baselines (when healthcare components change)
```bash
npm run screenshot:update
```

### Mobile Healthcare Testing
```bash
npm run screenshot:mobile
```

### Desktop Clinical Testing  
```bash
npm run screenshot:desktop
```

### Accessibility Compliance Testing
```bash
npm run screenshot:accessibility
```

### Individual Component Testing
```bash
npx playwright test tests/screenshots --grep "HealthcareButton"
npx playwright test tests/screenshots --grep "EmergencyBanner"
npx playwright test tests/screenshots --grep "DoctorProfile"
```

## Healthcare Test Results

Test results are saved to:
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/healthcare-test-results.json`
- **Screenshots**: `test-results/` directory
- **Baseline Images**: `tests/screenshots/component-screenshots.spec.ts-snapshots/`

## CI/CD Healthcare Integration

The screenshot tests are designed to run in CI/CD with:
- Conservative parallel execution (2 workers) for screenshot consistency
- Healthcare-specific timeouts for medical data loading
- Retry logic for healthcare component stability
- Automated baseline updates for healthcare design system changes

## Healthcare Component Validation Checklist

Each screenshot test validates:
- ✅ Healthcare color palette compliance (#004166, #1278B3, #B3AF09)
- ✅ Touch target sizes (56px+ for healthcare mobile users)
- ✅ Emergency state styling and contact visibility
- ✅ WCAG 2.1 AA contrast ratios (4.5:1 minimum)
- ✅ Focus indicators (3px solid outline)
- ✅ Medical context styling and typography
- ✅ Mobile healthcare UX optimizations
- ✅ Reduced motion accessibility compliance
- ✅ High contrast mode functionality

## Troubleshooting Healthcare Screenshots

### Common Issues
1. **Color variations**: Healthcare colors must be exactly preserved - check lighting/display settings
2. **Touch target failures**: Ensure buttons are minimum 44px, preferably 56px+ for healthcare
3. **Emergency state missing**: Verify emergency styling is applied and visible in screenshots
4. **Accessibility violations**: Use high contrast and reduced motion modes to validate compliance

### Healthcare-Specific Debugging
- Use `--debug` flag to step through healthcare component interactions
- Check browser console for medical data loading errors
- Verify Storybook stories include all required healthcare states
- Test on actual mobile devices for touch target validation