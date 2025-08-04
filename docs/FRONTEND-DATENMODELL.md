# Frontend Datenmodell - Strapi v5 TypeScript Project

> **Project Context**: Healthcare Multi-Site Platform with TypeScript-only codebase
> **Strapi Version**: v5.20.0
> **Database**: PostgreSQL (strapi_production)
> **Language**: TypeScript ONLY - No JavaScript files allowed in production

## 🎯 Quick Reference

### Core Architecture
- **13 Collection Types** (No Single Types)
- **Multi-Site Architecture** via `site-configuration` hub
- **90+ Dynamic Zone Components** for flexible page building
- **TypeScript Interfaces** for all data structures

### Essential Commands
```bash
# Generate TypeScript types
npm run ts:generate-types

# Validate TypeScript compliance
find ./src -name "*.js" | wc -l  # Should return 0

# Build with memory optimization
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

## 🏗️ System Overview

Das Strapi-Backend verwendet **13 Collection Types** und **keine Single Types**. Alle Daten sind in Collection Types organisiert, wobei `site-configuration` als zentraler Hub fungiert.

> **✅ System Status**: Strapi v5.20.0 läuft stabil mit PostgreSQL-Datenbank. Database Configuration und Schema Registry wurden erfolgreich behoben (August 2025).

> **⚠️ Wichtiger Hinweis**: Das Appointment-System wurde entfernt. Alle neuen Features MÜSSEN in TypeScript implementiert werden.

## Content Types nach Kategorie

### 1. Content Management (3 Types)

#### 📄 Pages (`api::page.page`)
Flexible Seitenstruktur mit Dynamic Zones für verschiedene Layouts.

**Felder:**
- `title`: string (required)
- `slug`: uid (unique, required)
- `isSharedContent`: boolean (default: false)
- `sections`: dynamiczone mit 50 Section-Komponenten
- `seo`: component (shared.seo)

**Relationen:**
- `sites`: many-to-many → site-configuration

**Section-Komponenten (58 total):**

**Hero-Sections (3):**
- `sections.hero` - Basis Hero-Section
- `sections.hero-healthcare` - Healthcare-spezifischer Hero
- `sections.hero-carousel` - Erweiterte Hero-Carousel mit mehreren Slides

**Basis-Sections (10):**
- `sections.text-block`
- `sections.cta-banner`
- `sections.services-grid`
- `sections.healthcare-products` (Komponente existiert noch, aber ohne eigenen Content Type)
- `sections.team-grid`
- `sections.testimonials`
- `sections.expert-grid`
- `sections.faq`
- `sections.contact-form`
- `sections.blog-list`
- `sections.faq-reference`

**Erweiterte Sections (13):**
- `sections.how-it-works`
- `sections.why-choose-us`
- `sections.news`
- `sections.contact-info`
- `sections.faq-accordion-enhanced` - **Erweiterte FAQ-Accordion mit Relation-System**
- `sections.timeline`
- `sections.stats`
- `sections.video-hero`
- `sections.gallery`
- `sections.contact-form-split`
- `sections.contact-methods`
- `sections.business-hours`
- `sections.news-hero`
- `sections.newsletter-subscription`

**News Page Sections (3):**
- `sections.news-filter`
- `sections.news-highlights`
- `sections.news-grid-enhanced`

**FAQ Page Sections (5):**
- `sections.faq-hero`
- `sections.faq-categories`
- `sections.faq-accordion-enhanced`
- `sections.faq-cta`
- `sections.faq-search-results`

**Company/About Sections (10):**
- `sections.core-values`
- `sections.mission-statement`
- `sections.company-focus`
- `sections.story-section`
- `sections.founder-story`
- `sections.company-timeline`
- `sections.belief-statement`
- `sections.expertise-showcase`
- `sections.certification-highlights`
- `sections.mission-cta-enhanced`

**How It Works Sections (5):**
- `sections.process-steps-detailed`
- `sections.service-tiers-timeline`
- `sections.benefits-comparison`
- `sections.why-choose-cards`
- `sections.process-cta`

**Specialties Sections (4):**
- `sections.medical-specialties-grid`
- `sections.specialties-development`
- `sections.specialty-detail-hero`
- `sections.specialty-features`

---

#### 📰 News Items (`api::news-item.news-item`)
Nachrichten und Ankündigungen mit Ablaufdatum.

**Felder:**
- `title`: string (required)
- `slug`: uid (unique, required)
- `summary`: text
- `content`: richtext
- `featuredImage`: media (single image)
- `newsType`: enum ['news', 'announcement', 'update', 'alert']
- `priority`: enum ['low', 'medium', 'high']
- `publishDate`: datetime
- `expiryDate`: datetime
- `tags`: json (array of strings)
- `attachments`: media (multiple files)

**Komponenten:**
- `author`: component (blog.author)
- `seo`: component (shared.seo)

**Relationen:**
- `sites`: many-to-many → site-configuration
- `relatedServices`: many-to-many → service

---

#### 📝 Blog Posts (`api::blog-post.blog-post`)
Blog-Artikel mit Kategorisierung.

**Felder:**
- `title`: string (required)
- `slug`: uid (unique, required)
- `excerpt`: text
- `content`: richtext
- `featuredImage`: media (single image)
- `publishedAt`: datetime
- `readingTime`: integer
- `featured`: boolean
- `tags`: json (array of strings)

**Komponenten:**
- `author`: component (blog.author)
- `seo`: component (shared.seo)

**Relationen:**
- `category`: many-to-one → blog-category
- `sites`: many-to-many → site-configuration
- `relatedPosts`: many-to-many → blog-post (self-reference)

---

### 2. Healthcare & Services (2 Types)

#### 👨‍⚕️ Experts (`api::expert.expert`)
Medizinische Experten mit Qualifikationen.

**Felder:**
- `expertId`: uuid (unique, auto-generated)
- `firstName`: string (required)
- `lastName`: string (required)
- `slug`: uid (unique, required)
- `title`: string
- `specialties`: json (array of strings)
- `bio`: richtext
- `image`: media (single image)
- `contactInfo`: json (email, phone, etc.)
- `isActive`: boolean (default: true)
- `order`: integer

**Komponenten:**
- `qualifications`: component (repeatable, expert.qualification)
- `availability`: component (expert.availability)
- `seo`: component (shared.seo)

**Relationen:**
- `services`: many-to-many → service
- `sites`: many-to-many → site-configuration

---

#### 🏥 Services (`api::service.service`)
Medizinische Dienstleistungen und KI-gestützte Healthcare-Produkte (vereint).

**Felder:**
- `name`: string (required)
- `slug`: uid (unique, required)
- `description`: richtext (required)
- `shortDescription`: text (max: 300 Zeichen)
- `subtitle`: string (max: 150 Zeichen)
- `icon`: string (default: 'Activity')
- `iconImage`: media (single image)
- `featuredImage`: media (single image)
- `gallery`: media (multiple images/videos)
- `duration`: string
- `category`: enum ['diagnostic', 'therapeutic', 'preventive', 'surgical', 'emergency', 'consultation', 'chat', 'agent', 'vision', 'speech', 'therapy', 'connect'] (required)
- `medicalCategory`: enum ['diagnostik', 'pflege', 'therapie', 'notfall', 'beratung', 'zweitmeinung']
- `productType`: enum ['service', 'product'] (default: 'service')
- `aiPowered`: boolean (default: true)
- `hasVideo`: boolean (default: false)
- `videoUrl`: string
- `link`: string
- `color`: string (default: CSS-Klassen)
- `textColor`: string (default: 'text-white')
- `gradient`: string (default: CSS-Klassen)
- `isNew`: boolean (default: false)
- `isFeatured`: boolean (default: false)
- `isActive`: boolean (default: true)
- `order`: integer (default: 0)
- `priority`: integer (default: 0)
- `technicalSpecs`: json

**Komponenten:**
- `pricing`: component (service.pricing)
- `features`: component (repeatable, service.feature)
- `complianceInfo`: component (healthcare.compliance)
- `seo`: component (shared.seo)

**Relationen:**
- `experts`: many-to-many → expert
- `sites`: many-to-many → site-configuration

---

### 3. Support & FAQ (4 Types)

#### ❓ FAQs (`api::faq.faq`)
Häufig gestellte Fragen mit Analytics.

**Felder:**
- `question`: string (required)
- `slug`: uid (unique, required)
- `answer`: richtext (required)
- `shortAnswer`: text
- `order`: integer
- `isPinned`: boolean
- `isActive`: boolean (default: true)
- **Analytics:**
  - `viewCount`: integer (default: 0)
  - `helpfulCount`: integer (default: 0)
  - `notHelpfulCount`: integer (default: 0)
- **Medien:**
  - `attachments`: media (multiple)
  - `videoUrl`: string
- **Meta:**
  - `tags`: json (array)
  - `searchKeywords`: text

**Relationen:**
- `category`: many-to-one → faq-category
- `relatedFaqs`: many-to-many → faq (self-reference)
- `relatedServices`: many-to-many → service
- `relatedExperts`: many-to-many → expert
- `sites`: many-to-many → site-configuration

> **💡 Wichtig für Frontend:** FAQs können über das neue FAQ Accordion Enhanced System dynamisch in Pages eingebunden werden. Siehe Abschnitt "FAQ Relation System" für Details.

---

#### 📁 FAQ Categories (`api::faq-category.faq-category`)
Kategorien für FAQs.

**Felder:**
- `name`: string (required)
- `slug`: uid (unique, required)
- `description`: text
- `icon`: string
- `color`: string
- `order`: integer
- `isActive`: boolean (default: true)

**Relationen:**
- `faqs`: one-to-many → faq
- `sites`: many-to-many → site-configuration

---

#### 💬 FAQ Feedback (`api::faq-feedback.faq-feedback`)
Feedback zu FAQ-Einträgen.

**Felder:**
- `isHelpful`: boolean (required)
- `comment`: text
- `additionalFeedback`: text
- `followUpRequested`: boolean
- `sessionId`: string
- `ipAddress`: string (private)
- `userAgent`: string (private)

**Relationen:**
- `faq`: many-to-one → faq (required)
- `site`: many-to-one → site-configuration
- `user`: many-to-one → users-permissions.user

---

#### 📧 Contact Messages (`api::contact-message.contact-message`)
Kontaktformular-Nachrichten.

**Felder:**
- `messageId`: uuid (unique, auto-generated)
- `name`: string (required)
- `email`: email (required)
- `phone`: string
- `subject`: string
- `message`: text (required)
- `status`: enum ['new', 'read', 'replied', 'spam'] (default: 'new')
- `consentGiven`: boolean (required)
- `ipAddress`: string (private)
- `userAgent`: string (private)
- `repliedAt`: datetime
- `notes`: text (private)

**Relationen:**
- `site`: many-to-one → site-configuration (required)

---

### 4. Kategorisierung (2 Types)

#### 📂 Blog Categories (`api::blog-category.blog-category`)
Hierarchische Blog-Kategorien.

**Felder:**
- `name`: string (required)
- `slug`: uid (unique, required)
- `description`: text
- `color`: string
- `icon`: string
- `order`: integer
- `isActive`: boolean (default: true)

**Komponenten:**
- `seo`: component (shared.seo)

**Relationen:**
- `posts`: one-to-many → blog-post
- `parent`: many-to-one → blog-category (self-reference)
- `children`: one-to-many → blog-category (self-reference)

---

### 5. Rechtliches (1 Type)

#### ⚖️ Legal Pages (`api::legal-page.legal-page`)
Rechtliche Seiten (Impressum, Datenschutz, etc.).

**Felder:**
- `type`: enum ['impressum', 'datenschutz', 'agb', 'cookie-policy', 'other'] (required, unique)
- `content`: richtext (required)
- `customTitle`: string
- `country`: string (default: 'DE')
- `language`: string (default: 'de')
- `validFrom`: date
- `validUntil`: date
- `version`: string
- `lastReviewDate`: date
- `nextReviewDate`: date
- `isActive`: boolean (default: true)

---

### 6. System & Konfiguration (1 Type)

#### ⚙️ Site Configuration (`api::site-configuration.site-configuration`)
Zentrale Konfiguration für Multi-Site-Setup.

**Felder:**
- `siteIdentifier`: string (unique, required)
- `domain`: string (required)
- `siteName`: string (required, max: 100)
- `tagline`: string (max: 200)
- `logo`: media (single image)
- `favicon`: media (single image)
- `brand`: enum ['complexcare', 'zweitmeinung', 'portal'] (required)
- `specialty`: enum (medizinische Spezialisierungen)
- **JSON-Felder:**
  - `aliases`: json (Domain-Aliase)
  - `locales`: json (Sprach-Konfiguration)
  - `navigation`: json (Navigations-Struktur)
  - `footer`: json (Footer-Struktur)
  - `features`: json (Feature-Flags)

**Komponenten:**
- `theme`: component (site.theme)
- `contact`: component (site.contact)
- `socialMedia`: component (site.social-media)
- `analytics`: component (site.analytics)
- `seo`: component (shared.seo)
- `portalSettings`: component (site.portal-settings)
- `maintenanceMode`: component (site.maintenance-mode)
- `emailSettings`: component (site.email-settings, required)

**Relationen (Hub-Funktion):**
- `pages`: many-to-many → page
- `newsItems`: many-to-many → news-item
- `blogPosts`: many-to-many → blog-post
- `services`: many-to-many → service
- `experts`: many-to-many → expert

---

## Komponenten-Übersicht

### Shared Components
- `shared.seo`: SEO-Metadaten (title, description, keywords, etc.)
- `shared.price`: Preis-Komponente
- `shared.trust-indicators`: Vertrauensindikatoren (DSGVO, Zertifikate, etc.)
- `shared.cta-button`: Call-to-Action Buttons
- `blog.author`: Autor-Informationen

### Elements Components (für Hero Carousel)
- `elements.hero-badge`: Anpassbare Badges mit Icons für Hero-Sections
- `elements.title-line`: Mehrzeilige Titel mit Highlighting-Unterstützung
- `elements.hero-slide`: Komplette Slide-Inhalte mit CTAs für Carousel

### Domain-spezifische Components
- `expert.qualification`: Qualifikationen von Experten
- `expert.availability`: Verfügbarkeits-Informationen
- `service.pricing`: Service-Preisgestaltung
- `service.feature`: Service-Features
- `healthcare.compliance`: Compliance-Informationen

### Site Configuration Components
- `site.theme`: Theme-Einstellungen
- `site.contact`: Kontakt-Informationen
- `site.social-media`: Social Media Links
- `site.analytics`: Analytics-Konfiguration
- `site.portal-settings`: Portal-spezifische Einstellungen
- `site.maintenance-mode`: Wartungsmodus-Einstellungen
- `site.email-settings`: E-Mail-Konfiguration

### Page Builder Components (Dynamic Zone) - 58 Sections

**Hero-Sections (3):**
- `sections.hero`: Basis Hero-Section
- `sections.hero-healthcare`: Healthcare-spezifischer Hero
- `sections.hero-carousel`: Erweiterte Hero-Carousel mit mehreren Slides

**Basis-Sections (10):**
- `sections.text-block`: Text-Block
- `sections.cta-banner`: Call-to-Action Banner
- `sections.services-grid`: Services-Grid
- `sections.healthcare-products`: Healthcare-Produkte Grid (Komponente existiert, aber Content Type wurde entfernt)
- `sections.team-grid`: Team-Grid
- `sections.testimonials`: Testimonials
- `sections.expert-grid`: Experten-Grid
- `sections.faq`: FAQ-Section
- `sections.contact-form`: Kontaktformular
- `sections.blog-list`: Blog-Liste
- `sections.faq-reference`: FAQ-Referenz

**Erweiterte Interactive Sections (13):**
- `sections.how-it-works`: Wie es funktioniert mit Prozess-Steps
- `sections.why-choose-us`: Warum uns wählen mit Benefits
- `sections.news`: News-Section mit Filtering
- `sections.contact-info`: Kontakt-Informationen
- `sections.timeline`: Timeline für Events/Meilensteine
- `sections.stats`: Statistiken und Zahlen
- `sections.video-hero`: Video-Hero-Section
- `sections.gallery`: Bild-/Video-Galerie
- `sections.contact-form-split`: Geteiltes Kontaktformular
- `sections.contact-methods`: Kontakt-Methoden Grid
- `sections.business-hours`: Geschäftszeiten
- `sections.news-hero`: News-spezifischer Hero
- `sections.newsletter-subscription`: Newsletter-Anmeldung

**News Page Sections (3):**
- `sections.news-filter`: News-Filter mit Kategorien
- `sections.news-highlights`: Featured News
- `sections.news-grid-enhanced`: Erweiterte News-Grid

**FAQ Page Sections (5):**
- `sections.faq-hero`: FAQ-Hero mit Suche
- `sections.faq-categories`: FAQ-Kategorien Grid
- `sections.faq-accordion-enhanced`: Erweiterte FAQ-Accordion
- `sections.faq-cta`: FAQ Call-to-Action
- `sections.faq-search-results`: FAQ-Suchergebnisse

**Company/About Page Sections (10):**
- `sections.core-values`: Unternehmenswerte mit Icon-Cards
- `sections.mission-statement`: Mission Statement
- `sections.company-focus`: Unternehmensfokus mit Bullet Points
- `sections.story-section`: Unternehmensgeschichte
- `sections.founder-story`: Gründer-Story
- `sections.company-timeline`: Unternehmens-Timeline
- `sections.belief-statement`: Überzeugungen/Glaubenssätze
- `sections.expertise-showcase`: Expertise-Präsentation
- `sections.certification-highlights`: Zertifizierungen
- `sections.mission-cta-enhanced`: Erweiterte Mission-CTA

**How It Works Page Sections (5):**
- `sections.process-steps-detailed`: Detaillierte Prozess-Schritte
- `sections.service-tiers-timeline`: Service-Ebenen Timeline
- `sections.benefits-comparison`: Vorteile-Vergleich
- `sections.why-choose-cards`: Warum wählen Cards
- `sections.process-cta`: Prozess Call-to-Action

**Specialties Page Sections (4):**
- `sections.medical-specialties-grid`: Medizinische Fachbereiche Grid
- `sections.specialties-development`: Fachbereiche in Entwicklung
- `sections.specialty-detail-hero`: Fachbereich-Detail Hero
- `sections.specialty-features`: Fachbereich-Features

---

## Redundanzen und Optimierungspotential

### 1. Kontaktdaten-Redundanz
**Problem:** Ähnliche Kontaktfelder wiederholen sich in `contact-message` und anderen Content Types.

**Empfehlung:** Erstelle eine `shared.contact-info` Komponente:
```javascript
{
  name: string (required),
  email: email (required),
  phone: string,
  consent: boolean
}
```

### 2. Tracking-Daten-Redundanz
**Problem:** `ipAddress` und `userAgent` in mehreren Content Types.

**Empfehlung:** Erstelle eine `shared.tracking-info` Komponente:
```javascript
{
  ipAddress: string (private),
  userAgent: string (private),
  sessionId: string
}
```

### 3. Status-Felder
**Problem:** Verschiedene Status-Enums mit ähnlichen Werten.

**Empfehlung:** Standardisierte Status-Werte wo möglich.

### 4. JSON-Felder
**Problem:** Viele unstrukturierte JSON-Felder.

**Empfehlung für Frontend:**
- Definiere TypeScript-Interfaces für alle JSON-Felder
- Validiere JSON-Strukturen im Frontend
- Beispiel für `tags`: `string[]`
- Beispiel für `features`: `{ id: string, title: string, description: string }[]`

---

## Frontend-Entwicklung Best Practices

### 1. API-Abfragen

**Populate Relations:**
```javascript
// Beispiel: Page mit allen Relations
const page = await fetch('/api/pages/1?populate=*')

// Spezifische Relations
const page = await fetch('/api/pages/1?populate[sites]=true&populate[seo]=true')
```

**Filter nach Site:**
```javascript
// Custom Endpoint nutzen
const pages = await fetch('/api/pages/by-site/zweitmeinung-ng')

// Oder Standard-Filter
const pages = await fetch('/api/pages?filters[sites][siteIdentifier][$eq]=zweitmeinung-ng')
```

### 2. TypeScript-Typen (MANDATORY)

**Regel**: Alle API-Responses MÜSSEN typisiert werden.

```typescript
// Generated types (regenerate after schema changes)
import { 
  ApiPagePage, 
  ApiSiteConfigurationSiteConfiguration,
  ApiFaqFaq,
  ApiServiceService 
} from '@/types/generated/contentTypes'

// Custom response interfaces
interface PageWithSections extends ApiPagePage {
  sections: SectionComponent[]
}

interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: PaginationMeta
  }
}

// Type guards for runtime validation
const isPageData = (data: any): data is ApiPagePage => {
  return data && typeof data.title === 'string'
}
```

**TypeScript Generation Commands**:
```bash
# Generate types after schema changes
npm run ts:generate-types

# Validate all .ts files
npm run ts:check

# Check for forbidden .js files
find ./src -name "*.js" -type f | grep -v node_modules
```

### 3. Multi-Site-Architektur

Jede Anfrage sollte site-spezifisch sein:
1. Ermittle `siteIdentifier` aus Domain/Subdomain
2. Filtere alle Content-Abfragen nach Site
3. Nutze site-spezifische Konfiguration für Theming

### 4. Performance-Optimierung

1. **Selective Population:** Nur benötigte Felder populaten
2. **Pagination:** Nutze Pagination für Listen
3. **Caching:** Cache site-configuration (ändert sich selten)
4. **Lazy Loading:** Lade Sections in Pages on-demand

### 5. Komponenten-Mapping (TypeScript)

**Wichtig**: Verwende TypeScript für alle Component Mappings:

```typescript
// components/sections/SectionRenderer.tsx
import type { SectionComponent } from '@/types/sections'

type SectionComponentMap = {
  [K in SectionComponent['__component']]: React.ComponentType<
    Extract<SectionComponent, { __component: K }>
  >
}

const sectionComponents: SectionComponentMap = {
  // Hero-Sections
  'sections.hero': HeroSection,
  'sections.hero-healthcare': HealthcareHero,
  'sections.hero-carousel': HeroCarousel,
  'sections.text-block': TextBlock,
  'sections.cta-banner': CtaBanner,
  'sections.services-grid': ServicesGrid,
  'sections.team-grid': TeamGrid,
  'sections.testimonials': Testimonials,
  'sections.expert-grid': ExpertGrid,
  'sections.faq': FaqSection,
  'sections.contact-form': ContactForm,
  'sections.blog-list': BlogList,
  
  // Erweiterte Sections
  'sections.how-it-works': HowItWorks,
  'sections.why-choose-us': WhyChooseUs,
  'sections.news': NewsSection,
  'sections.contact-info': ContactInfo,
  'sections.timeline': Timeline,
  'sections.stats': Stats,
  'sections.video-hero': VideoHero,
  'sections.gallery': Gallery,
  
  // News Page Sections
  'sections.news-hero': NewsHero,
  'sections.news-filter': NewsFilter,
  'sections.news-highlights': NewsHighlights,
  'sections.news-grid-enhanced': NewsGridEnhanced,
  'sections.newsletter-subscription': NewsletterSubscription,
  
  // FAQ Page Sections
  'sections.faq-hero': FaqHero,
  'sections.faq-categories': FaqCategories,
  'sections.faq-accordion-enhanced': FaqAccordionEnhanced,
  'sections.faq-cta': FaqCta,
  'sections.faq-search-results': FaqSearchResults,
  
  // Company/About Sections
  'sections.core-values': CoreValues,
  'sections.mission-statement': MissionStatement,
  'sections.company-focus': CompanyFocus,
  'sections.story-section': StorySection,
  'sections.founder-story': FounderStory,
  'sections.company-timeline': CompanyTimeline,
  'sections.belief-statement': BeliefStatement,
  'sections.expertise-showcase': ExpertiseShowcase,
  'sections.certification-highlights': CertificationHighlights,
  'sections.mission-cta-enhanced': MissionCtaEnhanced,
  
  // How It Works Sections
  'sections.process-steps-detailed': ProcessStepsDetailed,
  'sections.service-tiers-timeline': ServiceTiersTimeline,
  'sections.benefits-comparison': BenefitsComparison,
  'sections.why-choose-cards': WhyChooseCards,
  'sections.process-cta': ProcessCta,
  
  // Specialties Sections
  'sections.medical-specialties-grid': MedicalSpecialtiesGrid,
  'sections.specialties-development': SpecialtiesDevelopment,
  'sections.specialty-detail-hero': SpecialtyDetailHero,
  'sections.specialty-features': SpecialtyFeatures,
}
```

### 6. Hero Carousel Integration

Die neue `sections.hero-carousel` Komponente bietet erweiterte Hero-Funktionalität:

**Technische Details:**
- **1-5 Slides** pro Carousel
- **Autoplay** mit konfigurierbaren Intervallen (2-10 Sekunden)
- **Übergänge**: fade, slide, zoom, flip
- **Benutzerdefinierte Gradients** und Hintergrundbilder
- **Responsive Höheneinstellungen**
- **Trust Indicators Integration**

**Komponenten-Struktur:**
```typescript
interface HeroCarousel {
  slides: HeroSlide[]  // 1-5 Slides
  autoplay: boolean
  autoplayInterval: number  // 2000-10000ms
  transitionType: 'fade' | 'slide' | 'zoom' | 'flip'
  height: 'auto' | 'screen-50' | 'screen-75' | 'screen-90' | 'screen-full'
  mobileHeight: 'auto' | 'screen-40' | 'screen-50' | 'screen-60' | 'screen-75'
}

interface HeroSlide {
  badge: HeroBadge
  titleLines: TitleLine[]  // 1-4 Zeilen
  subtitle: string
  description: string
  primaryCta: CtaButton
  secondaryCta?: CtaButton
  backgroundImage?: Media
  backgroundGradient: string
  trustIndicators?: TrustIndicators
}
```

**Frontend-Implementation (TypeScript)**:
```typescript
// components/sections/HeroCarousel.tsx
import type { HeroCarouselData } from '@/types/sections'

interface HeroCarouselProps {
  data: HeroCarouselData
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ data }) => {
  const { slides, autoplay, autoplayInterval, transitionType } = data
  
  return (
    <Swiper
      autoplay={autoplay ? { delay: autoplayInterval } : false}
      effect={transitionType}
      modules={[Autoplay, EffectFade, EffectCards]}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <HeroSlide slide={slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
```

---

## FAQ Relation System

Das neue FAQ Accordion Enhanced System eliminiert doppelte Datenpflege durch dynamisches Laden von FAQs aus dem FAQ Collection Type.

### Komponente: `sections.faq-accordion-enhanced`

**Neue Felder für Relation-System:**
- `selectionMode`: enum ('manual', 'category', 'mixed') - Auswahl-Modus
- `selectedCategory`: relation → faq-category - Kategorie für automatisches Laden
- `selectedFaqs`: relation → faq (many-to-many) - Manuell ausgewählte FAQs
- `maxFaqs`: integer (1-50) - Maximale Anzahl FAQs
- `sortBy`: enum ('priority', 'createdAt', 'helpfulCount', 'manual') - Sortierung
- `showOnlyFeatured`: boolean - Nur Featured FAQs anzeigen

**Bestehende Felder (Legacy):**
- `questions`: component (repeatable, elements.faq-question) - Nur für Manual Mode

### Selection Modes

1. **Manual Mode** (Legacy, Backward Compatible)
   - Verwendet `questions` Array mit manuell eingetragenen FAQs
   - Keine Änderungen an bestehenden Komponenten erforderlich

2. **Category Mode** 
   - Lädt automatisch alle FAQs einer Kategorie
   - Respektiert `maxFaqs`, `sortBy` und `showOnlyFeatured`
   - Dynamische Updates bei neuen FAQs

3. **Mixed Mode** (Empfohlen)
   - Kombiniert manuelle FAQ-Auswahl mit Kategorie-Fallback
   - `selectedFaqs` werden zuerst angezeigt
   - Kategorie-FAQs füllen bis `maxFaqs` auf

### API Response Structure

```typescript
interface FaqAccordionEnhanced {
  // Legacy fields
  categoryTitle: string
  categoryDescription?: string
  categoryIcon: string
  categoryColor: string
  questions: FaqQuestion[]  // Nur in Manual Mode
  
  // New relation fields
  selectionMode: 'manual' | 'category' | 'mixed'
  selectedCategory?: FaqCategory
  selectedFaqs?: Faq[]
  maxFaqs: number
  sortBy: 'priority' | 'createdAt' | 'helpfulCount' | 'manual'
  showOnlyFeatured: boolean
  
  // Processed data (added by API)
  faqs: Faq[]  // Dynamisch geladene FAQs basierend auf Selection Mode
}

interface ProcessedFaq {
  id: number
  question: string
  answer: string  // Rich text
  shortAnswer?: string
  category: FaqCategory
  priority: 'low' | 'medium' | 'high' | 'featured'
  helpfulCount: number
  tags: string[]
  relatedServices: Service[]
  relatedExperts: Expert[]
  attachments: Media[]
  videoUrl?: string
}
```

### Frontend Implementation (TypeScript)

```typescript
// components/sections/FaqAccordionEnhanced.tsx
import type { FaqAccordionEnhancedData } from '@/types/sections'

interface FaqAccordionEnhancedProps {
  section: FaqAccordionEnhancedData
}

const FaqAccordionEnhanced: React.FC<FaqAccordionEnhancedProps> = ({ section }) => {
  // Verwende faqs (neue Struktur) oder questions (legacy) als Fallback
  const items = section.faqs || section.questions || []
  
  return (
    <div className="faq-accordion">
      <div className="faq-header">
        <h2>{section.categoryTitle}</h2>
        {section.categoryDescription && (
          <p>{section.categoryDescription}</p>
        )}
      </div>
      
      <Accordion>
        {items.map((item, index) => (
          <AccordionItem key={item.id || index}>
            <AccordionTrigger>
              {item.question}
              {item.priority === 'featured' && <Badge>Featured</Badge>}
            </AccordionTrigger>
            <AccordionContent>
              <RichText content={item.answer} />
              
              {/* Zusätzliche Features für FAQ Collection Type */}
              {item.relatedServices?.length > 0 && (
                <RelatedServices services={item.relatedServices} />
              )}
              
              {item.attachments?.length > 0 && (
                <Attachments files={item.attachments} />
              )}
              
              {item.videoUrl && (
                <VideoEmbed url={item.videoUrl} />
              )}
              
              <FaqActions 
                faqId={item.id}
                helpfulCount={item.helpfulCount}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
```

### Migration von Legacy Components

Bestehende FAQ Accordion Enhanced Komponenten funktionieren weiterhin über den Manual Mode. Für die Migration zu Relations:

1. **Automatische Migration**: `npm run strapi console < scripts/migrate-faq-components.js`
2. **Manuelle Migration**: Selection Mode auf 'mixed' ändern und FAQs/Kategorie auswählen

---

## 🚨 Wichtige Entwicklungsregeln

### TypeScript-Only Codebase
1. **KEINE JavaScript-Dateien** in `src/` erlaubt
2. **Alle neuen Komponenten** MÜSSEN TypeScript verwenden
3. **API-Responses** MÜSSEN typisiert werden
4. **Build-Validierung** vor jedem Commit erforderlich

### Architektur-Prinzipien
1. **Keine Single Types:** Alle Daten sind Collection Types
2. **Site Configuration als Hub:** Fast alle Content Types sind mit site-configuration verknüpft
3. **UUID-Felder:** Einige Types nutzen auto-generierte UUIDs (expert, contact-message, etc.)
4. **Private Felder:** Beachte private Felder (ipAddress, userAgent, internalNotes)
5. **Draft & Publish:** Die meisten Content Types unterstützen Draft/Publish

### System-Status
- ✅ **Database Configuration:** Fixed (August 2025)
- ✅ **Schema Registry:** Fixed via bootstrap loading
- ✅ **TypeScript Migration:** Core files completed
- ✅ **Services erweitert:** Beide medizinische Dienstleistungen und KI-Produkte
- ❌ **Appointment-System:** Komplett entfernt
- ✅ **FAQ Relation System:** Neue dynamische FAQ-Einbindung über `sections.faq-accordion-enhanced`

### Debugging Commands
```bash
# Check for JavaScript files (should return 0)
find ./src -name "*.js" -type f | grep -v node_modules | wc -l

# Validate TypeScript
npm run ts:check

# Build with memory optimization
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# Check Strapi logs
sudo journalctl -u strapi -f
```

---

**Dokumentation zuletzt aktualisiert**: 2025-08-03  
**Version**: 2.0 (TypeScript-optimiert)  
**Maintenance**: Bei Schema-Änderungen diese Datei UND API-REFERENCE.md aktualisieren