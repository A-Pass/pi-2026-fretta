import { test } from "node:test";
import assert from "node:assert/strict";
import {
  distanceKm,
  freightFromFeedItem,
  isFreightFeedItem,
  opportunities,
  ownProposal,
  sortFeedItemsByPickupDistance,
} from "../src/frontend/features/driver/rules";
import { seed } from "./fixtures/seed";
import { emptyAddress } from "../src/frontend/features/addresses/rules";
const testArea = {
  center: { lat: -16.377, lng: -39.58 },
  radiusKm: 20,
  label: "Base de teste",
};
test("área considera a retirada e não o destino, exclui fechados e pontos desconhecidos", () => {
  const store = structuredClone(seed);
  store.freights[0].destination = "Outra cidade fora do raio";
  store.freightAddresses = {
    f1: {
      pickup: { ...emptyAddress(), point: { lat: -16.377, lng: -39.58 } },
      delivery: { ...emptyAddress(), point: { lat: -16.377, lng: -39.58 } },
    },
  };
  store.freights.push({ ...store.freights[0], id: "sem-coordenadas" });
  assert.deepEqual(
    opportunities(store, testArea).map((x) => x.freight.id),
    ["f1"],
  );
  assert.equal(distanceKm(testArea.center, testArea.center), 0);
});
test("mudar base encontra retiradas próximas à nova base e não à anterior", () => {
  const store = structuredClone(seed);
  store.freightAddresses = {
    f1: {
      pickup: { ...emptyAddress(), point: { lat: -16.58, lng: -39.1 } },
      delivery: { ...emptyAddress(), point: testArea.center },
    },
  };
  assert.equal(opportunities(store, { ...testArea, radiusKm: 5 }).length, 0);
  assert.equal(
    opportunities(store, {
      ...testArea,
      center: { lat: -16.58, lng: -39.1 },
      radiusKm: 5,
    }).length,
    1,
  );
});
test("identidade do motorista preserva suas propostas após mudar nome", () => {
  assert.equal(
    ownProposal(
      { ...seed.proposals[0], driverId: "driver-1" },
      "driver-1",
    ),
    true,
  );
  assert.equal(ownProposal(seed.proposals[0], "driver-1"), false);
});
test("solicitação do feed pode ser aberta em detalhes sem endereço privado", () => {
  const freight = freightFromFeedItem({
    id: "feed-freight",
    title: "Mudança",
    description: "Caixas e móveis",
    origin: "Centro, Eunápolis · BA",
    destination: "Pequi, Eunápolis · BA",
    vehicle: "Caminhão pequeno",
    schedule: { kind: "combinar" },
    status: "ABERTO",
    pickupDistanceKm: 3,
  });
  assert.equal(freight.id, "feed-freight");
  assert.equal(freight.origin, "Centro, Eunápolis · BA");
  assert.deepEqual(freight.photos, []);
  assert.deepEqual(freight.reviews, {});
  assert.equal("addresses" in freight, false);
  assert.equal(isFreightFeedItem({ ...freight, photos: undefined }), true);
  assert.equal(isFreightFeedItem({ ...freight, schedule: null }), false);
});
test("feed ordena fretes pela distância da retirada e deixa distância ausente por último", () => {
  const item = {
    title: "Frete",
    description: "Caixas",
    origin: "Centro, Eunápolis",
    destination: "Centro, Porto Seguro",
    vehicle: "Caminhão pequeno",
    schedule: { kind: "combinar" as const },
    status: "ABERTO" as const,
  };
  assert.deepEqual(
    sortFeedItemsByPickupDistance([
      { ...item, id: "far", pickupDistanceKm: 30 },
      { ...item, id: "unknown" },
      { ...item, id: "near", pickupDistanceKm: 4 },
    ]).map(({ freight }) => freight.id),
    ["near", "far", "unknown"],
  );
});
