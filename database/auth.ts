import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Campos extras do domínio, trafegados no cadastro/sessão do usuário
  user: {
    additionalFields: {
      documento: {
        type: "string",
        required: true,
        input: true, // permite enviar no signup
      },
      telefone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  // Login por e-mail/senha (opcional — mantenha caso queira permitir
  // cadastro sem conta Google/Apple)
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // Login social
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      // Apple exige App ID configurado como "Services ID" e chave privada
      // gerada no Apple Developer Portal para montar o clientSecret (JWT).
      appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER, // apps mobile (iOS)
    },
  },

  // Vincula automaticamente uma conta social a um usuário já existente
  // com o mesmo e-mail (ex: usuário criou conta com e-mail/senha e depois
  // entra com Google usando o mesmo e-mail)
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "apple"],
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias
    updateAge: 60 * 60 * 24, // renova a cada 1 dia de uso
  },
});

export type Session = typeof auth.$Infer.Session;
