import { z } from "zod";

const envSchema = z
  .object({
    STRAPI_API_URL: z.string().url().optional(),
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    SENTRY_DSN: z.string().url().optional(),
  })
  .refine((env) => env.STRAPI_API_URL || env.NEXT_PUBLIC_STRAPI_URL, {
    message: "Either STRAPI_API_URL or NEXT_PUBLIC_STRAPI_URL must be set",
  });

export const env = envSchema.parse(process.env);
