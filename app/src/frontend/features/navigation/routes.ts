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
] as const;
export type Tab = (typeof tabs)[number];
export type DemoRoute = {
  role: Role;
  tab: Tab;
  selected: string | null;
  chatId: string;
};
export const initialRoute: DemoRoute = {
  role: "cliente",
  tab: "inicio",
  selected: null,
  chatId: "",
};
export function parseRoute(search: string): DemoRoute {
  const p = new URLSearchParams(search);
  const role = p.get("perfil") === "motorista" ? "motorista" : "cliente";
  const tab = tabs.includes(p.get("tela") as Tab)
    ? (p.get("tela") as Tab)
    : "inicio";
  const selected = p.get("frete");
  const chatId = p.get("conversa") || "";
  return {
    role,
    tab: chatId ? "chat" : selected ? "fretes" : tab,
    selected: chatId ? null : selected,
    chatId,
  };
}
export function routeUrl(route: DemoRoute) {
  const p = new URLSearchParams({ perfil: route.role, tela: route.tab });
  if (route.selected) p.set("frete", route.selected);
  if (route.chatId) p.set("conversa", route.chatId);
  return `/?${p}`;
}
