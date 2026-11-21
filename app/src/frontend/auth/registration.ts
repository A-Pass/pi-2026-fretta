import type { Role } from "@/contracts";
import { validCpf } from "../features/onboarding/rules";

export type IdentityDocument = "cpf" | "rg" | "cnh";

export function identityDocumentError(
  role: Role,
  type: IdentityDocument,
  value: string,
): string {
  const document = value.replace(/[\s./-]/g, "").toUpperCase();
  if (role === "motorista") {
    if (
      type !== "cnh" ||
      !/^\d{11}$/.test(document) ||
      /^(\d)\1+$/.test(document)
    )
      return "Informe os 11 números da sua carteira de motorista.";
    return "";
  }
  if (type === "cpf" && !validCpf(value)) return "Confira o CPF informado.";
  if (type === "rg" && !/^[A-Z0-9]{5,20}$/.test(document))
    return "Informe um RG válido, com 5 a 20 letras ou números.";
  if (type === "cnh") return "Selecione CPF ou RG.";
  return "";
}
