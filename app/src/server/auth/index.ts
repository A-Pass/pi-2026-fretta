import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { getAuthConfigurationError } from "./env";
import { prisma } from "../db";

const configurationError = getAuthConfigurationError();
if (configurationError) {
  throw new Error(configurationError);
}

export const auth = betterAuth({
  baseURL: process.env.APP_URL!,
  secret: process.env.APP_BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.APP_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.APP_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.APP_GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
});

export type AuthSession = typeof auth.$Infer.Session;
