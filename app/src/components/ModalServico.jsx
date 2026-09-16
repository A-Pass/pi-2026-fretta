// src/components/ModalServico.jsx
"use client";

import { useMemo, useState } from "react";
import { X, MapPin, User, Calendar, Minus, Plus, Send, Camera } from "lucide-react";

function money(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return n;
}

function getClienteNome(servico) {
  const c = servico?.cliente;
  if (!c) return "Cliente";
  const nome = `${c.primeiro_nome ?? ""} ${c.ultimo_nome ?? ""}`.trim();
  return nome || "Cliente";
}

function getLocal(servico) {
  return servico?.endereco ?? servico?.local ?? servico?.endereco_texto ?? "Endereço não informado";
}

// ✅ fotos ilustrativas (local)
const ILLU = ["/img/cliente-placeholder.png", "/img/cliente-placeholder.png", "/img/cliente-placeholder.png"];

export default function ModalServico({ servico, pessoaIdPrestador, onClose, onEnviarProposta }) {
  const s = servico;

  const [modoProposta, setModoProposta] = useState(false);
  const [valor, setValor] = useState(() => money(s?.valor_oferecido ?? 0));
  const [dataSug, setDataSug] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const titulo = s?.titulo ?? "Serviço";
  const clienteNome = useMemo(() => getClienteNome(s), [s]);
  const clienteFoto = s?.cliente?.foto_perfil || "/img/cliente-placeholder.png";
  const local = useMemo(() => getLocal(s), [s]);

  const fotos = useMemo(() => {
    const list = Array.isArray(s?.fotos) ? s.fotos : [];
    const fromModel = list
      .map((f) => f?.uri_img || f?.url)
      .filter(Boolean);
    // ✅ sempre mostra fotos ilustrativas
    const base = fromModel.length ? fromModel : ILLU;
    return base.length ? base : ILLU;
  }, [s]);

  const [imgAtiva, setImgAtiva] = useState(0);

  function inc() {
    setValor((v) => Math.max(0, Number(v) + 1));
  }
  function dec() {
    setValor((v) => Math.max(0, Number(v) - 1));
  }

  const propostaValida = useMemo(() => {
    const v = Number(valor);
    return Boolean(pessoaIdPrestador) && Number.isFinite(v) && v > 0 && !enviando;
  }, [valor, pessoaIdPrestador, enviando]);

  async function submitProposta() {
    if (!propostaValida) return;

    setEnviando(true);
    try {
      await onEnviarProposta?.({
        servico: { id: s.id, titulo: s.titulo, valor_oferecido: s.valor_oferecido },
        valor: Number(valor),
        dataSugerida: dataSug || null,
        mensagem: mensagem || "",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-black text-lg">{titulo}</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50" title="Fechar">
          <X />
        </button>
      </div>

      {/* CLIENTE */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={clienteFoto}
          alt={clienteNome}
          onError={(e) => (e.currentTarget.src = "/img/cliente-placeholder.png")}
          className="w-11 h-11 rounded-full object-cover border border-slate-200"
        />
        <div>
          <p className="text-sm font-black text-slate-800 flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            {clienteNome}
          </p>
          <p className="text-[11px] text-slate-500 font-bold">{s?.cliente?.celular ?? ""}</p>
        </div>
      </div>

      {/* LOCAL */}
      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600 mb-4">
        <MapPin size={16} className="text-emerald-600" />
        {local}
      </div>

      {/* VALOR */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Valor oferecido</p>
        <p className="text-lg font-black text-emerald-600">R$ {money(s?.valor_oferecido ?? 0).toFixed(2)}</p>
      </div>

      {/* FOTOS (ilustrativas) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Fotos do local</h3>
          <span className="text-[10px] font-black text-slate-400 inline-flex items-center gap-1">
            <Camera size={12} /> Ilustrativas
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-100">
          <img
            src={fotos[Math.min(imgAtiva, fotos.length - 1)]}
            alt="Foto do local"
            className="w-full h-48 object-cover"
            onError={(e) => (e.currentTarget.src = "/img/cliente-placeholder.png")}
          />
        </div>

        {fotos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {fotos.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                onClick={() => setImgAtiva(idx)}
                className={`shrink-0 rounded-2xl overflow-hidden border ${idx === imgAtiva ? "border-emerald-400" : "border-slate-200"}`}
                title={`Imagem ${idx + 1}`}
              >
                <img
                  src={src}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-20 h-14 object-cover"
                  onError={(e) => (e.currentTarget.src = "/img/cliente-placeholder.png")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESCRIÇÃO */}
      {s?.descricao ? <p className="text-sm text-slate-700 mb-6">{s.descricao}</p> : null}

      {/* PROPOSTA */}
      {!modoProposta ? (
        <button
          type="button"
          onClick={() => setModoProposta(true)}
          className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          Fazer proposta
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-black text-slate-700 mb-2">Seu valor (R$)</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={dec}
                className="rounded-xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50"
                title="Diminuir"
              >
                <Minus size={18} />
              </button>

              <input
                value={String(valor)}
                onChange={(e) => {
                  const raw = String(e.target.value);
                  if (raw === "") return setValor(0);
                  const n = Number(raw.replace(",", "."));
                  if (!Number.isNaN(n)) setValor(n);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black outline-none"
                inputMode="decimal"
              />

              <button
                type="button"
                onClick={inc}
                className="rounded-xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50"
                title="Aumentar"
              >
                <Plus size={18} />
              </button>
            </div>
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
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <label className="text-xs font-black text-slate-700">Mensagem (opcional)</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="mt-2 w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Ex: Posso realizar no período da tarde..."
            />
          </div>

          <button
            type="button"
            disabled={!propostaValida}
            onClick={submitProposta}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {enviando ? "Enviando..." : "Enviar proposta"}
          </button>

          <button
            type="button"
            onClick={() => setModoProposta(false)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50"
            disabled={enviando}
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
