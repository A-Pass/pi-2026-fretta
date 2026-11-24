import type { Freight, FreightRequestDraft, Store } from "@/contracts";
import { emptyAddress, publicRegion, stepError } from "../addresses/rules";
import { proposalOffers } from "../freights/negotiation";
export function requestDraft(store: Store, f: Freight): FreightRequestDraft {
  const a = store.freightAddresses?.[f.id];
  return {
    title: f.title,
    description: f.description,
    photos: [...f.photos],
    pickup: structuredClone(a?.pickup || emptyAddress()),
    delivery: structuredClone(a?.delivery || emptyAddress()),
    savePickup: false,
    saveDelivery: false,
    vehicle: f.vehicle,
    schedule: { ...f.schedule },
  };
}
export function editRequest(
  store: Store,
  id: string,
  draft: FreightRequestDraft,
  expectedRevision: number,
): Store {
  const f = store.freights.find((f) => f.id === id);
  if (!f || f.status !== "ABERTO" || (f.revision || 0) !== expectedRevision)
    throw Error(
      "A solicitação mudou ou já foi contratada. Reabra os detalhes antes de editar.",
    );
  for (let i = 0; i < 6; i++) {
    const error = stepError(draft, i);
    if (error) throw Error(error);
  }
  const old = requestDraft(store, f);
  const content = (d: FreightRequestDraft) =>
    JSON.stringify([
      d.title.trim(),
      d.description.trim(),
      d.photos,
      d.pickup,
      d.delivery,
      d.vehicle,
      d.schedule,
    ]);
  if (content(old) === content(draft)) {
    if (!draft.savePickup && !draft.saveDelivery) return store;
    return {
      ...store,
      addresses: [
        ...(store.addresses || []),
        ...(draft.savePickup
          ? [{ ...structuredClone(draft.pickup), id: crypto.randomUUID() }]
          : []),
        ...(draft.saveDelivery
          ? [{ ...structuredClone(draft.delivery), id: crypto.randomUUID() }]
          : []),
      ],
    };
  }
  const revision = (f.revision || 0) + 1,
    at = new Date().toISOString();
  return {
    ...store,
    freights: store.freights.map((x) =>
      x.id === id
        ? {
            ...x,
            title: draft.title.trim(),
            description: draft.description.trim(),
            photos: [...draft.photos],
            origin: publicRegion(draft.pickup),
            destination: publicRegion(draft.delivery),
            vehicle: draft.vehicle,
            schedule: { ...draft.schedule },
            revision,
            updatedAt: at,
          }
        : x,
    ),
    freightAddresses: {
      ...store.freightAddresses,
      [id]: {
        pickup: structuredClone(draft.pickup),
        delivery: structuredClone(draft.delivery),
      },
    },
    addresses: [
      ...(store.addresses || []),
      ...(draft.savePickup
        ? [{ ...structuredClone(draft.pickup), id: crypto.randomUUID() }]
        : []),
      ...(draft.saveDelivery
        ? [{ ...structuredClone(draft.delivery), id: crypto.randomUUID() }]
        : []),
    ],
    proposals: store.proposals.map((p) =>
      p.freightId === id
        ? {
            ...p,
            status: "ENCERRADA",
            offers: proposalOffers(p).map((o) =>
              o.status === "PENDENTE" ? { ...o, status: "ENCERRADA" } : o,
            ),
          }
        : p,
    ),
  };
}
export function cancelClientRequest(
  store: Store,
  id: string,
  reason: string,
  expectedStatus: Freight["status"],
): Store {
  const f = store.freights.find((f) => f.id === id);
  if (
    !f ||
    f.status !== expectedStatus ||
    !["ABERTO", "AGENDADO"].includes(f.status)
  )
    throw Error("Não é possível cancelar neste momento. Atualize os detalhes.");
  if (reason.trim().length < 10 || reason.trim().length > 1000)
    throw Error("Informe o motivo do cancelamento em 10 a 1000 caracteres.");
  return {
    ...store,
    freights: store.freights.map((x) =>
      x.id === id
        ? {
            ...x,
            status: "CANCELADO",
            cancellation: {
              role: "cliente",
              reason: reason.trim(),
              at: new Date().toISOString(),
              previousStatus: f.status,
            },
          }
        : x,
    ),
    proposals: store.proposals.map((p) =>
      p.freightId === id
        ? {
            ...p,
            status: "ENCERRADA",
            offers: proposalOffers(p).map((o) =>
              ["PENDENTE", "ACEITA"].includes(o.status)
                ? { ...o, status: "ENCERRADA" }
                : o,
            ),
          }
        : p,
    ),
  };
}
