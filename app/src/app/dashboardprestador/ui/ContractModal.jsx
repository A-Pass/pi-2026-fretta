"use client";

import { useState } from "react";

function jsonFetch(url, options = {}) {
  return fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
    ...options,
  }).then(async (r) => {
    const data = await r.json().catch(() => null);
    if (!r.ok) throw new Error(data?.error || "Erro na requisição");
    return data;
  });
}

const STATUS = ["SOLICITADO", "CONFIRMADO", "FINALIZADO", "CANCELADO"];

export default function ContractModal({ open, onClose, contract, onDone, onNotify }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [status, setStatus] = useState(contract?.status ?? "SOLICITADO");
  const [preco, setPreco] = useState(contract?.preco_negociado ?? "");
  const [dataHora, setDataHora] = useState(
    contract?.data_hora_agendamento ? new Date(contract.data_hora_agendamento).toISOString().slice(0, 16) : ""
  );

  if (!open) return null;
  if (!contract?.id) return null;

  async function salvar() {
    setErr(null);
    setLoading(true);
    try {
      if (!STATUS.includes(status)) throw new Error("Status inválido");

      await jsonFetch(`/api/contratacoes/${contract.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          preco_negociado: preco !== "" ? Number(preco) : undefined,
          data_hora_agendamento: dataHora ? new Date(dataHora).toISOString() : undefined,
        }),
      });

      // notifica cliente (pessoa_id do dono do serviço = proposta.demanda.pessoa_id)
      const clienteId = contract?.proposta?.demanda?.pessoa_id;
      if (clienteId && onNotify) {
        const titulo =
          status === "CONFIRMADO"
            ? "Agendamento confirmado"
            : status === "CANCELADO"
            ? "Agendamento cancelado"
            : status === "FINALIZADO"
            ? "Serviço finalizado"
            : "Atualização no agendamento";

        const descricao = `Agendamento ${contract.id} atualizado para: ${status}.`;
        await onNotify({ pessoa_id: (clienteId), titulo, descricao });
      }

      await onDone?.();
      onClose?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Gerenciar contratação {contract.id}</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>

        {err ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {err}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">Status</div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs text-slate-500">Preço negociado (R$)</div>
            <input
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              inputMode="decimal"
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-xs text-slate-500">Data/Hora do agendamento</div>
            <input
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              type="datetime-local"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            disabled={loading}
            onClick={salvar}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
