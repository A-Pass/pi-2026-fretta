import { toNextJsHandler } from "better-auth/next-js";
import { googleConfigurationIssue } from "@/server/auth/google-configuration";
import type { NextRequest } from "next/server";

async function handlers() {
  const { auth } = await import("@/server/auth/auth");
  return toNextJsHandler(auth);
}

export async function GET(request: NextRequest) {
  return (await handlers()).GET(request);
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith("/sign-in/social")) {
    const issue = googleConfigurationIssue(process.env);
    if (issue)
      return Response.json(
        { code: "AUTH_NOT_CONFIGURED", message: issue },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
  }
  return (await handlers()).POST(request);
}
