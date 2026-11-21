import type { DriverRegistration, Store, Vehicle } from "@/contracts";
import { todayLocal } from "../addresses/rules";
import { validateVehicle } from "../vehicles/rules";
export type PreparedPhoto = {
  dataUrl: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};
export type DriverOnboardingDraft = {
  fullName: string;
  personType: "pf" | "pj";
  cpf: string;
  cnpj: string;
  companyName: string;
  profilePhoto: PreparedPhoto | null;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiresOn: string;
  licensePhoto: PreparedPhoto | null;
  vehicleId: string;
  vehicle: Vehicle;
  confirmed: boolean;
};
export const licenseCategories = ["B", "AB", "C", "AC", "D", "AD", "E", "AE"];
const compact = (value: string) => value.replace(/[\s.\/-]/g, "").toUpperCase();
const digit = (sum: number) => (sum % 11 < 2 ? 0 : 11 - (sum % 11));
/** Check digits catch typing errors; they do not confirm identity or government registration. */
export function validCpf(value: string): boolean {
  const cpf = compact(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (length: number) =>
    digit(
      [...cpf.slice(0, length)].reduce(
        (sum, char, i) => sum + Number(char) * (length + 1 - i),
        0,
      ),
    );
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}
/** Receita Federal DV rules support both numeric and alphanumeric CNPJ. */
export function validCnpj(value: string): boolean {
  const cnpj = compact(value);
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^(.)\1+$/.test(cnpj)) return false;
  function calc(base: string) {
    let weight = 2,
      sum = 0;
    for (let i = base.length - 1; i >= 0; i--) {
      sum += (base.charCodeAt(i) - 48) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    return String(digit(sum));
  }
  const first = calc(cnpj.slice(0, 12));
  return cnpj.slice(12) === first + calc(cnpj.slice(0, 12) + first);
}
export function maskDocument(value: string, kind: "cpf" | "cnpj" | "cnh") {
  const suffix = compact(value).slice(-2);
  return kind === "cpf"
    ? `***.***.***-${suffix}`
    : kind === "cnpj"
      ? `**.***.***/****-${suffix}`
      : `*********${suffix}`;
}
export function licenseDateValid(value: string, today = todayLocal()) {
  const date = new Date(`${value}T12:00:00Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= today
  );
}
export function photoValid(photo: PreparedPhoto | null) {
  return (
    !!photo &&
    ["image/jpeg", "image/png", "image/webp"].includes(photo.type) &&
    photo.size > 0 &&
    photo.size <= 5 * 1024 * 1024 &&
    photo.width >= 200 &&
    photo.height >= 200 &&
    /^data:image\/(jpeg|png|webp);base64,/.test(photo.dataUrl)
  );
}
export function onboardingError(
  draft: DriverOnboardingDraft,
  step: number,
  store: Store,
): string {
  if (step === 1) {
    if (
      draft.fullName.trim().split(/\s+/).filter(Boolean).length < 2 ||
      draft.fullName.trim().length > 120
    )
      return "Informe seu nome completo, como aparece no documento.";
    if (!validCpf(draft.cpf))
      return "Confira o CPF: os números informados não passaram na validação.";
    if (
      draft.personType === "pj" &&
      (!validCnpj(draft.cnpj) || !draft.companyName.trim())
    )
      return "Informe a razão social e um CNPJ válido para a empresa.";
  }
  if (step === 2 && !photoValid(draft.profilePhoto))
    return "Adicione uma foto de perfil JPG, PNG ou WebP, com pelo menos 200 × 200 pixels.";
  if (step === 3) {
    if (
      !/^\d{11}$/.test(draft.licenseNumber) ||
      /^(\d)\1+$/.test(draft.licenseNumber)
    )
      return "Informe os 11 números do registro da CNH.";
    if (!licenseCategories.includes(draft.licenseCategory))
      return "Selecione a categoria informada na sua CNH.";
    if (!licenseDateValid(draft.licenseExpiresOn))
      return "Informe uma data de validade válida e não vencida para a CNH.";
    if (!photoValid(draft.licensePhoto))
      return "Adicione uma imagem legível da CNH em JPG, PNG ou WebP, com pelo menos 200 × 200 pixels.";
  }
  if (step === 4) {
    const vehicle = draft.vehicleId
      ? store.vehicles?.find((v) => v.id === draft.vehicleId)
      : draft.vehicle;
    if (!vehicle)
      return "Selecione um veículo cadastrado ou preencha os dados de um novo veículo.";
    return validateVehicle(vehicle, store.vehicles || []);
  }
  if (step === 5 && !draft.confirmed)
    return "Confirme que conferiu os dados e as imagens antes de enviar.";
  return "";
}
export function submitDriverRegistration(
  store: Store,
  draft: DriverOnboardingDraft,
): Store {
  for (let step = 1; step <= 5; step++) {
    const error = onboardingError(draft, step, store);
    if (error) throw new Error(error);
  }
  const registration: DriverRegistration = {
    mode: "real",
    status: "EM_ANALISE",
    fullName: draft.fullName.trim(),
    personType: draft.personType,
    cpfMasked: maskDocument(draft.cpf, "cpf"),
    ...(draft.personType === "pj"
      ? {
          cnpjMasked: maskDocument(draft.cnpj, "cnpj"),
          companyName: draft.companyName.trim(),
        }
      : {}),
    license: {
      numberMasked: maskDocument(draft.licenseNumber, "cnh"),
      category: draft.licenseCategory,
      expiresOn: draft.licenseExpiresOn,
    },
    documentsSubmitted: true,
    submittedAt: new Date().toISOString(),
  };
  // Raw tax IDs, CNH number and CNH image must only be transmitted by a private authorized upload flow.
  return {
    ...store,
    driverRegistration: registration,
    profile: {
      name: draft.fullName.trim(),
      photo: draft.profilePhoto!.dataUrl,
    },
    vehicles: draft.vehicleId
      ? [...(store.vehicles || [])]
      : [
          ...(store.vehicles || []),
          {
            ...draft.vehicle,
            model: draft.vehicle.model.trim(),
            description: draft.vehicle.description.trim(),
          },
        ],
  };
}
export function driverCanPropose(store: Store, today = todayLocal()) {
  const registration = store.driverRegistration;
  return (
    !!registration &&
    registration.status === "APROVADO" &&
    registration.documentsSubmitted &&
    licenseDateValid(registration.license.expiresOn, today) &&
    !!store.profile?.photo &&
    !!store.vehicles?.length
  );
}
export function simulateReview(
  store: Store,
  status: "APROVADO" | "AJUSTES_SOLICITADOS",
): Store {
  if (
    !store.driverRegistration ||
    store.driverRegistration.status !== "EM_ANALISE"
  )
    throw new Error("Não há um cadastro aguardando análise.");
  if (
    status === "APROVADO" &&
    (!licenseDateValid(store.driverRegistration.license.expiresOn) ||
      !store.profile?.photo ||
      !store.vehicles?.length)
  )
    throw new Error(
      "Complete a foto, o veículo e uma CNH não vencida antes de enviar propostas.",
    );
  return {
    ...store,
    driverRegistration: {
      ...store.driverRegistration,
      status,
      reviewedAt: new Date().toISOString(),
      feedback:
        status === "AJUSTES_SOLICITADOS"
          ? "Exemplo de solicitação de ajustes: reenvie uma imagem mais legível da CNH e confira os dados informados."
          : undefined,
    },
  };
}
