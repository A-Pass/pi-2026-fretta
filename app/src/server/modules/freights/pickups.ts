import type { Prisma } from "@/generated/prisma/client";

function scheduledPickup(userId: string): Prisma.OfertaWhereInput {
  return {
    status: "ACEITA",
    retiradaEm: { not: null },
    proposta: {
      motoristaId: userId,
      status: "ACEITA",
      freteQueAceitou: { status: "AGENDADO", avaliacoes: { none: {} } },
    },
  };
}

export async function listScheduledPickups(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const offers = await tx.oferta.findMany({
    where: scheduledPickup(userId),
    orderBy: [{ retiradaEm: "asc" }, { id: "asc" }],
    take: 20,
    select: {
      retiradaEm: true,
      proposta: {
        select: {
          frete: {
            select: { id: true, titulo: true, origemSnapshot: true },
          },
        },
      },
    },
  });
  return offers.map(({ retiradaEm, proposta: { frete } }) => {
    const origin = frete.origemSnapshot as {
      city?: string;
      cidade?: string;
    } | null;
    return {
      id: frete.id,
      title: frete.titulo,
      city: origin?.city ?? origin?.cidade ?? "",
      pickupAt: retiradaEm!.toISOString(),
    };
  });
}

export async function registerDuePickups(
  tx: Prisma.TransactionClient,
  userId: string,
  now = new Date(),
) {
  const offers = await tx.oferta.findMany({
    where: { ...scheduledPickup(userId), retiradaEm: { lte: now } },
    select: {
      id: true,
      propostaId: true,
      proposta: {
        select: {
          frete: { select: { id: true, titulo: true } },
          conversa: { select: { id: true } },
        },
      },
    },
  });
  if (!offers.length) return;
  const notificationIds = offers.map((offer) => `pickup-due:${offer.id}`);
  const existing = new Set(
    (
      await tx.notificacao.findMany({
        where: { id: { in: notificationIds } },
        select: { id: true },
      })
    ).map(({ id }) => id),
  );
  const pending = offers.filter(
    (offer) => !existing.has(`pickup-due:${offer.id}`),
  );
  if (!pending.length) return;
  await tx.notificacao.createMany({
    skipDuplicates: true,
    data: pending.map(({ id, propostaId, proposta }) => ({
      id: `pickup-due:${id}`,
      destinatarioId: userId,
      papelDestinatario: "motorista",
      evento: "HORARIO_RETIRADA",
      titulo: "Já é hora da retirada",
      corpo: proposta.frete.titulo,
      freteId: proposta.frete.id,
      propostaId,
      conversaId: proposta.conversa?.id,
    })),
  });
}
