export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const radians = Math.PI / 180;
  const h =
    Math.sin(((a.lat - b.lat) * radians) / 2) ** 2 +
    Math.cos(a.lat * radians) *
      Math.cos(b.lat * radians) *
      Math.sin(((a.lng - b.lng) * radians) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, h)));
}
