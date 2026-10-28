import type { FrettaApi, Store } from "@/contracts";
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
    if (!raw) return structuredClone(seed);
    try {
      const s = JSON.parse(raw);
      if (
        !Array.isArray(s.freights) ||
        !Array.isArray(s.proposals) ||
        !Array.isArray(s.messages)
      )
        throw Error();
      return s as Store;
    } catch {
      throw new Error(
        "Dados da demonstração inválidos. Use Restaurar demonstração.",
      );
    }
  },
  async save(store) {
    if (process.env.NEXT_PUBLIC_API_MODE === "real")
      throw new Error("Persistência real ainda não implementada.");
    localStorage.setItem(KEY, JSON.stringify(store));
  },
};
export function resetDemo() {
  localStorage.removeItem(KEY);
  location.reload();
}
