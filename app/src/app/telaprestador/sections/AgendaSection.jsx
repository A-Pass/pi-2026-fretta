// src/app/telaprestador/sections/AgendaSection.jsx  (apenas a parte do card: adiciona estrela + nota)
"use client";

import { useMemo } from "react";
import { CalendarDays, Clock, MapPin, User2, Loader2, BadgeCheck, Ban, Hourglass, Star } from "lucide-react";

function statusMeta(status) {
  const s = String(status || "").toLowerCase();
  if (s === "concluido" || s === "concluído") return { label: "Concluído", icon: <BadgeCheck size={14} />, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (s === "cancelado") return { label: "Cancelado", icon: <Ban size={14} />, cls: "bg-red-50 text-red-700 border-red-200" };
  return { label: "Pendente", icon: <Hourglass size={14} />, cls: "bg-orange-50 text-orange-700 border-orange-200" };
}

export default function AgendaSection({ agendamentos = [], carregando = false, onSelectAgendamento }) {
  const list = Array.isArray(agendamentos) ? agendamentos : [];

  const sorted = useMemo(() => {
    return list.slice().sort((a, b) => new Date(a?.data_hora || 0).getTime() - new Date(b?.data_hora || 0).getTime());
  }, [list]);

  if (carregando) {
    return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="text-sm font-black text-slate-700 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Carregando agenda...
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-sm font-black text-slate-700">Nenhum agendamento encontrado.</p>
        <p className="text-sm text-slate-500 mt-1">Você verá aqui os serviços pendentes, concluídos e cancelados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((a) => {
        const meta = statusMeta(a?.status);
        const key = String(a?.id ?? `${a?.servico}-${a?.data_hora}`);

        const nota = a?.avaliacao?.nota ? Number(a.avaliacao.nota) : null;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectAgendamento?.(a)}
            className="w-full text-left bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">{a?.servico ?? "Serviço"}</p>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                  <User2 size={14} className="text-slate-400" />
                  <span className="line-clamp-1">{a?.cliente ?? "Cliente"}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 border text-[11px] font-black ${meta.cls}`}>
                  {meta.icon}
                  {meta.label}
                </span>

                {nota ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700">
                    <Star size={12} />
                    {nota.toFixed(1)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                <CalendarDays size={14} className="text-emerald-600" />
                <span>{a?.data ?? "--/--/----"}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-600 font-bold justify-end">
                <Clock size={14} className="text-emerald-600" />
                <span>{a?.hora ?? "--:--"}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                <MapPin size={14} className="text-emerald-600" />
                <span className="line-clamp-1">{a?.local ?? "Endereço não informado"}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-black text-emerald-600">R$ {Number(a?.valor ?? 0).toFixed(2)}</p>
              <span className="text-[11px] font-black text-slate-600">Abrir</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
