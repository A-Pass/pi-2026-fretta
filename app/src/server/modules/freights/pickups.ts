import type { Prisma } from "@/server/generated/prisma/client";

function scheduledAgreement(userId: string): Prisma.AcordoFreteWhereInput {
  return {
    motoristaId: userId,
    frete: {
      status_frete_enum: { in: ["ACEITO", "EM_TRANSPORTE"] },
      avaliacao: { none: {} },
    },
  };
}

export async function listScheduledPickups(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const agreements = await tx.acordoFrete.findMany({
    where: scheduledAgreement(userId),
    orderBy: [{ disponivelEm: "asc" }, { freteId: "asc" }],
    take: 20,
    select: {
      disponivelEm: true,
      frete: {
        select: {
          id: true,
          titulo: true,
          endereco_frete_endereco_origem_idToendereco: {
            select: { cidade: true },
          },
        },
      },
    },
  });
  return agreements.map(({ disponivelEm, frete }) => ({
    id: frete.id,
    title: frete.titulo,
    city:
      frete.endereco_frete_endereco_origem_idToendereco?.cidade ?? "",
    pickupAt: disponivelEm.toISOString(),
  }));
}

export async function registerDuePickups(
  tx: Prisma.TransactionClient,
  userId: string,
  now = new Date(),
) {
  const agreements = await tx.acordoFrete.findMany({
    where: { ...scheduledAgreement(userId), disponivelEm: { lte: now } },
    select: {
      freteId: true,
      propostaId: true,
      frete: { select: { titulo: true } },
    },
  });
  if (!agreements.length) return;

  await tx.notificacao.createMany({
    skipDuplicates: true,
    data: agreements.map(({ freteId, propostaId, frete }) => ({
      id: `pickup-due:${freteId}`,
      destinatario_id: userId,
      papel_destinatario: "motorista",
      evento: "HORARIO_RETIRADA",
      titulo: "Já é hora da retirada",
      corpo: frete.titulo,
      frete_id: freteId,
      proposta_id: propostaId,
      conversa_id: null,
    })),
  });
}
