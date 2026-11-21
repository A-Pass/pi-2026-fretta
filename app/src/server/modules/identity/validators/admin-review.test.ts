import assert from "node:assert/strict";
import { test } from "node:test";
import { validarRevisaoAdministrativa } from "./admin-review";

test("aceita aprovação válida", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "APROVADO",
    expectedVersion: 1,
    correctionItems: [],
  });

  assert.ok(resultado);
  assert.equal(resultado.decision, "APROVADO");
  assert.equal(resultado.reason, null);
});

test("aceita solicitação de ajustes válida", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "AJUSTES_SOLICITADOS",
    reason: "A fotografia da CNH está ilegível.",
    correctionItems: ["cnh", "foto"],
    expectedVersion: 2,
  });

  assert.ok(resultado);
  assert.deepEqual(resultado.correctionItems, ["cnh", "foto"]);
});

test("rejeita motivo muito curto", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "AJUSTES_SOLICITADOS",
    reason: "Erro",
    correctionItems: ["cnh"],
    expectedVersion: 1,
  });

  assert.equal(resultado, null);
});

test("rejeita ajustes sem itens de correção", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "AJUSTES_SOLICITADOS",
    reason: "Documento precisa ser atualizado.",
    correctionItems: [],
    expectedVersion: 1,
  });

  assert.equal(resultado, null);
});

test("rejeita itens de correção repetidos", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "AJUSTES_SOLICITADOS",
    reason: "Corrigir os documentos enviados.",
    correctionItems: ["cnh", "cnh"],
    expectedVersion: 1,
  });

  assert.equal(resultado, null);
});

test("rejeita versão inválida", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "APROVADO",
    expectedVersion: 0,
    correctionItems: [],
  });

  assert.equal(resultado, null);
});

test("rejeita aprovação com correções pendentes", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "APROVADO",
    expectedVersion: 1,
    correctionItems: ["cnh"],
  });

  assert.equal(resultado, null);
});

test("rejeita decisão desconhecida", () => {
  const resultado = validarRevisaoAdministrativa({
    decision: "CANCELADO",
    expectedVersion: 1,
    correctionItems: [],
  });

  assert.equal(resultado, null);
});
