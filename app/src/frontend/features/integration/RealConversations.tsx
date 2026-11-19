"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, Send, X } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { Message, Role, Vehicle } from "@/contracts";
import { ProposalFormDialog } from "../../components/ProposalFormDialog";
import { createBackendClient } from "../../api/backend";
import { createHttpTransport } from "../../api/http";

const http = createHttpTransport();
const backend = createBackendClient();
type Conversation = {
  id: string;
  name: string;
  title: string;
  freightId: string;
};

type Offer = {
  id: string;
  createdAt: string;
  priceCents: number;
  availableAt: string | null;
  message: string | null;
  vehicle: string | null;
  status: string;
};
type Negotiation = {
  status: string;
  owner: boolean;
  updatedAt: string;
  proposals: { id: string; conversationId: string | null; offers: Offer[] }[];
};
const price = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const offerDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Bahia",
});

function OfferTerms({ offer }: { offer: Offer }) {
  return (
    <>
      <strong>{price.format(offer.priceCents / 100)}</strong>
      {offer.vehicle && <p>{offer.vehicle}</p>}
      {offer.availableAt && (
        <p>Retirada em {offerDate.format(new Date(offer.availableAt))}</p>
      )}
      {offer.message && <p className="real-chat-text">{offer.message}</p>}
    </>
  );
}

const messageTime = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Bahia",
});

function Chat({
  id,
  role,
  offers,
  freightStatus,
  onReview,
}: {
  id: string;
  role: Role;
  offers: Offer[];
  freightStatus?: string;
  onReview?: (offer: Offer) => void;
}) {
  const timeline = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  const olderRequest = useRef<AbortController | null>(null);
  const oldestInitialized = useRef(false);
  const scrollAnchor = useRef<{ height: number; offset: number } | null>(null);
  const [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () =>
      backend
        .messages(id, undefined, controller.signal)
        .then((p) => {
          if (controller.signal.aborted) return;
          setMessages((current) => {
            const byId = new Map(
              current.map((message) => [message.id, message]),
            );
            for (const message of p.items) byId.set(message.id, message);
            return [...byId.values()];
          });
          if (!oldestInitialized.current) {
            oldestInitialized.current = true;
            setOlderCursor(p.nextCursor);
          }
          setLoaded(true);
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setError("Não foi possível carregar a conversa.");
        });
    void refresh();
    const timer = window.setInterval(refresh, 4000);
    return () => {
      controller.abort();
      olderRequest.current?.abort();
      clearInterval(timer);
    };
  }, [id]);
  const events = [
    ...messages.map((message) => ({
      kind: "message" as const,
      value: message,
    })),
    ...offers.map((offer) => ({ kind: "offer" as const, value: offer })),
  ].sort((a, b) => a.value.createdAt.localeCompare(b.value.createdAt));
  const latestId = events.at(-1)?.value.id;
  const latestStatus = offers.map((offer) => offer.status).join(":");
  useLayoutEffect(() => {
    const element = timeline.current;
    if (!element) return;
    const anchor = scrollAnchor.current;
    if (anchor) {
      element.scrollTop = anchor.offset + element.scrollHeight - anchor.height;
      scrollAnchor.current = null;
    } else if (followLatest.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages.length, latestId, latestStatus, freightStatus]);

  async function loadOlder() {
    if (!olderCursor || olderRequest.current) return;
    const controller = new AbortController();
    olderRequest.current = controller;
    setLoadingOlder(true);
    setError("");
    try {
      const page = await backend.messages(id, olderCursor, controller.signal);
      if (controller.signal.aborted) return;
      const element = timeline.current;
      if (
        element &&
        page.items.some(
          (message) => !messages.some((current) => current.id === message.id),
        )
      ) {
        scrollAnchor.current = {
          offset: element.scrollTop,
          height: element.scrollHeight,
        };
        followLatest.current = false;
      }
      setMessages((current) => {
        const existing = new Set(current.map((message) => message.id));
        return [
          ...page.items.filter((message) => !existing.has(message.id)),
          ...current,
        ];
      });
      setOlderCursor(page.nextCursor);
    } catch (e) {
      if (!controller.signal.aborted)
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível carregar mensagens anteriores.",
        );
    } finally {
      if (!controller.signal.aborted) setLoadingOlder(false);
      olderRequest.current = null;
    }
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    setBusy(true);
    setError("");
    try {
      const item = await backend.sendMessage(
        id,
        draft.trim(),
        crypto.randomUUID(),
      );
      followLatest.current = true;
      setMessages((list) =>
        list.some((m) => m.id === item.id) ? list : [...list, item],
      );
      setDraft((current) => (current === draft ? "" : current));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="real-chat" aria-label="Conversa">
      <div
        className="real-chat-timeline"
        ref={timeline}
        onScroll={() => {
          const element = timeline.current;
          if (element)
            followLatest.current =
              element.scrollHeight - element.scrollTop - element.clientHeight <
              50;
        }}
      >
        {!events.length && (
          <p className="real-chat-empty">
            {loaded
              ? "Envie a primeira mensagem para iniciar a conversa."
              : error
                ? "Conversa indisponível."
                : "Carregando mensagens…"}
          </p>
        )}
        {olderCursor && (
          <button
            type="button"
            className="secondary real-chat-load-older"
            disabled={loadingOlder}
            onClick={() => void loadOlder()}
          >
            {loadingOlder ? "Carregando…" : "Carregar mensagens anteriores"}
          </button>
        )}
        <ol className="real-chat-messages" aria-label="Mensagens">
          {events.map(({ kind, value }) => {
            if (kind === "offer") {
              const notice =
                value.status === "ACEITA"
                  ? freightStatus === "CANCELADO"
                    ? "Proposta aceita · frete cancelado"
                    : role === "cliente"
                      ? "Você contratou este frete"
                      : "Sua proposta foi aceita. Frete contratado"
                  : value.status === "RECUSADA"
                    ? "Proposta recusada"
                    : value.status === "PENDENTE"
                      ? "Proposta ativa"
                      : "Proposta encerrada";
              return (
                <li key={value.id} className="real-chat-offer-card">
                  <b
                    className={
                      value.status === "ACEITA" && freightStatus !== "CANCELADO"
                        ? "driver-review-approved"
                        : undefined
                    }
                  >
                    {notice}
                  </b>
                  <OfferTerms offer={value} />
                  {onReview && value.status === "PENDENTE" && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onReview(value)}
                    >
                      Ver proposta
                    </button>
                  )}
                </li>
              );
            }
            const message = value;
            const own = message.role === role;
            return (
              <li
                key={message.id}
                className={`real-chat-bubble ${own ? "real-chat-bubble-own" : ""}`}
              >
                <span className="sr-only">
                  {own ? "Você: " : "Outra pessoa: "}
                </span>
                <span className="real-chat-text">{message.text}</span>
                <time dateTime={message.createdAt}>
                  {messageTime.format(new Date(message.createdAt))}
                </time>
              </li>
            );
          })}
        </ol>
      </div>
      {error && (
        <p className="alert real-chat-error" role="alert">
          {error}
        </p>
      )}
      <form className="real-chat-composer" onSubmit={send}>
        <textarea
          aria-label="Mensagem"
          placeholder="Escreva uma mensagem"
          rows={1}
          maxLength={2000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="primary"
          aria-label="Enviar mensagem"
          disabled={busy || !draft.trim() || !loaded}
        >
          <Send size={19} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

export function RealConversations({
  role,
  conversationId,
  vehicles,
  canOffer,
}: {
  role: Role;
  conversationId: string;
  vehicles: Vehicle[];
  canOffer: boolean;
}) {
  const [items, setItems] = useState<Conversation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const root = `/${role}/chat`;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void http
      .request<Conversation[]>(`/conversations?role=${role}`, {
        signal: controller.signal,
      })
      .then((rows) => {
        if (!controller.signal.aborted) setItems(rows);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [role]);
  const current = items.find((item) => item.id === conversationId);
  if (conversationId)
    return (
      <ConversationThread
        key={conversationId}
        id={conversationId}
        role={role}
        current={current}
        vehicles={vehicles}
        canOffer={canOffer}
      />
    );
  return (
    <>
      <h1>Conversas</h1>
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Carregando conversas…</p>}
      {!loading && !error && !items.length && (
        <p>Nenhuma conversa por enquanto.</p>
      )}
      <div className="real-freight-list">
        {items.map((item) => (
          <Link
            key={item.id}
            className="panel real-conversation-link"
            href={`${root}/${encodeURIComponent(item.id)}`}
          >
            <MessageCircle size={20} aria-hidden="true" />
            <span>
              <b>{item.name}</b>
              <small>{item.title}</small>
            </span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </>
  );
}

function ConversationThread({
  id,
  role,
  current,
  vehicles,
  canOffer,
}: {
  id: string;
  role: Role;
  current?: Conversation;
  vehicles: Vehicle[];
  canOffer: boolean;
}) {
  const [data, setData] = useState<Negotiation | null>(null);
  const [review, setReview] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const queryVersion = useRef(0);
  const path = current
    ? `/freights/${encodeURIComponent(current.freightId)}`
    : null;
  useEffect(() => {
    if (!path || busy || newOffer) return;
    const controller = new AbortController();
    const refresh = async () => {
      const version = ++queryVersion.current;
      try {
        const result = await http.request<Negotiation>(path, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted && version === queryVersion.current)
          setData(result);
      } catch (e) {
        if (!controller.signal.aborted && version === queryVersion.current)
          setError(
            e instanceof Error
              ? e.message
              : "Não foi possível consultar a proposta.",
          );
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 4000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [path, busy, newOffer]);
  useEffect(() => {
    if (review) dialog.current?.showModal();
    else dialog.current?.close();
  }, [review]);

  const proposal = data?.proposals.find((p) => p.conversationId === id);
  const mayDecide =
    role === "cliente" && data?.owner === true && data.status === "ABERTO";
  const active = mayDecide
    ? proposal?.offers.find((offer) => offer.status === "PENDENTE")
    : undefined;
  const mayOffer =
    role === "motorista" &&
    canOffer &&
    data?.owner === false &&
    data.status === "ABERTO" &&
    !!proposal;
  async function decide(action: "accept" | "decline") {
    if (busy || !path || !proposal || !review || active?.id !== review.id)
      return;
    queryVersion.current++;
    setBusy(true);
    setError("");
    try {
      setData(
        await http.request<Negotiation>(
          `${path}/${action}/${encodeURIComponent(proposal.id)}`,
          {
            method: "POST",
            body: { offerId: review.id },
          },
        ),
      );
      setReview(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível registrar a decisão.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="real-chat-screen">
      <div className="real-chat-header">
        <Link
          className="secondary real-chat-back"
          href={`/${role}/chat`}
          aria-label="Voltar às conversas"
        >
          <ArrowLeft size={19} />
        </Link>
        <div className="real-chat-contact">
          <h1>{current?.name ?? "Conversa"}</h1>
          {current && (
            <Link
              className="real-chat-freight"
              href={`/${role}/fretes/${encodeURIComponent(current.freightId)}`}
            >
              {current.title} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
        {active && (
          <button
            type="button"
            className="secondary real-chat-active-offer"
            onClick={() => {
              setError("");
              setReview(active);
            }}
          >
            Proposta ativa
          </button>
        )}
        {mayOffer && (
          <button
            type="button"
            className="primary real-chat-new-offer"
            onClick={() => setNewOffer(true)}
          >
            Enviar nova proposta
          </button>
        )}
      </div>
      {error && !review && (
        <p className="alert real-chat-error" role="alert">
          {error}
        </p>
      )}
      <Chat
        id={id}
        role={role}
        offers={proposal?.offers ?? []}
        freightStatus={data?.status}
        onReview={
          mayDecide
            ? (offer) => {
                setError("");
                setReview(offer);
              }
            : undefined
        }
      />
      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby="chat-proposal-title"
        onCancel={(e) => {
          e.preventDefault();
          if (!busy) setReview(null);
        }}
      >
        <div className="section-head">
          <h2 id="chat-proposal-title">
            Proposta de {current?.name ?? "frete"}
          </h2>
          <button
            type="button"
            aria-label="Fechar proposta"
            disabled={busy}
            onClick={() => setReview(null)}
          >
            <X size={20} />
          </button>
        </div>
        {review && <OfferTerms offer={review} />}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {review && active?.id !== review.id && (
          <p className="alert">
            A proposta mudou. Feche esta janela e abra a oferta mais recente.
          </p>
        )}
        <div className="confirm-actions">
          <button
            type="button"
            className="secondary"
            disabled={busy || !review || active?.id !== review.id}
            onClick={() => void decide("decline")}
          >
            Recusar proposta
          </button>
          <button
            type="button"
            className="primary"
            disabled={busy || !review || active?.id !== review.id}
            onClick={() => void decide("accept")}
          >
            Aceitar proposta
          </button>
        </div>
      </dialog>
      {newOffer && mayOffer && path && data && (
        <ProposalFormDialog
          vehicles={vehicles}
          onManageVehicles={() => {
            location.href = "/motorista/veiculos";
          }}
          onClose={() => setNewOffer(false)}
          onSubmit={async (offer) => {
            queryVersion.current++;
            setData(
              await http.request<Negotiation>(`${path}/propose`, {
                method: "POST",
                body: { ...offer, expectedUpdatedAt: data.updatedAt },
              }),
            );
            return true;
          }}
        />
      )}
    </div>
  );
}
