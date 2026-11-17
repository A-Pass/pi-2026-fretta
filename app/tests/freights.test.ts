import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptProposal } from "../src/frontend/features/freights/rules";
import { seed } from "../src/frontend/mocks/seed";
test("aceite agenda o frete e encerra as concorrentes sem alterar a origem", () => {
  const s = acceptProposal(structuredClone(seed), "p1");
  assert.equal(s.freights[0].status, "AGENDADO");
  assert.equal(s.proposals[1].status, "ENCERRADA");
  assert.equal(seed.freights[0].status, "ABERTO");
  assert.throws(() => acceptProposal(s, "p2"));
});
