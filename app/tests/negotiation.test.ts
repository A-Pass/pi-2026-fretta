import { test } from "node:test";
import assert from "node:assert/strict";
import type { ProposalOffer } from "../src/contracts";
import { seed } from "../src/frontend/mocks/seed";
import {
  declineOffer,
  proposalOffers,
  reviseOffer,
} from "../src/frontend/features/freights/negotiation";
import { acceptProposal } from "../src/frontend/features/freights/rules";
const offer: ProposalOffer = {
  id: "offer-new",
  priceCents: 22000,
  vehicle: "Utilitário",
  availableAt: new Date(Date.now() + 86400000).toISOString(),
  message: "Valor combinado na conversa, com ajuda na carga.",
  status: "PENDENTE",
  createdAt: new Date().toISOString(),
};
test("renegociação preserva proposta inicial, mensagens e vínculo da conversa", () => {
  const original = structuredClone(seed);
  original.messages.push({
    id: "m1",
    proposalId: "p1",
    freightId: "f1",
    role: "cliente",
    text: "Fecha por 220?",
    createdAt: new Date().toISOString(),
  });
  const revised = reviseOffer(original, "p1", offer);
  const p = revised.proposals.find((p) => p.id === "p1")!;
  assert.equal(p.priceCents, 22000);
  assert.deepEqual(
    proposalOffers(p).map((o) => o.status),
    ["SUBSTITUIDA", "PENDENTE"],
  );
  assert.equal(
    proposalOffers(p)[0].priceCents,
    original.proposals[0].priceCents,
  );
  assert.deepEqual(revised.messages, original.messages);
  assert.throws(() => declineOffer(revised, "p1", "p1"));
  const accepted = acceptProposal(revised, "p1");
  assert.equal(accepted.freights[0].acceptedProposalId, "p1");
  assert.equal(accepted.proposals[0].priceCents, 22000);
  assert.equal(proposalOffers(accepted.proposals[0]).at(-1)?.status, "ACEITA");
  assert.throws(() => reviseOffer(accepted, "p1", offer));
});
test("recusa mantém frete aberto e permite nova oferta sem perder a recusada", () => {
  const rejected = declineOffer(structuredClone(seed), "p1", "p1");
  assert.equal(rejected.freights[0].status, "ABERTO");
  assert.equal(proposalOffers(rejected.proposals[0])[0].status, "RECUSADA");
  assert.throws(() => acceptProposal(rejected, "p1"));
  const revised = reviseOffer(rejected, "p1", offer);
  assert.deepEqual(
    proposalOffers(revised.proposals[0]).map((o) => o.status),
    ["RECUSADA", "PENDENTE"],
  );
  assert.equal(revised.proposals[0].id, "p1");
  assert.throws(() =>
    reviseOffer(rejected, "p1", { ...offer, priceCents: -1 }),
  );
  assert.throws(() =>
    reviseOffer(rejected, "p1", { ...offer, availableAt: "invalid" }),
  );
});
