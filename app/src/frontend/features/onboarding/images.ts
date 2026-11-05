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
/** Decode and re-encode locally; original identity documents never leave this demo browser. */
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
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await withImageDeadline(img.decode());
    if (img.naturalWidth < 200 || img.naturalHeight < 200)
      throw new Error("Escolha uma imagem de pelo menos 200 × 200 pixels.");
    if (img.naturalWidth * img.naturalHeight > 25_000_000)
      throw new Error(
        "A imagem é muito grande. Reduza a resolução antes de enviar.",
      );
    const scale = Math.min(
      1,
      1600 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Não foi possível preparar a imagem neste navegador.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return {
      dataUrl: canvas.toDataURL("image/jpeg", 0.85),
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
        : "Não foi possível abrir essa imagem. Escolha outra foto.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
export function demoPhoto(kind: "profile" | "license"): PreparedPhoto {
  const canvas = document.createElement("canvas");
  canvas.width = kind === "profile" ? 480 : 900;
  canvas.height = kind === "profile" ? 480 : 560;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = kind === "profile" ? "#fff0e8" : "#e6efdf";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (kind === "profile") {
    ctx.fillStyle = "#bb4928";
    ctx.beginPath();
    ctx.arc(240, 172, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(240, 345, 135, 115, 0, Math.PI, 0);
    ctx.fill();
  } else {
    ctx.fillStyle = "#365437";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("DOCUMENTO FICTÍCIO", 40, 80);
    ctx.font = "26px sans-serif";
    ctx.fillText("FRETTA · exemplo para demonstração", 40, 140);
    ctx.fillText("Sem dados pessoais · sem validade", 40, 200);
    ctx.fillStyle = "#bfcfba";
    ctx.fillRect(40, 260, 170, 210);
    ctx.fillRect(245, 270, 570, 20);
    ctx.fillRect(245, 325, 440, 20);
    ctx.fillRect(245, 380, 500, 20);
  }
  ctx.fillStyle = "#843721";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("AMOSTRA · SEM VALIDADE", 40, canvas.height - 24);
  return {
    dataUrl: canvas.toDataURL("image/png"),
    type: "image/png",
    name: `${kind}-ficticio.png`,
    size: 10000,
    width: canvas.width,
    height: canvas.height,
  };
}
