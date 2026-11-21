import { auth } from "@/server/auth/auth";
import type { AddressSuggestion } from "@/contracts/address-suggestion";

function provider() {
  try {
    const url = new URL(process.env.FRETTA_REVERSE_GEOCODER_URL ?? "");
    if (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname !== "nominatim.openstreetmap.org" &&
      !url.username &&
      !url.password
    )
      return url;
  } catch {}
  return null;
}

export function GET() {
  return Response.json(
    { available: !!provider() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const url = provider();
  if (!url)
    return Response.json(
      { message: "Consulta de endereço indisponível." },
      { status: 503 },
    );
  const origin = new URL(process.env.BETTER_AUTH_URL || request.url).origin;
  if (request.headers.get("origin") !== origin)
    return new Response(null, { status: 403 });
  if (!(await auth.api.getSession({ headers: request.headers })))
    return new Response(null, { status: 401 });
  const point = await request.json().catch(() => null);
  if (
    !point ||
    typeof point.lat !== "number" ||
    typeof point.lng !== "number" ||
    !Number.isFinite(point.lat) ||
    !Number.isFinite(point.lng) ||
    Math.abs(point.lat) > 90 ||
    Math.abs(point.lng) > 180
  )
    return Response.json(
      { message: "Confirme um ponto válido no mapa." },
      { status: 422 },
    );

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "pt-BR");
  url.searchParams.set("lat", String(point.lat));
  url.searchParams.set("lon", String(point.lng));
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error();
    const { address } = await response.json();
    const read = (keys: string[], limit: number) => {
      for (const key of keys) {
        const value = address?.[key];
        if (typeof value === "string" && value.trim())
          return value.trim().slice(0, limit);
      }
    };
    const iso = read(["ISO3166-2-lvl4", "state_code"], 12);
    const suggestion: AddressSuggestion = {
      city: read(["city", "town", "municipality", "village"], 100),
      state:
        /^(?:BR-)?(?:AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/.test(
          iso ?? "",
        )
          ? iso?.replace(/^BR-/, "")
          : undefined,
      neighborhood: read(
        ["suburb", "neighbourhood", "quarter", "city_district"],
        100,
      ),
      street: read(["road", "pedestrian", "residential"], 150),
    };
    return Response.json(suggestion, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "Preencha o endereço manualmente." },
      { status: 502 },
    );
  }
}
