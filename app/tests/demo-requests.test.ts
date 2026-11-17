import { test } from "node:test";
import assert from "node:assert/strict";
import { seed } from "../src/frontend/mocks/seed";
import { withDemoRequests } from "../src/frontend/mocks/demoRequests";
import {
  opportunities,
  defaultArea,
} from "../src/frontend/features/driver/rules";
test("exemplos aparecem no raio de Eunápolis e há carga de retorno em Porto Seguro", () => {
  const s = withDemoRequests(structuredClone(seed));
  const nearby = opportunities(s, defaultArea);
  assert.equal(nearby.length, 5);
  assert.ok(nearby.some((x) => x.freight.id === "demo-freight-apartment"));
  assert.ok(!nearby.some((x) => x.freight.id === "demo-freight-return"));
  assert.ok(
    opportunities(s, {
      ...defaultArea,
      center: { lat: -16.443, lng: -39.07 },
      radiusKm: 5,
    }).some((x) => x.freight.id === "demo-freight-return"),
  );
});
test("carregar exemplos preserva dados existentes e não duplica nem reabre pedidos", () => {
  const first = withDemoRequests(structuredClone(seed));
  first.freights.find((f) => f.id === "demo-freight-sofa")!.status =
    "CANCELADO";
  const second = withDemoRequests(first);
  assert.equal(second.freights.length, first.freights.length);
  assert.equal(
    second.freights.find((f) => f.id === "demo-freight-sofa")!.status,
    "CANCELADO",
  );
  assert.deepEqual(second.proposals, first.proposals);
});
