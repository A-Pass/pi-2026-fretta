import { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import type { Store, Freight } from "@/contracts";
import { ownProposal } from "./rules";
import { money } from "../freights/rules";
import { StatusBadge } from "../../components/StatusBadge";
import { EmptyState } from "../../components/EmptyState";
export function DriverServicesView({
  store,
  name,
  onSelect,
  onExplore,
  schedule,
}: {
  store: Store;
  name: string;
  onSelect: (id: string) => void;
  onExplore: () => void;
  schedule: (f: Freight) => string | undefined;
}) {
  const [tab, setTab] = useState("propostas");
  const mine = store.proposals.filter((p) => ownProposal(p, name));
  const list = mine.flatMap((proposal) => {
    const freight = store.freights.find((f) => f.id === proposal.freightId);
    if (!freight) return [];
    const chosen =
      freight.acceptedProposalId === proposal.id &&
      proposal.status === "ACEITA";
    const active =
      chosen && ["AGENDADO", "EM_TRANSPORTE"].includes(freight.status);
    const history =
      freight.status === "CONCLUIDO" ||
      freight.status === "CANCELADO" ||
      proposal.status === "ENCERRADA";
    if (
      tab === "propostas" &&
      (proposal.status !== "PENDENTE" || freight.status !== "ABERTO")
    )
      return [];
    if (tab === "andamento" && !active) return [];
    if (tab === "historico" && !history) return [];
    return [{ freight, proposal }];
  });
  return (
    <>
      <span className="eyebrow">ACOMPANHE SEU TRABALHO</span>
      <h1>Meus serviços</h1>
      <p className="muted">
        Suas propostas e seus fretes contratados, independentemente da área de
        operação atual.
      </p>
      <div
        className="driver-service-tabs"
        role="group"
        aria-label="Filtrar meus serviços"
      >
        {[
          ["propostas", "Minhas propostas"],
          ["andamento", "Agendados e em transporte"],
          ["historico", "Histórico"],
        ].map(([id, label]) => (
          <button
            className={id === tab ? "selected" : ""}
            aria-pressed={id === tab}
            key={id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="cards">
        {list.map(({ freight: f, proposal: p }) => (
          <article className="freight-card" key={p.id}>
            <div className="section-head">
              <StatusBadge status={f.status} />
              <span className="badge">
                {p.status === "PENDENTE"
                  ? "Proposta em análise"
                  : p.status === "ACEITA"
                    ? "Sua proposta foi aceita"
                    : "Proposta encerrada"}
              </span>
            </div>
            <h3>{f.title}</h3>
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
              <span>
                Sua proposta: <b>{money(p.priceCents)}</b>
              </span>
              <span>
                ◷{" "}
                {p.availableAt
                  ? new Date(p.availableAt).toLocaleString("pt-BR")
                  : schedule(f)}
              </span>
            </div>
            <button className="card-link" onClick={() => onSelect(f.id)}>
              Acompanhar frete <ArrowRight size={18} />
            </button>
          </article>
        ))}
        {!list.length && (
          <EmptyState
            title={
              tab === "propostas"
                ? "Você ainda não tem propostas em análise"
                : tab === "andamento"
                  ? "Nenhum frete agendado no momento"
                  : "Seu histórico aparecerá aqui"
            }
          >
            Explore as solicitações na sua área para encontrar seu próximo
            serviço.
            <br />
            <button className="primary" onClick={onExplore}>
              Buscar oportunidades
            </button>
          </EmptyState>
        )}
      </div>
    </>
  );
}
