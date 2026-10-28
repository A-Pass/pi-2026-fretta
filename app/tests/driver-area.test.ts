import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaultArea,
  distanceKm,
  opportunities,
  ownProposal,
} from "../src/frontend/features/driver/rules";
import { seed } from "../src/frontend/mocks/seed";
import { emptyAddress } from "../src/frontend/features/addresses/rules";
test("área considera a retirada e não o destino, exclui fechados e pontos desconhecidos", () => {
  const store = structuredClone(seed);
  store.freights[0].destination = "Outra cidade fora do raio";
  store.freights.push({ ...store.freights[0], id: "sem-coordenadas" });
  assert.deepEqual(
    opportunities(store, defaultArea).map((x) => x.freight.id),
    ["f1"],
  );
  assert.equal(distanceKm(defaultArea.center, defaultArea.center), 0);
});
test("mudar base encontra retiradas próximas à nova base e não à anterior", () => {
  const store = structuredClone(seed);
  store.freightAddresses = {
    f1: {
      pickup: { ...emptyAddress(), point: { lat: -16.58, lng: -39.1 } },
      delivery: { ...emptyAddress(), point: defaultArea.center },
    },
  };
  assert.equal(opportunities(store, { ...defaultArea, radiusKm: 5 }).length, 0);
  assert.equal(
    opportunities(store, {
      ...defaultArea,
      center: { lat: -16.58, lng: -39.1 },
      radiusKm: 5,
    }).length,
    1,
  );
});
test("identidade do motorista preserva suas propostas após mudar nome", () => {
  assert.equal(
    ownProposal(
      { ...seed.proposals[0], driverId: "demo-driver" },
      "Outro nome",
    ),
    true,
  );
  assert.equal(ownProposal(seed.proposals[0], "Clayton"), false);
});
