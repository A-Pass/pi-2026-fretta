import type { FrettaApi, Store } from "@/contracts";
import { withDemoRequests } from "../mocks/demoRequests";
import { withNotifications } from "../features/notifications/rules";
import { seed } from "../mocks/seed";
const KEY = "fretta-demo-v1";
export const api: FrettaApi = {
  async load() {
    if (process.env.NEXT_PUBLIC_API_MODE === "real") {
      const r = await fetch("/api/v1/state");
      if (!r.ok) throw new Error("Servidor ainda não implementado.");
      return r.json();
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = withDemoRequests(structuredClone(seed));
      return withNotifications({ ...s, proposals: [], messages: [] }, s);
    }
    try {
      const s = JSON.parse(raw);
      if (
        !Array.isArray(s.freights) ||
        !Array.isArray(s.proposals) ||
        !Array.isArray(s.messages)
      )
        throw Error();
      const normalized = withDemoRequests(s as Store);
      return s.notifications
        ? normalized
        : withNotifications(
            { ...normalized, proposals: [], messages: [] },
            normalized,
          );
    } catch {
      throw new Error(
        "Dados da demonstração inválidos. Use Restaurar demonstração.",
      );
    }
  },
  async save(store) {
    if (process.env.NEXT_PUBLIC_API_MODE === "real")
      throw new Error("Persistência real ainda não implementada.");
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      throw new Error(
        "Não foi possível salvar neste navegador. Verifique o espaço disponível ou reduza as fotos e tente novamente.",
      );
    }
  },
};
export function resetDemo() {
  localStorage.removeItem(KEY);
  location.reload();
}
