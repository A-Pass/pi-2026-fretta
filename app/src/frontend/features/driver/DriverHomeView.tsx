import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Package,
  Search,
  Navigation,
  Check,
} from "lucide-react";
import type { Freight, Store, OperatingArea, MapPoint } from "@/contracts";
import { LocationPicker } from "../../components/LocationPicker";
import { EmptyState } from "../../components/EmptyState";
import { defaultArea, opportunities } from "./rules";
type Props = {
  store: Store;
  name: string;
  subscription: boolean;
  save: (s: Store) => Promise<boolean>;
  onSelect: (id: string) => void;
  onProfile: () => void;
  schedule: (f: Freight) => string | undefined;
};
export function DriverHomeView({
  store,
  name,
  subscription,
  save,
  onSelect,
  onProfile,
  schedule,
}: Props) {
  const area = store.operatingArea || defaultArea;
  const [editing, setEditing] = useState(false),
    [point, setPoint] = useState<MapPoint | null>(area.center),
    [radius, setRadius] = useState(area.radiusKm),
    [label, setLabel] = useState(area.label),
    [query, setQuery] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const matches = opportunities(store, area).filter(({ freight: f }) =>
    `${f.title} ${f.origin} ${f.destination}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  function edit() {
    setPoint({ ...area.center });
    setRadius(area.radiusKm);
    setLabel(area.label);
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
              {area.label} · retiradas em até{" "}
              <strong>{area.radiusKm} km</strong>
            </p>
          </div>
          {!editing && (
            <button className="primary" onClick={edit}>
              Alterar área de operação
            </button>
          )}
        </div>
        {!editing ? (
          <p className="operating-tip">
            <MapPin size={18} /> Chegou a outra cidade? Mude sua base para
            encontrar uma carga de retorno. O destino da entrega pode ficar fora
            do raio.
          </p>
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
                  await save({
                    ...store,
                    operatingArea: {
                      center: point,
                      radiusKm: radius,
                      label: label.trim() || "Base selecionada no mapa",
                    },
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
          <h2>Solicitações na sua área</h2>
          <p className="muted">
            Retiradas dentro do raio de {area.radiusKm} km aplicado acima.
          </p>
        </div>
        {subscription && (
          <span className="badge">
            {matches.length}{" "}
            {matches.length === 1 ? "oportunidade" : "oportunidades"}
          </span>
        )}
      </div>
      <label className="search driver-search">
        <Search size={18} />
        <input
          aria-label="Buscar oportunidades na área"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por título, região ou destino"
        />
      </label>
      {!subscription ? (
        <section className="panel empty">
          <h2>Assinatura vencida na demonstração</h2>
          <p>Ative a simulação no perfil para consultar novas oportunidades.</p>
          <button className="primary" onClick={onProfile}>
            Ver assinatura
          </button>
        </section>
      ) : (
        <div className="cards">
          {matches.map(({ freight: f, distance }) => (
            <article className="freight-card" key={f.id}>
              <div className="section-head">
                <span className="type-icon">
                  <Package />
                </span>
                <span className="badge">
                  Retirada a aproximadamente {Math.round(distance)} km
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
              <button className="card-link" onClick={() => onSelect(f.id)}>
                Ver oportunidade <ArrowRight size={18} />
              </button>
            </article>
          ))}
          {!matches.length && (
            <EmptyState title="Nenhuma retirada nesta área por enquanto">
              Aumente o raio ou altere sua base para buscar oportunidades em
              outra região.
              {!query && (
                <>
                  <br />
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      await save({
                        ...store,
                        operatingArea: {
                          ...defaultArea,
                          center: { ...defaultArea.center },
                        },
                      });
                      setBusy(false);
                    }}
                  >
                    Ver exemplos em Eunápolis
                  </button>
                </>
              )}
            </EmptyState>
          )}
        </div>
      )}
    </>
  );
}
