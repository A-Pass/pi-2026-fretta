import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { Role, Store, ProposalOffer } from "@/contracts";
import { acceptProposal, money } from "./freights/rules";
import {
  proposalOffers,
  declineOffer,
  reviseOffer,
} from "./freights/negotiation";
import { ownProposal } from "./driver/rules";
import { ProposalFormDialog } from "../components/ProposalFormDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
type Props = {
  store: Store;
  role: Role;
  name: string;
  chatId: string;
  setChatId: (s: string) => void;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  save: (store: Store) => Promise<boolean>;
};
export function ChatView({
  store,
  role,
  chatId,
  setChatId,
  send,
  save,
  name,
}: Props) {
  const conversation = store.proposals.find((p) => p.id === chatId);
  const freight = store.freights.find((f) => f.id === conversation?.freightId);
  const [decision, setDecision] = useState<{
    offer: ProposalOffer;
    action: "accept" | "decline";
  } | null>(null);
  const [newOfferOpen, setNewOfferOpen] = useState(false);
  const offers = conversation ? proposalOffers(conversation) : [];
  const messages = store.messages.filter((m) => m.proposalId === chatId);
  const timeline = [
    ...offers.map((offer, index) => ({
      kind: "offer" as const,
      offer,
      at: index === 0 ? 0 : Date.parse(offer.createdAt || "") || 0,
    })),
    ...messages.map((message) => ({
      kind: "message" as const,
      message,
      at: Date.parse(message.createdAt),
    })),
  ].sort((a, b) => a.at - b.at);
  const canNegotiate = freight?.status === "ABERTO";
  const canRevise =
    role === "motorista" &&
    conversation &&
    ownProposal(conversation, name) &&
    canNegotiate;
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDecision(null);
    setNewOfferOpen(false);
  }, [chatId]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [chatId, store.messages.length, offers.length]);
  if (conversation)
    return (
      <section
        className="conversation-screen"
        aria-label={`Conversa com ${conversation.driver}`}
      >
        <header className="conversation-header">
          <button
            className="back"
            aria-label="Voltar às conversas"
            onClick={() => setChatId("")}
          >
            <ArrowLeft />
          </button>
          <span className="avatar">{conversation.driver.slice(0, 2)}</span>
          <div>
            <h1>{conversation.driver}</h1>
            <p>
              {
                store.freights.find((f) => f.id === conversation.freightId)
                  ?.title
              }
            </p>
          </div>
        </header>
        <div className="conversation-messages">
          <div className="conversation-message-inner">
            {timeline.map((entry) => {
              if (entry.kind === "offer") {
                const offer = entry.offer;
                const active =
                  offer.id === offers.at(-1)?.id &&
                  offer.status === "PENDENTE" &&
                  conversation.status === "PENDENTE" &&
                  canNegotiate;
                const status = {
                  PENDENTE: "Aguardando aceite",
                  ACEITA: "Proposta aceita",
                  RECUSADA: "Proposta recusada",
                  SUBSTITUIDA: "Substituída por uma nova proposta",
                  ENCERRADA: "Proposta encerrada",
                }[offer.status];
                return (
                  <article
                    key={offer.id}
                    className={
                      "chat-offer " + (role === "motorista" ? "mine" : "")
                    }
                    aria-label={`Proposta de ${conversation.driver}`}
                  >
                    <small>{conversation.driver} · Proposta de frete</small>
                    <div className="chat-offer-heading">
                      <h2>{money(offer.priceCents)}</h2>
                      <span className="badge">{status}</span>
                    </div>
                    <dl>
                      <div>
                        <dt>Veículo</dt>
                        <dd>{offer.vehicle}</dd>
                      </div>
                      <div>
                        <dt>Disponibilidade</dt>
                        <dd>
                          {new Date(offer.availableAt).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </dd>
                      </div>
                    </dl>
                    {freight && (
                      <p className="muted">
                        {freight.origin} → {freight.destination}
                      </p>
                    )}
                    <p className="chat-offer-comment">
                      {offer.message || "Sem comentário adicional."}
                    </p>
                    {offer.createdAt && (
                      <time>
                        {new Date(offer.createdAt).toLocaleString("pt-BR")}
                      </time>
                    )}
                    {role === "cliente" && active && (
                      <div className="chat-offer-actions">
                        <button
                          className="primary"
                          onClick={() =>
                            setDecision({ offer, action: "accept" })
                          }
                        >
                          Aceitar proposta
                        </button>
                        <button
                          className="secondary"
                          onClick={() =>
                            setDecision({ offer, action: "decline" })
                          }
                        >
                          Recusar proposta
                        </button>
                      </div>
                    )}
                  </article>
                );
              }
              const m = entry.message;
              return (
                <div
                  key={m.id}
                  className={"bubble " + (m.role === role ? "mine" : "")}
                >
                  <small>
                    {m.role === "cliente" ? "Cliente" : "Motorista"}
                  </small>
                  <p>{m.text}</p>
                  <time>
                    {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              );
            })}
            <div ref={bottom} />
          </div>
        </div>
        {canRevise && (
          <div className="chat-negotiation-action">
            <button className="secondary" onClick={() => setNewOfferOpen(true)}>
              Enviar nova proposta
            </button>
          </div>
        )}
        <form className="conversation-composer" onSubmit={send}>
          <input
            name="text"
            aria-label="Mensagem"
            placeholder="Escreva sua mensagem…"
            required
            maxLength={2000}
          />
          <button className="primary" aria-label="Enviar mensagem">
            <ArrowRight />
          </button>
        </form>
        <ConfirmDialog
          open={decision !== null}
          onClose={() => setDecision(null)}
          title={`${decision?.action === "decline" ? "Recusar" : "Aceitar"} essa proposta de ${conversation.driver}?`}
          description={
            decision?.action === "decline"
              ? "A proposta será recusada. A conversa continuará aberta para negociar uma nova proposta."
              : `O frete será agendado por ${money(decision?.offer.priceCents ?? 0)} e as outras propostas serão encerradas.`
          }
          confirmLabel={
            decision?.action === "decline"
              ? "Sim, recusar proposta"
              : "Sim, aceitar proposta"
          }
          cancelLabel="Voltar"
          destructive={decision?.action === "decline"}
          onConfirm={async () => {
            if (
              !decision ||
              role !== "cliente" ||
              decision.offer.id !== offers.at(-1)?.id
            )
              return false;
            const next =
              decision.action === "accept"
                ? acceptProposal(store, conversation.id)
                : declineOffer(store, conversation.id, decision.offer.id);
            const ok = await save(next);
            if (ok) setDecision(null);
            return ok;
          }}
        />
        {newOfferOpen && canRevise && (
          <ProposalFormDialog
            proposal={conversation}
            onClose={() => setNewOfferOpen(false)}
            onSubmit={async (offer) =>
              save(reviseOffer(store, conversation.id, offer))
            }
          />
        )}
      </section>
    );
  const conversations = store.proposals.filter(
    (p) => role === "cliente" || ownProposal(p, name),
  );
  return (
    <>
      <span className="eyebrow">VAMOS COMBINAR</span>
      <h1>Conversas</h1>
      <section className="panel conversation-list conversations-only">
        {conversations.map((p) => {
          const last = store.messages
            .filter((m) => m.proposalId === p.id)
            .at(-1);
          return (
            <button key={p.id} onClick={() => setChatId(p.id)}>
              <span className="avatar">{p.driver.slice(0, 2)}</span>
              <span className="conversation-summary">
                <b>{p.driver}</b>
                <small>
                  {store.freights.find((f) => f.id === p.freightId)?.title}
                </small>
                <p>{last?.text || "Toque para conversar sobre o frete"}</p>
              </span>
              <ArrowRight size={18} />
            </button>
          );
        })}
        {!conversations.length && (
          <div className="empty">
            <MessageCircle />
            <h2>Nenhuma conversa ainda</h2>
            <p>Suas conversas aparecerão aqui quando houver propostas.</p>
          </div>
        )}
      </section>
    </>
  );
}
