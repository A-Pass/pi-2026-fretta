import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../../../db/prisma";
import { podeAlterarStatusCadastro } from "./registration-status";
import type { CadastroMotoristaInput } from "../validators/driver-registration";

type DadosCadastroCompleto = CadastroMotoristaInput & {
  fotoPerfilId: string;
  documentoCnhId: string;
};

export async function salvarCadastroMotorista(
  motoristaId: string,
  dados: DadosCadastroCompleto,
) {
  return prisma.$transaction(
    async (tx) => {
      const cadastroExistente = await tx.cadastroMotorista.findUnique({
        where: { motoristaId },
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

      await tx.pessoa.upsert({
        where: { userId: motoristaId },
        update: {
          nomeCompleto: dados.nomeCompleto.trim(),
          cpf: dados.cpf.replace(/\D/g, ""),
        },
        create: {
          userId: motoristaId,
          nomeCompleto: dados.nomeCompleto.trim(),
          cpf: dados.cpf.replace(/\D/g, ""),
        },
      });

      const dadosCadastro = {
        tipoPessoa: dados.tipoPessoa,
        cnpj:
          dados.tipoPessoa === "PJ"
            ? dados.cnpj?.replace(/\D/g, "") ?? null
            : null,
        razaoSocial:
          dados.tipoPessoa === "PJ"
            ? dados.razaoSocial?.trim() ?? null
            : null,
        cnhNumero: dados.cnhNumero.trim(),
        cnhCategoria: dados.cnhCategoria.trim(),
        cnhValidade: new Date(`${dados.cnhValidade}T12:00:00Z`),
        fotoPerfilId: dados.fotoPerfilId,
        documentoCnhId: dados.documentoCnhId,
        veiculoId: dados.veiculoId,
        status: "EM_ANALISE" as const,
        motivoAjuste: null,
        analisadoEm: null,
        enviadoEm: new Date(),
      };

      if (cadastroExistente) {
        return tx.cadastroMotorista.update({
          where: { motoristaId },
          data: dadosCadastro,
        });
      }

      return tx.cadastroMotorista.create({
        data: {
          ...dadosCadastro,
          motoristaId,
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}
