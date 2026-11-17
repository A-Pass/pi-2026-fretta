import type {
  AdminCase,
  AdminReview,
  Store,
  CorrectionItem,
} from "@/contracts";
import { licenseDateValid } from "../onboarding/rules";
export type { AdminCase, AdminReview } from "@/contracts";
export const correctionLabels: Record<CorrectionItem, string> = {
  dados: "Dados pessoais",
  foto: "Foto do motorista",
  cnh: "CNH",
  veiculo: "Veículo",
};
export function caseWarnings(c: AdminCase) {
  const warnings: string[] = [];
  if (!c.photo) warnings.push("Foto do motorista ausente.");
  if (!c.registration.documentsSubmitted)
    warnings.push("Documentação não enviada.");
  if (!licenseDateValid(c.registration.license.expiresOn))
    warnings.push("CNH vencida ou com validade inválida.");
  if (!c.vehicles.length && !c.fleetCompanyId)
    warnings.push("Nenhum veículo cadastrado.");
  else if (
    c.vehicles.some(
      (v) => !v.model.trim() || !v.plate.trim() || !v.category.trim(),
    )
  )
    warnings.push("Há um veículo com dados incompletos.");
  return warnings;
}
export const reviewVersion = (c: AdminCase) =>
  [
    c.registration.submittedAt,
    c.registration.reviewedAt || "",
    c.registration.status,
    String(c.registration.submissionCount || 1),
  ].join("|");
export function demoCases(store: Store): AdminCase[] {
  const examples: AdminCase[] = ["Carlos Almeida", "Marina Souza"].map(
    (fullName, i) => ({
      id: `example-${i}`,
      photo: "/admin-avatar-example.svg",
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
  const cases = (store.adminDemoCases || examples).map((c) =>
    ["example-0", "example-1"].includes(c.id) && !c.photo
      ? { ...c, photo: "/admin-avatar-example.svg" }
      : c,
  );
  const fleetCases: AdminCase[] = (store.fleet?.people || [])
    .filter((p) => p.id !== "demo-driver")
    .map((p) => ({
      id: p.id,
      registration: p.registration,
      photo: p.photo,
      vehicles: [],
      fleetCompanyId: store.fleet!.company.id,
    }));
  return store.driverRegistration
    ? [
        {
          id: "demo-driver",
          registration: store.driverRegistration,
          photo: store.profile?.photo || "",
          vehicles: store.vehicles || [],
        },
        ...cases.filter((c) => !fleetCases.some((f) => f.id === c.id)),
        ...fleetCases,
      ]
    : [
        ...cases.filter((c) => !fleetCases.some((f) => f.id === c.id)),
        ...fleetCases,
      ];
}
export function reviewDemo(
  store: Store,
  caseId: string,
  expectedVersion: string,
  decision: AdminReview["decision"],
  reason: string,
  now = new Date().toISOString(),
  correctionItems: CorrectionItem[] = [],
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
  const items = [...new Set(correctionItems)];
  if (
    items.some((item) => !Object.hasOwn(correctionLabels, item)) ||
    (decision === "AJUSTES_SOLICITADOS" && !items.length)
  )
    throw Error("Selecione ao menos um item para corrigir.");
  if (decision === "APROVADO" && caseWarnings(c).length)
    throw Error(
      "Não é possível aprovar: confira foto, documentação, veículo e validade da CNH.",
    );
  const updated = {
    ...c,
    registration: {
      ...c.registration,
      status: decision,
      reviewedAt: now,
      correctionItems: decision === "AJUSTES_SOLICITADOS" ? items : undefined,
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
    correctionItems: decision === "AJUSTES_SOLICITADOS" ? items : [],
  };
  return {
    ...store,
    ...(caseId === "demo-driver"
      ? { driverRegistration: updated.registration }
      : {}),
    ...(c.fleetCompanyId && store.fleet
      ? {
          fleet: {
            ...store.fleet,
            people: store.fleet.people.map((p) =>
              p.id === caseId
                ? { ...p, registration: updated.registration }
                : p,
            ),
          },
        }
      : {}),
    adminDemoCases: demoCases(store)
      .filter((c) => c.id !== "demo-driver" && !c.fleetCompanyId)
      .map((item) => (item.id === caseId ? updated : item)),
    adminReviews: [...(store.adminReviews || []), entry],
  };
}
