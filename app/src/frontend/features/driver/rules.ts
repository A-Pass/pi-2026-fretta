import { demoPickupPoints } from "../../mocks/demoRequests";
import type { MapPoint, OperatingArea, Store, Proposal } from "@/contracts";
export const defaultArea: OperatingArea = {
  center: { lat: -16.377, lng: -39.58 },
  radiusKm: 20,
  label: "Eunápolis · base de exemplo",
};
// Approximate fictional point for the seed opportunity, not a real customer's address.
const seedPickupPoints: Record<string, MapPoint> = {
  f1: { lat: -16.377, lng: -39.58 },
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
      const p =
        store.freightAddresses?.[f.id]?.pickup.point ||
        seedPickupPoints[f.id] ||
        demoPickupPoints[f.id];
      if (!p) return [];
      const distance = distanceKm(area.center, p);
      return distance <= area.radiusKm ? [{ freight: f, distance }] : [];
    })
    .sort((a, b) => a.distance - b.distance);
}
export function ownProposal(p: Proposal, name: string) {
  return p.driverId === "demo-driver" || (!p.driverId && p.driver === name);
}
