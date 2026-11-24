const required = [
  "DB_URL",
  "APP_URL",
  "APP_BETTER_AUTH_SECRET",
  "APP_GOOGLE_CLIENT_ID",
  "APP_GOOGLE_CLIENT_SECRET",
] as const;

export function googleConfigurationIssue(
  env: Record<string, string | undefined>,
) {
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length)
    return "Configure " + missing.join(", ") + " para entrar com Google.";
  if (env.APP_BETTER_AUTH_SECRET!.trim().length < 32)
    return "ConfigureAPP_BETTER_AUTH_SECRET com pelo menos 32 caracteres.";
  try {
    const url = new URL(env.APP_URL!);
    if (url.protocol === "http:" || url.protocol === "https:") return null;
  } catch {}
  return "Configure APP_URL com um endereço HTTP ou HTTPS válido.";
}
