const requiredVariables = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

export function getAuthConfigurationError(
  env: Record<string, string | undefined> = process.env,
) {
  const missing = requiredVariables.filter((name) => !env[name]);
  if (missing.length) {
    return `Missing auth configuration: ${missing.join(", ")}`;
  }
  if (env.BETTER_AUTH_SECRET!.length < 32) {
    return "BETTER_AUTH_SECRET must contain at least 32 characters";
  }
  return null;
}
