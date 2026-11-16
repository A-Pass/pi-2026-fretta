import { prisma } from "../../../db/prisma";
import {
  salvarArquivoPrivado,
  removerArquivoPrivado,
} from "../storage/private-file-storage";

type TipoArquivo = "FOTO_PERFIL" | "CNH";

type SalvarDocumentoInput = {
  motoristaId: string;
  tipo: TipoArquivo;
  bytes: Buffer;
};

export async function salvarDocumentoMotorista({
  motoristaId,
  tipo,
  bytes,
}: SalvarDocumentoInput) {
  const arquivo = await salvarArquivoPrivado({
    bytes,
    tipo,
  });

  try {
    const registro = await prisma.arquivoPrivado.create({
      data: {
        id: arquivo.id,
        motoristaId,
        tipo,
        chaveArmazenamento: arquivo.chaveArmazenamento,
        mimeType: arquivo.mimeType,
        tamanhoBytes: arquivo.tamanhoBytes,
      },
    });

    return {
      id: registro.id,
      tipo: registro.tipo,
      criadoEm: registro.criadoEm,
    };
  } catch (error) {
    try {
      await removerArquivoPrivado(arquivo.chaveArmazenamento);
    } catch (erroLimpeza) {
      console.error(
        "Falha ao remover arquivo após erro de persistência:",
        erroLimpeza,
      );
    }

    throw error;
  }
}
