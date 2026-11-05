import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import type { AppNotification, Role, Store } from "@/contracts";
import { dateTime } from "../../lib/dates";
export function NotificationsView({
  store,
  role,
  save,
  onOpen,
}: {
  store: Store;
  role: Role;
  save: (s: Store) => Promise<boolean>;
  onOpen: (n: AppNotification) => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const list = (store.notifications || []).filter((n) => n.role === role);
  async function mark(id?: string) {
    setBusy(true);
    setError("");
    try {
      const ok = await save({
        ...store,
        notifications: (store.notifications || []).map((n) =>
          n.role === role && (!id || n.id === id) ? { ...n, read: true } : n,
        ),
      });
      if (!ok) setError("Não foi possível atualizar as notificações.");
      return ok;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">ACOMPANHE AS NOVIDADES</span>
          <h1>Notificações</h1>
        </div>
        {list.some((n) => !n.read) && (
          <button
            className="secondary"
            disabled={busy}
            onClick={() => void mark()}
          >
            <CheckCheck size={18} /> Marcar todas como lidas
          </button>
        )}
      </div>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <section className="panel notification-list">
        {list.map((n) => (
          <button
            key={n.id}
            disabled={busy}
            className={
              n.read ? "notification-item" : "notification-item unread"
            }
            onClick={async () => {
              if (n.read || (await mark(n.id))) onOpen(n);
            }}
          >
            <Bell size={20} />
            <span>
              <b>
                {n.title}
                {!n.read && (
                  <span className="unread-dot" aria-label="Não lida" />
                )}
              </b>
              <p>{n.body}</p>
              <time>{dateTime(n.createdAt)}</time>
            </span>
          </button>
        ))}
        {!list.length && (
          <div className="empty">
            <Bell />
            <h2>Tudo tranquilo por aqui</h2>
            <p>
              Propostas, mensagens e atualizações dos seus fretes aparecerão
              aqui.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
