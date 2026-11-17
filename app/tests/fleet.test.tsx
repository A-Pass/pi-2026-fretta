import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "../src/frontend/mocks/seed";
import type { ProposalOffer } from "../src/contracts";
import {
  MANAGER,
  createDemoCompany,
  fleetState,
  lookupDriver,
  inviteDriver,
  answerInvite,
  cancelInvite,
  invitePending,
  changeMember,
  saveFleetVehicles,
  assignService,
  answerService,
  sendCompanyProposal,
  employeeServices,
  startCompanyTransport,
  cancelDispatch,
  dispatchLive,
} from "../src/frontend/features/fleet/rules";
import {
  demoCases,
  reviewDemo,
  reviewVersion,
} from "../src/frontend/features/admin/rules";
import { acceptProposal } from "../src/frontend/features/freights/rules";
import {
  publicProvider,
  providerId,
} from "../src/frontend/features/providers/rules";
import { withNotifications } from "../src/frontend/features/notifications/rules";
import { FleetWorkspace } from "../src/frontend/features/fleet/FleetWorkspace";
function base() {
  const s = createDemoCompany(structuredClone(seed), "Empresa Exemplo");
  s.freights.find((f) => f.id === "f1")!.vehicle = "Utilitário";
  return s;
}
function member() {
  let s = base();
  s = inviteDriver(s, MANAGER, "fleet-carlos");
  s = answerInvite(s, "fleet-carlos", s.fleet!.invites[0].id, true);
  return changeMember(s, MANAGER, "fleet-carlos", "activate");
}
function assigned() {
  let s = member();
  s = saveFleetVehicles(s, MANAGER, [
    {
      id: "fleet-van",
      category: "Utilitário",
      model: "Fiorino fictícia",
      plate: "TST1A23",
      capacityKg: 600,
      description: "",
    },
  ]);
  return assignService(s, MANAGER, "fleet-carlos", "fleet-van", "f1");
}
function offer(): ProposalOffer {
  return {
    id: crypto.randomUUID(),
    vehicleId: "fleet-van",
    vehicle: "Utilitário · Fiorino fictícia",
    priceCents: 24000,
    availableAt: new Date(Date.now() + 86400000).toISOString(),
    message: "Posso transportar os itens protegidos.",
    status: "PENDENTE",
  };
}
test("public code lookup exposes only safe fields and invitations require manager and explicit recipient consent", () => {
  let s = base();
  const found = lookupDriver(s, " frt-7k9p2x ");
  assert.equal(found?.id, "fleet-carlos");
  assert.deepEqual(Object.keys(found!).sort(), ["code", "id", "name", "photo"]);
  assert.equal(lookupDriver(s, "unknown"), null);
  assert.throws(
    () => inviteDriver(s, "fleet-carlos", "fleet-marina"),
    /permissão/,
  );
  s = inviteDriver(s, MANAGER, "fleet-carlos");
  assert.equal(s.fleet!.members.length, 0);
  assert.throws(() => inviteDriver(s, MANAGER, "fleet-carlos"), /pendente/);
  assert.throws(
    () => answerInvite(s, "fleet-marina", s.fleet!.invites[0].id, true),
    /conta/,
  );
  s = answerInvite(s, "fleet-carlos", s.fleet!.invites[0].id, true);
  assert.equal(s.fleet!.members[0].activeSeat, false);
  assert.throws(() => inviteDriver(s, MANAGER, "fleet-carlos"), /participa/);
  assert.throws(
    () => answerInvite(s, "fleet-carlos", s.fleet!.invites[0].id, true),
    /disponível/,
  );
});
test("expired, rejected and cancelled invitations never create memberships", () => {
  const now = Date.now();
  let s = inviteDriver(base(), MANAGER, "fleet-carlos", now),
    id = s.fleet!.invites[0].id;
  assert.equal(invitePending(s.fleet!.invites[0], now + 7 * 86400000), false);
  assert.throws(
    () => answerInvite(s, "fleet-carlos", id, true, now + 7 * 86400000),
    /expirou/,
  );
  s = cancelInvite(s, MANAGER, id);
  assert.throws(() => answerInvite(s, "fleet-carlos", id, true), /disponível/);
  s = inviteDriver(s, MANAGER, "fleet-carlos");
  s = answerInvite(s, "fleet-carlos", s.fleet!.invites.at(-1)!.id, false);
  assert.equal(s.fleet!.members.length, 0);
});
test("joining does not approve driver; platform admin reviews staff without requiring a personal vehicle", () => {
  let s = inviteDriver(base(), MANAGER, "fleet-marina");
  s = answerInvite(s, "fleet-marina", s.fleet!.invites[0].id, true);
  assert.throws(
    () => changeMember(s, MANAGER, "fleet-marina", "activate"),
    /aprovado/,
  );
  const c = demoCases(s).find((c) => c.id === "fleet-marina")!;
  s = reviewDemo(s, c.id, reviewVersion(c), "APROVADO", "");
  assert.equal(
    s.fleet!.people.find((p) => p.id === c.id)!.registration.status,
    "APROVADO",
  );
  assert.ok(!s.adminDemoCases?.some((c) => c.id === "fleet-marina"));
  s = changeMember(s, MANAGER, "fleet-marina", "activate");
  assert.equal(s.fleet!.members[0].activeSeat, true);
});
test("assignment is distinct from invitation, scoped to driver, and requires consent before customer proposal", () => {
  let s = assigned(),
    d = s.fleet!.dispatches[0];
  assert.equal(employeeServices(s, "fleet-marina").length, 0);
  assert.equal(employeeServices(s, "fleet-carlos").length, 1);
  assert.throws(
    () => sendCompanyProposal(s, MANAGER, d.id, offer()),
    /aceitar/,
  );
  assert.throws(() => answerService(s, "fleet-marina", d.id, true), /conta/);
  s = answerService(s, "fleet-carlos", d.id, true);
  s = sendCompanyProposal(s, MANAGER, d.id, offer());
  const p = s.proposals.at(-1)!;
  assert.equal(p.driverId, "fleet-carlos");
  assert.equal(p.companyId, "demo-company");
  assert.equal(providerId(p), "demo-company");
  assert.equal(p.providerName, "Empresa Exemplo");
  assert.throws(() => sendCompanyProposal(s, MANAGER, d.id, offer()), /válida/);
  const publicProfile = publicProvider(s, "demo-company")!;
  assert.equal(publicProfile.kind, "empresa");
  assert.ok(!JSON.stringify(publicProfile).includes("TST1A23"));
  s = acceptProposal(s, p.id);
  assert.equal(
    s.freights.find((f) => f.id === "f1")!.agreement!.driver,
    "Carlos Almeida · exemplo",
  );
  assert.throws(
    () => startCompanyTransport(s, "fleet-marina", d.id),
    /designado/,
  );
  s = startCompanyTransport(s, "fleet-carlos", d.id);
  assert.equal(s.freights.find((f) => f.id === "f1")!.status, "EM_TRANSPORTE");
});
test("cannot remove or deactivate member or modify vehicle during a live assignment; manager can withdraw unquoted assignment", () => {
  let s = assigned(),
    d = s.fleet!.dispatches[0];
  assert.throws(
    () => changeMember(s, MANAGER, "fleet-carlos", "remove"),
    /aberto/,
  );
  assert.throws(
    () => changeMember(s, "fleet-carlos", "fleet-carlos", "leave"),
    /aberto/,
  );
  assert.throws(() => saveFleetVehicles(s, MANAGER, []), /atribuição/);
  assert.throws(
    () => assignService(s, MANAGER, "fleet-carlos", "fleet-van", "f1"),
    /aberto/,
  );
  s = cancelDispatch(s, MANAGER, d.id);
  assert.equal(dispatchLive(s, s.fleet!.dispatches[0]), false);
  s = changeMember(s, "fleet-carlos", "fleet-carlos", "leave");
  assert.ok(s.fleet!.members[0].leftAt);
  assert.equal(s.fleet!.dispatches.length, 1);
});
test("closed or revised client requests prevent stale company offers", () => {
  let s = assigned(),
    id = s.fleet!.dispatches[0].id;
  s = answerService(s, "fleet-carlos", id, true);
  s.freights.find((f) => f.id === "f1")!.status = "AGENDADO";
  assert.throws(() => sendCompanyProposal(s, MANAGER, id, offer()), /válida/);
  s.freights.find((f) => f.id === "f1")!.status = "ABERTO";
  s.freights.find((f) => f.id === "f1")!.revision = 1;
  assert.throws(() => sendCompanyProposal(s, MANAGER, id, offer()), /válida/);
});
test("primary driver gets one company invite notification and no price is assigned to the plan", () => {
  const s = base(),
    next = withNotifications(s, inviteDriver(s, MANAGER, "demo-driver"));
  assert.equal(next.notifications?.filter((n) => n.companyInviteId).length, 1);
  assert.equal(
    withNotifications(s, next).notifications?.length,
    next.notifications?.length,
  );
  assert.ok(!("priceCents" in next.fleet!));
});
test("real mode never renders fictional company data", () => {
  const before = process.env.NEXT_PUBLIC_API_MODE;
  try {
    process.env.NEXT_PUBLIC_API_MODE = "real";
    const html = renderToStaticMarkup(
      <FleetWorkspace embeddedStore={base()} />,
    );
    assert.doesNotMatch(
      html,
      /Carlos Almeida|Criar empresa de demonstração|Simular conta/,
    );
    assert.match(html, /indisponível/);
  } finally {
    if (before === undefined) delete process.env.NEXT_PUBLIC_API_MODE;
    else process.env.NEXT_PUBLIC_API_MODE = before;
  }
});
