import type { Address, FreightRequestDraft, Schedule } from "@/contracts";
export function emptyAddress(): Address {
  return {
    label: "",
    city: "",
    state: "BA",
    neighborhood: "",
    street: "",
    number: "",
    postalCode: "",
    complement: "",
    point: null,
  };
}

export type ReverseGeocodeAddress = Record<string, string | undefined>;

const brazilStates: Record<string, string> = {
  acre: "AC",
  alagoas: "AL",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceara: "CE",
  "distrito federal": "DF",
  "espirito santo": "ES",
  goias: "GO",
  maranhao: "MA",
  "mato grosso": "MT",
  "mato grosso do sul": "MS",
  "minas gerais": "MG",
  para: "PA",
  paraiba: "PB",
  parana: "PR",
  pernambuco: "PE",
  piaui: "PI",
  "rio de janeiro": "RJ",
  "rio grande do norte": "RN",
  "rio grande do sul": "RS",
  rondonia: "RO",
  roraima: "RR",
  "santa catarina": "SC",
  "sao paulo": "SP",
  sergipe: "SE",
  tocantins: "TO",
};

export function fillAddressFromReverseGeocode(
  address: Address,
  geocoded: ReverseGeocodeAddress,
): Address {
  const stateCode = geocoded.state_code?.trim().toUpperCase().replace(/^BR-/, "");
  const normalizedState =
    (stateCode && /^[A-Z]{2}$/.test(stateCode) ? stateCode : "") ||
    brazilStates[
      geocoded.state
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() || ""
    ] ||
    "";
  const city =
    geocoded.city ||
    geocoded.town ||
    geocoded.village ||
    geocoded.municipality ||
    "";
  const neighborhood =
    geocoded.suburb ||
    geocoded.neighbourhood ||
    geocoded.quarter ||
    geocoded.city_district ||
    "";
  const street =
    geocoded.road ||
    geocoded.pedestrian ||
    geocoded.residential ||
    geocoded.street ||
    geocoded.path ||
    "";

  return {
    ...address,
    city: city.trim() || address.city,
    state: normalizedState || address.state,
    neighborhood: neighborhood.trim() || address.neighborhood,
    street: street.trim() || address.street,
    number: geocoded.house_number?.trim() || address.number,
    postalCode: geocoded.postcode?.trim() || address.postalCode || "",
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
export function stepError(d: FreightRequestDraft, step: number) {
  if (step === 0)
    return !d.title.trim() || !d.description.trim()
      ? "Preencha o título e descreva o que precisa transportar."
      : "";
  if (step === 1) return addressError(d.pickup, d.savePickup);
  if (step === 2) return addressError(d.delivery, d.saveDelivery);
  if (step === 3) return d.vehicle ? "" : "Selecione o veículo necessário.";
  if (step === 5) return scheduleError(d.schedule);
  return "";
}
