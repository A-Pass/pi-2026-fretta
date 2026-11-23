const requiredVariables = [
  "DB_URL",
  "APP_BETTER_AUTH_SECRET",
  "APP_URL",
  "APP_GOOGLE_CLIENT_ID",
  "APP_GOOGLE_CLIENT_SECRET",
] as const;

export function getAuthConfigurationError(
  env: Record<string, string | undefined> = process.env,
) {
  const missing = requiredVariables.filter((name) => !env[name]);
  if (missing.length) {
    return `Missing auth configuration: ${missing.join(", ")}`;
  }
  if (env.APP_BETTER_AUTH_SECRET!.length < 32) {
    return "APP_BETTER_AUTH_SECRET must contain at least 32 characters";
  }
  return null;
}
