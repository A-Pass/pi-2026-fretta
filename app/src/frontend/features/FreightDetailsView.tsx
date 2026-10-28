import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
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
  f: Freight;
  role: Role;
  store: Store;
  proposals: Proposal[];
  accepted: Proposal | undefined;
  subscription: boolean;
  setModal: (s: string) => void;
  setSelected: (s: string | null) => void;
  setChatId: (s: string) => void;
  setTab: (s: string) => void;
  save: (s: Store) => Promise<boolean>;
  setError: (s: string) => void;
  schedule: (f: Freight) => string | undefined;
};
export function FreightDetailsView({
  f,
  role,
  store,
  proposals,
  accepted,
  subscription,
  setModal,
  setSelected,
  setChatId,
  setTab,
  save,
  setError,
  schedule,
}: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const isOpportunity = role === "motorista" && f.status === "ABERTO";

  return (
    <>
      <button className="back" onClick={() => setSelected(null)}>
        <ArrowLeft size={18} /> Voltar aos fretes
      </button>
      <div className="section-head">
        <div>
          <span className="eyebrow">DETALHES DO FRETE</span>
          <h1>{f.title}</h1>
        </div>
        <StatusBadge status={f.status} />
      </div>
      <div
        className={
          isOpportunity ? "detail-grid opportunity-detail" : "detail-grid"
        }
      >
        <section className="panel">
          <h2>O que vamos transportar?</h2>
          <p>{f.description}</p>
          <div className="gallery">
            {f.photos.map((s, i) => (
              <img src={s} alt={`Foto dos itens ${i + 1}`} key={i} />
            ))}
          </div>
          <div className="route">
            <p>
              <MapPin />{" "}
              <span>
                <small>RETIRADA · REGIÃO APROXIMADA</small>
                {f.origin}
              </span>
            </p>
            <p>
              <MapPin />
              <span>
                <small>ENTREGA · REGIÃO APROXIMADA</small>
                {f.destination}
              </span>
            </p>
          </div>
          <p className="muted">
            Endereços completos serão disponibilizados pelo servidor apenas aos
            participantes autorizados após a contratação. Esta demonstração usa
            regiões fictícias.
          </p>
          <div className="facts">
            <span>🚚 {f.vehicle}</span>
            <span>◷ {schedule(f)}</span>
          </div>
          {accepted && (
            <div className="notice">
              <Check size={20} />
              <span>
                Combinado com {accepted.driver}
                <br />
                <b>{money(accepted.priceCents)}</b> ·{" "}
                {new Date(accepted.availableAt).toLocaleString("pt-BR")}
              </span>
            </div>
          )}
          {role === "cliente" && f.status === "ABERTO" && (
            <button className="danger" onClick={() => setCancelOpen(true)}>
              Cancelar solicitação
            </button>
          )}
          {role === "motorista" && f.status === "AGENDADO" && (
            <button
              className="primary"
              onClick={() =>
                save({
                  ...store,
                  freights: store.freights.map((x) =>
                    x.id === f.id ? { ...x, status: "EM_TRANSPORTE" } : x,
                  ),
                })
              }
            >
              Simular início do transporte
            </button>
          )}
          {role === "cliente" && f.status === "EM_TRANSPORTE" && (
            <button
              className="primary"
              onClick={() =>
                save({
                  ...store,
                  freights: store.freights.map((x) =>
                    x.id === f.id ? { ...x, status: "CONCLUIDO" } : x,
                  ),
                })
              }
            >
              Confirmar conclusão na demonstração
            </button>
          )}
          {f.status === "CONCLUIDO" && (
            <div>
              <h3>
                {f.reviews[role]
                  ? "Sua avaliação foi registrada"
                  : "Como foi sua experiência?"}
              </h3>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  aria-label={`Avaliar com ${n} estrelas`}
                  onClick={() =>
                    save({
                      ...store,
                      freights: store.freights.map((x) =>
                        x.id === f.id
                          ? {
                              ...x,
                              reviews: { ...x.reviews, [role]: n },
                            }
                          : x,
                      ),
                    })
                  }
                >
                  <Star
                    fill={(f.reviews[role] || 0) >= n ? "#f5a623" : "none"}
                    color="#f5a623"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
        {!isOpportunity && (
          <section className="panel">
            <h2>
              {role === "cliente"
                ? `Propostas recebidas (${proposals.length})`
                : "Sua proposta"}
            </h2>
            {proposals.length ? (
              proposals.map((p) => (
                <article className="proposal" key={p.id}>
                  <div className="section-head">
                    <b>{p.driver}</b>
                    <span>
                      <Star size={14} /> {p.rating || "Novo"}
                    </span>
                  </div>
                  <small>{p.vehicle}</small>
                  <h2>{money(p.priceCents)}</h2>
                  <p>{new Date(p.availableAt).toLocaleString("pt-BR")}</p>
                  <p>{p.message}</p>
                  <span className="badge">
                    {p.status === "ACEITA"
                      ? "Escolhida"
                      : p.status === "ENCERRADA"
                        ? "Encerrada"
                        : "Em análise"}
                  </span>
                  <div className="actions">
                    {p.status === "PENDENTE" &&
                      f.status === "ABERTO" &&
                      role === "cliente" && (
                        <button
                          className="primary"
                          onClick={async () => {
                            if (
                              confirm(
                                `Confirmar ${p.driver} por ${money(p.priceCents)}?`,
                              )
                            ) {
                              try {
                                await save(acceptProposal(store, p.id));
                              } catch (e) {
                                setError((e as Error).message);
                              }
                            }
                          }}
                        >
                          Aceitar proposta
                        </button>
                      )}
                    {p.status !== "ENCERRADA" && (
                      <button
                        className="secondary"
                        onClick={() => {
                          setChatId(p.id);
                          setSelected(null);
                          setTab("chat");
                        }}
                      >
                        Conversar
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="empty">
                As propostas aparecerão aqui. Você será avisado quando chegar
                uma novidade.
              </p>
            )}
          </section>
        )}
      </div>
      {isOpportunity && (
        <div className="opportunity-action">
          <button
            className="primary"
            disabled={!subscription}
            title={
              !subscription
                ? "Ative sua assinatura no perfil para enviar propostas"
                : undefined
            }
            onClick={() => setModal("proposta")}
          >
            Enviar proposta <ArrowRight size={18} />
          </button>
        </div>
      )}
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancelar esta solicitação?"
        description="Seu frete será cancelado e as propostas recebidas serão encerradas. Você pode manter a solicitação se ainda quiser receber propostas."
        confirmLabel="Sim, cancelar solicitação"
        onConfirm={async () => {
          const ok = await save({
            ...store,
            freights: store.freights.map((x) =>
              x.id === f.id ? { ...x, status: "CANCELADO" } : x,
            ),
            proposals: store.proposals.map((x) =>
              x.freightId === f.id ? { ...x, status: "ENCERRADA" } : x,
            ),
          });
          if (ok) setCancelOpen(false);
          return ok;
        }}
      />
    </>
  );
}
