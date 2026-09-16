// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

export const SOCIAL_PROVIDER_GOOGLE = "google";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = createAuthClient({
  plugins: [customSessionClient()], // 👈 mágica da inferência
});
