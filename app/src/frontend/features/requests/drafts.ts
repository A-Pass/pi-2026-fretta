import type { FreightRequestDraft } from "@/contracts";
import { emptyAddress } from "../addresses/rules";
const prefix = "fretta-request-draft:";
export const draftKey = (id = "new", revision = 0) =>
  `${prefix}${id}:${revision}`;
export type RequestWizardDraft = Omit<FreightRequestDraft, "schedule"> & {
  schedule: FreightRequestDraft["schedule"] | null;
};
export type SavedDraft = {
  draft: RequestWizardDraft;
  step: number;
  at: number;
};
export function emptyRequest(): RequestWizardDraft {
  return {
    title: "",
    description: "",
    photos: [],
    pickup: emptyAddress(),
    delivery: emptyAddress(),
    savePickup: false,
    saveDelivery: false,
    vehicle: "",
    schedule: null,
  };
}
export function decodeDraft(
  raw: string | null,
  now = Date.now(),
): SavedDraft | null {
  if (!raw || raw.length > 8000000) return null;
  try {
    const d = JSON.parse(raw) as SavedDraft,
      v = d.draft;
    if (
      !Number.isFinite(d.at) ||
      now - d.at > 86400000 ||
      d.at > now + 60000 ||
      !Number.isInteger(d.step) ||
      d.step < 0 ||
      d.step > 5 ||
      !v
    )
      return null;
    const address = (a: typeof v.pickup) =>
      a &&
      [
        "label",
        "city",
        "state",
        "neighborhood",
        "street",
        "number",
        "complement",
      ].every((k) => typeof a[k as keyof typeof a] === "string") &&
      (a.point === null ||
        (Number.isFinite(a.point?.lat) &&
          Number.isFinite(a.point?.lng) &&
          Math.abs(a.point!.lat) <= 90 &&
          Math.abs(a.point!.lng) <= 180));
    if (
      ![v.title, v.description, v.vehicle].every(
        (x) => typeof x === "string",
      ) ||
      !address(v.pickup) ||
      !address(v.delivery) ||
      typeof v.savePickup !== "boolean" ||
      typeof v.saveDelivery !== "boolean" ||
      !Array.isArray(v.photos) ||
      v.photos.length > 4 ||
      v.photos.some(
        (x) =>
          typeof x !== "string" ||
          !/^data:image\/(jpeg|png|webp);base64,/.test(x),
      ) ||
      (v.schedule !== null &&
        (!v.schedule ||
          !["fixa", "intervalo", "combinar"].includes(v.schedule.kind) ||
          [v.schedule.start, v.schedule.end].some(
            (x) => x !== undefined && typeof x !== "string",
          )))
    )
      return null;
    return d;
  } catch {
    return null;
  }
}
export function clearRequestDrafts(storage: Storage) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key?.startsWith(prefix)) storage.removeItem(key);
  }
}
