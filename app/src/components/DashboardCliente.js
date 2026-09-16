'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import {
  Plus, MapPin, Calendar, ChevronRight, MessageSquare, Search, Filter,
  Home, User, ListTodo, Bell, X, Camera, DollarSign, ChevronLeft, CheckCircle2,
  Clock, CheckCircle, Trash2, Send, Handshake, Settings, LogOut, ShieldCheck,
  HelpCircle, Smartphone, MapPinned, Bookmark
} from "lucide-react";
import { useSession, signOut } from '@/lib/auth-client';
import { Button, Avatar, CircularProgress, Box } from "@mui/material";
import { DEFAULT_ROUTE_SIGN_OUT, ROUTE_API_SERVICOS_CLIENTE, ROUTE_API_SERVICOS_CLIENTE_FOTO } from '@/constants/routes';
import NovoPedidoCliente from '@/components/NovoPedidoCliente'

// --- DADOS FAKE ---
const MOCK_SOLICITACOES = [
  { id: 1, titulo: "Limpeza Pesada - Pós Obra", data: "26/10/2025", horario: "08:00", local: "Centro, Eunápolis", status: "ABERTO", propostas: 4, imagem: "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=400&auto=format&fit=crop" },
  { id: 2, titulo: "Faxina Simples - Apartamento", data: "30/10/2025", horario: "14:00", local: "Jardim América, Eunápolis", status: "AGENDADO", propostas: 1, profissional: "Maria Silva", imagem: "https://images.unsplash.com/photo-1527515637-62b990946016?q=80&w=400&auto=format&fit=crop" }
];

const MOCK_NOTIFICACOES = [
  { id: 1, titulo: "Nova Proposta!", desc: "João Silva enviou uma proposta.", hora: "5 min", lida: false },
  { id: 2, titulo: "Mensagem Recebida", desc: "Maria Silva respondeu no chat.", hora: "2h", lida: true },
];

const MOCK_HISTORICO = [
  { id: 101, titulo: "Limpeza de Vidros", data: "15/10/2025", local: "Vivendas, Eunápolis", status: "CONCLUÍDO", profissional: "Ricardo Souza", valor: "150,00" },
  { id: 102, titulo: "Passar Roupa", data: "10/10/2025", local: "Centro, Eunápolis", status: "CONCLUÍDO", profissional: "Ana Oliveira", valor: "80,00" }
];

const MOCK_CHATS = [
  { id: 1, nome: "Maria Silva", servico: "Limpeza Pesada", ultimaMsg: "Consigo chegar às 08:30, pode ser?", hora: "10:45", foto: "https://i.pravatar.cc/150?u=maria", naoLidas: 2 },
  { id: 2, nome: "Ricardo Souza", servico: "Limpeza de Vidros", ultimaMsg: "Obrigado pela preferência!", hora: "Ontem", foto: "https://i.pravatar.cc/150?u=ricardo", naoLidas: 0 }
];


export default function DashboardCliente({ session }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [subTabPedidos, setSubTabPedidos] = useState('ativos');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const [solicitacoes, setSolicitacoe] = useState();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    ; (async () => {
      try {
        const res = await fetch(ROUTE_API_SERVICOS_CLIENTE, { credentials: 'include' });
        setSolicitacoe(await res.json());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOrderOpen]);

  const closeOrderAction = () => {
    setIsOrderOpen(false);
  };


  const user = session?.user;

  if(!user) {location.replace('/');
    return;
  }

  if (isOrderOpen) {
    return <NovoPedidoCliente closeOrderAction={closeOrderAction} />
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* DRAWER DE NOTIFICAÇÕES */}
      {isNotificationsOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={() => setIsNotificationsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[120] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">Notificações</h2>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_NOTIFICACOES.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl border bg-white border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800">{n.titulo}</h4>
                  <p className="text-xs text-slate-600">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ABA HOME */}
      {activeTab === 'home' && (
        <>
          <header className="bg-indigo-600 pb-12 pt-8 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div><p className="text-indigo-100 text-sm font-medium">Bem-vindo,</p><h1 className="text-2xl font-bold text-white">{user?.name}</h1></div>
              <button onClick={() => setIsNotificationsOpen(true)} className="relative p-2 rounded-full hover:bg-white/10 transition-colors"><Bell className="text-white w-6 h-6" /><span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-indigo-600"></span></button>
            </div>
            <div className="bg-indigo-500/50 backdrop-blur-sm rounded-xl flex items-center px-4 py-2.5 border border-indigo-400/30">
              <Search className="text-indigo-100 w-5 h-5 mr-3" /><input type="text" placeholder="Buscar pedidos..." className="bg-transparent border-none outline-none text-white text-sm w-full" />
            </div>
          </header>
          <main className="px-6 -mt-6 relative z-10">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between mb-8">
              <div><h2 className="font-bold text-slate-800">Precisa de limpeza?</h2><p className="text-xs text-slate-500">Poste e receba orçamentos.</p></div>
              <Button onClick={() => setIsOrderOpen(true)} variant="contained" style={{ backgroundColor: '#4f46e5', borderRadius: '12px', textTransform: 'none', padding: '8px 16px', fontWeight: 'bold' }}>Novo Pedido</Button>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Solicitações Ativas</h2>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1300,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <div className="space-y-4">
              {solicitacoes?.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex active:scale-[0.98] transition-all">
                  <div className="w-24 bg-slate-200"><img src={`${ROUTE_API_SERVICOS_CLIENTE_FOTO}/${item.fotos[0]?.servico_cliente_id}/${item.fotos[0]?.md5}`} className="w-full h-full object-cover" alt="serviço" /></div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-slate-800 text-sm ">{item.titulo} <br/> {new Date(item.data_hora_agendamento).toLocaleDateString()}</h3><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase">Aberto</span></div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50 text-indigo-700 font-bold text-xs"><MessageSquare size={16} />{item.propostas} propostas</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}

      {/* ABA AGENDA */}
      {activeTab === 'agenda' && (
        <div className="animate-in fade-in h-full">
          <header className="bg-white border-b border-slate-100 px-6 pt-8 pb-4 sticky top-0 z-20">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Meus Pedidos</h1>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setSubTabPedidos('ativos')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${subTabPedidos === 'ativos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Ativos</button>
              <button onClick={() => setSubTabPedidos('finalizados')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${subTabPedidos === 'finalizados' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Finalizados</button>
            </div>
          </header>
          <main className="p-6 space-y-4">
            {subTabPedidos === 'ativos' ? solicitacoes.filter((s)=>s.status!='FINALIZADO').map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.status === 'ABERTO' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.status === 'ABERTO' ? <Clock size={20} /> : <CheckCircle size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{item.titulo}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-500">{new Date(item.data_hora_agendamento).toLocaleDateString()}</p>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${item.status === 'ABERTO' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" size={18} />
              </div>
            )) : solicitacoes.filter((s)=>s.status=='FINALIZADOS').map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 opacity-90 flex items-center justify-between">
                <div className="flex items-center gap-4"><div className="p-3 rounded-full bg-slate-100 text-slate-500"><CheckCircle size={20} /></div><div><h3 className="font-bold text-slate-800 text-sm">{item.titulo}</h3><p className="text-[10px] text-slate-500">{item.data_hora_agendamento} • {item.profissional}</p></div></div>
                <span className="text-xs font-bold text-slate-600">R$ {item.valor}</span>
              </div>
            ))}
          </main>
        </div>
      )}

      {/* ABA CHAT */}
      {activeTab === 'chat' && (
        <div className="animate-in fade-in h-full">
          {!activeChat ? (
            <>
              <header className="bg-white border-b border-slate-100 px-6 pt-8 pb-4 sticky top-0 z-20">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mensagens</h1>
              </header>
              <main className="p-4 space-y-3">
                {MOCK_CHATS.map((chat) => (
                  <div key={chat.id} onClick={() => setActiveChat(chat)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer active:scale-95 transition-transform">
                    <Avatar src={chat.foto} sx={{ width: 48, height: 48, borderRadius: '12px' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5"><h3 className="font-bold text-slate-800 text-sm">{chat.nome}</h3><span className="text-[10px] text-slate-400">{chat.hora}</span></div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">{chat.servico}</p>
                      <p className={`text-xs truncate ${chat.naoLidas > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{chat.ultimaMsg}</p>
                    </div>
                  </div>
                ))}
              </main>
            </>
          ) : (
            <div className="fixed inset-0 bg-white z-[150] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                <button onClick={() => setActiveChat(null)} className="p-1 text-slate-400"><ChevronLeft size={24} /></button>
                <Avatar src={activeChat.foto} sx={{ width: 40, height: 40, borderRadius: '10px' }} />
                <div className="flex-1"><h3 className="font-bold text-slate-800 text-sm">{activeChat.nome}</h3><p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div className="mx-auto w-full max-w-[90%] bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm border-t-4 border-t-indigo-600">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-xs uppercase"><Handshake size={16} /> Proposta Recebida</div>
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-black text-slate-800">R$ 180,00</h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold">Recusar</button>
                      <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold">Aceitar Proposta</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-700">{activeChat.ultimaMsg}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                <input type="text" placeholder="Escreva sua mensagem..." className="flex-1 bg-slate-100 rounded-2xl px-4 py-2 text-sm outline-none" />
                <button className="p-3 bg-indigo-600 text-white rounded-full"><Send size={18} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA PERFIL */}
      {activeTab === 'perfil' && (
        <div className="animate-in fade-in h-full bg-slate-50">
          <header className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 flex flex-col items-center">
            <div className="relative mb-4">
              {/* AVATAR MASCULINO CORRETO */}
              <Avatar sx={{ width: 100, height: 100, borderRadius: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} src={`https://ui-avatars.com/api/?name=${session.user.name}`} />
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-4 border-white"><Camera size={16} /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{session.user.name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin size={14} /> Eunápolis, BA</p>
            <button className="mt-4 px-6 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Editar Dados</button>
          </header>

          <main className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Meus Endereços</h3>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center gap-4 border-b border-slate-50 active:bg-slate-50">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Home size={20} /></div>
                  <div className="flex-1"><p className="text-sm font-bold text-slate-800">Casa</p><p className="text-[10px] text-slate-500">Rua das Flores, 123 - Centro</p></div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
                <div className="p-4 flex items-center gap-4 active:bg-slate-50">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Plus size={20} /></div>
                  <p className="text-sm font-bold text-slate-800">Adicionar novo endereço</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Configurações</h3>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {[
                  { icon: <ShieldCheck size={20} />, label: 'Segurança e Senha', color: 'text-emerald-500' },
                  { icon: <HelpCircle size={20} />, label: 'Central de Ajuda', color: 'text-indigo-500' },
                  { icon: <Smartphone size={20} />, label: 'Sobre o App', color: 'text-slate-500' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4 border-b border-slate-50 last:border-0 active:bg-slate-50">
                    <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('text', 'bg')}`}>{item.icon}</div>
                    <p className="text-sm font-bold text-slate-700 flex-1">{item.label}</p>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full p-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm bg-red-50 rounded-2xl border border-red-100 active:scale-95 transition-transform"
              onClick={() => signOut()} >
              <LogOut size={18} /> Sair da Conta
            </button>
            <p className="text-center text-[10px] text-slate-400 font-medium pb-10">Versão 1.0.2 - LimpaTudo Inc.</p>
          </main>
        </div>
      )}

      {/* BARRA INFERIOR */}
      {!activeChat && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-2 z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}><Home size={22} /><span className="text-[10px] font-medium">Início</span></button>
          <button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'agenda' ? 'text-indigo-600' : 'text-slate-400'}`}><ListTodo size={22} /><span className="text-[10px] font-medium">Pedidos</span></button>
          <div className="relative -top-6"><button onClick={() => setIsOrderOpen(true)} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg border-4 border-slate-50 active:scale-90 transition-transform"><Plus size={28} /></button></div>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`}><div className="relative"><MessageSquare size={22} /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span></div><span className="text-[10px] font-medium">Chat</span></button>
          <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'perfil' ? 'text-indigo-600' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px] font-medium">Perfil</span></button>
        </nav>
      )}
    </div>
  );
}