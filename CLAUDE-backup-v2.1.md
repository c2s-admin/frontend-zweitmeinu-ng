# CLAUDE.md - AI Assistant Development Guide

This document serves as the **constitution for AI assistants** working on the zweitmeinung.ng platform, providing project-specific context and best practices for resilient, stable, and efficient code.

## 🛠️ Tech Stack (2025 Optimized)

| Technology | Version | Purpose | AI Best Practices |
|------------|---------|---------|-------------------|
| **Next.js** | 15.4.5 | React framework with App Router | Use Server Components by default, Client Components only when needed |
| **TypeScript** | 5.5.4 | Type safety and developer experience | Strict mode enabled, use proper type definitions |
| **Tailwind CSS** | 3.4.10 | Utility-first CSS framework | JIT compiler enabled, tree-shaking configured |
| **Bun** | 1.1.26 | Fast package manager and runtime | Prefer bun over npm for speed |
| **Strapi** | 5.20.0 | Headless CMS for content management | Always use populate parameters, handle data conversion |
| **Lucide React** | 0.536.0 | Modern icon library | Import icons individually for tree-shaking |
| **React Hook Form** | 7.53.0 | Form handling and validation | Use with TypeScript schemas |

## 📁 Project Architecture

```
src/
├── app/                    # Next.js App Router (file-system routing)
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── [slug]/            # Dynamic pages from Strapi
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── sections/          # Page section components (58+ types)
│   ├── layout/            # Header, Footer, Navigation
│   └── ui/                # Base UI components
├── lib/                   # Core utilities and API clients
│   ├── strapi/            # Strapi API integration
│   ├── utils.ts           # Utility functions
│   └── medical-dictionary.ts
├── types/                 # TypeScript definitions
│   ├── strapi.ts          # Expected Strapi types
│   ├── strapi-real.ts     # Real API response types
│   └── sections.ts        # Component type definitions
└── hooks/                 # Custom React hooks
```

## 🚀 Essential Commands

| Command | Purpose | Notes |
|---------|---------|-------|
| `bun run dev` | Start development server | Uses Turbopack for faster builds |
| `bun run build` | Production build | Tree-shakes unused code |
| `bun run lint` | TypeScript + ESLint check | **Always run before commits** |
| `bun run typecheck` | TypeScript compilation | Use `bunx tsc --noEmit` if bun unavailable |
| `bun test` | Run unit tests | Located in `src/__tests__/` |

## 💡 Code Standards & Best Practices

### TypeScript
- **Strict mode enabled** - No implicit any, proper null checks
- **Use proper interfaces** - Define types for all Strapi responses
- **Component Props** - Always type component props explicitly
- **API Responses** - Use conversion functions for data structure mismatches

### React/Next.js Patterns
- **Server Components by default** - Use `"use client"` only when necessary
- **Dynamic imports** - For code splitting and performance
- **Error boundaries** - Implement proper error handling
- **Suspense** - Use for loading states

### Styling (Tailwind CSS)
- **Utility-first approach** - Avoid custom CSS when possible
- **Responsive design** - Mobile-first with `md:`, `lg:` breakpoints
- **Design system** - Use healthcare color variables: `healthcare-primary`, `healthcare-accent-green`
- **Performance** - JIT compiler removes unused styles automatically

### Strapi Integration
- **Always use populate** - Include `'sections.image'` for image data
- **Data conversion** - Use `strapi-real.ts` converters for API mismatches
- **Error handling** - Implement fallbacks for missing data
- **Caching** - Leverage Next.js caching for API responses

## 🔧 Development Workflow

### 1. Before Starting
- **Read existing components** - Understand patterns before creating new ones
- **Check types** - Verify data structures in `types/` directory
- **Review similar implementations** - Look at existing sections for patterns

### 2. Development Process
- **TypeScript first** - Define interfaces before implementation
- **Component isolation** - Each component should be self-contained
- **Error handling** - Always implement fallbacks and error states
- **Performance** - Use dynamic imports for large components

### 3. Testing & Quality
- **Type check**: `bunx tsc --noEmit` - Must pass without errors
- **Linting**: `bun run lint` - Fix all warnings and errors
- **Manual testing** - Test in browser before finishing
- **Server stability** - Restart dev server every 2-3 hours for stability

## 🚨 Common Issues & Solutions

### Hydration Mismatches
**Problem**: Server/client rendering differences (dates, random values)
**Solution**: Use client-only rendering with `mounted` state pattern
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
return mounted ? <TimeDependent /> : <Placeholder />;
```

### Image Loading Issues
**Problem**: Strapi images not displaying
**Solution**: 
1. Check populate parameters include `'sections.image'`
2. Verify data structure conversion in `strapi-real.ts`
3. Ensure Next.js `remotePatterns` includes Strapi domain

### TypeScript Errors with Dynamic Imports
**Problem**: Component types not recognized in section registry
**Solution**: Add component types to `SectionComponentType` union in `types/sections.ts`

### Server Crashes
**Problem**: HTTP 500 errors or server instability
**Solution**: 
1. Check TypeScript compilation: `bunx tsc --noEmit`
2. Restart server: `pkill -f "next dev" && bun run dev`
3. Clear caches if needed

## 🎯 Performance Optimization

### Bundle Size
- **Dynamic imports** for large components
- **Tree-shaking** enabled for Tailwind and icons
- **Image optimization** with Next.js Image component
- **Code splitting** at component level

### Runtime Performance
- **Server Components** for static content
- **Suspense boundaries** for loading states
- **Memoization** for expensive calculations
- **Lazy loading** for non-critical content

### Strapi API Optimization
- **Selective population** - Only fetch needed data
- **Response caching** - Use Next.js built-in caching
- **Error boundaries** - Graceful degradation for API failures

## 🏥 Domain-Specific Context

### Medical Platform Requirements
- **Patient privacy** - No logging of sensitive data
- **Accessibility** - WCAG 2.1 AA compliance
- **Trust indicators** - Clear attribution, credentials
- **Professional tone** - Healthcare-appropriate language

### Content Types
- **58+ section components** - Reusable page building blocks
- **7 medical specialties** - Cardiology, Oncology, etc.
- **Multi-site architecture** - complex care solutions + zweitmeinung.ng
- **FAQ categorization** - AI-powered + keyword matching

## 📋 Current Implementation Status

### ✅ Completed Features
- **Motivation page** - 8 sections with custom components
- **Image display system** - Strapi media integration
- **TypeScript conversion** - Real API → Expected format
- **Component registry** - Dynamic section loading
- **FAQ system** - Intelligent categorization

### 🔄 Active Development Areas
- Performance optimization
- Mobile responsiveness
- Accessibility improvements
- Content management workflows

---

## 🤖 AI Assistant Instructions

When working on this project:

1. **Always check existing patterns** before creating new implementations
2. **Use TypeScript strictly** - No shortcuts or any types
3. **Follow healthcare design system** - Use established colors and patterns
4. **Test thoroughly** - Both functionality and TypeScript compilation
5. **Document significant changes** - Update this file for future assistants
6. **Performance-first** - Consider bundle size and runtime performance
7. **Error resilience** - Always implement proper fallbacks

**Remember**: This is a medical platform where reliability and user trust are paramount.

## 🎨 Design System & UI Guidelines

### 🛡️ Healthcare Color Palette (IMMUTABLE)
**Primary Colors** (Already implemented in Tailwind config):
```tsx
// Use these Tailwind classes - do NOT deviate
'healthcare-primary-light': '#1278B3'  // CTAs, links, accents
'healthcare-primary': '#004166'        // Headlines, navigation  
'healthcare-accent-green': '#B3AF09'   // Success, highlights, secondary CTAs
```

**Implementation Pattern:**
```tsx
// Correct usage
<button className="bg-healthcare-primary-light hover:bg-healthcare-accent-hover">
<h1 className="text-healthcare-primary">
<span className="text-healthcare-accent-green">
```

### 📝 Typography (Already Configured)
**Font Stack:** Roboto Condensed (300,400,500,700) via Google Fonts
**Usage:** Automatic via Tailwind - no additional config needed

### 🏗️ Component Design Patterns

#### Healthcare-Specific Requirements
1. **Minimalist & Clean** - Ample whitespace, clear hierarchy
2. **Trust-Building** - Subtle shadows, rounded corners (min 8px)
3. **Stress-Reducing** - Soft animations, calming gradients
4. **Touch-Optimized** - Min 56px touch targets for healthcare users

#### Essential UI Elements
```tsx
// Emergency/Critical Elements - Always visible
<div className="fixed top-0 w-full bg-red-500 text-white z-50">
  Notfall: +49 800 80 44 100
</div>

// Healthcare Cards - Soft, trustworthy
<div className="bg-white rounded-2xl p-6 shadow-healthcare">
  
// CTAs - Clear hierarchy
<button className="bg-healthcare-primary-light hover:bg-healthcare-accent-hover 
                   text-white px-8 py-4 rounded-xl transition-all">
  
// Status Badges - Medical contexts
<span className="bg-healthcare-accent-green/10 text-healthcare-primary 
                 px-3 py-1 rounded-full text-sm font-medium">
```

### ♿ Accessibility (WCAG 2.1 AA - MANDATORY)

**Critical Requirements:**
- **Contrast Ratio:** Min 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators:** 3px solid outline with 2px offset
- **Touch Targets:** Min 44px (prefer 56px for healthcare)
- **ARIA Labels:** Required for all interactive elements

```tsx
// Accessibility Implementation Examples
<button 
  className="focus:outline-none focus:ring-3 focus:ring-healthcare-primary-light focus:ring-offset-2"
  aria-label="Jetzt Zweitmeinung anfordern"
>

<nav aria-label="Hauptnavigation">
<section aria-labelledby="services-heading">
<div role="status" aria-live="polite">
```

### 📱 Responsive Patterns (Mobile-First)

**Breakpoints:** `sm:640px` `lg:1024px` `xl:1280px`

```tsx
// Mobile-first responsive patterns
<div className="p-4 sm:p-6 lg:p-8">           // Progressive spacing
<h1 className="text-2xl sm:text-3xl lg:text-4xl"> // Responsive typography  
<div className="grid grid-cols-1 lg:grid-cols-2">  // Responsive layouts

// Mobile navigation
<div className="lg:hidden fixed inset-0 bg-white transform transition-transform">
```

### 🚨 Healthcare UX Principles

1. **Emergency Access** - Notfall-Kontakte always visible
2. **Trust Indicators** - Certificates, qualifications prominent  
3. **Privacy First** - No sensitive data logging
4. **Stress Reduction** - Calming colors, soft animations
5. **Clear Communication** - Medical terms explained
6. **Professional Tone** - Appropriate for healthcare context

### ⚡ Performance & Technical

**Loading States:**
```tsx
// Skeleton loading for healthcare content
<div className="animate-pulse bg-healthcare-background rounded-lg h-4 w-3/4">

// Success feedback with healthcare styling  
<div className="bg-healthcare-accent-green/10 border border-healthcare-accent-green 
                rounded-xl p-4 animate-slide-in-top">
```

**Image Optimization:**
```tsx
<Image 
  src="/medical-consultation.jpg"
  alt="Ärztin im Beratungsgespräch mit Patient" // Descriptive German alt-text
  width={800} height={600}
  className="rounded-2xl" // Consistent rounding
  loading="lazy" 
  quality={85}
/>
```

### 🔒 Critical Don'ts for Healthcare

- ❌ **Never** use colors outside the defined palette
- ❌ **Never** use fonts other than Roboto Condensed
- ❌ **Never** create touch targets smaller than 44px
- ❌ **Never** omit ARIA labels on interactive elements
- ❌ **Never** use harsh animations or stress-inducing elements
- ❌ **Never** compromise on contrast ratios
- ❌ **Never** hide emergency contact information

---
*Last updated: 2025-08-04 | Version: 2.1 - Enhanced with Design System*

## Recent Work Summary

### ✅ Motivation Page Implementation (2025-08-04)

**Objective:** Implement the `/motivation` page with custom sections based on design screenshots.

#### Components Created
1. **MotivationHero.tsx** - Hero section with blue gradient background
2. **StorySection.tsx** - Image-text alternating layout with quotes  
3. **CoreValues.tsx** - 4-column icon grid with healthcare values
4. **MissionStatement.tsx** - Centered quote box with team attribution

#### Technical Fixes Applied

##### 1. TypeScript Type Definitions
**Issue:** Dynamic imports failing due to missing component types
**Fix:** Added motivation page component types to `SectionComponentType` union in `/src/types/sections.ts`
```typescript
| 'sections.hero-section'
| 'sections.story-section' 
| 'sections.core-values'
| 'sections.mission-statement'
```

##### 2. Image Display Problems
**Root Cause:** Two critical issues preventing image rendering

**Issue A - Missing Strapi Populate Parameter:**
- **File:** `/src/lib/strapi/pages.ts`  
- **Problem:** API calls weren't fetching image data for story sections
- **Fix:** Added `'sections.image'` to populate parameters

**Issue B - Data Structure Mismatch:**
- **Problem:** StorySection component expected `image.data.attributes.url` but API returned `image.url`
- **Fix:** Created data structure converter in `/src/types/strapi-real.ts` that transforms:
  ```typescript
  // API Response
  image: { id: 160, url: "/uploads/file.jpg" }
  
  // Converted to Expected Format  
  image: { data: { attributes: { url: "https://st.zh3.de/uploads/file.jpg" } } }
  ```

##### 3. React Hydration Mismatch
**Issue:** Server/client time differences in Header opening hours display
**Fix:** Implemented client-only rendering pattern with `mounted` state to prevent SSR/client mismatches

#### Results
- ✅ **Motivation page fully functional** at `/motivation`
- ✅ **All 8 sections render correctly:**
  - 1x Hero Section (blue gradient)
  - 5x Story Sections (alternating image layouts)
  - 1x Core Values (4-column icon grid)
  - 1x Mission Statement (quote box)
- ✅ **Image display working** for all 5 story sections:
  - Martin Porwoll portrait in "Gründer" section
  - Adobe Stock images in other sections
- ✅ **TypeScript compilation successful**
- ✅ **No hydration errors**

#### Page Content Structure
The motivation page tells the story of zweitmeinung.ng founder Martin Porwoll, from whistleblowing the Bottrop pharmaceutical scandal to founding the patient advocacy platform.

**Story Sections:**
1. "Unser Fokus" - Company approach and expertise network
2. "Motivation und Geschichte" - Foundation story context  
3. "Gründer und Geschäftsführer" - Martin Porwoll introduction with quote
4. "Der Zytoskandal Bottrop" - The pharmaceutical scandal details
5. "Martin Porwolls Weg" - Transformation to patient advocate

## Commands Reference

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # TypeScript + ESLint check
```

### Common Issues & Solutions

#### 1. Images Not Loading
- Check Strapi populate parameters include `'sections.image'`
- Verify data structure conversion in `strapi-real.ts`
- Ensure Next.js `next.config.js` allows Strapi domain in `remotePatterns`

#### 2. Hydration Mismatches  
- Use client-only rendering for time-dependent content
- Implement `mounted` state pattern for SSR differences

#### 3. TypeScript Errors
- Ensure all component types are included in `SectionComponentType` union
- Verify data structure interfaces match actual API responses

## Project Structure Notes

### Key Directories
- `/src/components/sections/` - Page section components
- `/src/lib/strapi/` - Strapi API integration  
- `/src/types/` - TypeScript definitions
- `/docs/` - Project documentation

### Strapi Integration
- **API Base:** `https://st.zh3.de/api`
- **Media:** `https://st.zh3.de/uploads/`
- **Site Config:** Multi-site setup for `zweitmeinu-ng`
- **Page Structure:** Dynamic sections with 58+ component types

---
*Last updated: 2025-08-04*