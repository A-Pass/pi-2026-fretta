
import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";

import { POST } from "../../../../app/api/v1/[...path]/route";

import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../../db/prisma";

test("bloqueia cadastro de motorista sem autenticação", async () => {
  const requisicao = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const resposta = await POST(requisicao);
  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(dados.code, "UNAUTHORIZED");

  console.log("Cadastro sem autenticação bloqueado - OK");
});


test("bloqueia cadastro sem perfil de motorista", async () => {
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

  let usuarioId: string | undefined;

  try {
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Usuário Fictício",
        email: `cadastro-${randomUUID()}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dados = await cadastro.json();
    usuarioId = dados.user.id;

    const cookies = cadastro.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookies, "Cookie de sessão não encontrado.");

    const requisicao = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "POST",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    const resposta = await POST(requisicao);
    const resultado = await resposta.json();

    assert.equal(resposta.status, 403);
    assert.equal(resultado.code, "FORBIDDEN");
    // Ativar o perfil de motorista para testar a validação dos dados.
await prisma.motorista.create({
  data: {
    userId: usuarioId!,
  },
});

const requisicaoInvalida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  },
);

const respostaInvalida = await POST(requisicaoInvalida);
const dadosInvalidos = await respostaInvalida.json();

assert.equal(respostaInvalida.status, 422);
assert.equal(dadosInvalidos.code, "INVALID_INPUT");

console.log("Cadastro com dados incompletos bloqueado - OK");

const requisicaoCpfInvalido = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "11111111111",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2099-12-31",
      veiculoId: "veiculo-ficticio",
    }),
  },
);

    const respostaCpfInvalido = await POST(requisicaoCpfInvalido);
    const dadosCpfInvalido = await respostaCpfInvalido.json();

    assert.equal(respostaCpfInvalido.status, 422);
    assert.equal(dadosCpfInvalido.code, "VALIDATION_ERROR");
    assert.match(dadosCpfInvalido.message, /CPF inválido/);

    console.log("Cadastro com CPF inválido bloqueado - OK");

const requisicaoCnhVencida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "529.982.247-25",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2020-01-01",
      veiculoId: "veiculo-ficticio",
    }),
  },
);

    const respostaCnhVencida = await POST(requisicaoCnhVencida);
    const dadosCnhVencida = await respostaCnhVencida.json();

    assert.equal(respostaCnhVencida.status, 422);
    assert.equal(dadosCnhVencida.code, "VALIDATION_ERROR");
    assert.match(
    dadosCnhVencida.message,
    /CNH vencida ou data inválida/,
    );

    console.log("Cadastro com CNH vencida bloqueado - OK");

const outroMotoristaId = `motorista-teste-${randomUUID()}`;

try {
  // Criar outro motorista fictício.
  await prisma.user.create({
    data: {
      id: outroMotoristaId,
      name: "Outro Motorista Fictício",
      email: `${outroMotoristaId}@fretta.invalid`,
      emailVerified: false,
      motorista: {
        create: {},
      },
    },
  });

  // O veículo pertence ao outro motorista.
  const veiculoDeOutroMotorista = await prisma.veiculo.create({
    data: {
      motoristaId: outroMotoristaId,
      categoria: "UTILITARIO",
      modelo: "Veículo Fictício",
      placa: `T${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      capacidadeKg: 1000,
      descricao: "Teste de propriedade do veículo",
    },
  });

  // O motorista autenticado tenta usar esse veículo.
  const requisicaoVeiculoAlheio = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration",
    {
      method: "POST",
      headers: {
        cookie: cookies,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        tipoPessoa: "PF",
        nomeCompleto: "Motorista de Teste",
        cpf: "529.982.247-25",
        cnhNumero: "12345678901",
        cnhCategoria: "B",
        cnhValidade: "2099-12-31",
        veiculoId: veiculoDeOutroMotorista.id,
      }),
    },
  );

  const respostaVeiculoAlheio = await POST(requisicaoVeiculoAlheio);
  const dadosVeiculoAlheio = await respostaVeiculoAlheio.json();

  assert.equal(respostaVeiculoAlheio.status, 422);
  assert.equal(dadosVeiculoAlheio.code, "INVALID_VEHICLE");

  console.log("Uso de veículo de outro motorista bloqueado - OK");
} finally {
  await prisma.user.deleteMany({
    where: {
      id: outroMotoristaId,
    },
  });
}

const veiculoProprio = await prisma.veiculo.create({
  data: {
    motoristaId: usuarioId!,
    categoria: "UTILITARIO",
    modelo: "Veículo Próprio de Teste",
    placa: `T${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    capacidadeKg: 1000,
    descricao: "Teste de cadastro com veículo próprio",
  },
});

const requisicaoValida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "529.982.247-25",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2099-12-31",
      veiculoId: veiculoProprio.id,
    }),
  },
);

const respostaValida = await POST(requisicaoValida);
const dadosValidos = await respostaValida.json();

assert.equal(respostaValida.status, 501);
assert.equal(
  dadosValidos.code,
  "DOCUMENT_UPLOAD_NOT_CONFIGURED",
);

console.log("Cadastro válido passou pelas validações - OK");


    console.log("Cadastro sem perfil de motorista bloqueado - OK");
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});