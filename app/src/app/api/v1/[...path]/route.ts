import { NextRequest } from "next/server";
import { getAuthConfigurationError } from "@/server/auth/env";

type StoreResponse = {
  freights: unknown[];
  proposals: unknown[];
  messages: unknown[];
  [key: string]: unknown;
};

function error(code: string, message: string, status: number) {
  return Response.json({ code, message }, { status });
}

async function getSession(request: NextRequest) {
  const configurationError = getAuthConfigurationError();
  if (configurationError) {
    throw new Response(
      JSON.stringify({
        code: "AUTH_NOT_CONFIGURED",
        message: "A autenticação do servidor não está configurada.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const { auth } = await import("@/server/auth");
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response(null, { status: 401 });
  return session;
}

async function stateStore(request: NextRequest, method: "GET" | "PUT") {
  const session = await getSession(request);
  const { prisma } = await import("@/server/db");
  const userId = session.user.id;

  if (method === "PUT") {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return error("INVALID_BODY", "O estado enviado é inválido.", 422);
    }
    if (
      !Array.isArray((body as StoreResponse).freights) ||
      !Array.isArray((body as StoreResponse).proposals) ||
      !Array.isArray((body as StoreResponse).messages)
    ) {
      return error("INVALID_BODY", "O estado enviado está incompleto.", 422);
    }

    const safe = structuredClone(body as StoreResponse);
    safe.profile = {
      name:
        typeof safe.profile === "object" &&
        safe.profile &&
        "name" in safe.profile &&
        typeof safe.profile.name === "string"
          ? safe.profile.name.slice(0, 100)
          : session.user.name,
      photo:
        typeof safe.profile === "object" &&
        safe.profile &&
        "photo" in safe.profile &&
        typeof safe.profile.photo === "string"
          ? safe.profile.photo
          : session.user.image ?? "",
    };

    const jsonState = JSON.parse(JSON.stringify(safe));
    await prisma.appState.upsert({
      where: { userId },
      create: { userId, data: jsonState },
      update: { data: jsonState },
    });
  }

  const stored = await prisma.appState.findUnique({ where: { userId } });
  if (stored) return Response.json(stored.data);

  return Response.json({
    profile: {
      name: session.user.name,
      photo: session.user.image ?? "",
    },
    freights: [],
    proposals: [],
    messages: [],
  } satisfies StoreResponse);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    if (path.join("/") === "state") return await stateStore(request, "GET");
    if (path.join("/") === "me") {
      await getSession(request);
      return await stateStore(request, "GET");
    }
    return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
  } catch (failure) {
    if (failure instanceof Response) return failure;
    console.error("API request failed", failure);
    return error("SERVER_ERROR", "Não foi possível concluir a operação.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    if (path.join("/") === "state") return await stateStore(request, "PUT");
    return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
  } catch (failure) {
    if (failure instanceof Response) return failure;
    console.error("API request failed", failure);
    return error("SERVER_ERROR", "Não foi possível concluir a operação.", 500);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return GET(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return PUT(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
}
