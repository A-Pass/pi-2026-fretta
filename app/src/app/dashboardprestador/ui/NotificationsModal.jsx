// src/app/dashboardprestador/ui/NotificationsModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.details)) || (typeof data === "string" && data) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function normalizeNotificacao(n) {
  return {
    id: n?.id ?? n?.notificacao_id ?? n?._id ?? String(Math.random()),
    titulo: n?.titulo ?? n?.title ?? "Notificação",
    descricao: n?.descricao ?? n?.mensagem ?? n?.message ?? "",
    lida: Boolean(n?.lida ?? n?.read ?? false),
    criado_em: n?.criado_em ?? n?.created_at ?? n?.enviado_em ?? n?.createdAt ?? null,
  };
}

export default function NotificationsModal({ open, onClose, pessoaId }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  const naoLidas = useMemo(() => items.filter((x) => !x.lida).length, [items]);

  async function load() {
    if (!pessoaId) return;
    setLoading(true);
    setErr(null);
    try {
      // padrão mais comum no seu fluxo
      const list = await apiFetch(`/api/notificacoes?pessoa_id=${encodeURIComponent(pessoaId)}`, { method: "GET" });
      const arr = Array.isArray(list) ? list : [];
      setItems(arr.map(normalizeNotificacao));
    } catch (e) {
      setItems([]);
      setErr(e.message || "Falha ao carregar notificações");
    } finally {
      setLoading(false);
    }
  }

  async function markAllAsRead() {
    // opcional: se seu back-end tiver endpoint
    // tenta /api/notificacoes/ler-todas (ou equivalente); se não tiver, só marca na UI
    setItems((prev) => prev.map((x) => ({ ...x, lida: true })));

    if (!pessoaId) return;
    try {
      await apiFetch(`/api/notificacoes/ler-todas`, {
        method: "POST",
        body: JSON.stringify({ pessoa_id: pessoaId }),
      });
    } catch {
      // sem suporte no backend, ignora
    }
  }

  useEffect(() => {
    if (!open) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pessoaId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <div className="text-base font-semibold text-slate-900">Notificações</div>
            <div className="text-xs text-slate-500">{naoLidas} não lidas</div>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <div className="p-4 space-y-3">
          {err && (
            <div className="rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
              onClick={load}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Recarregar"}
            </button>

            <button
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
              onClick={markAllAsRead}
            >
              Marcar tudo como lido
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-slate-600">Carregando...</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-slate-600">Nenhuma notificação.</div>
          ) : (
            <div className="space-y-2">
              {items.map((n) => (
                <div
                  key={n.id}
                  className={[
                    "rounded-2xl border p-3",
                    n.lida ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50",
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold text-slate-900">{n.titulo}</div>
                  <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{n.descricao}</div>
                  {n.criado_em && (
                    <div className="mt-2 text-xs text-slate-500">
                      {String(n.criado_em)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <button
            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
