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
    (p.requestRevision || 0) !== (f.revision || 0) ||
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
              providerName: p.providerName,
              providerKind: p.providerKind,
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
  publishComment = false,
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
            reviewPublicComments: {
              ...f.reviewPublicComments,
              [role]: publishComment,
            },
            reviewDates: { ...f.reviewDates, [role]: new Date().toISOString() },
          }
        : f,
    ),
  };
}

export function startFreight(
  store: Store,
  freightId: string,
  role: Role,
  now = Date.now(),
): Store {
  const freight = store.freights.find((item) => item.id === freightId);
  const availableAt = Date.parse(freight?.agreement?.availableAt || "");
  if (
    !freight ||
    role !== "motorista" ||
    freight.status !== "AGENDADO" ||
    !freight.agreement?.driverId ||
    freight.agreement.driverId !== store.profile?.id ||
    !Number.isFinite(availableAt) ||
    availableAt > now
  )
    throw new Error("O início deste frete não está disponível.");
  return {
    ...store,
    freights: store.freights.map((item) =>
      item.id === freightId ? { ...item, status: "EM_TRANSPORTE" } : item,
    ),
  };
}

export function completeFreight(
  store: Store,
  freightId: string,
  role: Role,
): Store {
  const freight = store.freights.find((item) => item.id === freightId);
  if (!freight || role !== "cliente" || freight.status !== "EM_TRANSPORTE")
    throw new Error("A conclusão deste frete não está disponível.");
  return {
    ...store,
    freights: store.freights.map((item) =>
      item.id === freightId ? { ...item, status: "CONCLUIDO" } : item,
    ),
  };
}

export function cancelFreight(
  store: Store,
  freightId: string,
  role: Role,
  reason: string,
): Store {
  const freight = store.freights.find((item) => item.id === freightId);
  const trimmedReason = reason.trim();
  const canCancelAsClient =
    role === "cliente" &&
    ["ABERTO", "AGENDADO", "EM_TRANSPORTE"].includes(freight?.status || "");
  const canCancelAsDriver =
    role === "motorista" &&
    ["AGENDADO", "EM_TRANSPORTE"].includes(freight?.status || "") &&
    !!freight?.agreement?.driverId &&
    freight.agreement.driverId === store.profile?.id;
  if (
    !freight ||
    (!canCancelAsClient && !canCancelAsDriver) ||
    trimmedReason.length < 3 ||
    trimmedReason.length > 1000
  )
    throw new Error("Informe o motivo para cancelar este frete.");

  const proposalIds = canCancelAsDriver
    ? [freight.acceptedProposalId || freight.agreement?.proposalId].filter(
        (id): id is string => !!id,
      )
    : freight.acceptedProposalId
      ? [freight.acceptedProposalId]
      : freight.agreement?.proposalId
        ? [freight.agreement.proposalId]
        : store.proposals
            .filter(
              (proposal) =>
                proposal.freightId === freightId &&
                proposal.status === "PENDENTE",
            )
            .map((proposal) => proposal.id);
  const canceledAt = new Date().toISOString();
  const canceledBy = role === "cliente" ? "Cliente" : "Motorista";
  const cancellationMessages = proposalIds.map((proposalId) => ({
    id: crypto.randomUUID(),
    freightId,
    proposalId,
    role,
    text: `${canceledBy} cancelou o frete. Motivo: ${trimmedReason}`,
    createdAt: canceledAt,
  }));
  const reopened = canCancelAsDriver;

  return {
    ...store,
    freights: store.freights.map((item) =>
      item.id === freightId
        ? {
            ...item,
            status: reopened ? "ABERTO" : "CANCELADO",
            ...(reopened
              ? { acceptedProposalId: undefined, agreement: undefined }
              : {}),
          }
        : item,
    ),
    proposals: store.proposals.map((proposal) =>
      proposal.freightId === freightId &&
      (reopened ||
        proposal.status === "PENDENTE" ||
        proposal.status === "ACEITA")
        ? {
            ...proposal,
            status: "ENCERRADA",
            offers: proposal.offers?.map((offer) =>
              offer.status === "PENDENTE" || offer.status === "ACEITA"
                ? { ...offer, status: "ENCERRADA" }
                : offer,
            ),
          }
        : proposal,
    ),
    messages: [...store.messages, ...cancellationMessages],
  };
}
