import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_WINDOW ?? "60") * 1000;
const MAX_REQUESTS = parseInt(process.env.CONTACT_MESSAGES_RATE_LIMIT_MAX ?? "5");

interface RateLimitInfo {
  count: number;
  expires: number;
}

const ipRecords = new Map<string, RateLimitInfo>();

// periodically purge expired records to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of ipRecords) {
    if (info.expires <= now) {
      ipRecords.delete(ip);
    }
  }
}, WINDOW_MS).unref?.();
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || real || "unknown";
}

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const info = ipRecords.get(ip);
  if (!info || info.expires <= now) {
    ipRecords.set(ip, { count: 1, expires: now + WINDOW_MS });
    return true;
  }
  if (info.count < MAX_REQUESTS) {
    info.count += 1;
    return true;
  }
  return false;
}

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withRateLimit(handler: Handler): Handler {
  return async (request: NextRequest) => {
    const ip = getClientIP(request);
    if (!isAllowed(ip)) {
      const info = ipRecords.get(ip);
      const retryAfter = info ? Math.ceil((info.expires - Date.now()) / 1000) : 0;
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
