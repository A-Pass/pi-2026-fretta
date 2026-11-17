import type { FrettaApi, Store } from "@/contracts";
import { withDemoRequests } from "../mocks/demoRequests";
import { withNotifications } from "../features/notifications/rules";
import { createHttpTransport } from "./http";
import { seed } from "../mocks/seed";
const KEY = "fretta-demo-v1";
export const api: FrettaApi = {
  async load() {
    if (process.env.NEXT_PUBLIC_API_MODE === "real") {
      return createHttpTransport().request<Store>("/state");
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
      const corrected: Store = s;
      const name = (value: string) => value.replace(/\bClayton\b/gi, "Cleiton");
      if (corrected.profile)
        corrected.profile.name = name(corrected.profile.name);
      if (corrected.driverRegistration)
        corrected.driverRegistration.fullName = name(
          corrected.driverRegistration.fullName,
        );
      corrected.proposals.forEach((p) => {
        p.driver = name(p.driver);
      });
      corrected.freights.forEach((f) => {
        if (f.clientName) f.clientName = name(f.clientName);
        if (f.agreement) f.agreement.driver = name(f.agreement.driver);
      });
      const normalized = withDemoRequests(corrected);
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
