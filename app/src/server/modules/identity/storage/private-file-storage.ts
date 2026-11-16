
import { randomUUID } from "node:crypto";
import { mkdir, open, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIRETORIO_PRIVADO = path.resolve(
  process.cwd(),
  "storage",
  "private",
);

const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const DIMENSAO_MAXIMA = 6000;

type TipoArquivo = "FOTO_PERFIL" | "CNH";

type ArquivoRecebido = {
  bytes: Buffer;
  tipo: TipoArquivo;
};

export async function salvarArquivoPrivado({
  bytes,
  tipo,
}: ArquivoRecebido) {
  if (bytes.length === 0 || bytes.length > TAMANHO_MAXIMO) {
    throw new Error("INVALID_FILE_SIZE");
  }

  let imagemNormalizada: Buffer;

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
      throw new Error("INVALID_FILE_TYPE");
    }

    // Reprocessar a imagem remove metadados desnecessários.
    // O arquivo final será sempre JPEG.
    imagemNormalizada = await sharp(bytes, {
      limitInputPixels: DIMENSAO_MAXIMA * DIMENSAO_MAXIMA,
      failOn: "error",
      animated: false,
    })
      .rotate()
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
  } catch {
    throw new Error("INVALID_FILE_TYPE");
  }

  if (imagemNormalizada.length > TAMANHO_MAXIMO) {
    throw new Error("INVALID_FILE_SIZE");
  }

  const id = randomUUID();
  const chaveArmazenamento = `${id}.jpg`;

  await mkdir(DIRETORIO_PRIVADO, { recursive: true });

  const caminho = path.join(DIRETORIO_PRIVADO, chaveArmazenamento);

  const arquivo = await open(caminho, "wx", 0o600);

  try {
    await arquivo.writeFile(imagemNormalizada);
  } catch (error) {
    await arquivo.close();
    await unlink(caminho).catch(() => {});
    throw error;
  }

  await arquivo.close();

  return {
    id,
    tipo,
    chaveArmazenamento,
    mimeType: "image/jpeg",
    tamanhoBytes: imagemNormalizada.length,
  };
}
