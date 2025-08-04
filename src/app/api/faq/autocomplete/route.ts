import { NextRequest, NextResponse } from "next/server";

const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

// Auto-complete suggestion types
export interface AutoCompleteSuggestion {
  id: string;
  text: string;
  type: "faq" | "medical-term" | "popular-search" | "category";
  category?: string;
  description?: string;
  highlightedText?: string;
  score: number;
}

export interface AutoCompleteResponse {
  suggestions: AutoCompleteSuggestion[];
  searchTerm: string;
  totalSuggestions: number;
  processingTime: number;
}

// Medical dictionary with German healthcare terms and synonyms
const MEDICAL_DICTIONARY = {
  // Zweitmeinung related
  zweitmeinung: {
    synonyms: [
      "zweit meinung",
      "zweite meinung",
      "fachliche einschätzung",
      "expert opinion",
    ],
    description:
      "Unabhängige medizinische Bewertung einer Diagnose oder Behandlung",
  },
  gutachten: {
    synonyms: ["medizinisches gutachten", "fachgutachten", "expertise"],
    description: "Professionelle medizinische Einschätzung",
  },

  // Kardiologie
  herz: {
    synonyms: ["kardio", "cardiac", "herzkrankheit", "herzerkrankung"],
    description: "Herzmedizin und Herz-Kreislauf-System",
  },
  herzinfarkt: {
    synonyms: ["myokardinfarkt", "heart attack", "herzanfall"],
    description: "Akuter Verschluss einer Herzkranzarterie",
  },
  bypass: {
    synonyms: ["herzbypass", "koronarer bypass", "cabg"],
    description: "Operative Umleitung bei Gefäßverengungen",
  },
  stent: {
    synonyms: ["gefäßstütze", "koronarstent", "herzkatheter"],
    description: "Medizinische Gefäßstütze zur Offenhaltung",
  },
  schrittmacher: {
    synonyms: ["herzschrittmacher", "pacemaker", "stimulator"],
    description: "Medizinisches Gerät zur Herzrhythmus-Regulierung",
  },

  // Onkologie
  krebs: {
    synonyms: ["karzinom", "tumor", "onkologie", "malignität"],
    description: "Krebserkrankungen und Tumormedizin",
  },
  chemotherapie: {
    synonyms: ["chemo", "zytostatika", "krebstherapie"],
    description: "Medikamentöse Krebsbehandlung",
  },
  bestrahlung: {
    synonyms: ["strahlentherapie", "radiotherapie", "radiation"],
    description: "Strahlenbehandlung bei Krebs",
  },
  metastasen: {
    synonyms: ["metastasierung", "streuung", "sekundärtumor"],
    description: "Tochtergeschwülste bei Krebserkrankungen",
  },

  // Intensivmedizin
  intensiv: {
    synonyms: ["intensivstation", "icu", "intensivbehandlung"],
    description: "Intensivmedizinische Betreuung",
  },
  beatmung: {
    synonyms: ["ventilation", "respirator", "intubation"],
    description: "Künstliche Beatmung bei kritischen Patienten",
  },
  reanimation: {
    synonyms: ["wiederbelebung", "cpr", "notfallmedizin"],
    description: "Lebensrettende Sofortmaßnahmen",
  },

  // Gallenblase
  gallenblase: {
    synonyms: ["galle", "cholezyst", "gallenstein"],
    description: "Gallenblase und Gallenwegerkrankungen",
  },
  gallenstein: {
    synonyms: ["gallensteine", "cholelithiasis", "gallenkolik"],
    description: "Steinbildung in der Gallenblase",
  },
  cholezystektomie: {
    synonyms: ["gallenblasenentfernung", "gallen op"],
    description: "Operative Entfernung der Gallenblase",
  },

  // Nephrologie
  niere: {
    synonyms: ["nieren", "nephro", "nierenerkrankung"],
    description: "Nierenmedizin und Nierenerkrankungen",
  },
  dialyse: {
    synonyms: ["hämodialyse", "peritonealdialyse", "blutwäsche"],
    description: "Nierenersatztherapie bei Nierenversagen",
  },
  niereninsuffizienz: {
    synonyms: ["nierenversagen", "nierenschwäche"],
    description: "Eingeschränkte Nierenfunktion",
  },

  // Schilddrüse
  schilddrüse: {
    synonyms: ["thyroid", "schild", "schilddrüsenerkrankung"],
    description: "Schilddrüsenmedizin und Hormonstörungen",
  },
  struma: {
    synonyms: ["kropf", "schilddrüsenvergrößerung"],
    description: "Vergrößerung der Schilddrüse",
  },
  thyreoidektomie: {
    synonyms: ["schilddrüsenentfernung", "schilddrüsen op"],
    description: "Operative Entfernung der Schilddrüse",
  },

  // Allgemeine Begriffe
  operation: {
    synonyms: ["op", "eingriff", "chirurgie", "surgery"],
    description: "Operative medizinische Behandlung",
  },
  diagnose: {
    synonyms: ["befund", "krankheitsbild", "diagnosis"],
    description: "Medizinische Krankheitsbestimmung",
  },
  therapie: {
    synonyms: ["behandlung", "therapy", "treatment"],
    description: "Medizinische Behandlungsverfahren",
  },
  kosten: {
    synonyms: ["preis", "gebühren", "erstattung", "kostenübernahme"],
    description: "Kosten und Kostenübernahme für medizinische Leistungen",
  },
};

// Popular searches (these would typically come from analytics)
const POPULAR_SEARCHES = [
  "Zweitmeinung Kosten",
  "Operation notwendig",
  "Krebs Behandlung",
  "Herz Katheter",
  "Gallenblase entfernen",
  "Schilddrüse Operation",
  "Dialyse Alternativen",
  "Intensivmedizin Entscheidung",
  "Chemotherapie sinnvoll",
  "Bypass Operation",
  "Stent oder Operation",
  "Zweitmeinung Ablauf",
  "Experten finden",
  "Gutachten anfordern",
  "Behandlung überprüfen",
];

// Rate limiting for auto-complete
const autoCompleteRateLimit = new Map<
  string,
  { count: number; resetTime: number }
>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const RATE_LIMIT_MAX_REQUESTS = 50; // 50 requests per 10 seconds

// Cache for auto-complete results
const autoCompleteCache = new Map<
  string,
  { data: AutoCompleteResponse; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function checkAutoCompleteRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = autoCompleteRateLimit.get(clientIP);

  if (!clientData) {
    autoCompleteRateLimit.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (now > clientData.resetTime) {
    autoCompleteRateLimit.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || real || "unknown";
}

// Fuzzy string matching function
function fuzzyMatch(searchTerm: string, target: string): number {
  const search = searchTerm.toLowerCase();
  const text = target.toLowerCase();

  // Exact match
  if (text.includes(search)) {
    return 1.0;
  }

  // Word boundary match
  const words = text.split(" ");
  for (const word of words) {
    if (word.startsWith(search)) {
      return 0.8;
    }
  }

  // Character similarity (simple Levenshtein-inspired)
  let matches = 0;
  let searchIndex = 0;

  for (let i = 0; i < text.length && searchIndex < search.length; i++) {
    if (text[i] === search[searchIndex]) {
      matches++;
      searchIndex++;
    }
  }

  return (matches / search.length) * 0.6;
}

// Highlight matching text
function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  return text.replace(regex, "<mark>$1</mark>");
}

// Get suggestions from medical dictionary
function getMedicalTermSuggestions(
  searchTerm: string,
  limit: number = 5,
): AutoCompleteSuggestion[] {
  const suggestions: AutoCompleteSuggestion[] = [];
  const search = searchTerm.toLowerCase();

  for (const [term, data] of Object.entries(MEDICAL_DICTIONARY)) {
    // Check main term
    const mainScore = fuzzyMatch(search, term);
    if (mainScore > 0.3) {
      suggestions.push({
        id: `medical-${term}`,
        text: term,
        type: "medical-term",
        description: data.description,
        highlightedText: highlightText(term, searchTerm),
        score: mainScore,
      });
    }

    // Check synonyms
    for (const synonym of data.synonyms) {
      const synonymScore = fuzzyMatch(search, synonym);
      if (synonymScore > 0.3) {
        suggestions.push({
          id: `medical-synonym-${synonym}`,
          text: synonym,
          type: "medical-term",
          description: `Synonym für: ${term}`,
          highlightedText: highlightText(synonym, searchTerm),
          score: synonymScore * 0.9, // Slightly lower score for synonyms
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Get suggestions from popular searches
function getPopularSearchSuggestions(
  searchTerm: string,
  limit: number = 3,
): AutoCompleteSuggestion[] {
  const suggestions: AutoCompleteSuggestion[] = [];
  const search = searchTerm.toLowerCase();

  for (const popularSearch of POPULAR_SEARCHES) {
    const score = fuzzyMatch(search, popularSearch);
    if (score > 0.3) {
      suggestions.push({
        id: `popular-${popularSearch}`,
        text: popularSearch,
        type: "popular-search",
        description: "Beliebte Suche",
        highlightedText: highlightText(popularSearch, searchTerm),
        score: score * 0.8, // Lower priority than medical terms
      });
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Get suggestions from FAQ questions (simplified - in production would query Strapi)
async function getFAQSuggestions(
  searchTerm: string,
  limit: number = 3,
): Promise<AutoCompleteSuggestion[]> {
  try {
    // This would typically query Strapi for FAQ questions
    // For now, we'll use a simplified approach
    const response = await fetch(
      `${STRAPI_BASE_URL}/faqs?filters[question][$containsi]=${encodeURIComponent(searchTerm)}&pagination[limit]=${limit}&populate=category`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const faqs = data.data || [];

    return faqs.map((faq: any, index: number) => ({
      id: `faq-${faq.id}`,
      text: faq.question,
      type: "faq" as const,
      category: faq.category?.name || "Allgemein",
      description: "FAQ-Frage",
      highlightedText: highlightText(faq.question, searchTerm),
      score: 0.9 - index * 0.1, // Decreasing score based on order
    }));
  } catch (error) {
    console.error("Error fetching FAQ suggestions:", error);
    return [];
  }
}

// Main auto-complete endpoint
export async function GET(
  request: NextRequest,
): Promise<NextResponse<AutoCompleteResponse>> {
  const startTime = Date.now();

  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    if (!checkAutoCompleteRateLimit(clientIP)) {
      return NextResponse.json(
        {
          suggestions: [],
          searchTerm: "",
          totalSuggestions: 0,
          processingTime: 0,
        },
        { status: 429 },
      );
    }

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const maxResults = parseInt(searchParams.get("limit") || "10", 10);

    if (!query || query.length < 2) {
      return NextResponse.json({
        suggestions: [],
        searchTerm: query || "",
        totalSuggestions: 0,
        processingTime: Date.now() - startTime,
      });
    }

    // Check cache
    const cacheKey = `${query.toLowerCase()}-${maxResults}`;
    const cached = autoCompleteCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        ...cached.data,
        processingTime: Date.now() - startTime,
      });
    }

    // Get suggestions from different sources
    const [medicalSuggestions, popularSuggestions, faqSuggestions] =
      await Promise.all([
        getMedicalTermSuggestions(query, Math.ceil(maxResults * 0.5)),
        getPopularSearchSuggestions(query, Math.ceil(maxResults * 0.3)),
        getFAQSuggestions(query, Math.ceil(maxResults * 0.2)),
      ]);

    // Combine and sort all suggestions
    const allSuggestions = [
      ...medicalSuggestions,
      ...popularSuggestions,
      ...faqSuggestions,
    ];

    // Remove duplicates and sort by score
    const uniqueSuggestions = allSuggestions
      .filter(
        (suggestion, index, array) =>
          array.findIndex(
            (s) => s.text.toLowerCase() === suggestion.text.toLowerCase(),
          ) === index,
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    const response: AutoCompleteResponse = {
      suggestions: uniqueSuggestions,
      searchTerm: query,
      totalSuggestions: uniqueSuggestions.length,
      processingTime: Date.now() - startTime,
    };

    // Cache the result
    autoCompleteCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    // Log for analytics
    console.log(
      `🔍 Auto-complete: "${query}" -> ${uniqueSuggestions.length} suggestions (${response.processingTime}ms)`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in auto-complete API:", error);

    return NextResponse.json(
      {
        suggestions: [],
        searchTerm: "",
        totalSuggestions: 0,
        processingTime: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
