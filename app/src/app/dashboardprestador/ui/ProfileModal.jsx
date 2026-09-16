// src/app/dashboardprestador/ui/ProfileModal.jsx
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

export default function ProfileModal({ open, onClose, sessionUser, pessoaId, pessoaData, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const initial = useMemo(() => {
    return {
      primeiro_nome: pessoaData?.primeiro_nome ?? (sessionUser?.name ? String(sessionUser.name).split(" ")[0] : ""),
      ultimo_nome: pessoaData?.ultimo_nome ?? (sessionUser?.name ? String(sessionUser.name).split(" ").slice(1).join(" ") : ""),
      telefone: pessoaData?.telefone ?? "",
      foto_perfil: pessoaData?.foto_perfil ?? "",
    };
  }, [pessoaData, sessionUser]);

  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setForm(initial);
  }, [open, initial]);

  if (!open) return null;

  async function handleSave(e) {
    e.preventDefault();
    setErr(null);

    if (!pessoaId) {
      setErr("pessoaId inválido (ID numérico usado nas APIs).");
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`/api/pessoas/${pessoaId}`, {
        method: "PUT",
        body: JSON.stringify({
          primeiro_nome: String(form.primeiro_nome || "").trim() || null,
          ultimo_nome: String(form.ultimo_nome || "").trim() || null,
          telefone: String(form.telefone || "").trim() || null,
          foto_perfil: String(form.foto_perfil || "").trim() || null,
        }),
      });
      setSaving(false);
      if (onSaved) await onSaved();
      onClose();
    } catch (e2) {
      setSaving(false);
      setErr(e2.message || "Falha ao salvar perfil");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <div className="text-base font-semibold text-slate-900">Perfil</div>
            <div className="text-xs text-slate-500">
              {sessionUser?.email ? sessionUser.email : "—"} • pessoaId: {pessoaId ?? "N/A"}
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-3">
          {err && (
            <div className="rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Primeiro nome</label>
              <input
                value={form.primeiro_nome}
                onChange={(e) => setForm((p) => ({ ...p, primeiro_nome: e.target.value }))}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Sobrenome</label>
              <input
                value={form.ultimo_nome}
                onChange={(e) => setForm((p) => ({ ...p, ultimo_nome: e.target.value }))}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Telefone</label>
            <input
              value={form.telefone}
              onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))}
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="(xx) xxxxx-xxxx"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Foto (URL)</label>
            <input
              value={form.foto_perfil}
              onChange={(e) => setForm((p) => ({ ...p, foto_perfil: e.target.value }))}
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="https://..."
            />
            <div className="mt-2 flex items-center gap-3">
              <img
                src={form.foto_perfil || "/img/default-avatar.png"}
                alt="Preview"
                className="h-12 w-12 rounded-xl border border-slate-200 object-cover bg-slate-100"
                onError={(e) => (e.currentTarget.src = "/img/default-avatar.png")}
              />
              <div className="text-xs text-slate-500">Preview da foto</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>

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
