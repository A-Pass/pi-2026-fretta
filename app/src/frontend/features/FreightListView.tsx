import type { FormEvent } from "react";
import {
  Truck,
  Home,
  Package,
  MessageCircle,
  User,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Plus,
  Star,
  Bell,
  Check,
  Search,
  X,
} from "lucide-react";
import type { Role, Store, Freight, Proposal } from "@/contracts";
import { resetDemo } from "../api/client";
import { acceptProposal, money } from "./freights/rules";
import { statusLabels as labels, StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";

type Props = {
  store: Store;
  role: Role;
  name: string;
  tab: string;
  list: Freight[];
  filter: string;
  query: string;
  setModal: (s: string) => void;
  nav: (s: string) => void;
  setQuery: (s: string) => void;
  setFilter: (s: string) => void;
  setSelected: (s: string | null) => void;
  subscription: boolean;
  schedule: (f: Freight) => string | undefined;
};
export function FreightListView({
  store,
  role,
  name,
  tab,
  list,
  filter,
  query,
  setModal,
  nav,
  setQuery,
  setFilter,
  setSelected,
  subscription,
  schedule,
}: Props) {
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">
            {role === "cliente"
              ? "BOM TER VOCÊ POR AQUI"
              : "NOVAS ROTAS, NOVAS OPORTUNIDADES"}
          </span>
          <h1>
            {tab === "inicio"
              ? `Olá, ${name.split(" ")[0]} 👋`
              : role === "cliente"
                ? "Meus fretes"
                : "Seus serviços"}
          </h1>
          <p className="muted">
            {role === "cliente"
              ? "Uma nova história pode começar com um pequeno frete."
              : "Conecte seu trabalho a quem precisa chegar mais longe."}
          </p>
        </div>
      </div>
      {tab === "inicio" && (
        <section className="hero">
          <div>
            <span className="eyebrow">A GENTE CONECTA. VOCÊ SEGUE.</span>
            <h2>
              {role === "cliente" ? (
                <>
                  Mudou de planos?
                  <br />A gente ajuda a levar.
                </>
              ) : (
                <>
                  O próximo frete
                  <br />
                  pode estar bem perto.
                </>
              )}
            </h2>
            <p>
              {role === "cliente"
                ? "Conte o que precisa transportar e compare propostas de motoristas."
                : "Explore as solicitações da região e envie sua proposta."}
            </p>
            {role === "motorista" && (
              <button onClick={() => nav("fretes")}>
                Explorar oportunidades <ArrowRight size={18} />
              </button>
            )}
          </div>
          <Truck className="hero-truck" strokeWidth={1} />
        </section>
      )}
      {role === "cliente" && tab === "inicio" && (
        <div className="home-request-action">
          <button className="primary" onClick={() => setModal("pedido")}>
            <Plus size={18} /> Solicitar frete
          </button>
        </div>
      )}
      <div className="stats">
        {[
          ["Solicitações", store.freights.length],
          [
            "Agendados",
            store.freights.filter((f) => f.status === "AGENDADO").length,
          ],
          [
            "Concluídos",
            store.freights.filter((f) => f.status === "CONCLUIDO").length,
          ],
        ].map(([label, n]) => (
          <div key={label}>
            <small>{label}</small>
            <b>{n}</b>
          </div>
        ))}
      </div>
      <div className="section-head">
        <h2>
          {tab === "inicio" ? "Seus próximos caminhos" : "Encontre seu frete"}
        </h2>
        <span className="muted">{list.length} solicitações</span>
      </div>
      <div className="toolbar">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Buscar fretes"
            placeholder="Busque por título ou região"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrar por status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="TODOS">Todos os status</option>
          {Object.entries(labels).map(([k, v]) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {role === "motorista" && !subscription ? (
        <section className="panel empty">
          <h2>Assinatura vencida na demonstração</h2>
          <p>Ative a simulação no perfil para acessar o feed.</p>
          <button className="primary" onClick={() => nav("perfil")}>
            Ver assinatura
          </button>
        </section>
      ) : (
        <div className="cards">
          {list.map((f) => (
            <article className="freight-card" key={f.id}>
              <div className="section-head">
                <span className="type-icon">
                  <Package />
                </span>
                <StatusBadge status={f.status} />
              </div>
              <h3>{f.title}</h3>
              <p className="description">{f.description}</p>
              <div className="route">
                <p>
                  <MapPin size={16} />
                  {f.origin}
                </p>
                <p>
                  <MapPin size={16} />
                  {f.destination}
                </p>
              </div>
              <div className="facts">
                <span>🚚 {f.vehicle}</span>
                <span>◷ {schedule(f)}</span>
              </div>
              <button className="card-link" onClick={() => setSelected(f.id)}>
                {role === "cliente"
                  ? `${store.proposals.filter((p) => p.freightId === f.id).length} propostas · Ver detalhes`
                  : "Ver oportunidade"}
                <ArrowRight size={18} />
              </button>
            </article>
          ))}
          {!list.length && (
            <EmptyState title="Nenhum frete por aqui ainda">
              Tente outra busca ou crie sua primeira solicitação.
            </EmptyState>
          )}
        </div>
      )}
    </>
  );
}
