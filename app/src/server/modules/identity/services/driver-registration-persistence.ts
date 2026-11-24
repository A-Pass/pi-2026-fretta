import { randomUUID } from "node:crypto";
import { correctionItems } from "@/contracts/driver-corrections";
import { Prisma } from "@/server/generated/prisma/client";
import { prisma } from "../../../db/prisma";
import { podeAlterarStatusCadastro } from "./registration-status";
import type { CadastroMotoristaInput } from "../validators/driver-registration";

type DadosCadastroCompleto = CadastroMotoristaInput & {
  fotoPerfilId: string;
  documentoCnhId: string;
};

export async function salvarCadastroMotorista(
  motorista_id: string,
  dados: DadosCadastroCompleto,
  correctionVersion?: Date,
) {
  return prisma.$transaction(
    async (tx) => {
      const cadastroExistente = await tx.cadastro_motorista.findUnique({
        where: { motorista_id },
      });

      if (
        cadastroExistente &&
        !podeAlterarStatusCadastro(
          cadastroExistente.status,
          "EM_ANALISE",
          "MOTORISTA",
        )
      ) {
        throw new Error("REGISTRATION_NOT_EDITABLE");
      }

      if (
        correctionVersion &&
        cadastroExistente?.atualizado_em.getTime() !==
          correctionVersion.getTime()
      )
        throw new Error("REGISTRATION_NOT_EDITABLE");
      if (cadastroExistente?.itens_ajuste.length && !correctionVersion)
        throw new Error("REGISTRATION_NOT_EDITABLE");

      await tx.pessoa.upsert({
        where: { user_id: motorista_id },
        update: {
          nome_completo: dados.nome_completo.trim(),
          cpf: dados.cpf.replace(/\D/g, ""),
        },
        create: {
          user_id: motorista_id,
          nome_completo: dados.nome_completo.trim(),
          cpf: dados.cpf.replace(/\D/g, ""),
          atualizado_em: new Date(),
        },
      });

      const dadosCadastro = {
        id: cadastroExistente?.id ?? randomUUID(),
        tipo_pessoa: dados.tipoPessoa,
        cnpj:
          dados.tipoPessoa === "PJ"
            ? (dados.cnpj?.replace(/\D/g, "") ?? null)
            : null,
        razao_social:
          dados.tipoPessoa === "PJ"
            ? (dados.razao_social?.trim() ?? null)
            : null,
        cnh_numero: dados.cnh_numero.trim(),
        cnh_categoria: dados.cnh_categoria.trim(),
        cnh_validade: new Date(`${dados.cnh_validade}T12:00:00Z`),
        foto_perfil_id: dados.fotoPerfilId,
        documento_cnh_id: dados.documentoCnhId,
        veiculo_id: dados.veiculoId,
        atualizado_em: new Date(),
        status: "EM_ANALISE" as const,
        motivo_ajuste: null,
        itens_ajuste: [],
        itens_conferidos:
          correctionVersion && cadastroExistente
            ? correctionItems
                .filter(
                  (item) => !cadastroExistente.itens_ajuste.includes(item.id),
                )
                .map((item) => item.id)
            : [],
        analisado_em: null,
        enviado_em: new Date(),
      };

      if (cadastroExistente) {
        return tx.cadastro_motorista.update({
          where: { motorista_id },
          data: dadosCadastro,
        });
      }

      return tx.cadastro_motorista.create({
        data: {
          ...dadosCadastro,
          motorista_id,
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}
