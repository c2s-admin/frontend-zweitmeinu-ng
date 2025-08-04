// Strapi Response Types
export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiMedia {
  id: number
  attributes: {
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: {
      thumbnail?: MediaFormat
      small?: MediaFormat
      medium?: MediaFormat
      large?: MediaFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    provider: string
    createdAt: string
    updatedAt: string
  }
}

export interface MediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  url: string
}

// Site Configuration
export interface SiteConfiguration {
  id: number
  attributes: {
    siteIdentifier: string
    domain: string
    siteName: string
    tagline?: string
    brand: 'complexcare' | 'zweitmeinung' | 'portal'
    specialty?: string
    logo?: {
      data: StrapiMedia
    }
    favicon?: {
      data: StrapiMedia
    }
    navigation?: {
      main: NavItem[]
      footer: FooterSection[]
    }
    theme?: ThemeConfig
    contact?: ContactInfo
    socialMedia?: SocialMediaLinks
    topBar?: {
      enabled: boolean
      content?: Array<{
        type: string
        content: string
        style?: string
        icon?: string
      }>
      backgroundColor?: string
      textColor?: string
    }
    ctaButton?: {
      label?: string
      url?: string
      backgroundColor?: string
      textColor?: string
      animate?: boolean
    }
    openingHours?: {
      id: number
      name?: string
      hours?: Array<{
        day: string
        openTime?: string
        closeTime?: string
        isClosed?: boolean
      }>
      emergencyHours?: string
      notes?: string
    }
    footer?: {
      style?: {
        padding?: {
          top: string
          bottom: string
        }
        columnGap?: string
        linkColor?: string
        textColor?: string
        borderColor?: string
        linkHoverColor?: string
        backgroundColor?: string
      }
      columns?: Array<{
        id: string
        title: string
        order: number
        links: Array<{
          url: string
          label: string
          type: 'internal' | 'external' | 'action'
          icon?: string
          badge?: string
          badgeColor?: string
          style?: string
          openInNewTab?: boolean
          required?: boolean
          action?: string
        }>
      }>
      copyright?: {
        text: string
        additionalLinks?: Array<{
          url: string
          label: string
          type: 'internal' | 'external'
        }>
      }
      newsletter?: {
        title: string
        enabled: boolean
        description: string
        placeholder: string
        buttonText: string
        privacyText: string
        privacyLink: {
          url: string
          text: string
        }
        successMessage: string
        errorMessage: string
      }
      socialMedia?: {
        title: string
        enabled: boolean
        platforms: Array<{
          name: string
          icon: string
          url: string
          color: string
        }>
      }
      bottomSection?: {
        logo?: {
          enabled: boolean
          image: string
          alt: string
          link: string
          width: number
        }
        description?: {
          enabled: boolean
          text: string
        }
        trustBadges?: {
          enabled: boolean
          items: string[]
        }
        certifications?: {
          enabled: boolean
          items: Array<{
            name: string
            image: string
            link?: string | null
          }>
        }
      }
      emergencyBanner?: {
        enabled: boolean
        text: string
        buttonText: string
        phone: string
        position: string
        backgroundColor: string
        textColor: string
      }
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface NavItem {
  id: number
  label: string
  href: string
  isExternal?: boolean
  children?: NavItem[]
}

export interface FooterSection {
  id: number
  title: string
  links: Array<{
    id: number
    label: string
    href: string
    isExternal?: boolean
  }>
}

export interface ThemeConfig {
  id: number
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  customCSS?: string
}

export interface ContactInfo {
  id: number
  email?: string
  phone?: string
  address?: string
  emergencyPhone?: string
  emergencyHotline?: string
  fax?: string
  openingHours?: {
    regular?: Record<string, string>
    emergency?: string
    holidays?: string
  }
}

export interface SocialMediaLinks {
  id: number
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
}

// Page Types
export interface Page {
  id: number
  attributes: {
    title: string
    slug: string
    description?: string
    sections: DynamicZoneSection[]
    seo?: SEOComponent
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface SEOComponent {
  id: number
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: {
    data: StrapiMedia
  }
  twitterCard?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

// Dynamic Zone Sections
export interface DynamicZoneSection {
  __component: string
  id: number
}

// Hero Section Types
export interface HeroSection extends DynamicZoneSection {
  __component: 'sections.hero'
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: {
    data: StrapiMedia
  }
  ctaButtons?: CTAButton[]
  overlayOpacity?: number
}

export interface HeroCarousel extends DynamicZoneSection {
  __component: 'sections.hero-carousel'
  slides: HeroSlide[]
  autoplay?: boolean
  autoplayInterval?: number
}

export interface HeroSlide {
  id: number
  badge?: {
    text: string
    icon?: string
  }
  titleLines: Array<{
    id: number
    text: string
    highlight?: boolean
    color?: string
  }>
  subtitle?: string
  description?: string
  backgroundImage?: {
    data: StrapiMedia
  }
  overlayOpacity?: number
  ctaButtons?: CTAButton[]
}

export interface CTAButton {
  id: number
  text: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  isExternal?: boolean
  icon?: string
}

// Medical Specialties
export interface MedicalSpecialtiesGrid extends DynamicZoneSection {
  __component: 'sections.medical-specialties-grid'
  title?: string
  subtitle?: string
  specialties: MedicalSpecialty[]
  columns?: number
}

export interface MedicalSpecialty {
  id: number
  name: string
  description?: string
  icon?: string
  image?: {
    data: StrapiMedia
  }
  href?: string
}

// Services Grid
export interface ServicesGrid extends DynamicZoneSection {
  __component: 'sections.services-grid'
  title?: string
  subtitle?: string
  services: Service[]
  columns?: number
}

export interface Service {
  id: number
  title: string
  description?: string
  icon?: string
  image?: {
    data: StrapiMedia
  }
  features?: string[]
  price?: {
    amount: number
    currency: string
    period?: string
  }
  ctaButton?: CTAButton
}

// Text Block
export interface TextBlock extends DynamicZoneSection {
  __component: 'sections.text-block'
  title?: string
  content: string
  alignment?: 'left' | 'center' | 'right'
  backgroundColor?: string
  textColor?: string
}

// Testimonials
export interface TestimonialsSection extends DynamicZoneSection {
  __component: 'sections.testimonials'
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  layout?: 'grid' | 'carousel'
}

export interface Testimonial {
  id: number
  content: string
  author: {
    name: string
    title?: string
    company?: string
    avatar?: {
      data: StrapiMedia
    }
  }
  rating?: number
}

// News Section
export interface NewsSection extends DynamicZoneSection {
  __component: 'sections.news'
  title?: string
  subtitle?: string
  articles: Article[]
  showMore?: boolean
  moreButtonText?: string
  moreButtonHref?: string
}

export interface Article {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt?: string
    content: string
    publishedAt: string
    featuredImage?: {
      data: StrapiMedia
    }
    author?: {
      data: Author
    }
    categories?: {
      data: Category[]
    }
  }
}

export interface Author {
  id: number
  attributes: {
    name: string
    bio?: string
    avatar?: {
      data: StrapiMedia
    }
  }
}

export interface Category {
  id: number
  attributes: {
    name: string
    slug: string
    description?: string
  }
}

// FAQ Section
export interface FAQSection extends DynamicZoneSection {
  __component: 'sections.faq'
  title?: string
  subtitle?: string
  faqs: FAQ[]
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category?: string
}

// Contact Form
export interface ContactForm extends DynamicZoneSection {
  __component: 'sections.contact-form'
  title?: string
  subtitle?: string
  fields: FormField[]
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
}

export interface FormField {
  id: number
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  options?: Array<{
    label: string
    value: string
  }>
}

// Stats Section
export interface StatsSection extends DynamicZoneSection {
  __component: 'sections.stats'
  title?: string
  subtitle?: string
  stats?: Array<{
    id: number
    number: string
    label: string
    icon?: string
  }>
}

// Team Section
export interface TeamSection extends DynamicZoneSection {
  __component: 'sections.team'
  title?: string
  subtitle?: string
  teamMembers?: Array<{
    id: number
    name: string
    position: string
    bio?: string
    image?: {
      data: StrapiMedia
    }
  }>
}

// CTA Section
export interface CTASection extends DynamicZoneSection {
  __component: 'sections.cta'
  title?: string
  subtitle?: string
  description?: string
  ctaButtons?: CTAButton[]
  backgroundColor?: string
}

// Utility types for type guards
export type AnyStrapiSection =
  | HeroSection
  | HeroCarousel
  | MedicalSpecialtiesGrid
  | ServicesGrid
  | TextBlock
  | TestimonialsSection
  | NewsSection
  | FAQSection
  | ContactForm
  | StatsSection
  | TeamSection
  | CTASection
