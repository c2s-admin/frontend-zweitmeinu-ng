import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/lib/strapi/contact-messages";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
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
