import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { getAuthConfigurationError } from "@/server/auth/env";

export const runtime = "nodejs";

let handlers: ReturnType<typeof toNextJsHandler> | undefined;

async function getHandlers() {
  if (!handlers) {
    const { auth } = await import("@/server/auth");
    handlers = toNextJsHandler(auth);
  }
  return handlers;
}

function configurationResponse() {
  if (!getAuthConfigurationError()) return null;
  return Response.json(
    {
      code: "AUTH_NOT_CONFIGURED",
      message: "Google authentication is not configured on this server.",
    },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  const response = configurationResponse();
  if (response) return response;
  return (await getHandlers()).GET(request);
}

export async function POST(request: NextRequest) {
  const response = configurationResponse();
  if (response) return response;
  return (await getHandlers()).POST(request);
}
