import assert from "node:assert/strict";
import { test } from "node:test";
import { saveAccountStore } from "../src/server/modules/store/persistence";
import { seed } from "./fixtures/seed";
import {
  acceptProposal,
  cancelFreight,
} from "../src/frontend/features/freights/rules";
import type { Store } from "../src/contracts";

function databaseForSelectedDriver(availableAt: Date, userId = "driver-1") {
  const state = {
    statusFrete: "ACEITO",
    motoristaSelecionadoId: "driver-1" as string | null,
  };
  const changes: string[] = [];
  const savedMessages: { conteudo: string }[] = [];
  const proposal = {
    id: "p1",
    frete_id: "f1",
    motorista_id: "driver-1",
    status_proposta: "ACEITA",
    ofertas: [
      {
        id: "p1",
        status: "ACEITA",
        disponivelEm: availableAt,
        valorCentavos: 10000,
        veiculoLabel: "Veículo de teste",
        mensagem: "",
      },
    ],
    frete: { cliente_id: "client-1", status_frete_enum: "ACEITO" },
  };
  const freight = {
    id: "f1",
    cliente_id: "client-1",
    motorista_selecionado_id: "driver-1",
    status_frete_enum: state.statusFrete,
    avaliacao: [],
    acordo: {
      propostaId: "p1",
      ofertaId: "p1",
      disponivelEm: availableAt,
      motoristaId: "driver-1",
      nomeMotorista: "Motorista",
      valorCentavos: 10000,
      veiculo: "Veículo de teste",
      mensagem: "",
      aceitoEm: new Date(),
    },
    proposta: [{ id: "p1" }],
  };
  const transaction = {
    user: {
      findUnique: async () => ({ id: userId }),
      update: async () => undefined,
    },
    motorista: {
      findUnique: async () =>
        userId === "driver-1" ? { user_id: userId } : null,
    },
    frete: {
      findUnique: async () => freight,
      update: async ({ data }: { data: Record<string, unknown> }) => {
        if (typeof data.status_frete_enum === "string")
          state.statusFrete = data.status_frete_enum;
        if ("motorista_selecionado_id" in data)
          state.motoristaSelecionadoId =
            data.motorista_selecionado_id as string | null;
        Object.assign(freight, data);
        changes.push("frete");
      },
    },
    acordoFrete: {
      delete: async () => {
        changes.push("acordo");
      },
    },
    proposta: {
      findUnique: async () => proposal,
      update: async ({ data }: { data: { status_proposta: string } }) => {
        proposal.status_proposta = data.status_proposta;
        changes.push("proposta");
      },
      updateMany: async () => undefined,
    },
    ofertaProposta: { updateMany: async () => changes.push("ofertas") },
    mensagem: {
      findUnique: async () => null,
      create: async ({ data }: { data: { conteudo: string } }) => {
        savedMessages.push(data);
      },
    },
    appNotification: { upsert: async () => undefined },
  };
  const database = {
    $transaction: async (callback: (tx: typeof transaction) => Promise<void>) =>
      callback(transaction),
  } as unknown as Parameters<typeof saveAccountStore>[0];
  return { database, state, changes, savedMessages };
}

function lifecycleStore(availableAt: string): Store {
  const store = structuredClone(seed);
  store.profile = { id: "driver-1", name: "Carlos Santos", photo: "" };
  store.proposals[0].driverId = "driver-1";
  store.proposals[0].availableAt = availableAt;
  return acceptProposal(store, "p1");
}

function payloadFor(store: Store) {
  return {
    ...store,
    freights: store.freights.filter((freight) => freight.id === "f1"),
    proposals: store.proposals.filter((proposal) => proposal.id === "p1"),
  };
}

test("servidor permite iniciar na data acordada e bloqueia antes dela", async () => {
  const date = new Date(Date.now() + 60_000);
  const future = databaseForSelectedDriver(date);
  const earlyStore = lifecycleStore(date.toISOString());
  earlyStore.freights[0].status = "EM_TRANSPORTE";
  const tooEarly = await saveAccountStore(
    future.database,
    "driver-1",
    payloadFor(earlyStore),
  );
  assert.equal(tooEarly?.status, 409);

  const due = databaseForSelectedDriver(new Date(Date.now() - 60_000));
  const dueStore = lifecycleStore(new Date(Date.now() - 60_000).toISOString());
  dueStore.freights[0].status = "EM_TRANSPORTE";
  assert.equal(
    await saveAccountStore(due.database, "driver-1", payloadFor(dueStore)),
    null,
  );
  assert.equal(due.state.statusFrete, "EM_TRANSPORTE");
});

test("servidor libera o frete e persiste o motivo no chat ao cancelar pelo motorista", async () => {
  const store = lifecycleStore(new Date(Date.now() - 60_000).toISOString());
  const canceled = cancelFreight(
    store,
    "f1",
    "motorista",
    "Imprevisto no veículo",
  );
  assert.equal(canceled.messages[0]?.proposalId, "p1");
  assert.equal(canceled.messages[0]?.role, "motorista");
  assert.match(
    canceled.messages[0]?.text || "",
    /^Motorista cancelou o frete\. Motivo: /,
  );
  const db = databaseForSelectedDriver(new Date(Date.now() - 60_000));

  const result = await saveAccountStore(
    db.database,
    "driver-1",
    payloadFor(canceled),
  );
  assert.equal(result, null, result ? await result.text() : undefined);
  assert.equal(db.state.statusFrete, "ABERTO");
  assert.equal(db.state.motoristaSelecionadoId, null);
  assert.deepEqual(db.changes.slice(0, 3), ["acordo", "frete", "proposta"]);
  assert.match(db.savedMessages[0].conteudo, /Imprevisto no veículo/);
});

test("servidor cancela o frete quando o cliente encerra o acordo", async () => {
  const store = lifecycleStore(new Date(Date.now() - 60_000).toISOString());
  const canceled = cancelFreight(
    store,
    "f1",
    "cliente",
    "O serviço não será mais necessário",
  );
  const db = databaseForSelectedDriver(
    new Date(Date.now() - 60_000),
    "client-1",
  );

  assert.equal(
    await saveAccountStore(db.database, "client-1", payloadFor(canceled)),
    null,
  );
  assert.equal(db.state.statusFrete, "CANCELADO");
  assert.match(
    db.savedMessages[0].conteudo,
    /O serviço não será mais necessário/,
  );
});
