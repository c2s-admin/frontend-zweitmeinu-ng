# Healthcare Performance Monitoring

This directory contains performance budgets, monitoring tools, and configuration specifically optimized for the zweitmeinung.ng medical platform.

## 🏥 Healthcare Performance Requirements

### Critical Medical Components
- **Bundle Size**: <50KB
- **First Contentful Paint**: <500ms
- **Time to Interactive**: <1000ms
- **Components**: EmergencyBanner, EmergencyContact, CriticalAlert

### Healthcare Forms (Patient Data)
- **Bundle Size**: <200KB
- **First Contentful Paint**: <1200ms
- **Time to Interactive**: <2500ms
- **Cumulative Layout Shift**: <0.05
- **Components**: HealthcareInput, HealthcareTextarea, HealthcareSelect

### Medical Content
- **Bundle Size**: <300KB
- **First Contentful Paint**: <1500ms
- **Time to Interactive**: <3000ms
- **Components**: DoctorProfile, MedicalFAQ, SpecialtySelector

## 📊 Performance Budgets

### Bundle Size Limits
- **Total System**: 5MB maximum
- **Storybook Build**: 50MB maximum
- **Individual Components**: 200KB maximum
- **Critical Emergency Components**: 50KB maximum

### Loading Performance (3G Network)
- **Page Load Time**: <6s
- **First Contentful Paint**: <2400ms
- **Largest Contentful Paint**: <3600ms
- **Time to Interactive**: <6000ms

### Accessibility Performance
- **Color Contrast**: 4.5:1 ratio (WCAG 2.1 AA)
- **Touch Targets**: 56px minimum (healthcare optimized)
- **Focus Indicators**: 3px solid outline
- **Screen Reader Processing**: <100ms ARIA label processing

## 🛠️ Usage

### Run Performance Budget Check
```bash
npm run perf:budget
```

### Analyze Bundle Sizes
```bash
npm run size:analyze
```

### Generate Performance Report
```bash
npm run perf:report
```

### Healthcare Lighthouse Audit
```bash
npm run perf:healthcare
```

## 📁 Files

- `lighthouse.config.js` - Healthcare-optimized Lighthouse configuration
- `performance-budget.json` - Detailed healthcare performance budgets
- `budget-check.js` - Automated budget enforcement script
- `size-report.json` - Generated bundle size report (created by scripts)

## 🚨 CI/CD Integration

The performance budget check will fail the build if:
- Bundle sizes exceed healthcare limits
- Accessibility score falls below 90
- Performance score falls below 80
- Critical components exceed emergency loading thresholds

## 🏥 Healthcare Context

These budgets are specifically designed for:
- **Stressed medical users** who need fast, reliable access
- **Mobile healthcare professionals** often on slow 3G networks
- **Accessibility users** including screen readers and motor impairments
- **Emergency situations** where every millisecond matters

Performance is not just a technical metric - it's a healthcare quality issue that directly impacts patient care and medical professional efficiency.