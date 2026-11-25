import type { CorrectionItem } from "./index";

export const correctionLabels: Record<CorrectionItem, string> = {
  dados: "Dados pessoais",
  foto: "Foto do motorista",
  cnh: "CNH",
  veiculo: "Veículo",
};

export function isCorrectionItem(value: unknown): value is CorrectionItem {
  return typeof value === "string" && Object.hasOwn(correctionLabels, value);
}

export const adminReviewChecks = [
  { id: "dados", label: "Identificação e dados conferidos" },
  { id: "foto", label: "Foto do motorista conferida" },
  { id: "cnh", label: "Habilitação e validade conferidas" },
  { id: "veiculo", label: "Veículo e habilitação compatíveis" },
] as const;

export const correctionItems = [
  { id: "dados", label: "Identificação conferida" },
  { id: "foto", label: "Foto conferida" },
  { id: "cnh", label: "CNH e validade conferidas" },
  { id: "veiculo", label: "Veículo e habilitação compatíveis" },
] as const;

export const correctionFields: Record<
  (typeof correctionItems)[number]["id"],
  string[]
> = {
  dados: ["tipoPessoa", "nomeCompleto", "cpf", "cnpj", "razaoSocial"],
  foto: ["fotoPerfilId"],
  cnh: ["cnhNumero", "cnhCategoria", "cnhValidade", "documentoCnhId"],
  veiculo: ["veiculoId"],
};
