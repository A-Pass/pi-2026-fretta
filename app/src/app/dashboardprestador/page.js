"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, Wallet, User, Bell, RefreshCcw } from "lucide-react";

import ProfileModal from "./ui/ProfileModal";
import NotificationsModal from "./ui/NotificationsModal";
import ServiceFormModal from "./ui/ServiceFormModal";
import ProposalModal from "./ui/ProposalModal";
import ChatModal from "./ui/ChatModal";

/*function toNumberId(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}*/

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      ...(options.headers || {}),
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && data.error) ||
      (data && data.details) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// tenta endpoints alternativos (ex: /api/servico vs /api/servicos)
async function apiFetchTry(urls, options = {}) {
  let lastErr = null;
  for (const u of urls) {
    try {
      return await apiFetch(u, options);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Falha ao buscar dados");
}

function formatDateTimeBR(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export default function DashboardPrestadorPage() {
  const router = useRouter();

  // layout principal (4 abas)
  const [activeTab, setActiveTab] = useState("explorar"); // explorar | agenda | ganhos | perfil

  // sessão
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  // ids derivados
  const userIdRaw = session?.user?.id ?? null;
  const profissionalId = useMemo(() => Id(userIdRaw), [userIdRaw]);

  // feedback
  const [toast, setToast] = useState(null);

  // modais
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openServiceForm, setOpenServiceForm] = useState(false);
  const [serviceFormInitial, setServiceFormInitial] = useState(null);

  const [openProposal, setOpenProposal] = useState(false);
  const [proposalTargetServico, setProposalTargetServico] = useState(null);

  const [openChat, setOpenChat] = useState(false);
  const [chatContext, setChatContext] = useState(null);

  // explorar (demandas)
  const [qExplore, setQExplore] = useState("");
  const [demandasLoading, setDemandasLoading] = useState(false);
  const [demandas, setDemandas] = useState([]);
  const [demandasError, setDemandasError] = useState(null);

  // meus serviços (mantém funcionalidade do novo)
  const [myServicesLoading, setMyServicesLoading] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [myServicesError, setMyServicesError] = useState(null);

  // agenda
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agendaItems, setAgendaItems] = useState([]);
  const [agendaError, setAgendaError] = useState(null);

  // histórico
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  // pessoa
  const [pessoaLoading, setPessoaLoading] = useState(false);
  const [pessoa, setPessoa] = useState(null);
  const [pessoaError, setPessoaError] = useState(null);

  // notificações (badge)
  const [notifsBadge, setNotifsBadge] = useState(0);

  // ===== sessão (better-auth) =====
  useEffect(() => {
    let mounted = true;

    (async () => {
      setSessionLoading(true);
      setSessionError(null);
      try {
        const s = await apiFetch("/api/auth/get-session", { method: "GET" });
        if (!mounted) return;
        setSession(s);
      } catch (e) {
        if (!mounted) return;
        setSessionError(e.message || "Falha ao carregar sessão");
        setSession(null);
      } finally {
        if (!mounted) return;
        setSessionLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ===== carregar dados por aba =====
  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) return;

    if (!profissionalId) {
      setToast({
        type: "error",
        message:
          "ID de profissional inválido. Verifique se sua conta está corretamente configurada como prestador de serviços.",
      });
      return;
    }

    if (activeTab === "explorar") loadDemandas();
    if (activeTab === "agenda") loadAgenda();
    if (activeTab === "ganhos") {
      // ganhos depende de agenda + histórico
      loadAgenda();
      loadHistory();
    }
    if (activeTab === "perfil") {
      loadPessoa();
      loadMyServices();
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sessionLoading, session?.user?.id]);

  // ===== notificações badge (best effort) =====
  useEffect(() => {
    if (!profissionalId) return;
    let mounted = true;

    (async () => {
      try {
        const list = await apiFetchTry(
          [
            `/api/notificacoes?pessoa_id=${profissionalId}`,
            `/api/notificacoes?usuario_id=${profissionalId}`,
            `/api/notificacoes/${profissionalId}`,
          ],
          { method: "GET" }
        );

        const arr = Array.isArray(list) ? list : Array.isArray(list?.items) ? list.items : [];
        const unread = arr.filter((n) => n && (n.lida === false || n.lido === false)).length;
        if (mounted) setNotifsBadge(unread);
      } catch {
        if (mounted) setNotifsBadge(0);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [profissionalId, openNotifications]);

  async function loadDemandas() {
    setDemandasLoading(true);
    setDemandasError(null);
    try {
      const base1 = `/api/servico?status=ABERTO&cliente=1&fotos=1${qExplore ? `&q=${encodeURIComponent(qExplore)}` : ""}`;
      const base2 = `/api/servicos?status=ABERTO${qExplore ? `&q=${encodeURIComponent(qExplore)}` : ""}`;

      const list = await apiFetchTry([base1, base2], { method: "GET" });
      setDemandas(Array.isArray(list) ? list : []);
    } catch (e) {
      setDemandasError(e.message || "Falha ao carregar demandas");
      setDemandas([]);
    } finally {
      setDemandasLoading(false);
    }
  }

  async function loadMyServices() {
    if (!profissionalId) return;
    setMyServicesLoading(true);
    setMyServicesError(null);
    try {
      const list = await apiFetch(`/api/profissionais_servicos?profissional_id=${profissionalId}`, { method: "GET" });
      setMyServices(Array.isArray(list) ? list : []);
    } catch (e) {
      setMyServicesError(e.message || "Falha ao carregar seus serviços");
      setMyServices([]);
    } finally {
      setMyServicesLoading(false);
    }
  }

  function getRangeNext30Days() {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return { de: start.toISOString(), ate: end.toISOString() };
  }

  async function loadAgenda() {
    if (!profissionalId) return;
    setAgendaLoading(true);
    setAgendaError(null);
    try {
      const { de, ate } = getRangeNext30Days();
      const list = await apiFetch(
        `/api/agendamentos?profissional_id=${profissionalId}&include=1&de=${encodeURIComponent(de)}&ate=${encodeURIComponent(ate)}`,
        { method: "GET" }
      );
      setAgendaItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setAgendaError(e.message || "Falha ao carregar agenda");
      setAgendaItems([]);
    } finally {
      setAgendaLoading(false);
    }
  }

  async function loadHistory() {
    if (!profissionalId) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const finalizados = await apiFetch(
        `/api/agendamentos?profissional_id=${profissionalId}&include=1&status=FINALIZADO`,
        { method: "GET" }
      );
      const cancelados = await apiFetch(
        `/api/agendamentos?profissional_id=${profissionalId}&include=1&status=CANCELADO`,
        { method: "GET" }
      );

      const all = [
        ...(Array.isArray(finalizados) ? finalizados : []),
        ...(Array.isArray(cancelados) ? cancelados : []),
      ].sort((a, b) => {
        const da = new Date(a.data_hora_agendamento || 0).getTime();
        const db = new Date(b.data_hora_agendamento || 0).getTime();
        return db - da;
      });

      setHistoryItems(all);
    } catch (e) {
      setHistoryError(e.message || "Falha ao carregar histórico");
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function loadPessoa() {
    if (!profissionalId) return;
    setPessoaLoading(true);
    setPessoaError(null);
    try {
      const data = await apiFetch(`/api/pessoas/${profissionalId}`, { method: "GET" });
      setPessoa(data);
    } catch (e) {
      setPessoaError((e.message || "Falha ao carregar pessoa") + " (Se /api/pessoas/[id] estiver quebrado no back-end, precisa corrigir.)");
      setPessoa(null);
    } finally {
      setPessoaLoading(false);
    }
  }

  // ===== ações =====
  async function handleCreateOrUpdateService(payload, id = null) {
    if (!profissionalId) throw new Error("profissionalId inválido");
    const body = id ? payload : { ...payload, profissional_pessoa_id: profissionalId };

    const url = id ? `/api/profissionais_servicos/${id}` : `/api/profissionais_servicos`;
    const method = id ? "PUT" : "POST";

    await apiFetch(url, { method, body: JSON.stringify(body) });
    setToast({ type: "success", message: id ? "Serviço atualizado" : "Serviço criado" });
    await loadMyServices();
  }

  async function handleDeleteService(id) {
    await apiFetch(`/api/profissionais_servicos/${id}`, { method: "DELETE" });
    setToast({ type: "success", message: "Serviço removido" });
    await loadMyServices();
  }

  async function handleSendProposal({ servico_cliente_id, valor_proposta, texto_proposta, cliente_id }) {
    if (!profissionalId) throw new Error("profissionalId inválido");

    await apiFetch(`/api/propostas`, {
      method: "POST",
      body: JSON.stringify({
        servico_cliente_id,
        profissional_pessoa_id: profissionalId,
        valor_proposta,
        texto_proposta,
      }),
    });

    // opcional: notificar cliente
    if (cliente_id) {
      try {
        await apiFetch(`/api/notificacoes`, {
          method: "POST",
          body: JSON.stringify({
            pessoa_id: cliente_id,
            titulo: "Nova proposta recebida",
            descricao: "Um profissional enviou uma proposta para sua demanda.",
          }),
        });
      } catch {
        // não bloqueia
      }
    }

    setToast({ type: "success", message: "Proposta enviada" });
  }

  async function updateAgendamento(compositeId, payload) {
    await apiFetch(`/api/agendamentos/${compositeId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setToast({ type: "success", message: "Agendamento atualizado" });
    await loadAgenda();
    await loadHistory();
  }

  function openChatForServico(servico) {
    if (!servico?.id || !profissionalId) {
      setToast({ type: "error", message: "Não foi possível abrir o chat (IDs ausentes)." });
      return;
    }
    setChatContext({
      servico_cliente_id: (servico.id),
      profissional_pessoa_id: profissionalId,
      titulo: servico.titulo || `Serviço #${servico.id}`,
    });
    setOpenChat(true);
  }

  function openChatForItem(item) {
    const servicoId =
      item?.proposta_servico_cliente_id ??
      item?.proposta?.servico_cliente_id ??
      item?.proposta?.demanda?.id;

    if (!servicoId || !profissionalId) {
      setToast({ type: "error", message: "Não foi possível abrir o chat (IDs ausentes)." });
      return;
    }

    setChatContext({
      servico_cliente_id: (servicoId),
      profissional_pessoa_id: profissionalId,
      titulo:
        item?.proposta?.demanda?.titulo ||
        item?.proposta?.demanda?.descricao ||
        `Serviço #${servicoId}`,
    });
    setOpenChat(true);
  }

  async function handleRefreshAll() {
    setToast(null);
    if (!session?.user || !profissionalId) return;
    await Promise.allSettled([loadDemandas(), loadMyServices(), loadAgenda(), loadHistory(), loadPessoa()]);
  }

  // ===== Ganhos (simples) =====
  const ganhosResumo = useMemo(() => {
    const all = [...(agendaItems || []), ...(historyItems || [])];

    const finalizados = all.filter((a) => String(a?.status || "").toUpperCase() === "FINALIZADO");
    const total = finalizados.reduce((acc, a) => {
      const v = a?.preco_negociado ?? a?.proposta?.valor_proposta ?? 0;
      const n = Number(v);
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);

    const qtd = finalizados.length;

    return { total, qtd, finalizados: finalizados.slice(0, 20) };
  }, [agendaItems, historyItems]);

  // ===== UI =====
  const nomeHeader =
    session?.user?.name ||
    [pessoa?.primeiro_nome, pessoa?.ultimo_nome].filter(Boolean).join(" ") ||
    (session?.user?.email ? session.user.email.split("@")[0] : "Prestador");

  const photoUrl = pessoa?.foto_perfil || "/img/default-avatar.png";

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-600">Carregando sessão...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="text-lg font-semibold text-slate-900">Você não está autenticado</div>
          <div className="mt-2 text-sm text-slate-600">
            {sessionError || "Faça login para acessar o dashboard."}
          </div>
          <button
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={() => router.push("/auth/login")}
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      {/* Header verde (layout antigo) */}
      <header className="bg-emerald-600 pb-10 pt-8 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={photoUrl}
              alt="Perfil"
              className="h-12 w-12 rounded-2xl object-cover border border-white/30 bg-white/10"
              onError={(e) => {
                e.currentTarget.src = "/img/default-avatar.png";
              }}
            />
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Olá, {nomeHeader}
              </h1>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">
                Painel Profissional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              className="bg-white/10 p-2.5 rounded-xl text-white"
              title="Recarregar"
            >
              <RefreshCcw size={20} />
            </button>

            <button
              onClick={() => setOpenNotifications(true)}
              className="relative bg-white/10 p-2.5 rounded-xl text-white"
              title="Notificações"
            >
              <Bell size={22} />
              {notifsBadge > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[14px] h-[14px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {notifsBadge}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Toast no topo */}
        {toast && (
          <div className="mt-4 rounded-2xl bg-white/10 p-3 text-xs text-white/90">
            <div className="flex items-start justify-between gap-3">
              <div className={toast.type === "error" ? "text-rose-100" : "text-emerald-50"}>
                {toast.message}
              </div>
              <button className="text-white/70 hover:text-white" onClick={() => setToast(null)}>
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <main className="px-6 -mt-6 relative z-10">
        {/* EXPLORAR */}
        {activeTab === "explorar" && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-900">Demandas abertas</div>
                  <div className="text-sm text-slate-600">Buscar demandas e enviar propostas.</div>
                </div>

                <div className="flex gap-2">
                  <input
                    value={qExplore}
                    onChange={(e) => setQExplore(e.target.value)}
                    placeholder="Buscar por título/descrição..."
                    className="h-10 w-full sm:w-80 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    onClick={() => loadDemandas()}
                    className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
                    disabled={demandasLoading}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            {demandasError && (
              <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700">
                {demandasError}
              </div>
            )}

            {demandasLoading ? (
              <div className="text-sm text-slate-600">Carregando...</div>
            ) : demandas.length === 0 ? (
              <div className="text-sm text-slate-600">Nenhuma demanda encontrada.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {demandas.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-slate-900">{d.titulo}</div>
                        <div className="mt-1 text-sm text-slate-600 line-clamp-2">{d.descricao}</div>
                        <div className="mt-2 text-xs text-slate-500">
                          Criado em: {formatDateTimeBR(d.criado_em)} • Status: {d.status}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                          onClick={() => {
                            setProposalTargetServico(d);
                            setOpenProposal(true);
                          }}
                        >
                          Enviar proposta
                        </button>

                        <button
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                          onClick={() => openChatForServico(d)}
                        >
                          Abrir chat
                        </button>
                      </div>
                    </div>

                    {Array.isArray(d.fotos) && d.fotos.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto">
                        {d.fotos
                          .slice()
                          .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                          .map((f) => (
                            <img
                              key={f.md5 || f.id || `${f.uri_img}-${f.ordem ?? 0}`}
                              src={f.uri_img}
                              alt="Foto"
                              className="h-16 w-24 rounded-xl object-cover border border-slate-200"
                            />
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AGENDA */}
        {activeTab === "agenda" && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">Agenda (próximos 30 dias)</div>
                  <div className="text-sm text-slate-600">Confirmar, reagendar, finalizar ou cancelar.</div>
                </div>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  onClick={() => loadAgenda()}
                >
                  Atualizar
                </button>
              </div>
            </div>

            {agendaError && (
              <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700">
                {agendaError}
              </div>
            )}

            {agendaLoading ? (
              <div className="text-sm text-slate-600">Carregando...</div>
            ) : agendaItems.length === 0 ? (
              <div className="text-sm text-slate-600">Nenhum agendamento no período.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {agendaItems.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-slate-900">
                          {a?.proposta?.demanda?.titulo || `Serviço #${a.proposta_servico_cliente_id}`}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Cliente:{" "}
                          {a?.proposta?.demanda?.cliente?.primeiro_nome
                            ? `${a.proposta.demanda.cliente.primeiro_nome} ${a.proposta.demanda.cliente.ultimo_nome || ""}`
                            : "—"}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Data: {formatDateTimeBR(a.data_hora_agendamento)} • Status: {a.status} • Preço: {a.preco_negociado ?? "-"}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                          onClick={() => openChatForItem(a)}
                        >
                          Chat
                        </button>

                        {a.status === "SOLICITADO" && (
                          <button
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            onClick={() => updateAgendamento(a.id, { status: "CONFIRMADO" })}
                          >
                            Confirmar
                          </button>
                        )}

                        {a.status !== "CANCELADO" && a.status !== "FINALIZADO" && (
                          <>
                            <button
                              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                              onClick={() => {
                                const iso = prompt(
                                  "Nova data/hora (ISO). Ex: 2026-01-27T14:00:00.000Z",
                                  new Date(a.data_hora_agendamento || Date.now()).toISOString()
                                );
                                if (!iso) return;
                                updateAgendamento(a.id, { data_hora_agendamento: iso });
                              }}
                            >
                              Reagendar
                            </button>

                            <button
                              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                              onClick={() => updateAgendamento(a.id, { status: "FINALIZADO" })}
                            >
                              Finalizar
                            </button>

                            <button
                              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              onClick={() => updateAgendamento(a.id, { status: "CANCELADO" })}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GANHOS */}
        {activeTab === "ganhos" && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">Ganhos</div>
                  <div className="text-sm text-slate-600">Resumo com base nos agendamentos FINALIZADOS.</div>
                </div>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  onClick={() => {
                    loadAgenda();
                    loadHistory();
                  }}
                >
                  Atualizar
                </button>
              </div>
            </div>

            {(agendaError || historyError) && (
              <div className="rounded-2xl border border-amber-200 bg-white p-4 text-sm text-amber-800">
                {[agendaError, historyError].filter(Boolean).join(" • ")}
              </div>
            )}

            {(agendaLoading || historyLoading) ? (
              <div className="text-sm text-slate-600">Carregando...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500 font-black uppercase tracking-widest">Total recebido</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                      R$ {ganhosResumo.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500 font-black uppercase tracking-widest">Finalizados</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">{ganhosResumo.qtd}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-base font-semibold text-slate-900">Últimos finalizados</div>
                  <div className="mt-3 space-y-3">
                    {ganhosResumo.finalizados.length === 0 ? (
                      <div className="text-sm text-slate-600">Sem finalizados ainda.</div>
                    ) : (
                      ganhosResumo.finalizados.map((a) => {
                        const v = a?.preco_negociado ?? a?.proposta?.valor_proposta ?? 0;
                        return (
                          <div key={`g-${a.id}`} className="rounded-xl border border-slate-200 p-3">
                            <div className="font-semibold text-slate-900">
                              {a?.proposta?.demanda?.titulo || `Serviço #${a.proposta_servico_cliente_id}`}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Data: {formatDateTimeBR(a.data_hora_agendamento)} • Valor: {v ?? "-"}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* PERFIL */}
        {activeTab === "perfil" && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-base font-semibold text-slate-900">Perfil</div>
                  <div className="text-sm text-slate-600">Dados do usuário, serviços e histórico.</div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    onClick={() => setOpenProfile(true)}
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>

            {pessoaError && (
              <div className="rounded-2xl border border-amber-200 bg-white p-4 text-sm text-amber-800">
                {pessoaError}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div><b>Nome:</b> {pessoa?.primeiro_nome ? `${pessoa.primeiro_nome} ${pessoa.ultimo_nome || ""}` : (session?.user?.name || "-")}</div>
              <div><b>Email:</b> {session?.user?.email || "-"}</div>
              <div><b>ID (sessão):</b> {String(userIdRaw)}</div>
              <div><b>ID numérico usado nas APIs:</b> {profissionalId ?? "N/A"}</div>
            </div>

            {/* Meus Serviços (mantém funcionalidade do novo) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">Meus serviços</div>
                  <div className="text-sm text-slate-600">Cadastrar, editar e remover serviços.</div>
                </div>

                <button
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  onClick={() => {
                    setServiceFormInitial(null);
                    setOpenServiceForm(true);
                  }}
                >
                  Novo serviço
                </button>
              </div>

              {myServicesError && (
                <div className="mt-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700">
                  {myServicesError}
                </div>
              )}

              <div className="mt-3">
                {myServicesLoading ? (
                  <div className="text-sm text-slate-600">Carregando...</div>
                ) : myServices.length === 0 ? (
                  <div className="text-sm text-slate-600">Você ainda não cadastrou serviços.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {myServices.map((s) => (
                      <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-semibold text-slate-900">{s.titulo}</div>
                            <div className="mt-1 text-sm text-slate-600 line-clamp-2">{s.descricao}</div>
                            <div className="mt-2 text-xs text-slate-500">
                              Preço base: {s.preco_base ?? "-"} • {s.excluido_em ? "Excluído" : "Ativo"}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                              onClick={() => {
                                setServiceFormInitial(s);
                                setOpenServiceForm(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              onClick={() => handleDeleteService(s.id)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Histórico (mantém funcionalidade do novo) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">Histórico</div>
                  <div className="text-sm text-slate-600">Finalizados e cancelados.</div>
                </div>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  onClick={() => loadHistory()}
                >
                  Atualizar
                </button>
              </div>

              {historyError && (
                <div className="mt-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700">
                  {historyError}
                </div>
              )}

              <div className="mt-3">
                {historyLoading ? (
                  <div className="text-sm text-slate-600">Carregando...</div>
                ) : historyItems.length === 0 ? (
                  <div className="text-sm text-slate-600">Sem itens no histórico.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {historyItems.map((a) => (
                      <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              {a?.proposta?.demanda?.titulo || `Serviço #${a.proposta_servico_cliente_id}`}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              Data: {formatDateTimeBR(a.data_hora_agendamento)} • Status: {a.status}
                            </div>
                          </div>

                          <button
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                            onClick={() => openChatForItem(a)}
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logout */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <button
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                onClick={() => router.push("/api/auth/sign-out")}
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Barra inferior (layout antigo) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-8 py-3 z-40 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavButton
          label="Explorar"
          icon={<Briefcase size={22} />}
          active={activeTab === "explorar"}
          onClick={() => setActiveTab("explorar")}
        />
        <NavButton
          label="Agenda"
          icon={<Calendar size={22} />}
          active={activeTab === "agenda"}
          onClick={() => setActiveTab("agenda")}
        />
        <NavButton
          label="Ganhos"
          icon={<Wallet size={22} />}
          active={activeTab === "ganhos"}
          onClick={() => setActiveTab("ganhos")}
        />
        <NavButton
          label="Perfil"
          icon={<User size={22} />}
          active={activeTab === "perfil"}
          onClick={() => setActiveTab("perfil")}
        />
      </nav>

      {/* Modais */}
      <NotificationsModal
        open={openNotifications}
        onClose={() => setOpenNotifications(false)}
        pessoaId={profissionalId}
      />

      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        sessionUser={session?.user}
        pessoaId={profissionalId}
        pessoaData={pessoa}
        onSaved={async () => {
          await loadPessoa();
          setToast({ type: "success", message: "Perfil atualizado" });
        }}
      />

      <ServiceFormModal
        open={openServiceForm}
        onClose={() => setOpenServiceForm(false)}
        initial={serviceFormInitial}
        onSubmit={async (payload) => {
          await handleCreateOrUpdateService(payload, serviceFormInitial?.id ?? null);
          setOpenServiceForm(false);
        }}
      />

      <ProposalModal
        open={openProposal}
        onClose={() => setOpenProposal(false)}
        servico={proposalTargetServico}
        onSubmit={async (payload) => {
          await handleSendProposal(payload);
          setOpenProposal(false);
        }}
      />

      <ChatModal
        open={openChat}
        onClose={() => setOpenChat(false)}
        context={chatContext}
      />
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 ${active ? "text-emerald-600" : "text-slate-400"}`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}
