import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "../src/frontend/mocks/seed";
import {
  requestDraft,
  editRequest,
  cancelClientRequest,
} from "../src/frontend/features/requests/rules";
import {
  decodeDraft,
  emptyRequest,
  draftKey,
  clearRequestDrafts,
} from "../src/frontend/features/requests/drafts";
import { FreightProgress } from "../src/frontend/features/requests/FreightProgress";
import { acceptProposal } from "../src/frontend/features/freights/rules";
import {
  reviseOffer,
  proposalOffers,
} from "../src/frontend/features/freights/negotiation";
import { withNotifications } from "../src/frontend/features/notifications/rules";
function fixture() {
  const s = structuredClone(seed),
    f = s.freights.find((f) => f.id === "f1")!;
  const address = {
    label: "Casa",
    city: "Eunápolis",
    state: "BA",
    neighborhood: "Centro",
    street: "Rua Fictícia",
    number: "S/N",
    complement: "",
    point: { lat: -16.37, lng: -39.58 },
  };
  s.freightAddresses = {
    [f.id]: {
      pickup: structuredClone(address),
      delivery: { ...structuredClone(address), neighborhood: "Pequi" },
    },
  };
  return { s, f };
}
test("editing closes old offers, preserves conversations, updates private snapshot and prevents stale accept", () => {
  const { s, f } = fixture(),
    d = requestDraft(s, f);
  d.description += " Mais duas caixas.";
  const next = editRequest(s, f.id, d, 0);
  assert.equal(next.freights.find((x) => x.id === f.id)?.revision, 1);
  assert.ok(
    next.proposals
      .filter((p) => p.freightId === f.id)
      .every(
        (p) =>
          p.status === "ENCERRADA" &&
          proposalOffers(p).every((o) => o.status !== "PENDENTE"),
      ),
  );
  assert.deepEqual(next.messages, s.messages);
  assert.throws(() => acceptProposal(next, "p1"), /não está mais/);
  const stale = structuredClone(next);
  stale.proposals.find((p) => p.id === "p1")!.status = "PENDENTE";
  assert.throws(() => acceptProposal(stale, "p1"), /não está mais/);
  assert.throws(() => editRequest(next, f.id, d, 0), /mudou/);
  assert.equal(s.proposals[0].status, "PENDENTE");
  const p = next.proposals.find((p) => p.id === "p1")!;
  const revised = reviseOffer(next, p.id, {
    id: "revised",
    vehicle: p.vehicle,
    priceCents: 25000,
    message: "Novo valor após mudanças",
    availableAt: new Date(Date.now() + 86400000).toISOString(),
    status: "PENDENTE",
  });
  assert.equal(
    revised.proposals.find((p) => p.id === "p1")?.requestRevision,
    1,
  );
  assert.equal(
    acceptProposal(revised, "p1", "revised").freights.find((f) => f.id === "f1")
      ?.status,
    "AGENDADO",
  );
});
test("unchanged edit does not invalidate proposals and contracted requests cannot be edited", () => {
  const { s, f } = fixture();
  assert.equal(editRequest(s, f.id, requestDraft(s, f), 0), s);
  const accepted = acceptProposal(s, "p1");
  assert.throws(
    () => editRequest(accepted, f.id, requestDraft(s, f), 0),
    /contratada/,
  );
});
test("cancellation keeps agreement and chats, requires reason and forbids cancellation after transport starts", () => {
  const { s, f } = fixture(),
    accepted = acceptProposal(s, "p1");
  assert.throws(
    () => cancelClientRequest(accepted, f.id, "", "AGENDADO"),
    /motivo/,
  );
  const cancelled = cancelClientRequest(
    accepted,
    f.id,
    "Mudança de planos da família.",
    "AGENDADO",
  );
  const result = cancelled.freights.find((x) => x.id === f.id)!;
  assert.equal(result.status, "CANCELADO");
  assert.deepEqual(
    result.agreement,
    accepted.freights.find((x) => x.id === f.id)!.agreement,
  );
  assert.deepEqual(cancelled.messages, accepted.messages);
  assert.equal(result.cancellation?.previousStatus, "AGENDADO");
  assert.throws(
    () =>
      cancelClientRequest(cancelled, f.id, "Outro motivo válido.", "AGENDADO"),
    /Não é possível/,
  );
  accepted.freights.find((x) => x.id === f.id)!.status = "EM_TRANSPORTE";
  assert.throws(
    () =>
      cancelClientRequest(
        accepted,
        f.id,
        "Mudança de planos.",
        "EM_TRANSPORTE",
      ),
    /Não é possível/,
  );
});
test("draft decoding rejects corrupt, expired, malformed and oversized content; edit keys are versioned", () => {
  const draft = emptyRequest(),
    now = Date.now(),
    raw = JSON.stringify({ draft, step: 2, at: now });
  assert.deepEqual(decodeDraft(raw, now)?.draft, draft);
  assert.equal(decodeDraft(raw, now + 86400001), null);
  assert.equal(decodeDraft("bad"), null);
  assert.equal(
    decodeDraft(
      JSON.stringify({ draft: { ...draft, pickup: {} }, step: 2, at: now }),
    ),
    null,
  );
  assert.equal(decodeDraft(JSON.stringify({ draft, step: 9, at: now })), null);
  assert.notEqual(draftKey("f1", 0), draftKey("f1", 1));
  const map = new Map([
    [draftKey(), "saved"],
    ["other", "keep"],
  ]);
  clearRequestDrafts({
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] || null,
    removeItem: (k) => {
      map.delete(k);
    },
  } as Storage);
  assert.equal(map.size, 1);
  assert.equal(map.get("other"), "keep");
});
test("progress exposes current stage or cancellation, without inventing tracking data", () => {
  const { f } = fixture();
  const html = renderToStaticMarkup(
    <FreightProgress freight={{ ...f, status: "EM_TRANSPORTE" }} />,
  );
  assert.match(html, /aria-current="step"/);
  assert.match(html, /não representam rastreamento/);
  const cancelled = renderToStaticMarkup(
    <FreightProgress freight={{ ...f, status: "CANCELADO" }} />,
  );
  assert.match(cancelled, /Frete cancelado/);
  assert.doesNotMatch(cancelled, /aria-current/);
});
test("edited and cancelled requests notify participants without duplicate events", () => {
  const { s, f } = fixture();
  s.proposals[0].driverId = "demo-driver";
  const draft = requestDraft(s, f);
  draft.title += " alterado";
  const edited = withNotifications(s, editRequest(s, f.id, draft, 0));
  assert.ok(
    edited.notifications?.some(
      (n) => n.title === "Solicitação alterada" && n.role === "motorista",
    ),
  );
  const cancelled = withNotifications(
    edited,
    cancelClientRequest(edited, f.id, "Não preciso mais do serviço.", "ABERTO"),
  );
  assert.ok(
    cancelled.notifications?.some(
      (n) => n.title === "Frete cancelado pelo cliente",
    ),
  );
  assert.equal(
    withNotifications(edited, cancelled).notifications?.length,
    cancelled.notifications?.length,
  );
});
