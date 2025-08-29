# 🏥 Healthcare Website Frontend - Zweitmeinung.ng

> Modern healthcare platform for medical second opinions with intelligent search and expert consultation features.

[![CI](https://github.com/c2s-admin/frontend-zweitmeinu-ng/actions/workflows/ci.yml/badge.svg)](https://github.com/c2s-admin/frontend-zweitmeinu-ng/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-9.1.1-FF4785?style=flat-square&logo=storybook)](https://storybook.js.org/)
[![Bun](https://img.shields.io/badge/Bun-1.1.26-orange?style=flat-square&logo=bun)](https://bun.sh/)
[![Strapi](https://img.shields.io/badge/Strapi-5.20.0-purple?style=flat-square&logo=strapi)](https://strapi.io/)

## 🚀 Live Demo

🔗 **Live Website:** [frontend-zweitmeinu-ng.netlify.app](https://frontend-zweitmeinu-ng.netlify.app)
📚 **Design System:** [Storybook Component Library](http://localhost:6006) (Development)
📱 **Mobile Optimized:** WCAG 2.1 AA healthcare-compliant design
🏥 **Features:** FAQ Search, Medical Experts, Second Opinions

---

## ✨ Key Features

### 🧠 **AI-Powered Functionality**
- **Intelligent FAQ Auto-Complete** with medical terminology and fuzzy search
- **Smart FAQ Categorization** with hybrid API + keyword fallback system
- **Medical Dictionary Integration** with 50+ medical terms and synonyms
- **Advanced Search Algorithms** with highlighting and relevance scoring

### 🏥 **Healthcare Specific**
- **Medical Second Opinion Platform** for expert consultations
- **FAQ System** with 7 specialized medical categories
- **Vote & Feedback System** for FAQ quality assessment
- **Expert Profiles** and consultation booking
- **Medical Terminology Support** in German

### 🎨 **Healthcare Design System**
- **Storybook 9.1.1 Integration** with 25+ healthcare-optimized components
- **WCAG 2.1 AA Compliance** with automated accessibility testing
- **Touch-Optimized Components** (56px+ targets for healthcare users)
- **Medical Color Palette** (#004166, #1278B3, #B3AF09) for trust and professionalism
- **Responsive Mobile-First Design** optimized for all devices
- **Real-time Search Results** with debounced input and live updates
- **Accessibility Features** (ARIA, Screen readers, Keyboard navigation, High contrast)

### 🔧 **Technical Excellence**
- **Next.js 15.4.6** with App Router and server-side rendering
- **TypeScript 5.5.4** for type safety and better developer experience
- **Storybook 9.1.1** for component-driven development
- **Strapi 5.20.0 CMS Integration** for dynamic content management
- **Production-Ready APIs** with rate limiting and caching
- **CI/CD Pipeline** with automated Storybook builds and testing
- **Error Boundaries** and comprehensive error handling

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.6 | React framework with App Router |
| **TypeScript** | 5.5.4 | Type safety and developer experience |
| **Storybook** | 9.1.1 | Component development and design system |
| **Tailwind CSS** | 3.4.10 | Utility-first CSS with healthcare tokens |
| **Bun** | 1.1.26 | Fast package manager and runtime |
| **Strapi** | 5.20.0 | Headless CMS for content management |
| **Lucide React** | 0.536.0 | Modern icon library |
| **React Hook Form** | 7.53.0 | Form handling and validation |

---

## 🚀 Quick Start

### Prerequisites
- **Bun** (>= 1.1.0) - [Install Bun](https://bun.sh/docs/installation)
- **Node.js** (>= 18.0.0) - For development tools
- **Git** - For version control

### 1. Clone Repository
```bash
git clone https://github.com/c2s-admin/frontend-zweitmeinu-ng.git
cd frontend-zweitmeinu-ng
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Setup
```bash
# Base configuration
cp .env.example .env.local

# Redis cache
cp .env.redis.example .env.redis.local

# Logging
cp .env.logging.example .env.logging.local

# Configure your Strapi API endpoint
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance/api

# Redis connection (override host/port as needed)
REDIS_URL=redis://localhost:6379

# Logging preferences
LOG_LEVEL=info
LOG_FORMAT=json

# Contact message rate limiting (optional)
CONTACT_MESSAGES_RATE_LIMIT_WINDOW=60
CONTACT_MESSAGES_RATE_LIMIT_MAX=5
```

The frontend builds image and favicon URLs by replacing the `/api` segment of
`NEXT_PUBLIC_STRAPI_URL` with `/uploads`. Deployed environments must expose
assets under this pattern (e.g. `https://your-strapi-instance/uploads/...`) so
files continue to load correctly.

### 4. Development Servers

#### Start Next.js Development Server
```bash
bun run dev
```

#### Start Storybook Design System
```bash
# Start in parallel with Next.js or separately
bun run storybook
```

🎉 **Success!** Open:
- **Website:** [http://localhost:3000](http://localhost:3000) 
- **Storybook:** [http://localhost:6006](http://localhost:6006)

---

## 📂 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes
│   │   └── faq/            # FAQ endpoints (autocomplete, voting)
│   ├── faq/                # FAQ page
│   ├── globals.css         # Global styles with healthcare tokens
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── admin/              # Admin dashboard components
│   ├── faq/                # FAQ-specific components
│   ├── layout/             # Header, Footer, Navigation
│   └── sections/           # Page sections (58+ dynamic components)
├── stories/                # Storybook healthcare components
│   ├── Button.tsx          # Healthcare button component
│   ├── Button.stories.ts   # Button story definitions
│   ├── Button.css          # Healthcare button styles
│   └── Welcome.mdx         # Design system welcome page
├── lib/                    # Utility libraries
│   ├── services/           # Frontend services
│   ├── strapi/             # Strapi API integration
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
│   ├── strapi.ts           # Expected Strapi types
│   ├── strapi-real.ts      # Real API response types
│   └── sections.ts         # Component type definitions
└── hooks/                  # Custom React hooks
```

---

## 🧱 Architecture Overview

High-level system diagrams are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) to help new contributors understand the flow between the frontend, backend, cache, and logging services.

---

## 🔌 API Endpoints

### FAQ Auto-Complete
```bash
GET /api/faq/autocomplete?q=heart&limit=10
```
**Features:**
- Medical term suggestions with synonyms
- FAQ question matching
- Popular search recommendations
- Fuzzy search with highlighting
- Rate limiting (50 req/10s)
- Response caching (5min TTL)

### FAQ Voting
```bash
POST /api/faq/vote
{
  "faqId": 123,
  "isHelpful": true,
  "sessionId": "optional"
}
```
**Features:**
- Optimistic UI updates
- Rate limiting (10 votes/min)
- Local storage persistence
- Analytics tracking

### Contact Messages
```bash
POST /api/contact-messages
```
**Features:**
- hCaptcha verification (when configured)
- Rate limiting (5 messages/min, configurable via `CONTACT_MESSAGES_RATE_LIMIT_MAX` and `CONTACT_MESSAGES_RATE_LIMIT_WINDOW`)

---

## 🎨 Healthcare Design System

### Storybook Component Library
**🔗 Access:** [http://localhost:6006](http://localhost:6006) (Development)

The design system is built with **WCAG 2.1 AA compliance** and optimized for healthcare users.

### Color Palette
```css
/* Healthcare Primary Colors - Medical Trust */
--healthcare-primary: #004166;           /* Headlines, navigation */
--healthcare-primary-light: #1278B3;     /* CTAs, links, accents */
--healthcare-accent-green: #B3AF09;      /* Success, highlights */

/* Background Colors */
--healthcare-light: #ffffff;             /* Standard backgrounds */
--healthcare-background: #f8fafc;        /* Subtle sections */

/* Legacy Support (maintained for compatibility) */
--healthcare-primary-dark: #002d4a;
--healthcare-text: #2d3748;
--healthcare-text-muted: #718096;
```

### Typography
- **Font Family:** Roboto Condensed (300,400,500,700) via Google Fonts
- **Purpose:** Healthcare-optimized readability and trust
- **Usage:** Automatic via Tailwind CSS configuration

### Component Standards
- **Touch Targets:** 44px minimum (WCAG), 56px standard, 64px primary CTAs
- **Focus Indicators:** 3px solid outline with 2px offset
- **Accessibility:** Full ARIA support, screen reader optimized
- **Animations:** Respects `prefers-reduced-motion` preferences

### Healthcare Components (Storybook)
- **HealthcareButton** - WCAG 2.1 AA compliant with multiple sizes
- **Accessibility Testing** - Built-in A11y validation
- **Interactive Documentation** - Live component playground
- **25+ Components Planned** - Phase 2-4 roadmap available

---

## 🏗️ Development

### Available Scripts
```bash
# Development
bun run dev                 # Start Next.js development server
bun run storybook          # Start Storybook component library

# Production
bun run build              # Build Next.js for production  
bun run build-storybook    # Build Storybook static site
bun run start              # Start production server

# Code Quality
bun run lint               # Run TypeScript + ESLint
bun run format             # Format code with Biome
bun run type-check         # TypeScript type checking

# Testing
bun run test              # Run all tests
```

### Storybook & Analysis
- Storybook build (local): `npm run build-storybook` → outputs `storybook-static/`.
- CI‑freundlicher Build: `npm run storybook:ci` (deaktiviert schwere Addons). Optional: `STORYBOOK_DOCS=false` schaltet Docs-Addon aus.
- Bundle‑Report (Storybook): `npm run storybook:analyze` → erzeugt `storybook-static/sb-bundle-report.html` und `sb-stats.json`.
- Bundle‑Report (App): `ANALYZE=true npm run build` → öffne `.next/healthcare-bundle-report.html`.
- Optionales Chunk‑Experiment: `HEALTHCARE_CHUNKING=true ANALYZE=true npm run build` (standardmäßig aus; nur für Messungen nutzen).

### Code Quality & Testing
- **ESLint** - Code linting with Next.js rules
- **Biome** - Fast code formatting and linting  
- **TypeScript** - Strict type checking
- **Storybook A11y** - Automated accessibility testing (WCAG 2.1 AA)
- **Husky** - Git hooks for pre-commit checks
- **CI/CD** - Automated builds and Storybook deployment

### Testing
```bash
bun run test                    # Run all tests
node test-autocomplete.js       # Test auto-complete API
node test-categories.js         # Test FAQ categorization
```

---

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build command
bun run build

# Output directory
out

# Environment variables
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance/api
```

Uploads and favicons are resolved from the same origin by replacing `/api` with
`/uploads` on `NEXT_PUBLIC_STRAPI_URL`. Ensure your hosting setup forwards
`/uploads/*` to the Strapi server so these assets load in production.

### Vercel
```bash
# Auto-deployment on push to main branch
# Configure environment variables in Vercel dashboard
```

### Manual Deployment
```bash
bun run build
bun run start
```

---

## 🔔 Error Tracking (Sentry)

- Initialisierung erfolgt über `sentry.client.config.ts` (Client) und `sentry.server.config.ts` (Server). PII‑Scrubbing ist aktiv.
- Serverseitig Sentry importieren via `@/lib/sentry.server` (z. B. in API/Strapi‑Clients). Für UI‑Grenzen `HealthcareErrorBoundary` aus `@/lib/sentry` verwenden.
- Release‑Versionen können über `NEXT_PUBLIC_APP_VERSION`/`APP_VERSION` gesetzt werden.


## 📊 Features Deep Dive

### 🔍 Intelligent FAQ Search
- **Auto-Complete:** Real-time suggestions with medical terms
- **Fuzzy Matching:** Finds results even with typos
- **Category Filtering:** Search within specific medical specialties
- **Highlighting:** Visual emphasis on matching terms
- **Analytics:** Search pattern tracking for optimization

### 🏥 Medical Categories
1. **Kardiologie** - Heart and cardiovascular medicine
2. **Onkologie** - Cancer treatment and therapy
3. **Gallenblase** - Gallbladder procedures
4. **Nephrologie** - Kidney and dialysis medicine
5. **Schilddrüse** - Thyroid conditions
6. **Intensivmedizin** - Critical care medicine
7. **Allgemeine Fragen** - General medical inquiries

### 📱 Responsive Design
- **Mobile-First:** Optimized for smartphones and tablets
- **Touch-Friendly:** Large tap targets and gestures
- **Performance:** Optimized images and lazy loading
- **Accessibility:** WCAG 2.1 AA compliance

### 🔒 Security & Performance
- **Rate Limiting:** API protection against abuse
- **Error Boundaries:** Graceful error handling
- **HTTPS:** Secure data transmission
- **Caching:** Optimized performance with smart caching
- **SEO:** Server-side rendering and meta optimization

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Follow existing code style and conventions
- Add TypeScript types for all new code
- Include tests for new functionality
- Update documentation for API changes
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Generated with [Same](https://same.new)** - AI-powered development platform

- 🤖 **AI Development:** Same Platform
- 🎨 **Design System:** Custom Healthcare theme
- 🏥 **Medical Expertise:** Healthcare domain knowledge
- 💻 **Technology:** Modern web development stack

---

## 📞 Support

- 📧 **Email:** kontakt@zweitmeinung.ng
- 📱 **Phone:** +49 800 80 44 100
- 🌐 **Website:** [zweitmeinung.ng](https://zweitmeinung.ng)
- 💬 **Support:** Available 24/7 for medical emergencies

---

## 🔗 Links

- 🚀 **Live Demo:** [frontend-zweitmeinu-ng.netlify.app](https://frontend-zweitmeinu-ng.netlify.app)
- 📚 **Documentation:** [Same Docs](https://docs.same.new)
- 🎯 **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- 🎨 **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- 📝 **Strapi CMS:** [strapi.io](https://strapi.io)

---

<div align="center">
  <p><strong>Built with ❤️ for better healthcare</strong></p>
  <p>Empowering patients with expert medical second opinions</p>
</div>
