import { prisma } from "@/server/db/prisma";

export async function consultarAssinatura(usuarioId: string) {
  const agora = new Date();

  // Consultar apenas assinaturas válidas do usuário autenticado.
  const assinatura = await prisma.vinculoAssinatura.findFirst({
    where: {
      motoristaId: usuarioId,
      status: "ATIVA",
      inicioEm: {
        lte: agora,
      },
      fimEm: {
        gt: agora,
      },
    },
    orderBy: [{ fimEm: "desc" }, { criadoEm: "desc" }],
    select: {
      id: true,
      fimEm: true,
    },
  });

  if (!assinatura) {
    return {
      active: false,
      expiresAt: null,
    };
  }

  return {
    active: true,
    expiresAt: assinatura.fimEm!.toISOString(),
  };
}
