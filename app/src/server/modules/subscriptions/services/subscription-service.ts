import { prisma } from "@/server/db/prisma";

export async function consultarAssinatura(usuarioId: string) {
  const agora = new Date();

  // Consultar apenas assinaturas válidas do usuário autenticado.
  const assinatura = await prisma.vinculo_assinatura.findFirst({
    where: {
      motorista_id: usuarioId,
      status: "ATIVA",
      inicio_em: { lte: agora },
      fim_em: { gt: agora },
    },
    orderBy: [{ fim_em: "desc" }, { criado_em: "desc" }],
    select: {
      id: true,
      fim_em: true,
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
    expiresAt: assinatura.fim_em!.toISOString(),
  };
}
