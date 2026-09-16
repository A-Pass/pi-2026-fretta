"use client";

import { useEffect, useMemo, useState } from "react";

export default function ServiceFormModal({ open, onClose, initial, onSubmit }) {
  const initialState = useMemo(() => {
    return {
      titulo: initial?.titulo ?? "",
      descricao: initial?.descricao ?? "",
      preco_base: initial?.preco_base ?? initial?.preco ?? "",
    };
  }, [initial]);

  const [form, setForm] = useState(initialState);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setSaving(false);
    setForm(initialState);
  }, [open, initialState]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);

    const titulo = String(form.titulo || "").trim();
    const descricao = String(form.descricao || "").trim();
    const precoBaseNum = form.preco_base === "" ? null : Number(form.preco_base);

    if (!titulo) {
      setErr("Informe um título.");
      return;
    }
    if (form.preco_base !== "" && !Number.isFinite(precoBaseNum)) {
      setErr("Preço base inválido.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        titulo,
        descricao: descricao || null,
        preco_base: precoBaseNum,
      });
      setSaving(false);
    } catch (e2) {
      setSaving(false);
      setErr(e2.message || "Falha ao salvar serviço");
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
            <div className="text-base font-semibold text-slate-900">
              {initial?.id ? "Editar serviço" : "Novo serviço"}
            </div>
            <div className="text-xs text-slate-500">Cadastro do serviço do prestador</div>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {err && (
            <div className="rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700">Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="Ex: Eletricista residencial"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              className="mt-1 w-full min-h-[96px] rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Detalhes do serviço..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Preço base</label>
            <input
              value={form.preco_base}
              onChange={(e) => setForm((p) => ({ ...p, preco_base: e.target.value }))}
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="Ex: 120"
              inputMode="decimal"
            />
            <div className="mt-1 text-xs text-slate-500">Pode ficar vazio (se o seu backend permitir).</div>
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
