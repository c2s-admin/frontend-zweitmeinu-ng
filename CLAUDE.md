# CLAUDE.md v3.0 - Storybook-Era Constitution 

This document serves as the **constitution for AI assistants** working on the zweitmeinung.ng platform, providing project-specific context and best practices for resilient, stable, and efficient healthcare component development.

> **Version 3.0 Focus**: Component-driven development with Storybook 9.1.1 as the primary development environment, WCAG 2.1 AA healthcare compliance, and systematic healthcare UI patterns.

---

## 🏥 Healthcare Platform Context

### **Mission-Critical Requirements**
zweitmeinung.ng is a **medical second opinion platform** where trust, accessibility, and reliability are paramount. Every component must meet healthcare industry standards.

### **Development Philosophy (2025)**
1. **Component-First Development** - Storybook is the PRIMARY development environment
2. **Healthcare Accessibility** - WCAG 2.1 AA compliance is mandatory, not optional  
3. **Medical Trust Design** - Every UI element must build patient confidence
4. **Touch-Optimized Healthcare** - 56px+ targets for stressed medical users
5. **Emergency-Ready** - Critical medical contact information always accessible

### **Target Users**
- **Patients seeking medical second opinions** - Often stressed, may have limited technical skills
- **Healthcare professionals** - Doctors, nurses accessing platform on mobile devices
- **Emergency situations** - Users needing immediate medical guidance
- **Accessibility users** - Screen readers, high contrast, reduced motion needs

---

## 🛠️ Tech Stack (Storybook-Era 2025)

| Technology | Version | Purpose | AI Best Practices |
|------------|---------|---------|-------------------|
| **🎨 Storybook** | **9.1.1** | **PRIMARY development environment** | **Always develop components here FIRST, then integrate** |
| **Next.js** | 15.4.6 | React framework with App Router | Server Components by default, Client Components for interactivity |
| **TypeScript** | 5.5.4 | Type safety and healthcare data integrity | Strict mode enabled, no `any` types in production |
| **Tailwind CSS** | 3.4.10 | Healthcare design system utilities | Use healthcare tokens only, JIT enabled |
| **Bun** | 1.1.26 | Fast package manager and runtime | Prefer `bun` over npm for development speed |
| **Strapi** | 5.20.0 | Headless CMS for medical content | Always populate parameters, handle data conversion |
| **React Hook Form** | 7.53.0 | Medical form validation | Use with Zod schemas for patient data |
| **Lucide React** | 0.536.0 | Healthcare-appropriate icons | Import individually, use medical-context icons |

---

## 📁 Project Architecture (Storybook-Integrated)

```
src/
├── app/                    # Next.js App Router (file-system routing)
│   ├── layout.tsx         # Root layout with healthcare providers
│   ├── page.tsx           # Homepage with emergency contact
│   ├── [slug]/            # Dynamic pages from Strapi CMS
│   └── api/               # API routes (FAQ, contact, medical data)
├── stories/               # 🎨 STORYBOOK - Healthcare Component Library
│   ├── Button.tsx         # Healthcare button (WCAG 2.1 AA compliant)
│   ├── Button.stories.ts  # Button stories (6+ healthcare scenarios)
│   ├── Button.css         # Healthcare button styles (56px+ touch)
│   ├── AccessibilityTest.stories.tsx  # A11y validation stories
│   └── Welcome.mdx        # Healthcare design system guide
├── components/            # Production React components
│   ├── sections/          # Page section components (58+ types)
│   ├── layout/            # Header, Footer, Navigation (emergency contacts)
│   └── ui/                # Base UI components (import from stories/)
├── lib/                   # Core utilities and medical API clients
│   ├── strapi/            # Strapi CMS integration for medical content
│   ├── utils.ts           # Healthcare utility functions
│   └── medical-dictionary.ts  # Medical terminology and synonyms
├── types/                 # TypeScript definitions (healthcare data)
│   ├── strapi.ts          # Expected Strapi CMS types
│   ├── strapi-real.ts     # Real API response conversion
│   └── sections.ts        # Component type definitions (58+ section types)
├── hooks/                 # Custom React hooks (medical contexts)
└── styles/               # Healthcare design tokens and global CSS
    ├── globals.css        # Healthcare color system, fonts
    └── tokens.css         # Design system tokens (Storybook integration)
```

### **🎯 Critical Directory Functions**

- **`/stories/`** - **PRIMARY development location** - All components start here
- **`/components/`** - Production imports from stories, Strapi integration
- **`/.storybook/`** - Storybook configuration (healthcare themes, A11y testing)
- **`/types/sections.ts`** - **Must update when adding new section components**

---

## 🚀 Essential Commands (Storybook-First Workflow)

### **Primary Development Commands**
| Command | Purpose | When to Use |
|---------|---------|-------------|
| **`bun run storybook`** | **🎨 Start Storybook (PRIMARY)** | **Component development, design system work** |
| **`bun run dev`** | Start Next.js (SECONDARY) | Integration testing, Strapi data testing |
| **`bun run build-storybook`** | Build Storybook for production | CI/CD validation, design system deployment |

### **Development Workflow Commands**
| Command | Purpose | Notes |
|---------|---------|-------|
| `bun run build` | Production Next.js build | Tree-shakes unused components |
| `bun run lint` | TypeScript + ESLint validation | **Run before every commit** |
| `bun run typecheck` | TypeScript compilation check | Use `bunx tsc --noEmit` if bun unavailable |
| `bun test` | Run component and integration tests | Located in `src/__tests__/` |

### **🏥 Healthcare-Specific Commands**
```bash
# Start BOTH servers for full development (recommended)
bun run dev & bun run storybook

# Component-first development (recommended workflow)
bun run storybook    # Develop component
# Test in Next.js integration
bun run dev          # Integrate with Strapi

# Accessibility validation
npm run build-storybook && open storybook-static/index.html
# Use A11y tab to validate WCAG 2.1 AA compliance
```

---

## 🎨 Healthcare Component System (Storybook 9.1.1)

### **🔬 Component Development Workflow (MANDATORY)**

#### **Step 1: Start with Storybook (ALWAYS)**
```bash
bun run storybook
# Open http://localhost:6006
# Create component in /src/stories/HealthcareComponent.tsx
```

#### **Step 2: Healthcare Component Creation Pattern**
```typescript
// 1. Create in /src/stories/HealthcareNewComponent.tsx
interface HealthcareNewComponentProps {
  // Always include accessibility props
  'aria-label'?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'  // Healthcare touch targets
  // Medical context props
  urgencyLevel?: 'normal' | 'urgent' | 'emergency'
  medicalContext?: boolean
}

// 2. Healthcare-compliant implementation
export const HealthcareNewComponent = ({ 
  size = 'medium',  // Default to healthcare-optimized size
  disabled = false,
  'aria-label': ariaLabel,
  ...props 
}: HealthcareNewComponentProps) => {
  return (
    <div 
      className={`
        healthcare-component 
        healthcare-component--${size}
        ${disabled ? 'healthcare-component--disabled' : ''}
      `}
      aria-label={ariaLabel}
      // Minimum 56px touch targets for healthcare users
      style={{ minHeight: '56px', minWidth: '56px' }}
    >
      {/* Healthcare component content */}
    </div>
  )
}
```

#### **Step 3: Story Creation (MINIMUM 6 stories)**
```typescript
// 3. Create HealthcareNewComponent.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareNewComponent } from './HealthcareNewComponent'

const meta: Meta<typeof HealthcareNewComponent> = {
  title: 'Healthcare/NewComponent',  // Use Healthcare/ prefix
  component: HealthcareNewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Healthcare-optimized component following WCAG 2.1 AA standards...'
      }
    }
  },
  tags: ['autodocs'],
}

// REQUIRED STORIES (minimum 6):
export const Default: Story = { /* Normal healthcare usage */ }
export const Emergency: Story = { /* Emergency/urgent context */ }
export const Disabled: Story = { /* Disabled state */ }
export const SmallTouch: Story = { /* 44px minimum touch target */ }
export const LargeTouch: Story = { /* 64px primary CTA touch target */ }
export const HighContrast: Story = { /* High contrast accessibility */ }
```

#### **Step 4: WCAG 2.1 AA Validation (MANDATORY)**
```bash
# In Storybook, use A11y tab for each story:
# ✅ Color Contrast: 4.5:1 ratio minimum
# ✅ Focus Indicators: 3px solid outline visible
# ✅ Touch Targets: 44px+ (prefer 56px+)
# ✅ Screen Reader: ARIA labels present and descriptive
# ✅ Keyboard Navigation: Tab order logical
```

#### **Step 5: Add to Section Registry (if applicable)**
```typescript
// 4. Add to /src/types/sections.ts (if used in Strapi)
export type SectionComponentType = 
  // ... existing types
  | 'sections.healthcare-new-component'  // Add your new component
```

#### **Step 6: Integration Testing**
```bash
# Start Next.js to test Strapi integration
bun run dev
# Test component in actual page context
# Verify healthcare data flows correctly
```

### **Healthcare Design System Standards (IMMUTABLE)**

#### **🛡️ Healthcare Color Palette (DO NOT DEVIATE)**
```css
/* Primary Healthcare Colors - Medical Trust & Professionalism */
--healthcare-primary: #004166;           /* Headlines, navigation, trust */
--healthcare-primary-light: #1278B3;     /* CTAs, links, accents */
--healthcare-accent-green: #B3AF09;      /* Success, highlights, positive actions */

/* Background & Status Colors */
--healthcare-light: #ffffff;             /* Clean backgrounds */
--healthcare-background: #f8fafc;        /* Subtle sections, calm */
--healthcare-error: #dc2626;            /* Medical alerts, critical */
--healthcare-warning: #f59e0b;          /* Caution, attention needed */
--healthcare-success: #10b981;          /* Confirmation, positive outcomes */
```

**Implementation (Tailwind Classes):**
```tsx
// ✅ CORRECT - Use healthcare tokens
<button className="bg-healthcare-primary-light text-white hover:bg-healthcare-primary">
<div className="bg-healthcare-background text-healthcare-primary">
<span className="text-healthcare-accent-green">

// ❌ WRONG - Never use arbitrary colors
<button className="bg-blue-500">  // Never
<div className="bg-slate-100">    // Never  
```

#### **📝 Typography (Healthcare-Optimized)**
```css
/* Font Stack: Roboto Condensed - Medical Readability */
font-family: 'Roboto Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;

/* Usage in Components */
.healthcare-heading { font-weight: 500; color: var(--healthcare-primary); }
.healthcare-body { font-weight: 400; line-height: 1.6; }
.healthcare-caption { font-weight: 300; color: var(--healthcare-text-muted); }
```

#### **♿ Accessibility Requirements (WCAG 2.1 AA - MANDATORY)**

**Critical Requirements (Non-Negotiable):**
```typescript
// Touch Targets - Healthcare Context
interface TouchTargetSizes {
  minimum: '44px'    // WCAG 2.1 AA absolute minimum
  standard: '56px'   // Healthcare recommended (stressed users)
  primary: '64px'    // Primary CTAs, emergency actions
}

// Focus Indicators - Must be visible
const focusStyles = `
  focus:outline-none 
  focus:ring-3 
  focus:ring-healthcare-primary-light 
  focus:ring-offset-2
`

// Contrast Requirements
interface ContrastRatios {
  normalText: '4.5:1'    // Minimum for body text
  largeText: '3:1'       // 18px+ or 14px+ bold
  uiComponents: '3:1'    // Buttons, form elements
}
```

**ARIA Implementation Examples:**
```tsx
// Healthcare Button - Complete accessibility
<button
  className="bg-healthcare-primary-light text-white min-h-[56px] min-w-[56px] focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2"
  aria-label="Jetzt kostenlose medizinische Zweitmeinung anfordern"
  disabled={isLoading}
  aria-describedby={errors ? 'button-error' : undefined}
>
  {isLoading ? 'Wird bearbeitet...' : 'Zweitmeinung anfordern'}
</button>

// Healthcare Navigation
<nav aria-label="Hauptnavigation für medizinische Dienste">
  <ul role="list">
    <li role="listitem">
      <a href="/kardiologie" aria-describedby="cardiology-desc">Kardiologie</a>
    </li>
  </ul>
</nav>

// Healthcare Form Input
<div className="healthcare-form-group">
  <label htmlFor="medical-concern" className="healthcare-label">
    Medizinisches Anliegen *
  </label>
  <textarea
    id="medical-concern"
    className="healthcare-textarea min-h-[120px]"
    aria-describedby="medical-concern-help"
    aria-required="true"
    placeholder="Beschreiben Sie Ihr medizinisches Anliegen..."
  />
  <div id="medical-concern-help" className="healthcare-help-text">
    Alle Angaben werden vertraulich behandelt und sind durch die ärztliche Schweigepflicht geschützt.
  </div>
</div>
```

### **🏥 Healthcare-Specific UI Patterns**

#### **Emergency Elements (Always Visible)**
```tsx
// Emergency Contact Banner - Must be present on all pages
<div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
  <span className="font-medium">Medizinischer Notfall?</span>
  <a href="tel:+4980080441100" className="ml-2 underline font-bold">
    📞 +49 800 80 44 100
  </a>
</div>

// Emergency CTA in forms
<button className="bg-red-600 hover:bg-red-700 text-white min-h-[64px] text-lg font-semibold">
  🚨 Notfall - Sofortige Hilfe
</button>
```

#### **Trust-Building Elements**
```tsx
// Medical Credentials Display
<div className="bg-healthcare-background p-6 rounded-2xl">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-healthcare-primary rounded-full flex items-center justify-center">
      <UserIcon className="w-8 h-8 text-white" />
    </div>
    <div>
      <h3 className="font-semibold text-healthcare-primary">Dr. med. Maria Schmidt</h3>
      <p className="text-sm text-healthcare-text-muted">Fachärztin für Kardiologie</p>
      <div className="flex items-center gap-2 mt-1">
        <CheckCircleIcon className="w-4 h-4 text-healthcare-success" />
        <span className="text-xs text-healthcare-success">Zertifiziert</span>
      </div>
    </div>
  </div>
</div>

// Privacy Indicator
<div className="flex items-center gap-2 text-sm text-healthcare-text-muted">
  <ShieldCheckIcon className="w-4 h-4 text-healthcare-success" />
  <span>DSGVO-konform · Ärztliche Schweigepflicht</span>
</div>
```

#### **Loading & Status Indicators (Healthcare Context)**
```tsx
// Medical Data Loading
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
  <span className="ml-3 text-healthcare-primary">Medizinische Daten werden geladen...</span>
</div>

// Success States (Medical Context)
<div className="bg-healthcare-success/10 border border-healthcare-success/20 rounded-xl p-4">
  <div className="flex items-center gap-3">
    <CheckCircleIcon className="w-6 h-6 text-healthcare-success" />
    <div>
      <p className="font-medium text-healthcare-success">Anfrage erfolgreich übermittelt</p>
      <p className="text-sm text-healthcare-text-muted">
        Sie erhalten innerhalb von 48 Stunden eine erste ärztliche Einschätzung.
      </p>
    </div>
  </div>
</div>

// Error States (Medical Context)
<div className="bg-red-50 border border-red-200 rounded-xl p-4">
  <div className="flex items-center gap-3">
    <AlertTriangleIcon className="w-6 h-6 text-red-600" />
    <div>
      <p className="font-medium text-red-800">Übertragung fehlgeschlagen</p>
      <p className="text-sm text-red-600">
        Bei kritischen Fällen wenden Sie sich bitte direkt an den Notdienst: 112
      </p>
    </div>
  </div>
</div>
```

---

## 💡 Code Standards & Best Practices (Healthcare-Enhanced)

### **TypeScript (Medical Data Integrity)**
```typescript
// ✅ CORRECT - Strict medical data types
interface PatientInquiry {
  readonly id: string
  medicalConcern: string
  urgencyLevel: 'routine' | 'urgent' | 'emergency'
  patientAge?: number  // Optional, privacy-sensitive
  medicalHistory?: MedicalHistory[]  // Structured medical data
  consentGiven: boolean  // GDPR compliance required
  timestamp: Date
}

// ✅ CORRECT - No any types in medical contexts
interface StrapiMedicalResponse {
  data: MedicalExpert[]
  meta: ResponseMetadata
}

// ❌ WRONG - Never use any for medical data
const patientData: any = response.data  // Never!
```

### **React/Next.js Patterns (Healthcare Context)**
```tsx
// ✅ CORRECT - Server Components for medical content (privacy)
// app/experts/page.tsx
export default async function MedicalExpertsPage() {
  const experts = await getMedicalExperts()  // Server-side, secure
  
  return (
    <div className="min-h-screen bg-healthcare-background">
      <EmergencyBanner />  {/* Always include */}
      <ExpertGrid experts={experts} />
    </div>
  )
}

// ✅ CORRECT - Client Components only for interactivity
'use client'
export function MedicalForm() {
  const [consent, setConsent] = useState(false)
  
  return (
    <form className="space-y-6">
      {/* Medical form with privacy considerations */}
      <ConsentCheckbox 
        checked={consent} 
        onChange={setConsent}
        required 
      />
    </form>
  )
}
```

### **Styling (Healthcare Design System)**
```tsx
// ✅ CORRECT - Healthcare design tokens
<div className="bg-healthcare-background p-6 rounded-2xl shadow-healthcare">
  <button className="bg-healthcare-primary-light hover:bg-healthcare-primary text-white min-h-[56px] px-8 rounded-xl transition-all duration-200">
    Beratung anfragen
  </button>
</div>

// ✅ CORRECT - Responsive healthcare patterns
<div className="p-4 sm:p-6 lg:p-8">  {/* Progressive spacing */}
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-healthcare-primary">
    Medizinische Zweitmeinung
  </h1>
</div>

// ❌ WRONG - Arbitrary values in healthcare context
<button className="bg-blue-500 h-10">  {/* Too small, wrong color */}
<div className="p-2">  {/* Not enough padding for healthcare */}
```

### **Strapi Integration (Medical Content)**
```typescript
// ✅ CORRECT - Medical content with proper population
const medicalContent = await strapiAPI.get('/medical-articles', {
  'populate[sections]': '*',
  'populate[medicalExperts]': 'name,specialization,credentials',
  'populate[images]': 'url,alt',  // Always include alt text for accessibility
  'filters[medicallyReviewed][$eq]': true  // Only medically reviewed content
})

// ✅ CORRECT - Error handling for medical data
try {
  const experts = await getMedicalExperts()
  return experts
} catch (error) {
  // Log error but show user-friendly healthcare message
  console.error('Medical experts fetch failed:', error)
  return {
    error: 'Medizinische Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut oder wenden Sie sich direkt an unseren Support.',
    fallback: defaultMedicalContacts  // Always provide fallback contact
  }
}
```

---

## 🔧 Development Workflow (Storybook-First)

### **1. Component Development Process**
```bash
# Step 1: Start with Storybook (ALWAYS)
bun run storybook
# http://localhost:6006

# Step 2: Create healthcare component
# /src/stories/HealthcareNewComponent.tsx
# /src/stories/HealthcareNewComponent.stories.ts
# /src/stories/HealthcareNewComponent.css

# Step 3: A11y validation in Storybook
# Use A11y tab to validate WCAG 2.1 AA compliance

# Step 4: Integration testing
bun run dev  # Test with Next.js and Strapi data
```

### **2. Healthcare Component Checklist (Before Completion)**
```typescript
// ✅ WCAG 2.1 AA Compliance Checklist
interface ComponentReadinessCheck {
  accessibility: {
    contrastRatio: '4.5:1 minimum'           // ✅ Validated in Storybook A11y tab
    touchTargets: '56px+ for healthcare'    // ✅ Measured in browser dev tools
    focusIndicators: '3px solid visible'    // ✅ Keyboard navigation tested
    ariaLabels: 'Descriptive German text'  // ✅ Screen reader friendly
  }
  
  functionality: {
    emergencyStates: 'Handled appropriately'  // ✅ Emergency contexts work
    loadingStates: 'Medical context'          // ✅ Healthcare-appropriate loading
    errorStates: 'Helpful medical guidance'   // ✅ Clear error recovery
    mobileUsability: 'Thumb-friendly on mobile'  // ✅ Mobile healthcare testing
  }
  
  design: {
    healthcareColors: 'Only approved palette'     // ✅ No arbitrary colors
    medicalTone: 'Professional and trustworthy'  // ✅ Appropriate for medical context
    typography: 'Roboto Condensed only'          // ✅ Healthcare font system
  }
  
  performance: {
    bundleSize: 'Minimal impact'        // ✅ Dynamic imports when needed
    renderTime: 'Fast for stressed users'  // ✅ Quick loading essential
  }
}
```

### **3. Testing & Quality (Healthcare Standards)**
```bash
# TypeScript compilation (strict mode for medical data)
bunx tsc --noEmit --strict

# Linting with healthcare-specific rules
bun run lint

# Accessibility testing (mandatory)
# 1. Automated in Storybook A11y tab
# 2. Manual screen reader testing (NVDA/JAWS)
# 3. Keyboard navigation testing
# 4. Mobile touch testing on actual devices

# Integration testing with medical data
bun run dev  # Test with real Strapi medical content
```

---

## 🚨 Common Issues & Solutions (Storybook Era)

### **Storybook Development Issues**

#### **1. Component Not Appearing in Storybook**
**Problem**: Component created but not visible in Storybook sidebar
**Solution**:
```typescript
// Check file naming convention
// ✅ CORRECT
src/stories/HealthcareButton.stories.ts    // Will appear in sidebar
src/stories/HealthcareButton.tsx           // Component file

// ❌ WRONG
src/stories/button.stories.ts              // Wrong naming
src/components/Button.stories.ts           // Wrong directory
```

#### **2. A11y Tests Failing**
**Problem**: Accessibility violations in Storybook A11y tab
**Solution**:
```tsx
// ✅ CORRECT - Fix common A11y issues
<button 
  className="min-h-[56px] min-w-[56px]"        // Touch target size
  aria-label="Medizinische Zweitmeinung anfordern"  // Screen reader text
  style={{ backgroundColor: '#1278B3' }}      // Sufficient contrast
>
  Anfragen
</button>

// Add focus indicators
.healthcare-button:focus {
  outline: 3px solid #1278B3;
  outline-offset: 2px;
}
```

#### **3. Stories Not Loading Healthcare Data**
**Problem**: Stories show empty or placeholder data
**Solution**:
```typescript
// ✅ CORRECT - Mock healthcare data in stories
export const WithMedicalData: Story = {
  args: {
    expert: {
      name: 'Dr. med. Maria Schmidt',
      specialization: 'Kardiologie',
      credentials: 'Facharzt für Innere Medizin',
      rating: 4.9,
      reviewCount: 127
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Medical expert card with realistic healthcare professional data'
      }
    }
  }
}
```

### **Traditional Issues (Updated for Storybook Era)**

#### **4. Hydration Mismatches (Healthcare Context)**
**Problem**: Server/client rendering differences affecting medical components
**Solution**:
```tsx
// ✅ CORRECT - Healthcare-safe client-only rendering
'use client'
import { useState, useEffect } from 'react'

export function MedicalAppointmentTime() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  if (!mounted) {
    return <div className="h-6 bg-healthcare-background animate-pulse rounded" />  // Healthcare loading
  }
  
  return (
    <time className="text-healthcare-primary">
      {new Date().toLocaleDateString('de-DE')}
    </time>
  )
}
```

#### **5. Component Not in Section Registry**
**Problem**: New component created but can't be used in Strapi sections
**Solution**:
```typescript
// Add to /src/types/sections.ts
export type SectionComponentType = 
  // ... existing types
  | 'sections.healthcare-new-component'     // Add your component here
  | 'sections.medical-expert-grid'          // Example medical component
  | 'sections.emergency-contact-banner'     // Example emergency component
```

#### **6. Image Loading Issues (Medical Context)**
**Problem**: Medical images, doctor photos not displaying
**Solution**:
```typescript
// 1. Check Strapi populate includes medical image data
const medicalExperts = await strapiAPI.get('/experts', {
  'populate[photo]': '*',           // Doctor profile photos
  'populate[credentials]': '*',     // Medical certificates
  'populate[specializations]': '*'  // Medical specialization images
})

// 2. Verify medical image conversion in strapi-real.ts
// 3. Ensure Next.js next.config.js includes medical image domains
```

---

## 🎯 Performance Optimization (Healthcare-Critical)

### **Bundle Size (Medical Performance)**
```typescript
// ✅ CORRECT - Dynamic imports for large medical components
const MedicalFileUpload = dynamic(() => import('./MedicalFileUpload'), {
  loading: () => <MedicalLoadingSpinner />,
  ssr: false  // Medical file handling client-side only
})

// ✅ CORRECT - Tree-shake medical icons
import { Heart, Stethoscope, Pills } from 'lucide-react'  // Only medical icons needed

// ❌ WRONG - Large bundle for healthcare users
import * as Icons from 'lucide-react'  // Too large for healthcare mobile users
```

### **Runtime Performance (Healthcare UX)**
```tsx
// ✅ CORRECT - Optimize for stressed medical users
import { memo, useMemo } from 'react'

const MedicalExpertCard = memo(({ expert }: { expert: MedicalExpert }) => {
  // Cache expensive medical data calculations
  const expertRating = useMemo(() => 
    calculateMedicalRating(expert.reviews), 
    [expert.reviews]
  )
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-healthcare">
      {/* Fast-loading medical expert info */}
    </div>
  )
})

// ✅ CORRECT - Suspense for medical data
<Suspense fallback={<MedicalExpertSkeleton />}>
  <MedicalExpertGrid />
</Suspense>
```

### **Healthcare API Optimization**
```typescript
// ✅ CORRECT - Selective medical data fetching
const medicalData = await strapiAPI.get('/medical-experts', {
  'populate[specializations]': 'name,icon',  // Only essential medical data
  'populate[credentials]': 'title,year',     // Essential credentials only
  'fields': 'name,rating,reviewCount',       // Minimal expert data
  'pagination[pageSize]': 10,                // Reasonable page size for healthcare
})

// ✅ CORRECT - Cache medical data appropriately
export const revalidate = 3600  // 1 hour cache for medical expert data (not too stale)
export const dynamic = 'force-dynamic'  // For patient-specific data
```

---

## 🏥 Domain-Specific Context (Enhanced)

### **Medical Platform Requirements (2025 Standards)**

#### **Patient Privacy & GDPR Compliance**
```typescript
// ✅ CORRECT - Privacy-first medical data handling
interface PatientDataHandling {
  logging: 'Never log sensitive medical information'
  storage: 'Encrypt all patient data at rest'
  transmission: 'HTTPS only for medical communications'
  retention: 'Follow medical data retention laws (10 years Germany)'
  consent: 'Explicit opt-in for all medical data processing'
}

// Example implementation
const handleMedicalSubmission = async (data: MedicalInquiry) => {
  // ✅ CORRECT - No logging of medical details
  logger.info('Medical inquiry submitted', { 
    inquiryId: data.id, 
    timestamp: data.timestamp 
    // Never log: medicalConcern, patientDetails, etc.
  })
  
  // ✅ CORRECT - Encrypted transmission
  const response = await fetch('/api/medical-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(encrypt(data))  // Encrypt sensitive medical data
  })
}
```

#### **Accessibility for Medical Users**
```typescript
// Healthcare users often have additional accessibility needs
interface HealthcareAccessibility {
  visualImpairments: 'High contrast modes, screen reader optimization'
  motorImpairments: 'Large touch targets (56px+), voice input support'
  cognitiveLoad: 'Simple language, clear instructions, progress indicators'
  stressFactors: 'Calm colors, reassuring messaging, emergency contacts visible'
  mobileFirst: 'Many healthcare users primarily on mobile devices'
}

// ✅ CORRECT - Healthcare accessibility implementation
<button 
  className="
    min-h-[56px] min-w-[56px] 
    bg-healthcare-primary-light 
    text-white text-lg font-medium
    rounded-xl
    focus:ring-4 focus:ring-healthcare-primary-light focus:ring-offset-2
    active:scale-95
    transition-all duration-200
  "
  aria-label="Medizinische Beratung jetzt starten - Sie werden zu einem Facharzt weitergeleitet"
>
  🩺 Beratung starten
</button>
```

#### **Trust Indicators for Medical Platform**
```tsx
// ✅ CORRECT - Medical trust elements
<div className="bg-healthcare-background p-6 rounded-2xl">
  <div className="flex items-center gap-4 mb-4">
    <div className="flex items-center gap-2">
      <ShieldCheckIcon className="w-5 h-5 text-healthcare-success" />
      <span className="text-sm font-medium">DSGVO-konform</span>
    </div>
    <div className="flex items-center gap-2">
      <CertificateIcon className="w-5 h-5 text-healthcare-success" />
      <span className="text-sm font-medium">Ärztlich geprüft</span>
    </div>
    <div className="flex items-center gap-2">
      <LockIcon className="w-5 h-5 text-healthcare-success" />
      <span className="text-sm font-medium">SSL-verschlüsselt</span>
    </div>
  </div>
  
  <p className="text-xs text-healthcare-text-muted">
    Alle medizinischen Daten werden nach höchsten Sicherheitsstandards behandelt 
    und unterliegen der ärztlichen Schweigepflicht.
  </p>
</div>
```

### **Medical Specialties & Content Types**

#### **7 Primary Medical Specialties**
```typescript
interface MedicalSpecialties {
  'kardiologie': 'Heart and cardiovascular medicine'
  'onkologie': 'Cancer treatment and oncology'  
  'gallenblase': 'Gallbladder and biliary system'
  'nephrologie': 'Kidney and renal medicine'
  'schilddruese': 'Thyroid and endocrine disorders'
  'intensivmedizin': 'Critical care and intensive medicine'
  'allgemeine-fragen': 'General medical inquiries and health questions'
}

// Usage in components
const getSpecialtyColor = (specialty: keyof MedicalSpecialties) => {
  const colors = {
    'kardiologie': 'text-red-600',         // Heart = red
    'onkologie': 'text-purple-600',        // Cancer = purple  
    'gallenblase': 'text-yellow-600',      // Gallbladder = yellow
    'nephrologie': 'text-blue-600',        // Kidney = blue
    'schilddruese': 'text-green-600',      // Thyroid = green
    'intensivmedizin': 'text-orange-600',  // ICU = orange
    'allgemeine-fragen': 'text-healthcare-primary'  // General = brand color
  }
  return colors[specialty] || 'text-healthcare-primary'
}
```

#### **Component Types (58+ Healthcare Sections)**
```typescript
// Medical section components for Strapi integration
type HealthcareSectionTypes = 
  // Emergency & Contact
  | 'sections.emergency-banner'
  | 'sections.medical-contact-form'  
  | 'sections.emergency-contacts'
  
  // Medical Content
  | 'sections.medical-hero'
  | 'sections.expert-grid'
  | 'sections.medical-services'
  | 'sections.specialty-showcase'
  
  // Trust & Credentials  
  | 'sections.medical-credentials'
  | 'sections.patient-testimonials'
  | 'sections.trust-indicators'
  
  // FAQ & Information
  | 'sections.medical-faq'
  | 'sections.health-information'
  | 'sections.treatment-process'
  
  // ... 45+ additional healthcare section types
```

---

## 📋 Current Implementation Status (Storybook Era)

### **✅ Phase 1 Complete (Storybook Foundation)**
- **🎨 Storybook 9.1.1 Integration** - Primary development environment established
- **Healthcare Button Component** - WCAG 2.1 AA compliant with 6+ stories
- **Accessibility Testing Framework** - A11y addon configured and validated
- **CI/CD Pipeline** - Automated Storybook builds in GitHub Actions
- **Healthcare Design System** - Color palette, typography, touch targets defined
- **Development Workflow** - Storybook-first development process established

### **✅ Phase 2 Complete (Core Healthcare Components)**
**Target**: 12 essential healthcare components ✅ **ALL DELIVERED**
- **✅ HealthcareHeader** - Navigation with emergency contacts and medical specialties
- **✅ HealthcareCard** - Medical content containers with rating systems
- **✅ HealthcareInput** - Patient data collection with privacy indicators
- **✅ HealthcareSelect** - Medical specialty selection with search functionality
- **✅ HealthcareTextarea** - Medical history input with auto-resize
- **✅ HealthcareAlert** - Medical notifications with emergency contact integration
- **✅ HealthcareModal** - GDPR consent forms and medical dialogs
- **✅ HealthcareTooltip** - Medical term explanations with ICD-10 codes
- **✅ HealthcareBadge** - Status indicators with medical priority levels
- **✅ HealthcareProgressBar** - Medical process tracking and patient journey
- **✅ HealthcareList** - Structured medical data presentation

### **🚀 Phase 3 Starting (Advanced Components & Integration)**
- **Advanced Medical Components** - Specialty selectors, doctor profiles, consultation flows
- **Existing Section Integration** - Convert 58+ sections to healthcare components  
- **Medical-Specific Features** - File upload, date picker, consent manager
- **Performance Optimization** - Component lazy loading and bundle optimization

### **📅 Phase 4 Planned (Production Deployment)**
- **Production Deployment** - Storybook hosting at design.zweitmeinung.ng
- **Documentation & Training** - Complete healthcare component guide
- **Quality Assurance** - Visual regression testing and medical review
- **Team Handoff** - Developer onboarding and workflow documentation

### **✅ Completed Development Areas (Storybook-Era)**
- **✅ Component-Driven Development** - All 12 core components built in Storybook first
- **✅ Healthcare Accessibility** - WCAG 2.1 AA compliance achieved across all components
- **✅ Mobile Healthcare UX** - 56px+ touch targets and responsive medical interfaces
- **✅ Medical Context Integration** - Emergency contacts, privacy notices, specialty colors

---

## 🤖 AI Assistant Instructions (Storybook-Era Guidelines)

### **PRIMARY DEVELOPMENT RULES**

1. **🎨 Storybook-First Development (MANDATORY)**
   - ALWAYS start component development in Storybook
   - Create healthcare components in `/src/stories/` first
   - Test with A11y addon before integration
   - Minimum 6 stories per component (Default, Emergency, Disabled, Touch sizes, High contrast)

2. **🏥 Healthcare Compliance (NON-NEGOTIABLE)**
   - WCAG 2.1 AA compliance is mandatory, not optional
   - Use only healthcare color palette (#004166, #1278B3, #B3AF09)
   - Minimum 56px touch targets for healthcare users
   - Include emergency contact visibility in all layouts

3. **⚗️ Component Development Process**
   ```typescript
   // Step 1: Create in Storybook
   /src/stories/HealthcareComponent.tsx
   /src/stories/HealthcareComponent.stories.ts
   /src/stories/HealthcareComponent.css
   
   // Step 2: Validate accessibility
   // Use A11y tab in Storybook - must pass all tests
   
   // Step 3: Add to type registry (if Strapi component)
   // /src/types/sections.ts - add to SectionComponentType union
   
   // Step 4: Integration test
   // bun run dev - test with Next.js and Strapi
   ```

4. **🔒 Medical Data Integrity**
   - Use TypeScript strict mode - no `any` types for medical data
   - Never log sensitive medical information
   - Implement proper error boundaries for healthcare data
   - Always provide fallback emergency contacts

5. **📱 Healthcare UX Priorities**
   - Mobile-first design for healthcare users
   - Large touch targets (56px+) for stressed users
   - Clear error messages with medical context
   - Emergency information always accessible

### **DEVELOPMENT WORKFLOW ENFORCEMENT**

#### **Before Starting Any Task:**
```bash
# 1. Start Storybook FIRST
bun run storybook
# 2. Check existing healthcare patterns
# 3. Review /docs/STORYBOOK-ROADMAP.md for current phase
```

#### **During Development:**
- **Create components in Storybook first** - no exceptions
- **Test A11y compliance immediately** - use A11y tab for every story
- **Use healthcare design tokens only** - no arbitrary colors/sizes
- **Include medical context** - every component should work in healthcare scenarios

#### **Before Completing:**
- **TypeScript compilation must pass**: `bunx tsc --noEmit`
- **Linting must pass**: `bun run lint`  
- **Storybook build must work**: `bun run build-storybook`
- **A11y tests must pass** - validate in Storybook A11y tab
- **Mobile testing required** - test on actual mobile devices

### **ERROR HANDLING (Healthcare-Critical)**
```typescript
// ✅ CORRECT - Healthcare-appropriate error handling
const handleMedicalError = (error: Error, context: string) => {
  // Log technical details (not medical data)
  logger.error(`Medical system error in ${context}`, { 
    error: error.message, 
    stack: error.stack,
    timestamp: new Date().toISOString()
    // Never log: patient data, medical details, personal info
  })
  
  // Show user-friendly medical message
  return {
    message: 'Ein technischer Fehler ist aufgetreten. Ihre medizinischen Daten sind sicher. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support.',
    emergencyContact: '+49 800 80 44 100',
    supportEmail: 'support@zweitmeinung.ng'
  }
}
```

### **PERFORMANCE CONSIDERATIONS (Healthcare Users)**
- **Fast loading is critical** - medical users are often stressed
- **Bundle size matters** - many users on mobile with limited data
- **Offline considerations** - implement service workers for critical functions
- **Progressive enhancement** - core functionality must work without JavaScript

### **COMMUNICATION GUIDELINES**
- **Use medical-appropriate language** - professional, reassuring tone
- **Provide clear next steps** - medical users need guidance
- **Include emergency fallbacks** - always offer alternative contact methods
- **Respect privacy** - never assume medical details in generic messaging

---

**Remember**: This is a medical platform where patient trust, data security, and accessibility are paramount. Every component, every interaction, and every error message must reflect the highest standards of healthcare professionalism.

---

## 🔗 Quick Reference Links

- **🎨 Storybook Development**: http://localhost:6006
- **🏥 Website Testing**: http://localhost:3000
- **📚 Full Roadmap**: `/docs/STORYBOOK-ROADMAP.md`
- **🏗️ Architecture**: `/docs/ARCHITECTURE.md`
- **📖 API Reference**: `/docs/API-REFERENCE.md`

---

*Last updated: 2025-08-06 | Version: 3.0 - Storybook-Era Constitution*
*Previous version backed up as: CLAUDE-backup-v2.1.md*