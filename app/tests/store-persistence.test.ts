import assert from "node:assert/strict";
import { test } from "node:test";
import { correctionItems } from "../src/contracts/driver-corrections";
import {
  activateAdminDriverSubscription,
  loadAccountStore,
  reviewDriverRegistration,
  saveAccountStore,
  saveDriverOperatingArea,
} from "../src/server/modules/store/persistence";

test("perfis disponíveis vêm das relações persistidas da conta", async () => {
  for (const [cliente, motorista, expected] of [
    [{ user_id: "user-1" }, null, { cliente: true, motorista: false }],
    [
      { user_id: "user-1" },
      { user_id: "user-1", veiculo: [] },
      { cliente: true, motorista: true },
    ],
  ] as const) {
    const database = {
      user: {
        findUnique: async () => ({
          id: "user-1",
          name: "Conta",
          image: null,
          accountSetupComplete: true,
          cliente,
          motorista,
          perfis_empresa: null,
          areas_atuacao: null,
          endereco_salvos: [],
          notificacoes: [],
        }),
      },
      frete: { findMany: async () => [] },
      proposta: { findMany: async () => [] },
      mensagem: { findMany: async () => [] },
    } as unknown as Parameters<typeof loadAccountStore>[0];

    const store = await loadAccountStore(database, "user-1");
    assert.deepEqual(store.roles, expected);
  }
});

test("área de operação é restaurada no formato do contrato da aplicação", async () => {
  const database = {
    user: {
      findUnique: async () => ({
        id: "driver-1",
        name: "Motorista",
        image: null,
        accountSetupComplete: true,
        cliente: null,
        motorista: null,
        perfis_empresa: null,
        areas_atuacao: {
          latitude: -16.377,
          longitude: -39.58,
          radiusKm: 30,
          label: "Base",
        },
        endereco_salvos: [],
        notificacoes: [],
      }),
    },
    frete: { findMany: async () => [] },
    proposta: { findMany: async () => [] },
    mensagem: { findMany: async () => [] },
  } as unknown as Parameters<typeof loadAccountStore>[0];

  const store = await loadAccountStore(database, "driver-1");
  assert.deepEqual(store.operatingArea, {
    center: { lat: -16.377, lng: -39.58 },
    radiusKm: 30,
    label: "Base",
  });
});

test("aprovar cadastro confirma os itens e pode ativar assinatura de 30 dias", async () => {
  const submittedAt = new Date("2026-01-10T12:00:00.000Z");
  const driver = {
    user_id: "driver-1",
    cadastro_status: "EM_ANALISE",
    nome_completo: "Motorista Teste",
    tipo_pessoa: "pf",
    documento_mascarado: "***.***.***-09",
    cnpj_mascarado: null,
    nome_empresa: null,
    cnh_numero_mascarado: "***123",
    cnh_categoria: "D",
    cnh_validade: new Date("2099-12-31T12:00:00.000Z"),
    cnh_foto_data_url: "data:image/png;base64,abc",
    documentos_enviados: true,
    enviado_em: submittedAt,
    revisado_em: null as Date | null,
    feedback: null,
    user: { image: "data:image/png;base64,abc", name: "Motorista Teste" },
    veiculo: [
      {
        id: "vehicle-1",
        categoria_porte: "MEDIO" as const,
        modelo: "Veículo teste",
        placa: "ABC1234",
        capacidade_kg: null,
        descricao: "",
      },
    ],
    cadastro_motorista: { motorista_id: "driver-1", status: "EM_ANALISE" },
  };
  let currentDriver = driver;
  let registrationUpdate: { data: Record<string, unknown> } | undefined;
  let subscriptionCreate: { data: Record<string, unknown> } | undefined;
  const transaction = {
    motorista: {
      findUnique: async () => currentDriver,
      update: async () => {
        currentDriver = {
          ...driver,
          cadastro_status: "APROVADO",
          revisado_em: new Date(),
          cadastro_motorista: {
            ...driver.cadastro_motorista,
            status: "APROVADO",
          },
        };
        return currentDriver;
      },
    },
    cadastro_motorista: {
      update: async (args: { data: Record<string, unknown> }) => {
        registrationUpdate = args;
        currentDriver.cadastro_motorista.status = "APROVADO";
      },
    },
    vinculo_assinatura: {
      findFirst: async () => null,
      create: async (args: { data: Record<string, unknown> }) => {
        subscriptionCreate = args;
      },
    },
    adminReview: {
      create: async ({ data }: { data: Record<string, unknown> }) => data,
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<unknown>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof reviewDriverRegistration>[0];

  const result = await reviewDriverRegistration(database, "driver-1", "admin-1", {
    decision: "APROVADO",
    expectedVersion: [submittedAt.toISOString(), "", "EM_ANALISE", "1"].join("|"),
    activateSubscription: true,
    checks: [
      "Identificação e dados conferidos",
      "Foto do motorista conferida",
      "Habilitação e validade conferidas",
      "Veículo e habilitação compatíveis",
    ],
  });

  assert.ok("case" in result);
  assert.ok(registrationUpdate);
  assert.equal(registrationUpdate.data.status, "APROVADO");
  assert.equal(registrationUpdate.data.motivo_ajuste, null);
  assert.deepEqual(registrationUpdate.data.itens_ajuste, []);
  assert.deepEqual(
    registrationUpdate.data.itens_conferidos,
    correctionItems.map((item) => item.id),
  );
  assert.ok(registrationUpdate.data.analisado_em instanceof Date);
  assert.ok(registrationUpdate.data.atualizado_em instanceof Date);
  assert.ok(subscriptionCreate);
  assert.equal(subscriptionCreate.data.status, "ATIVA");
  assert.equal(subscriptionCreate.data.motorista_id, "driver-1");
  assert.equal(
    (subscriptionCreate.data.fim_em as Date).getTime() -
      (subscriptionCreate.data.inicio_em as Date).getTime(),
    30 * 24 * 60 * 60 * 1000,
  );
});

test("ativar assinatura separadamente exige cadastro aprovado", async () => {
  let created: { data: Record<string, unknown> } | undefined;
  const transaction = {
    motorista: {
      findUnique: async () => ({
        cadastro_status: "APROVADO",
        cadastro_motorista: { status: "APROVADO" },
      }),
    },
    vinculo_assinatura: {
      findFirst: async () => null,
      create: async (args: { data: Record<string, unknown> }) => {
        created = args;
      },
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<unknown>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof activateAdminDriverSubscription>[0];

  const result = await activateAdminDriverSubscription(database, "driver-1");

  assert.ok("subscription" in result);
  assert.ok(created);
  assert.equal(created.data.status, "ATIVA");
  assert.equal(
    (created.data.fim_em as Date).getTime() -
      (created.data.inicio_em as Date).getTime(),
    30 * 24 * 60 * 60 * 1000,
  );
});

function databaseWithExistingMessage(message: {
  remetente_id: string;
  destinatario_id: string;
}) {
  const transaction = {
    user: {
      findUnique: async () => ({ id: "client" }),
      update: async () => undefined,
    },
    motorista: { findUnique: async () => null },
    mensagem: {
      findUnique: async () => message,
      create: async () => {
        throw new Error("An existing message must not be recreated.");
      },
    },
  };
  return {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<void>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof saveAccountStore>[0];
}

const payload = {
  profile: { name: "Cliente", photo: "" },
  freights: [],
  proposals: [],
  messages: [
    {
      id: "message-1",
      freightId: "freight-1",
      proposalId: "proposal-1",
      role: "motorista",
      text: "Proposta enviada",
      createdAt: "2026-11-21T12:00:00.000Z",
    },
  ],
};

test("salvar o estado do cliente preserva mensagens recebidas existentes", async () => {
  const result = await saveAccountStore(
    databaseWithExistingMessage({
      remetente_id: "driver",
      destinatario_id: "client",
    }),
    "client",
    payload,
  );

  assert.equal(result, null);
});

test("salva área de operação enviada pelo contrato da aplicação", async () => {
  let savedArea: Record<string, unknown> | undefined;
  const transaction = {
    user: {
      findUnique: async () => ({ id: "driver-1" }),
      update: async () => undefined,
    },
    motorista: { findUnique: async () => null },
    operatingArea: {
      upsert: async ({ create }: { create: Record<string, unknown> }) => {
        savedArea = create;
      },
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<void>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof saveAccountStore>[0];

  const result = await saveAccountStore(database, "driver-1", {
    ...payload,
    freights: [],
    proposals: [],
    messages: [],
    operatingArea: {
      center: { lat: -16.377, lng: -39.58 },
      radiusKm: 30,
      label: "Base",
    },
  });

  assert.equal(result, null);
  assert.deepEqual(
    {
      user_id: savedArea?.user_id,
      latitude: savedArea?.latitude,
      longitude: savedArea?.longitude,
      radiusKm: savedArea?.radiusKm,
      label: savedArea?.label,
    },
    {
      user_id: "driver-1",
      latitude: -16.377,
      longitude: -39.58,
      radiusKm: 30,
      label: "Base",
    },
  );
});

test("salva somente a área vinculada à conta autenticada", async () => {
  let where: unknown;
  let create: Record<string, unknown> | undefined;
  const database = {
    operatingArea: {
      upsert: async (input: {
        where: unknown;
        create: Record<string, unknown>;
      }) => {
        where = input.where;
        create = input.create;
      },
    },
  } as unknown as Parameters<typeof saveDriverOperatingArea>[0];

  const area = await saveDriverOperatingArea(database, "driver-1", {
    center: { lat: -16.377, lng: -39.58 },
    radiusKm: 30,
    label: "Base",
  });

  assert.deepEqual(where, { user_id: "driver-1" });
  assert.deepEqual(
    {
      user_id: create?.user_id,
      latitude: create?.latitude,
      longitude: create?.longitude,
      radiusKm: create?.radiusKm,
      label: create?.label,
    },
    {
      user_id: "driver-1",
      latitude: -16.377,
      longitude: -39.58,
      radiusKm: 30,
      label: "Base",
    },
  );
  assert.deepEqual(area, {
    center: { lat: -16.377, lng: -39.58 },
    radiusKm: 30,
    label: "Base",
  });
});

test("concluir cadastro de cliente cria seu perfil, mas cadastro de motorista não", async () => {
  const activated: string[] = [];
  const transaction = {
    user: {
      findUnique: async () => ({ id: "client" }),
      update: async () => undefined,
    },
    cliente: {
      upsert: async ({ where }: { where: { user_id: string } }) => {
        activated.push(where.user_id);
      },
    },
    motorista: { findUnique: async () => null },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<void>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof saveAccountStore>[0];

  for (const [userId, accountSetupRole] of [
    ["client", "cliente"],
    ["driver", "motorista"],
  ] as const) {
    const result = await saveAccountStore(database, userId, {
      ...payload,
      accountSetupComplete: true,
      accountSetupRole,
      freights: [],
      proposals: [],
      messages: [],
    });
    assert.equal(result, null);
  }

  assert.deepEqual(activated, ["client"]);
});

test("aceitar uma proposta não falha por mensagens recebidas na conversa", async () => {
  const updates: string[] = [];
  const offer = {
    id: "offer-1",
    status: "PENDENTE",
    valorCentavos: 25000,
    veiculoLabel: "Caminhão médio",
    disponivelEm: new Date("2026-12-01T12:00:00.000Z"),
    mensagem: "Disponível para o serviço",
  };
  const proposal = {
    id: "proposal-1",
    frete_id: "freight-1",
    motorista_id: "driver",
    status_proposta: "PENDENTE",
    frete: { cliente_id: "client", status_frete_enum: "ABERTO" },
    motorista: {
      cadastro_status: "APROVADO",
      user: { name: "Motorista", perfis_empresa: null },
    },
    ofertas: [offer],
  };
  const freight = {
    id: "freight-1",
    cliente_id: "client",
    motorista_selecionado_id: null,
    status_frete_enum: "ABERTO",
    avaliacao: [],
    acordo: null,
  };
  const transaction = {
    user: {
      findUnique: async () => ({ id: "client" }),
      update: async () => undefined,
    },
    motorista: { findUnique: async () => null },
    frete: {
      findUnique: async () => freight,
      update: async () => updates.push("frete"),
    },
    proposta: {
      findUnique: async () => proposal,
      update: async () => updates.push("proposta"),
      updateMany: async () => updates.push("propostas"),
    },
    ofertaProposta: {
      update: async () => updates.push("oferta"),
      updateMany: async () => updates.push("ofertas"),
    },
    acordoFrete: { upsert: async () => updates.push("acordo") },
    appNotification: { upsert: async () => updates.push("notificacao") },
    mensagem: {
      findUnique: async () => ({
        remetente_id: "driver",
        destinatario_id: "client",
      }),
      create: async () => {
        throw new Error("An existing message must not be recreated.");
      },
    },
  };
  const database = {
    $transaction: async (
      callback: (tx: typeof transaction) => Promise<void>,
    ) => callback(transaction),
  } as unknown as Parameters<typeof saveAccountStore>[0];

  const result = await saveAccountStore(
    database,
    "client",
    {
      ...payload,
      freights: [
        {
          id: "freight-1",
          status: "AGENDADO",
          acceptedProposalId: "proposal-1",
          agreement: {
            proposalId: "proposal-1",
            offerId: "offer-1",
            acceptedAt: "2026-11-21T18:00:00.000Z",
          },
        },
      ],
      proposals: [
        {
          id: "proposal-1",
          status: "ACEITA",
          offers: [{ id: "offer-1", status: "ACEITA" }],
        },
      ],
    },
  );

  assert.equal(result, null);
  assert.deepEqual(updates, [
    "frete",
    "propostas",
    "proposta",
    "ofertas",
    "oferta",
    "acordo",
    "notificacao",
  ]);
});

test("não permite incluir mensagem existente de uma conversa alheia", async () => {
  const result = await saveAccountStore(
    databaseWithExistingMessage({
      remetente_id: "other-sender",
      destinatario_id: "other-recipient",
    }),
    "client",
    payload,
  );

  assert.equal(result?.status, 403);
});
