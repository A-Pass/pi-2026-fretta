"use client";

import { useEffect, useMemo, useState } from "react";
import { X, MapPin, User, Calendar, Minus, Plus, Send } from "lucide-react";

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
  // usa qualquer campo existente (se você tiver endereço estruturado no model, aqui dá pra montar)
  return servico?.endereco ?? servico?.local ?? servico?.endereco_texto ?? "Endereço não informado";
}

async function fetchJsonOrThrow(url, options = {}) {
  const res = await fetch(url, { cache: "no-store", ...options });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function ModalServico({ servico, pessoaIdPrestador, onClose, onEnviarProposta }) {
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [modoProposta, setModoProposta] = useState(false);

  const [valor, setValor] = useState(() => money(servico?.valor_oferecido ?? 0));
  const [dataSug, setDataSug] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setCarregando(true);
      setErro(null);

      try {
        const s = await fetchJsonOrThrow(`/api/servicos/${servico.id}?cliente=1&fotos=1`);
        if (!alive) return;
        setDetalhe(s);
        setValor(money(s?.valor_oferecido ?? 0));
      } catch (e) {
        if (!alive) return;
        setDetalhe(null);
        setErro(e?.message || "Falha ao carregar serviço");
      } finally {
        if (!alive) return;
        setCarregando(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [servico?.id]);

  const s = detalhe || servico;

  const titulo = s?.titulo ?? "Serviço";
  const clienteNome = useMemo(() => getClienteNome(s), [s]);
  const clienteFoto = s?.cliente?.foto_perfil || "/img/cliente-placeholder.png";
  const local = useMemo(() => getLocal(s), [s]);

  const fotos = useMemo(() => {
    const list = Array.isArray(s?.fotos) ? s.fotos : [];
    // ordena por ordem e usa uri_img
    return list
      .slice()
      .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
      .map((f) => f.uri_img)
      .filter(Boolean);
  }, [s]);

  const [imgAtiva, setImgAtiva] = useState(0);

  function inc() {
    setValor((v) => Math.max(0, Number(v) + 1));
  }
  function dec() {
    setValor((v) => Math.max(0, Number(v) - 1));
  }

  async function submitProposta() {
    if (!pessoaIdPrestador) return;

    const v = Number(valor);
    if (!Number.isFinite(v) || v <= 0) {
      setErro("Informe um valor válido para a proposta.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      await onEnviarProposta?.({
        servico: { id: s.id },
        valor: v,
        dataSugerida: dataSug || null,
        mensagem: mensagem || "",
      });
    } catch (e) {
      setErro(e?.message || "Falha ao enviar proposta");
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

      {carregando ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500 font-bold">Carregando detalhes...</p>
        </div>
      ) : (
        <>
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
            <p className="text-lg font-black text-emerald-600">
              R$ {money(s?.valor_oferecido ?? 0).toFixed(2)}
            </p>
          </div>

          {/* FOTOS */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Fotos do local</h3>

            <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-100">
              <img
                src={fotos.length ? fotos[Math.min(imgAtiva, fotos.length - 1)] : "/img/cliente-placeholder.png"}
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
                    className={`shrink-0 rounded-2xl overflow-hidden border ${
                      idx === imgAtiva ? "border-emerald-400" : "border-slate-200"
                    }`}
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
                      const n = Number(String(e.target.value).replace(",", "."));
                      if (!Number.isNaN(n)) setValor(n);
                      if (e.target.value === "") setValor(0);
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

              {erro && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-black text-rose-700">
                  {erro}
                </div>
              )}

              <button
                type="button"
                disabled={enviando}
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
              >
                Voltar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
