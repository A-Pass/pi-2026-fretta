import type { Freight, MapPoint, OperatingArea, Store, Proposal } from "@/contracts";
import type { FreightFeedItem } from "../../api/backend";
export const defaultArea: OperatingArea = {
  center: { lat: -16.377, lng: -39.58 },
  radiusKm: 20,
  label: "Eunápolis · base de exemplo",
};
export function distanceKm(a: MapPoint, b: MapPoint) {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat),
    dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function opportunities(store: Store, area: OperatingArea) {
  return store.freights
    .flatMap((f) => {
      if (f.status !== "ABERTO") return [];
      const p = store.freightAddresses?.[f.id]?.pickup.point;
      if (!p) return [];
      const distance = distanceKm(area.center, p);
      return distance <= area.radiusKm ? [{ freight: f, distance }] : [];
    })
    .sort((a, b) => a.distance - b.distance);
}
export function sortFeedItemsByPickupDistance(items: FreightFeedItem[]) {
  return items
    .map((freight) => ({
      freight,
      distance: freight.pickupDistanceKm ?? null,
    }))
    .sort(
      (a, b) =>
        (a.distance ?? Number.POSITIVE_INFINITY) -
        (b.distance ?? Number.POSITIVE_INFINITY),
    );
}
export function isFreightFeedItem(value: unknown): value is FreightFeedItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const schedule = item.schedule;
  const scheduleKind =
    schedule && typeof schedule === "object"
      ? (schedule as Record<string, unknown>).kind
      : undefined;
  const validSchedule =
    typeof scheduleKind === "string" &&
    ["fixa", "intervalo", "combinar"].includes(scheduleKind);
  const status = item.status;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.description === "string" &&
    typeof item.origin === "string" &&
    typeof item.destination === "string" &&
    typeof item.vehicle === "string" &&
    validSchedule &&
    typeof status === "string" &&
    ["ABERTO", "AGENDADO", "EM_TRANSPORTE", "CONCLUIDO", "CANCELADO"].includes(
      status,
    )
  );
}
export function freightFromFeedItem(item: FreightFeedItem): Freight {
  return { ...item, photos: [], reviews: {} };
}
export function ownProposal(p: Proposal, userId: string) {
  return Boolean(userId) && p.driverId === userId;
}
