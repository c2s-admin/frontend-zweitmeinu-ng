import type {
  StrapiResponse,
  Page,
  SEOComponent,
  StrapiMedia,
  Service,
} from "@/types/strapi";
import { logger } from "@/lib/logger";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";

// FAQ Data Types
export interface FAQCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface FAQ {
  id: number;
  documentId: string;
  question: string;
  slug: string;
  answer: string;
  shortAnswer?: string;
  tags?: string[];
  priority: "low" | "medium" | "high" | "featured";
  helpfulCount: number;
  notHelpfulCount: number;
  videoUrl?: string;
  lastUpdated?: string;
  attachments?: StrapiMedia[];
  seo?: SEOComponent;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category?: FAQCategory;
  relatedServices?: Service[];
  relatedExperts?: Expert[];
  relatedFaqs?: FAQ[];
}

export interface FAQPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  sections: Page["attributes"]["sections"];
  seo?: SEOComponent;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Search Types
export interface FAQSearchResult extends FAQ {
  score: number;
  matchType: "question" | "answer" | "both";
  highlightedQuestion?: string;
  highlightedAnswer?: string;
}

export interface FAQSearchOptions {
  term: string;
  categories?: string[];
  priority?: string[];
  limit?: number;
  includeAnswers?: boolean;
}

export interface FAQSearchResponse {
  results: FAQSearchResult[];
  total: number;
  searchTerm: string;
  suggestions?: string[];
  categories: { [key: string]: number };
}

export interface Expert {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

// Enhanced Categorization Strategy Types
export interface CategorizationStats {
  totalFAQs: number;
  strapiRelations: number;
  keywordBased: number;
  uncategorized: number;
  method: "hybrid" | "relations-only" | "keywords-only";
  confidence: number;
  apiHealth: "healthy" | "degraded" | "failed";
  cacheHits: number;
  processingTime: number;
  categoryDistribution: { [key: string]: number };
}

export interface CategorizationQuality {
  overallScore: number;
  relationsCoverage: number;
  keywordAccuracy: number;
  categoryCoverage: number;
  recommendations: string[];
}

// Enhanced caching system
interface CachedCategorizationResult {
  faqId: number;
  categorySlug: string | null;
  method: "relations" | "keywords";
  confidence: number;
  timestamp: number;
  ttl: number;
}

// Enhanced caching system
const CATEGORIZATION_CACHE = new Map<number, CachedCategorizationResult>();
type FAQDataCacheEntry = { data: FAQ[]; timestamp: number; ttl: number }
const FAQ_DATA_CACHE = new Map<string, FAQDataCacheEntry>();
const FAQ_CATEGORIES_CACHE = new Map<string, { data: FAQCategory[]; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CATEGORIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for categories (change less often)

// Cache cleanup function (runs periodically)
function cleanupExpiredCaches() {
  const now = Date.now();
  
  // Clean categorization cache
  for (const [key, value] of CATEGORIZATION_CACHE.entries()) {
    if (now - value.timestamp > value.ttl) {
      CATEGORIZATION_CACHE.delete(key);
    }
  }
  
  // Clean FAQ data cache
  for (const [key, value] of FAQ_DATA_CACHE.entries()) {
    if (now - value.timestamp > value.ttl) {
      FAQ_DATA_CACHE.delete(key);
    }
  }
  
  // Clean categories cache
  for (const [key, value] of FAQ_CATEGORIES_CACHE.entries()) {
    if (now - value.timestamp > value.ttl) {
      FAQ_CATEGORIES_CACHE.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCaches, 5 * 60 * 1000);

// Export cache stats for monitoring
export function getCacheStats() {
  const now = Date.now();
  return {
    categorization: {
      total: CATEGORIZATION_CACHE.size,
      expired: Array.from(CATEGORIZATION_CACHE.values()).filter(v => now - v.timestamp > v.ttl).length
    },
    faqData: {
      total: FAQ_DATA_CACHE.size,
      expired: Array.from(FAQ_DATA_CACHE.values()).filter(v => now - v.timestamp > v.ttl).length
    },
    categories: {
      total: FAQ_CATEGORIES_CACHE.size,
      expired: Array.from(FAQ_CATEGORIES_CACHE.values()).filter(v => now - v.timestamp > v.ttl).length
    }
  };
}

// Enhanced Category Keywords Mapping with confidence scores
const CATEGORY_KEYWORDS = {
  "zweitmeinung-gallenblase": {
    primary: ["gallenblase", "gallenstein", "cholezystektomie"],
    secondary: [
      "gallen",
      "gallensteine",
      "gallenblasenentfernung",
      "gallenkolik",
      "cholangitis",
    ],
    confidence: 0.9,
  },
  "zweitmeinung-nephrologie": {
    primary: ["niere", "dialyse", "niereninsuffizienz"],
    secondary: [
      "nieren",
      "nierenerkrankung",
      "nephro",
      "transplantation",
      "hämodialyse",
      "peritonealdialyse",
      "nierenversagen",
    ],
    confidence: 0.85,
  },
  "zweitmeinung-kardiologie": {
    primary: ["herz", "herzinfarkt", "bypass"],
    secondary: [
      "kardio",
      "katheter",
      "herzkatheter",
      "stent",
      "koronararterien",
      "angioplastie",
      "herzrhythmus",
      "schrittmacher",
    ],
    confidence: 0.9,
  },
  "zweitmeinung-onkologie": {
    primary: ["krebs", "tumor", "chemotherapie"],
    secondary: [
      "onko",
      "chemo",
      "bestrahlung",
      "strahlentherapie",
      "karzinom",
      "metastasen",
      "biopsie",
      "malignom",
      "zytostatika",
    ],
    confidence: 0.95,
  },
  "zweitmeinung-intensivmedizin": {
    primary: ["intensiv", "intensivstation", "beatmung"],
    secondary: [
      "notfall",
      "reanimation",
      "sepsis",
      "schock",
      "koma",
      "icu",
      "lebenserhaltung",
      "organversagen",
    ],
    confidence: 0.8,
  },
  "zweitmeinung-schilddruese": {
    primary: ["schilddrüse", "thyroid", "thyreoidektomie"],
    secondary: [
      "schild",
      "struma",
      "schilddrüsenknoten",
      "tsh",
      "hyperthyreose",
      "hypothyreose",
      "autonomie",
    ],
    confidence: 0.85,
  },
  "allgemeine-fragen-zur-zweitmeinung": {
    primary: ["zweitmeinung", "gutachten", "experten", "was", "wie", "wann", "kosten", "ablauf"],
    secondary: [
      "bringt",
      "hilft",
      "sinnvoll",
      "notwendig",
      "wichtig",
      "verfahren",
      "beratung",
      "meinung",
      "einschätzung",
      "diagnose",
      "behandlung",
      "therapie",
      "unterlagen",
      "dokumente",
      "zeit",
      "dauer",
      "experte",
      "arzt",
    ],
    confidence: 0.5, // Lower confidence for broader matching
  },
};

// API Functions
export async function getFAQPage(): Promise<FAQPage | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/pages?filters[slug][$eq]=faq&populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      logger.error("Failed to fetch FAQ page:", response.statusText);
      return null;
    }

    const data: StrapiResponse<FAQPage[]> = await response.json();
    logger.info("✅ FAQ Page loaded:", data.data?.[0]?.title);

    return data.data?.[0] || null;
  } catch (error) {
    logger.error("Error fetching FAQ page:", error);
    return null;
  }
}

export async function getFAQCategories(): Promise<FAQCategory[]> {
  const cacheKey = "faq-categories-all";
  const cached = FAQ_CATEGORIES_CACHE.get(cacheKey);
  
  // Check cache first
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    logger.info("📦 FAQ Categories from cache:", cached.data.length);
    return cached.data;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/faq-categories?sort=order:asc&populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      logger.error("Failed to fetch FAQ categories:", response.statusText);
      // Return cached data if available, even if expired
      return cached?.data || [];
    }

    const data: StrapiResponse<FAQCategory[]> = await response.json();
    const categories = data.data || [];
    
    // Cache the result
    FAQ_CATEGORIES_CACHE.set(cacheKey, {
      data: categories,
      timestamp: Date.now(),
      ttl: CATEGORIES_CACHE_TTL
    });
    
    logger.info("✅ FAQ Categories loaded fresh:", categories.length);
    return categories;
  } catch (error) {
    logger.error("Error fetching FAQ categories:", error);
    // Return cached data if available, even if expired
    return cached?.data || [];
  }
}

export async function getFAQs(limit = 25): Promise<FAQ[]> {
  const cacheKey = `faqs-list-${limit}`;
  const cached = FAQ_DATA_CACHE.get(cacheKey);
  
  // Check cache first
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    logger.info("📦 FAQs from cache:", cached.data.length);
    return cached.data;
  }

  try {
    // Simplified populate for Strapi v5 compatibility - use basic populate=*
    const response = await fetch(
      `${BASE_URL}/faqs?sort=priority:desc,helpfulCount:desc&pagination[limit]=${limit}&populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      logger.error("Failed to fetch FAQs:", response.statusText);
      // Return cached data if available, even if expired
      return cached?.data || [];
    }

    const data: StrapiResponse<FAQ[]> = await response.json();
    const faqs = data.data || [];
    
    // Cache the result
    FAQ_DATA_CACHE.set(cacheKey, {
      data: faqs,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    });
    
    logger.info("✅ FAQs loaded fresh:", faqs.length);
    return faqs;
  } catch (error) {
    logger.error("Error fetching FAQs:", error);
    // Return cached data if available, even if expired
    return cached?.data || [];
  }
}

export async function getFAQsByCategory(
  categorySlug: string,
  limit = 10,
): Promise<FAQ[]> {
  const startTime = Date.now();

  try {
    // Enhanced Strapi category relations test with detailed logging
    logger.info(`🔍 Enhanced category test for ${categorySlug}...`);

    // Try comprehensive Strapi filter approaches
    const filterApproaches = [
      {
        query: `filters[category][slug][$eq]=${categorySlug}`,
        description: "by category slug exact match",
      },
      {
        query: `filters[category][documentId][$eq]=${categorySlug}`,
        description: "by category documentId",
      },
      {
        query: `filters[category][name][$containsi]=${categorySlug.replace(/[-_]/g, " ")}`,
        description: "by category name contains",
      },
      {
        query: `filters[category][id][$in]=${categorySlug}`,
        description: "by category ID (if numeric)",
      },
    ];

    let strapiFilteredFAQs: FAQ[] = [];
    let successfulMethod = "";

    for (const approach of filterApproaches) {
      try {
        logger.info(`   🔎 Trying: ${approach.description}...`);
        const response = await fetch(
          `${BASE_URL}/faqs?${approach.query}&sort=priority:desc,helpfulCount:desc&pagination[limit]=${limit}&populate=category`,
          {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          },
        );

        if (response.ok) {
          const data: StrapiResponse<FAQ[]> = await response.json();
          if (data.data && data.data.length > 0) {
            strapiFilteredFAQs = data.data;
            successfulMethod = approach.description;
            logger.info(
              `   ✅ SUCCESS via ${approach.description}: ${strapiFilteredFAQs.length} FAQs found`,
            );

            // Log the category relations found
            strapiFilteredFAQs.forEach((faq, i) => {
              if (faq.category) {
                logger.info(
                  `     FAQ ${i + 1}: ${faq.category.name} (${faq.category.slug})`,
                );
              }
            });
            break;
          } else {
            logger.info(`     ⚪ No results via ${approach.description}`);
          }
        } else {
          logger.info(
            `     ❌ Failed via ${approach.description}: ${response.status}`,
          );
        }
      } catch (error) {
        logger.info(
          `     ⚠️ Error via ${approach.description}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    // If Strapi relations worked, use them
    if (strapiFilteredFAQs.length > 0) {
      const processingTime = Date.now() - startTime;
      logger.info(
        `🎯 API Relations SUCCESS for ${categorySlug}: ${strapiFilteredFAQs.length} FAQs (${processingTime}ms) via ${successfulMethod}`,
      );
      return strapiFilteredFAQs;
    }

    // Enhanced fallback to keyword-based filtering
    logger.info(
      `🔄 API relations failed for ${categorySlug}, using enhanced keyword categorization...`,
    );

    const allFAQs = await getFAQs(100); // Get more FAQs
    const categoryKeywords =
      CATEGORY_KEYWORDS[categorySlug as keyof typeof CATEGORY_KEYWORDS];

    if (!categoryKeywords) {
      logger.warn(`❌ No keywords defined for category: ${categorySlug}`);
      return [];
    }

    const { primary, secondary, confidence } = categoryKeywords;
    const keywordFilteredFAQs: Array<FAQ & { matchScore: number }> = [];

    allFAQs.forEach((faq) => {
      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      let score = 0;

      // Enhanced keyword matching
      primary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });

      secondary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (score > 0) {
        keywordFilteredFAQs.push({ ...faq, matchScore: score });
        logger.info(`   🔤 Keyword match: FAQ ${faq.id} score=${score}`);
      }
    });

    // Sort by match score, then priority, then helpful count
    const sortedFAQs = keywordFilteredFAQs
      .sort((a, b) => {
        if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;

        const priorityOrder = { featured: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];

        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.helpfulCount - a.helpfulCount;
      })
      .slice(0, limit)
      .map(({ matchScore: _matchScore, ...faq }) => faq); // Remove matchScore from final result

    const processingTime = Date.now() - startTime;
    logger.info(
      `✅ Keyword categorization for ${categorySlug}: ${sortedFAQs.length} FAQs (${processingTime}ms, confidence: ${confidence})`,
    );

    return sortedFAQs;
  } catch (error) {
    logger.error("Error fetching FAQs by category:", error);
    return [];
  }
}

// Search Functions
export async function searchFAQs(
  searchTerm: string,
  limit = 20,
): Promise<FAQ[]> {
  const cacheKey = `faq-search-${searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${limit}`;
  const cached = FAQ_DATA_CACHE.get(cacheKey);
  
  // Check cache first (shorter TTL for search results)
  const searchCacheTTL = 2 * 60 * 1000; // 2 minutes for search results
  if (cached && Date.now() - cached.timestamp < searchCacheTTL) {
    logger.info("📦 Search results from cache:", cached.data.length, "for term:", searchTerm);
    return cached.data;
  }

  try {
    const encodedSearch = encodeURIComponent(searchTerm);
    const response = await fetch(
      `${BASE_URL}/faqs?filters[question][$containsi]=${encodedSearch}&sort=priority:desc,helpfulCount:desc&pagination[limit]=${limit}&populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      logger.error("Failed to search FAQs:", response.statusText);
      // Return cached data if available, even if expired
      return cached?.data || [];
    }

    const data: StrapiResponse<FAQ[]> = await response.json();
    const searchResults = data.data || [];
    
    // Cache search results
    FAQ_DATA_CACHE.set(cacheKey, {
      data: searchResults,
      timestamp: Date.now(),
      ttl: searchCacheTTL
    });
    
    logger.info("✅ FAQ search results fresh:", searchResults.length, "for term:", searchTerm);
    return searchResults;
  } catch (error) {
    logger.error("Error searching FAQs:", error);
    // Return cached data if available, even if expired
    return cached?.data || [];
  }
}

export async function advancedFAQSearch(
  options: FAQSearchOptions,
): Promise<FAQSearchResponse> {
  try {
    const {
      term,
      limit = 20,
      includeAnswers = true,
    } = options;

    const encodedTerm = encodeURIComponent(term);
    const questionQuery = `filters[question][$containsi]=${encodedTerm}`;

    const questionResponse = await fetch(
      `${BASE_URL}/faqs?${questionQuery}&sort=priority:desc,helpfulCount:desc&pagination[limit]=${limit}&populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    let questionResults: FAQ[] = [];
    if (questionResponse.ok) {
      const questionData: StrapiResponse<FAQ[]> = await questionResponse.json();
      questionResults = questionData.data || [];
    }

    let answerResults: FAQ[] = [];
    if (includeAnswers) {
      const answerQuery = `filters[answer][$containsi]=${encodedTerm}`;
      const answerResponse = await fetch(
        `${BASE_URL}/faqs?${answerQuery}&sort=priority:desc,helpfulCount:desc&pagination[limit]=${limit}&populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (answerResponse.ok) {
        const answerData: StrapiResponse<FAQ[]> = await answerResponse.json();
        answerResults = answerData.data || [];
      }
    }

    const allResults = new Map<number, FAQSearchResult>();

    questionResults.forEach((faq) => {
      const searchResult: FAQSearchResult = {
        ...faq,
        score: calculateSearchScore(faq, term, "question"),
        matchType: "question",
        highlightedQuestion: highlightText(faq.question, term),
        highlightedAnswer: faq.answer,
      };
      allResults.set(faq.id, searchResult);
    });

    answerResults.forEach((faq) => {
      if (allResults.has(faq.id)) {
        const existing = allResults.get(faq.id)!;
        existing.matchType = "both";
        existing.score = Math.max(
          existing.score,
          calculateSearchScore(faq, term, "answer"),
        );
        existing.highlightedAnswer = highlightText(faq.answer, term);
      } else {
        const searchResult: FAQSearchResult = {
          ...faq,
          score: calculateSearchScore(faq, term, "answer"),
          matchType: "answer",
          highlightedQuestion: faq.question,
          highlightedAnswer: highlightText(faq.answer, term),
        };
        allResults.set(faq.id, searchResult);
      }
    });

    const sortedResults = Array.from(allResults.values()).sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.priority !== b.priority) {
        const priorityOrder = { featured: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.helpfulCount - a.helpfulCount;
    });

    const categoryDistribution: { [key: string]: number } = {};
    sortedResults.forEach((result) => {
      const matchedCategory =
        intelligentCategorizeFrequentlyAskedQuestion(result);
      if (matchedCategory) {
        categoryDistribution[matchedCategory] =
          (categoryDistribution[matchedCategory] || 0) + 1;
      }
    });

    const suggestions = generateSearchSuggestions(term, sortedResults);

    logger.info("✅ Advanced FAQ search completed:", {
      term,
      totalResults: sortedResults.length,
      questionMatches: questionResults.length,
      answerMatches: answerResults.length,
    });

    return {
      results: sortedResults.slice(0, limit),
      total: sortedResults.length,
      searchTerm: term,
      suggestions,
      categories: categoryDistribution,
    };
  } catch (error) {
    logger.error("Error in advanced FAQ search:", error);
    return {
      results: [],
      total: 0,
      searchTerm: options.term,
      suggestions: [],
      categories: {},
    };
  }
}

// Enhanced categorization analysis with detailed metrics
export function analyzeCategorizationStrategy(
  faqs: FAQ[],
): CategorizationStats {
  const startTime = Date.now();
  let strapiRelations = 0;
  let keywordBased = 0;
  let uncategorized = 0;
  const cacheHits = CATEGORIZATION_CACHE.size;
  const categoryDistribution: { [key: string]: number } = {};

  let relationQuality = 0;
  let totalFAQsChecked = 0;

  faqs.forEach((faq) => {
    totalFAQsChecked++;

    // Enhanced API relation detection
    if (faq.category && faq.category.slug && faq.category.name) {
      strapiRelations++;
      relationQuality += 1.0;
      categoryDistribution[faq.category.slug] =
        (categoryDistribution[faq.category.slug] || 0) + 1;
      logger.info(
        `🎯 API Relation: FAQ ${faq.id} → ${faq.category.name} (${faq.category.slug})`,
      );
    } else {
      const keywordResult = categorizeByKeywordsEnhanced(faq);
      if (keywordResult) {
        keywordBased++;
        relationQuality += keywordResult.confidence;
        categoryDistribution[keywordResult.category] =
          (categoryDistribution[keywordResult.category] || 0) + 1;
        logger.info(
          `🔤 Keyword Match: FAQ ${faq.id} → ${keywordResult.category} (confidence: ${keywordResult.confidence.toFixed(2)})`,
        );
      } else {
        uncategorized++;
        logger.info(
          `⚠️ Uncategorized: FAQ ${faq.id} - "${faq.question.substring(0, 50)}..."`,
        );
      }
    }
  });

  let method: "hybrid" | "relations-only" | "keywords-only";
  if (strapiRelations > 0 && keywordBased > 0) {
    method = "hybrid";
  } else if (strapiRelations > 0) {
    method = "relations-only";
  } else {
    method = "keywords-only";
  }

  const confidence =
    totalFAQsChecked > 0 ? relationQuality / totalFAQsChecked : 0;
  const strapiCoverage = strapiRelations / faqs.length;
  const apiHealth: "healthy" | "degraded" | "failed" =
    strapiCoverage > 0.8
      ? "healthy"
      : strapiCoverage > 0.3
        ? "degraded"
        : "failed";

  const processingTime = Date.now() - startTime;

  const stats: CategorizationStats = {
    totalFAQs: faqs.length,
    strapiRelations,
    keywordBased,
    uncategorized,
    method,
    confidence,
    apiHealth,
    cacheHits,
    processingTime,
    categoryDistribution,
  };

  logger.info("📊 Enhanced Categorization Strategy Analysis:");
  logger.info(
    `   📡 Strapi API Relations: ${strapiRelations}/${faqs.length} (${Math.round(strapiCoverage * 100)}%)`,
  );
  logger.info(
    `   🔤 Keyword-based: ${keywordBased}/${faqs.length} (${Math.round((keywordBased / faqs.length) * 100)}%)`,
  );
  logger.info(
    `   ❓ Uncategorized: ${uncategorized}/${faqs.length} (${Math.round((uncategorized / faqs.length) * 100)}%)`,
  );
  logger.info(`   🎯 Overall Confidence: ${Math.round(confidence * 100)}%`);
  logger.info(`   🏥 API Health: ${apiHealth}`);
  logger.info(`   ⚡ Processing Time: ${processingTime}ms`);
  logger.info(`   💾 Cache Efficiency: ${cacheHits} entries`);

  if (strapiCoverage === 0) {
    logger.info(
      "💡 Recommendation: FAQ category relations are not set up in Strapi. Consider:",
    );
    logger.info("   1. Setting up category relations in Strapi CMS");
    logger.info("   2. Current keyword-based system provides good coverage");
  } else if (strapiCoverage < 0.5) {
    logger.info(
      "💡 Recommendation: Partial Strapi relations detected. Consider:",
    );
    logger.info("   1. Completing category assignments in Strapi");
    logger.info("   2. Hybrid approach working well");
  } else {
    logger.info("✅ Excellent: High API relation coverage detected!");
  }

  return stats;
}

// Enhanced intelligent categorization
export function intelligentCategorizeFrequentlyAskedQuestion(
  faq: FAQ,
): string | null {
  const cached = CATEGORIZATION_CACHE.get(faq.id);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    logger.info(
      `💾 Cache hit for FAQ ${faq.id}: ${cached.categorySlug} (${cached.method})`,
    );
    return cached.categorySlug;
  }

  let categorySlug: string | null = null;
  let method: "relations" | "keywords" = "relations";
  let confidence = 0;

  // PRIMARY: Enhanced Strapi category relation detection
  if (faq.category && faq.category.slug && faq.category.name) {
    const categoryValid =
      faq.category.slug.length > 0 && faq.category.name.length > 0;
    if (categoryValid) {
      categorySlug = faq.category.slug;
      method = "relations";
      confidence = 1.0;
      logger.info(`🎯 Strong API relation for FAQ ${faq.id}: ${categorySlug}`);
    }
  }

  // FALLBACK: Enhanced keyword-based categorization with lower threshold
  if (!categorySlug) {
    const keywordResult = categorizeByKeywordsEnhanced(faq);
    if (keywordResult && keywordResult.confidence > 0.2) {  // Lower threshold for better coverage
      categorySlug = keywordResult.category;
      method = "keywords";
      confidence = keywordResult.confidence;
      logger.info(
        `🔤 Keyword categorization for FAQ ${faq.id}: ${categorySlug} (confidence: ${confidence.toFixed(2)})`,
      );
    } else if (keywordResult) {
      logger.info(
        `⚠️ Low confidence keyword match for FAQ ${faq.id}: ${keywordResult.category} (${keywordResult.confidence.toFixed(2)}) - using anyway for better coverage`,
      );
      // Use low confidence matches for better coverage
      categorySlug = keywordResult.category;
      method = "keywords";
      confidence = keywordResult.confidence;
    } else {
      logger.info(
        `❌ No categorization possible for FAQ ${faq.id}: "${faq.question.substring(0, 50)}..."`,
      );
    }
  }

  if (categorySlug) {
    CATEGORIZATION_CACHE.set(faq.id, {
      faqId: faq.id,
      categorySlug,
      method,
      confidence,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    });
  }

  return categorySlug;
}

function categorizeByKeywordsEnhanced(
  faq: FAQ,
): { category: string; confidence: number } | null {
  const text = `${faq.question} ${faq.answer}`.toLowerCase();
  let bestMatch: { category: string; confidence: number } | null = null;

  for (const [categorySlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const { primary, secondary, confidence: baseConfidence } = keywords;
    let score = 0;
    const matchDetails: string[] = [];

    primary.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      if (text.includes(keywordLower)) {
        score += 3;
        matchDetails.push(`primary:${keyword}`);
      } else if (
        text.includes(
          keywordLower.substring(0, Math.min(5, keywordLower.length)),
        )
      ) {
        score += 1;
        matchDetails.push(`partial:${keyword}`);
      }
    });

    secondary.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      if (text.includes(keywordLower)) {
        score += 1;
        matchDetails.push(`secondary:${keyword}`);
      }
    });

    if (score > 0) {
      const maxPossibleScore = primary.length * 3 + secondary.length;
      const rawConfidence = score / maxPossibleScore;
      const finalConfidence = Math.min(
        baseConfidence * rawConfidence * 1.2,
        1.0,
      );

      logger.info(
        `🔍 Category ${categorySlug}: score=${score}, matches=[${matchDetails.join(", ")}], confidence=${finalConfidence.toFixed(3)}`,
      );

      if (!bestMatch || finalConfidence > bestMatch.confidence) {
        bestMatch = { category: categorySlug, confidence: finalConfidence };
      }
    }
  }

  return bestMatch;
}

export function analyzeCategorizationQuality(
  faqs: FAQ[],
  categories: FAQCategory[],
): CategorizationQuality {
  const stats = analyzeCategorizationStrategy(faqs);
  const recommendations: string[] = [];

  const relationsCoverage = stats.strapiRelations / stats.totalFAQs;
  const categoryCoverage =
    Object.keys(stats.categoryDistribution).length / categories.length;
  const keywordAccuracy =
    stats.keywordBased / (stats.keywordBased + stats.uncategorized);
  const overallEfficiency =
    (stats.strapiRelations + stats.keywordBased) / stats.totalFAQs;

  const overallScore =
    relationsCoverage * 0.4 +
    overallEfficiency * 0.3 +
    categoryCoverage * 0.2 +
    keywordAccuracy * 0.1;

  if (relationsCoverage === 0) {
    recommendations.push(
      "🚨 Critical: No Strapi category relations found - set up FAQ categories in CMS",
    );
    recommendations.push(
      "📝 Action: Assign FAQs to categories in Strapi admin panel",
    );
    recommendations.push(
      "⚡ Current: Keyword system provides good fallback coverage",
    );
  } else if (relationsCoverage < 0.3) {
    recommendations.push(
      "📈 Improvement: Only partial Strapi relations - complete category assignments",
    );
    recommendations.push(
      "🔄 Hybrid approach working - gradually transition to API-based",
    );
  } else if (relationsCoverage < 0.7) {
    recommendations.push(
      "✨ Good progress: Majority using API relations - finish remaining assignments",
    );
  }

  if (categoryCoverage < 0.8) {
    const missingCategories =
      categories.length - Object.keys(stats.categoryDistribution).length;
    recommendations.push(
      `📁 Content gap: ${missingCategories} categories have no FAQs - review content distribution`,
    );
  }

  if (stats.uncategorized > stats.totalFAQs * 0.1) {
    recommendations.push(
      "🔧 Enhancement: Improve keyword mappings to reduce uncategorized FAQs",
    );
    recommendations.push(
      "📖 Consider: Add more medical synonyms to CATEGORY_KEYWORDS",
    );
  }

  if (stats.apiHealth === "failed" && stats.keywordBased === 0) {
    recommendations.push(
      "🆘 Critical: Both API and keyword systems failing - check system health",
    );
  }

  if (stats.cacheHits / stats.totalFAQs < 0.3) {
    recommendations.push(
      "⚡ Performance: Consider longer cache TTL for better performance",
    );
  }

  if (overallScore > 0.8) {
    recommendations.push(
      "🎉 Excellent: Categorization system performing optimally!",
    );
  } else if (overallScore > 0.6) {
    recommendations.push(
      "👍 Good: System working well with room for improvement",
    );
  }

  return {
    overallScore,
    relationsCoverage,
    keywordAccuracy,
    categoryCoverage,
    recommendations,
  };
}

// Utility Functions
function calculateSearchScore(
  faq: FAQ,
  searchTerm: string,
  matchType: "question" | "answer",
): number {
  let score = 0;
  const term = searchTerm.toLowerCase();

  if (matchType === "question") {
    score += 100;
  } else {
    score += 50;
  }

  const text = (
    matchType === "question" ? faq.question : faq.answer
  ).toLowerCase();
  if (text.includes(term)) {
    score += 50;
  }

  const words = term.split(" ");
  words.forEach((word) => {
    if (word.length > 2 && text.includes(word)) {
      score += 10;
    }
  });

  const priorityBonus = { featured: 30, high: 20, medium: 10, low: 0 };
  score += priorityBonus[faq.priority];

  score += Math.min(faq.helpfulCount * 2, 20);

  if (matchType === "question" && faq.question.length < 100) {
    score += 10;
  }

  return score;
}

function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text;

  const words = searchTerm
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2);
  let highlightedText = text;

  words.forEach((word) => {
    const regex = new RegExp(`(${word})`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-healthcare-accent-green/20 text-healthcare-primary font-medium rounded px-1">$1</mark>',
    );
  });

  return highlightedText;
}

function generateSearchSuggestions(
  searchTerm: string,
  results: FAQSearchResult[],
): string[] {
  const suggestions: string[] = [];
  const term = searchTerm.toLowerCase();

  const medicalSuggestions: { [key: string]: string[] } = {
    zweitmeinung: [
      "zweitmeinung kosten",
      "zweitmeinung ablauf",
      "zweitmeinung wann sinnvoll",
    ],
    operation: [
      "operation notwendig",
      "operation alternativen",
      "operation vorbereitung",
    ],
    behandlung: ["behandlung ablauf", "behandlung kosten", "behandlung dauer"],
    diagnose: [
      "diagnose unsicher",
      "diagnose bestätigen",
      "diagnose überprüfen",
    ],
    therapie: [
      "therapie alternativen",
      "therapie nebenwirkungen",
      "therapie erfolg",
    ],
    krebs: ["krebs behandlung", "krebs zweitmeinung", "krebs therapie"],
    herz: ["herz operation", "herz katheter", "herz bypass"],
    gallenblase: [
      "gallenblase operation",
      "gallenblase steine",
      "gallenblase entfernung",
    ],
    schilddrüse: [
      "schilddrüse operation",
      "schilddrüse knoten",
      "schilddrüse autonomie",
    ],
  };

  Object.keys(medicalSuggestions).forEach((key) => {
    if (term.includes(key)) {
      suggestions.push(...medicalSuggestions[key]);
    }
  });

  if (results.length > 0) {
    const keywords = new Set<string>();
    results.slice(0, 5).forEach((result) => {
      const words = result.question.toLowerCase().split(" ");
      words.forEach((word) => {
        if (word.length > 4 && !term.includes(word)) {
          keywords.add(word);
        }
      });
    });

    Array.from(keywords)
      .slice(0, 3)
      .forEach((keyword) => {
        suggestions.push(`${term} ${keyword}`);
      });
  }

  return suggestions.slice(0, 5);
}

export function groupFAQsByCategory(
  faqs: FAQ[],
  categories: FAQCategory[],
): Record<string, FAQ[]> {
  const startTime = Date.now();
  const grouped: Record<string, FAQ[]> = {};

  categories.forEach((category) => {
    grouped[category.slug] = [];
  });

  const stats = analyzeCategorizationStrategy(faqs);
  logger.info(
    `🧠 Using categorization strategy: ${stats.method} (API Health: ${stats.apiHealth})`,
  );

  faqs.forEach((faq) => {
    const categorySlug = intelligentCategorizeFrequentlyAskedQuestion(faq);
    if (categorySlug && grouped[categorySlug]) {
      grouped[categorySlug].push(faq);
    }
  });

  const processingTime = Date.now() - startTime;

  logger.info("📊 FAQ categorization results:");
  Object.entries(grouped).forEach(([slug, faqList]) => {
    if (faqList.length > 0) {
      logger.info(`  ✅ ${slug}: ${faqList.length} FAQs`);
    } else {
      logger.info(`  ⚪ ${slug}: 0 FAQs`);
    }
  });

  logger.info(`⚡ Grouping completed in ${processingTime}ms`);
  logger.info(
    `💾 Cache efficiency: ${stats.cacheHits}/${stats.totalFAQs} entries`,
  );

  const quality = analyzeCategorizationQuality(faqs, categories);
  logger.info(
    `🎯 Categorization Quality Score: ${Math.round(quality.overallScore * 100)}%`,
  );

  if (quality.recommendations.length > 0) {
    logger.info("💡 Recommendations:");
    quality.recommendations.forEach((rec) => logger.info(`   - ${rec}`));
  }

  return grouped;
}

export function getFAQCategoryIcon(iconName: string): string {
  const iconMap: Record<string, string> = {
    "help-circle": "HelpCircle",
    activity: "Activity",
    "flask-conical": "FlaskConical",
    "heart-pulse": "HeartPulse",
    "scan-face": "ScanFace",
    droplet: "Droplet",
    water: "Droplets",
  };

  return iconMap[iconName] || "HelpCircle";
}

// Legacy function for backward compatibility
export function categorizeFrequentlyAskedQuestion(faq: FAQ): string | null {
  return intelligentCategorizeFrequentlyAskedQuestion(faq);
}
