import type { NextRequest } from "next/server";
import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import {
  freightOperation,
  FreightError,
} from "@/server/modules/freights/service";

import {
  obterUpload,
  UploadError,
} from "@/server/modules/uploads/services/upload-service";

type Context = { params: Promise<{ segments?: string[] }> };

async function handle(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) throw new FreightError(401, "Entre na sua conta.");
    let body: Record<string, unknown> = {};
    if (request.method !== "GET") {
      if (
        request.headers.get("origin") &&
        request.headers.get("origin") !==
          new URL(process.env.APP_URL || request.url).origin
      )
        throw new FreightError(403, "Origem inválida.");
      const input = await request.json().catch(() => null);
      if (!input || typeof input !== "object" || Array.isArray(input))
        throw new FreightError(422, "Informe os dados da operação.");
      body = input;
    }
    const { segments = [] } = await context.params;
    const result = await prisma.$transaction(
      (tx) =>
        freightOperation(
          tx,
          session.user.id,
          request.method,
          segments,
          request.nextUrl.searchParams,
          body,
        ),
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    if (
      result &&
      "photoOwner" in result &&
      typeof result.photoOwner === "string"
    ) {
      const image = await obterUpload(segments[2], result.photoOwner);
      return new Response(new Uint8Array(image.bytes), {
        headers: {
          "Content-Type": image.mimeType,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    return Response.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof FreightError || error instanceof UploadError)
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ["P2034", "P2002"].includes(error.code)
    )
      return Response.json(
        {
          message: "A operação entrou em conflito. Atualize e tente novamente.",
        },
        { status: 409 },
      );
    console.error("Falha na operação de frete");
    return Response.json(
      { message: "Não foi possível processar o frete." },
      { status: 500 },
    );
  }
}
export const GET = handle;
export const POST = handle;
