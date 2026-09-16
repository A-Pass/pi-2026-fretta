// src/components/ModalAgendamento.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { X, Calendar, Clock, Star } from "lucide-react";

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
}
function roundHalf(n) {
  return Math.round(n * 2) / 2;
}

function StarRating({ value = 0, onChange, disabled = false }) {
  const [hover, setHover] = useState(null);
  const display = hover !== null ? hover : value;

  function handleMove(e, idx) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = x <= rect.width / 2 ? 0.5 : 1;
    setHover(idx - 1 + half);
  }
  function handleLeave() {
    setHover(null);
  }
  function handleClick(e, idx) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = x <= rect.width / 2 ? 0.5 : 1;
    onChange?.(idx - 1 + half);
  }

  function fillForStar(starIndex, current) {
    const left = starIndex - 1;
    const right = starIndex;
    if (current >= right) return 1;
    if (current <= left) return 0;
    return 0.5;
  }

  return (
    <div className={`flex items-center gap-1 ${disabled ? "opacity-70" : ""}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const fill = fillForStar(idx, display);

        return (
          <button
            key={idx}
            type="button"
            className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-60"
            onMouseMove={(e) => handleMove(e, idx)}
            onMouseLeave={handleLeave}
            onClick={(e) => handleClick(e, idx)}
            disabled={disabled}
            aria-label={`Nota ${idx} estrelas`}
            title="Clique na metade esquerda/direita para 0.5"
          >
            <Star className="absolute inset-0 m-auto text-slate-300" size={18} />
            {fill > 0 && (
              <span className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ width: fill === 1 ? "100%" : "50%" }}>
                <Star className="text-amber-500" size={18} />
              </span>
            )}
          </button>
        );
      })}

      <span className="ml-2 text-xs font-black text-slate-600 tabular-nums">{Number(value || 0).toFixed(1)}</span>
    </div>
  );
}

export default function ModalAgendamento({ agendamento, onClose, onCancel, onRemarcar, onConcluir, onAvaliar }) {
  if (!agendamento) return null;

  const status = String(agendamento.status || "").toLowerCase();

  const statusLabel = {
    pendente: "Pendente",
    concluido: "Concluído",
    "concluído": "Concluído",
    cancelado: "Cancelado",
  };

  const statusStyle = {
    pendente: "bg-orange-100 text-orange-700",
    concluido: "bg-emerald-100 text-emerald-700",
    "concluído": "bg-emerald-100 text-emerald-700",
    cancelado: "bg-red-100 text-red-600",
  };

  const jaAvaliado = Boolean(agendamento?.avaliacao?.nota);
  const podeCancelar = status === "pendente";
  const podeRemarcar = false; // ✅ pendente não pode reagendar (pedido)
  const podeConcluir = status === "pendente";
  const podeAvaliar = !jaAvaliado && (status === "concluido" || status === "concluído"); // ✅ cancelado não avalia

  const [modo, setModo] = useState("detalhes"); // detalhes | remarcar | avaliar
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");

  const [nota, setNota] = useState(0);
  const [textoAvaliacao, setTextoAvaliacao] = useState("");
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const isFormValido = useMemo(() => Boolean(novaData && novaHora), [novaData, novaHora]);

  const avaliacaoValida = useMemo(() => {
    const n = clamp(roundHalf(nota), 0, 5);
    const texto = String(textoAvaliacao || "");
    return n >= 0.5 && texto.length <= 280 && !enviandoAvaliacao;
  }, [nota, textoAvaliacao, enviandoAvaliacao]);

  useEffect(() => {
    const av = agendamento?.avaliacao || null;
    if (av && typeof av === "object") {
      const n = clamp(roundHalf(Number(av.nota ?? 0)), 0, 5);
      setNota(n);
      setTextoAvaliacao(String(av.texto ?? av.comentario ?? ""));
    } else {
      setNota(0);
      setTextoAvaliacao("");
    }
    setEnviandoAvaliacao(false);
    setModo("detalhes");
    setNovaData("");
    setNovaHora("");
  }, [agendamento?.id]);

  function abrirRemarcacao() {
    if (!podeRemarcar) return;
    setModo("remarcar");
    setNovaData("");
    setNovaHora("");
  }

  function abrirAvaliacao() {
    if (!podeAvaliar) return;
    setModo("avaliar");
  }

  function voltarDetalhes() {
    setModo("detalhes");
  }

  function enviarRemarcacao() {
    if (!isFormValido || !podeRemarcar) return;

    onRemarcar?.({ id: agendamento.id, novaData, novaHora, agendamento });
    onClose?.();
  }

  function concluir() {
    if (!podeConcluir) return;
    onConcluir?.(agendamento);
    onClose?.();
  }

  function cancelar() {
    if (!podeCancelar) return;
    onCancel?.(agendamento);
    onClose?.();
  }

  async function enviarAvaliacao() {
    if (!podeAvaliar || !avaliacaoValida) return;

    const n = clamp(roundHalf(nota), 0, 5);
    const texto = String(textoAvaliacao || "").trim();

    setEnviandoAvaliacao(true);
    try {
      await onAvaliar?.({ agendamento, nota: n, texto });
      onClose?.();
    } finally {
      setEnviandoAvaliacao(false);
    }
  }

  const avaliacaoBadge = agendamento?.avaliacao?.nota ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-700">
      <Star size={12} />
      {Number(agendamento.avaliacao.nota).toFixed(1)}
    </span>
  ) : null;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-black text-lg">{agendamento.servico}</h2>
          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${statusStyle[status] || "bg-slate-100 text-slate-600"}`}>
            {statusLabel[status] || String(agendamento.status || "—")}
          </span>
          {avaliacaoBadge}
        </div>

        <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500">
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={agendamento.fotoCliente || "/img/cliente-placeholder.png"}
          alt={agendamento.cliente || "Cliente"}
          onError={(e) => {
            e.currentTarget.src = "/img/cliente-placeholder.png";
          }}
          className="w-12 h-12 rounded-full object-cover border border-slate-200"
        />
        <div>
          <p className="font-bold text-slate-800">{agendamento.cliente}</p>
          <p className="text-xs text-slate-500">{agendamento.local}</p>
        </div>
      </div>

      {modo === "detalhes" && (
        <>
          <div className="bg-slate-50 p-4 rounded-2xl text-sm space-y-1">
            <p>
              <strong>Data:</strong> {agendamento.data}
            </p>
            <p>
              <strong>Hora:</strong> {agendamento.hora}
            </p>
            <p>
              <strong>Valor:</strong> R$ {Number(agendamento.valor ?? 0).toFixed(2)}
            </p>
          </div>

          {agendamento.descricao && <p className="text-sm text-slate-600">{agendamento.descricao}</p>}

          <div className="grid grid-cols-2 gap-3 pt-3">
            {/* ✅ pendente: apenas Cancelar e Concluir (sem Reagendar/Avaliar) */}
            {podeCancelar && (
              <button onClick={cancelar} className="bg-red-100 text-red-700 py-3 rounded-xl font-black col-span-2">
                Cancelar
              </button>
            )}

            {podeConcluir && (
              <button onClick={concluir} className="col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-black">
                Concluir
              </button>
            )}

            {/* ✅ avaliar só concluído e só 1 vez */}
            {podeAvaliar && (
              <button
                type="button"
                onClick={abrirAvaliacao}
                className="col-span-2 bg-amber-50 text-amber-700 py-3 rounded-xl font-black flex items-center justify-center gap-2 border border-amber-100"
              >
                <Star size={16} />
                Avaliar
              </button>
            )}
          </div>
        </>
      )}

      {modo === "remarcar" && (
        <>
          <div className="bg-slate-50 p-4 rounded-2xl text-sm space-y-1">
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Remarcação</p>
            <p>
              <strong>Atual:</strong> {agendamento.data} às {agendamento.hora}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Nova data</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                className="w-full pl-11 p-3 rounded-xl border border-slate-200 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Novo horário</label>
            <div className="relative mt-1">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input
                type="time"
                value={novaHora}
                onChange={(e) => setNovaHora(e.target.value)}
                className="w-full pl-11 p-3 rounded-xl border border-slate-200 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={voltarDetalhes} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black">
              Voltar
            </button>

            <button
              onClick={enviarRemarcacao}
              disabled={!isFormValido}
              className={`flex-1 py-3 rounded-xl font-black ${
                isFormValido ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Enviar
            </button>
          </div>
        </>
      )}

      {modo === "avaliar" && (
        <>
          <div className="bg-slate-50 p-4 rounded-2xl text-sm space-y-3">
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Avaliação</p>
              <p className="text-xs text-slate-600 mt-1">Dê uma nota de <strong>0.5</strong> a <strong>5.0</strong>.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Nota</label>
              <div className="mt-2">
                <StarRating value={nota} onChange={(v) => setNota(clamp(roundHalf(v), 0, 5))} disabled={enviandoAvaliacao} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Comentário</label>
              <textarea
                value={textoAvaliacao}
                onChange={(e) => setTextoAvaliacao(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder="Comentário (opcional)..."
                className="mt-1 w-full p-3 rounded-xl border border-slate-200 text-sm outline-none resize-none"
                disabled={enviandoAvaliacao}
              />
              <div className="mt-1 text-[10px] font-black text-slate-400 text-right">
                {String(textoAvaliacao || "").length}/280
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={voltarDetalhes}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black"
              disabled={enviandoAvaliacao}
            >
              Voltar
            </button>

            <button
              onClick={enviarAvaliacao}
              className={`flex-1 py-3 rounded-xl font-black ${
                !avaliacaoValida ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-amber-500 text-white"
              }`}
              disabled={!avaliacaoValida}
            >
              {enviandoAvaliacao ? "Enviando..." : "Enviar avaliação"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
