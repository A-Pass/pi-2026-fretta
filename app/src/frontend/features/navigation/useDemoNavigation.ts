import { useEffect, useRef, useState } from "react";
import type { Role } from "@/contracts";
import {
  initialRoute,
  parseRoute,
  routeUrl,
  type DemoRoute,
  type Tab,
} from "./routes";
const sessionKey = "fretta-demo-session";
export function useDemoNavigation() {
  const [route, setRoute] = useState<DemoRoute>(initialRoute);
  const current = useRef(route);
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [loginRequested, setLoginRequested] = useState(false);
  useEffect(() => {
    const restore = () => {
      const r = parseRoute(location.search);
      current.current = r;
      setRoute(r);
    };
    restore();
    try {
      setEntered(sessionStorage.getItem(sessionKey) === "active");
    } catch {
      /* Session stays in memory when storage is unavailable. */
    }
    setReady(true);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function navigate(patch: Partial<DemoRoute>, replace = false) {
    const from = routeUrl(current.current);
    const next = { ...current.current, ...patch };
    current.current = next;
    setRoute(next);
    const url = routeUrl(next);
    if (url !== location.pathname + location.search)
      window.history[replace ? "replaceState" : "pushState"](
        { frettaBackTo: replace ? window.history.state?.frettaBackTo : from },
        "",
        url,
      );
    window.scrollTo({ top: 0 });
  }
  return {
    ...route,
    ready,
    entered,
    loginRequested,
    setLoginRequested,
    navigate,
    back: (fallback: Tab = "fretes") => {
      if (
        typeof window.history.state?.frettaBackTo === "string" &&
        window.history.state.frettaBackTo.startsWith("/?")
      )
        window.history.back();
      else
        navigate({
          tab: fallback,
          selected: null,
          chatId: "",
          providerId: null,
          providerConversationId: null,
        });
    },
    openProvider: (providerId: string, providerConversationId?: string) =>
      navigate({
        providerId,
        providerConversationId: providerConversationId || null,
        tab: "prestador",
        selected: null,
        chatId: "",
      }),
    setRole: (role: Role) =>
      navigate({
        role,
        tab: "inicio",
        selected: null,
        chatId: "",
        providerId: null,
        providerConversationId: null,
      }),
    setSelected: (selected: string | null) =>
      navigate({
        selected,
        chatId: "",
        providerId: null,
        providerConversationId: null,
        tab: "fretes",
      }),
    setChatId: (chatId: string) =>
      navigate({
        chatId,
        selected: null,
        providerId: null,
        providerConversationId: null,
        tab: "chat",
      }),
    nav: (tab: string) =>
      navigate({
        tab: tab as Tab,
        selected: null,
        chatId: "",
        providerId: null,
        providerConversationId: null,
      }),
    login: () => {
      try {
        sessionStorage.setItem(sessionKey, "active");
      } catch {}
      setEntered(true);
      setLoginRequested(false);
    },
    logout: () => {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
      setEntered(false);
      setLoginRequested(false);
      navigate(
        {
          tab: "inicio",
          selected: null,
          chatId: "",
          providerId: null,
          providerConversationId: null,
        },
        true,
      );
    },
  };
}
