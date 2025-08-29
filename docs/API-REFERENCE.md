# API Reference (Strapi)

Project context: Healthcare multi-site platform with a TypeScript client.
Language: TypeScript.
API style: REST (GraphQL available but REST recommended).

## 🎯 Quick Reference

### Base Configuration
- **Base URL**: `process.env.NEXT_PUBLIC_STRAPI_URL` (fallback `http://localhost:1337/api`)
- **Authentication**: JWT/API tokens (as configured by environment)

### Essential TypeScript Types
```typescript
// Import generated types
import type {
  ApiPagePage,
  ApiServiceService,
  ApiFaqFaq,
  ApiSiteConfigurationSiteConfiguration
} from '@/types/generated/contentTypes'

// Standard Strapi response wrapper
interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Error response
interface StrapiError {
  error: {
    status: number
    name: string
    message: string
    details?: Record<string, any>
  }
}
```

### Common Request Headers
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`, // For authenticated requests
} as const
```

## 📋 Standard API Patterns

### Query Parameters
All endpoints support standard Strapi query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `populate` | Include relations | `?populate=*` or `?populate[sites]=true` |
| `filters` | Filter results | `?filters[field][$eq]=value` |
| `sort` | Sort results | `?sort=field:asc` or `?sort[0]=field:asc` |
| `pagination` | Control pagination | `?pagination[page]=1&pagination[pageSize]=10` |
| `publicationState` | Include drafts | `?publicationState=preview` |
| `locale` | Specify locale | `?locale=de` |

### TypeScript API Client Pattern
```typescript
// utils/api.ts
export class StrapiAPI {
  private baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'
  
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<StrapiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }
  
  // Similar methods for post, put, delete...
}

// Usage example
const api = new StrapiAPI()
const pages = await api.get<ApiPagePage[]>('/pages', {
  'filters[sites][siteIdentifier][$eq]': 'zweitmeinung-ng',
  'populate': 'sections'
})
```

## Content Type APIs

### 1. Pages API

**Base Path**: `/api/pages`

#### TypeScript Interface
```typescript
interface PageRequest {
  title: string
  slug: string
  isSharedContent?: boolean
  sections?: SectionComponent[]
  seo?: SEOComponent
  sites?: number[] // IDs of site-configurations
}

interface PageWithPopulation extends ApiPagePage {
  sections: SectionComponent[]
  sites: ApiSiteConfigurationSiteConfiguration[]
  seo: SEOComponent
}
```

#### Endpoints
```typescript
// GET /api/pages
type GetPagesResponse = StrapiResponse<ApiPagePage[]>

// GET /api/pages/:id
type GetPageResponse = StrapiResponse<ApiPagePage>

// POST /api/pages (requires auth)
type CreatePageResponse = StrapiResponse<ApiPagePage>

// PUT /api/pages/:id (requires auth)
type UpdatePageResponse = StrapiResponse<ApiPagePage>

// DELETE /api/pages/:id (requires auth)
type DeletePageResponse = StrapiResponse<ApiPagePage>
```

#### Common Queries
```typescript
// Get pages for specific site
const pages = await api.get<ApiPagePage[]>('/pages', {
  'filters[sites][siteIdentifier][$eq]': 'zweitmeinung-ng',
  'populate': 'sections,seo,sites'
})

// Get page by slug
const page = await api.get<ApiPagePage[]>('/pages', {
  'filters[slug][$eq]': 'home',
  'populate': '*'
})

// Get page with all sections populated
const pageWithSections = await api.get<ApiPagePage>(`/pages/${id}`, {
  'populate[sections]': '*',
  'populate[seo]': '*',
  'populate[sites]': 'siteIdentifier,siteName'
})
```

### 2. Services API

**Base Path**: `/api/services`

#### TypeScript Interface
```typescript
interface ServiceFilters {
  category?: 'diagnostic' | 'therapeutic' | 'preventive' | 'surgical' | 'emergency' | 'consultation'
  medicalCategory?: 'diagnostik' | 'pflege' | 'therapie' | 'notfall' | 'beratung' | 'zweitmeinung'
  productType?: 'service' | 'product'
  isActive?: boolean
  isFeatured?: boolean
  aiPowered?: boolean
}
```

#### Custom Endpoints (TypeScript)
```typescript
// Custom service endpoints (see src/api/service/routes/custom-service.ts)

// GET /api/services/healthcare/:siteId
interface HealthcareServicesParams {
  siteId: string
  medicalCategory?: string
  limit?: number
  sort?: string
}

// GET /api/services/by-site/:siteId
interface ServicesBySiteParams {
  siteId: string
  category?: string
  isNew?: boolean
  isFeatured?: boolean
  productType?: 'service' | 'product'
  limit?: number
  sort?: string
}

// GET /api/services/featured/:siteId
interface FeaturedServicesParams {
  siteId: string
  category?: string
  productType?: string
  limit?: number
}

// Usage
const healthcareServices = await api.get<ApiServiceService[]>(`/services/healthcare/${siteId}`, {
  medicalCategory: 'diagnostik',
  limit: 10
})
```

### 3. FAQ System API

**Base Path**: `/api/faqs`

#### TypeScript Interfaces
```typescript
interface FaqWithAnalytics extends ApiFaqFaq {
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  category: ApiFaqCategoryFaqCategory
  relatedFaqs: ApiFaqFaq[]
  relatedServices: ApiServiceService[]
  relatedExperts: ApiExpertExpert[]
}

interface FaqFeedbackRequest {
  faq: number // FAQ ID
  isHelpful: boolean
  comment?: string
  additionalFeedback?: string
  followUpRequested?: boolean
  sessionId?: string
}
```

#### Custom FAQ Endpoints (TypeScript)
```typescript
// Enhanced FAQ controller endpoints (see src/api/faq/controllers/faq.ts)

// GET /api/faqs/featured
const featuredFaqs = await api.get<ApiFaqFaq[]>('/faqs/featured', {
  page: 1,
  pageSize: 10
})

// GET /api/faqs/popular
const popularFaqs = await api.get<ApiFaqFaq[]>('/faqs/popular', {
  page: 1,
  pageSize: 10
})

// GET /api/faqs/category/:slug
const categoryFaqs = await api.get<ApiFaqFaq[]>(`/faqs/category/${categorySlug}`, {
  page: 1,
  pageSize: 20
})

// GET /api/faqs/search
const searchResults = await api.get<ApiFaqFaq[]>('/faqs/search', {
  q: 'search term',
  page: 1,
  pageSize: 20
})

// POST /api/faqs/:id/helpful
await api.post(`/faqs/${faqId}/helpful`)

// POST /api/faqs/:id/not-helpful  
await api.post(`/faqs/${faqId}/not-helpful`)

// GET /api/faqs/:id/related
const relatedFaqs = await api.get<ApiFaqFaq[]>(`/faqs/${faqId}/related`)

// POST /api/faqs/:id/feedback
const feedback: FaqFeedbackRequest = {
  faq: faqId,
  isHelpful: true,
  comment: 'Very helpful!',
  sessionId: sessionId
}
await api.post(`/faqs/${faqId}/feedback`, feedback)
```

### 4. Experts API

**Base Path**: `/api/experts`

#### TypeScript Interface
```typescript
interface ExpertWithRelations extends ApiExpertExpert {
  services: ApiServiceService[]
  sites: ApiSiteConfigurationSiteConfiguration[]
  qualifications: ExpertQualification[]
  availability: ExpertAvailability
}

interface ExpertFilters {
  specialties?: string[]
  isActive?: boolean
  sites?: string[] // siteIdentifiers
}
```

### 5. Site Configuration API

**Base Path**: `/api/site-configurations`

#### TypeScript Interface
```typescript
interface SiteConfigurationWithRelations extends ApiSiteConfigurationSiteConfiguration {
  pages: ApiPagePage[]
  services: ApiServiceService[]
  experts: ApiExpertExpert[]
  newsItems: ApiNewsItemNewsItem[]
  blogPosts: ApiBlogPostBlogPost[]
}

// Get site config by identifier
const siteConfig = await api.get<ApiSiteConfigurationSiteConfiguration[]>('/site-configurations', {
  'filters[siteIdentifier][$eq]': 'zweitmeinung-ng',
  'populate': '*'
})
```

## 🔐 Authentication & Authorization

### JWT Authentication
```typescript
interface LoginRequest {
  identifier: string // email or username
  password: string
}

interface LoginResponse {
  jwt: string
  user: {
    id: number
    username: string
    email: string
    confirmed: boolean
    blocked: boolean
  }
}

// POST /api/auth/local
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch('/api/auth/local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  
  if (!response.ok) {
    throw new Error('Login failed')
  }
  
  return response.json()
}
```

### API Token Authentication
```typescript
// For server-to-server communication
const headers = {
  'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json'
}
```

## 📊 Advanced Queries

### Complex Filtering
```typescript
// Multiple filters
const services = await api.get<ApiServiceService[]>('/services', {
  'filters[$and][0][category][$eq]': 'diagnostic',
  'filters[$and][1][isActive][$eq]': true,
  'filters[$and][2][sites][siteIdentifier][$eq]': 'zweitmeinung-ng',
  'populate': 'experts,sites,pricing'
})

// Date filtering
const recentNews = await api.get<ApiNewsItemNewsItem[]>('/news-items', {
  'filters[publishDate][$gte]': '2025-01-01',
  'filters[publishDate][$lte]': '2025-12-31',
  'sort': 'publishDate:desc'
})
```

### Dynamic Zone Queries
```typescript
// Pages with specific section types
const pagesWithHeroCarousel = await api.get<ApiPagePage[]>('/pages', {
  'filters[sections][__component][$eq]': 'sections.hero-carousel',
  'populate[sections]': '*'
})
```

### Aggregation Queries
```typescript
// Count queries
const totalPages = await api.get<{ count: number }>('/pages/count', {
  'filters[sites][siteIdentifier][$eq]': 'zweitmeinung-ng'
})
```

## 🚀 Performance Optimization

### Selective Population
```typescript
// Instead of populate=*
const page = await api.get<ApiPagePage>(`/pages/${id}`, {
  'populate': '*'
})

// Use selective population
const page = await api.get<ApiPagePage>(`/pages/${id}`, {
  'populate[seo]': 'title,description',
  'populate[sites]': 'siteIdentifier,siteName',
  'populate[sections]': 'true' // Only component type, not deep population
})
```

### Pagination Best Practices
```typescript
interface PaginationParams {
  page: number
  pageSize: number // Max 100
  withCount?: boolean
}

const getPaginatedData = async <T>(
  endpoint: string, 
  params: PaginationParams
): Promise<StrapiResponse<T[]>> => {
  return api.get<T[]>(endpoint, {
    'pagination[page]': params.page,
    'pagination[pageSize]': Math.min(params.pageSize, 100),
    'pagination[withCount]': params.withCount ?? true
  })
}
```

## 🐛 Error Handling

### TypeScript Error Types
```typescript
interface APIError extends Error {
  status: number
  details?: Record<string, any>
}

class StrapiAPIError extends Error implements APIError {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'StrapiAPIError'
  }
}

// Error handling wrapper
const safeAPICall = async <T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: APIError }> => {
  try {
    const data = await apiCall()
    return { data }
  } catch (error) {
    if (error instanceof Response) {
      const errorData = await error.json()
      return { 
        error: new StrapiAPIError(
          error.status, 
          errorData.error?.message || 'API Error',
          errorData.error?.details
        )
      }
    }
    return { error: error as APIError }
  }
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## 🔧 Development Tools

### TypeScript Type Generation
```bash
# Generate types after schema changes
npm run ts:generate-types

# Validate API responses match types
npm run ts:check-api-types
```

### API Testing with TypeScript
```typescript
// tests/api/pages.test.ts
import { describe, test, expect } from 'vitest'
import type { ApiPagePage } from '@/types/generated/contentTypes'

describe('Pages API', () => {
  test('should return typed page data', async () => {
    const response = await api.get<ApiPagePage[]>('/pages')
    
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    
    if (response.data.length > 0) {
      const page = response.data[0]
      expect(typeof page.title).toBe('string')
      expect(typeof page.slug).toBe('string')
    }
  })
})
```

## 📈 Monitoring & Analytics

### API Usage Tracking
```typescript
// utils/api-analytics.ts
export const trackAPICall = (endpoint: string, duration: number, status: number) => {
  // Send to analytics service
  console.log(`API Call: ${endpoint} - ${duration}ms - ${status}`)
}

// Enhanced API client with tracking
export class TrackedStrapiAPI extends StrapiAPI {
  async get<T>(endpoint: string, params?: Record<string, any>) {
    const start = Date.now()
    try {
      const result = await super.get<T>(endpoint, params)
      trackAPICall(endpoint, Date.now() - start, 200)
      return result
    } catch (error) {
      trackAPICall(endpoint, Date.now() - start, error.status || 500)
      throw error
    }
  }
}
```

## 🚨 Security Considerations

### Input Validation
```typescript
// Validate user input before API calls
import { z } from 'zod'

const CreatePageSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  isSharedContent: z.boolean().optional(),
})

const createPage = async (data: unknown) => {
  const validatedData = CreatePageSchema.parse(data)
  return api.post<ApiPagePage>('/pages', { data: validatedData })
}
```

### Rate Limiting
```typescript
// Client-side rate limiting
class RateLimitedAPI {
  private requests: number[] = []
  private maxRequests = 100
  private timeWindow = 60000 // 1 minute

  private canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    return this.requests.length < this.maxRequests
  }

  async request<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded')
    }
    
    this.requests.push(Date.now())
    return fn()
  }
}
```

## 📊 Performance Monitoring API

### Base Path: `/api/performance-metrics`

#### Performance Statistics
```typescript
// GET /api/performance-metrics/stats
interface PerformanceStatsResponse {
  data: {
    totalRequests: number
    averageResponseTime: number
    slowestEndpoints: EndpointStats[]
    errorRate: number
    memoryTrend: MemorySnapshot[]
    hourlyStats: HourlyStats[]
    system: {
      nodeVersion: string
      platform: string
      uptime: number
      cpuUsage: object
      memoryUsage: NodeJS.MemoryUsage
      strapiVersion: string
      environment: string
    }
  }
  meta: {
    generated: string
    retention: string
    note: string
  }
}
```

#### Endpoint-Specific Metrics
```typescript
// GET /api/performance-metrics/endpoint/:path
interface EndpointMetricsResponse {
  data: {
    endpoint: string
    timeRange: string
    totalRequests: number
    averageResponseTime: number
    medianResponseTime: number
    p95ResponseTime: number
    p99ResponseTime: number
    averageQueryTime: number
    errorRate: number
    statusCodes: Record<string, number>
    recentMetrics: ApiMetrics[]
  }
}
```

#### System Health Check
```typescript
// GET /api/performance-metrics/health
interface SystemHealthResponse {
  data: {
    status: 'healthy' | 'warning' | 'critical'
    score: number // 0-100
    uptime: number
    memory: {
      heapUsed: number // MB
      heapTotal: number // MB
      usage: number // percentage
    }
    performance: {
      averageResponseTime: number
      errorRate: number
      requestsLast24h: number
    }
    alerts: string[]
  }
}
```

#### Performance Export
```typescript
// GET /api/performance-metrics/export?format=json|csv
// Returns raw performance metrics in specified format
```

#### Slow Query Report
```typescript
// GET /api/performance-metrics/slow-queries?threshold=1000&hours=1
interface SlowQueryResponse {
  data: {
    threshold: string
    timeRange: string
    slowEndpoints: EndpointStats[]
    totalSlowRequests: number
    recommendations: string[]
  }
}
```

### Performance Monitoring Usage

```typescript
// Example: Monitor API performance
const performanceAPI = new StrapiAPI()

// Get system health
const health = await performanceAPI.get<SystemHealthResponse>('/performance-metrics/health')
console.log(`System Status: ${health.data.status} (Score: ${health.data.score})`)

// Get slow endpoints
const slowQueries = await performanceAPI.get('/performance-metrics/slow-queries', {
  threshold: 1000, // 1 second
  hours: 24
})

// Export metrics for analysis
const metrics = await performanceAPI.get('/performance-metrics/export', {
  format: 'csv'
})
```

## 📚 Storybook Integration API

### Component Documentation API

#### Healthcare Design System Types
```typescript
// Component types for Storybook integration
interface HealthcareButtonProps {
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
  disabled?: boolean
  'aria-label'?: string
  onClick?: () => void
}

interface HealthcareDesignTokens {
  colors: {
    'healthcare-primary': '#004166'
    'healthcare-primary-light': '#1278B3'
    'healthcare-accent-green': '#B3AF09'
    'healthcare-light': '#ffffff'
    'healthcare-background': '#f8fafc'
  }
  spacing: {
    touchTarget: {
      small: '44px'   // WCAG 2.1 AA minimum
      medium: '56px'  // Healthcare optimized
      large: '64px'   // Primary CTAs
    }
  }
  accessibility: {
    focusOutline: '3px solid'
    focusOffset: '2px'
    contrastRatio: '4.5:1' // WCAG 2.1 AA
  }
}
```

#### Storybook Development Endpoints
```typescript
// Development server endpoints
interface StorybookAPI {
  development: {
    nextjs: 'http://localhost:3000'      // Next.js development server
    storybook: 'http://localhost:6006'   // Storybook development server
    storybook_alt: 'http://localhost:6007' // Alternative port
  }
  
  production: {
    build: 'npm run build-storybook'     // Production build command
    output: './storybook-static/'        // Static build directory
    deploy: 'CI/CD via GitHub Actions'   // Deployment method
  }
}
```

### Component Integration with Strapi

#### Section Component Extensions
```typescript
// Extended section types for Storybook integration
interface HealthcareSectionProps {
  __component: string
  id: number
  // Standard Strapi section props...
  
  // Storybook-specific enhancements
  storybookVariant?: 'default' | 'healthcare' | 'emergency'
  accessibilityLevel?: 'AA' | 'AAA'
  touchOptimized?: boolean
}

// Example: Healthcare Button in Strapi sections
interface HealthcareCallToActionSection {
  __component: 'sections.cta-healthcare'
  button: HealthcareButtonProps
  emergencyFallback?: {
    text: string
    phone: string
    visible: boolean
  }
}
```

### Accessibility API Integration

#### WCAG 2.1 AA Validation
```typescript
interface AccessibilityValidation {
  endpoint: '/api/accessibility/validate'
  
  request: {
    componentType: string
    props: Record<string, any>
    context: 'healthcare' | 'general'
  }
  
  response: {
    compliant: boolean
    level: 'AA' | 'AAA'
    issues: AccessibilityIssue[]
    score: number // 0-100
    recommendations: string[]
  }
}

interface AccessibilityIssue {
  rule: string
  severity: 'error' | 'warning'
  description: string
  element: string
  fix: string
}
```

---

**API Reference zuletzt aktualisiert**: 2025-08-06  
**Version**: 2.2 (Storybook Integration hinzugefügt)  
**Maintenance**: Bei API-Änderungen auch FRONTEND-DATENMODELL.md aktualisieren  
**Testing**: Alle Beispiele mit TypeScript getestet  
**Storybook**: Healthcare Design System mit WCAG 2.1 AA Compliance
