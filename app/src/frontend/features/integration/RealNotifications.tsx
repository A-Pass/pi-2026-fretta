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
  const [error, setError] = useState("");
  async function load(after?: string) {
    try {
      const page = await backend.notifications(after);
      setItems((previous) =>
        after ? [...previous, ...page.items] : page.items,
      );
      setCursor(page.nextCursor);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <section className="panel">
      <h1>Notificações</h1>
      {error && <p role="alert">{error}</p>}
      <button className="secondary" onClick={() => void load()}>
        Atualizar
      </button>
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
        <button className="secondary" onClick={() => void load(cursor)}>
          Carregar mais
        </button>
      )}
    </section>
  );
}
