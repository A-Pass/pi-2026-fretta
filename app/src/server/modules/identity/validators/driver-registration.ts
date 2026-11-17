import { validarCPF } from "./cpf";
import { validarCNPJ } from "./cnpj";
import {
  validarNumeroCNH,
  validarCategoriaCNH,
  validarValidadeCNH,
} from "./cnh";

export interface CadastroMotoristaInput {
  tipoPessoa: "PF" | "PJ";
  nomeCompleto: string;
  cpf: string;
  cnpj?: string;
  razaoSocial?: string;
  cnhNumero: string;
  cnhCategoria: string;
  cnhValidade: string;
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

  if (typeof dados.nomeCompleto !== "string" || !dados.nomeCompleto.trim()) {
    erros.push("Nome completo é obrigatório.");
  }

  if (typeof dados.cpf !== "string" || !validarCPF(dados.cpf)) {
    erros.push("CPF inválido.");
  }

  if (dados.tipoPessoa === "PJ") {
    if (typeof dados.cnpj !== "string" || !validarCNPJ(dados.cnpj)) {
      erros.push("CNPJ inválido.");
    }

    if (typeof dados.razaoSocial !== "string" || !dados.razaoSocial.trim()) {
      erros.push("Razão social é obrigatória.");
    }
  }

  if (
    typeof dados.cnhNumero !== "string" ||
    !validarNumeroCNH(dados.cnhNumero)
  ) {
    erros.push("Número da CNH inválido.");
  }

  if (
    typeof dados.cnhCategoria !== "string" ||
    !validarCategoriaCNH(dados.cnhCategoria)
  ) {
    erros.push("Categoria da CNH inválida.");
  }

  if (
    typeof dados.cnhValidade !== "string" ||
    !validarValidadeCNH(dados.cnhValidade)
  ) {
    erros.push("CNH vencida ou data inválida.");
  }

  if (typeof dados.veiculoId !== "string" || !dados.veiculoId.trim()) {
    erros.push("É necessário selecionar um veículo.");
  }

  return erros;
}
