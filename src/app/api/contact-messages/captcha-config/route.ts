import { NextResponse } from "next/server";
import { getCaptchaConfig } from "@/lib/strapi/contact-messages";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const config = await getCaptchaConfig();
    return NextResponse.json(config);
  } catch (error) {
    logger.error({ err: error }, "Failed to fetch CAPTCHA config");
    return NextResponse.json(
      { error: "Failed to fetch CAPTCHA config" },
      { status: 500 },
    );
  }
}
