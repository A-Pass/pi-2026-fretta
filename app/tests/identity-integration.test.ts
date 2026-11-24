import { test } from "node:test";
import assert from "node:assert/strict";
import { createIdentityClient } from "../src/frontend/api/identity";
test("integra identidade com o envelope real de veículos e nome do servidor", async () => {
  const calls: { url: string; body: unknown }[] = [];
  const client = createIdentityClient({
    fetcher: async (input, init) => {
      calls.push({
        url: String(input),
        body: init?.body ? JSON.parse(String(init.body)) : null,
      });
      return Response.json(
        String(input).endsWith("/vehicles")
          ? {
              vehicles: [
                { id: "v1", category: "Van", model: "Teste", plate: "ABC1D23" },
              ],
            }
          : { name: "Cleiton" },
      );
    },
  });
  assert.equal((await client.vehicles())[0].id, "v1");
  await client.rename("Cleiton");
  await client.activate("motorista");
  assert.deepEqual(calls[1], { url: "/api/v1/me", body: { name: "Cleiton" } });
  assert.equal(calls[2].url, "/api/v1/me/driver");
});
