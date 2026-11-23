import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../../../db/prisma";
import { verificarPermissaoUpload } from "./private-upload-permissions";

import { NextRequest } from "next/server";
import { POST } from "../../../../app/api/v1/[...path]/route";
import sharp from "sharp";
import { removerArquivoPrivado } from "../storage/private-file-storage";

test("controla o acesso ao upload privado de documentos", async () => {
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

  const email = `upload-${randomUUID()}@fretta.invalid`;
  let usuarioId: string | undefined;
  const requisicaoSemSessao = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration/uploads",
    {
      method: "POST",
    },
  );

  const respostaSemSessao = await POST(requisicaoSemSessao);
  const dadosSemSessao = await respostaSemSessao.json();

  assert.equal(respostaSemSessao.status, 401);
  assert.equal(dadosSemSessao.code, "UNAUTHORIZED");
  // Usuário sem sessão
  const semSessao = await verificarPermissaoUpload(new Headers());

  assert.equal(semSessao.autorizado, false);

  if (!semSessao.autorizado) {
    assert.equal(semSessao.status, 401);
  }

  try {
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Usuário Fictício",
        email,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dados = await cadastro.json();
    usuarioId = dados.user.id;

    const cookie = cadastro.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie);

    const headers = new Headers({ cookie });

    // Usuário autenticado sem perfil de motorista
    const semPerfil = await verificarPermissaoUpload(headers);

    assert.equal(semPerfil.autorizado, false);

    if (!semPerfil.autorizado) {
      assert.equal(semPerfil.status, 403);
    }
    // Usuário autenticado sem perfil de motorista
    const requisicaoSemPerfil = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration/uploads",
      {
        method: "POST",
        headers,
      },
    );

    const respostaSemPerfil = await POST(requisicaoSemPerfil);
    const dadosSemPerfil = await respostaSemPerfil.json();

    assert.equal(respostaSemPerfil.status, 403);
    assert.equal(dadosSemPerfil.code, "FORBIDDEN");
    // Ativar perfil de motorista
    await prisma.motorista.create({
      data: {
        user_id: usuarioId!,
        codigo_publico: randomUUID(),
        atualizado_em: new Date(),
      },
    });

    const motoristaAutorizado = await verificarPermissaoUpload(headers);

    assert.equal(motoristaAutorizado.autorizado, true);

    if (motoristaAutorizado.autorizado) {
      assert.equal(motoristaAutorizado.motorista_id, usuarioId);
    }
    // Criar uma imagem válida para o teste.
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

    const formulario = new FormData();

    formulario.set("tipo", "CNH");
    formulario.set(
      "arquivo",
      new File([new Uint8Array(imagem)], "cnh-teste.png", {
        type: "image/png",
      }),
    );

    // O FormData gera o Content-Type com boundary automaticamente.
    const requisicaoUpload = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration/uploads",
      {
        method: "POST",
        headers: {
          cookie,
        },
        body: formulario,
      },
    );

    const respostaUpload = await POST(requisicaoUpload);
    const dadosUpload = await respostaUpload.json();

    assert.equal(respostaUpload.status, 201);
    assert.equal(dadosUpload.tipo, "CNH");
    assert.ok(dadosUpload.id);

    const registro = await prisma.arquivo_privado.findUniqueOrThrow({
      where: { id: dadosUpload.id },
    });

    assert.equal(registro.motorista_id, usuarioId);
    assert.equal(registro.tipo, "CNH");

    // Limpeza do arquivo físico e do registro de teste.
    await removerArquivoPrivado(registro.chave_armazenamento);
    await prisma.arquivo_privado.delete({
      where: { id: registro.id },
    });

    console.log("Upload real de CNH autorizado e persistido - OK");

    // Um arquivo de texto não pode ser enviado como CNH.
    const formularioInvalido = new FormData();

    formularioInvalido.set("tipo", "CNH");
    formularioInvalido.set(
      "arquivo",
      new File(["conteudo de texto"], "documento.png", {
        type: "image/png",
      }),
    );

    const requisicaoInvalida = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration/uploads",
      {
        method: "POST",
        headers: {
          cookie,
        },
        body: formularioInvalido,
      },
    );

    const respostaInvalida = await POST(requisicaoInvalida);
    const dadosInvalidos = await respostaInvalida.json();

    assert.equal(respostaInvalida.status, 422);
    assert.equal(dadosInvalidos.code, "INVALID_FILE_TYPE");

    console.log("Upload de arquivo inválido bloqueado - OK");

    // O upload deve exigir o campo arquivo.
    const formularioSemArquivo = new FormData();
    formularioSemArquivo.set("tipo", "CNH");

    const requisicaoSemArquivo = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration/uploads",
      {
        method: "POST",
        headers: {
          cookie,
        },
        body: formularioSemArquivo,
      },
    );

    const respostaSemArquivo = await POST(requisicaoSemArquivo);
    const dadosSemArquivo = await respostaSemArquivo.json();

    assert.equal(respostaSemArquivo.status, 422);
    assert.equal(dadosSemArquivo.code, "FILE_REQUIRED");

    console.log("Upload sem arquivo bloqueado - OK");

    // Rejeitar arquivos maiores que 5 MB.
    const formularioGrande = new FormData();

    formularioGrande.set("tipo", "CNH");
    formularioGrande.set(
      "arquivo",
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "arquivo-grande.png", {
        type: "image/png",
      }),
    );

    const requisicaoGrande = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration/uploads",
      {
        method: "POST",
        headers: {
          cookie,
        },
        body: formularioGrande,
      },
    );

    const respostaGrande = await POST(requisicaoGrande);
    const dadosGrande = await respostaGrande.json();

    assert.equal(respostaGrande.status, 422);
    assert.equal(dadosGrande.code, "INVALID_FILE_SIZE");

    console.log("Upload acima de 5 MB bloqueado - OK");

    console.log("Motorista autenticado acessou a rota protegida - OK");
    console.log("Autorização do upload privado - OK");
    // Uma sessão não pode assumir a identidade de outro motorista.
    const outroEmail = `outro-upload-${randomUUID()}@fretta.invalid`;
    const outroCadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Outro Motorista Fictício",
        email: outroEmail,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(outroCadastro.status, 200);

    const outrosDados = await outroCadastro.json();
    const outroUsuarioId = outrosDados.user.id;

    try {
      await prisma.motorista.create({
        data: {
          user_id: outroUsuarioId,
          codigo_publico: randomUUID(),
          atualizado_em: new Date(),
        },
      });

      // Mantemos os headers da primeira conta.
      const permissaoOriginal = await verificarPermissaoUpload(headers);

      assert.equal(permissaoOriginal.autorizado, true);

      if (permissaoOriginal.autorizado) {
        assert.equal(permissaoOriginal.motorista_id, usuarioId);
        assert.notEqual(permissaoOriginal.motorista_id, outroUsuarioId);
      }

      console.log("Isolamento entre motoristas - OK");
    } finally {
      await prisma.user.deleteMany({
        where: { id: outroUsuarioId },
      });
    }
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});
