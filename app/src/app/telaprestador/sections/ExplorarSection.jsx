// src/app/telaprestador/sections/ExplorarSection.jsx
"use client";

import { useMemo, useState } from "react";
import { MapPin, Camera, Search, ArrowRight, Loader2 } from "lucide-react";

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

export default function ExplorarSection({ oportunidades = [], carregando = false, onSelectServico }) {
  const list = Array.isArray(oportunidades) ? oportunidades : [];

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = String(q || "").trim().toLowerCase();
    if (!query) return list;

    return list.filter((s) => {
      const hay = `${s?.titulo || ""} ${s?.descricao || ""} ${getLocal(s)} ${getClienteNome(s)}`.toLowerCase();
      return hay.includes(query);
    });
  }, [list, q]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Search size={18} />
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar oportunidades..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {carregando ? (
          <div className="mt-3 text-xs font-black text-slate-500 flex items-center gap-2">
            <Loader2 className="animate-spin" size={14} /> Carregando...
          </div>
        ) : (
          <div className="mt-3 text-[11px] font-black text-slate-500">
            {filtered.length} oportunidade{filtered.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {filtered.length === 0 && !carregando ? (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-700">Nada por aqui.</p>
          <p className="text-sm text-slate-500 mt-1">Tente ajustar a busca ou volte mais tarde.</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {(carregando ? Array.from({ length: 3 }) : filtered).map((s, idx) => {
          if (carregando) {
            return (
              <div key={idx} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="h-4 w-40 bg-slate-100 rounded" />
                <div className="mt-2 h-3 w-56 bg-slate-100 rounded" />
                <div className="mt-4 h-10 w-full bg-slate-100 rounded-xl" />
              </div>
            );
          }

          const titulo = s?.titulo ?? "Serviço";
          const local = getLocal(s);
          const cliente = getClienteNome(s);
          const valor = money(s?.valor_oferecido ?? 0);

          const fotos = Array.isArray(s?.fotos) ? s.fotos : [];
          const hasFotos = fotos.some((f) => Boolean(f?.url || f?.uri_img));

          return (
            <button
              key={String(s?.id ?? idx)}
              type="button"
              onClick={() => onSelectServico?.(s)}
              className="w-full text-left bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-900">{titulo}</p>
                  <p className="text-[11px] font-black text-slate-500 mt-1">{cliente}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">R$ {valor.toFixed(2)}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Oferta</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                <MapPin size={14} className="text-emerald-600" />
                <span className="line-clamp-1">{local}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-500">
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 border ${
                      hasFotos ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Camera size={14} />
                    {hasFotos ? "Com fotos" : "Sem fotos"}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-[11px] font-black text-slate-700">
                  Ver detalhes <ArrowRight size={14} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
