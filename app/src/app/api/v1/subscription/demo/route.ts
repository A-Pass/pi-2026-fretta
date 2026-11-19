import { randomUUID } from "node:crypto";
import QRCode from "qrcode";
import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/generated/prisma/client";

const failure = (message: string, status: number) =>
  Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export async function POST(request: Request) {
  if (process.env.FRETTA_DEMO_PIX !== "true")
    return failure("Pix de demonstração indisponível.", 404);
  const origin = new URL(process.env.BETTER_AUTH_URL || request.url).origin;
  if (request.headers.get("origin") !== origin)
    return failure("Origem inválida.", 403);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return failure("Entre na sua conta.", 401);
  const body = await request.json().catch(() => null);
  if (
    !body ||
    !["create", "confirm"].includes(body.action) ||
    (body.action === "confirm" &&
      (typeof body.id !== "string" || !body.id.startsWith("pix-demo-")))
  )
    return failure("Informe a operação de demonstração.", 422);

  const userId = session.user.id;
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const now = new Date();
        const today = now.toLocaleDateString("sv-SE", {
          timeZone: "America/Bahia",
        });
        const eligible = await tx.motorista.findFirst({
          where: {
            userId,
            disponivel: true,
            cadastro: {
              status: "APROVADO",
              cnhValidade: { gte: new Date(today) },
              veiculo: { ativo: true },
            },
          },
          select: { userId: true },
        });
        if (!eligible)
          return {
            error:
              "O cadastro precisa estar aprovado, com CNH válida e veículo ativo.",
            status: 422,
          };
        if (body.action === "confirm") {
          const invoice = await tx.vinculoAssinatura.findFirst({
            where: { id: body.id, motoristaId: userId },
          });
          if (!invoice)
            return {
              error: "Cobrança de demonstração indisponível.",
              status: 404,
            };
          if (
            invoice.status === "ATIVA" &&
            invoice.fimEm &&
            invoice.fimEm > now
          )
            return { active: true, expiresAt: invoice.fimEm };
          if (invoice.status !== "PENDENTE")
            return {
              error: "Gere uma nova cobrança de demonstração.",
              status: 422,
            };
          const active = await tx.vinculoAssinatura.findFirst({
            where: {
              motoristaId: userId,
              status: "ATIVA",
              inicioEm: { lte: now },
              fimEm: { gt: now },
            },
          });
          if (active) return { active: true, expiresAt: active.fimEm };
          const expiry = new Date(+now + 30 * 86400000);
          await tx.vinculoAssinatura.update({
            where: { id: invoice.id },
            data: {
              status: "ATIVA",
              inicioEm: now,
              fimEm: expiry,
            },
          });
          return { active: true, expiresAt: expiry };
        }
        const active = await tx.vinculoAssinatura.findFirst({
          where: {
            motoristaId: userId,
            status: "ATIVA",
            inicioEm: { lte: now },
            fimEm: { gt: now },
          },
        });
        if (active) return { active: true, expiresAt: active.fimEm };
        // Only invoices created by this simulator are eligible for simulated confirmation.
        const pending = await tx.vinculoAssinatura.findFirst({
          where: {
            motoristaId: userId,
            status: "PENDENTE",
            id: { startsWith: "pix-demo-" },
          },
          orderBy: { criadoEm: "desc" },
        });
        const invoice =
          pending ??
          (await tx.vinculoAssinatura.create({
            data: {
              id: `pix-demo-${randomUUID()}`,
              motoristaId: userId,
            },
          }));
        return { active: false, id: invoice.id };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    if ("error" in result && result.error)
      return failure(result.error, result.status);
    if (result.active)
      return Response.json(result, {
        headers: { "Cache-Control": "no-store" },
      });
    const code = `FRETTA-DEMONSTRACAO:${result.id}:BRL49.90`;
    return Response.json(
      {
        ...result,
        code,
        qr: await QRCode.toDataURL(code, { width: 240, margin: 2 }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    )
      return failure("A situação mudou. Atualize e tente novamente.", 409);
    return failure(
      "Não foi possível processar a cobrança de demonstração.",
      500,
    );
  }
}
