'use client';

import { useState } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Clock, ChevronRight, 
  Star, Bell, Briefcase, Wallet, User, X, Image as ImageIcon,
  ChevronLeft, DollarSign, Plus, Minus, Send, CheckCircle2
} from "lucide-react";
import { Button } from "@mui/material";

// --- DADOS FAKE COM MAIS IMAGENS ---
const MOCK_OPORTUNIDADES = [
  { 
    id: 1, 
    titulo: "Limpeza de Vidros - Loja", 
    local: "Centro, Eunápolis", 
    valor: 150.00, 
    data: "Hoje", 
    tags: ["Vidros", "Comercial"], 
    descricao: "Preciso de limpeza em 4 vitrines grandes de vidro temperado. Material por conta do profissional.", 
    fotos: [
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=500",
        "https://images.unsplash.com/photo-1562229125-6d6075419a22?q=80&w=500",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500"
    ] 
  },
  { 
    id: 2, 
    titulo: "Faxina Residencial", 
    local: "Vivendas, Eunápolis", 
    valor: 200.00, 
    data: "Amanhã", 
    tags: ["Completa", "Pet Friendly"], 
    descricao: "Apartamento de 2 quartos. Tenho um cachorro pequeno, mas é dócil.", 
    fotos: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=500",
        "https://images.unsplash.com/photo-1528740561666-dc2479bd08ce?q=80&w=500",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500"
    ] 
  },
  { 
    id: 3, 
    titulo: "Pós-Obra Apartamento", 
    local: "Jardim América, Eunápolis", 
    valor: 450.00, 
    data: "28 Out", 
    tags: ["Pesada"], 
    descricao: "Remoção de respingos de tinta e limpeza fina após reforma de cozinha.", 
    fotos: [
        "https://images.unsplash.com/photo-1584820927498-cdf50e9046f4?q=80&w=500",
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500",
        "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=500"
    ] 
  }
];

const MOCK_NOTIFICACOES = [
  { id: 1, titulo: "Proposta Aceita!", desc: "Seu orçamento foi aprovado.", hora: "10 min", lida: false },
  { id: 2, titulo: "Nova Mensagem", desc: "Carlos enviou uma dúvida no chat.", hora: "1h", lida: true },
];

export default function DashboardProfissional({session}) {
  const [activeTab, setActiveTab] = useState('explorar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('detalhes'); 
  const [selectedServico, setSelectedServico] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // ESTADOS DA PROPOSTA
  const [valorProposta, setValorProposta] = useState(0);
  const [horarioProposta, setHorarioProposta] = useState("08:00");
  const [msgProposta, setMsgProposta] = useState("");

  const abrirServico = (servico) => {
    setSelectedServico(servico);
    setValorProposta(servico.valor);
    setView('detalhes');
    setIsModalOpen(true);
  };

  const enviarPropostaFinal = () => {
    setView('sucesso');
    setTimeout(() => {
        setIsModalOpen(false);
        setView('detalhes');
    }, 2000);
  };

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

      <main className="px-6 -mt-6 relative z-10">
        {activeTab === 'explorar' && (
          <div className="animate-in slide-in-from-bottom-4">
            {/* BUSCA */}
            <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 flex items-center mb-6">
                <Search className="text-slate-400 ml-2" size={20} />
                <input type="text" placeholder="Buscar serviços..." className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium" />
                <button className="bg-slate-100 p-2 rounded-xl text-slate-600"><Filter size={18}/></button>
            </div>

            {/* FILTROS */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {["Todos", "Limpeza", "Vidros", "Pós-Obra", "Jardim"].map(cat => (
                    <button key={cat} className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 whitespace-nowrap active:bg-emerald-600 active:text-white transition-colors shadow-sm">
                        {cat}
                    </button>
                ))}
            </div>

            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Serviços Disponíveis</h3>
            <div className="space-y-4">
              {MOCK_OPORTUNIDADES.map((item) => (
                <div key={item.id} onClick={() => abrirServico(item)} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-base">{item.titulo}</h4>
                    <span className="text-emerald-600 font-black text-lg">R$ {item.valor.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><MapPin size={14} className="text-emerald-500"/> {item.local}</div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <div className="flex gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase">{tag}</span>
                      ))}
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESPAÇO PARA A ABA DE GANHOS */}
        {activeTab === 'ganhos' && (
          <div className="py-10 animate-in fade-in">
             <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight">Relatório Financeiro</h3>
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-bold text-sm mb-2">Total a receber</p>
                <h2 className="text-4xl font-black text-emerald-600 italic">R$ 840,00</h2>
             </div>
          </div>
        )}
      </main>

      {/* MODAL MULTI-VIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[150] flex items-end">
          <div className="bg-white w-full rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom-full duration-300 max-h-[95vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            
            {view === 'detalhes' && (
                <>
                    <div className="mb-2">
                        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{selectedServico?.titulo}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-wider"><MapPin size={12}/> {selectedServico?.local}</p>
                    </div>
                    <div className="bg-emerald-600 p-5 rounded-[2rem] my-6 flex justify-between items-center shadow-md">
                        <div>
                            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-0.5">Preço Sugerido</p>
                            <h2 className="text-3xl font-black text-white leading-none">R$ {selectedServico?.valor.toFixed(2)}</h2>
                        </div>
                        <DollarSign className="text-white opacity-40" size={28} />
                    </div>
                    <button onClick={() => setView('fotos')} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 mb-4 shadow-sm">
                        <div className="flex items-center gap-3"><ImageIcon className="text-slate-400" size={20}/><span className="font-bold text-sm text-slate-800">Ver fotos do local</span></div>
                        <ChevronRight className="text-slate-300" size={20} />
                    </button>
                    <div className="bg-slate-50 p-6 rounded-3xl mb-8">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedServico?.descricao}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setIsModalOpen(false)} fullWidth style={{ color: '#64748b', fontWeight: '900' }}>Voltar</Button>
                        <Button onClick={() => setView('proposta')} fullWidth variant="contained" style={{ backgroundColor: '#10b981', borderRadius: '18px', fontWeight: '900', padding: '16px' }}>Mandar Proposta</Button>
                    </div>
                </>
            )}

            {view === 'fotos' && (
                <div className="pb-4">
                    <button onClick={() => setView('detalhes')} className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase mb-6 tracking-widest"><ChevronLeft size={16}/> Voltar para detalhes</button>
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {selectedServico?.fotos.map((f, i) => <img key={i} src={f} className="w-full h-64 object-cover rounded-[2rem]" />)}
                    </div>
                    <Button onClick={() => setView('detalhes')} fullWidth variant="contained" style={{ backgroundColor: '#10b981', borderRadius: '18px', fontWeight: '900', padding: '16px' }}>Entendi</Button>
                </div>
            )}

            {view === 'proposta' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <button onClick={() => setView('detalhes')} className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase mb-4 tracking-widest"><ChevronLeft size={16}/> Voltar</button>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">Sua Proposta</h3>
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] mb-6 text-center border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Seu valor para o serviço</p>
                        <div className="flex items-center justify-center gap-6">
                            <button onClick={() => setValorProposta(v => Math.max(0, v - 10))} className="p-3 bg-white rounded-full shadow-sm text-slate-400 active:bg-red-50 active:text-red-500 transition-colors"><Minus size={24}/></button>
                            <span className="text-4xl font-black text-slate-800 italic">R$ {valorProposta.toFixed(2)}</span>
                            <button onClick={() => setValorProposta(v => v + 10)} className="p-3 bg-white rounded-full shadow-sm text-slate-400 active:bg-emerald-50 active:text-emerald-500 transition-colors"><Plus size={24}/></button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Horário de Chegada</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                            <input type="time" value={horarioProposta} onChange={(e) => setHorarioProposta(e.target.value)} className="w-full p-5 pl-12 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-700 outline-none" />
                        </div>
                    </div>
                    <div className="mb-8">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Detalhes da Proposta</label>
                        <textarea placeholder="Explique como será seu trabalho..." rows={3} value={msgProposta} onChange={(e) => setMsgProposta(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-sm text-slate-700 outline-none" />
                    </div>
                    <Button onClick={enviarPropostaFinal} fullWidth variant="contained" style={{ backgroundColor: '#10b981', borderRadius: '18px', fontWeight: '900', padding: '18px' }}>
                        <Send size={18} className="mr-2"/> Confirmar Envio
                    </Button>
                </div>
            )}

            {view === 'sucesso' && (
                <div className="py-12 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={48} /></div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Proposta Enviada!</h3>
                    <p className="text-slate-500 font-medium">O cliente receberá sua oferta em instantes.</p>
                </div>
            )}
          </div>
        </div>
      )}

      {/* BARRA INFERIOR */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-8 py-3 z-50 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('explorar')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorar' ? 'text-emerald-600' : 'text-slate-400'}`}><Briefcase size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Explorar</span></button>
        <button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 ${activeTab === 'agenda' ? 'text-emerald-600' : 'text-slate-400'}`}><Calendar size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Agenda</span></button>
        <button onClick={() => setActiveTab('ganhos')} className={`flex flex-col items-center gap-1 ${activeTab === 'ganhos' ? 'text-emerald-600' : 'text-slate-400'}`}><Wallet size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Ganhos</span></button>
        <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 ${activeTab === 'perfil' ? 'text-emerald-600' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span></button>
      </nav>
    </div>
  );
}