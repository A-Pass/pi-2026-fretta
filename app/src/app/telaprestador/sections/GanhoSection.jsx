// src/app/telaprestador/sections/GanhoSection.jsx
"use client";

import { useMemo } from "react";
import { Wallet2, TrendingUp, BadgeCheck, Hourglass, Ban } from "lucide-react";

function sum(arr, predicate) {
  return arr.reduce((acc, x) => (predicate(x) ? acc + Number(x?.valor ?? 0) : acc), 0);
}

export default function GanhosSection({ agendamentos = [] }) {
  const list = Array.isArray(agendamentos) ? agendamentos : [];

  const stats = useMemo(() => {
    const pendentes = list.filter((a) => String(a?.status || "").toLowerCase() === "pendente");
    const concluidos = list.filter((a) => {
      const s = String(a?.status || "").toLowerCase();
      return s === "concluido" || s === "concluído";
    });
    const cancelados = list.filter((a) => String(a?.status || "").toLowerCase() === "cancelado");

    const totalConcluido = sum(concluidos, () => true);
    const totalPendente = sum(pendentes, () => true);

    return {
      qtd: { pendentes: pendentes.length, concluidos: concluidos.length, cancelados: cancelados.length },
      totalConcluido,
      totalPendente,
    };
  }, [list]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <Wallet2 size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Total concluído</p>
            <p className="text-2xl font-black text-slate-900">R$ {Number(stats.totalConcluido).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-600 font-bold">
          <TrendingUp size={14} className="text-emerald-600" />
          Em aberto (pendente): <span className="font-black text-slate-900">R$ {Number(stats.totalPendente).toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Pendentes"
          value={stats.qtd.pendentes}
          icon={<Hourglass size={16} />}
          className="bg-orange-50 border-orange-100 text-orange-700"
        />
        <StatCard
          title="Concluídos"
          value={stats.qtd.concluidos}
          icon={<BadgeCheck size={16} />}
          className="bg-emerald-50 border-emerald-100 text-emerald-700"
        />
        <StatCard
          title="Cancelados"
          value={stats.qtd.cancelados}
          icon={<Ban size={16} />}
          className="bg-red-50 border-red-100 text-red-700"
        />
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-sm font-black text-slate-800">Dica</p>
        <p className="text-sm text-slate-600 mt-1">
          Quando integrar, calcule os ganhos por período (semana/mês) e traga gráficos simples.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, className }) {
  return (
    <div className={`rounded-[1.5rem] border p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-widest">{title}</p>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-black tabular-nums">{Number(value || 0)}</p>
    </div>
  );
}
