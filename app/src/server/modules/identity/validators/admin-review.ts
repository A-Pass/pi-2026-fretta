export type DecisaoAdministrativa = "APROVADO" | "AJUSTES_SOLICITADOS";

export type ItemCorrecao = "dados" | "foto" | "cnh" | "veiculo";

export type RevisaoAdministrativaInput = {
  decision: DecisaoAdministrativa;
  reason: string | null;
  correctionItems: ItemCorrecao[];
  expectedVersion: number;
};

const itensPermitidos: ItemCorrecao[] = ["dados", "foto", "cnh", "veiculo"];

export function validarRevisaoAdministrativa(
  entrada: unknown,
): RevisaoAdministrativaInput | null {
  if (
    typeof entrada !== "object" ||
    entrada === null ||
    Array.isArray(entrada)
  ) {
    return null;
  }

  const dados = entrada as Record<string, unknown>;

  if (
    dados.decision !== "APROVADO" &&
    dados.decision !== "AJUSTES_SOLICITADOS"
  ) {
    return null;
  }

  if (
    typeof dados.expectedVersion !== "number" ||
    !Number.isSafeInteger(dados.expectedVersion) ||
    dados.expectedVersion < 1
  ) {
    return null;
  }

  if (
    !Array.isArray(dados.correctionItems) ||
    !dados.correctionItems.every(
      (item) =>
        typeof item === "string" &&
        itensPermitidos.includes(item as ItemCorrecao),
    )
  ) {
    return null;
  }

  const itens = dados.correctionItems as ItemCorrecao[];

  if (new Set(itens).size !== itens.length) {
    return null;
  }

  if (dados.decision === "AJUSTES_SOLICITADOS") {
    if (
      typeof dados.reason !== "string" ||
      dados.reason.trim().length < 10 ||
      dados.reason.trim().length > 1000 ||
      itens.length === 0
    ) {
      return null;
    }
  } else {
    if (
      itens.length !== 0 ||
      (dados.reason !== undefined &&
        dados.reason !== null &&
        dados.reason !== "")
    ) {
      return null;
    }
  }

  return {
    decision: dados.decision,
    reason:
      dados.decision === "AJUSTES_SOLICITADOS"
        ? (dados.reason as string).trim()
        : null,
    correctionItems: itens,
    expectedVersion: dados.expectedVersion,
  };
}
