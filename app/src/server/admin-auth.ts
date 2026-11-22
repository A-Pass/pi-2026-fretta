import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "fretta_admin";

function secret() {
  const configured = process.env.FRETTA_ADMIN_SECRET || process.env.APP_BETTER_AUTH_SECRET;
  if (!configured)
    throw new Error("FRETTA_ADMIN_SECRET or APP_BETTER_AUTH_SECRET is required.");
  return configured;
}

export function adminCredentialsConfigured(
  env: Record<string, string | undefined> = process.env,
) {
  return Boolean(
    env.FRETTA_ADMIN_USERNAME &&
      env.FRETTA_ADMIN_PASSWORD &&
      (env.FRETTA_ADMIN_SECRET || env.APP_BETTER_AUTH_SECRET),
  );
}

export function verifyAdminCredentials(
  username: string,
  password: string,
  env = process.env,
) {
  const configuredUsername = env.FRETTA_ADMIN_USERNAME;
  const configuredPassword = env.FRETTA_ADMIN_PASSWORD;
  if (!configuredUsername || !configuredPassword) return false;

  const usernameBuffer = Buffer.from(username);
  const usernameExpected = Buffer.from(configuredUsername);
  const passwordBuffer = Buffer.from(password);
  const passwordExpected = Buffer.from(configuredPassword);
  const usernameMatch =
    usernameBuffer.length === usernameExpected.length &&
    timingSafeEqual(usernameBuffer, usernameExpected);
  const passwordMatch =
    passwordBuffer.length === passwordExpected.length &&
    timingSafeEqual(passwordBuffer, passwordExpected);
  return usernameMatch && passwordMatch;
}

export function createAdminToken(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + 8 * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  let expected: string;
  try {
    expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  } catch {
    return false;
  }
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  )
    return false;
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminTokenUsername(token: string | undefined) {
  if (!verifyAdminToken(token) || !token) return null;
  try {
    const [payload] = token.split(".");
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { username?: unknown };
    return typeof data.username === "string" ? data.username : null;
  } catch {
    return null;
  }
}

export function readAdminCookie(cookieHeader: string | null) {
  if (!cookieHeader) return undefined;
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE}=`)
    )
    ?.slice(ADMIN_COOKIE.length + 1);
}

