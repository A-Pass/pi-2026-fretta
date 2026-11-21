import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "./fixtures/seed";
import {
  publicProvider,
  providerId,
  companyError,
} from "../src/frontend/features/providers/rules";
import {
  acceptProposal,
  submitReview,
} from "../src/frontend/features/freights/rules";
import { ProviderProfileView } from "../src/frontend/features/providers/ProviderProfileView";
import {
  parseRoute,
  routeUrl,
  initialRoute,
} from "../src/frontend/features/navigation/routes";
import type { Store } from "../src/contracts";
function companyStore(): Store {
  const store = structuredClone(seed);
  store.profile = {
    id: "driver-1",
    name: "Motorista Exemplo",
    photo: "data:image/png;base64,PHOTO",
  };
  store.driverRegistration = {
    status: "APROVADO",
    personType: "pj",
    fullName: "Nome Privado",
    cpfMasked: "CPF_PRIVADO",
    cnpjMasked: "CNPJ_PRIVADO",
    companyName: "Empresa Legal",
    license: {
      numberMasked: "CNH_PRIVADA",
      category: "B",
      expiresOn: "2099-12-31",
    },
    documentsSubmitted: true,
    submittedAt: new Date().toISOString(),
  };
  store.companyProfile = {
    tradeName: "Reis Transportes de exemplo",
    about: "Apresentação pública",
    city: "Eunápolis, BA",
    logo: "data:image/png;base64,LOGO",
  };
  store.vehicles = [
    {
      id: "v",
      model: "Fiorino",
      category: "Utilitário",
      description: "Fechado",
      plate: "ABC1D23",
    },
  ];
  store.proposals[0] = {
    ...store.proposals[0],
    driverId: "driver-1",
    driver: "Motorista Exemplo",
    providerName: "Empresa no aceite",
    providerKind: "empresa",
  };
  return store;
}
test("perfil público separa logo da empresa e rosto do motorista e não exporta campos privados", () => {
  const store = companyStore();
  const profile = publicProvider(store, "driver-1")!;
  assert.equal(profile.name, "Reis Transportes de exemplo");
  assert.equal(profile.driver.name, "Motorista Exemplo");
  assert.notEqual(profile.photo, profile.driver.photo);
  const serialized = JSON.stringify(profile);
  for (const secret of [
    "CPF_PRIVADO",
    "CNPJ_PRIVADO",
    "CNH_PRIVADA",
    "Nome Privado",
    "ABC1D23",
  ])
    assert.equal(serialized.includes(secret), false);
  assert.equal(profile.vehicles[0].model, "Fiorino");
  const html = renderToStaticMarkup(
    <ProviderProfileView provider={profile} onBack={() => {}} />,
  );
  assert.equal(html.includes("Motorista responsável"), true);
  assert.equal(html.includes("ABC1D23"), false);
});
test("médias só consideram serviço concluído e comentários antigos não são publicados por padrão", () => {
  let store = acceptProposal(companyStore(), "p1");
  assert.equal(publicProvider(store, "driver-1")!.rating, null);
  store.freights[0].status = "CONCLUIDO";
  store = submitReview(store, "f1", "cliente", 4, "Comentário reservado");
  assert.equal(publicProvider(store, "driver-1")!.rating, 4);
  assert.equal(publicProvider(store, "driver-1")!.reviewCount, 1);
  assert.equal(publicProvider(store, "driver-1")!.reviews[0].comment, "");
  store.freights[0].reviewPublicComments = { cliente: true };
  assert.equal(
    publicProvider(store, "driver-1")!.reviews[0].comment,
    "Comentário reservado",
  );
  assert.equal(store.freights[0].agreement?.providerName, "Empresa no aceite");
});
test("prestadores legados são navegáveis e URLs preservam a negociação de origem", () => {
  const store = structuredClone(seed),
    id = providerId(store.proposals[0]);
  assert.equal(publicProvider(store, id)?.driver.name, "Carlos Santos");
  assert.equal(publicProvider(store, "unknown"), null);
  const route = {
    ...initialRoute,
    tab: "prestador" as const,
    providerId: id,
    providerConversationId: "p1",
  };
  assert.deepEqual(parseRoute(routeUrl(route)), route);
  assert.notEqual(
    companyError({ tradeName: " ", about: "", city: "", logo: "" }),
    "",
  );
});
