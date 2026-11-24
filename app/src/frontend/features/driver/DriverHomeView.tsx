import { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Package,
  Search,
  Navigation,
  Check,
} from "lucide-react";
import type { Store, OperatingArea, MapPoint } from "@/contracts";
import { LocationPicker } from "../../components/LocationPicker";
import { EmptyState } from "../../components/EmptyState";
import { createBackendClient, type FreightFeedItem } from "../../api/backend";
import { sortFeedItemsByPickupDistance } from "./rules";
type Props = {
  store: Store;
  name: string;
  saveOperatingArea: (area: OperatingArea) => Promise<boolean>;
  schedule: (f: FreightFeedItem) => string | undefined;
  onSelect: (freight: FreightFeedItem) => void;
};
export function DriverHomeView({
  store,
  name,
  saveOperatingArea,
  schedule,
  onSelect,
}: Props) {
  const area = store.operatingArea;
  const radiusKm = area?.radiusKm ?? 20;
  const [editing, setEditing] = useState(false),
    [point, setPoint] = useState<MapPoint | null>(area?.center || null),
    [radius, setRadius] = useState(radiusKm),
    [label, setLabel] = useState(area?.label || ""),
    [query, setQuery] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [visible, setVisible] = useState(12);
  const [feedScope, setFeedScope] = useState<"area" | "all">("area");
  const [matches, setMatches] = useState<
    { freight: FreightFeedItem; distance: number | null }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  useEffect(
    () => setVisible(12),
    [query, feedScope, area?.center.lat, area?.center.lng, radiusKm],
  );
  useEffect(() => {
    if (!area) return;
    const operatingArea = area;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setSearching(true);
      setSearchError("");
      const backend = createBackendClient();
      async function loadFreights() {
        const items: FreightFeedItem[] = [];
        let cursor: string | undefined;
        do {
          const page = await backend.freights(cursor, controller.signal, {
            role: "motorista",
            scope: feedScope === "all" ? "all" : "area",
            q: query.trim() || undefined,
            lat: operatingArea.center.lat,
            lng: operatingArea.center.lng,
            radiusKm:
              feedScope === "area" ? operatingArea.radiusKm : undefined,
            limit: 100,
          });
          items.push(...page.items);
          cursor = page.nextCursor ?? undefined;
        } while (cursor && !controller.signal.aborted);
        return items;
      }
      loadFreights()
        .then((items) => {
          if (controller.signal.aborted) return;
          setMatches(sortFeedItemsByPickupDistance(items));
        })
        .catch((failure) => {
          if (!controller.signal.aborted) {
            setSearchError(
              failure instanceof Error
                ? failure.message
                : "Não foi possível buscar os fretes.",
            );
            setMatches([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    query,
    feedScope,
    area?.center.lat,
    area?.center.lng,
    radiusKm,
  ]);
  function edit() {
    setPoint(area ? { ...area.center } : null);
    setRadius(radiusKm);
    setLabel(area?.label || "");
    setError("");
    setEditing(true);
  }
  return (
    <>
      <span className="eyebrow">SEU TRABALHO, NOVOS CAMINHOS</span>
      <h1>Olá, {name.split(" ")[0]} 👋</h1>
      <p className="muted">
        Escolha onde quer buscar seu próximo frete, inclusive na viagem de
        volta.
      </p>
      <section className="panel operating-area">
        <div className="section-head">
          <div>
            <span className="type-icon">
              <Navigation />
            </span>
            <h2>Área de operação</h2>
            <p className="muted">
              {area
                ? `${area.label} · retiradas em até ${area.radiusKm} km`
                : "Nenhuma área de operação definida"}
            </p>
          </div>
          {!editing && (
            <button className="primary" onClick={edit}>
              {area ? "Alterar área de operação" : "Definir área de operação"}
            </button>
          )}
        </div>
        {!editing ? (
          area && (
            <p className="operating-tip">
              <MapPin size={18} /> Chegou a outra cidade? Mude sua base para
              encontrar uma carga de retorno. O destino da entrega pode ficar
              fora do raio.
            </p>
          )
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!point) {
                setError("Confirme o ponto da sua base no mapa.");
                return;
              }
              setBusy(true);
              try {
                if (
                  await saveOperatingArea({
                    center: point,
                    radiusKm: radius,
                    label: label.trim() || "Base selecionada no mapa",
                  })
                )
                  setEditing(false);
                else
                  setError(
                    "Não foi possível salvar sua área. Tente novamente.",
                  );
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset className="plain-fieldset" disabled={busy}>
              <LocationPicker
                value={point}
                onChange={(p) => {
                  setPoint(p);
                  if (!p) setLabel("");
                }}
                radiusKm={radius}
              />
              <div className="form-grid operation-controls">
                <label>
                  Nome da base{" "}
                  <span className="muted">(para sua identificação)</span>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    maxLength={80}
                    placeholder="Ex.: Centro de outra cidade"
                  />
                </label>
                <label className="operation-radius" htmlFor="operation-radius">
                  <span className="radius-heading">
                    Raio para buscar retiradas{" "}
                    <output htmlFor="operation-radius">{radius} km</output>
                  </span>
                  <input
                    id="operation-radius"
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={radius}
                    aria-label="Raio para buscar retiradas"
                    aria-valuetext={`${radius} quilômetros`}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, var(--orange) 0%, var(--orange) ${((radius - 5) / 195) * 100}%, var(--line) ${((radius - 5) / 195) * 100}%, var(--line) 100%)`,
                    }}
                  />
                  <span className="radius-limits" aria-hidden="true">
                    <span>5 km</span>
                    <span>200 km</span>
                  </span>
                </label>
              </div>
              <p className="muted operation-note">
                A busca usa distância em linha reta da sua base até a retirada.
                O GPS é consultado apenas quando você toca em “Usar minha
                localização”.
              </p>
              {error && (
                <p className="alert" role="alert">
                  {error}
                </p>
              )}
              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditing(false)}
                >
                  Descartar alterações
                </button>
                <button className="primary" disabled={!point || busy}>
                  {busy ? (
                    "Aplicando…"
                  ) : (
                    <>
                      <Check size={17} /> Aplicar área de operação
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </section>
      <div className="section-head opportunities-heading">
        <div>
          <h2>
            {feedScope === "area"
              ? "Solicitações na sua área"
              : "Todos os fretes disponíveis"}
          </h2>
          <p className="muted">
            {!area
              ? "Defina uma base para ordenar os fretes por proximidade."
              : feedScope === "area"
                ? `Retiradas dentro do raio de ${area.radiusKm} km aplicado acima.`
                : "Ordenados da retirada mais próxima à mais distante da sua base."}
          </p>
        </div>
        <span className="badge">
          {matches.length}{" "}
          {matches.length === 1 ? "oportunidade" : "oportunidades"}
        </span>
      </div>
      <label className="driver-feed-filter">
        Mostrar
        <select
          aria-label="Filtrar fretes por área de operação"
          value={feedScope}
          disabled={!area}
          onChange={(event) =>
            setFeedScope(event.target.value === "all" ? "all" : "area")
          }
        >
          <option value="area">
            Apenas dentro do raio de operação ({radiusKm} km)
          </option>
          <option value="all">Todos os fretes disponíveis</option>
        </select>
      </label>
      <label className="search driver-search">
        <Search size={18} />
        <input
          aria-label="Buscar oportunidades na área"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por título, região ou destino"
        />
      </label>
      <div className="cards">
        {searching && (
          <p className="muted" role="status">
            Buscando fretes disponíveis…
          </p>
        )}
        {searchError && (
          <p className="alert" role="alert">
            {searchError}
          </p>
        )}
        {matches.slice(0, visible).map(({ freight: f, distance }) => (
          <article className="freight-card" key={f.id}>
            <div className="section-head">
              <span className="type-icon">
                <Package />
              </span>
              <span className="badge">
                {distance == null
                  ? "Distância indisponível"
                  : `Retirada a aproximadamente ${Math.round(distance)} km`}
              </span>
            </div>
            <h3>{f.title}</h3>
            <p className="description">{f.description}</p>
            <div className="route">
              <p>
                <MapPin size={16} />
                <span>
                  <small>RETIRADA</small>
                  {f.origin}
                </span>
              </p>
              <p>
                <MapPin size={16} />
                <span>
                  <small>ENTREGA</small>
                  {f.destination}
                </span>
              </p>
            </div>
            <div className="facts">
              <span>🚚 {f.vehicle}</span>
              <span>◷ {schedule(f)}</span>
            </div>
            <button className="card-link" onClick={() => onSelect(f)}>
              Ver oportunidade <ArrowRight size={18} />
            </button>
          </article>
        ))}
        {!matches.length && !searching && (
          <EmptyState
            title={
              !area
                ? "Defina sua área de operação"
                : feedScope === "area"
                  ? "Nenhuma retirada nesta área por enquanto"
                  : "Nenhum frete disponível por enquanto"
            }
          >
            {!area
              ? "Configure uma base para ordenar as oportunidades por distância."
              : feedScope === "area"
                ? "Aumente o raio ou altere sua base para buscar oportunidades em outra região."
                : "Novas oportunidades aparecerão aqui assim que forem publicadas."}
          </EmptyState>
        )}
      </div>
      {visible < matches.length && (
        <div className="load-more">
          <button
            className="secondary"
            onClick={() => setVisible(visible + 12)}
          >
            Mostrar mais oportunidades
          </button>
        </div>
      )}
    </>
  );
}
