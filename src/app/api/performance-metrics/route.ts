import { NextRequest, NextResponse } from "next/server";
import { recordPerformanceMetric } from "@/lib/strapi/performance-metrics";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metric = {
      ...body,
      userAgent: request.headers.get("user-agent") || undefined,
      timestamp: new Date().toISOString(),
    };
    const response = await recordPerformanceMetric(metric);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    logger.error({ err: error }, "Failed to record performance metric");
    return NextResponse.json(
      { error: "Failed to record performance metric" },
      { status: 500 },
    );
  }
}
