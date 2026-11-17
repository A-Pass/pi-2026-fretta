import type { Role } from "@/contracts";
export const tabs = [
  "inicio",
  "fretes",
  "chat",
  "perfil",
  "editar-perfil",
  "enderecos",
  "veiculos",
  "assinatura",
  "notificacoes",
  "cadastro-motorista",
  "prestador",
  "empresa",
  "equipe",
] as const;
export type Tab = (typeof tabs)[number];
export type DemoRoute = {
  role: Role;
  tab: Tab;
  selected: string | null;
  chatId: string;
  providerId: string | null;
  providerConversationId: string | null;
};
export const initialRoute: DemoRoute = {
  role: "cliente",
  tab: "inicio",
  selected: null,
  chatId: "",
  providerId: null,
  providerConversationId: null,
};
export function parseRoute(search: string): DemoRoute {
  const p = new URLSearchParams(search);
  const role = p.get("perfil") === "motorista" ? "motorista" : "cliente";
  const tab = tabs.includes(p.get("tela") as Tab)
    ? (p.get("tela") as Tab)
    : "inicio";
  const providerId = p.get("prestador");
  const selected = p.get("frete");
  const chatId = p.get("conversa") || "";
  return {
    role,
    tab: providerId ? "prestador" : chatId ? "chat" : selected ? "fretes" : tab,
    selected: providerId || chatId ? null : selected,
    chatId: providerId ? "" : chatId,
    providerId,
    providerConversationId: providerId ? p.get("negociacao") : null,
  };
}
export function routeUrl(route: DemoRoute) {
  const p = new URLSearchParams({ perfil: route.role, tela: route.tab });
  if (route.providerId) {
    p.set("prestador", route.providerId);
    if (route.providerConversationId)
      p.set("negociacao", route.providerConversationId);
  }
  if (route.selected) p.set("frete", route.selected);
  if (route.chatId) p.set("conversa", route.chatId);
  return `/?${p}`;
}
