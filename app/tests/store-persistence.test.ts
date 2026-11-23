import assert from "node:assert/strict";
import { test } from "node:test";
import { saveAccountStore } from "../src/server/modules/store/persistence";

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
