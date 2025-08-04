import { NextRequest, NextResponse } from "next/server";
import { validateVoteRequest, VoteRequest } from "./validation";

const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 votes per minute per IP

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

// Rate limiting function
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
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

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || real || "unknown";
  return ip;
}

// Fetch current FAQ data from Strapi
async function getCurrentFAQData(faqId: number): Promise<FAQData | null> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/faqs/${faqId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQ data: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.data as FAQData) ?? null;
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    throw error;
  }
}

// Update FAQ vote counts in Strapi
async function updateFAQVotes(
  faqId: number,
  helpfulCount: number,
  notHelpfulCount: number,
): Promise<boolean> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/faqs/${faqId}`, {
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
      console.error(`Failed to update FAQ votes: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating FAQ votes:", error);
    return false;
  }
}

// Store user vote in localStorage (client-side handling)
function generateSessionId(): string {
  return `faq_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST: Submit a vote
export async function POST(
  request: NextRequest,
): Promise<NextResponse<VoteResponse>> {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
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

    const { faqId, isHelpful, sessionId } = body as VoteRequest;

    // Get current FAQ data
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

    // Update votes in Strapi
    const updateSuccess = await updateFAQVotes(
      faqId,
      newHelpfulCount,
      newNotHelpfulCount,
    );

    if (!updateSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Update failed",
          message:
            "Die Abstimmung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        },
        { status: 500 },
      );
    }

    // Log vote for analytics
    console.log(
      `📊 FAQ Vote: FAQ ${faqId} - ${isHelpful ? "Helpful" : "Not Helpful"} - IP: ${clientIP}`,
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          faqId,
          helpfulCount: newHelpfulCount,
          notHelpfulCount: newNotHelpfulCount,
          userVote: isHelpful,
        },
        message: "Vielen Dank für Ihr Feedback!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in FAQ vote API:", error);

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

    // Get current FAQ data
    const currentFAQ = await getCurrentFAQData(faqId);
    if (!currentFAQ) {
      return NextResponse.json<VoteResponse>(
        { success: false, error: "FAQ not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<VoteResponse>(
      {
        success: true,
        data: {
          faqId,
          helpfulCount: currentFAQ.helpfulCount || 0,
          notHelpfulCount: currentFAQ.notHelpfulCount || 0,
          userVote: null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting FAQ vote stats:", error);

    return NextResponse.json<VoteResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// OPTIONS: Handle CORS preflight
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
