// src/app/dashboardprestador/ui/AgendamentoModal.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

function formatDateTimeBR(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

function getServicoIdFromItem(item) {
  return item?.proposta_servico_cliente_id ?? item?.proposta?.servico_cliente_id ?? item?.proposta?.demanda?.id ?? null;
}

export default function AgendamentoModal({ open, onClose, item, profissionalId, onUpdate, onAvaliar }) {
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  const [iso, setIso] = useState("");
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  const status = String(item?.status || "").toUpperCase();
  const titulo = item?.proposta?.demanda?.titulo || `Serviço #${item?.proposta_servico_cliente_id ?? ""}`;
  const cliente =
    item?.proposta?.demanda?.cliente?.primeiro_nome
      ? `${item.proposta.demanda.cliente.primeiro_nome} ${item.proposta.demanda.cliente.ultimo_nome || ""}`.trim()
      : "—";

  const servicoId = useMemo(() => getServicoIdFromItem(item), [item]);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setIso(item?.data_hora_agendamento ? new Date(item.data_hora_agendamento).toISOString() : "");
    setNota(5);
    setComentario("");
  }, [open, item]);

  if (!open) return null;

  async function safeUpdate(payload) {
    setErr(null);
    setSaving(true);
    try {
      await onUpdate(item.id, payload);
      setSaving(false);
    } catch (e) {
      setSaving(false);
      setErr(e.message || "Falha ao atualizar");
    }
  }

  async function handleAvaliar(e) {
    e.preventDefault();
    if (!servicoId || !profissionalId) {
      setErr("IDs ausentes para avaliação.");
      return;
    }
    setErr(null);
    setSaving(true);
    try {
      await onAvaliar({
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId,
        nota,
        comentario,
      });
      setSaving(false);
      onClose();
    } catch (e) {
      setSaving(false);
      setErr(e.message || "Falha ao enviar avaliação");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <div className="text-base font-semibold text-slate-900">Agendamento</div>
            <div className="text-xs text-slate-500">{titulo}</div>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {err && (
            <div className="rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">{err}</div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <div>
              <b>Cliente:</b> {cliente}
            </div>
            <div>
              <b>Status:</b> {status || "—"}
            </div>
            <div>
              <b>Data:</b> {formatDateTimeBR(item?.data_hora_agendamento)}
            </div>
            <div>
              <b>Preço:</b> {item?.preco_negociado ?? item?.proposta?.valor_proposta ?? "—"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {status === "SOLICITADO" && (
              <button
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                onClick={() => safeUpdate({ status: "CONFIRMADO" })}
              >
                Confirmar
              </button>
            )}

            <button
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              onClick={() => safeUpdate({ status: "CANCELADO" })}
            >
              Cancelar
            </button>

            <button
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              onClick={() => safeUpdate({ status: "FINALIZADO" })}
            >
              Finalizar
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold text-slate-900">Reagendar (ISO)</div>
            <div className="mt-2 flex gap-2">
              <input
                value={iso}
                onChange={(e) => setIso(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                placeholder="2026-01-27T14:00:00.000Z"
              />
              <button
                disabled={saving || !iso}
                className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                onClick={() => safeUpdate({ data_hora_agendamento: iso })}
              >
                Salvar
              </button>
            </div>
          </div>

          {(status === "FINALIZADO" || status === "CONCLUIDO") && (
            <form onSubmit={handleAvaliar} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-sm font-semibold text-slate-900">Avaliar (prestador → cliente)</div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nota (0-5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={nota}
                    onChange={(e) => setNota(Number(e.target.value))}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Comentário (opcional)</label>
                  <input
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    placeholder="..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                Enviar avaliação
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <button
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
