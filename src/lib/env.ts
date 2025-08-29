import { z } from "zod";

const envSchema = z
  .object({
    STRAPI_API_URL: z.string().url().optional(),
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
    RECAPTCHA_SECRET_KEY: z.string().optional(),
  })
  .refine((env) => env.STRAPI_API_URL || env.NEXT_PUBLIC_STRAPI_URL, {
    message: "Either STRAPI_API_URL or NEXT_PUBLIC_STRAPI_URL must be set",
  });

// Fallback for client-side when env var is not loaded
const envWithFallback = {
  ...process.env,
  NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'https://st.zh3.de/api'
};

// Optional client-side debug output
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG === 'true') {
  console.log('[DEBUG] Client-side env check:', {
    original: process.env.NEXT_PUBLIC_STRAPI_URL,
    fallback: envWithFallback.NEXT_PUBLIC_STRAPI_URL,
    hasProcessEnv: !!process.env,
    keys: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  });
}

export const env = envSchema.parse(envWithFallback);
