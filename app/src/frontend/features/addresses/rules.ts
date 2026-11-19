import type { Address, FreightRequestDraft, Schedule } from "@/contracts";
export function emptyAddress(): Address {
  return {
    label: "",
    city: "",
    state: "BA",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
    point: null,
  };
}
export function publicRegion(a: Address) {
  return `${a.neighborhood.trim()}, ${a.city.trim()} · ${a.state}`;
}
export function addressError(a: Address, requireLabel = false): string {
  if (requireLabel && !a.label.trim())
    return "Dê um nome para este endereço, como Casa ou Trabalho.";
  if (
    !a.point ||
    !Number.isFinite(a.point.lat) ||
    !Number.isFinite(a.point.lng) ||
    Math.abs(a.point.lat) > 90 ||
    Math.abs(a.point.lng) > 180
  )
    return "Marque e confirme o ponto no mapa.";
  if (
    !a.city.trim() ||
    !a.neighborhood.trim() ||
    !a.street.trim() ||
    !a.number.trim() ||
    !a.state
  )
    return "Preencha cidade, estado, bairro, rua e número (ou S/N).";
  return "";
}
export function todayLocal() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bahia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
function validDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value);
  return (
    Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
  );
}
export function scheduleError(s: Schedule, today = todayLocal()) {
  if (s.kind === "combinar") return "";
  if (!validDate(s.start) || s.start < today)
    return "Escolha uma data válida a partir de hoje.";
  if (s.kind === "intervalo" && (!validDate(s.end) || s.end < s.start))
    return "O fim do intervalo deve ser igual ou posterior ao início.";
  return "";
}
export function stepError(
  d: Omit<FreightRequestDraft, "schedule"> & { schedule: Schedule | null },
  step: number,
) {
  if (step === 0) {
    if (d.title.trim().length < 3)
      return "Digite um título com pelo menos 3 caracteres.";
    if (!d.description.trim()) return "Descreva o que precisa transportar.";
    return "";
  }
  if (step === 1) return addressError(d.pickup, d.savePickup);
  if (step === 2) return addressError(d.delivery, d.saveDelivery);
  if (step === 3) return d.vehicle ? "" : "Selecione o veículo necessário.";
  if (step === 4 || step === 5) {
    if (!d.schedule) return "Escolha quando você quer o frete.";
    if (step === 5) return scheduleError(d.schedule);
  }
  return "";
}
