// src/app/dashboardprestador/ui/ProposalModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

function pickClienteId(servico) {
  return (
    servico?.cliente_id ??
    servico?.cliente?.id ??
    servico?.cliente?.pessoa_id ??
    servico?.pessoa_cliente_id ??
    servico?.pessoa_id_cliente ??
    null
  );
}

export default function ProposalModal({ open, onClose, servico, onSubmit }) {
  const initial = useMemo(() => {
    return {
      valor_proposta: servico?.valor_oferecido ?? "",
      texto_proposta: "",
      data_sugerida: "",
    };
  }, [servico]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setSaving(false);
    setForm(initial);
  }, [open, initial]);

  if (!open) return null;

  const titulo = servico?.titulo ?? "Demanda";
  const descricao = servico?.descricao ?? "";
  const clienteId = pickClienteId(servico);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);

    const servico_cliente_id = servico?.id;
    if (!servico_cliente_id) {
      setErr("Serviço inválido (sem id).");
      return;
    }

    const valorNum = Number(form.valor_proposta);
    if (!Number.isFinite(valorNum) || valorNum <= 0) {
      setErr("Informe um valor válido.");
      return;
    }

    const base = String(form.texto_proposta || "").trim() || "Proposta enviada.";
    const textoFinal = form.data_sugerida
      ? `${base}\nData sugerida: ${String(form.data_sugerida).trim()}`
      : base;

    setSaving(true);
    try {
      await onSubmit({
        servico_cliente_id: Number(servico_cliente_id),
        valor_proposta: valorNum,
        texto_proposta: textoFinal,
        cliente_id: clienteId ? Number(clienteId) : null,
      });
      setSaving(false);
    } catch (e2) {
      setSaving(false);
      setErr(e2.message || "Falha ao enviar proposta");
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
            <div className="text-base font-semibold text-slate-900">Enviar proposta</div>
            <div className="text-xs text-slate-500">{titulo}</div>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <div className="p-4 space-y-3">
          {err && (
            <div className="rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">{err}</div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-900">{titulo}</div>
            {descricao && <div className="mt-1 text-slate-700 whitespace-pre-wrap">{descricao}</div>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Valor da proposta</label>
              <input
                value={form.valor_proposta}
                onChange={(e) => setForm((p) => ({ ...p, valor_proposta: e.target.value }))}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                inputMode="decimal"
                placeholder="Ex: 150"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Data sugerida (opcional)</label>
              <input
                value={form.data_sugerida}
                onChange={(e) => setForm((p) => ({ ...p, data_sugerida: e.target.value }))}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ex: 27/01 às 14:00"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Mensagem</label>
              <textarea
                value={form.texto_proposta}
                onChange={(e) => setForm((p) => ({ ...p, texto_proposta: e.target.value }))}
                className="mt-1 w-full min-h-[110px] rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="Explique sua proposta..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Enviando..." : "Enviar"}
            </button>
          </form>
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
