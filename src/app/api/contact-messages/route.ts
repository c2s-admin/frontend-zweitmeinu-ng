import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/lib/strapi/contact-messages";
import { logger } from "@/lib/logger";
import { getClientIP, withRateLimit } from "@/middlewares/rate-limit";

async function handler(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    const body = await request.json();
    const { captchaToken, ...rest } = body;

    if (process.env.HCAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return NextResponse.json(
          { error: "Captcha verification required" },
          { status: 400 },
        );
      }
      const captchaResponse = await fetch(
        "https://hcaptcha.com/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.HCAPTCHA_SECRET_KEY,
            response: captchaToken,
            remoteip: clientIP,
          }),
        },
      );
      const captchaData = await captchaResponse.json();
      if (!captchaData.success) {
        return NextResponse.json(
          { error: "Captcha verification failed" },
          { status: 400 },
        );
      }
    }

    const payload = {
      ...rest,
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
