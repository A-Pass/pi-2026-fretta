import { prisma } from "../../../db/prisma";
import {
  salvarArquivoPrivado,
  removerArquivoPrivado,
} from "../storage/private-file-storage";

type TipoArquivo = "FOTO_PERFIL" | "CNH";

type SalvarDocumentoInput = {
  motorista_id: string;
  tipo: TipoArquivo;
  bytes: Buffer;
};

export async function salvarDocumentoMotorista({
  motorista_id,
  tipo,
  bytes,
}: SalvarDocumentoInput) {
  const arquivo = await salvarArquivoPrivado({
    bytes,
    tipo,
  });

  try {
    const registro = await prisma.arquivo_privado.create({
      data: {
        id: arquivo.id,
        motorista_id,
        tipo,
        chave_armazenamento: arquivo.chaveArmazenamento,
        mime_type: arquivo.mimeType,
        tamanho_bytes: arquivo.tamanhoBytes,
      },
    });

    return {
      id: registro.id,
      tipo: registro.tipo,
      criado_em: registro.criado_em,
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
  motorista_id: string,
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

  const documentos = await prisma.arquivo_privado.findMany({
    where: {
      motorista_id,
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
        documento.id === fotoPerfilId && documento.tipo === "FOTO_PERFIL",
    ) &&
    documentos.some(
      (documento) =>
        documento.id === documentoCnhId && documento.tipo === "CNH",
    )
  );
}
