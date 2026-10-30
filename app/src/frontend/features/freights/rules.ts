import type { Store } from "@/contracts";
import { proposalOffers } from "./negotiation";
export function acceptProposal(store: Store, id: string): Store {
  const p = store.proposals.find((p) => p.id === id);
  const f = store.freights.find((f) => f.id === p?.freightId);
  if (!p || !f || f.status !== "ABERTO" || p.status !== "PENDENTE")
    throw new Error("Esta proposta não está mais disponível.");
  return {
    ...store,
    freights: store.freights.map((x) =>
      x.id === f.id ? { ...x, status: "AGENDADO", acceptedProposalId: id } : x,
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
