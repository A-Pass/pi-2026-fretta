import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "./fixtures/seed";
import {
  acceptProposal,
  submitReview,
} from "../src/frontend/features/freights/rules";
import {
  declineOffer,
  reviseOffer,
} from "../src/frontend/features/freights/negotiation";
import { withNotifications } from "../src/frontend/features/notifications/rules";
import { validateVehicle } from "../src/frontend/features/vehicles/rules";
import { fromLocalDateTime, localDateTime } from "../src/frontend/lib/dates";
import {
  isAppRoute,
  parseLegacyRoute,
  parseRoute,
  routeUrl,
} from "../src/frontend/features/navigation/routes";
import { FreightDetailsView } from "../src/frontend/features/FreightDetailsView";
import { LoginView } from "../src/frontend/features/LoginView";
import { AuthCompleteView } from "../src/frontend/auth/AuthCompleteView";
import { identityDocumentError } from "../src/frontend/auth/registration";
import type { Address, Store, Vehicle } from "../src/contracts";

const vehicle: Vehicle = {
  id: "v1",
  category: "Utilitário",
  model: "Fiorino",
  plate: "ABC1D23",
  description: "Fechado",
  capacityKg: 600,
};
test("tela de acesso oferece os campos e ações de autenticação sem simular credenciais reais", () => {
  const html = renderToStaticMarkup(
    <LoginView
      role="cliente"
      onBack={() => {}}
      onContinue={() => {}}
      onGoogleSignIn={() => {}}
      googleSignInPending={false}
      googleSignInError=""
    />,
  );
  assert.match(html, /Continuar com Google/);
  assert.match(html, /sessão/);
});
test("cadastro pós-Google mostra nome, foto e documento conforme o perfil", () => {
  const html = renderToStaticMarkup(
    <AuthCompleteView
      name="Pessoa de Teste"
      email="teste@example.com"
      image="https://example.com/foto.jpg"
      role="motorista"
    />,
  );
  assert.match(html, /Complete seu cadastro/);
  assert.match(html, /Pessoa de Teste/);
  assert.match(html, /Carteira de motorista \(CNH\)/);
  assert.match(html, /validado somente neste navegador/);
  assert.match(html, /Concluir cadastro/);
});
test("documentos são validados sem armazenar seus valores", () => {
  assert.equal(identityDocumentError("cliente", "cpf", "529.982.247-25"), "");
  assert.notEqual(
    identityDocumentError("cliente", "cpf", "111.111.111-11"),
    "",
  );
  assert.equal(identityDocumentError("cliente", "rg", "MG1234567"), "");
  assert.notEqual(identityDocumentError("cliente", "rg", "AB"), "");
  assert.equal(identityDocumentError("motorista", "cnh", "12345678901"), "");
  assert.notEqual(identityDocumentError("motorista", "cnh", "11111111111"), "");
});
test("veículos rejeitam placa duplicada, categoria inválida e capacidade negativa", () => {
  assert.equal(validateVehicle(vehicle, []), "");
  assert.notEqual(validateVehicle({ ...vehicle, id: "v2" }, [vehicle]), "");
  assert.notEqual(validateVehicle({ ...vehicle, capacityKg: -1 }, []), "");
  assert.notEqual(validateVehicle({ ...vehicle, category: "Outro" }, []), "");
  assert.equal(validateVehicle({ ...vehicle, plate: "ABC1234" }, []), "");
});
test("datas usam horário da Bahia independentemente do fuso do dispositivo", () => {
  assert.equal(
    fromLocalDateTime("2026-12-01T09:00"),
    "2026-12-01T12:00:00.000Z",
  );
  assert.equal(
    localDateTime(new Date("2026-12-01T12:00:00Z")),
    "2026-12-01T09:00",
  );
  assert.throws(() => fromLocalDateTime("2026-02-30T09:00"));
});
test("rotas usam segmentos do App Router e preservam IDs escapados", () => {
  const route = {
    role: "motorista" as const,
    tab: "chat" as const,
    selected: null,
    chatId: "a&b",
    providerId: null,
    providerConversationId: null,
  };
  assert.equal(routeUrl(route), "/motorista/chat/a%26b");
  assert.deepEqual(parseRoute(routeUrl(route)), route);
  assert.equal(isAppRoute("/motorista/chat/a%26b"), true);
  assert.equal(isAppRoute("/cliente/fretes/f1"), true);
  assert.equal(
    isAppRoute("/motorista/prestador/provider-1/negociacao/p1"),
    true,
  );
  assert.equal(isAppRoute("/motorista/tela-desconhecida"), false);
  assert.equal(isAppRoute("/cliente/prestador/provider-1/unknown/p1"), false);
  assert.equal(parseLegacyRoute("?perfil=motorista&frete=f1").selected, "f1");
  assert.equal(parseLegacyRoute("?tela=desconhecida").tab, "inicio");
});
test("aceite registra snapshot e rejeita confirmação de oferta substituída", () => {
  const s = structuredClone(seed);
  const offer = {
    id: "nova",
    vehicle: "Caminhão novo",
    priceCents: 22000,
    availableAt: new Date(Date.now() + 86400000).toISOString(),
    message: "Combinado",
    status: "PENDENTE" as const,
  };
  const revised = reviseOffer(s, "p1", offer);
  assert.throws(() => acceptProposal(revised, "p1", "p1"));
  const next = acceptProposal(revised, "p1", "nova");
  assert.equal(next.freights[0].agreement?.priceCents, 22000);
  revised.proposals[0].priceCents = 999;
  assert.equal(next.freights[0].agreement?.priceCents, 22000);
});
test("avaliação exige conclusão, nota válida e impede novo envio por participante", () => {
  const s = structuredClone(seed);
  assert.throws(() => submitReview(s, "f1", "cliente", 5, ""));
  s.freights[0].status = "CONCLUIDO";
  assert.throws(() => submitReview(s, "f1", "cliente", 0, ""));
  const next = submitReview(s, "f1", "cliente", 5, "  Ótimo serviço  ");
  assert.equal(next.freights[0].reviewComments?.cliente, "Ótimo serviço");
  assert.throws(() => submitReview(next, "f1", "cliente", 4, "Outro"));
  assert.equal(
    submitReview(next, "f1", "motorista", 4, "Tudo certo").freights[0].reviews
      .motorista,
    4,
  );
});
test("notificações de recusa pertencem ao motorista e não duplicam ao marcar leitura", () => {
  const previous = structuredClone(seed);
  previous.profile = { id: "driver-1", name: "Carlos Santos", photo: "" };
  previous.proposals[0].driverId = "driver-1";
  const next = withNotifications(previous, declineOffer(previous, "p1", "p1"));
  const notification = next.notifications!.find(
    (n) => n.title === "Proposta recusada",
  )!;
  assert.equal(notification.role, "motorista");
  notification.read = true;
  const unchanged = withNotifications(next, { ...next });
  assert.equal(unchanged.notifications!.length, next.notifications!.length);
  assert.equal(unchanged.notifications![0].read, true);
});
test("interface só mostra snapshot privado após aceite ao cliente ou motorista escolhido", () => {
  const s = structuredClone(seed);
  const address: Address = {
    label: "Casa",
    city: "Eunápolis",
    state: "BA",
    neighborhood: "Centro",
    street: "Rua Privada de Teste",
    number: "123",
    complement: "",
    point: { lat: -16.377, lng: -39.58 },
  };
  s.freightAddresses = {
    f1: {
      pickup: address,
      delivery: { ...address, street: "Rua Entrega de Teste" },
    },
  };
  function html(store: Store, role: "cliente" | "motorista", name: string) {
    const viewerStore = {
      ...store,
      profile: {
        id: role === "motorista" && name === "Carlos Santos" ? "driver-1" : "client-1",
        name,
        photo: "",
      },
    };
    const f = viewerStore.freights[0];
    const accepted = viewerStore.proposals.find((p) => p.id === f.acceptedProposalId);
    return renderToStaticMarkup(
      <FreightDetailsView
        f={f}
        store={viewerStore}
        role={role}
        name={name}
        proposals={store.proposals}
        accepted={accepted}
        subscription
        canPropose
        onRegistration={() => {}}
        setModal={() => {}}
        setSelected={() => {}}
        onChat={() => {}}
        save={async () => true}
        schedule={() => "A combinar"}
      />,
    );
  }
  assert.equal(
    html(s, "motorista", "Carlos Santos").includes("Rua Privada de Teste"),
    false,
  );
  s.proposals[0].driverId = "driver-1";
  const accepted = acceptProposal(s, "p1");
  assert.equal(html(s, "cliente", "Cleiton").includes("Aceitar proposta"), true);
  assert.equal(html(s, "cliente", "Cleiton").includes("Recusar proposta"), true);
  assert.equal(
    html(accepted, "cliente", "Cleiton").includes("Recusar proposta"),
    false,
  );
  assert.equal(
    html(accepted, "cliente", "Cleiton").includes("Rua Privada de Teste"),
    true,
  );
  assert.equal(
    html(accepted, "motorista", "Carlos Santos").includes(
      "Rua Privada de Teste",
    ),
    true,
  );
  assert.equal(
    html(accepted, "motorista", "Ana Oliveira").includes(
      "Rua Privada de Teste",
    ),
    false,
  );
});
