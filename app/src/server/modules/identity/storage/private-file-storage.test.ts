import assert from "node:assert/strict";
import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";

import { salvarArquivoPrivado } from "./private-file-storage";

const diretorioPrivado = path.resolve(
  process.cwd(),
  "storage",
  "private",
);

test("salva imagem válida em formato JPEG", async () => {
  const bytes = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();

  const resultado = await salvarArquivoPrivado({
    bytes,
    tipo: "FOTO_PERFIL",
  });

  const caminho = path.join(
    diretorioPrivado,
    resultado.chaveArmazenamento,
  );

  try {
    assert.equal(resultado.tipo, "FOTO_PERFIL");
    assert.equal(resultado.mimeType, "image/jpeg");
    assert.match(
      resultado.chaveArmazenamento,
      /^[0-9a-f-]{36}\.jpg$/,
    );

    const arquivoSalvo = await readFile(caminho);
    const metadados = await sharp(arquivoSalvo).metadata();

    assert.equal(metadados.format, "jpeg");
    assert.equal(metadados.width, 100);
    assert.equal(metadados.height, 100);
    assert.equal(resultado.tamanhoBytes, arquivoSalvo.length);
  } finally {
    await unlink(caminho).catch(() => {});
  }
});

test("rejeita arquivos que não são imagens", async () => {
  await assert.rejects(
    salvarArquivoPrivado({
      bytes: Buffer.from("Arquivo de texto fictício"),
      tipo: "CNH",
    }),
    /INVALID_FILE_TYPE/,
  );
});

test("rejeita arquivos com assinatura PNG falsa", async () => {
  const bytes = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    Buffer.alloc(32),
  ]);

  await assert.rejects(
    salvarArquivoPrivado({
      bytes,
      tipo: "CNH",
    }),
    /INVALID_FILE_TYPE/,
  );
});

test("rejeita arquivos maiores que 5 MB", async () => {
  await assert.rejects(
    salvarArquivoPrivado({
      bytes: Buffer.alloc(5 * 1024 * 1024 + 1),
      tipo: "CNH",
    }),
    /INVALID_FILE_SIZE/,
  );
});

test("rejeita arquivos vazios", async () => {
  await assert.rejects(
    salvarArquivoPrivado({
      bytes: Buffer.alloc(0),
      tipo: "FOTO_PERFIL",
    }),
    /INVALID_FILE_SIZE/,
  );
});

test("rejeita imagens com dimensões excessivas", async () => {
  const bytes = await sharp({
    create: {
      width: 6001,
      height: 10,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();

  await assert.rejects(
    salvarArquivoPrivado({
      bytes,
      tipo: "CNH",
    }),
    /INVALID_FILE_TYPE/,
  );
});
