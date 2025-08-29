# CLAUDE.md v4.0 - Streamlined Healthcare Development Guide

This document provides essential context and guidelines for AI assistants working on the zweitmeinung.ng medical platform. Focus: Concise, actionable healthcare development standards.

> **Version 4.0**: Consolidated redundant content, updated commands, fixed broken links. Reduced from 1139 to ~500 lines while preserving all critical information.

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
| **npm** | 10.9.2 | Node.js package manager | Primary package manager for all commands |
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
| **`npm run storybook`** | **🎨 Start Storybook (PRIMARY)** | **Component development, design system work** |
| **`npm run dev`** | Start Next.js (SECONDARY) | Integration testing, Strapi data testing |
| **`npm run build-storybook`** | Build Storybook for production | CI/CD validation, design system deployment |

### **Development Workflow Commands**
| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run build` | Production Next.js build | Tree-shakes unused components |
| `npm run lint` | TypeScript + ESLint validation | **Run before every commit** |
| `npm run typecheck` | TypeScript compilation check | Use `npx tsc --noEmit` if needed |
| `npm test` | Run component and integration tests | Located in `src/__tests__/` |

### **🏥 Healthcare-Specific Commands**
```bash
# Start BOTH servers for full development (recommended)
npm run dev & npm run storybook

# Component-first development (recommended workflow)
npm run storybook    # Develop component
# Test in Next.js integration
npm run dev          # Integrate with Strapi

# Accessibility validation
npm run build-storybook && open storybook-static/index.html
# Use A11y tab to validate WCAG 2.1 AA compliance
```

---

## 🎨 Healthcare Component Development

### **🔬 Storybook-First Workflow (MANDATORY)**

#### **6-Step Development Process**
1. **Start Storybook**: `npm run storybook` → http://localhost:6006
2. **Create Component**: `/src/stories/HealthcareComponent.tsx`
3. **Create Stories**: Minimum 6 stories (Default, Emergency, Disabled, Touch variants, High contrast)
4. **Validate A11y**: Use Storybook A11y tab - must pass WCAG 2.1 AA
5. **Add to Registry**: Update `/src/types/sections.ts` if Strapi component
6. **Integration Test**: `npm run dev` to test with Next.js/Strapi

#### **Healthcare Component Template**
```typescript
interface HealthcareComponentProps {
  'aria-label'?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'  // 44px/56px/64px
  urgencyLevel?: 'normal' | 'urgent' | 'emergency'
  medicalContext?: boolean
}

export const HealthcareComponent = ({ 
  size = 'medium',
  disabled = false,
  'aria-label': ariaLabel,
  ...props 
}: HealthcareComponentProps) => (
  <div 
    className={`healthcare-component healthcare-component--${size} ${disabled ? 'healthcare-component--disabled' : ''}`}
    aria-label={ariaLabel}
    style={{ minHeight: '56px', minWidth: '56px' }}
  >
    {/* Component content */}
  </div>
)
```

### **Healthcare Design System**

#### **🛡️ Color Palette (IMMUTABLE)**
```css
/* Primary Colors */
--healthcare-primary: #004166;           /* Headlines, navigation */
--healthcare-primary-light: #1278B3;     /* CTAs, links */
--healthcare-accent-green: #B3AF09;      /* Success, highlights */

/* Status Colors */
--healthcare-background: #f8fafc;        /* Sections */
--healthcare-error: #dc2626;            /* Alerts */
--healthcare-warning: #f59e0b;          /* Caution */
--healthcare-success: #10b981;          /* Confirmation */
```

**Usage**: Use `bg-healthcare-primary-light`, `text-healthcare-primary`. Never arbitrary colors like `bg-blue-500`.

#### **🔤 Typography**
- **Font**: `'Roboto Condensed'` for medical readability
- **Weights**: 300 (caption), 400 (body), 500 (headings)
- **Line Height**: 1.6 for body text

#### **♿ Accessibility (WCAG 2.1 AA)**

**Touch Targets**: 44px minimum, 56px recommended, 64px for primary CTAs
**Contrast**: 4.5:1 for normal text, 3:1 for large text/components  
**Focus**: 3px solid outline with 2px offset
**ARIA**: Descriptive German labels for screen readers

**ARIA Implementation Examples:**
```tsx
// Healthcare Button
<button
  className="bg-healthcare-primary-light text-white min-h-[56px] focus:ring-3"
  aria-label="Jetzt kostenlose medizinische Zweitmeinung anfordern"
  disabled={isLoading}
>
  {isLoading ? 'Wird bearbeitet...' : 'Zweitmeinung anfordern'}
</button>

// Healthcare Form
<div className="healthcare-form-group">
  <label htmlFor="medical-concern">Medizinisches Anliegen *</label>
  <textarea
    id="medical-concern"
    className="min-h-[120px]"
    aria-describedby="medical-concern-help"
    aria-required="true"
  />
  <div id="medical-concern-help">
    Alle Angaben werden vertraulich behandelt.
  </div>
</div>
```

### **🏥 Healthcare UI Patterns**

#### **Emergency Elements**
```tsx
// Emergency Banner (always visible)
<div className="fixed top-0 bg-red-600 text-white text-center py-2 z-50">
  Medizinischer Notfall? <a href="tel:+4980080441100">📞 +49 800 80 44 100</a>
</div>

// Emergency Button
<button className="bg-red-600 text-white min-h-[64px]">🚨 Notfall</button>
```

#### **Trust & Status Elements**
```tsx
// Medical Credentials
<div className="bg-healthcare-background p-6 rounded-2xl">
  <h3 className="text-healthcare-primary">Dr. med. Maria Schmidt</h3>
  <p className="text-sm">Fachärztin für Kardiologie</p>
  <span className="text-xs text-healthcare-success">✓ Zertifiziert</span>
</div>

// Privacy Indicator
<div className="flex items-center gap-2 text-sm">
  <ShieldCheckIcon className="w-4 h-4 text-healthcare-success" />
  <span>DSGVO-konform · Ärztliche Schweigepflicht</span>
</div>

// Loading State
<div className="flex items-center p-8">
  <div className="animate-spin h-8 w-8 border-b-2 border-healthcare-primary"></div>
  <span className="ml-3">Medizinische Daten werden geladen...</span>
</div>
```

---

## 💡 Development Guidelines

### **TypeScript Standards**
```typescript
// ✅ CORRECT - Strict medical data types
interface PatientInquiry {
  readonly id: string
  medicalConcern: string
  urgencyLevel: 'routine' | 'urgent' | 'emergency'
  consentGiven: boolean  // GDPR required
  timestamp: Date
}

// ❌ NEVER use 'any' for medical data
const patientData: any = response.data  // NEVER!
```

### **React/Next.js Patterns**
```tsx
// Server Components for medical content (privacy)
export default async function MedicalExpertsPage() {
  const experts = await getMedicalExperts()
  return (
    <div className="min-h-screen bg-healthcare-background">
      <EmergencyBanner />  {/* Always include */}
      <ExpertGrid experts={experts} />
    </div>
  )
}

// Client Components only for interactivity
'use client'
export function MedicalForm() {
  const [consent, setConsent] = useState(false)
  return (
    <form className="space-y-6">
      <ConsentCheckbox checked={consent} onChange={setConsent} required />
    </form>
  )
}
```

### **Strapi Integration**
```typescript
// Medical content with proper population
const content = await strapiAPI.get('/medical-articles', {
  'populate[sections]': '*',
  'populate[images]': 'url,alt',
  'filters[medicallyReviewed][$eq]': true
})

// Error handling with fallback
try {
  return await getMedicalExperts()
} catch (error) {
  return {
    error: 'Medizinische Daten konnten nicht geladen werden.',
    fallback: defaultMedicalContacts
  }
}
```

---

## 🔧 Quality Assurance

### **Pre-Completion Checklist**

#### **Accessibility (WCAG 2.1 AA)**
- ✅ Color contrast 4.5:1+ (validated in Storybook A11y tab)
- ✅ Touch targets 56px+ (measured in browser)
- ✅ Focus indicators 3px solid visible
- ✅ German ARIA labels for screen readers

#### **Functionality**
- ✅ Emergency states handled appropriately
- ✅ Loading states with medical context
- ✅ Error states with clear guidance
- ✅ Mobile usability tested on devices

#### **Design & Performance**
- ✅ Only approved healthcare colors
- ✅ Professional medical tone
- ✅ Roboto Condensed typography
- ✅ Minimal bundle impact
- ✅ Fast rendering for stressed users

### **Testing Commands**
```bash
# Before every commit
npm run lint              # ESLint + TypeScript
npx tsc --noEmit         # Type checking
npm run build-storybook  # Storybook build test
npm run dev              # Integration test
```

---

## 🚨 Troubleshooting & Optimization

### **Common Issues & Solutions**

#### **Storybook Issues**

**Component not visible**: Check file naming - use `HealthcareButton.stories.ts` in `/src/stories/`

**A11y failures**: Ensure 56px+ touch targets, sufficient contrast, focus indicators:
```tsx
<button 
  className="min-h-[56px] bg-healthcare-primary-light focus:ring-3"
  aria-label="Medizinische Zweitmeinung anfordern"
>
```

**Empty story data**: Mock realistic healthcare data:
```typescript
export const WithMedicalData: Story = {
  args: {
    expert: {
      name: 'Dr. med. Maria Schmidt',
      specialization: 'Kardiologie',
      rating: 4.9
    }
  }
}
```

#### **Integration Issues**

**Hydration mismatch**: Use client-only rendering with loading state:
```tsx
'use client'
export function MedicalTime() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="animate-pulse" />
  return <time>{new Date().toLocaleDateString('de-DE')}</time>
}
```

**Missing Strapi component**: Add to `/src/types/sections.ts`:
```typescript
export type SectionComponentType = 
  | 'sections.healthcare-new-component'
```

### **Performance Optimization**

#### **Bundle Size**
```typescript
// Dynamic imports for large components
const MedicalFileUpload = dynamic(() => import('./MedicalFileUpload'), {
  loading: () => <MedicalLoadingSpinner />,
  ssr: false
})

// Tree-shake icons
import { Heart, Stethoscope } from 'lucide-react'
// Not: import * as Icons from 'lucide-react'
```

#### **Runtime Performance**
```tsx
// Memoize expensive calculations
const MedicalExpertCard = memo(({ expert }) => {
  const rating = useMemo(() => calculateRating(expert.reviews), [expert.reviews])
  return <div className="bg-white rounded-2xl p-6">{/* content */}</div>
})

// Suspense for data loading
<Suspense fallback={<Skeleton />}>
  <MedicalExpertGrid />
</Suspense>
```

#### **API Optimization**
```typescript
// Selective data fetching
const data = await strapiAPI.get('/experts', {
  'fields': 'name,rating,reviewCount',
  'populate[specializations]': 'name,icon',
  'pagination[pageSize]': 10
})

// Appropriate caching
export const revalidate = 3600  // 1 hour for expert data
```

---

## 🏥 Healthcare Platform Context

### **Medical Platform Requirements**

#### **Privacy & GDPR**
- Never log sensitive medical information
- Encrypt patient data at rest and in transmission
- HTTPS only for medical communications  
- 10-year retention for medical data (Germany)
- Explicit consent for all data processing

```typescript
const handleMedicalSubmission = async (data: MedicalInquiry) => {
  logger.info('Medical inquiry submitted', { 
    inquiryId: data.id, 
    timestamp: data.timestamp 
    // Never log: medicalConcern, patientDetails
  })
  
  const response = await fetch('/api/medical-inquiry', {
    method: 'POST',
    body: JSON.stringify(encrypt(data))
  })
}
```

#### **Healthcare User Needs**
- **Visual**: High contrast, screen reader support
- **Motor**: Large touch targets (56px+), voice input
- **Cognitive**: Simple language, clear instructions
- **Stress**: Calm colors, emergency contacts visible
- **Mobile**: Primary device for many healthcare users

### **Medical Specialties**

#### **7 Primary Specialties & FAQ Categories**
- **Kardiologie**: Heart/cardiovascular (red theme)
- **Onkologie**: Cancer treatment (purple theme)
- **Gallenblase**: Gallbladder/biliary (yellow theme)  
- **Nephrologie**: Kidney/renal (blue theme)
- **Schilddrüse**: Thyroid/endocrine (green theme)
- **Intensivmedizin**: Critical care (orange theme)
- **Allgemeine Fragen**: General inquiries (brand color)

```typescript
const getSpecialtyColor = (specialty: string) => {
  const colors = {
    'kardiologie': 'text-red-600',
    'onkologie': 'text-purple-600',
    'gallenblase': 'text-yellow-600',
    'nephrologie': 'text-blue-600',
    'schilddruese': 'text-green-600',
    'intensivmedizin': 'text-orange-600'
  }
  return colors[specialty] || 'text-healthcare-primary'
}
```

#### **Healthcare Section Types**
```typescript
type HealthcareSectionTypes = 
  | 'sections.emergency-banner'
  | 'sections.medical-hero'
  | 'sections.expert-grid'
  | 'sections.medical-faq'
  | 'sections.trust-indicators'
  // ... 50+ additional section types
```

#### **FAQ System**

**Hybrid Categorization Strategy**:
1. **Primary**: Strapi API relations (when configured)
2. **Fallback**: Keyword-based matching (100% coverage)
3. **Cache**: 5-minute TTL for performance
```

**✅ API Endpoints:**
- `getFAQCategories()`: Retrieves 7 medical categories from Strapi
- `getFAQs(limit)`: Fetches FAQ data with category population
- `getFAQsByCategory(slug)`: Category-specific FAQ retrieval
- `groupFAQsByCategory()`: Intelligent categorization engine

**🧠 Intelligent Keyword System:**
```typescript
// Backup categorization via medical keywords
const CATEGORY_KEYWORDS = {
  'zweitmeinung-kardiologie': {
    primary: ['herz', 'herzinfarkt', 'bypass'],
    secondary: ['katheter', 'stent', 'koronararterien'],
    confidence: 0.9
  },
  'zweitmeinung-onkologie': {
    primary: ['krebs', 'tumor', 'chemotherapie'], 
    secondary: ['chemo', 'bestrahlung', 'metastasen'],
    confidence: 0.95
  }
  // ... complete medical keyword mapping for all specialties
}
```

**📊 System Performance (Current Status):**
- **Categories**: 7 medical specialties ✅ LOADED
- **FAQs**: 24 active FAQs ✅ CATEGORIZED  
- **API Health**: Keywords-only (Strapi relations not set)
- **Coverage**: 100% (0 uncategorized FAQs)
- **Confidence**: ~19% average (low due to keyword fallback)
- **Cache Performance**: 5min TTL, auto-cleanup

**🔄 How It Works:**
1. **Primary**: Check if FAQ has `faq.category.slug` from Strapi
2. **Fallback**: Apply keyword matching with confidence scoring
3. **Cache**: Store results for performance (5min TTL)
4. **Display**: Group FAQs by category in `FAQCategoriesGrid`

**💡 Recommendation Status:**
- ⚠️ **Strapi Relations**: Not configured (0% API coverage)
- ✅ **Keyword System**: Excellent fallback coverage (100%)
- 🎯 **Next Steps**: Set up FAQ → Category relations in Strapi CMS for optimal performance

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

## 🤖 AI Assistant Instructions

### **Development Rules (NON-NEGOTIABLE)**

1. **Storybook-First**: Always start in Storybook, create 6+ stories, validate A11y
2. **Healthcare Compliance**: WCAG 2.1 AA mandatory, 56px+ touch targets
3. **Medical Data**: No `any` types, never log sensitive info, provide emergency fallbacks
4. **Healthcare Colors**: Only approved palette (#004166, #1278B3, #B3AF09)

### **Workflow**
```bash
# Before starting
npm run storybook  # Start Storybook first

# Development process
# 1. Create in /src/stories/
# 2. Validate A11y in Storybook
# 3. Add to /src/types/sections.ts if needed
# 4. Test with npm run dev

# Before completing
npm run lint && npx tsc --noEmit
```

### **Error Handling**
```typescript
const handleMedicalError = (error: Error, context: string) => {
  logger.error(`Medical system error`, { 
    error: error.message,
    context,
    timestamp: new Date().toISOString()
    // Never log medical details
  })
  
  return {
    message: 'Ein technischer Fehler ist aufgetreten. Ihre medizinischen Daten sind sicher.',
    emergencyContact: '+49 800 80 44 100'
  }
}
```

### **Key Principles**
- **Fast loading**: Medical users are stressed
- **Mobile-first**: Primary device for many users
- **Professional tone**: Medical-appropriate language
- **Privacy-first**: Never assume medical details
- **Emergency access**: Always provide fallback contacts

**Remember**: Healthcare platform where patient trust and accessibility are paramount.

---

## 🔗 Quick Reference

- **Storybook**: http://localhost:6006 (primary development)
- **Next.js**: http://localhost:3000 (integration testing)
- **Commands**: `npm run storybook`, `npm run dev`, `npm run lint`
- **Colors**: #004166 (primary), #1278B3 (primary-light), #B3AF09 (accent)
- **Touch Targets**: 44px min, 56px recommended, 64px primary CTAs

---

*Version 4.0 - Streamlined | Updated: 2025-08-24*