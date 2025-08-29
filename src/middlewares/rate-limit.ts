import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const WINDOW_MS = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_WINDOW ?? "60") * 1000;
const MAX_REQUESTS = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_MAX ?? "5");

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || real || "unknown";
}

async function isAllowed(ip: string): Promise<boolean> {
  // Use a rolling window key per IP (simple fixed window)
  const windowSeconds = Math.ceil(WINDOW_MS / 1000);
  const key = `ratelimit:contact:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    // first hit: set expiry
    await redis.expire(key, windowSeconds);
  }
  return current <= MAX_REQUESTS;
}

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withRateLimit(handler: Handler): Handler {
  return async (request: NextRequest) => {
    const ip = getClientIP(request);
    const allowed = await isAllowed(ip);
    if (!allowed) {
      // Best-effort: provide remaining TTL
      const retryAfter = Math.ceil(WINDOW_MS / 1000);
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": retryAfter.toString() },
        },
      );
    }
    return handler(request);
  };
}
