import { NextRequest, NextResponse } from "next/server";
import { validateVoteRequest } from "@/lib/faq/validateVoteRequest";
import { logger } from "@/lib/logger";
import { redis } from "@/lib/redis";

const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 votes per minute per IP

// Vote request interface
interface VoteRequest {
  faqId: number;
  isHelpful: boolean;
}

// Vote response interface
interface VoteResponse {
  success: boolean;
  data?: {
    faqId: number;
    helpfulCount: number;
    notHelpfulCount: number;
    userVote: boolean | null;
  };
  error?: string;
  message?: string;
}

interface FAQData {
  helpfulCount?: number;
  notHelpfulCount?: number;
}

// Rate limiting function using Redis
async function checkRateLimit(clientIP: string): Promise<boolean> {
  const key = `faq_vote:${clientIP}`;
  const requestCount = await redis.incr(key);

  if (requestCount === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }

  return requestCount <= RATE_LIMIT_MAX_REQUESTS;
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || real || "unknown";
  return ip;
}

// Fetch current FAQ data from Strapi using list API with filter
async function getCurrentFAQData(faqId: number): Promise<FAQData | null> {
  try {
    // Use the working list API with ID filter instead of direct access
    const response = await fetch(`${STRAPI_BASE_URL}/faqs?filters[id][$eq]=${faqId}&populate=*`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQ data: ${response.statusText}`);
    }

    const data = await response.json();
    const faqData = data.data?.[0]; // Get first result from array
    
    if (!faqData) {
      logger.warn(`FAQ with ID ${faqId} not found`);
      return null;
    }

    return {
      helpfulCount: faqData.helpfulCount || 0,
      notHelpfulCount: faqData.notHelpfulCount || 0,
    };
  } catch (error) {
    logger.error({ err: error }, "Error fetching FAQ data");
    throw error;
  }
}

// Update FAQ vote counts in Strapi using documentId
async function updateFAQVotes(
  faqId: number,
  helpfulCount: number,
  notHelpfulCount: number,
): Promise<boolean> {
  try {
    // First get the FAQ to find its documentId
    const faqResponse = await fetch(`${STRAPI_BASE_URL}/faqs?filters[id][$eq]=${faqId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!faqResponse.ok) {
      logger.error(`Failed to fetch FAQ for update: ${faqResponse.statusText}`);
      return false;
    }

    const faqData = await faqResponse.json();
    const faq = faqData.data?.[0];
    
    if (!faq?.documentId) {
      logger.error(`FAQ ${faqId} not found or missing documentId`);
      return false;
    }

    // Update using documentId instead of regular ID
    const response = await fetch(`${STRAPI_BASE_URL}/faqs/${faq.documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          helpfulCount,
          notHelpfulCount,
        },
      }),
    });

    if (!response.ok) {
      logger.error(`Failed to update FAQ votes: ${response.statusText}`);
      // Log the response for debugging
      const errorText = await response.text();
      logger.error(`Update error response: ${errorText}`);
      return false;
    }

    logger.info(`Successfully updated FAQ ${faqId} votes: ${helpfulCount} helpful, ${notHelpfulCount} not helpful`);
    return true;
  } catch (error) {
    logger.error({ err: error }, "Error updating FAQ votes");
    return false;
  }
}

// Simple in-memory vote storage as fallback
const voteStorage = new Map<number, { helpful: number; notHelpful: number; lastUpdate: number }>();

// Store vote locally with fallback mechanism
async function storeVoteFallback(faqId: number, isHelpful: boolean): Promise<{ helpfulCount: number; notHelpfulCount: number }> {
  const cacheKey = faqId;
  let currentVotes = voteStorage.get(cacheKey);
  
  if (!currentVotes) {
    // Try to get current counts from Strapi first
    const strapiData = await getCurrentFAQData(faqId);
    currentVotes = {
      helpful: strapiData?.helpfulCount || 0,
      notHelpful: strapiData?.notHelpfulCount || 0,
      lastUpdate: Date.now()
    };
  }

  // Update local count
  if (isHelpful) {
    currentVotes.helpful++;
  } else {
    currentVotes.notHelpful++;
  }
  currentVotes.lastUpdate = Date.now();

  // Store locally
  voteStorage.set(cacheKey, currentVotes);

  return {
    helpfulCount: currentVotes.helpful,
    notHelpfulCount: currentVotes.notHelpful
  };
}

// POST: Submit a vote
export async function POST(
  request: NextRequest,
): Promise<NextResponse<VoteResponse>> {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!(await checkRateLimit(clientIP))) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          message:
            "Zu viele Abstimmungen. Bitte versuchen Sie es in einer Minute erneut.",
        },
        { status: 429 },
      );
    }

    // Parse request body
    const body: unknown = await request.json();

    // Validate request
    const validation = validateVoteRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          message: "Ungültige Anfrage. Bitte versuchen Sie es erneut.",
        },
        { status: 400 },
      );
    }

    const { faqId, isHelpful } = body as VoteRequest;

    // Get current FAQ data to verify it exists
    const currentFAQ = await getCurrentFAQData(faqId);
    if (!currentFAQ) {
      return NextResponse.json(
        {
          success: false,
          error: "FAQ not found",
          message: "Die angegebene FAQ wurde nicht gefunden.",
        },
        { status: 404 },
      );
    }

    // Calculate new vote counts
    let newHelpfulCount = currentFAQ.helpfulCount || 0;
    let newNotHelpfulCount = currentFAQ.notHelpfulCount || 0;

    if (isHelpful) {
      newHelpfulCount++;
    } else {
      newNotHelpfulCount++;
    }

    // Try to update votes in Strapi, with fallback to local storage
    let finalCounts: { helpfulCount: number; notHelpfulCount: number };
    
    const updateSuccess = await updateFAQVotes(
      faqId,
      newHelpfulCount,
      newNotHelpfulCount,
    );

    if (updateSuccess) {
      // Strapi update succeeded
      finalCounts = {
        helpfulCount: newHelpfulCount,
        notHelpfulCount: newNotHelpfulCount
      };
      logger.info(`FAQ Vote: FAQ ${faqId} - ${isHelpful ? "Helpful" : "Not Helpful"} - Saved to Strapi - IP: ${clientIP}`);
    } else {
      // Strapi failed, use local fallback
      finalCounts = await storeVoteFallback(faqId, isHelpful);
      logger.warn(`FAQ Vote: FAQ ${faqId} - ${isHelpful ? "Helpful" : "Not Helpful"} - Strapi failed, using local storage - IP: ${clientIP}`);
    }

    // Return success response (always succeed for better UX)
    return NextResponse.json(
      {
        success: true,
        data: {
          faqId,
          helpfulCount: finalCounts.helpfulCount,
          notHelpfulCount: finalCounts.notHelpfulCount,
          userVote: isHelpful,
        },
        message: "Vielen Dank für Ihr Feedback!",
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error({ err: error }, "Error in FAQ vote API");

    // Even on error, try to store locally for better UX
    try {
      const body: unknown = await request.json();
      const { faqId, isHelpful } = body as VoteRequest;
      const fallbackCounts = await storeVoteFallback(faqId, isHelpful);
      
      logger.warn(`FAQ Vote: FAQ ${faqId} - Error fallback to local storage`);
      
      return NextResponse.json(
        {
          success: true,
          data: {
            faqId,
            helpfulCount: fallbackCounts.helpfulCount,
            notHelpfulCount: fallbackCounts.notHelpfulCount,
            userVote: isHelpful,
          },
          message: "Vielen Dank für Ihr Feedback!",
        },
        { status: 200 },
      );
    } catch (fallbackError) {
      logger.error({ err: fallbackError }, "Complete failure in FAQ vote API");
      
      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          message:
            "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        },
        { status: 500 },
      );
    }
  }
}

// GET: Get vote statistics for a specific FAQ
export async function GET(
  request: NextRequest,
): Promise<NextResponse<VoteResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const faqIdParam = searchParams.get("faqId");

    if (!faqIdParam) {
      return NextResponse.json<VoteResponse>(
        { success: false, error: "FAQ ID is required" },
        { status: 400 },
      );
    }

    const faqId = parseInt(faqIdParam, 10);
    if (isNaN(faqId) || faqId <= 0) {
      return NextResponse.json<VoteResponse>(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 },
      );
    }

    // Try to get current FAQ data from Strapi
    let finalCounts = { helpfulCount: 0, notHelpfulCount: 0 };
    
    try {
      const currentFAQ = await getCurrentFAQData(faqId);
      if (currentFAQ) {
        finalCounts = {
          helpfulCount: currentFAQ.helpfulCount || 0,
          notHelpfulCount: currentFAQ.notHelpfulCount || 0
        };
      }
    } catch (strapiError) {
      logger.warn({ err: strapiError }, `Failed to get FAQ ${faqId} from Strapi, checking local storage`);
      
      // Fallback to local storage
      const localVotes = voteStorage.get(faqId);
      if (localVotes) {
        finalCounts = {
          helpfulCount: localVotes.helpful,
          notHelpfulCount: localVotes.notHelpful
        };
        logger.info(`Using local storage for FAQ ${faqId} vote stats`);
      }
    }

    return NextResponse.json<VoteResponse>(
      {
        success: true,
        data: {
          faqId,
          helpfulCount: finalCounts.helpfulCount,
          notHelpfulCount: finalCounts.notHelpfulCount,
          userVote: null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error({ err: error }, "Error getting FAQ vote stats");

    // Final fallback - return zero counts rather than error
    const faqIdParam = new URL(request.url).searchParams.get("faqId");
    const faqId = faqIdParam ? parseInt(faqIdParam, 10) : 0;
    
    return NextResponse.json<VoteResponse>(
      {
        success: true,
        data: {
          faqId,
          helpfulCount: 0,
          notHelpfulCount: 0,
          userVote: null,
        },
      },
      { status: 200 },
    );
  }
}

// OPTIONS: Handle CORS preflight
export async function OPTIONS(_request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
