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
  chatId: string;
  setChatId: (s: string) => void;
  send: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};
export function ChatView({ store, role, chatId, setChatId, send }: Props) {
  return (
    <>
      <span className="eyebrow">VAMOS COMBINAR</span>
      <h1>Conversas</h1>
      <div className="chat-layout">
        <section className="panel conversation-list">
          {store.proposals
            .filter((p) => p.status !== "ENCERRADA")
            .map((p) => (
              <button
                className={chatId === p.id ? "selected" : ""}
                key={p.id}
                onClick={() => setChatId(p.id)}
              >
                <span className="avatar">{p.driver.slice(0, 2)}</span>
                <span>
                  <b>{p.driver}</b>
                  <small>
                    {store.freights.find((f) => f.id === p.freightId)?.title}
                  </small>
                </span>
              </button>
            ))}
        </section>
        <section className="panel chat">
          {chatId ? (
            <>
              <p className="muted">
                Conversa local de demonstração. Não envia mensagens a outras
                pessoas.
              </p>
              <div className="messages">
                {store.messages
                  .filter((m) => m.proposalId === chatId)
                  .map((m) => (
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
                  ))}
                {!store.messages.some((m) => m.proposalId === chatId) && (
                  <p className="empty">
                    Comece combinando os detalhes do transporte.
                  </p>
                )}
              </div>
              <form onSubmit={send}>
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
            </>
          ) : (
            <p className="empty">Escolha uma conversa para começar.</p>
          )}
        </section>
      </div>
    </>
  );
}
