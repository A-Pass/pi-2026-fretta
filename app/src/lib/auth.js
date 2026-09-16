import { betterAuth, BetterAuthOptions } from "better-auth";
import { customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
    ROUTE_ROOT,
    DEFAULT_ROUTE_AFTER_AUTHENTICATED,
    ROUTE_AUTH_SIGN_IN,
    ROUTE_AUTH_SIGN_UP
} from "@/constants/routes";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    routes: {
        login: ROUTE_AUTH_SIGN_IN,       // página de login
        signup: ROUTE_AUTH_SIGN_UP,     // página de registro
        logout: ROUTE_ROOT,     // redireciona aqui após logout
        callback: DEFAULT_ROUTE_AFTER_AUTHENTICATED // rota padrão pós-login ou signup
    },
    plugins: [
        customSession(async ({ user, session }) => {
            const count = await prisma.account.count({
                where: {
                    userId: user.id,
                    password: { not: null },
                },
            });

            return {
                user: {
                    ...user,
                    hasPassword: count > 0, // 👈 campo calculado
                },
                session,
            };
        }),
    ]
});