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

const roles: Role[] = ["cliente", "motorista"];
const legacyRouteKeys = [
  "perfil",
  "tela",
  "frete",
  "conversa",
  "prestador",
  "negociacao",
];

function decodeSegments(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return "";
      }
    });
}

function isRole(value: string | undefined): value is Role {
  return roles.includes(value as Role);
}

export function isAppRoute(pathname: string) {
  const [role, tab, ...params] = decodeSegments(pathname);
  if (!isRole(role) || !tabs.includes(tab as Tab)) return false;

  if (tab === "prestador") {
    return (
      (params.length === 1 && Boolean(params[0])) ||
      (params.length === 3 &&
        Boolean(params[0]) &&
        params[1] === "negociacao" &&
        Boolean(params[2]))
    );
  }

  if (tab === "fretes" || tab === "chat") {
    return params.length === 0 || (params.length === 1 && Boolean(params[0]));
  }

  return params.length === 0;
}

export function parseRoute(pathname: string): DemoRoute {
  const [pathRole, pathTab, id, action, conversationId] =
    decodeSegments(pathname);
  if (!isRole(pathRole) || !tabs.includes(pathTab as Tab)) return initialRoute;

  const tab = pathTab as Tab;
  const route: DemoRoute = {
    role: pathRole,
    tab,
    selected: null,
    chatId: "",
    providerId: null,
    providerConversationId: null,
  };

  if (tab === "fretes") route.selected = id || null;
  if (tab === "chat") route.chatId = id || "";
  if (tab === "prestador") {
    route.providerId = id || null;
    route.providerConversationId =
      action === "negociacao" ? conversationId || null : null;
  }

  return route;
}

export function parseLegacyRoute(search: string): DemoRoute {
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
    tab: providerId
      ? "prestador"
      : chatId
        ? "chat"
        : selected
          ? "fretes"
          : tab,
    selected: providerId || chatId ? null : selected,
    chatId: providerId ? "" : chatId,
    providerId,
    providerConversationId: providerId ? p.get("negociacao") : null,
  };
}

export function routeUrl(route: DemoRoute) {
  if (route.providerId) {
    const providerUrl = `/${route.role}/prestador/${encodeURIComponent(
      route.providerId,
    )}`;
    return route.providerConversationId
      ? `${providerUrl}/negociacao/${encodeURIComponent(route.providerConversationId)}`
      : providerUrl;
  }
  if (route.selected)
    return `/${route.role}/fretes/${encodeURIComponent(route.selected)}`;
  if (route.chatId)
    return `/${route.role}/chat/${encodeURIComponent(route.chatId)}`;
  return `/${route.role}/${route.tab}`;
}

export function hasLegacyRouteParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  return legacyRouteKeys.some((key) => searchParams[key] !== undefined);
}
