# API Guide: "So funktioniert's" Seite abrufen

## 📋 Übersicht

Diese Anleitung zeigt Entwicklern, wie sie die Inhalte der "So funktioniert's" Seite über die Strapi v5 REST API abrufen können.

### Seiten-Informationen
- **Slug**: `so-funktionierts`
- **DocumentId**: `fthzlwpv8wkus2i0bnwaftqk`
- **Titel**: "So funktioniert's"
- **Veröffentlicht**: ✅ Ja
- **Letzte Aktualisierung**: 2025-11-25

---

## 🚀 Schnellstart

### Einfachster API-Aufruf

```bash
# Basis-Daten ohne verschachtelte Inhalte
curl http://localhost:1337/api/pages?filters[slug][$eq]=so-funktionierts
```

**Response:**
```json
{
  "data": [
    {
      "id": 28,
      "documentId": "fthzlwpv8wkus2i0bnwaftqk",
      "attributes": {
        "title": "So funktioniert's",
        "slug": "so-funktionierts",
        "isSharedContent": false,
        "createdAt": "2025-07-31T14:57:20.107Z",
        "updatedAt": "2025-11-25T22:24:53.793Z",
        "publishedAt": "2025-11-25T22:24:54.202Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

## 📦 API-Aufrufe mit verschiedenen Populate-Strategien

### 1. Alle Sections abrufen (Empfohlen)

```bash
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&populate=deep"
```

**Beschreibung**: Lädt die Seite mit allen verschachtelten Sections und deren Inhalten.

**Verwendung**: Ideal für vollständiges Page-Rendering im Frontend.

---

### 2. Spezifische Felder abrufen

```bash
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&populate[sections]=*&populate[seo]=*"
```

**Beschreibung**: Lädt nur Sections und SEO-Daten, nicht die Site-Relations.

**Verwendung**: Wenn Sie nur Page-Content ohne Site-Konfiguration benötigen.

---

### 3. Direkter Zugriff über DocumentId

```bash
curl "http://localhost:1337/api/pages/fthzlwpv8wkus2i0bnwaftqk?populate=deep"
```

**Beschreibung**: Direkter Zugriff auf die Seite über die DocumentId.

**Verwendung**: Wenn Sie die DocumentId bereits kennen (schneller als Slug-Filter).

---

### 4. Mit Site-Filtering

```bash
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&filters[sites][siteIdentifier][\$eq]=zweitmeinung-ng&populate=deep"
```

**Beschreibung**: Filtert nach Seite UND Site (Multi-Site Setup).

**Verwendung**: Wenn Sie sicherstellen wollen, dass die Seite zur richtigen Site gehört.

---

## 💻 Code-Beispiele

### JavaScript/TypeScript (Fetch API)

```typescript
// api/pages.ts
interface PageResponse {
  data: Array<{
    id: number
    documentId: string
    attributes: {
      title: string
      slug: string
      sections: any[]
      seo?: any
      sites?: any[]
    }
  }>
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

async function getSoFunktioniertPage(): Promise<PageResponse> {
  const params = new URLSearchParams({
    'filters[slug][$eq]': 'so-funktionierts',
    'populate': 'deep'
  })

  const response = await fetch(
    `http://localhost:1337/api/pages?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Verwendung
const pageData = await getSoFunktioniertPage()
const page = pageData.data[0]
console.log('Title:', page.attributes.title)
console.log('Sections:', page.attributes.sections)
```

---

### TypeScript mit Type Safety

```typescript
// types/page.ts
export interface SoFunktioniertPage {
  id: number
  documentId: string
  attributes: {
    title: string
    slug: string
    isSharedContent: boolean
    sections: Section[]
    seo?: SEO
    sites?: Site[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Section {
  id: number
  __component: string
  [key: string]: any
}

export interface SEO {
  id: number
  metaTitle?: string
  metaDescription?: string
  metaImage?: any
  keywords?: string
  canonicalURL?: string
}

// api/pages.ts
import type { SoFunktioniertPage } from './types/page'

class PagesAPI {
  private baseURL = 'http://localhost:1337/api'

  async getSoFunktioniertPage(): Promise<SoFunktioniertPage> {
    const params = new URLSearchParams({
      'filters[slug][$eq]': 'so-funktionierts',
      'populate': 'deep'
    })

    const response = await fetch(`${this.baseURL}/pages?${params}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    }

    const json = await response.json()

    if (!json.data || json.data.length === 0) {
      throw new Error('Page not found')
    }

    return json.data[0] as SoFunktioniertPage
  }
}

// Verwendung
const api = new PagesAPI()
const page = await api.getSoFunktioniertPage()
```

---

### Next.js (Server Component)

```typescript
// app/so-funktionierts/page.tsx
import { notFound } from 'next/navigation'

async function getSoFunktioniertPageData() {
  const params = new URLSearchParams({
    'filters[slug][$eq]': 'so-funktionierts',
    'populate': 'deep'
  })

  const res = await fetch(
    `http://localhost:1337/api/pages?${params}`,
    {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch page')
  }

  const json = await res.json()
  return json.data[0]
}

export default async function SoFunktioniertPage() {
  const page = await getSoFunktioniertPageData()

  if (!page) {
    notFound()
  }

  return (
    <main>
      <h1>{page.attributes.title}</h1>
      {/* Render sections */}
      {page.attributes.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </main>
  )
}
```

---

### Next.js (Static Generation)

```typescript
// pages/so-funktionierts.tsx
import { GetStaticProps } from 'next'

interface Props {
  page: SoFunktioniertPage
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const params = new URLSearchParams({
    'filters[slug][$eq]': 'so-funktionierts',
    'populate': 'deep'
  })

  const res = await fetch(`http://localhost:1337/api/pages?${params}`)
  const json = await res.json()

  if (!json.data || json.data.length === 0) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page: json.data[0]
    },
    revalidate: 60 // ISR: Revalidate every 60 seconds
  }
}

export default function SoFunktioniertPage({ page }: Props) {
  return (
    <main>
      <h1>{page.attributes.title}</h1>
      {/* Render sections */}
    </main>
  )
}
```

---

### React Hook (Client-Side)

```typescript
// hooks/useSoFunktioniertPage.ts
import { useState, useEffect } from 'react'
import type { SoFunktioniertPage } from '@/types/page'

interface UseSoFunktioniertPageReturn {
  data: SoFunktioniertPage | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSoFunktioniertPage(): UseSoFunktioniertPageReturn {
  const [data, setData] = useState<SoFunktioniertPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        'filters[slug][$eq]': 'so-funktionierts',
        'populate': 'deep'
      })

      const response = await fetch(
        `http://localhost:1337/api/pages?${params}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const json = await response.json()

      if (!json.data || json.data.length === 0) {
        throw new Error('Page not found')
      }

      setData(json.data[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPage()
  }, [])

  return { data, loading, error, refetch: fetchPage }
}

// Verwendung in Component
function SoFunktioniertPage() {
  const { data, loading, error } = useSoFunktioniertPage()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>Page not found</div>

  return (
    <main>
      <h1>{data.attributes.title}</h1>
      {/* Render sections */}
    </main>
  )
}
```

---

## 🔍 Response-Struktur verstehen

### Komplette Response-Struktur (mit populate=deep)

```json
{
  "data": [
    {
      "id": 28,
      "documentId": "fthzlwpv8wkus2i0bnwaftqk",
      "attributes": {
        "title": "So funktioniert's",
        "slug": "so-funktionierts",
        "isSharedContent": false,
        "sections": [
          {
            "id": 1,
            "__component": "sections.hero-section",
            "title": "So einfach funktioniert's",
            "subtitle": "Ihre Zweitmeinung in 3 Schritten",
            "description": "...",
            "backgroundType": "gradient",
            "primaryButton": {
              "text": "Jetzt starten",
              "href": "/kontakt",
              "variant": "primary"
            }
          },
          {
            "id": 2,
            "__component": "sections.how-it-works",
            "title": "Unser Prozess",
            "subtitle": "Schritt für Schritt zur Zweitmeinung",
            "steps": [
              {
                "stepNumber": 1,
                "title": "Anfrage senden",
                "description": "Füllen Sie unser Formular aus",
                "icon": "📝"
              },
              {
                "stepNumber": 2,
                "title": "Experte prüft",
                "description": "Facharzt analysiert Ihren Fall",
                "icon": "👨‍⚕️"
              },
              {
                "stepNumber": 3,
                "title": "Zweitmeinung erhalten",
                "description": "Detaillierte medizinische Einschätzung",
                "icon": "✅"
              }
            ],
            "layout": "vertical"
          },
          {
            "id": 3,
            "__component": "sections.timeline",
            "title": "Zeitlicher Ablauf",
            "subtitle": "Von der Anfrage bis zur Zweitmeinung",
            "timelineItems": [
              {
                "date": "Tag 1",
                "title": "Eingang Ihrer Anfrage",
                "description": "Ihre Unterlagen werden geprüft",
                "status": "completed"
              },
              {
                "date": "Tag 2-5",
                "title": "Fachärztliche Analyse",
                "description": "Detaillierte Prüfung durch Spezialisten",
                "status": "current"
              },
              {
                "date": "Tag 7",
                "title": "Übermittlung der Zweitmeinung",
                "description": "Sie erhalten den ausführlichen Bericht",
                "status": "upcoming"
              }
            ],
            "orientation": "vertical"
          },
          {
            "id": 4,
            "__component": "sections.cta-banner",
            "title": "Bereit für Ihre Zweitmeinung?",
            "description": "Kontaktieren Sie uns noch heute",
            "primaryButton": {
              "text": "Jetzt anfragen",
              "href": "/kontakt",
              "variant": "primary"
            },
            "backgroundColor": "#f0f9ff"
          }
        ],
        "seo": {
          "id": 1,
          "metaTitle": "So funktioniert's - Zweitmeinung einfach erklärt",
          "metaDescription": "Erfahren Sie, wie unser Zweitmeinungsservice funktioniert. Einfach, schnell und professionell - in nur 3 Schritten zur medizinischen Zweitmeinung.",
          "keywords": "zweitmeinung, ablauf, prozess, schritt für schritt",
          "canonicalURL": "https://zweitmeinung-ng.de/so-funktionierts"
        },
        "sites": [
          {
            "id": 1,
            "siteIdentifier": "zweitmeinung-ng",
            "siteName": "Zweitmeinung NG",
            "domain": "https://zweitmeinung-ng.de"
          }
        ],
        "createdAt": "2025-07-31T14:57:20.107Z",
        "updatedAt": "2025-11-25T22:24:53.793Z",
        "publishedAt": "2025-11-25T22:24:54.202Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

## 🎨 Section Components verstehen

### Verfügbare Section-Typen

Jede Section hat ein `__component` Feld, das den Typ angibt:

| Component Name | Beschreibung | Typische Felder |
|----------------|--------------|-----------------|
| `sections.hero-section` | Hero-Bereich der Seite | title, subtitle, buttons |
| `sections.how-it-works` | Schritt-für-Schritt Anleitung | title, steps[], layout |
| `sections.timeline` | Prozess-Timeline | title, timelineItems[], orientation |
| `sections.text-block` | Textblock mit Rich Text | title, content, alignment |
| `sections.cta-banner` | Call-to-Action Banner | title, description, buttons |
| `sections.faq` | FAQ-Bereich | title, questions[] |
| `sections.contact-form` | Kontaktformular | title, fields[] |

### Section Rendering Pattern

```typescript
// components/SectionRenderer.tsx
import { HeroSection } from './sections/HeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { TimelineSection } from './sections/TimelineSection'
import { TextBlock } from './sections/TextBlock'
import { CtaBanner } from './sections/CtaBanner'

const sectionComponents = {
  'sections.hero-section': HeroSection,
  'sections.how-it-works': HowItWorksSection,
  'sections.timeline': TimelineSection,
  'sections.text-block': TextBlock,
  'sections.cta-banner': CtaBanner,
}

export function SectionRenderer({ section }) {
  const Component = sectionComponents[section.__component]

  if (!Component) {
    console.warn(`Unknown section: ${section.__component}`)
    return null
  }

  return <Component {...section} />
}

// Verwendung
{page.attributes.sections.map((section, index) => (
  <SectionRenderer key={`${section.__component}-${index}`} section={section} />
))}
```

---

## 🔧 Erweiterte Populate-Strategien

### Selektives Populate (Performance-Optimierung)

```bash
# Nur bestimmte Sections-Felder
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&populate[sections][populate][0]=primaryButton&populate[sections][populate][1]=secondaryButton"
```

### Tiefes Populate für Bilder

```bash
# Alle Bilder in Sections laden
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&populate[sections][populate][image][populate]=*"
```

### Kombiniertes Populate

```bash
# Sections + SEO + Sites
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=so-funktionierts&populate[sections]=*&populate[seo][populate]=*&populate[sites][populate]=*"
```

---

## ⚠️ Error Handling

### Robuste Error-Behandlung

```typescript
async function getSoFunktioniertPageSafe() {
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': 'so-funktionierts',
      'populate': 'deep'
    })

    const response = await fetch(
      `http://localhost:1337/api/pages?${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Optional: Timeout
        signal: AbortSignal.timeout(5000) // 5 seconds timeout
      }
    )

    // Check HTTP status
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Page not found')
      }
      if (response.status === 500) {
        throw new Error('Server error')
      }
      throw new Error(`HTTP error: ${response.status}`)
    }

    const json = await response.json()

    // Check if data exists
    if (!json.data || json.data.length === 0) {
      throw new Error('Page "so-funktionierts" not found in database')
    }

    // Validate data structure
    const page = json.data[0]
    if (!page.attributes || !page.attributes.sections) {
      throw new Error('Invalid page data structure')
    }

    return page

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout')
    } else if (error instanceof TypeError) {
      console.error('Network error:', error.message)
    } else {
      console.error('Error fetching page:', error.message)
    }
    throw error
  }
}
```

---

## 🚦 Caching-Strategien

### Browser Cache

```typescript
// Cache für 5 Minuten
const response = await fetch(url, {
  headers: {
    'Cache-Control': 'max-age=300'
  }
})
```

### Next.js Caching

```typescript
// ISR (Incremental Static Regeneration)
export const getStaticProps: GetStaticProps = async () => {
  // ...
  return {
    props: { page },
    revalidate: 60 // Regenerate every 60 seconds
  }
}

// Server Component mit Revalidation
const page = await fetch(url, {
  next: { revalidate: 60 }
})
```

### Custom Cache (In-Memory)

```typescript
class CachedPagesAPI {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheDuration = 60 * 1000 // 1 minute

  async getSoFunktioniertPage(): Promise<SoFunktioniertPage> {
    const cacheKey = 'so-funktionierts'
    const cached = this.cache.get(cacheKey)

    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data
    }

    // Fetch fresh data
    const data = await this.fetchFromAPI()

    // Update cache
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return data
  }

  private async fetchFromAPI() {
    // ... fetch logic
  }
}
```

---

## 📊 Beispiel-Integration

### Vollständige React Component

```typescript
// pages/SoFunktioniertPage.tsx
import React from 'react'
import { SectionRenderer } from '@/components/SectionRenderer'
import { SEO } from '@/components/SEO'

interface Props {
  page: SoFunktioniertPage
}

export default function SoFunktioniertPage({ page }: Props) {
  const { title, sections, seo } = page.attributes

  return (
    <>
      <SEO
        title={seo?.metaTitle || title}
        description={seo?.metaDescription}
        canonical={seo?.canonicalURL}
      />

      <article className="so-funktionierts-page">
        {sections.map((section, index) => (
          <SectionRenderer
            key={`${section.__component}-${section.id || index}`}
            section={section}
            index={index}
          />
        ))}
      </article>
    </>
  )
}

// Data Fetching (SSG)
export async function getStaticProps() {
  const api = new PagesAPI()
  const page = await api.getSoFunktioniertPage()

  return {
    props: { page },
    revalidate: 60
  }
}
```

---

## ✅ Checkliste für Entwickler

- [ ] API-Endpoint korrekt aufrufen mit `filters[slug][$eq]=so-funktionierts`
- [ ] `populate=deep` verwenden für alle verschachtelten Daten
- [ ] Error Handling implementieren (404, 500, Network errors)
- [ ] TypeScript-Interfaces definieren für Type Safety
- [ ] Response-Struktur validieren (data, attributes, sections)
- [ ] Section Components basierend auf `__component` rendern
- [ ] SEO-Metadaten aus Response nutzen
- [ ] Caching-Strategie implementieren (ISR, SWR, etc.)
- [ ] Loading States für bessere UX
- [ ] Responsive Design für alle Sections

---

## 🔗 Nützliche Links

- **API Base URL**: `http://localhost:1337/api`
- **Strapi Admin**: `http://localhost:1337/admin`
- **Swagger Docs**: `http://localhost:1337/documentation`
- **Frontend Prompt**: `/docs/documentation/FRONTEND-SO-FUNKTIONIERTS-PROMPT.md`
- **Datenmodell**: `/FRONTEND-DATENMODELL.md`

---

**Letzte Aktualisierung**: 2025-11-25
**Strapi Version**: v5.31.1
**API Version**: v1
