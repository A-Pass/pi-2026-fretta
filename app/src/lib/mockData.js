// src/lib/mockData.js
import { isMockEnabled } from "./devFlags";

/**
 * Mock DB em memória (persistente durante o runtime, ajuda no Fast Refresh)
 */
function getDb() {
  if (!globalThis.__MOCK_DB__) {
    globalThis.__MOCK_DB__ = seed();
  }
  return globalThis.__MOCK_DB__;
}

function seed() {
  const now = new Date();

  const usuario = {
    id: 1,
    email: "prestador@mock.com",
    pessoa_id: 100,
    criado_em: now.toISOString(),
    atualizado_em: now.toISOString(),
    pessoa: {
      id: 100,
      primeiro_nome: "Daniel",
      ultimo_nome: "Mendes",
      cpf: "000.000.000-00",
      celular: "(51) 99999-9999",
    },
  };

  // Serviços ABERTOS (ServicoCliente)
  const servicos = [
    {
      id: 10,
      pessoa_id: 200, // cliente
      titulo: "Limpeza residencial",
      descricao: "Apartamento 2 quartos, precisa limpeza geral.",
      valor_oferecido: 120,
      status: "ABERTO",
      criado_em: now.toISOString(),
      cliente: {
        id: 200,
        primeiro_nome: "Mariana",
        ultimo_nome: "Silva",
        cpf: "111.111.111-11",
        celular: "(51) 98888-8888",
        foto_perfil: "/img/cliente-placeholder.png",
      },
      fotos: [
        { md5: "a1", uri_img: "/img/mock-local-1.jpg", ordem: 1 },
        { md5: "a2", uri_img: "/img/mock-local-2.jpg", ordem: 2 },
      ],
      // propostas vinculadas
      propostas: [],
      // extras para UI (não precisa existir no backend)
      endereco: "Rua X, 123 - Centro",
      data_sugerida: addDays(now, 1).toISOString(),
    },
    {
      id: 11,
      pessoa_id: 201,
      titulo: "Lavagem de carro",
      descricao: "Carro sedã, lavagem interna e externa.",
      valor_oferecido: 60,
      status: "ABERTO",
      criado_em: now.toISOString(),
      cliente: {
        id: 201,
        primeiro_nome: "Lucas",
        ultimo_nome: "Almeida",
        cpf: "222.222.222-22",
        celular: "(51) 97777-7777",
        foto_perfil: "/img/cliente-placeholder.png",
      },
      fotos: [{ md5: "b1", uri_img: "/img/mock-local-3.jpg", ordem: 1 }],
      propostas: [],
      endereco: "Av. Y, 999 - Bairro Z",
      data_sugerida: addDays(now, 2).toISOString(),
    },
  ];

  // Agendamentos (Contratacao) - id composto "servicoId-profissionalId"
  const agendamentos = [
    {
      id: "10-100", // servico_cliente_id - profissional_pessoa_id
      proposta_servico_cliente_id: 10,
      proposta_servico_profissional_id: 100,
      data_hora_agendamento: addDaysWithHour(now, 1, 14, 0).toISOString(),
      status: "PENDENTE", // PENDENTE | CONCLUIDO | CANCELADO
      preco_negociado: 130,
    },
    {
      id: "11-100",
      proposta_servico_cliente_id: 11,
      proposta_servico_profissional_id: 100,
      data_hora_agendamento: addDaysWithHour(now, 3, 10, 0).toISOString(),
      status: "CONCLUIDO",
      preco_negociado: 70,
    },
    {
      id: "12-100",
      proposta_servico_cliente_id: 12,
      proposta_servico_profissional_id: 100,
      data_hora_agendamento: addDaysWithHour(now, -1, 9, 30).toISOString(),
      status: "CANCELADO",
      preco_negociado: 90,
    },
  ];

  // Propostas (Proposta) – chave composta servico_cliente_id + profissional_pessoa_id
  const propostas = [
    // exemplo vazio
  ];

  return { usuario, servicos, agendamentos, propostas };
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function addDaysWithHour(date, days, h, m) {
  const d = addDays(date, days);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Handler mock compatível com seus endpoints atuais:
 * /api/usuarios, /api/usuarios/:id
 * /api/servicos, /api/servicos/:id
 * /api/propostas, /api/propostas/:id(composto)
 * /api/agendamentos, /api/agendamentos/:id(composto)
 */
export async function mockFetch(url, options = {}) {
  const db = getDb();
  const u = new URL(url, "http://localhost");
  const path = u.pathname;
  const method = (options.method || "GET").toUpperCase();

  // -------- USUÁRIOS --------
  if (path === "/api/usuarios" && method === "GET") {
    return ok([db.usuario]);
  }

  if (path.startsWith("/api/usuarios/")) {
    const id = Number(path.split("/").pop());
    if (method === "GET") {
      if (id === db.usuario.id) return ok(db.usuario);
      return notFound(`Usuário ${id} não encontrado`);
    }
    if (method === "PUT") {
      const body = await safeJson(options.body);
      if (id !== db.usuario.id) return notFound(`Usuário ${id} não encontrado`);

      db.usuario = {
        ...db.usuario,
        ...(body?.email ? { email: body.email } : {}),
        atualizado_em: new Date().toISOString(),
        pessoa: {
          ...db.usuario.pessoa,
          ...(body?.pessoa ? body.pessoa : {}),
        },
      };
      return ok(db.usuario);
    }
  }

  // -------- SERVIÇOS --------
  if (path === "/api/servicos" && method === "GET") {
    const status = u.searchParams.get("status");
    const includeCliente = u.searchParams.get("cliente") === "1";
    const includeFotos = u.searchParams.get("fotos") === "1";
    const includePropostas = u.searchParams.get("propostas") === "1";
    const q = u.searchParams.get("q");

    let list = [...db.servicos];

    if (status) list = list.filter((s) => String(s.status) === String(status));
    if (q) {
      const term = String(q).toLowerCase().trim();
      list = list.filter((s) => `${s.titulo} ${s.descricao}`.toLowerCase().includes(term));
    }

    // simula includes com base nos flags
    list = list.map((s) => {
      const base = {
        id: s.id,
        pessoa_id: s.pessoa_id,
        titulo: s.titulo,
        descricao: s.descricao,
        valor_oferecido: s.valor_oferecido,
        status: s.status,
        criado_em: s.criado_em,
        endereco: s.endereco,
        data_sugerida: s.data_sugerida,
      };
      if (includeCliente) base.cliente = s.cliente;
      if (includeFotos) base.fotos = s.fotos;
      if (includePropostas) base.propostas = s.propostas;
      return base;
    });

    return ok(list);
  }

  if (path.startsWith("/api/servicos/")) {
    const id = Number(path.split("/").pop());
    const includeCliente = u.searchParams.get("cliente") === "1";
    const includeFotos = u.searchParams.get("fotos") === "1";
    const includePropostas = u.searchParams.get("propostas") === "1";

    const s = db.servicos.find((x) => x.id === id);
    if (!s) return notFound(`Serviço ${id} não encontrado`);

    const payload = {
      id: s.id,
      pessoa_id: s.pessoa_id,
      titulo: s.titulo,
      descricao: s.descricao,
      valor_oferecido: s.valor_oferecido,
      status: s.status,
      criado_em: s.criado_em,
      endereco: s.endereco,
      data_sugerida: s.data_sugerida,
    };
    if (includeCliente) payload.cliente = s.cliente;
    if (includeFotos) payload.fotos = s.fotos;
    if (includePropostas) payload.propostas = s.propostas;

    return ok(payload);
  }

  // -------- PROPOSTAS --------
  if (path === "/api/propostas" && method === "GET") {
    const servicoId = u.searchParams.get("servico_cliente_id");
    const profissionalId = u.searchParams.get("profissional_pessoa_id");
    let list = [...db.propostas];

    if (servicoId) list = list.filter((p) => Number(p.servico_cliente_id) === Number(servicoId));
    if (profissionalId) list = list.filter((p) => Number(p.profissional_pessoa_id) === Number(profissionalId));

    return ok(list);
  }

  if (path === "/api/propostas" && method === "POST") {
    const body = await safeJson(options.body);
    const required = ["servico_cliente_id", "profissional_pessoa_id", "valor_proposta", "texto_proposta"];
    for (const k of required) {
      if (body?.[k] === undefined || body?.[k] === null || body?.[k] === "") {
        return badRequest(`${k} é obrigatório`);
      }
    }

    const servicoId = Number(body.servico_cliente_id);
    const profissionalId = Number(body.profissional_pessoa_id);

    const exists = db.propostas.find(
      (p) => Number(p.servico_cliente_id) === servicoId && Number(p.profissional_pessoa_id) === profissionalId
    );
    if (exists) return conflict("Já existe proposta para esse serviço e profissional");

    const proposta = {
      servico_cliente_id: servicoId,
      profissional_pessoa_id: profissionalId,
      valor_proposta: Number(body.valor_proposta),
      texto_proposta: String(body.texto_proposta),
      criado_em: new Date().toISOString(),
    };

    db.propostas.unshift(proposta);

    // também “injeta” em servico.propostas se existir
    const serv = db.servicos.find((s) => s.id === servicoId);
    if (serv) {
      serv.propostas = serv.propostas || [];
      serv.propostas.unshift({
        ...proposta,
        prestador: { pessoa: db.usuario.pessoa },
      });
    }

    return created(proposta);
  }

  // -------- AGENDAMENTOS --------
  if (path === "/api/agendamentos" && method === "GET") {
    // você pode filtrar por profissional no futuro:
    // const profissional = u.searchParams.get("profissional_pessoa_id");
    return ok(db.agendamentos.map((a) => ({ ...a })));
  }

  if (path.startsWith("/api/agendamentos/")) {
    const id = String(path.split("/").pop());
    const ag = db.agendamentos.find((x) => String(x.id) === id);
    if (!ag) return notFound("Agendamento não encontrado");

    if (method === "GET") return ok({ ...ag });

    if (method === "PUT") {
      const body = await safeJson(options.body);
      if (body?.data_hora_agendamento !== undefined) ag.data_hora_agendamento = body.data_hora_agendamento;
      if (body?.status !== undefined) ag.status = body.status;
      if (body?.preco_negociado !== undefined) ag.preco_negociado = body.preco_negociado;
      return ok({ ...ag });
    }
  }

  return notFound("Mock: rota não implementada");
}

export async function fetchJsonOrMock(url, options = {}) {
  // se mock ativo, nem tenta backend
  if (isMockEnabled()) {
    const r = await mockFetch(url, options);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  // tenta backend; se falhar, cai no mock
  try {
    const res = await fetch(url, { cache: "no-store", ...options });
    if (!res.ok) {
      // fallback pro mock (para você conseguir testar UI)
      const r = await mockFetch(url, options);
      if (!r.ok) throw new Error(await res.text().catch(() => "HTTP " + res.status));
      return r.json();
    }
    return res.json();
  } catch (e) {
    const r = await mockFetch(url, options);
    if (!r.ok) throw e;
    return r.json();
  }
}

/* ===== Helpers de resposta estilo fetch ===== */
function ok(data) {
  return response(200, data);
}
function created(data) {
  return response(201, data);
}
function badRequest(msg) {
  return response(400, { error: msg });
}
function conflict(msg) {
  return response(409, { error: msg });
}
function notFound(msg) {
  return response(404, { error: msg });
}
function response(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return data;
    },
    async text() {
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    },
  };
}

async function safeJson(body) {
  try {
    if (!body) return null;
    if (typeof body === "string") return JSON.parse(body);
    return body;
  } catch {
    return null;
  }
}
