import QRCode from "qrcode";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import {
  CompanyError,
  companyOperation,
} from "@/server/modules/companies/service";

type Context = { params: Promise<{ segments?: string[] }> };

async function handle(request: Request, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user.emailVerified)
      throw new CompanyError(401, "Entre com uma conta Google verificada.");
    let body = {};
    if (request.method === "POST") {
      const origin = new URL(process.env.APP_URL || request.url).origin;
      if (request.headers.get("origin") !== origin)
        throw new CompanyError(403, "Origem inválida.");
      body = await request.json().catch(() => null);
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new CompanyError(422, "Informe os dados da operação.");
    }
    const { segments = [] } = await context.params;
    if (request.method === "GET" && segments[0] === "review")
      body = { status: new URL(request.url).searchParams.get("status") };
    if (request.method === "GET" && segments[0] === "opportunities")
      body = Object.fromEntries(new URL(request.url).searchParams);
    const result = await prisma.$transaction(
      (tx) =>
        companyOperation(tx, session.user.id, request.method, segments, body),
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    if (
      segments[0] === "create-plan-payment" &&
      "code" in result &&
      typeof result.code === "string"
    )
      return Response.json(
        {
          ...result,
          qr: await QRCode.toDataURL(result.code, { width: 240, margin: 2 }),
        },
        {
          headers: { "Cache-Control": "private, no-store" },
        },
      );
    return Response.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof CompanyError)
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ["P2002", "P2034"].includes(error.code)
    )
      return Response.json(
        {
          message:
            "Já existe um registro com esses dados ou o estado mudou. Atualize e tente novamente.",
        },
        { status: 409 },
      );
    console.error("Falha em operação de empresa");
    return Response.json(
      { message: "Não foi possível processar a operação." },
      { status: 500 },
    );
  }
}
export const GET = handle;
export const POST = handle;
