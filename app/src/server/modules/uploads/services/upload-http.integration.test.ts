import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { NextRequest } from "next/server";
import sharp from "sharp";

import { prisma } from "../../../db/prisma";
import { GET, POST } from "../../../../app/api/v1/[...path]/route";
import {
  verificarPropriedadeUpload,
  verificarPropriedadeUploads,
} from "./upload-service";

test("protege e integra o upload geral de imagens", async () => {
  // Impedir execução em um banco diferente do fretta_test.
  const databaseUrl = process.env.DB_URL;
  assert.ok(databaseUrl, "DB_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "O teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(banco[0]?.banco, "fretta_test");

  const authTeste = betterAuth({
    baseURL: process.env.APP_URL,
    secret: process.env.APP_BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  let usuarioId: string | undefined;
  let arquivoId: string | undefined;

  try {
    // Criar usuário fictício e obter sessão real.
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Usuário Teste Upload",
        email: `upload-${randomUUID()}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dadosUsuario = await cadastro.json();
    usuarioId = dadosUsuario.user.id as string;

    const cookie = cadastro.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie, "Cookie de sessão não retornado.");

    function requisicao(formData: FormData, cookieSessao?: string) {
      return new NextRequest("http://localhost:3002/api/v1/uploads", {
        method: "POST",
        headers: {
          ...(cookieSessao ? { cookie: cookieSessao } : {}),
        },
        body: formData,
      });
    }

    // Gerar imagem PNG fictícia com Sharp.
    const imagem = await sharp({
      create: {
        width: 120,
        height: 80,
        channels: 3,
        background: {
          r: 80,
          g: 120,
          b: 160,
        },
      },
    })
      .png()
      .toBuffer();

    function formularioImagem() {
      const formData = new FormData();
      formData.append("purpose", "freight");

      formData.append(
        "file",
        new File([new Uint8Array(imagem)], "foto-teste.png", {
          type: "image/png",
        }),
      );

      return formData;
    }

    // 1. Upload sem sessão deve retornar 401.
    const semSessao = await POST(requisicao(formularioImagem()));

    assert.equal(semSessao.status, 401);

    // 2. Upload autenticado deve funcionar.
    const envio = await POST(requisicao(formularioImagem(), cookie));

    assert.equal(
      envio.status,
      201,
      `Resposta inesperada: ${await envio.clone().text()}`,
    );

    const resultado = await envio.json();

    arquivoId = resultado.id;

    assert.ok(arquivoId);
    assert.equal(resultado.mimeType, "image/jpeg");
    assert.ok(resultado.size > 0);

    // 3. Confirmar registro e proprietário no banco.
    const registro = await prisma.arquivo_upload.findUnique({
      where: { id: arquivoId },
    });

    assert.ok(registro);
    assert.equal(registro.usuario_id, usuarioId);
    assert.equal(registro.mime_type, "image/jpeg");
    assert.equal(registro.finalidade, "freight");

    // 4. Confirmar arquivo físico.
    const caminhoArquivo = path.resolve(
      process.cwd(),
      "storage",
      "uploads",
      registro.chave_armazenamento,
    );

    const arquivoSalvo = await readFile(caminhoArquivo);
    const metadados = await sharp(arquivoSalvo).metadata();

    assert.equal(metadados.format, "jpeg");
    assert.equal(metadados.width, 120);
    assert.equal(metadados.height, 80);

    // 5. Rejeitar conteúdo que não é imagem.
    const invalido = new FormData();
    invalido.append("purpose", "freight");

    invalido.append(
      "file",
      new File(["Este conteúdo não é uma imagem."], "arquivo.png", {
        type: "image/png",
      }),
    );

    const envioInvalido = await POST(requisicao(invalido, cookie));

    assert.equal(envioInvalido.status, 422);

    const erro = await envioInvalido.json();

    assert.equal(erro.code, "INVALID_FILE_TYPE");

    // 6. Rejeitar requisição sem arquivo.
    const semArquivo = await POST(requisicao(new FormData(), cookie));

    assert.equal(semArquivo.status, 422);

    console.log("Upload HTTP autenticado verificado - OK");

    // TESTE 7: O proprietário pode utilizar seu arquivo.
    const idUpload = arquivoId!;

    const arquivoProprio = await verificarPropriedadeUpload(
      idUpload,
      usuarioId!,
      "freight",
    );

    assert.equal(arquivoProprio, true);

    // TESTE 8: Outro usuário não pode utilizar o arquivo.
    const outroUsuarioId = randomUUID();

    const arquivoDeOutroUsuario = await verificarPropriedadeUpload(
      idUpload,
      outroUsuarioId,
      "freight",
    );

    assert.equal(arquivoDeOutroUsuario, false);

    // TESTE 9: Um arquivo de frete não pode ser
    // utilizado como arquivo de perfil.
    const finalidadeIncorreta = await verificarPropriedadeUpload(
      idUpload,
      usuarioId!,
      "profile",
    );

    assert.equal(finalidadeIncorreta, false);

    // TESTE 10: Arquivos inexistentes são rejeitados.
    const arquivoInexistente = await verificarPropriedadeUpload(
      randomUUID(),
      usuarioId!,
      "freight",
    );

    assert.equal(arquivoInexistente, false);

    // TESTE 11: Lista com arquivo próprio é aceita.
    const listaValida = await verificarPropriedadeUploads(
      [idUpload],
      usuarioId!,
      "freight",
    );

    assert.equal(listaValida, true);

    // TESTE 12: Lista com arquivo inexistente é rejeitada.
    const listaInvalida = await verificarPropriedadeUploads(
      [idUpload, randomUUID()],
      usuarioId!,
      "freight",
    );

    assert.equal(listaInvalida, false);

    // TESTE 13: IDs repetidos são rejeitados.
    const listaDuplicada = await verificarPropriedadeUploads(
      [idUpload, idUpload],
      usuarioId!,
      "freight",
    );

    assert.equal(listaDuplicada, false);

    // TESTE 14: Outro usuário não pode utilizar a lista.
    const listaOutroUsuario = await verificarPropriedadeUploads(
      [idUpload],
      outroUsuarioId,
      "freight",
    );

    assert.equal(listaOutroUsuario, false);

    // TESTE 15: Usuário sem sessão não pode recuperar a imagem.
    function requisicaoGet(id: string, cookieSessao?: string) {
      return new NextRequest(`http://localhost:3002/api/v1/uploads/${id}`, {
        method: "GET",
        headers: {
          ...(cookieSessao ? { cookie: cookieSessao } : {}),
        },
      });
    }

    const consultaSemSessao = await GET(requisicaoGet(idUpload));

    assert.equal(consultaSemSessao.status, 401);

    // TESTE 16: Proprietário consegue recuperar a imagem.
    const consultaProprietario = await GET(requisicaoGet(idUpload, cookie));

    assert.equal(
      consultaProprietario.status,
      200,
      `Resposta inesperada: ${await consultaProprietario.clone().text()}`,
    );

    assert.equal(
      consultaProprietario.headers.get("content-type"),
      "image/jpeg",
    );

    assert.equal(
      consultaProprietario.headers.get("cache-control"),
      "private, no-store",
    );

    const imagemRecuperada = Buffer.from(
      await consultaProprietario.arrayBuffer(),
    );

    const metadadosRecuperados = await sharp(imagemRecuperada).metadata();

    assert.equal(metadadosRecuperados.format, "jpeg");
    assert.equal(metadadosRecuperados.width, 120);
    assert.equal(metadadosRecuperados.height, 80);

    // TESTE 17: Outro usuário autenticado não pode acessar a imagem.
    const cadastroOutroUsuario = await authTeste.api.signUpEmail({
      body: {
        name: "Outro Usuário Teste Upload",
        email: `upload-outro-${randomUUID()}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroOutroUsuario.status, 200);

    const dadosOutroUsuario = await cadastroOutroUsuario.json();
    const segundoUsuarioId = dadosOutroUsuario.user.id as string;

    const cookieOutroUsuario = cadastroOutroUsuario.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookieOutroUsuario);

    try {
      const consultaOutroUsuario = await GET(
        requisicaoGet(idUpload, cookieOutroUsuario),
      );

      assert.equal(consultaOutroUsuario.status, 404);
    } finally {
      await prisma.session.deleteMany({
        where: { userId: segundoUsuarioId },
      });

      await prisma.account.deleteMany({
        where: { userId: segundoUsuarioId },
      });

      await prisma.user.delete({
        where: { id: segundoUsuarioId },
      });
    }

    // TESTE 18: Arquivo inexistente retorna 404.
    const consultaInexistente = await GET(requisicaoGet(randomUUID(), cookie));

    assert.equal(consultaInexistente.status, 404);

    console.log("Recuperação segura de imagens verificada - OK");
  } finally {
    // Limpar somente o arquivo e usuário deste teste.
    if (arquivoId) {
      const registro = await prisma.arquivo_upload.findUnique({
        where: { id: arquivoId },
      });

      if (registro) {
        await prisma.arquivo_upload.delete({
          where: { id: arquivoId },
        });

        const caminho = path.resolve(
          process.cwd(),
          "storage",
          "uploads",
          registro.chave_armazenamento,
        );

        await unlink(caminho).catch((error: unknown) => {
          console.error("Erro na limpeza do arquivo de teste:", error);
        });
      }
    }

    if (usuarioId) {
      await prisma.session.deleteMany({
        where: { userId: usuarioId },
      });

      await prisma.account.deleteMany({
        where: { userId: usuarioId },
      });

      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});
