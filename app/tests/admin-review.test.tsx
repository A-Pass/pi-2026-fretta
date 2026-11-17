import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "../src/frontend/mocks/seed";
import {
  demoCases,
  reviewDemo,
  reviewVersion,
} from "../src/frontend/features/admin/rules";
import { AdminApp } from "../src/frontend/features/admin/AdminApp";
import { driverCanPropose } from "../src/frontend/features/onboarding/rules";
function pending() {
  const s = structuredClone(seed),
    example = demoCases(s)[0];
  s.driverRegistration = { ...example.registration };
  s.profile = {
    name: "Motorista de Teste",
    photo: "data:image/png;base64,TEST",
  };
  s.vehicles = example.vehicles;
  return s;
}
test("admin decision updates the actual demo registration and retains audit without private documents", () => {
  const s = pending(),
    c = demoCases(s)[0];
  assert.equal(driverCanPropose(s), false);
  const next = reviewDemo(
    s,
    c.id,
    reviewVersion(c),
    "APROVADO",
    "Conferência de exemplo",
    "2026-11-16T13:00:00Z",
  );
  assert.equal(driverCanPropose(next), true);
  assert.equal(next.adminReviews?.[0].actor, "Administrador de demonstração");
  assert.equal(next.adminReviews?.[0].decision, "APROVADO");
  assert.equal(s.driverRegistration?.status, "EM_ANALISE");
  assert.equal("licensePhoto" in next.driverRegistration!, false);
});
test("corrections need a usable reason and remain visible to the driver", () => {
  const s = pending(),
    c = demoCases(s)[0];
  assert.throws(
    () => reviewDemo(s, c.id, reviewVersion(c), "AJUSTES_SOLICITADOS", " "),
    /10 a 1000/,
  );
  const next = reviewDemo(
    s,
    c.id,
    reviewVersion(c),
    "AJUSTES_SOLICITADOS",
    "Reenvie uma imagem legível da CNH.",
  );
  assert.equal(
    next.driverRegistration?.feedback,
    "Reenvie uma imagem legível da CNH.",
  );
  assert.equal(driverCanPropose(next), false);
  assert.throws(
    () => reviewDemo(next, c.id, reviewVersion(c), "APROVADO", ""),
    /mudou/,
  );
});
test("approval rejects incomplete or expired driver data; examples do not approve the driver", () => {
  const s = pending(),
    c = demoCases(s)[0];
  s.driverRegistration!.license.expiresOn = "2020-01-01";
  assert.throws(
    () => reviewDemo(s, c.id, reviewVersion(c), "APROVADO", ""),
    /validade/,
  );
  const example = demoCases(s)[1];
  const next = reviewDemo(
    s,
    example.id,
    reviewVersion(example),
    "APROVADO",
    "",
  );
  assert.equal(next.driverRegistration?.status, "EM_ANALISE");
  assert.equal(demoCases(next)[1].registration.status, "APROVADO");
  assert.equal(next.adminReviews?.length, 1);
});
test("resubmission invalidates old review version and audit survives later decisions", () => {
  const s = pending(),
    c = demoCases(s)[0];
  const changed = reviewDemo(
    s,
    c.id,
    reviewVersion(c),
    "AJUSTES_SOLICITADOS",
    "Confira os dados enviados.",
  );
  changed.driverRegistration = {
    ...changed.driverRegistration!,
    status: "EM_ANALISE",
    submittedAt: "2026-11-17T12:00:00Z",
    reviewedAt: undefined,
  };
  assert.throws(
    () => reviewDemo(changed, c.id, reviewVersion(c), "APROVADO", ""),
    /mudou/,
  );
  const current = demoCases(changed)[0];
  const approved = reviewDemo(
    changed,
    c.id,
    reviewVersion(current),
    "APROVADO",
    "",
  );
  assert.equal(approved.adminReviews?.length, 2);
  assert.equal(approved.driverRegistration?.feedback, undefined);
});
test("admin workspace clearly labels demo and real mode never renders local records", () => {
  const before = process.env.NEXT_PUBLIC_API_MODE;
  try {
    process.env.NEXT_PUBLIC_API_MODE = "real";
    const markup = renderToStaticMarkup(<AdminApp />);
    assert.match(markup, /autorização no servidor/);
    assert.doesNotMatch(markup, /Carlos Almeida|Aprovar cadastro/);
  } finally {
    if (before === undefined) delete process.env.NEXT_PUBLIC_API_MODE;
    else process.env.NEXT_PUBLIC_API_MODE = before;
  }
});
