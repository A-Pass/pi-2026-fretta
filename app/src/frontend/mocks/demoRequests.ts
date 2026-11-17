import type { Freight, MapPoint, Store } from "@/contracts";
// Fictional approximate pickup points, exclusively for previewing the radius filter.
export const demoPickupPoints: Record<string, MapPoint> = {
  "demo-freight-sofa": { lat: -16.385, lng: -39.59 },
  "demo-freight-apartment": { lat: -16.405, lng: -39.565 },
  "demo-freight-fridge": { lat: -16.35, lng: -39.61 },
  "demo-freight-shop": { lat: -16.45, lng: -39.6 },
  "demo-freight-return": { lat: -16.443, lng: -39.07 },
};
function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bahia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
function freight(
  id: string,
  title: string,
  description: string,
  origin: string,
  destination: string,
  vehicle: string,
  schedule: Freight["schedule"],
): Freight {
  return {
    id,
    title,
    description,
    origin,
    destination,
    vehicle,
    schedule,
    status: "ABERTO",
    photos: [],
    reviews: {},
  };
}
export function demoRequests(): Freight[] {
  return [
    freight(
      "demo-freight-sofa",
      "Entrega de um sofá",
      "Sofá de três lugares e uma poltrona. Retirada no térreo, com ajuda para carregar. Solicitação fictícia para demonstração.",
      "Pequi, Eunápolis · BA",
      "Centro, Eunápolis · BA",
      "Utilitário",
      { kind: "fixa", start: futureDate(2) },
    ),
    freight(
      "demo-freight-apartment",
      "Mudança para Porto Seguro",
      "Cama de casal, guarda-roupa desmontado, geladeira e oito caixas. Preciso de um ajudante. Solicitação fictícia para demonstração.",
      "Dinah Borges, Eunápolis · BA",
      "Centro, Porto Seguro · BA",
      "Caminhão pequeno",
      { kind: "intervalo", start: futureDate(3), end: futureDate(5) },
    ),
    freight(
      "demo-freight-fridge",
      "Transporte de geladeira e máquina de lavar",
      "Dois eletrodomésticos. Os itens estarão embalados; transporte em pé e com proteção. Solicitação fictícia para demonstração.",
      "Juca Rosa, Eunápolis · BA",
      "Centauro, Eunápolis · BA",
      "Utilitário",
      { kind: "combinar" },
    ),
    freight(
      "demo-freight-shop",
      "Frete de mercadorias para uma loja",
      "Quinze caixas e duas estantes desmontadas. A entrega será em horário comercial. Solicitação fictícia para demonstração.",
      "Ariapuanã, Eunápolis · BA",
      "Centro, Santa Cruz Cabrália · BA",
      "Caminhão médio",
      { kind: "fixa", start: futureDate(4) },
    ),
    freight(
      "demo-freight-return",
      "Carga de retorno para Eunápolis",
      "Mesa, seis cadeiras e caixas pequenas. Boa opção para quem retorna de Porto Seguro. Solicitação fictícia para demonstração.",
      "Centro, Porto Seguro · BA",
      "Centro, Eunápolis · BA",
      "Caminhão pequeno",
      { kind: "combinar" },
    ),
  ];
}
export function withDemoRequests(store: Store): Store {
  const existing = new Set(store.freights.map((f) => f.id));
  return {
    ...store,
    freights: [
      ...store.freights,
      ...demoRequests().filter((f) => !existing.has(f.id)),
    ],
  };
}
