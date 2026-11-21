import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "./fixtures/seed";
import {
  acceptProposal,
  cancelFreight,
  completeFreight,
  startFreight,
} from "../src/frontend/features/freights/rules";
import { FreightDetailsView } from "../src/frontend/features/FreightDetailsView";
import type { Store } from "../src/contracts";

function acceptedStore(availableAt: string): Store {
  const store = structuredClone(seed);
  store.profile = { id: "driver-1", name: "Carlos Santos", photo: "" };
  store.proposals[0].driverId = "driver-1";
  store.proposals[0].availableAt = availableAt;
  return acceptProposal(store, "p1");
}

function renderDriverFreight(store: Store) {
  const freight = store.freights.find((item) => item.id === "f1")!;
  const accepted = store.proposals.find(
    (proposal) => proposal.id === freight.acceptedProposalId,
  );
  return renderToStaticMarkup(
    <FreightDetailsView
      f={freight}
      role="motorista"
      name="Carlos Santos"
      store={store}
      proposals={store.proposals.filter((proposal) => proposal.id === "p1")}
      accepted={accepted}
      canPropose
      onRegistration={() => {}}
      setModal={() => {}}
      setSelected={() => {}}
      onChat={() => {}}
      save={async () => true}
      schedule={() => "A combinar"}
    />,
  );
}

test("início do transporte só é permitido a partir da disponibilidade acordada", () => {
  const startAt = new Date(Date.now() + 60_000).toISOString();
  const store = acceptedStore(startAt);
  assert.doesNotMatch(renderDriverFreight(store), /Iniciar transporte/);
  assert.throws(() => startFreight(store, "f1", "motorista", Date.now()));

  const started = startFreight(store, "f1", "motorista", Date.parse(startAt));
  assert.equal(started.freights[0].status, "EM_TRANSPORTE");
  assert.match(
    renderDriverFreight(
      acceptedStore(new Date(Date.now() - 60_000).toISOString()),
    ),
    /Iniciar transporte/,
  );
  assert.throws(() =>
    startFreight(store, "f1", "cliente", Date.parse(startAt)),
  );
});

test("cancelamento do motorista reabre o frete e registra o motivo na conversa", () => {
  const store = acceptedStore(new Date(Date.now() - 60_000).toISOString());
  const canceled = cancelFreight(
    store,
    "f1",
    "motorista",
    "Não poderei comparecer",
  );
  assert.equal(canceled.freights[0].status, "ABERTO");
  assert.equal(canceled.freights[0].acceptedProposalId, undefined);
  assert.equal(canceled.freights[0].agreement, undefined);
  assert.equal(canceled.proposals[0].status, "ENCERRADA");
  assert.match(canceled.messages[0].text, /Não poderei comparecer/);
  assert.equal(canceled.messages[0].role, "motorista");
  assert.doesNotMatch(renderDriverFreight(canceled), /Continuar negociação/);
  assert.equal(
    cancelFreight(store, "f1", "cliente", "O serviço não será mais necessário")
      .freights[0].status,
    "CANCELADO",
  );
  assert.equal(
    cancelFreight(canceled, "f1", "cliente", "Mudança de planos").freights[0]
      .status,
    "CANCELADO",
  );
  assert.throws(() => cancelFreight(store, "f1", "motorista", "  "));
});

test("cliente confirma a conclusão e pode avaliar; motorista não pode concluir pelo cliente", () => {
  const store = acceptedStore(new Date(Date.now() - 60_000).toISOString());
  const started = startFreight(store, "f1", "motorista");
  const completed = completeFreight(started, "f1", "cliente");
  assert.equal(completed.freights[0].status, "CONCLUIDO");
  assert.throws(() => completeFreight(started, "f1", "motorista"));
});
