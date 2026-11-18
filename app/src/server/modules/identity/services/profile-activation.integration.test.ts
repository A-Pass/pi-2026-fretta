import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { NextRequest } from "next/server";

import { prisma } from "../../../db/prisma";
import { POST } from "../../../../app/api/v1/[...path]/route";

test("ativa os perfis de cliente e motorista sem duplicidade", async () => {
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

  const identificador = randomUUID();
  const email = `perfil-${identificador}@fretta.invalid`;

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

    const cookies = cadastro.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookies, "Cookie de sessão não encontrado.");

    async function ativarPerfil(tipo: "client" | "driver") {
      const requisicao = new NextRequest(
        `http://localhost:3002/api/v1/me/${tipo}`,
        {
          method: "POST",
          headers: {
            cookie: cookies,
          },
        },
      );

      return POST(requisicao);
    }

    // Ativação do perfil de cliente
    const respostaCliente = await ativarPerfil("client");
    assert.equal(respostaCliente.status, 200);

    // Repetição não deve criar outro perfil
    const segundaRespostaCliente = await ativarPerfil("client");
    assert.equal(segundaRespostaCliente.status, 200);

    // Ativação do perfil de motorista
    const respostaMotorista = await ativarPerfil("driver");
    assert.equal(respostaMotorista.status, 200);

    // Repetição não deve criar outro perfil
    const segundaRespostaMotorista = await ativarPerfil("driver");
    assert.equal(segundaRespostaMotorista.status, 200);

    const quantidadeClientes = await prisma.cliente.count({
      where: { userId: usuarioId },
    });

    const quantidadeMotoristas = await prisma.motorista.count({
      where: { userId: usuarioId },
    });

    assert.equal(quantidadeClientes, 1);
    assert.equal(quantidadeMotoristas, 1);

    const dadosMotorista = await segundaRespostaMotorista.json();

    assert.equal(dadosMotorista.motorista.statusCadastro, "NAO_ENVIADO");
    assert.equal(dadosMotorista.motorista.cadastroCompleto, false);

    console.log("Perfis ativados sem duplicidade - OK");
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});
test("impede ativação de perfis sem autenticação", async () => {
  const caminhos = ["/api/v1/me/client", "/api/v1/me/driver"];

  for (const caminho of caminhos) {
    const requisicao = new NextRequest(`http://localhost:3002${caminho}`, {
      method: "POST",
    });

    const resposta = await POST(requisicao);
    const dados = await resposta.json();

    assert.equal(resposta.status, 401);
    assert.equal(dados.code, "UNAUTHORIZED");
  }

  console.log("Ativação sem autenticação bloqueada - OK");
});
