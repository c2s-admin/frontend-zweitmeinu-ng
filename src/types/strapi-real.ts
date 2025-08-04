// Real Strapi Data Structure (without attributes wrapper)
// Based on actual API exploration of zweitmeinu-ng site

import { logger } from "@/lib/logger";

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Site Configuration (Real Structure)
export interface RealSiteConfiguration {
  id: number;
  documentId: string;
  siteIdentifier: string;
  domain: string;
  siteName: string;
  tagline?: string;
  brand: string;
  specialty?: string;
  logo?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
      };
      small?: {
        url: string;
        width: number;
        height: number;
      };
      medium?: {
        url: string;
        width: number;
        height: number;
      };
      large?: {
        url: string;
        width: number;
        height: number;
      };
    };
    url: string;
    mime: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  favicon?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    url: string;
    mime: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  locales?: Array<{
    code: string;
    name: string;
    isDefault: boolean;
  }>;
  navigation?: {
    topBar?: {
      enabled: boolean;
      content?: Array<{
        type: string;
        content: string;
        style?: string;
        icon?: string;
      }>;
      backgroundColor?: string;
      textColor?: string;
    };
    socialMedia?: unknown;
    mainNavigation?: Array<{
      id: string;
      url: string;
      label: string;
      icon?: string;
      type: string;
      order: number;
    }>;
    ctaButton?: {
      label?: string;
      url?: string;
      backgroundColor?: string;
      textColor?: string;
      animate?: boolean;
    };
    mobileMenuSettings?: unknown;
  };
  footer?: {
    style?: {
      padding?: {
        top: string;
        bottom: string;
      };
      columnGap?: string;
      linkColor?: string;
      textColor?: string;
      borderColor?: string;
      linkHoverColor?: string;
      backgroundColor?: string;
    };
    columns?: Array<{
      id: string;
      title: string;
      order: number;
      links: Array<{
        url: string;
        label: string;
        type: "internal" | "external" | "action";
        icon?: string;
        badge?: string;
        badgeColor?: string;
        style?: string;
        openInNewTab?: boolean;
        required?: boolean;
        action?: string;
      }>;
    }>;
    copyright?: {
      text: string;
      additionalLinks?: Array<{
        url: string;
        label: string;
        type: "internal" | "external";
      }>;
    };
    newsletter?: {
      title: string;
      enabled: boolean;
      description: string;
      placeholder: string;
      buttonText: string;
      privacyText: string;
      privacyLink: {
        url: string;
        text: string;
      };
      successMessage: string;
      errorMessage: string;
    };
    socialMedia?: {
      title: string;
      enabled: boolean;
      platforms: Array<{
        name: string;
        icon: string;
        url: string;
        color: string;
      }>;
    };
    bottomSection?: {
      logo?: {
        enabled: boolean;
        image: string;
        alt: string;
        link: string;
        width: number;
      };
      description?: {
        enabled: boolean;
        text: string;
      };
      trustBadges?: {
        enabled: boolean;
        items: string[];
      };
      certifications?: {
        enabled: boolean;
        items: Array<{
          name: string;
          image: string;
          link?: string | null;
        }>;
      };
    };
    emergencyBanner?: {
      enabled: boolean;
      text: string;
      buttonText: string;
      phone: string;
      position: string;
      backgroundColor: string;
      textColor: string;
    };
  };
  contact?: unknown;
  socialMedia?: unknown;
  openingHours?: {
    id: number;
    name?: string;
    hours?: Array<{
      day: string;
      openTime?: string;
      closeTime?: string;
      isClosed?: boolean;
    }>;
    emergencyHours?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Page (Real Structure)
export interface RealPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  isSharedContent?: boolean;
  sections?: RealDynamicZoneSection[];
  seo?: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Dynamic Zone Section (Real Structure)
export interface RealDynamicZoneSection {
  __component: string;
  id: number;
}

// Hero Carousel (Real Structure)
export interface RealHeroCarousel extends RealDynamicZoneSection {
  __component: "sections.hero-carousel";
  autoplay: boolean;
  autoplayInterval: number;
  showDots?: boolean;
  showArrows?: boolean;
  transitionType?: string;
  transitionDuration?: number;
  pauseOnHover?: boolean;
  infiniteLoop?: boolean;
  height?: string;
  mobileHeight?: string;
  preloadImages?: boolean;
  lazyLoad?: boolean;
  slides: RealHeroSlide[];
}

export interface RealHeroSlide {
  id: number;
  subtitle?: string;
  description?: string | null;
  backgroundGradient?: string;
  customGradient?: string;
  textAlignment?: string;
  overlayOpacity?: number;
  titleLines: RealTitleLine[];
  backgroundImage?: unknown | null;
  badge?: RealBadge;
  ctaButtons?: RealCTAButton[];
}

export interface RealTitleLine {
  id: number;
  text: string;
  isHighlighted?: boolean;
  highlightColor?: string;
  fontSize?: string;
  fontWeight?: string;
}

export interface RealBadge {
  id: number;
  text: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface RealCTAButton {
  id: number;
  text: string;
  href: string;
  variant?: string;
  isExternal?: boolean;
  icon?: string;
}

// Type guards
export function isRealHeroCarousel(
  section: RealDynamicZoneSection,
): section is RealHeroCarousel {
  return section.__component === "sections.hero-carousel";
}

// Conversion functions to transform real data to expected format
export function convertRealSiteToExpected(
  realSite: RealSiteConfiguration,
): unknown {
  logger.info("🔄 Converting real site config:", realSite);
  const STRAPI_ORIGIN = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(
    /\/api$/,
    "",
  );

  return {
    id: realSite.id,
    attributes: {
      siteIdentifier: realSite.siteIdentifier,
      domain: realSite.domain,
      siteName: realSite.siteName,
      tagline: realSite.tagline,
      brand: realSite.brand,
      specialty: realSite.specialty,
      logo: realSite.logo
        ? {
            data: {
              attributes: {
                url: `${STRAPI_ORIGIN}${realSite.logo.url}`,
                alternativeText:
                  realSite.logo.alternativeText ||
                  realSite.logo.name ||
                  `${realSite.siteName} Logo`,
                width: realSite.logo.width,
                height: realSite.logo.height,
                // Use medium format for header if available
                formats: realSite.logo.formats,
              },
            },
          }
        : undefined,
      favicon: realSite.favicon
        ? {
            data: {
              attributes: {
                url: `${STRAPI_ORIGIN}${realSite.favicon.url}`,
                alternativeText: realSite.favicon.alternativeText || "Favicon",
              },
            },
          }
        : undefined,
      navigation: realSite.navigation
        ? {
            main:
              realSite.navigation.mainNavigation?.map(
                (
                  item: {
                    id: string
                    label: string
                    url: string
                    type?: string
                    subItems?: Array<{ label: string; url: string }>
                  },
                  index: number,
                ) => ({
                  id: parseInt(item.id.replace(/\D/g, "")) || index + 1,
                  label: item.label,
                  href: item.url,
                  isExternal: item.type === "external",
                  children:
                    item.subItems?.map(
                      (subItem: { label: string; url: string }, subIndex: number) => ({
                        id: subIndex + 1,
                        label: subItem.label,
                        href: subItem.url,
                        isExternal: false,
                      }),
                    ) || undefined,
                }),
              ) || [],
            footer: [], // Legacy footer format - now using the new footer structure
          }
        : undefined,
      contact: {
        id: 1,
        email:
          realSite.navigation?.topBar?.content?.find(
            (item) => item.type === "email",
          )?.content || "kontakt@zweitmeinu.ng",
        phone:
          realSite.navigation?.topBar?.content?.find(
            (item) => item.type === "phone",
          )?.content || "+49 800 80 44 100",
        emergencyHotline:
          realSite.navigation?.topBar?.content?.find(
            (item) => item.type === "phone",
          )?.content || "+49 800 80 44 100",
        openingHours: realSite.openingHours
          ? {
              regular: realSite.openingHours.hours?.reduce(
                (
                  acc: Record<string, string>,
                  hour: { day: string; isClosed?: boolean; openTime?: string; closeTime?: string },
                ) => {
                  const dayKey = hour.day.toLowerCase();
                  acc[dayKey] = hour.isClosed
                    ? "geschlossen"
                    : `${hour.openTime}-${hour.closeTime}`;
                  return acc;
                },
                {} as Record<string, string>,
              ) || {
                monday: "09:00-16:00",
                tuesday: "09:00-16:00",
                wednesday: "09:00-16:00",
                thursday: "09:00-16:00",
                friday: "09:00-16:00",
                saturday: "geschlossen",
                sunday: "geschlossen",
              },
              emergency:
                realSite.openingHours.emergencyHours || "24/7 Notfallberatung",
            }
          : {
              regular: {
                monday: "09:00-16:00",
                tuesday: "09:00-16:00",
                wednesday: "09:00-16:00",
                thursday: "09:00-16:00",
                friday: "09:00-16:00",
                saturday: "geschlossen",
                sunday: "geschlossen",
              },
              emergency: "24/7 Notfallberatung",
            },
        address: "Complex Care Solutions GmbH\nBottrop, Deutschland",
      },
      socialMedia: realSite.socialMedia,
      // Convert top bar data
      topBar: realSite.navigation?.topBar
        ? {
            enabled: realSite.navigation.topBar.enabled || false,
            content: realSite.navigation.topBar.content || [],
            backgroundColor:
              realSite.navigation.topBar.backgroundColor || "#004166",
            textColor: realSite.navigation.topBar.textColor || "#ffffff",
          }
        : undefined,
      // Convert CTA button data
      ctaButton: realSite.navigation?.ctaButton
        ? {
            label:
              realSite.navigation.ctaButton.label || "Notfall-Zweitmeinung",
            url: realSite.navigation.ctaButton.url || "/notfall",
            backgroundColor:
              realSite.navigation.ctaButton.backgroundColor || "#B3AF09",
            textColor: realSite.navigation.ctaButton.textColor || "#ffffff",
            animate: realSite.navigation.ctaButton.animate || false,
          }
        : undefined,
      // Convert footer data - NEW!
      footer: realSite.footer
        ? {
            style: realSite.footer.style,
            columns:
              realSite.footer.columns?.sort((a, b) => a.order - b.order) || [],
            copyright: realSite.footer.copyright,
            newsletter: realSite.footer.newsletter,
            socialMedia: realSite.footer.socialMedia,
            bottomSection: realSite.footer.bottomSection,
            emergencyBanner: realSite.footer.emergencyBanner,
          }
        : undefined,
      createdAt: realSite.createdAt,
      updatedAt: realSite.updatedAt,
      publishedAt: realSite.publishedAt,
    },
  };
}

export function convertRealPageToExpected(realPage: RealPage): unknown {
  logger.info("🔄 Converting real page:", realPage.title);
  logger.info("📦 Real sections:", realPage.sections);

  // Ensure sections exist and are valid
  const validSections = (realPage.sections || []).filter(
    (section) =>
      section &&
      typeof section === "object" &&
      section.__component &&
      typeof section.id === "number" &&
      section.id > 0,
  );

  logger.info("✅ Valid sections after filtering:", validSections.length);

  return {
    id: realPage.id,
    attributes: {
      title: realPage.title,
      slug: realPage.slug,
      sections: validSections,
      seo: realPage.seo,
      createdAt: realPage.createdAt,
      updatedAt: realPage.updatedAt,
      publishedAt: realPage.publishedAt,
    },
  };
}

export function convertRealHeroSlideToExpected(
  realSlide: RealHeroSlide,
): unknown {
  logger.info("🔄 Converting real hero slide:", realSlide.id);

  return {
    id: realSlide.id,
    badge: realSlide.badge
      ? {
          text: realSlide.badge.text,
          icon: realSlide.badge.icon,
        }
      : undefined,
    titleLines:
      realSlide.titleLines?.map((line) => ({
        id: line.id,
        text: line.text,
        highlight: line.isHighlighted || false,
        color: line.highlightColor,
      })) || [],
    subtitle: realSlide.subtitle,
    description: realSlide.description,
    backgroundImage: realSlide.backgroundImage,
    overlayOpacity: realSlide.overlayOpacity,
    ctaButtons: realSlide.ctaButtons || [],
  };
}

// Helper function to safely validate and convert sections
export function validateAndConvertSections(
  sections: unknown[],
): RealDynamicZoneSection[] {
  if (!Array.isArray(sections)) {
    logger.warn("⚠️ Sections is not an array:", sections);
    return [];
  }

  return sections
    .filter((section): section is RealDynamicZoneSection => {
      if (!section || typeof section !== "object") {
        logger.warn("⚠️ Invalid section (not object):", section);
        return false;
      }

      const sectionObj = section as Record<string, unknown>;

      if (typeof sectionObj.__component !== "string") {
        logger.warn("⚠️ Invalid section (__component missing):", section);
        return false;
      }

      if (typeof sectionObj.id !== "number" || sectionObj.id <= 0) {
        logger.warn("⚠️ Invalid section (invalid id):", section);
        return false;
      }

      return true;
    })
    .map((section) => {
      logger.info("✅ Valid section:", section.__component, section.id);
      return section;
    });
}
