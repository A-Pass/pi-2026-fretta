import type { Proposal, ProposalOffer, Store } from "@/contracts";

export function proposalOffers(p: Proposal): ProposalOffer[] {
  if (p.offers)
    return p.offers.map((o) =>
      o.status === "PENDENTE" && p.status !== "PENDENTE"
        ? { ...o, status: p.status }
        : o,
    );
  return [
    {
      id: p.id,
      vehicle: p.vehicle,
      priceCents: p.priceCents,
      availableAt: p.availableAt,
      message: p.message,
      status: p.status,
    },
  ];
}

export function declineOffer(
  store: Store,
  proposalId: string,
  offerId: string,
): Store {
  const p = store.proposals.find((x) => x.id === proposalId);
  const latest = p && proposalOffers(p).at(-1);
  if (
    !p ||
    !latest ||
    latest.id !== offerId ||
    latest.status !== "PENDENTE" ||
    p.status !== "PENDENTE" ||
    !store.freights.some((f) => f.id === p.freightId && f.status === "ABERTO")
  )
    throw new Error("Esta proposta não está mais disponível.");
  return {
    ...store,
    proposals: store.proposals.map((x) =>
      x.id === p.id
        ? {
            ...x,
            status: "ENCERRADA",
            offers: proposalOffers(x).map((o) =>
              o.id === offerId ? { ...o, status: "RECUSADA" } : o,
            ),
          }
        : x,
    ),
  };
}

export function reviseOffer(
  store: Store,
  proposalId: string,
  offer: ProposalOffer,
): Store {
  const p = store.proposals.find((x) => x.id === proposalId);
  if (
    !p ||
    !store.freights.some((f) => f.id === p.freightId && f.status === "ABERTO")
  )
    throw new Error("Este frete não está mais aberto para propostas.");
  if (
    !Number.isSafeInteger(offer.priceCents) ||
    offer.priceCents <= 0 ||
    !Number.isFinite(Date.parse(offer.availableAt)) ||
    Date.parse(offer.availableAt) <= Date.now() ||
    !offer.vehicle.trim() ||
    !offer.message.trim()
  )
    throw new Error(
      "Preencha o veículo, o comentário, um valor positivo e uma disponibilidade futura.",
    );
  return {
    ...store,
    proposals: store.proposals.map((x) =>
      x.id === p.id
        ? {
            ...x,
            vehicle: offer.vehicle,
            priceCents: offer.priceCents,
            availableAt: offer.availableAt,
            message: offer.message,
            status: "PENDENTE",
            offers: [
              ...proposalOffers(x).map((o): ProposalOffer =>
                o.status === "PENDENTE" ? { ...o, status: "SUBSTITUIDA" } : o,
              ),
              { ...offer, status: "PENDENTE" },
            ],
          }
        : x,
    ),
  };
}
