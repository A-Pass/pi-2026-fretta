import type { PreparedPhoto } from "./rules";
function withImageDeadline<T>(task: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          new Error(
            "A leitura da imagem demorou demais. Tente selecionar o arquivo novamente.",
          ),
        ),
      15000,
    );
    task.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
/** Decode and re-encode locally before the image is saved with the account state. */
export async function prepareOnboardingPhoto(
  file: File,
): Promise<PreparedPhoto> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size <= 0 ||
    file.size > 5 * 1024 * 1024
  )
    throw new Error("Escolha uma imagem JPG, PNG ou WebP de até 5 MB.");
  const bytes = new Uint8Array(
    await withImageDeadline(file.slice(0, 16).arrayBuffer()),
  );
  const detected =
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      ? "image/jpeg"
      : bytes[0] === 0x89 &&
          bytes[1] === 0x50 &&
          bytes[2] === 0x4e &&
          bytes[3] === 0x47
        ? "image/png"
        : String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
            String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
          ? "image/webp"
          : null;
  if (detected !== file.type)
    throw new Error(
      "O conteúdo do arquivo não corresponde a uma imagem aceita. Escolha outra foto.",
    );
  return normalizePhoto(file, true);
}

/** Freight photos may use any format the browser can decode. */
export async function prepareFreightPhoto(file: File): Promise<PreparedPhoto> {
  if (file.size === 0 || file.size > 30 * 1024 * 1024)
    throw new Error("Escolha uma imagem de até 30 MB que não esteja vazia.");
  return normalizePhoto(file, false);
}

async function normalizePhoto(
  file: File,
  documentPhoto: boolean,
): Promise<PreparedPhoto> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await withImageDeadline(img.decode());
    if (documentPhoto && (img.naturalWidth < 200 || img.naturalHeight < 200))
      throw new Error("Escolha uma imagem de pelo menos 200 × 200 pixels.");
    if (
      img.naturalWidth * img.naturalHeight >
      (documentPhoto ? 25_000_000 : 80_000_000)
    )
      throw new Error(
        "A imagem é muito grande. Reduza a resolução antes de enviar.",
      );
    const scale = Math.min(
      1,
      1600 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Não foi possível preparar a imagem neste navegador.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    if (!dataUrl.startsWith("data:image/jpeg;"))
      throw new Error("Não foi possível converter a imagem em JPEG.");
    return {
      dataUrl,
      name: file.name,
      type: "image/jpeg",
      size: file.size,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (e) {
    throw new Error(
      e instanceof Error && !(e instanceof DOMException)
        ? e.message
        : "O navegador não conseguiu abrir a imagem. Confira se ela abre no seu aparelho ou exporte como JPG.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
