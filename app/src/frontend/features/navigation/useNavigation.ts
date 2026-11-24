import { useEffect, useRef, useState } from "react";
import { clearRequestDrafts } from "../requests/drafts";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/contracts";
import {
  initialRoute,
  parseRoute,
  routeUrl,
  type AppRoute,
  type Tab,
} from "./routes";
const sessionKey = "fretta-session";

export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(pathname));
  const current = useRef(route);
  const currentPath = useRef(pathname);
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [loginRequested, setLoginRequested] = useState(false);
  const history = useRef<string[]>([]);
  const pendingPath = useRef<string | null>(null);

  useEffect(() => {
    const next = parseRoute(pathname);
    current.current = next;
    currentPath.current = pathname;
    setRoute(next);
    if (pathname === pendingPath.current) {
      pendingPath.current = null;
    } else {
      const previousIndex = history.current.lastIndexOf(pathname);
      history.current =
        previousIndex === -1 ? [] : history.current.slice(0, previousIndex);
    }
  }, [pathname]);

  useEffect(() => {
    try {
      setEntered(sessionStorage.getItem(sessionKey) === "active");
    } catch {
      /* Session stays in memory when storage is unavailable. */
    }
    setReady(true);
  }, []);

  function navigate(patch: Partial<AppRoute>, replace = false) {
    const from = currentPath.current;
    const next = { ...current.current, ...patch };
    const url = routeUrl(next);
    current.current = next;
    setRoute(next);
    if (url === from) return;

    currentPath.current = url;
    pendingPath.current = url;
    if (replace) {
      router.replace(url);
    } else {
      history.current.push(from);
      router.push(url);
    }
  }

  return {
    ...route,
    ready,
    entered,
    loginRequested,
    setLoginRequested,
    navigate,
    back: (fallback: Tab = "fretes") => {
      const previousPath = history.current.pop();
      if (previousPath) {
        pendingPath.current = previousPath;
        router.back();
      } else {
        navigate({
          tab: fallback,
          selected: null,
          chatId: "",
          providerId: null,
          providerConversationId: null,
        });
      }
    },
    openProvider: (providerId: string, providerConversationId?: string) =>
      navigate({
        providerId,
        providerConversationId: providerConversationId || null,
        tab: "prestador",
        selected: null,
        chatId: "",
      }),
    setRole: (role: Role, replace = false) =>
      navigate({
        role,
        tab: "inicio",
        selected: null,
        chatId: "",
        providerId: null,
        providerConversationId: null,
      }, replace),
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
        clearRequestDrafts(sessionStorage);
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
