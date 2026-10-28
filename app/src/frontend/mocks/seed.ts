import type { Store } from "@/contracts";
export const seed: Store = {
  freights: [
    {
      id: "f1",
      title: "Mudança para uma nova casa",
      description:
        "Sofá, cama de casal, geladeira e 12 caixas. Apartamento no primeiro andar, com escada. Preciso de ajuda para carregar.",
      origin: "Centro, Eunápolis · BA",
      destination: "Pequi, Eunápolis · BA",
      vehicle: "Caminhão pequeno",
      schedule: { kind: "combinar" },
      status: "ABERTO",
      photos: [],
      reviews: {},
    },
    {
      id: "f2",
      title: "Transporte de uma mesa",
      description: "Mesa desmontada e quatro cadeiras. Retirada em loja.",
      origin: "Dinah Borges, Eunápolis · BA",
      destination: "Centro, Eunápolis · BA",
      vehicle: "Utilitário",
      schedule: { kind: "combinar" },
      status: "CONCLUIDO",
      photos: [],
      reviews: { cliente: 5, motorista: 5 },
    },
  ],
  proposals: [
    {
      id: "p1",
      freightId: "f1",
      driver: "Carlos Santos",
      rating: 4.9,
      vehicle: "Caminhão pequeno · carroceria fechada",
      priceCents: 24000,
      availableAt: "2026-11-02T09:00",
      message:
        "Posso ajudar no carregamento. Tenho mantas para proteger os móveis.",
      status: "PENDENTE",
    },
    {
      id: "p2",
      freightId: "f1",
      driver: "Ana Oliveira",
      rating: 4.8,
      vehicle: "Caminhão pequeno",
      priceCents: 28000,
      availableAt: "2026-11-02T14:00",
      message: "Atendo com um ajudante e transporto os itens em uma viagem.",
      status: "PENDENTE",
    },
  ],
  messages: [],
};
