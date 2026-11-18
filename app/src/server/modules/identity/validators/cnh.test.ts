import {
  validarNumeroCNH,
  validarCategoriaCNH,
  validarValidadeCNH,
} from "./cnh";

import assert from "node:assert/strict";

// Testes do número da CNH
assert.equal(validarNumeroCNH("12345678901"), true);
assert.equal(validarNumeroCNH("123456789"), false);
assert.equal(validarNumeroCNH("11111111111"), false);
assert.equal(validarNumeroCNH(""), false);

// Testes da categoria
assert.equal(validarCategoriaCNH("B"), true);
assert.equal(validarCategoriaCNH("AB"), true);
assert.equal(validarCategoriaCNH("AE"), true);
assert.equal(validarCategoriaCNH("X"), false);
assert.equal(validarCategoriaCNH(""), false);

// Testes da validade
assert.equal(validarValidadeCNH("2030-12-31"), true);
assert.equal(validarValidadeCNH("2020-01-01"), false);
assert.equal(validarValidadeCNH("2030-02-30"), false);
assert.equal(validarValidadeCNH("data-invalida"), false);

console.log("Todos os 13 testes da CNH passaram!");
