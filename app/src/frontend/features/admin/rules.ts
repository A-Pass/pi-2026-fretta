import type { AdminCase, AdminReview, Store } from "@/contracts";
import { licenseDateValid } from "../onboarding/rules";
export type { AdminCase, AdminReview } from "@/contracts";
export const reviewVersion = (c: AdminCase) =>
  [
    c.registration.submittedAt,
    c.registration.reviewedAt || "",
    c.registration.status,
  ].join("|");
export function demoCases(store: Store): AdminCase[] {
  const examples: AdminCase[] = ["Carlos Almeida", "Marina Souza"].map(
    (fullName, i) => ({
      id: `example-${i}`,
      photo: "",
      vehicles: [
        {
          id: `vehicle-${i}`,
          category: "Utilitário",
          model: "Fiorino fictícia",
          plate: "TST1A23",
          capacityKg: 600,
          description: "Exemplo sem documentos reais.",
        },
      ],
      registration: {
        mode: "demo",
        fullName,
        personType: i ? "pj" : "pf",
        companyName: i ? "Transportes Exemplo" : undefined,
        cpfMasked: "***.***.***-09",
        cnpjMasked: i ? "**.***.***/****-35" : undefined,
        license: {
          numberMasked: "*********01",
          category: "B",
          expiresOn: "2031-12-31",
        },
        documentsSubmitted: true,
        status: "EM_ANALISE",
        submittedAt: "2026-11-16T12:00:00Z",
      },
    }),
  );
  const cases = store.adminDemoCases || examples;
  return store.driverRegistration
    ? [
        {
          id: "demo-driver",
          registration: store.driverRegistration,
          photo: store.profile?.photo || "",
          vehicles: store.vehicles || [],
        },
        ...cases,
      ]
    : cases;
}
export function reviewDemo(
  store: Store,
  caseId: string,
  expectedVersion: string,
  decision: AdminReview["decision"],
  reason: string,
  now = new Date().toISOString(),
): Store {
  const c = demoCases(store).find((c) => c.id === caseId);
  if (
    !c ||
    reviewVersion(c) !== expectedVersion ||
    c.registration.status !== "EM_ANALISE"
  )
    throw Error(
      "Este cadastro mudou ou já foi analisado. Atualize a lista antes de decidir.",
    );
  if (!["APROVADO", "AJUSTES_SOLICITADOS"].includes(decision))
    throw Error("Decisão inválida.");
  const feedback = reason.trim();
  if (
    feedback.length > 1000 ||
    (decision === "AJUSTES_SOLICITADOS" && feedback.length < 10)
  )
    throw Error("Descreva as correções em 10 a 1000 caracteres.");
  if (
    decision === "APROVADO" &&
    (!c.registration.documentsSubmitted ||
      !licenseDateValid(c.registration.license.expiresOn) ||
      !c.vehicles.length ||
      (caseId === "demo-driver" && !c.photo))
  )
    throw Error(
      "Não é possível aprovar: confira foto, documentação, veículo e validade da CNH.",
    );
  const updated = {
    ...c,
    registration: {
      ...c.registration,
      status: decision,
      reviewedAt: now,
      feedback: decision === "AJUSTES_SOLICITADOS" ? feedback : undefined,
    },
  };
  const entry: AdminReview = {
    id: crypto.randomUUID(),
    caseId,
    version: expectedVersion,
    actor: "Administrador de demonstração",
    at: now,
    decision,
    reason: feedback,
  };
  return {
    ...store,
    ...(caseId === "demo-driver"
      ? { driverRegistration: updated.registration }
      : {}),
    adminDemoCases: demoCases(store)
      .filter((c) => c.id !== "demo-driver")
      .map((item) => (item.id === caseId ? updated : item)),
    adminReviews: [...(store.adminReviews || []), entry],
  };
}
