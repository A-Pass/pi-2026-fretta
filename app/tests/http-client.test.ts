import { test } from "node:test";
import assert from "node:assert/strict";
import { ApiRequestError, createHttpTransport } from "../src/frontend/api/http";
import { createBackendClient } from "../src/frontend/api/backend";
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
test("cliente HTTP envia cookie de mesma origem, preserva cursores e não repete mutações", async () => {
  const calls: { url: string; options?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return json({ items: [], nextCursor: null });
  };
  await createHttpTransport({ fetcher }).page("/freights", "a&b");
  assert.equal(calls[0].url, "/api/v1/freights?cursor=a%26b");
  assert.equal(calls[0].options?.credentials, "same-origin");
  assert.equal(calls[0].options?.cache, "no-store");
  let attempts = 0;
  const api = createBackendClient({
    fetcher: async () => {
      attempts++;
      return json({ code: "STALE", message: "Dados mudaram" }, 409);
    },
  });
  await assert.rejects(
    () => api.accept("p/1", "offer2"),
    (e: unknown) => e instanceof ApiRequestError && e.status === 409,
  );
  assert.equal(attempts, 1);
});
test("busca de fretes envia texto, área e raio ao feed", async () => {
  let requestUrl = "";
  const api = createBackendClient({
    fetcher: async (url) => {
      requestUrl = String(url);
      return json({ items: [], nextCursor: null });
    },
  });
  await api.freights(undefined, undefined, {
    q: "geladeira",
    lat: -16.377,
    lng: -39.58,
    radiusKm: 20,
    limit: 100,
  });
  const url = new URL(requestUrl, "http://localhost");
  assert.equal(url.pathname, "/api/v1/freights");
  assert.equal(url.searchParams.get("q"), "geladeira");
  assert.equal(url.searchParams.get("lat"), "-16.377");
  assert.equal(url.searchParams.get("lng"), "-39.58");
  assert.equal(url.searchParams.get("radiusKm"), "20");
  assert.equal(url.searchParams.get("limit"), "100");
});
test("aceite envia apenas oferta esperada, IDs escapados e nenhum valor informado pelo cliente", async () => {
  let payload: unknown;
  let requestUrl = "";
  const api = createBackendClient({
    fetcher: async (url, options) => {
      requestUrl = String(url);
      payload = JSON.parse(String(options?.body));
      return json({});
    },
  });
  await api.accept("p/1", "offer2");
  assert.equal(requestUrl, "/api/v1/proposals/p%2F1/accept");
  assert.deepEqual(payload, { offerId: "offer2" });
});
test("falhas de sessão, formato e conexão são reconhecidas sem fallback para demonstração", async () => {
  await assert.rejects(
    () =>
      createHttpTransport({ fetcher: async () => json({}, 401) }).request(
        "/me",
      ),
    (e: unknown) =>
      e instanceof ApiRequestError &&
      e.status === 401 &&
      e.message.includes("sessão"),
  );
  await assert.rejects(
    () =>
      createHttpTransport({ fetcher: async () => json({ items: "bad" }) }).page(
        "/freights",
      ),
    (e: unknown) =>
      e instanceof ApiRequestError && e.code === "INVALID_RESPONSE",
  );
  await assert.rejects(
    () =>
      createHttpTransport({
        fetcher: async () => {
          throw new TypeError("network");
        },
      }).request("/me"),
    (e: unknown) => e instanceof ApiRequestError && e.code === "NETWORK",
  );
  await assert.rejects(
    () =>
      createHttpTransport({
        fetcher: async () => new Response("<html>erro</html>"),
      }).request("/me"),
    (e: unknown) =>
      e instanceof ApiRequestError && e.code === "INVALID_RESPONSE",
  );
});
test("timeout e cancelamento liberam a operação e têm mensagens distintas", async () => {
  const fetcher: typeof fetch = async (_url, options) =>
    new Promise((_resolve, reject) => {
      if (options?.signal?.aborted) reject(new Error("aborted"));
      else
        options?.signal?.addEventListener(
          "abort",
          () => reject(new Error("aborted")),
          { once: true },
        );
    });
  await assert.rejects(
    () => createHttpTransport({ fetcher, timeoutMs: 5 }).request("/me"),
    (e: unknown) => e instanceof ApiRequestError && e.code === "TIMEOUT",
  );
  const abort = new AbortController();
  abort.abort();
  await assert.rejects(
    () =>
      createHttpTransport({ fetcher }).request("/me", { signal: abort.signal }),
    (e: unknown) => e instanceof ApiRequestError && e.code === "ABORTED",
  );
  assert.throws(() =>
    createHttpTransport({ baseUrl: "https://other.example" }),
  );
});
