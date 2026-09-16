// app/api/geocode/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "lat e lon são obrigatórios" }), { status: 400 });
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        "User-Agent": "MeuApp/1.0 (seu-email@dominio.com)",
      },
    });

    if (!response.ok) throw new Error("Falha na requisição ao Nominatim");

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
