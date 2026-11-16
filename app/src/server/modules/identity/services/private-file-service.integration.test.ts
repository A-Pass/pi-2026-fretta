import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";

import { prisma } from "../../../db/prisma";
import { salvarDocumentoMotorista } from "./private-file-service";
import { removerArquivoPrivado } from "../storage/private-file-storage";


test("salva documento privado vinculado ao motorista", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Este teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(banco[0]?.banco, "fretta_test");

  const motoristaId = `motorista-arquivo-${randomUUID()}`;
  let arquivoId: string | undefined;

  try {
    await prisma.user.create({
      data: {
        id: motoristaId,
        name: "Motorista Fictício",
        email: `${motoristaId}@fretta.invalid`,
        emailVerified: false,
        motorista: {
          create: {},
        },
      },
    });

    const imagem = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: "#ffffff",
      },
    })
      .png()
      .toBuffer();

    const documento = await salvarDocumentoMotorista({
      motoristaId,
      tipo: "CNH",
      bytes: imagem,
    });

    arquivoId = documento.id;

    const registro = await prisma.arquivoPrivado.findUniqueOrThrow({
      where: { id: arquivoId },
    });

    assert.equal(registro.motoristaId, motoristaId);
    assert.equal(registro.tipo, "CNH");
    assert.equal(registro.mimeType, "image/jpeg");
    assert.ok(registro.tamanhoBytes > 0);

    const caminho = path.join(
      process.cwd(),
      "storage",
      "private",
      registro.chaveArmazenamento,
    );

    const arquivoFisico = await readFile(caminho);
    assert.ok(arquivoFisico.length > 0);

    console.log("Documento salvo e vinculado ao motorista - OK");
  } finally {
    if (arquivoId) {
      const registro = await prisma.arquivoPrivado.findUnique({
        where: { id: arquivoId },
      });

      if (registro) {
        await removerArquivoPrivado(registro.chaveArmazenamento);
      }
    }

    await prisma.user.deleteMany({
      where: { id: motoristaId },
    });
  }
});

test("remove arquivo físico quando a persistência falha", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Este teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(banco[0]?.banco, "fretta_test");

  const diretorio = path.join(
    process.cwd(),
    "storage",
    "private",
  );

  const arquivosAntes = await readdir(diretorio);

  const imagem = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: "#ffffff",
    },
  })
    .png()
    .toBuffer();

  const motoristaInexistente = `inexistente-${randomUUID()}`;

  await assert.rejects(
    salvarDocumentoMotorista({
      motoristaId: motoristaInexistente,
      tipo: "CNH",
      bytes: imagem,
    }),
  );

  const arquivosDepois = await readdir(diretorio);

  assert.deepEqual(
    arquivosDepois.sort(),
    arquivosAntes.sort(),
    "O arquivo físico deveria ser removido após a falha.",
  );

  const registros = await prisma.arquivoPrivado.count({
    where: {
      motoristaId: motoristaInexistente,
    },
  });

  assert.equal(registros, 0);

  console.log("Arquivo removido após falha no PostgreSQL - OK");
});