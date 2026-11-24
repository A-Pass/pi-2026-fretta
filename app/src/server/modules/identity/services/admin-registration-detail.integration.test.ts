import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "../../../db/prisma";

function verificarBancoDeTeste() {
  const databaseUrl = process.env.DB_URL;
  assert.ok(databaseUrl, "DB_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Testes permitidos somente no banco local fretta_test.",
  );
}

test("consulta detalhada exige administrador e protege dados privados", async () => {
  verificarBancoDeTeste();

  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");
  const { NextRequest } = await import("next/server");
  const { GET } = await import("../../../../app/api/v1/[...path]/route");

  const autenticacaoTeste = betterAuth({
    baseURL: process.env.APP_URL,
    secret: process.env.APP_BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
  });

  const identificador = randomUUID();
  const usuarioIds: string[] = [];
  const motorista_id = `motorista-detalhe-${identificador}`;

  const base = "http://localhost:3002/api/v1/admin/driver-registrations";

  try {
    // Sem autenticação
    const semSessao = await GET(new NextRequest(`${base}/${randomUUID()}`));
    assert.equal(semSessao.status, 401);

    // Usuário comum
    const cadastroComum = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Usuário Comum",
        email: `comum-detalhe-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroComum.status, 200);

    const comum = await cadastroComum.clone().json();
    usuarioIds.push(comum.user.id);

    const cookieComum = cadastroComum.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookieComum);

    const semPermissao = await GET(
      new NextRequest(`${base}/${randomUUID()}`, {
        headers: { cookie: cookieComum },
      }),
    );

    assert.equal(semPermissao.status, 403);

    // Administrador
    const cadastroAdmin = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Administrador de Teste",
        email: `admin-detalhe-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroAdmin.status, 200);

    const admin = await cadastroAdmin.clone().json();
    usuarioIds.push(admin.user.id);

    await prisma.user.update({
      where: { id: admin.user.id },
      data: { papel: "ADMIN" },
    });

    const cookieAdmin = cadastroAdmin.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookieAdmin);

    // Cadastro inexistente
    const inexistente = await GET(
      new NextRequest(`${base}/${randomUUID()}`, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(inexistente.status, 404);

    // Motorista fictício
    usuarioIds.push(motorista_id);

    await prisma.user.create({
      data: {
        id: motorista_id,
        name: "Motorista Detalhe Teste",
        email: `${motorista_id}@fretta.invalid`,
        motorista: {
          create: { codigo_publico: randomUUID(), atualizado_em: new Date() },
        },
        pessoa: {
          create: {
            nome_completo: "Motorista Detalhe Teste",
            cpf: "CPF_FICTICIO_TESTE",
            atualizado_em: new Date(),
          },
        },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        id: randomUUID(),
        motorista_id,
        categoria: "UTILITARIO",
        modelo: "Veículo Fictício",
        placa: `D${identificador.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
        descricao: "Teste de detalhes administrativos",
        categoria_porte: "PEQUENO",
        atualizado_em: new Date(),
      },
    });

    const cadastro = await prisma.cadastro_motorista.create({
      data: {
        id: randomUUID(),
        motorista_id,
        tipo_pessoa: "PF",
        cnh_numero: "CNH_PRIVADA_TESTE",
        cnh_categoria: "B",
        cnh_validade: new Date("2030-12-31T12:00:00Z"),
        foto_perfil_id: "FOTO_PRIVADA_TESTE",
        documento_cnh_id: "DOCUMENTO_PRIVADO_TESTE",
        veiculo_id: veiculo.id,
        status: "EM_ANALISE",
        atualizado_em: new Date(),
      },
    });

    // Administrador consulta os detalhes
    const resposta = await GET(
      new NextRequest(`${base}/${cadastro.id}`, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(resposta.status, 200);
    assert.equal(resposta.headers.get("cache-control"), "private, no-store");

    const dados = await resposta.json();

    assert.equal(dados.id, cadastro.id);
    assert.equal(dados.nome_completo, "Motorista Detalhe Teste");
    assert.equal(dados.cpf, "CPF_FICTICIO_TESTE");
    assert.equal(dados.cnh.numero, "CNH_PRIVADA_TESTE");
    assert.equal(dados.veiculo.id, veiculo.id);
    assert.equal(dados.documentos.fotoPerfilId, "FOTO_PRIVADA_TESTE");
    assert.equal(dados.documentos.documentoCnhId, "DOCUMENTO_PRIVADO_TESTE");

    // Usuário comum não pode consultar esse cadastro
    const respostaComum = await GET(
      new NextRequest(`${base}/${cadastro.id}`, {
        headers: { cookie: cookieComum },
      }),
    );

    assert.equal(respostaComum.status, 403);

    console.log("Consulta detalhada administrativa validada.");
  } finally {
    await prisma.user.deleteMany({
      where: {
        id: { in: usuarioIds },
      },
    });
  }
});
