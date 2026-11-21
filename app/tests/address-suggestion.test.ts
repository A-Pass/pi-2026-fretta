import assert from "node:assert/strict";
import { test } from "node:test";
import { fillEmptyAddressFields } from "../src/contracts/address-suggestion";
import { emptyAddress } from "../src/frontend/features/addresses/rules";

test("sugestão preenche campos vazios e mantém o que já foi digitado", () => {
  const point = { lat: -16.37, lng: -39.58 };
  const existing = {
    ...emptyAddress(),
    city: "Cidade já informada",
    number: "105",
    point,
  };
  const filled = fillEmptyAddressFields(existing, {
    city: "Outra cidade",
    state: "SP",
    neighborhood: "Centro",
    street: "Rua de teste",
  });
  assert.deepEqual(filled, {
    ...existing,
    neighborhood: "Centro",
    street: "Rua de teste",
  });
  assert.deepEqual(fillEmptyAddressFields(existing, {}), existing);
});
