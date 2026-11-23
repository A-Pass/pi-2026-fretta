export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public retryable = false,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
const messages: Record<number, string> = {
  401: "Sua sessão expirou. Entre novamente.",
  403: "Você não tem permissão para esta ação.",
  404: "Este registro não está mais disponível.",
  409: "As informações mudaram. Atualize a tela antes de confirmar novamente.",
  413: "O arquivo é maior que o limite permitido.",
  422: "Confira os dados informados e tente novamente.",
  429: "Muitas tentativas em pouco tempo. Aguarde e tente novamente.",
  501: "Esta funcionalidade ainda não foi disponibilizada pelo servidor.",
};
export function createHttpTransport({
  baseUrl = "/api/v1",
  fetcher = fetch,
  timeoutMs = 20000,
}: { baseUrl?: string; fetcher?: typeof fetch; timeoutMs?: number } = {}) {
  if (!baseUrl.startsWith("/") || baseUrl.startsWith("//"))
    throw new Error("Use uma API no mesmo domínio da aplicação.");
  async function request<T>(
    path: string,
    {
      method = "GET",
      body,
      signal,
    }: { method?: string; body?: unknown; signal?: AbortSignal } = {},
  ): Promise<T> {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener("abort", abort, { once: true });
    try {
      const multipart =
        typeof FormData !== "undefined" && body instanceof FormData;
      const response = await fetcher(`${baseUrl}${path}`, {
        method,
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
        headers:
          body !== undefined && !multipart
            ? { "Content-Type": "application/json", Accept: "application/json" }
            : { Accept: "application/json" },
        body:
          body === undefined
            ? undefined
            : multipart
              ? body
              : JSON.stringify(body),
      });
      if (response.status === 204) return undefined as T;
      let data: unknown;
      try {
        data = await response.json();
      } catch {
        if (response.ok)
          throw new ApiRequestError(
            "A resposta do servidor não pôde ser lida. Tente novamente.",
            response.status,
            "INVALID_RESPONSE",
          );
      }
      if (!response.ok) {
        const error =
          data && typeof data === "object"
            ? (data as { code?: unknown; message?: unknown })
            : {};
        const message =
          (response.status === 422 ||
            (path.startsWith("/company/") && response.status === 409)) &&
          typeof error.message === "string"
            ? error.message.slice(0, 500)
            : messages[response.status] ||
              "O serviço está indisponível. Tente novamente em instantes.";
        throw new ApiRequestError(
          message,
          response.status,
          typeof error.code === "string"
            ? error.code
            : `HTTP_${response.status}`,
          response.status >= 500 && response.status !== 501,
        );
      }
      return data as T;
    } catch (error) {
      if (error instanceof ApiRequestError) throw error;
      if (timedOut)
        throw new ApiRequestError(
          "O servidor demorou para responder. Tente novamente.",
          0,
          "TIMEOUT",
          true,
        );
      if (signal?.aborted)
        throw new ApiRequestError("Operação interrompida.", 0, "ABORTED");
      throw new ApiRequestError(
        "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
        0,
        "NETWORK",
        true,
      );
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }
  async function page<T, Metadata extends object = {}>(
    path: string,
    cursor?: string,
    signal?: AbortSignal,
    filters?: Record<string, string | number | undefined>,
  ) {
    const query = new URLSearchParams();
    if (cursor) query.set("cursor", cursor);
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) query.set(key, String(value));
      }
    }
    const result = await request<
      { items: T[]; nextCursor: string | null } & Metadata
    >(
      `${path}${query.size ? `?${query}` : ""}`,
      { signal },
    );
    if (
      !result ||
      !Array.isArray(result.items) ||
      (result.nextCursor !== null && typeof result.nextCursor !== "string")
    )
      throw new ApiRequestError(
        "A lista recebida do servidor tem um formato inválido.",
        200,
        "INVALID_RESPONSE",
      );
    return result;
  }
  return { request, page };
}
