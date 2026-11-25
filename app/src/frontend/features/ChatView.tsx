import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Package,
  Send,
  Star,
} from "lucide-react";
import type { Role, Store, ProposalOffer, Proposal } from "@/contracts";
import { acceptProposal, money } from "./freights/rules";
import {
  proposalOffers,
  declineOffer,
  reviseOffer,
} from "./freights/negotiation";
import { providerId, providerName } from "./providers/rules";
import { driverCanPropose } from "./onboarding/rules";
import { ownProposal } from "./driver/rules";
import { ProposalFormDialog } from "../components/ProposalFormDialog";
import { dateTime, time } from "../lib/dates";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { isUnreadChat } from "./notifications/rules";
type Props = {
  store: Store;
  role: Role;
  name: string;
  chatId: string;
  setChatId: (s: string) => void;
  send: (text: string) => Promise<boolean>;
  onManageVehicles: () => void;
  onProvider?: (id: string, conversationId?: string) => void;
  onFreight?: (id: string) => void;
  onComplete?: (id: string, score: number) => Promise<boolean>;
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
  onManageVehicles,
  onProvider,
  onFreight,
  onComplete,
}: Props) {
  const conversation = store.proposals.find(
    (p) =>
      p.id === chatId &&
      (role === "cliente" || ownProposal(p, store.profile?.id || "")),
  );
  const freight = store.freights.find((f) => f.id === conversation?.freightId);
  const [decision, setDecision] = useState<{
    offer: ProposalOffer;
    action: "accept" | "decline";
  } | null>(null);
  const [newOfferOpen, setNewOfferOpen] = useState(false);
  const [activeOfferOpen, setActiveOfferOpen] = useState(false);
  const [finishStep, setFinishStep] = useState<"confirm" | "rating" | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [draftText, setDraftText] = useState("");
  const [sending, setSending] = useState(false),
    [sendError, setSendError] = useState("");
  const contact =
    role === "cliente"
      ? conversation
        ? providerName(conversation)
        : "Motorista"
      : freight?.clientName ||
        conversation?.conversation?.clientName ||
        "Cliente";
  const freightTitle = freight?.title || conversation?.conversation?.title;
  async function submitMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || !draftText.trim()) return;
    nearBottom.current = true;
    setSending(true);
    setSendError("");
    try {
      if (await send(draftText.trim())) setDraftText("");
      else
        setSendError(
          "Não foi possível enviar. Sua mensagem foi mantida para tentar novamente.",
        );
    } catch {
      setSendError("Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }
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
  const freightStatus =
    freight?.status ?? conversation?.conversation?.freightStatus;
  const canNegotiate = freightStatus === "ABERTO";
  const pendingOffer = offers.at(-1);
  const activeOffer =
    role === "cliente" &&
    canNegotiate &&
    conversation?.status === "PENDENTE" &&
    pendingOffer?.status === "PENDENTE"
      ? pendingOffer
      : undefined;
  const agreed =
    (role === "cliente" || role === "motorista") &&
    conversation?.status === "ACEITA" &&
    freightStatus !== "CANCELADO" &&
    freight?.agreement?.proposalId === conversation.id
      ? freight.agreement
      : undefined;
  const serviceInProgress =
    freightStatus === "AGENDADO" || freightStatus === "EM_TRANSPORTE";
  const reviewed = Boolean(freight?.reviews[role]);
  const pickupAt = agreed?.availableAt ? Date.parse(agreed.availableAt) : NaN;
  const canFinish = Boolean(
    onComplete && agreed && serviceInProgress && !reviewed && pickupAt <= now,
  );
  const canRevise =
    role === "motorista" &&
    conversation &&
    ownProposal(conversation, store.profile?.id || "") &&
    canNegotiate &&
    driverCanPropose(store);
  const messagesViewport = useRef<HTMLDivElement>(null),
    scrollAnchor = useRef<{ height: number; top: number } | null>(null),
    nearBottom = useRef(true);
  const [hasNew, setHasNew] = useState(false),
    [visibleEvents, setVisibleEvents] = useState(50),
    [search, setSearch] = useState(""),
    [visibleChats, setVisibleChats] = useState(20);
  useEffect(() => {
    setDecision(null);
    setVisibleEvents(50);
    nearBottom.current = true;
    setHasNew(false);
    setNewOfferOpen(false);
    setActiveOfferOpen(false);
    setFinishStep(null);
    setScore(0);
    setDraftText("");
    setSendError("");
  }, [chatId]);
  useEffect(() => {
    if (
      !serviceInProgress ||
      reviewed ||
      !Number.isFinite(pickupAt) ||
      now >= pickupAt
    )
      return;
    const delay = Math.min(pickupAt - now, 60000);
    const timer = window.setTimeout(() => setNow(Date.now()), delay);
    return () => window.clearTimeout(timer);
  }, [now, pickupAt, serviceInProgress, reviewed]);
  const latestEvent = timeline.at(-1);
  const latestEventId =
    latestEvent?.kind === "offer"
      ? latestEvent.offer.id
      : latestEvent?.message.id;
  useLayoutEffect(() => {
    const viewport = messagesViewport.current;
    if (!viewport) return;
    if (scrollAnchor.current) {
      const { height, top } = scrollAnchor.current;
      viewport.scrollTop = top + viewport.scrollHeight - height;
      scrollAnchor.current = null;
    } else if (nearBottom.current) {
      viewport.scrollTop = viewport.scrollHeight;
    } else {
      setHasNew(true);
    }
  }, [chatId, latestEventId, messages.length, offers.length, visibleEvents]);
  if (conversation)
    return (
      <section
        className="conversation-screen"
        aria-label={`Conversa com ${contact}`}
      >
        <header className="conversation-header">
          <button
            className="back"
            aria-label="Voltar às conversas"
            onClick={() => setChatId("")}
          >
            <ArrowLeft />
          </button>
          <span className="avatar" aria-hidden="true">
            {contact.slice(0, 2).toUpperCase()}
          </span>
          <div className="conversation-contact">
            <h1>
              {role === "cliente" && onProvider ? (
                <button
                  type="button"
                  className="conversation-contact-name"
                  aria-label={`Ver perfil de ${contact}`}
                  onClick={() =>
                    onProvider(providerId(conversation), conversation.id)
                  }
                >
                  {contact}
                </button>
              ) : (
                contact
              )}
            </h1>
            {freightTitle && <p>{freightTitle}</p>}
          </div>
          {(activeOffer || canRevise) && (
            <div className="conversation-header-links">
              {activeOffer && (
                <button
                  className="secondary chat-header-action"
                  onClick={() => setActiveOfferOpen(true)}
                >
                  Proposta ativa
                </button>
              )}
              {canRevise && (
                <button
                  className="primary chat-header-action"
                  onClick={() => setNewOfferOpen(true)}
                >
                  Nova proposta
                </button>
              )}
            </div>
          )}
          {onFreight && (
            <button
              type="button"
              className="secondary chat-header-action chat-header-freight"
              onClick={() => onFreight(conversation.freightId)}
            >
              <Package size={15} aria-hidden="true" />
              Ver frete
            </button>
          )}
        </header>
        {agreed && (
          <div className="chat-service-completion" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <div>
              <strong>
                {freightStatus === "CONCLUIDO"
                  ? "Serviço encerrado"
                  : "Frete contratado"}
              </strong>
              {freightStatus !== "CONCLUIDO" && (
                <p>
                  {reviewed
                    ? "Avaliação enviada. Aguardando a outra parte."
                    : `Retirada em ${dateTime(agreed.availableAt)}`}
                </p>
              )}
            </div>
            {canFinish && (
              <button
                className="secondary"
                onClick={() => {
                  setScore(0);
                  setFinishStep("confirm");
                }}
              >
                Serviço concluído
              </button>
            )}
          </div>
        )}
        <div
          className="conversation-messages"
          ref={messagesViewport}
          onScroll={() => {
            const el = messagesViewport.current;
            if (el) {
              nearBottom.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 100;
              if (nearBottom.current) setHasNew(false);
            }
          }}
        >
          <div className="conversation-message-inner">
            {timeline.length > visibleEvents && (
              <div className="load-more">
                <button
                  className="secondary"
                  onClick={() => {
                    const viewport = messagesViewport.current;
                    if (viewport)
                      scrollAnchor.current = {
                        height: viewport.scrollHeight,
                        top: viewport.scrollTop,
                      };
                    setVisibleEvents((count) => count + 50);
                  }}
                >
                  Carregar mensagens anteriores
                </button>
              </div>
            )}
            {timeline.slice(-visibleEvents).map((entry) => {
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
                    <small>
                      {providerName(conversation)} · Proposta de frete
                    </small>
                    {conversation.providerKind === "empresa" && (
                      <p className="muted">Motorista: {conversation.driver}</p>
                    )}
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
                        <dd>{dateTime(offer.availableAt)}</dd>
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
                      <time>{dateTime(offer.createdAt)}</time>
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
                  className={
                    "bubble " + ((m.mine ?? m.role === role) ? "mine" : "")
                  }
                >
                  <small>
                    {m.senderName ||
                      (m.role === "cliente" ? "Cliente" : "Motorista")}
                  </small>
                  <p>{m.text}</p>
                  <time>{time(m.createdAt)}</time>
                </div>
              );
            })}
          </div>
        </div>
        {hasNew && (
          <div className="chat-new-messages">
            <button
              className="secondary"
              onClick={() => {
                nearBottom.current = true;
                setHasNew(false);
                const viewport = messagesViewport.current;
                if (viewport) viewport.scrollTop = viewport.scrollHeight;
              }}
            >
              Novas mensagens ↓
            </button>
          </div>
        )}
        {sendError && (
          <p className="chat-send-error" role="alert">
            {sendError}
          </p>
        )}
        <form className="conversation-composer" onSubmit={submitMessage}>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                if (draftText.trim() && !sending)
                  e.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={sending}
            name="text"
            aria-label="Mensagem"
            placeholder="Escreva sua mensagem…"
            required
            maxLength={2000}
            rows={1}
          />
          <button
            className="primary"
            disabled={sending || !draftText.trim()}
            aria-label={
              sending
                ? "Enviando mensagem"
                : sendError
                  ? "Tentar enviar novamente"
                  : "Enviar mensagem"
            }
          >
            {sending ? "…" : <Send size={19} aria-hidden="true" />}
          </button>
        </form>
        <ConfirmDialog
          open={activeOfferOpen && Boolean(activeOffer)}
          onClose={() => setActiveOfferOpen(false)}
          title={`Proposta de ${contact}`}
          description={
            activeOffer
              ? `${money(activeOffer.priceCents)} · ${activeOffer.vehicle} · Retirada em ${dateTime(activeOffer.availableAt)}`
              : ""
          }
          cancelLabel="Voltar"
          confirmLabel="Aceitar proposta"
          destructive={false}
          onConfirm={async () => {
            if (!activeOffer) return false;
            setActiveOfferOpen(false);
            setDecision({ offer: activeOffer, action: "accept" });
            return true;
          }}
        >
          {activeOffer?.message && (
            <p className="chat-offer-comment">{activeOffer.message}</p>
          )}
          {activeOffer && (
            <button
              className="secondary"
              onClick={() => {
                setActiveOfferOpen(false);
                setDecision({ offer: activeOffer, action: "decline" });
              }}
            >
              Recusar proposta
            </button>
          )}
        </ConfirmDialog>
        <ConfirmDialog
          open={finishStep !== null}
          onClose={() => setFinishStep(null)}
          title={
            finishStep === "rating"
              ? "Avalie o serviço"
              : "O serviço foi concluído?"
          }
          description={
            finishStep === "rating"
              ? `Dê uma nota de 1 a 5 para ${contact}.`
              : "Confirme somente depois que o frete for entregue. As duas partes precisam confirmar para encerrar o serviço."
          }
          cancelLabel="Voltar"
          confirmLabel={
            finishStep === "rating"
              ? "Enviar avaliação"
              : "Sim, concluir serviço"
          }
          destructive={false}
          onConfirm={async () => {
            if (finishStep === "confirm") {
              setFinishStep("rating");
              return true;
            }
            if (!score) throw new Error("Selecione uma nota de 1 a 5.");
            if (!canFinish || !onComplete) return false;
            const ok = await onComplete(conversation.freightId, score);
            if (ok) setFinishStep(null);
            return ok;
          }}
        >
          {finishStep === "rating" && (
            <fieldset className="chat-rating-stars">
              <legend>Sua nota</legend>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="chat-score"
                    checked={score === value}
                    onChange={() => setScore(value)}
                  />
                  <Star
                    size={24}
                    aria-hidden="true"
                    fill={value <= score ? "currentColor" : "none"}
                  />
                  <span className="sr-only">
                    {value} {value === 1 ? "estrela" : "estrelas"}
                  </span>
                </label>
              ))}
            </fieldset>
          )}
        </ConfirmDialog>
        <ConfirmDialog
          open={decision !== null}
          onClose={() => setDecision(null)}
          title={`${decision?.action === "decline" ? "Recusar" : "Aceitar"} essa proposta de ${providerName(conversation)}?`}
          description={
            decision?.action === "decline"
              ? "A proposta será recusada. A conversa continuará aberta para negociar uma nova proposta."
              : `O frete será agendado por ${money(decision?.offer.priceCents ?? 0)} e as outras propostas serão encerradas. Motorista: ${conversation.driver}. Veículo: ${decision?.offer.vehicle ?? ""}. Disponibilidade: ${decision ? dateTime(decision.offer.availableAt) : ""}.`
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
                ? acceptProposal(store, conversation.id, decision.offer.id)
                : declineOffer(store, conversation.id, decision.offer.id);
            const ok = await save(next);
            if (ok) setDecision(null);
            return ok;
          }}
        />
        {newOfferOpen && canRevise && (
          <ProposalFormDialog
            proposal={conversation}
            vehicles={store.vehicles || []}
            onManageVehicles={onManageVehicles}
            onClose={() => setNewOfferOpen(false)}
            onSubmit={async (offer) =>
              driverCanPropose(store)
                ? save(reviseOffer(store, conversation.id, offer))
                : Promise.reject(
                    new Error(
                      "Conclua a análise do seu cadastro antes de enviar novas propostas.",
                    ),
                  )
            }
          />
        )}
      </section>
    );
  if (chatId)
    return (
      <EmptyState title="Conversa não encontrada">
        Ela não está disponível para este perfil.
        <button className="primary" onClick={() => setChatId("")}>
          Voltar às conversas
        </button>
      </EmptyState>
    );
  function describe(p: Proposal) {
    const freight = store.freights.find((item) => item.id === p.freightId);
    const title = freight?.title || p.conversation?.title || "Frete";
    const name =
      role === "cliente"
        ? providerName(p)
        : freight?.clientName || p.conversation?.clientName || "Cliente";
    return { title, name };
  }
  const lastMessages = new Map(
    store.messages.map((message) => [message.proposalId, message]),
  );
  const conversations = store.proposals
    .filter(
      (p) => role === "cliente" || ownProposal(p, store.profile?.id || ""),
    )
    .map((p) => ({
      id: p.id,
      ...describe(p),
      last: lastMessages.get(p.id),
      activityAt:
        lastMessages.get(p.id)?.createdAt ||
        proposalOffers(p).at(-1)?.createdAt ||
        "",
    }))
    .filter(({ title, name }) =>
      `${name} ${title}`
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => b.activityAt.localeCompare(a.activityAt));
  return (
    <>
      <span className="eyebrow">VAMOS COMBINAR</span>
      <h1>Conversas</h1>
      <label className="search conversations-search">
        <span className="sr-only">Buscar conversas</span>
        <input
          placeholder="Buscar por nome ou frete"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleChats(20);
          }}
        />
      </label>
      <section className="panel conversation-list conversations-only">
        {conversations
          .slice(0, visibleChats)
          .map(({ id, name, title, last }) => {
            const unread = store.notifications?.some((item) =>
              isUnreadChat(item, role, id),
            );
            return (
              <button key={id} onClick={() => setChatId(id)}>
                <span className="avatar" aria-hidden="true">
                  {name.slice(0, 2).toUpperCase()}
                </span>
                <span className="conversation-summary">
                  <b>{name}</b>
                  <small>{title}</small>
                  <p>{last?.text || "Toque para conversar sobre o frete"}</p>
                </span>
                {unread && (
                  <span className="unread-dot" aria-label="Mensagem não lida" />
                )}
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
      {visibleChats < conversations.length && (
        <div className="load-more">
          <button
            className="secondary"
            onClick={() => setVisibleChats(visibleChats + 20)}
          >
            Mostrar mais conversas
          </button>
        </div>
      )}
    </>
  );
}
