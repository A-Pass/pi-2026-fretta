'use client';

export default function AgendaCard({ agendamento, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md active:scale-95 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-800">
          {agendamento.servico}
        </h4>
        <span className="font-black text-emerald-600">
          R$ {agendamento.valor}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-500">
        {agendamento.data} • {agendamento.hora}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {agendamento.local}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        Cliente: {agendamento.cliente}
      </p>
    </div>
  );
}
