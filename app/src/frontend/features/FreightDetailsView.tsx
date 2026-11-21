import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Check,
  Star,
  Navigation,
} from "lucide-react";
import type { Role, Store, Freight, Proposal, Address } from "@/contracts";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PhotoGallery } from "../components/PhotoGallery";
import { ReviewForm } from "../components/ReviewForm";
import { acceptProposal, money } from "./freights/rules";
import {
  declineOffer,
  proposalOffers,
  proposalStatusLabel,
} from "./freights/negotiation";
import { providerId, providerName } from "./providers/rules";
import { ownProposal } from "./driver/rules";
import { StatusBadge } from "../components/StatusBadge";
import { dateTime } from "../lib/dates";

type Props = {
  f: Freight;
  role: Role;
  name: string;
  store: Store;
  proposals: Proposal[];
  accepted: Proposal | undefined;
  subscription: boolean;
  canPropose: boolean;
  onRegistration: () => void;
  setModal: (s: string) => void;
  setSelected: (s: string | null) => void;
  onChat: (id: string) => void;
  onProvider?: (id: string, conversationId?: string) => void;
  save: (s: Store) => Promise<boolean>;
  schedule: (f: Freight) => string | undefined;
};
function FullAddress({ title, address }: { title: string; address?: Address }) {
  return (
    <article>
      <h3>{title}</h3>
      {address ? (
        <>
          <p>
            {address.street}, {address.number}
            {address.complement ? ` · ${address.complement}` : ""}
          </p>
          <p>
            {address.neighborhood} · {address.city} / {address.state}
          </p>
          {address.point && (
            <a
              className="card-link"
              href={`https://www.openstreetmap.org/?mlat=${address.point.lat}&mlon=${address.point.lng}#map=17/${address.point.lat}/${address.point.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={16} /> Ver no mapa{" "}
              <span className="sr-only">(abre em outra aba)</span>
            </a>
          )}
        </>
      ) : (
        <p className="muted">Endereço completo ainda não foi carregado.</p>
      )}
    </article>
  );
}
export function FreightDetailsView({
  f,
  role,
  name,
  store,
  proposals,
  accepted,
  subscription,
  canPropose,
  onRegistration,
  setModal,
  setSelected,
  onChat,
  onProvider,
  save,
  schedule,
}: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [proposalToAccept, setProposalToAccept] = useState<{
    proposal: Proposal;
    offerId: string;
  } | null>(null);
  const [proposalToDecline, setProposalToDecline] = useState<{
    proposal: Proposal;
    offerId: string;
  } | null>(null);
  const [transition, setTransition] = useState<"start" | "complete" | null>(
    null,
  );
  const isOpportunity = role === "motorista" && f.status === "ABERTO";
  const chosenDriver = accepted && ownProposal(accepted, store.profile?.id || "");
  const canSeeAgreement = accepted && (role === "cliente" || chosenDriver);
  const agreement = f.agreement || accepted;
  const snapshot = store.freightAddresses?.[f.id];
  const renderProposal = (p: Proposal) => {
    const latestOffer = proposalOffers(p).at(-1);
    const canDecide =
      p.status === "PENDENTE" &&
      latestOffer?.status === "PENDENTE" &&
      f.status === "ABERTO" &&
      role === "cliente";
    return (
      <article className="proposal" key={p.id}>
        <div className="section-head">
          <b>{providerName(p)}</b>
          <span>
            <Star size={14} /> {p.rating || "Novo"}
          </span>
        </div>
        {p.providerKind === "empresa" && (
          <p className="muted">Motorista: {p.driver}</p>
        )}
        {onProvider && (
          <button
            className="provider-link"
            onClick={() => onProvider(providerId(p), p.id)}
          >
            Ver perfil do prestador
          </button>
        )}
        <small>{p.vehicle}</small>
        <h2>{money(p.priceCents)}</h2>
        <p>{dateTime(p.availableAt)}</p>
        <p>{p.message}</p>
        <span className="badge">{proposalStatusLabel(p)}</span>
        <div className="actions">
          {canDecide && latestOffer && (
            <>
              <button
                className="primary"
                onClick={() =>
                  setProposalToAccept({ proposal: p, offerId: latestOffer.id })
                }
              >
                Aceitar proposta
              </button>
              <button
                className="secondary"
                onClick={() =>
                  setProposalToDecline({ proposal: p, offerId: latestOffer.id })
                }
              >
                Recusar proposta
              </button>
            </>
          )}
          <button className="secondary" onClick={() => onChat(p.id)}>
            Conversar
          </button>
        </div>
      </article>
    );
  };
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
          <PhotoGallery photos={f.photos} />
          <div className="route">
            <p>
              <MapPin />
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
          {!canSeeAgreement && (
            <p className="muted">
              Rua, número e localização exata são disponibilizados aos
              participantes após a contratação.
            </p>
          )}
          <div className="facts">
            <span>🚚 {f.vehicle}</span>
            <span>◷ {schedule(f)}</span>
          </div>
          {canSeeAgreement && agreement && (
            <section className="agreed-service">
              <h2>
                <Check size={20} /> Seu frete está combinado
              </h2>
              {agreement.providerName &&
                agreement.providerName !== agreement.driver && (
                  <p>
                    <b>Prestador contratado: {agreement.providerName}</b>
                  </p>
                )}
              <dl className="agreement-facts">
                <div>
                  <dt>Motorista</dt>
                  <dd>{agreement.driver}</dd>
                </div>
                <div>
                  <dt>Valor acordado</dt>
                  <dd>{money(agreement.priceCents)}</dd>
                </div>
                <div>
                  <dt>Data e horário</dt>
                  <dd>{dateTime(agreement.availableAt)}</dd>
                </div>
                <div>
                  <dt>Veículo</dt>
                  <dd>{agreement.vehicle}</dd>
                </div>
              </dl>
              <p>{agreement.message}</p>
              <div className="private-addresses">
                <FullAddress
                  title="Endereço de retirada"
                  address={snapshot?.pickup}
                />
                <FullAddress
                  title="Endereço de entrega"
                  address={snapshot?.delivery}
                />
              </div>
              <button className="secondary" onClick={() => onChat(accepted.id)}>
                Conversar sobre este frete
              </button>
            </section>
          )}
          {role === "cliente" && f.status === "ABERTO" && (
            <button className="danger" onClick={() => setCancelOpen(true)}>
              Cancelar solicitação
            </button>
          )}
          {role === "motorista" && chosenDriver && f.status === "AGENDADO" && (
            <button className="primary" onClick={() => setTransition("start")}>
              Iniciar transporte
            </button>
          )}
          {role === "cliente" && f.status === "EM_TRANSPORTE" && (
            <button
              className="primary"
              onClick={() => setTransition("complete")}
            >
              Confirmar conclusão
            </button>
          )}
          {f.status === "CONCLUIDO" && (role === "cliente" || chosenDriver) && (
            <ReviewForm freight={f} role={role} store={store} save={save} />
          )}
          {isOpportunity && proposals.length > 0 && (
            <section>
              <h2>Sua negociação</h2>
              {proposals.map(renderProposal)}
            </section>
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
              proposals.map(renderProposal)
            ) : (
              <p className="empty">
                As propostas aparecerão aqui quando os motoristas responderem.
              </p>
            )}
          </section>
        )}
      </div>
      {isOpportunity && (
        <div className="opportunity-action">
          <button
            className="primary"
            disabled={!subscription && canPropose && !proposals.length}
            onClick={() =>
              proposals.length
                ? onChat(proposals[0].id)
                : !canPropose
                  ? onRegistration()
                  : setModal("proposta")
            }
          >
            {proposals.length
              ? "Continuar negociação"
              : !canPropose
                ? "Concluir cadastro de motorista"
                : "Enviar proposta"}
            <ArrowRight size={18} />
          </button>
          {!subscription && !proposals.length && (
            <span className="muted">
              Ative sua assinatura para enviar novas propostas.
            </span>
          )}
        </div>
      )}
      <ConfirmDialog
        open={proposalToAccept !== null}
        onClose={() => setProposalToAccept(null)}
        title={`Aceitar essa proposta de ${proposalToAccept ? providerName(proposalToAccept.proposal) : ""}?`}
        description={`O frete será agendado por ${proposalToAccept ? money(proposalToAccept.proposal.priceCents) : ""} e as outras propostas serão encerradas. Motorista: ${proposalToAccept?.proposal.driver ?? ""}. Veículo: ${proposalToAccept?.proposal.vehicle ?? ""}. Disponibilidade: ${proposalToAccept ? dateTime(proposalToAccept.proposal.availableAt) : ""}.`}
        confirmLabel="Sim, aceitar proposta"
        cancelLabel="Voltar"
        pendingLabel="Aceitando…"
        destructive={false}
        onConfirm={async () => {
          if (!proposalToAccept) return false;
          const ok = await save(
            acceptProposal(
              store,
              proposalToAccept.proposal.id,
              proposalToAccept.offerId,
            ),
          );
          if (ok) setProposalToAccept(null);
          return ok;
        }}
      />
      <ConfirmDialog
        open={proposalToDecline !== null}
        onClose={() => setProposalToDecline(null)}
        title={`Recusar essa proposta de ${proposalToDecline ? providerName(proposalToDecline.proposal) : ""}?`}
        description="A proposta será recusada e o frete continuará aberto para outras propostas."
        confirmLabel="Sim, recusar proposta"
        cancelLabel="Voltar"
        destructive
        onConfirm={async () => {
          if (!proposalToDecline) return false;
          const ok = await save(
            declineOffer(
              store,
              proposalToDecline.proposal.id,
              proposalToDecline.offerId,
            ),
          );
          if (ok) setProposalToDecline(null);
          return ok;
        }}
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancelar esta solicitação?"
        description="Seu frete será cancelado e as propostas recebidas serão encerradas."
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
      <ConfirmDialog
        open={transition !== null}
        onClose={() => setTransition(null)}
        title={
          transition === "start"
            ? "Iniciar este transporte?"
            : "Confirmar que o frete foi concluído?"
        }
        description={
          transition === "start"
            ? "O cliente será informado de que o frete está em transporte."
            : "Confirme quando todos os itens tiverem sido entregues. Depois vocês poderão avaliar o serviço."
        }
        confirmLabel={
          transition === "start" ? "Iniciar transporte" : "Confirmar conclusão"
        }
        cancelLabel="Voltar"
        destructive={false}
        onConfirm={async () => {
          if (
            (transition === "start" &&
              (!chosenDriver ||
                role !== "motorista" ||
                f.status !== "AGENDADO")) ||
            (transition === "complete" &&
              (role !== "cliente" || f.status !== "EM_TRANSPORTE"))
          )
            return false;
          const ok = await save({
            ...store,
            freights: store.freights.map((x) =>
              x.id === f.id
                ? {
                    ...x,
                    status:
                      transition === "start" ? "EM_TRANSPORTE" : "CONCLUIDO",
                  }
                : x,
            ),
          });
          if (ok) setTransition(null);
          return ok;
        }}
      />
    </>
  );
}
