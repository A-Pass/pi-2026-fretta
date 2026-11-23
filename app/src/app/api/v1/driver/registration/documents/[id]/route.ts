import { NextRequest } from "next/server";
import { open, constants } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { verificarAdministrador } from "@/server/auth/permissions";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "Entre na sua conta para acessar este documento.",
      },
      { status: 401 },
    );
  const { id } = await params;
  const document = await prisma.arquivo_privado.findUnique({ where: { id } });
  if (
    !document ||
    (document.motorista_id !== session.user.id &&
      !(await verificarAdministrador(session.user.id)))
  )
    return Response.json(
      { code: "NOT_FOUND", message: "Documento indisponível." },
      { status: 404 },
    );
  if (!/^[0-9a-f-]{36}\.jpg$/i.test(document.chave_armazenamento))
    return Response.json(
      { code: "NOT_FOUND", message: "Documento indisponível." },
      { status: 404 },
    );
  try {
    const file = await open(
      path.resolve(
        process.cwd(),
        "storage",
        "private",
        document.chave_armazenamento,
      ),
      constants.O_RDONLY | constants.O_NOFOLLOW,
    );
    try {
      const bytes = await file.readFile();
      return new Response(new Uint8Array(bytes), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
          "Content-Disposition": "inline",
        },
      });
    } finally {
      await file.close();
    }
  } catch {
    return Response.json(
      { code: "NOT_FOUND", message: "Documento indisponível." },
      { status: 404 },
    );
  }
}
