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
export async function verificarDocumentosMotorista(
  motoristaId: string,
  fotoPerfilId: string,
  documentoCnhId: string,
): Promise<boolean> {
  if (
    !fotoPerfilId.trim() ||
    !documentoCnhId.trim() ||
    fotoPerfilId === documentoCnhId
  ) {
    return false;
  }

  const documentos = await prisma.arquivoPrivado.findMany({
    where: {
      motoristaId,
      id: {
        in: [fotoPerfilId, documentoCnhId],
      },
    },
    select: {
      id: true,
      tipo: true,
    },
  });

  return (
    documentos.length === 2 &&
    documentos.some(
      (documento) =>
        documento.id === fotoPerfilId &&
        documento.tipo === "FOTO_PERFIL",
    ) &&
    documentos.some(
      (documento) =>
        documento.id === documentoCnhId &&
        documento.tipo === "CNH",
    )
  );
}