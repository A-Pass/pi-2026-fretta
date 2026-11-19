"use client";
import Link from "next/link";
import { ArrowRight, Bell, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { Role } from "@/contracts";
import { createBackendClient } from "../../api/backend";

const backend = createBackendClient();
type Notification = Awaited<
  ReturnType<typeof backend.notifications>
>["items"][number];

export function RealNotifications({
  role,
  onRead,
}: {
  role: Role;
  onRead: () => void;
}) {
  const [items, setItems] = useState<Notification[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");
  async function load(after?: string, manual = false) {
    setLoading(true);
    setUpdated(false);
    setError("");
    try {
      const page = await backend.notifications(after);
      setItems((previous) =>
        after ? [...previous, ...page.items] : page.items,
      );
      setCursor(page.nextCursor);
      if (manual) {
        setUpdated(true);
        onRead();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <section className="panel">
      <h1>Notificações</h1>
      {error && <p role="alert">{error}</p>}
      <button
        className="secondary"
        disabled={loading}
        onClick={() => void load(undefined, true)}
      >
        {loading ? "Atualizando…" : "Atualizar notificações"}
      </button>
      {updated && <p role="status">Notificações atualizadas.</p>}
      {!loading && !error && !items.length && (
        <p>Você ainda não tem notificações.</p>
      )}
      <ul className="real-notification-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="panel real-notification-card"
            data-unread={!item.read}
          >
            <div className="real-notification-heading">
              <Bell size={18} aria-hidden="true" />
              <strong>{item.title}</strong>
              {!item.read && (
                <span className="notification-new-label">Nova</span>
              )}
            </div>
            <p>{item.body}</p>
            <div className="proposal-actions">
              {(item.event === "CONVITE_EMPRESA" ||
                item.event === "ATRIBUICAO_EMPRESA") && (
                <a
                  className="secondary real-freight-link"
                  href={
                    item.event === "CONVITE_EMPRESA"
                      ? "/empresa?visao=motorista"
                      : "/empresa?visao=motorista&aba=servicos"
                  }
                >
                  {item.event === "CONVITE_EMPRESA"
                    ? "Ver convite"
                    : "Ver serviço atribuído"}{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
              {(item.event === "VINCULO_EMPRESA" ||
                item.event === "DISPONIBILIDADE_EMPRESA" ||
                item.event === "CADASTRO_EMPRESA") && (
                <a
                  className="secondary real-freight-link"
                  href={
                    item.event === "DISPONIBILIDADE_EMPRESA"
                      ? "/empresa?aba=servicos"
                      : "/empresa"
                  }
                >
                  {item.event === "DISPONIBILIDADE_EMPRESA"
                    ? "Ver serviços"
                    : item.event === "CADASTRO_EMPRESA"
                      ? "Ver cadastro"
                      : "Ver equipe"}{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
              {item.freightId && (
                <Link
                  className="secondary real-freight-link"
                  href={`/${item.role || role}/fretes/${encodeURIComponent(item.freightId)}`}
                >
                  Ver frete <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
              {!item.read && (
                <button
                  className="secondary"
                  onClick={async () => {
                    try {
                      await backend.readNotification(item.id);
                      setItems((previous) =>
                        previous.map((n) =>
                          n.id === item.id ? { ...n, read: true } : n,
                        ),
                      );
                      onRead();
                    } catch (e) {
                      setError((e as Error).message);
                    }
                  }}
                >
                  <Check size={16} aria-hidden="true" /> Marcar como lida
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {cursor && (
        <button
          className="secondary"
          disabled={loading}
          onClick={() => void load(cursor)}
        >
          Carregar mais
        </button>
      )}
    </section>
  );
}
