import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyAddress,
  addressError,
  scheduleError,
  publicRegion,
} from "../src/frontend/features/addresses/rules";
import { createRequest } from "../src/frontend/features/addresses/createRequest";
import { seed } from "../src/frontend/mocks/seed";
import type { FreightRequestDraft, Address } from "../src/contracts";
const address: Address = {
  ...emptyAddress(),
  label: "Casa",
  city: "Eunápolis",
  neighborhood: "Centro",
  street: "Rua privada",
  number: "123",
  point: { lat: -16.377, lng: -39.58 },
};
test("exige confirmação de ponto e campos do endereço", () => {
  assert.ok(addressError({ ...address, point: null }));
  assert.ok(addressError({ ...address, street: "" }));
  assert.equal(addressError(address, true), "");
});
test("valida agenda conforme opção e rejeita intervalos invertidos", () => {
  assert.equal(scheduleError({ kind: "combinar" }, "2026-10-28"), "");
  assert.ok(scheduleError({ kind: "fixa", start: "2026-10-27" }, "2026-10-28"));
  assert.ok(
    scheduleError(
      { kind: "intervalo", start: "2026-11-03", end: "2026-11-02" },
      "2026-10-28",
    ),
  );
  assert.equal(
    scheduleError(
      { kind: "intervalo", start: "2026-11-02", end: "2026-11-03" },
      "2026-10-28",
    ),
    "",
  );
});
test("publica somente bairro/cidade e salva snapshots independentes dos endereços", () => {
  const draft: FreightRequestDraft = {
    title: "Mudança",
    description: "Uma mesa",
    photos: [],
    pickup: { ...address },
    delivery: { ...address, city: "Porto Seguro", label: "Trabalho" },
    savePickup: true,
    saveDelivery: false,
    vehicle: "Utilitário",
    schedule: { kind: "combinar" },
  };
  let n = 0;
  const next = createRequest(structuredClone(seed), draft, () => String(++n));
  assert.equal(next.addresses?.length, 1);
  assert.equal(next.freights[0].origin, publicRegion(address));
  assert.equal(JSON.stringify(next.freights[0]).includes("Rua privada"), false);
  draft.pickup.street = "Rua alterada";
  assert.equal(next.freightAddresses?.["1"].pickup.street, "Rua privada");
  next.addresses![0].number = "999";
  assert.equal(next.freightAddresses?.["1"].pickup.number, "123");
});
