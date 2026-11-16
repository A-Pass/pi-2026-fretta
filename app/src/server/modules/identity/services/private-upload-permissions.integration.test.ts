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

test("controla o acesso ao upload privado de documentos", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

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
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const email = `upload-${randomUUID()}@fretta.invalid`;
  let usuarioId: string | undefined;

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

    // Ativar perfil de motorista
    await prisma.motorista.create({
      data: {
        userId: usuarioId!,
      },
    });

    const motoristaAutorizado =
      await verificarPermissaoUpload(headers);

    assert.equal(motoristaAutorizado.autorizado, true);

    if (motoristaAutorizado.autorizado) {
      assert.equal(motoristaAutorizado.motoristaId, usuarioId);
    }

    const requisicaoUpload = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration/uploads",
  {
    method: "POST",
    headers,
  },
);

const respostaUpload = await POST(requisicaoUpload);
const dadosUpload = await respostaUpload.json();

assert.equal(respostaUpload.status, 501);
assert.equal(dadosUpload.code, "UPLOAD_NOT_CONFIGURED");

console.log("Motorista autenticado acessou a rota protegida - OK");
    console.log("Autorização do upload privado - OK");
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});
