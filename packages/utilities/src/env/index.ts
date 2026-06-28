import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    SUPABASE_S3_ENDPOINT: z.string(),
    SUPABASE_S3_REGION: z.string(),
    SUPABASE_S3_ACCESS_KEY_ID: z.string(),
    SUPABASE_S3_SECRET_ACCESS_KEY: z.string(),
    SUPABASE_S3_BUCKET_NAME: z.string(),
    SUPABASE_S3_PUBLIC_DOMAIN: z.string(),
    GMAIL_USER: z.string(),
    GMAIL_APP_PASSWORD: z.string(),
    EMAIL_FROM: z.string(),
  },
  client: {
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_TRPC_BASE_URL: z.string(),
    NEXT_PUBLIC_STORAGE_PUBLIC_DOMAIN: z.string(),
    // Controls whether self-serve sign-up is offered. "true" enables it.
    NEXT_PUBLIC_ENABLE_SIGNUP: z
      .string()
      .optional()
      .transform((value) => value === "true"),
  },
  runtimeEnv: {
    // =========== SERVER ===========
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SUPABASE_S3_ENDPOINT: process.env.SUPABASE_S3_ENDPOINT,
    SUPABASE_S3_REGION: process.env.SUPABASE_S3_REGION,
    SUPABASE_S3_ACCESS_KEY_ID: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    SUPABASE_S3_SECRET_ACCESS_KEY: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
    SUPABASE_S3_BUCKET_NAME: process.env.SUPABASE_S3_BUCKET_NAME,
    SUPABASE_S3_PUBLIC_DOMAIN: process.env.SUPABASE_S3_PUBLIC_DOMAIN,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    // =========== PUBLIC ===========
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_TRPC_BASE_URL: process.env.NEXT_PUBLIC_TRPC_BASE_URL,
    NEXT_PUBLIC_STORAGE_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_STORAGE_PUBLIC_DOMAIN,
    NEXT_PUBLIC_ENABLE_SIGNUP: process.env.NEXT_PUBLIC_ENABLE_SIGNUP,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
