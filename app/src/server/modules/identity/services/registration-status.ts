import type { status_cadastro_motorista } from "@/server/generated/prisma/client";

export type AtorCadastro = "MOTORISTA" | "ADMIN";

export function podeAlterarStatusCadastro(
  statusAtual: status_cadastro_motorista,
  novoStatus: status_cadastro_motorista,
  ator: AtorCadastro,
): boolean {
  // O motorista apenas reenvia um cadastro
  // que recebeu solicitação de ajustes.
  if (ator === "MOTORISTA") {
    return statusAtual === "AJUSTES_SOLICITADOS" && novoStatus === "EM_ANALISE";
  }

  // O administrador pode aprovar
  // ou solicitar ajustes em cadastros em análise.
  if (ator === "ADMIN") {
    return (
      statusAtual === "EM_ANALISE" &&
      (novoStatus === "APROVADO" || novoStatus === "AJUSTES_SOLICITADOS")
    );
  }

  return false;
}
