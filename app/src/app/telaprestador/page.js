// app/telaprestador/page.js
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Briefcase, Calendar, Wallet, User, Bell, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import ExplorarSection from "./sections/ExplorarSection";
import AgendaSection from "./sections/AgendaSection";
import GanhosSection from "./sections/GanhoSection";
import PerfilSection from "./sections/PerfilSection";

import ModalBase from "@/components/ModalBase";
import ModalAgendamento from "@/components/ModalAgendamento";
import ModalServico from "@/components/ModalServico";
import ModalEditarPerfil from "@/components/ModalEditarPerfil";

/* ================= Utils ================= */

function toPtDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { data: "--/--/----", hora: "--:--" };
  const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { data, hora };
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
function startOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}
function subMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - n);
  return d;
}

// ✅ delimiter seguro (UUID tem "-"; "::" normalmente não)
const ID_SEP = "::";
function compositeId(servicoId, profissionalId) {
  return `${String(servicoId)}${ID_SEP}${String(profissionalId)}`;
}
function splitCompositeId(idComposto) {
  const [servicoId, profissionalId] = String(idComposto || "").split(ID_SEP);
  return { servicoId: servicoId || null, profissionalId: profissionalId || null };
}

/* ================= Local UI state persist ================= */

const LS_KEY = "prestador_ui_state_v2";
function loadUiState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveUiState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

/* ================= Local MOCK store ================= */

function initMockStore() {
  const now = new Date();
  const iso = (d) => new Date(d).toISOString();

  const usuario = {
    id: "usr_mock_1",
    email: "prestador@mock.com",
    pessoa_id: "pessoa_mock_10",
    pessoa: { primeiro_nome: "Daniel", ultimo_nome: "Prestador", cpf: "000.000.000-00", celular: "(00) 00000-0000" },
    telefone: "(00) 00000-0000",
    bio: "Profissional dedicado. Atendimento rápido.",
    foto_perfil: "/img/default-avatar.png",
  };

  const servicos = [
    {
      id: "serv_101",
      titulo: "Limpeza residencial",
      descricao: "Apartamento 2 quartos. Produtos básicos no local.",
      valor_oferecido: 120,
      endereco: "Centro",
      cliente: { primeiro_nome: "Ana", ultimo_nome: "Silva", foto_perfil: "/img/cliente-placeholder.png" },
      fotos: [{ url: "/img/cliente-placeholder.png" }],
      propostas: [],
      status: "ABERTO",
    },
    {
      id: "serv_102",
      titulo: "Passar roupas",
      descricao: "Cesta grande (aprox. 40 peças).",
      valor_oferecido: 90,
      endereco: "Bairro Novo",
      cliente: { primeiro_nome: "Bruno", ultimo_nome: "Lima", foto_perfil: "/img/cliente-placeholder.png" },
      fotos: [],
      propostas: [],
      status: "ABERTO",
    },
    {
      id: "serv_103",
      titulo: "Faxina pesada pós-obra",
      descricao: "Sala + cozinha. Remover poeira e resíduos leves.",
      valor_oferecido: 220,
      endereco: "Vila Verde",
      cliente: { primeiro_nome: "Carla", ultimo_nome: "Souza", foto_perfil: "/img/cliente-placeholder.png" },
      fotos: [],
      propostas: [{ profissional_pessoa_id: "pessoa_mock_10" }],
      status: "ABERTO",
    },
  ];

  const propostas = [
    {
      id: "prop_501",
      servico_cliente_id: "serv_103",
      profissional_pessoa_id: "pessoa_mock_10",
      valor_proposta: 240,
      texto_proposta: "Posso ir amanhã de manhã.",
      demanda: { id: "serv_103", titulo: "Faxina pesada pós-obra" },
    },
  ];

  const agId = compositeId("serv_103", "pessoa_mock_10");
  const agendamentos = {
    [agId]: {
      id: agId,
      status: "PENDENTE",
      data_hora_agendamento: iso(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)),
      preco_negociado: 240,
      avaliacao: null,
    },
  };

  const notificacoes = [
    { id: "not_1", titulo: "Bem-vindo!", mensagem: "", lida: false, criado_em: iso(now) },
    {
      id: "not_2",
      titulo: "Dica",
      mensagem: "Envie uma proposta em Explorar para aparecer na Agenda.",
      lida: false,
      criado_em: iso(new Date(now.getTime() - 60 * 60 * 1000)),
    },
  ];

  return { usuario, servicos, propostas, agendamentos, notificacoes, nextPropostaId: 600, nextNotificacaoId: 3, nextAvaliacaoId: 1 };
}

/* ================= Page ================= */

export default function TelaPrestadorPage() {
  const router = useRouter();

  const mockStoreRef = useRef(null);
  if (!mockStoreRef.current) mockStoreRef.current = initMockStore();

  const [activeTab, setActiveTab] = useState("explorar");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  const [servicos, setServicos] = useState([]);
  const [carregandoServicos, setCarregandoServicos] = useState(false);

  const [propostas, setPropostas] = useState([]);
  const [carregandoPropostas, setCarregandoPropostas] = useState(false);

  const [agendamentosRaw, setAgendamentosRaw] = useState([]);
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);

  const [notificacoes, setNotificacoes] = useState([]);
  const [carregandoNotificacoes, setCarregandoNotificacoes] = useState(false);

  const [agendaPeriodo, setAgendaPeriodo] = useState("mes");
  const [agendaStatus, setAgendaStatus] = useState("todos");
  const [agendaBusca, setAgendaBusca] = useState("");

  const didInitRef = useRef(false);
  const pessoaId = usuarioAtual?.pessoa_id ?? null;

  const naoLidas = useMemo(() => notificacoes.filter((n) => !n.lida).length, [notificacoes]);

  /* ================= Helpers (MOCK) ================= */

  const addNotificacao = useCallback((titulo, mensagem) => {
    const st = mockStoreRef.current;
    const nova = {
      id: `not_${st.nextNotificacaoId++}`,
      titulo,
      mensagem,
      lida: false,
      criado_em: new Date().toISOString(),
    };
    st.notificacoes.unshift(nova);
    setNotificacoes(st.notificacoes.map((n) => ({ ...n })));
  }, []);

  /* ================= Carregamentos (MOCK) ================= */

  const carregarUsuarioAtual = useCallback(async () => {
    setCarregandoUsuario(true);
    try {
      let id = null;
      try {
        id = localStorage.getItem("usuario_id");
      } catch {}

      if (!id) {
        try {
          localStorage.setItem("usuario_id", mockStoreRef.current.usuario.id);
          id = mockStoreRef.current.usuario.id;
        } catch {
          id = mockStoreRef.current.usuario.id;
        }
      }

      const st = mockStoreRef.current;
      if (String(id) !== String(st.usuario.id)) {
        // não exibe erro pro usuário final; apenas manda pro login
        router.push("/login");
        return;
      }

      setUsuarioAtual({ ...st.usuario, pessoa: { ...(st.usuario.pessoa || {}) } });
    } finally {
      setCarregandoUsuario(false);
    }
  }, [router]);

  const carregarServicosAbertos = useCallback(async () => {
    setCarregandoServicos(true);
    try {
      const st = mockStoreRef.current;
      const list = (st.servicos || []).filter((s) => (s.status || "ABERTO") === "ABERTO");
      setServicos(list.map((s) => ({ ...s, propostas: Array.isArray(s.propostas) ? [...s.propostas] : [] })));
    } finally {
      setCarregandoServicos(false);
    }
  }, []);

  const carregarPropostasDoPrestador = useCallback(async () => {
    if (!pessoaId) return;
    setCarregandoPropostas(true);
    try {
      const st = mockStoreRef.current;
      const list = (st.propostas || []).filter((p) => String(p.profissional_pessoa_id) === String(pessoaId));
      setPropostas(list.map((p) => ({ ...p, demanda: p.demanda ? { ...p.demanda } : null })));
    } finally {
      setCarregandoPropostas(false);
    }
  }, [pessoaId]);

  const carregarAgendamentos = useCallback(async () => {
    if (!pessoaId) return;

    setCarregandoAgendamentos(true);
    try {
      const st = mockStoreRef.current;

      const servCache = new Map();
      const getServico = (id) => {
        if (servCache.has(id)) return servCache.get(id);
        const s = (st.servicos || []).find((x) => String(x.id) === String(id)) || null;
        servCache.set(id, s);
        return s;
      };

      const propCache = new Map();
      for (const p of st.propostas || []) {
        const k = compositeId(p.servico_cliente_id ?? p.demanda?.id, p.profissional_pessoa_id);
        propCache.set(k, p);
      }

      const rows = [];
      for (const ag of Object.values(st.agendamentos || {})) {
        const { servicoId, profissionalId } = splitCompositeId(ag?.id);
        if (!servicoId || String(profissionalId) !== String(pessoaId)) continue;

        const servicoDetalhe = getServico(servicoId);
        const proposta = propCache.get(ag.id) || null;

        rows.push({
          id: ag.id,
          agendamento: { ...ag },
          proposta: proposta ? { ...proposta } : null,
          servicoDetalhe: servicoDetalhe ? { ...servicoDetalhe } : null,
        });
      }

      setAgendamentosRaw(rows);
    } finally {
      setCarregandoAgendamentos(false);
    }
  }, [pessoaId]);

  const carregarNotificacoes = useCallback(async () => {
    setCarregandoNotificacoes(true);
    try {
      const st = mockStoreRef.current;
      setNotificacoes((st.notificacoes || []).map((n) => ({ ...n })));
    } finally {
      setCarregandoNotificacoes(false);
    }
  }, []);

  /* ================= UI state persist ================= */

  useEffect(() => {
    const s = loadUiState();
    if (s?.activeTab) setActiveTab(s.activeTab);
    if (s?.agendaPeriodo) setAgendaPeriodo(s.agendaPeriodo);
    if (s?.agendaStatus) setAgendaStatus(s.agendaStatus);
    if (typeof s?.agendaBusca === "string") setAgendaBusca(s.agendaBusca);
    didInitRef.current = true;
  }, []);

  useEffect(() => {
    if (!didInitRef.current) return;
    saveUiState({ activeTab, agendaPeriodo, agendaStatus, agendaBusca });
  }, [activeTab, agendaPeriodo, agendaStatus, agendaBusca]);

  /* ================= Inicial ================= */

  useEffect(() => {
    carregarUsuarioAtual();
  }, [carregarUsuarioAtual]);

  useEffect(() => {
    if (!pessoaId) return;
    carregarPropostasDoPrestador();
  }, [pessoaId, carregarPropostasDoPrestador]);

  useEffect(() => {
    if (activeTab === "explorar") carregarServicosAbertos();
    if (activeTab === "agenda" || activeTab === "ganhos") carregarAgendamentos();
  }, [activeTab, carregarServicosAbertos, carregarAgendamentos]);

  useEffect(() => {
    if (!notificationsOpen) return;
    carregarNotificacoes();
  }, [notificationsOpen, carregarNotificacoes]);

  /* ================= Mapeamentos p/ UI ================= */

  const servicosDisponiveis = useMemo(() => {
    if (!pessoaId) return servicos || [];

    const proposed = new Set(
      (servicos || []).flatMap((s) =>
        Array.isArray(s.propostas)
          ? s.propostas
              .filter((p) => String(p.profissional_pessoa_id) === String(pessoaId))
              .map(() => String(s.id))
          : []
      )
    );

    return (servicos || []).filter((s) => !proposed.has(String(s.id)));
  }, [servicos, pessoaId]);

  const agendamentos = useMemo(() => {
    return (agendamentosRaw || []).map((row) => {
      const ag = row.agendamento || {};
      const s = row.servicoDetalhe || row.proposta?.demanda || {};
      const dtIso = ag.data_hora_agendamento || ag.data_hora || ag.data_hora_contratacao || null;

      const { data, hora } = dtIso ? toPtDateTime(dtIso) : { data: "--/--/----", hora: "--:--" };

      const cliente =
        s?.cliente
          ? `${s.cliente.primeiro_nome ?? ""} ${s.cliente.ultimo_nome ?? ""}`.trim() || "Cliente"
          : "Cliente";

      const fotoCliente = s?.cliente?.foto_perfil || "/img/cliente-placeholder.png";
      const valor = Number(ag.preco_negociado ?? row.proposta?.valor_proposta ?? s.valor_oferecido ?? 0) || 0;
      const status = String(ag.status ?? "pendente").toLowerCase();

      const avaliacao = ag.avaliacao || null;

      return {
        id: row.id,
        status,
        data_hora: dtIso,
        data,
        hora,
        cliente,
        fotoCliente,
        servico: s.titulo ?? "Serviço",
        local: s.endereco ?? s.local ?? "Endereço não informado",
        valor,
        descricao: s.descricao ?? "",
        avaliacao,
        raw: row,
      };
    });
  }, [agendamentosRaw]);

  const agendaContadores = useMemo(() => {
    const base = { todos: agendamentos.length, pendente: 0, concluido: 0, cancelado: 0 };
    for (const a of agendamentos) {
      const s = (a.status || "").toLowerCase();
      if (s in base) base[s] += 1;
    }
    return base;
  }, [agendamentos]);

  const agendamentosFiltrados = useMemo(() => {
    const now = new Date();
    let start = null;
    let end = null;

    if (agendaPeriodo === "dia") {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (agendaPeriodo === "mes") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else if (agendaPeriodo === "2meses") {
      start = startOfDay(subMonths(now, 2));
      end = endOfDay(now);
    } else if (agendaPeriodo === "3meses") {
      start = startOfDay(subMonths(now, 3));
      end = endOfDay(now);
    }

    const busca = (agendaBusca || "").trim().toLowerCase();

    return agendamentos
      .filter((a) => {
        if (agendaStatus !== "todos") {
          if ((a.status || "").toLowerCase() !== agendaStatus) return false;
        }

        if (start && end && a.data_hora) {
          const d = new Date(a.data_hora);
          if (!Number.isNaN(d.getTime())) {
            if (d < start || d > end) return false;
          }
        }

        if (busca) {
          const hay = `${a.cliente || ""} ${a.servico || ""}`.toLowerCase();
          if (!hay.includes(busca)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.data_hora || 0).getTime();
        const db = new Date(b.data_hora || 0).getTime();
        return da - db;
      });
  }, [agendamentos, agendaPeriodo, agendaStatus, agendaBusca]);

  /* ================= Ações (MOCK) ================= */

  function abrirServico(servico) {
    setModal({ tipo: "servico", dados: servico });
  }
  function abrirAgendamento(agendamento) {
    setModal({ tipo: "agendamento", dados: agendamento });
  }
  function abrirEditarPerfil() {
    setModal({ tipo: "perfil", dados: usuarioAtual });
  }
  function fecharModal() {
    setModal(null);
  }

  async function enviarProposta({ servico, valor, dataSugerida, mensagem }) {
    if (!pessoaId) return;

    const st = mockStoreRef.current;

    const textoBase = (mensagem || "").trim() || "Proposta enviada.";
    const texto = dataSugerida ? `${textoBase}\nData sugerida: ${dataSugerida}` : textoBase;

    const nova = {
      id: `prop_${st.nextPropostaId++}`,
      servico_cliente_id: servico.id,
      profissional_pessoa_id: pessoaId,
      valor_proposta: Number(valor ?? servico.valor_oferecido ?? 0),
      texto_proposta: texto,
      demanda: { id: servico.id, titulo: servico.titulo },
    };

    st.propostas.push(nova);

    // marca serviço como "já proposto"
    const s = st.servicos.find((x) => String(x.id) === String(servico.id));
    if (s) {
      if (!Array.isArray(s.propostas)) s.propostas = [];
      const exists = s.propostas.some((pp) => String(pp.profissional_pessoa_id) === String(pessoaId));
      if (!exists) s.propostas.push({ profissional_pessoa_id: pessoaId });
    }

    // cria/atualiza agendamento pendente (se já existia CANCELADO, volta para PENDENTE)
    const agId = compositeId(servico.id, pessoaId);
    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    dt.setHours(9, 0, 0, 0);

    st.agendamentos[agId] = {
      id: agId,
      status: "PENDENTE",
      data_hora_agendamento: dt.toISOString(),
      preco_negociado: Number(valor ?? servico.valor_oferecido ?? 0),
      avaliacao: null, // sempre reinicia ao recriar
    };

    addNotificacao("Proposta enviada", `Você enviou uma proposta para: ${servico.titulo}`);

    await carregarPropostasDoPrestador();
    await carregarServicosAbertos();
    if (activeTab === "agenda" || activeTab === "ganhos") await carregarAgendamentos();

    setModal(null);
  }

  async function putAgendamento(idComposto, body) {
    const st = mockStoreRef.current;
    const prev = st.agendamentos[idComposto] || { id: idComposto };
    st.agendamentos[idComposto] = { ...prev, ...body };
  }

  async function handleCancelarAgendamento(agendamento) {
    // cancela agendamento
    await putAgendamento(agendamento.id, { status: "CANCELADO" });

    // ✅ volta serviço pra explorar removendo o "já proposto"
    const { servicoId, profissionalId } = splitCompositeId(agendamento.id);
    const st = mockStoreRef.current;

    const s = (st.servicos || []).find((x) => String(x.id) === String(servicoId));
    if (s && Array.isArray(s.propostas)) {
      s.propostas = s.propostas.filter((pp) => String(pp.profissional_pessoa_id) !== String(profissionalId));
    }

    addNotificacao("Agendamento cancelado", `Agendamento foi cancelado.`);
    await carregarServicosAbertos();
    await carregarAgendamentos();
  }

  async function handleReagendarAgendamento({ id, novaData, novaHora, precoNegociado }) {
    const dt = `${novaData}T${novaHora}:00.000Z`;
    const body = { data_hora_agendamento: dt, status: "PENDENTE" };
    if (precoNegociado !== undefined && precoNegociado !== null && precoNegociado !== "") {
      body.preco_negociado = Number(precoNegociado);
    }
    await putAgendamento(id, body);
    addNotificacao("Agendamento reagendado", `Agendamento foi reagendado.`);
    await carregarAgendamentos();
  }

  async function handleConcluirAgendamento(agendamento) {
    await putAgendamento(agendamento.id, { status: "CONCLUIDO" });
    addNotificacao("Agendamento concluído", `Agendamento foi concluído.`);
    await carregarAgendamentos();
  }

  async function handleEnviarAvaliacao({ agendamento, nota, texto }) {
    const st = mockStoreRef.current;

    // ✅ não permite reavaliar
    const agAtual = st.agendamentos?.[agendamento.id];
    if (agAtual?.avaliacao?.nota) return;

    const avaliacao = {
      id: `aval_${st.nextAvaliacaoId++}`,
      do_cliente_para_profissional: false,
      nota: Number(nota || 0),
      comentario: String(texto || "").trim() || null,
      enviado_em: new Date().toISOString(),
    };

    if (st.agendamentos[agendamento.id]) {
      st.agendamentos[agendamento.id] = {
        ...st.agendamentos[agendamento.id],
        avaliacao: { nota: avaliacao.nota, comentario: avaliacao.comentario, do_cliente_para_profissional: false },
      };
    }

    addNotificacao("Avaliação enviada", `Avaliação registrada.`);
    await carregarAgendamentos();
  }

  async function handleSalvarPerfil(payload) {
    const st = mockStoreRef.current;

    // payload vindo do ModalEditarPerfil (onSubmit)
    const next = {
      ...st.usuario,
      email: payload?.email ?? st.usuario.email,
      pessoa: {
        ...(st.usuario.pessoa || {}),
        ...(payload?.pessoa || {}),
      },
    };

    st.usuario = next;

    // ✅ atualiza tela imediatamente
    setUsuarioAtual({ ...next, pessoa: { ...(next.pessoa || {}) } });
    addNotificacao("Perfil atualizado", "Seus dados foram atualizados.");
    setModal(null);
  }

  function handleLogout() {
    try {
      localStorage.removeItem("usuario_id");
    } catch {}
    router.push("/login");
  }

  /* ================= Header ================= */

  const nomeHeader =
    usuarioAtual?.pessoa
      ? `${usuarioAtual.pessoa.primeiro_nome ?? ""} ${usuarioAtual.pessoa.ultimo_nome ?? ""}`.trim() || "Prestador"
      : usuarioAtual?.email
      ? usuarioAtual.email.split("@")[0]
      : "Prestador";

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      <header className="bg-emerald-600 pb-10 pt-8 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Olá, {nomeHeader}
              {carregandoUsuario ? <span className="text-white/70 text-sm font-black ml-2">...</span> : null}
            </h1>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">Painel Profissional</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                (async () => {
                  await carregarUsuarioAtual();
                  await carregarPropostasDoPrestador();
                  if (activeTab === "explorar") await carregarServicosAbertos();
                  if (activeTab === "agenda" || activeTab === "ganhos") await carregarAgendamentos();
                  await carregarNotificacoes();
                })();
              }}
              className="bg-white/10 p-2.5 rounded-xl text-white"
              title="Recarregar"
            >
              <RefreshCcw size={20} />
            </button>

            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative bg-white/10 p-2.5 rounded-xl text-white"
              title="Notificações"
            >
              <Bell size={22} />
              {naoLidas > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[14px] h-[14px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {naoLidas}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-6 relative z-10">
        {activeTab === "explorar" && (
          <ExplorarSection
            oportunidades={servicosDisponiveis}
            carregando={carregandoServicos || carregandoPropostas}
            onSelectServico={abrirServico}
          />
        )}

        {activeTab === "agenda" && (
          <div className="space-y-4">
            <AgendaToolbar
              periodo={agendaPeriodo}
              onPeriodo={setAgendaPeriodo}
              status={agendaStatus}
              onStatus={setAgendaStatus}
              busca={agendaBusca}
              onBusca={setAgendaBusca}
              contadores={agendaContadores}
            />

            <AgendaSection
              agendamentos={agendamentosFiltrados}
              onSelectAgendamento={abrirAgendamento}
              carregando={carregandoAgendamentos}
            />
          </div>
        )}

        {activeTab === "ganhos" && <GanhosSection agendamentos={agendamentos} />}

        {activeTab === "perfil" && (
          <PerfilSection
            usuario={usuarioAtual}
            carregando={carregandoUsuario}
            onEditarPerfil={abrirEditarPerfil}
            onLogout={handleLogout}
          />
        )}
      </main>

      {modal && (
        <ModalBase onClose={fecharModal}>
          {modal.tipo === "servico" && (
            <ModalServico
              servico={modal.dados}
              pessoaIdPrestador={pessoaId}
              onClose={fecharModal}
              onEnviarProposta={enviarProposta}
            />
          )}

          {modal.tipo === "agendamento" && (
            <ModalAgendamento
              agendamento={modal.dados}
              onClose={fecharModal}
              onCancel={handleCancelarAgendamento}
              onRemarcar={handleReagendarAgendamento}
              onConcluir={handleConcluirAgendamento}
              onAvaliar={handleEnviarAvaliacao}
            />
          )}

          {modal.tipo === "perfil" && (
            <ModalEditarPerfil
              usuario={usuarioAtual}
              onClose={fecharModal}
              onSubmit={handleSalvarPerfil} // ✅ prop correta
            />
          )}
        </ModalBase>
      )}

      {!modal && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-8 py-3 z-40 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <NavButton label="Explorar" icon={<Briefcase size={22} />} active={activeTab === "explorar"} onClick={() => setActiveTab("explorar")} />
          <NavButton label="Agenda" icon={<Calendar size={22} />} active={activeTab === "agenda"} onClick={() => setActiveTab("agenda")} />
          <NavButton label="Ganhos" icon={<Wallet size={22} />} active={activeTab === "ganhos"} onClick={() => setActiveTab("ganhos")} />
          <NavButton label="Perfil" icon={<User size={22} />} active={activeTab === "perfil"} onClick={() => setActiveTab("perfil")} />
        </nav>
      )}

      {notificationsOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-[90]" onClick={() => setNotificationsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[100] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg mb-0">Notificações</h2>
              <button
                onClick={async () => {
                  const st = mockStoreRef.current;
                  st.notificacoes = (st.notificacoes || []).map((n) => ({ ...n, lida: true }));
                  await carregarNotificacoes();
                }}
                className="text-xs font-black px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                Marcar lidas
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={carregarNotificacoes}
                className="text-xs font-black px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                Recarregar
              </button>
              <div className="text-xs text-slate-500 font-black">Não lidas: {naoLidas}</div>
            </div>

            {carregandoNotificacoes ? (
              <p className="text-sm text-slate-500">Carregando...</p>
            ) : notificacoes.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma notificação no momento.</p>
            ) : (
              <div className="space-y-3">
                {notificacoes.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-2xl border p-4 ${n.lida ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"}`}
                  >
                    <p className="font-black text-sm">{n.titulo}</p>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{n.mensagem}</p>
                    {n.criado_em ? (
                      <p className="text-[11px] text-slate-500 mt-2">
                        {toPtDateTime(n.criado_em).data} {toPtDateTime(n.criado_em).hora}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= UI components ================= */

function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? "text-emerald-600" : "text-slate-400"}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-tight border",
        active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function AgendaToolbar({ periodo, onPeriodo, status, onStatus, busca, onBusca, contadores }) {
  return (
    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Chip active={periodo === "dia"} onClick={() => onPeriodo("dia")}>Dia</Chip>
            <Chip active={periodo === "mes"} onClick={() => onPeriodo("mes")}>Mês</Chip>
            <Chip active={periodo === "2meses"} onClick={() => onPeriodo("2meses")}>2 meses</Chip>
            <Chip active={periodo === "3meses"} onClick={() => onPeriodo("3meses")}>3 meses</Chip>
            <Chip active={periodo === "tudo"} onClick={() => onPeriodo("tudo")}>Histórico</Chip>
          </div>

          <div className="text-xs text-slate-500 font-black">Total: {contadores?.todos ?? 0}</div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Chip active={status === "todos"} onClick={() => onStatus("todos")}>Todos ({contadores?.todos ?? 0})</Chip>
          <Chip active={status === "pendente"} onClick={() => onStatus("pendente")}>Pendentes ({contadores?.pendente ?? 0})</Chip>
          <Chip active={status === "concluido"} onClick={() => onStatus("concluido")}>Concluídos ({contadores?.concluido ?? 0})</Chip>
          <Chip active={status === "cancelado"} onClick={() => onStatus("cancelado")}>Cancelados ({contadores?.cancelado ?? 0})</Chip>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            placeholder="Buscar por cliente ou serviço..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>
    </div>
  );
}
