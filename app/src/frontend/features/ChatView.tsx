import { useEffect, useRef, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { Role, Store } from "@/contracts";
type Props = {
  store: Store;
  role: Role;
  chatId: string;
  setChatId: (s: string) => void;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};
export function ChatView({ store, role, chatId, setChatId, send }: Props) {
  const conversation = store.proposals.find((p) => p.id === chatId);
  const messages = store.messages.filter((m) => m.proposalId === chatId);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [chatId, store.messages.length]);
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
            {messages.map((m) => (
              <div
                key={m.id}
                className={"bubble " + (m.role === role ? "mine" : "")}
              >
                <small>{m.role === "cliente" ? "Cliente" : "Motorista"}</small>
                <p>{m.text}</p>
                <time>
                  {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
            {!messages.length && (
              <div className="empty">
                <MessageCircle />
                <p>Combine os detalhes do seu frete por aqui.</p>
              </div>
            )}
            <div ref={bottom} />
          </div>
        </div>
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
      </section>
    );
  const conversations = store.proposals.filter((p) => p.status !== "ENCERRADA");
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
