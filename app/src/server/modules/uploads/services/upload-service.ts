import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { prisma } from "@/server/db/prisma";

const DIRETORIO_UPLOADS = path.resolve(process.cwd(), "storage", "uploads");

const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const DIMENSAO_MAXIMA = 6000;

export class UploadError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export type FinalidadeUpload =
  "freight" | "profile" | "company" | "company-proof";

export async function salvarUpload(
  usuarioId: string,
  bytes: Buffer,
  finalidade: FinalidadeUpload,
) {
  if (
    !["freight", "profile", "company", "company-proof"].includes(finalidade)
  ) {
    throw new UploadError(
      "INVALID_UPLOAD_PURPOSE",
      "Finalidade de upload inválida.",
      422,
    );
  }
  if (bytes.length === 0 || bytes.length > TAMANHO_MAXIMO) {
    throw new UploadError(
      "INVALID_FILE_SIZE",
      "A imagem deve ter no máximo 5 MB e não pode estar vazia.",
      422,
    );
  }

  const pdf =
    finalidade === "company-proof" &&
    /^%PDF-[12]\.\d[\r\n]/.test(bytes.subarray(0, 16).toString("ascii")) &&
    /%%EOF[\x00\t\r\n ]*$/.test(bytes.subarray(-1024).toString("ascii"));
  const conteudo = pdf ? bytes : await normalizarImagem(bytes, finalidade);
  const mimeType = pdf ? "application/pdf" : "image/jpeg";

  const arquivoId = randomUUID();
  const chaveArmazenamento = `${arquivoId}.${pdf ? "pdf" : "jpg"}`;

  await mkdir(DIRETORIO_UPLOADS, { recursive: true });

  const caminho = path.join(DIRETORIO_UPLOADS, chaveArmazenamento);

  const arquivo = await open(caminho, "wx", 0o600);

  let gravacaoConcluida = false;

  try {
    await arquivo.writeFile(conteudo);
    gravacaoConcluida = true;
  } finally {
    await arquivo.close();

    if (!gravacaoConcluida) {
      await unlink(caminho).catch(() => {});
    }
  }

  try {
    const registro = await prisma.arquivoUpload.create({
      data: {
        id: arquivoId,
        usuarioId,
        finalidade,
        chaveArmazenamento,
        mimeType,
        tamanhoBytes: conteudo.length,
      },
    });

    return {
      id: registro.id,
      mimeType: registro.mimeType,
      size: registro.tamanhoBytes,
      createdAt: registro.criadoEm.toISOString(),
    };
  } catch (error) {
    // Se o banco falhar, remover o arquivo salvo.
    await unlink(caminho).catch((erroLimpeza) => {
      console.error("Falha ao limpar upload após erro no banco:", erroLimpeza);
    });

    throw error;
  }
}

async function normalizarImagem(bytes: Buffer, finalidade: FinalidadeUpload) {
  try {
    const imagem = sharp(bytes, {
      limitInputPixels: DIMENSAO_MAXIMA * DIMENSAO_MAXIMA,
      failOn: "error",
      animated: false,
    });

    const metadados = await imagem.metadata();

    if (
      !["jpeg", "png"].includes(metadados.format ?? "") ||
      !metadados.width ||
      !metadados.height ||
      metadados.width > DIMENSAO_MAXIMA ||
      metadados.height > DIMENSAO_MAXIMA
    ) {
      throw new Error("INVALID_IMAGE");
    }

    const resultado = await imagem
      .rotate()
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .toBuffer();
    if (resultado.length > TAMANHO_MAXIMO)
      throw new UploadError(
        "INVALID_FILE_SIZE",
        "A imagem processada ultrapassou 5 MB.",
        422,
      );
    return resultado;
  } catch (error) {
    if (error instanceof UploadError) throw error;
    throw new UploadError(
      "INVALID_FILE_TYPE",
      finalidade === "company-proof"
        ? "Envie um comprovante em PDF ou uma imagem válida."
        : "Envie uma imagem JPEG ou PNG válida.",
      422,
    );
  }
}

export async function verificarPropriedadeUpload(
  arquivoId: string,
  usuarioId: string,
  finalidade: FinalidadeUpload,
): Promise<boolean> {
  if (!arquivoId.trim() || !usuarioId.trim()) {
    return false;
  }

  const arquivo = await prisma.arquivoUpload.findFirst({
    where: {
      id: arquivoId,
      usuarioId,
      finalidade,
    },
    select: {
      id: true,
    },
  });

  return arquivo !== null;
}

export async function verificarPropriedadeUploads(
  arquivoIds: string[],
  usuarioId: string,
  finalidade: FinalidadeUpload,
): Promise<boolean> {
  if (
    !usuarioId.trim() ||
    arquivoIds.length === 0 ||
    arquivoIds.some((id) => typeof id !== "string" || !id.trim())
  ) {
    return false;
  }

  // Impedir IDs repetidos na mesma associação.
  const idsUnicos = [...new Set(arquivoIds)];

  if (idsUnicos.length !== arquivoIds.length) {
    return false;
  }

  const quantidade = await prisma.arquivoUpload.count({
    where: {
      id: { in: idsUnicos },
      usuarioId,
      finalidade,
    },
  });

  return quantidade === idsUnicos.length;
}

export async function obterUpload(arquivoId: string, usuarioId: string) {
  if (!arquivoId.trim() || !usuarioId.trim()) {
    throw new UploadError("FILE_NOT_FOUND", "Arquivo não encontrado.", 404);
  }

  const registro = await prisma.arquivoUpload.findFirst({
    where: {
      id: arquivoId,
      usuarioId,
    },
    select: {
      chaveArmazenamento: true,
      mimeType: true,
    },
  });

  if (!registro) {
    throw new UploadError("FILE_NOT_FOUND", "Arquivo não encontrado.", 404);
  }

  // Aceitar somente chaves geradas pelo serviço.
  const chaveValida =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|pdf)$/i;

  if (!chaveValida.test(registro.chaveArmazenamento)) {
    throw new UploadError("INVALID_STORAGE_KEY", "Arquivo inválido.", 500);
  }

  const caminho = path.join(DIRETORIO_UPLOADS, registro.chaveArmazenamento);

  let bytes: Buffer;

  try {
    bytes = await readFile(caminho);
  } catch (error) {
    console.error("Falha ao recuperar upload:", error);

    throw new UploadError(
      "FILE_UNAVAILABLE",
      "Arquivo temporariamente indisponível.",
      404,
    );
  }

  return {
    bytes,
    mimeType: registro.mimeType,
  };
}
