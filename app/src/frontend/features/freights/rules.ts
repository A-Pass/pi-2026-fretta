import type { Store, Role } from "@/contracts";
import { proposalOffers } from "./negotiation";
export function acceptProposal(
  store: Store,
  id: string,
  offerId?: string,
): Store {
  const p = store.proposals.find((p) => p.id === id);
  const f = store.freights.find((f) => f.id === p?.freightId);
  if (
    !p ||
    !f ||
    f.status !== "ABERTO" ||
    p.status !== "PENDENTE" ||
    (offerId && proposalOffers(p).at(-1)?.id !== offerId)
  )
    throw new Error("Esta proposta não está mais disponível.");
  return {
    ...store,
    freights: store.freights.map((x) =>
      x.id === f.id
        ? {
            ...x,
            status: "AGENDADO",
            acceptedProposalId: id,
            agreement: {
              proposalId: id,
              offerId: proposalOffers(p).at(-1)!.id,
              driver: p.driver,
              driverId: p.driverId,
              priceCents: p.priceCents,
              vehicle: p.vehicle,
              availableAt: p.availableAt,
              message: p.message,
              acceptedAt: new Date().toISOString(),
            },
          }
        : x,
    ),
    proposals: store.proposals.map((x) =>
      x.freightId === f.id
        ? {
            ...x,
            status: x.id === id ? "ACEITA" : "ENCERRADA",
            offers: proposalOffers(x).map((o) =>
              o.status === "PENDENTE"
                ? { ...o, status: x.id === id ? "ACEITA" : "ENCERRADA" }
                : o,
            ),
          }
        : x,
    ),
  };
}
export function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function submitReview(
  store: Store,
  freightId: string,
  role: Role,
  score: number,
  comment: string,
): Store {
  const freight = store.freights.find((f) => f.id === freightId);
  if (!freight || freight.status !== "CONCLUIDO" || freight.reviews[role])
    throw new Error("A avaliação não está disponível.");
  if (
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5 ||
    comment.length > 1000
  )
    throw new Error(
      "Escolha uma nota de 1 a 5 e um comentário de até 1000 caracteres.",
    );
  return {
    ...store,
    freights: store.freights.map((f) =>
      f.id === freightId
        ? {
            ...f,
            reviews: { ...f.reviews, [role]: score },
            reviewComments: { ...f.reviewComments, [role]: comment.trim() },
          }
        : f,
    ),
  };
}
