import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/lib/strapi/contact-messages";
import { logger } from "@/lib/logger";
import { redis } from "@/lib/redis";

const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 messages per hour per IP

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || real || "unknown";
  return ip;
}

async function checkRateLimit(clientIP: string): Promise<boolean> {
  const key = `contact_form:${clientIP}`;
  const requestCount = await redis.incr(key);
  if (requestCount === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return requestCount <= RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    if (!(await checkRateLimit(clientIP))) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

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
