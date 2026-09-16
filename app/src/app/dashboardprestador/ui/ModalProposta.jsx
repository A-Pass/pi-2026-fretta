"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, MessageSquareText, Tag, X } from "lucide-react";

function toMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return "";
  return n.toFixed(2);
}

function getTitulo(servico) {
  return servico?.titulo ?? servico?.nome ?? "Serviço";
}

function getValorSug(servico) {
  const v = servico?.valor ?? servico?.preco ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getLocal(servico) {
  return servico?.local ?? servico?.estabelecimento ?? "Local";
}

function getTags(servico) {
  if (Array.isArray(servico?.tags) && servico.tags.length) return servico.tags;
  if (servico?.categoria) return [servico.categoria];
  return ["Geral"];
}

export default function ModalProposta({ servico, onClose, onSubmit }) {
  const valorSugerido = useMemo(() => getValorSug(servico), [servico]);

  const [preco, setPreco] = useState(valorSugerido ? toMoney(valorSugerido) : "");
  const [dataSug, setDataSug] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const titulo = useMemo(() => getTitulo(servico), [servico]);
  const local = useMemo(() => getLocal(servico), [servico]);
  const tags = useMemo(() => getTags(servico), [servico]);

  useEffect(() => {
    setPreco(valorSugerido ? toMoney(valorSugerido) : "");
    setDataSug("");
    setMensagem("");
    setErro(null);
    setEnviando(false);
  }, [valorSugerido, servico]);

  function sanitizeMoneyInput(raw) {
    return String(raw).replace(/[^\d,.\s]/g, "").trim();
  }

  function parseMoney(raw) {
    const s = String(raw).replace(/\s/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isNaN(n) ? null : n;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    const valor = parseMoney(preco);
    if (valor == null || valor <= 0) {
      setErro("Informe um preço válido.");
      return;
    }

    if (dataSug) {
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(dataSug);
      if (!ok) {
        setErro("Data sugerida inválida. Use AAAA-MM-DD.");
        return;
      }
    }

    setEnviando(true);
    try {
      await onSubmit?.({
        servico,
        preco: valor,
        mensagem: (mensagem || "").trim(),
        data_sugerida: dataSug || null,
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      setErro("Não foi possível enviar. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Fazer proposta</h2>
          <p className="text-sm text-slate-600 mt-1 font-bold">{titulo}</p>
          <p className="text-[11px] text-slate-500 font-black mt-1">{local}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          title="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-black uppercase"
          >
            <Tag size={14} />
            {t}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <label className="text-xs font-black text-slate-700">
            Seu preço (R$){" "}
            {valorSugerido > 0 && (
              <span className="text-slate-400 font-black">• sugerido: {toMoney(valorSugerido)}</span>
            )}
          </label>
          <input
            value={preco}
            onChange={(e) => setPreco(sanitizeMoneyInput(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Ex: 120,00"
            inputMode="decimal"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <label className="text-xs font-black text-slate-700 flex items-center gap-2">
            <Calendar size={16} />
            Data sugerida (opcional)
          </label>
          <input
            type="date"
            value={dataSug}
            onChange={(e) => setDataSug(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          <p className="text-[11px] text-slate-500 font-bold mt-2">
            Você pode deixar em branco e combinar pelo chat depois.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <label className="text-xs font-black text-slate-700 flex items-center gap-2">
            <MessageSquareText size={16} />
            Mensagem (opcional)
          </label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="mt-2 w-full min-h-[110px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="Ex: Posso realizar amanhã no período da tarde. Levo todos os produtos."
          />
        </div>

        {erro && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-black text-rose-700">
            {erro}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={enviando}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar proposta"}
          </button>
        </div>
      </form>
    </div>
  );
}
