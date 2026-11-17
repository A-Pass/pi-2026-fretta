import { test } from "node:test";
import assert from "node:assert/strict";
import { prepareOnboardingPhoto } from "../src/frontend/features/onboarding/images";
import { seed } from "../src/frontend/mocks/seed";
import {
  driverCanPropose,
  licenseDateValid,
  maskDocument,
  onboardingError,
  simulateReview,
  submitDriverRegistration,
  validCnpj,
  validCpf,
  type DriverOnboardingDraft,
} from "../src/frontend/features/onboarding/rules";
const draft = (): DriverOnboardingDraft => ({
  fullName: "Motorista Demonstração",
  personType: "pf",
  cpf: "12345678909",
  cnpj: "12ABC34501DE35",
  companyName: "Empresa de Exemplo",
  profilePhoto: {
    dataUrl: "data:image/png;base64,PROFILE_DEMO",
    name: "perfil.png",
    type: "image/png",
    size: 5000,
    width: 480,
    height: 480,
  },
  licenseNumber: "12345678901",
  licenseCategory: "B",
  licenseExpiresOn: "2099-12-31",
  licensePhoto: {
    dataUrl: "data:image/png;base64,LICENSE_DEMO_NEVER_PERSIST",
    name: "cnh.png",
    type: "image/png",
    size: 8000,
    width: 900,
    height: 560,
  },
  vehicleId: "",
  vehicle: {
    id: "onboarding-vehicle",
    category: "Utilitário",
    model: "Veículo de exemplo",
    plate: "TST1A23",
    description: "Fictício",
  },
  confirmed: true,
});
test("CPF e CNPJ conferem dígitos verificadores e aceitam CNPJ alfanumérico da Receita", () => {
  assert.equal(validCpf("123.456.789-09"), true);
  assert.equal(validCpf("12345678900"), false);
  assert.equal(validCpf("11111111111"), false);
  assert.equal(validCpf("12345678909extra"), false);
  assert.equal(validCnpj("12.ABC.345/01DE-35"), true);
  assert.equal(validCnpj("12.ABC.345/01DE-34"), false);
  assert.equal(validCnpj("11.222.333/0001-81"), true);
  assert.equal(validCnpj("00000000000000"), false);
  assert.equal(validCnpj("12@ABC34501DE35"), false);
});
test("fotos, CPF, CNH não vencida e veículo são obrigatórios antes de enviar", () => {
  const store = structuredClone(seed),
    d = draft();
  for (let i = 1; i <= 5; i++) assert.equal(onboardingError(d, i, store), "");
  assert.notEqual(onboardingError({ ...d, profilePhoto: null }, 2, store), "");
  assert.notEqual(onboardingError({ ...d, licensePhoto: null }, 3, store), "");
  assert.notEqual(
    onboardingError({ ...d, licenseNumber: "00000000000" }, 3, store),
    "",
  );
  assert.notEqual(
    onboardingError({ ...d, licenseExpiresOn: "2020-01-01" }, 3, store),
    "",
  );
  assert.notEqual(
    onboardingError({ ...d, personType: "pj", cnpj: "invalid" }, 1, store),
    "",
  );
  assert.notEqual(
    onboardingError({ ...d, personType: "pj", companyName: "" }, 1, store),
    "",
  );
  assert.notEqual(onboardingError({ ...d, confirmed: false }, 5, store), "");
  assert.throws(() =>
    submitDriverRegistration(store, { ...d, licensePhoto: null }),
  );
});
test("resumo persiste sem CPF/CNPJ/CNH completos, imagem de CNH ou envio automático aprovado", () => {
  const d = { ...draft(), personType: "pj" as const },
    original = structuredClone(seed);
  const next = submitDriverRegistration(original, d);
  assert.equal(next.driverRegistration?.status, "EM_ANALISE");
  assert.equal(next.profile?.photo, d.profilePhoto!.dataUrl);
  assert.equal(next.vehicles?.length, 1);
  const persisted = JSON.stringify(next);
  for (const raw of [
    d.cpf,
    d.cnpj,
    d.licenseNumber,
    d.licensePhoto!.dataUrl,
    d.licensePhoto!.name,
  ])
    assert.equal(persisted.includes(raw), false);
  assert.equal(driverCanPropose(next), false);
  assert.equal(original.driverRegistration, undefined);
  assert.equal(maskDocument(d.cpf, "cpf"), "***.***.***-09");
});
test("aprovação simulada é explícita; pendência, validade ou falta de foto/veículo impedem novas propostas", () => {
  const submitted = submitDriverRegistration(structuredClone(seed), draft());
  assert.equal(driverCanPropose(seed), false);
  const approved = simulateReview(submitted, "APROVADO");
  assert.equal(driverCanPropose(approved), true);
  assert.equal(driverCanPropose(approved, "2100-01-01"), false);
  assert.equal(
    driverCanPropose({ ...approved, profile: { name: "Teste", photo: "" } }),
    false,
  );
  assert.equal(driverCanPropose({ ...approved, vehicles: [] }), false);
  const revision = simulateReview(submitted, "AJUSTES_SOLICITADOS");
  assert.equal(driverCanPropose(revision), false);
  assert.ok(revision.driverRegistration?.feedback);
  assert.throws(() => simulateReview(approved, "APROVADO"));
  assert.equal(licenseDateValid("2026-02-30", "2026-01-01"), false);
  assert.equal(licenseDateValid("2026-11-05", "2026-11-05"), true);
});
test("reutilizar veículo não duplica cadastro e reenvio volta para análise", () => {
  const store = { ...structuredClone(seed), vehicles: [draft().vehicle] };
  const d = { ...draft(), vehicleId: store.vehicles[0].id };
  const next = submitDriverRegistration(store, d);
  assert.equal(next.vehicles?.length, 1);
  const approved = simulateReview(next, "APROVADO");
  assert.equal(
    submitDriverRegistration(approved, d).driverRegistration?.status,
    "EM_ANALISE",
  );
  assert.notEqual(
    onboardingError({ ...d, vehicleId: "removed" }, 4, store),
    "",
  );
});

test("upload rejeita arquivo vazio, tipo não aceito e extensão PNG com conteúdo falso", async () => {
  await assert.rejects(() =>
    prepareOnboardingPhoto(new File([], "empty.png", { type: "image/png" })),
  );
  await assert.rejects(() =>
    prepareOnboardingPhoto(
      new File(["texto"], "documento.pdf", { type: "application/pdf" }),
    ),
  );
  await assert.rejects(() =>
    prepareOnboardingPhoto(
      new File(["isto não é uma imagem"], "fake.png", { type: "image/png" }),
    ),
  );
  await assert.rejects(() =>
    prepareOnboardingPhoto(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", {
        type: "image/png",
      }),
    ),
  );
});
