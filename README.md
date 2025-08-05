# 🏥 Healthcare Website Frontend - Zweitmeinung.ng

> Modern healthcare platform for medical second opinions with intelligent search and expert consultation features.

[![CI](https://github.com/c2s-admin/frontend-zweitmeinu-ng/actions/workflows/ci.yml/badge.svg)](https://github.com/c2s-admin/frontend-zweitmeinu-ng/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.1.26-orange?style=flat-square&logo=bun)](https://bun.sh/)
[![Strapi](https://img.shields.io/badge/Strapi-5.x-purple?style=flat-square&logo=strapi)](https://strapi.io/)

## 🚀 Live Demo

🔗 **Live Website:** [frontend-zweitmeinu-ng.netlify.app](https://frontend-zweitmeinu-ng.netlify.app)
📱 **Mobile Optimized:** Fully responsive design
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

### 🎨 **Modern User Experience**
- **Custom Healthcare Design System** with professional medical styling
- **Responsive Mobile-First Design** optimized for all devices
- **Real-time Search Results** with debounced input and live updates
- **Optimistic UI Updates** for instant user feedback
- **Accessibility Features** (ARIA, Screen readers, Keyboard navigation)

### 🔧 **Technical Excellence**
- **Next.js 15 App Router** with server-side rendering
- **TypeScript** for type safety and better developer experience
- **Strapi CMS Integration** for dynamic content management
- **Production-Ready APIs** with rate limiting and caching
- **Error Boundaries** and comprehensive error handling

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.2 | React framework with App Router |
| **TypeScript** | 5.8.3 | Type safety and developer experience |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Bun** | 1.1.26 | Fast package manager and runtime |
| **Strapi** | 5.x | Headless CMS for content management |
| **Lucide React** | 0.536.0 | Modern icon library |
| **React Hook Form** | 7.62.0 | Form handling and validation |

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

# hCaptcha configuration (optional)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret
```

The frontend builds image and favicon URLs by replacing the `/api` segment of
`NEXT_PUBLIC_STRAPI_URL` with `/uploads`. Deployed environments must expose
assets under this pattern (e.g. `https://your-strapi-instance/uploads/...`) so
files continue to load correctly.

### 4. Development Server
```bash
bun run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) to see the website.

---

## 📂 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes
│   │   └── faq/            # FAQ endpoints (autocomplete, voting)
│   ├── faq/                # FAQ page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── admin/              # Admin dashboard components
│   ├── faq/                # FAQ-specific components
│   ├── layout/             # Header, Footer, Navigation
│   └── sections/           # Page sections
├── lib/                    # Utility libraries
│   ├── services/           # Frontend services
│   ├── strapi/             # Strapi API integration
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
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
- Rate limiting (5 messages/hour)

---

## 🎨 Design System

### Color Palette
```css
/* Healthcare Primary Colors */
--healthcare-primary: #004166;
--healthcare-primary-light: #0066a3;
--healthcare-primary-dark: #002d4a;

/* Accent Colors */
--healthcare-accent-green: #00a86b;
--healthcare-accent-hover: #008c59;

/* Text Colors */
--healthcare-text: #2d3748;
--healthcare-text-muted: #718096;
```

### Typography
- **Font Family:** Inter (System font fallbacks)
- **Headings:** Bold, healthcare-primary color
- **Body Text:** Regular, healthcare-text color
- **Responsive:** Fluid typography scales

### Components
- **Buttons:** Multiple variants (primary, secondary, outline)
- **Cards:** Elevation shadows with hover effects
- **Forms:** Validation states and error handling
- **Icons:** Lucide React with consistent sizing

---

## 🏗️ Development

### Available Scripts
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run format       # Format code with Biome
bun run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint** - Code linting with Next.js rules
- **Biome** - Fast code formatting and linting
- **TypeScript** - Strict type checking
- **Husky** - Git hooks for pre-commit checks

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
