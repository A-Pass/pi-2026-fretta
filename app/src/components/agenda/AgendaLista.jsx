'use client';

import AgendaCard from './AgendaCard';

export default function AgendaLista({
  agendamentos,
  onSelectAgendamento,
}) {
  return (
    <div className="py-6 space-y-4 animate-in fade-in">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
        Agendamentos
      </h3>

      {agendamentos.map(item => (
        <AgendaCard
          key={item.id}
          agendamento={item}
          onClick={() => onSelectAgendamento(item)}
        />
      ))}
    </div>
  );
}
