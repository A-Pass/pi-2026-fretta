import { validarCPF } from "./cpf";
import { validarCNPJ } from "./cnpj";
import {
  validarNumeroCNH,
  validarCategoriaCNH,
  validarValidadeCNH,
} from "./cnh";

export interface CadastroMotoristaInput {
  tipoPessoa: "PF" | "PJ";
  nome_completo: string;
  cpf: string;
  cnpj?: string;
  razao_social?: string;
  cnh_numero: string;
  cnh_categoria: string;
  cnh_validade: string;
  veiculoId: string;
  fotoPerfilId?: string;
  documentoCnhId?: string;
}

export function validarCadastroMotorista(
  dados: CadastroMotoristaInput,
): string[] {
  const erros: string[] = [];

  if (dados.tipoPessoa !== "PF" && dados.tipoPessoa !== "PJ") {
    erros.push("Tipo de pessoa inválido.");
  }

  if (typeof dados.nome_completo !== "string" || !dados.nome_completo.trim()) {
    erros.push("Nome completo é obrigatório.");
  }

  if (typeof dados.cpf !== "string" || !validarCPF(dados.cpf)) {
    erros.push("CPF inválido.");
  }

  if (dados.tipoPessoa === "PJ") {
    if (typeof dados.cnpj !== "string" || !validarCNPJ(dados.cnpj)) {
      erros.push("CNPJ inválido.");
    }

    if (typeof dados.razao_social !== "string" || !dados.razao_social.trim()) {
      erros.push("Razão social é obrigatória.");
    }
  }

  if (
    typeof dados.cnh_numero !== "string" ||
    !validarNumeroCNH(dados.cnh_numero)
  ) {
    erros.push("Número da CNH inválido.");
  }

  if (
    typeof dados.cnh_categoria !== "string" ||
    !validarCategoriaCNH(dados.cnh_categoria)
  ) {
    erros.push("Categoria da CNH inválida.");
  }

  if (
    typeof dados.cnh_validade !== "string" ||
    !validarValidadeCNH(dados.cnh_validade)
  ) {
    erros.push("CNH vencida ou data inválida.");
  }

  if (typeof dados.veiculoId !== "string" || !dados.veiculoId.trim()) {
    erros.push("É necessário selecionar um veículo.");
  }

  return erros;
}
