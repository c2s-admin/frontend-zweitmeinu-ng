import { NextResponse } from "next/server";
import type { CaptchaConfig } from "@/types/contact";

export async function GET() {
  try {
    const config: CaptchaConfig = {
      enabled: !!process.env.RECAPTCHA_SECRET_KEY,
      provider: "recaptcha",
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
    };

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch CAPTCHA config" },
      { status: 500 },
    );
  }
}
