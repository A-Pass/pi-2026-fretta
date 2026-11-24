import type { FrettaApi, Store } from "@/contracts";
import { createHttpTransport } from "./http";

export const api: FrettaApi = {
  async load() {
    return createHttpTransport().request<Store>("/state");
  },
  async save(store, accountSetupRole) {
    return createHttpTransport().request<Store>("/state", {
      method: "PUT",
      body: {
        ...store,
        ...(accountSetupRole ? { accountSetupRole } : {}),
      },
    });
  },
};
