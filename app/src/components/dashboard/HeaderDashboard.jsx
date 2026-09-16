'use client';

import { useState } from 'react';
import { Bell, Star, X } from 'lucide-react';

export default function HeaderDashboard({
  activeTab,
  setActiveTab,
  notificacoes
}) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      
      {/* DRAWER DE NOTIFICAÇÕES */}
      {isNotificationsOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={() => setIsNotificationsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[120] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">Notificações</h2>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_NOTIFICACOES.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl border bg-white border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800">{n.titulo}</h4>
                  <p className="text-xs text-slate-600">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{n.hora} atrás</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* HEADER */}
      <header className="bg-emerald-600 pb-12 pt-8 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Olá, Cleiton</h1>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">Mural de Oportunidades</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsNotificationsOpen(true)} className="relative bg-white/10 p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors">
              <Bell size={22}/>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* AÇÃO DE CLIQUE ADICIONADA AQUI */}
          <div 
            onClick={() => setActiveTab('ganhos')} 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white cursor-pointer active:scale-95 transition-all"
          >
            <p className="text-emerald-50 text-[10px] font-bold uppercase mb-1 opacity-80">Ganhos na Semana</p>
            <h2 className="text-2xl font-black">R$ 840,00</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white">
            <p className="text-emerald-50 text-[10px] font-bold uppercase mb-1 opacity-80">Avaliação</p>
            <div className="flex items-center gap-1">
              <h2 className="text-2xl font-black">4.9</h2>
              <Star className="text-yellow-400 fill-yellow-400" size={18} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
} 
