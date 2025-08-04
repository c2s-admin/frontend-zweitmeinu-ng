"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z
    .object({
    STRAPI_API_URL: zod_1.z.string().url().optional(),
    NEXT_PUBLIC_STRAPI_URL: zod_1.z.string().url(),
    SENTRY_DSN: zod_1.z.string().url().optional(),
})
    .refine((env) => env.STRAPI_API_URL || env.NEXT_PUBLIC_STRAPI_URL, {
    message: "Either STRAPI_API_URL or NEXT_PUBLIC_STRAPI_URL must be set",
});
exports.env = envSchema.parse(process.env);
