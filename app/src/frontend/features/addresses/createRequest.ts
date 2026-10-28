import type { Store, Freight, FreightRequestDraft } from "@/contracts";
import { publicRegion, stepError } from "./rules";
/** Demo adapter only. Private snapshots must move behind server authorization before production. */
export function createRequest(
  store: Store,
  draft: FreightRequestDraft,
  makeId = () => crypto.randomUUID(),
): Store {
  for (let step = 0; step < 6; step++) {
    const error = stepError(draft, step);
    if (error) throw new Error(error);
  }
  const id = makeId();
  const next: Freight = {
    id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    origin: publicRegion(draft.pickup),
    destination: publicRegion(draft.delivery),
    vehicle: draft.vehicle,
    schedule: { ...draft.schedule },
    status: "ABERTO",
    photos: [...draft.photos],
    reviews: {},
  };
  const addresses = [...(store.addresses || [])];
  if (draft.savePickup)
    addresses.push({ ...structuredClone(draft.pickup), id: makeId() });
  if (draft.saveDelivery)
    addresses.push({ ...structuredClone(draft.delivery), id: makeId() });
  return {
    ...store,
    addresses,
    freights: [next, ...store.freights],
    freightAddresses: {
      ...store.freightAddresses,
      [id]: {
        pickup: structuredClone(draft.pickup),
        delivery: structuredClone(draft.delivery),
      },
    },
  };
}
