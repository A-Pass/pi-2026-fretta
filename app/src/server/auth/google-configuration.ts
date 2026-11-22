const required = [
  "DATABASE_URL",
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

export function googleConfigurationIssue(
  env: Record<string, string | undefined>,
) {
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length)
    return "Configure " + missing.join(", ") + " para entrar com Google.";
  if (env.BETTER_AUTH_SECRET!.trim().length < 32)
    return "Configure BETTER_AUTH_SECRET com pelo menos 32 caracteres.";
  try {
    const url = new URL(env.BETTER_AUTH_URL!);
    if (url.protocol === "http:" || url.protocol === "https:") return null;
  } catch {}
  return "Configure BETTER_AUTH_URL com um endereço HTTP ou HTTPS válido.";
}
