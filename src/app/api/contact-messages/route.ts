import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/lib/strapi/contact-messages";
import { logger } from "@/lib/logger";
import { getClientIP, withRateLimit } from "@/middlewares/rate-limit";

async function handler(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    const body = await request.json();

    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
      ipAddress: clientIP !== "unknown" ? clientIP : undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    };
    const response = await submitContactMessage(payload);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    logger.error({ err: error }, "Failed to submit contact message");
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(handler);
