import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { sendEmail } from "@/lib/email/sendEmail";
import { env } from "@invoicely/utilities";
import { betterAuth } from "better-auth";
import { db } from "@invoicely/db";

export const serverAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  hooks: {
    // Block self-serve sign-up when disabled via env. Sign-in and Google are unaffected.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" && !env.NEXT_PUBLIC_ENABLE_SIGNUP) {
        throw new APIError("FORBIDDEN", { message: "Sign-ups are currently disabled" });
      }
    }),
  },
  user: {
    modelName: "users",
    additionalFields: {
      allowedSavingData: {
        type: "boolean",
        required: false,
        defaultValue: false,
        fieldName: "allowedSavingData",
        returned: true,
      },
    },
  },
  account: {
    modelName: "accounts",
  },
  session: {
    modelName: "sessions",
  },
  verification: {
    modelName: "verifications",
  },
  advanced: {
    database: {
      generateId: false,
    },
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"],
    },
  },
});
