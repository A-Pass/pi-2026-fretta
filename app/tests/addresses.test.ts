import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyAddress,
  addressError,
  scheduleError,
  publicRegion,
  fillAddressFromReverseGeocode,
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
test("preenche campos disponíveis do endereço a partir da geocodificação reversa", () => {
  const result = fillAddressFromReverseGeocode(
    {
      ...emptyAddress(),
      complement: "Casa",
      point: { lat: -16.377, lng: -39.58 },
    },
    {
      city: "Eunápolis",
      state: "Bahia",
      state_code: "BR-BA",
      suburb: "Jardim Primavera",
      road: "Rua das Flores",
      house_number: "123",
      postcode: "45820-000",
    },
  );

  assert.equal(result.city, "Eunápolis");
  assert.equal(result.state, "BA");
  assert.equal(result.neighborhood, "Jardim Primavera");
  assert.equal(result.street, "Rua das Flores");
  assert.equal(result.number, "123");
  assert.equal(result.postalCode, "45820-000");
  assert.equal(result.complement, "Casa");
  assert.deepEqual(result.point, { lat: -16.377, lng: -39.58 });
});
test("preserva campos existentes quando a API não retorna esses dados", () => {
  const result = fillAddressFromReverseGeocode(
    { ...address, postalCode: "45820-000" },
    {},
  );

  assert.equal(result.city, address.city);
  assert.equal(result.neighborhood, address.neighborhood);
  assert.equal(result.street, address.street);
  assert.equal(result.number, address.number);
  assert.equal(result.postalCode, "45820-000");
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
