import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { NextRequest } from "next/server";

import { prisma } from "../../../db/prisma";
import { GET } from "../../../../app/api/v1/[...path]/route";

test("logout invalida a sessão e bloqueia acesso ao perfil", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "O teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<Array<{ banco: string }>>`
    SELECT current_database() AS banco
  `;

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

  const email = `logout-${randomUUID()}@fretta.invalid`;
  let usuarioId: string | undefined;

  try {
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Usuário de Teste",
        email,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dadosCadastro = await cadastro.json();
    usuarioId = dadosCadastro.user.id;

    const cookie = cadastro.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie, "Cookie de sessão não encontrado.");

    const consultarPerfil = () =>
      GET(
        new NextRequest("http://localhost:3002/api/v1/me", {
          headers: { cookie },
        }),
      );

    const antes = await consultarPerfil();
    assert.equal(antes.status, 200);

    const saida = await authTeste.api.signOut({
      headers: new Headers({ cookie }),
      asResponse: true,
    });

    assert.equal(saida.status, 200);

    const depois = await consultarPerfil();
    assert.equal(depois.status, 401);

    console.log("Logout invalidou a sessão - OK");
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});
