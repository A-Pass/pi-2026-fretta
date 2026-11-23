import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../../../db/prisma";
import { randomUUID } from "node:crypto";
import { criarNotificacao } from "../../notifications/services/notification-service";

function verificarBancoDeTeste() {
  const databaseUrl = process.env.DB_URL;

  assert.ok(databaseUrl, "DB_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Testes de integração permitidos somente no banco local fretta_test.",
  );
}

test("conexão segura com o banco de testes", async () => {
  verificarBancoDeTeste();

  const resultado = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(resultado[0]?.banco, "fretta_test");
});

test("aprovação de cadastro é persistida no PostgreSQL", async () => {
  verificarBancoDeTeste();

  const identificador = randomUUID();
  const usuarioId = `fretta-teste-${identificador}`;
  const placa = `TST${identificador.replace(/-/g, "").slice(0, 4).toUpperCase()}`;

  try {
    await prisma.user.create({
      data: {
        id: usuarioId,
        name: "Motorista Fictício",
        email: `${usuarioId}@fretta.invalid`,
        emailVerified: false,
        papel: "USUARIO",
        motorista: {
          create: { codigo_publico: randomUUID(), atualizado_em: new Date() },
        },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        id: randomUUID(),
        motorista_id: usuarioId,
        categoria: "UTILITARIO",
        modelo: "Veículo de Teste",
        placa,
        capacidade_kg: 1000,
        descricao: "Veículo fictício para teste administrativo",
        categoria_porte: "PEQUENO",
        atualizado_em: new Date(),
      },
    });

    const cadastro = await prisma.cadastro_motorista.create({
      data: {
        id: randomUUID(),
        motorista_id: usuarioId,
        tipo_pessoa: "PF",
        cnh_numero: "DOCUMENTO_FICTICIO",
        cnh_categoria: "B",
        cnh_validade: new Date("2030-12-31T12:00:00Z"),
        foto_perfil_id: "arquivo-ficticio-foto",
        documento_cnh_id: "arquivo-ficticio-cnh",
        veiculo_id: veiculo.id,
        status: "EM_ANALISE",
        atualizado_em: new Date(),
      },
    });

    assert.equal(cadastro.status, "EM_ANALISE");

    const resultado = await prisma.cadastro_motorista.updateMany({
      where: {
        id: cadastro.id,
        status: "EM_ANALISE",
      },
      data: {
        status: "APROVADO",
        motivo_ajuste: null,
        analisado_em: new Date(),
      },
    });

    assert.equal(resultado.count, 1);

    const cadastroAtualizado = await prisma.cadastro_motorista.findUniqueOrThrow(
      {
        where: {
          id: cadastro.id,
        },
      },
    );

    assert.equal(cadastroAtualizado.status, "APROVADO");
    assert.ok(cadastroAtualizado.analisado_em);

    console.log("Aprovação persistida no PostgreSQL - OK");
  } finally {
    await prisma.user.deleteMany({
      where: {
        id: usuarioId,
      },
    });
  }
});

test("administrador aprova cadastro pela rota PATCH", async () => {
  verificarBancoDeTeste();

  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");
  const { NextRequest } = await import("next/server");
  const { PATCH } = await import("../../../../app/api/v1/[...path]/route");

  const autenticacaoTeste = betterAuth({
    baseURL: process.env.APP_URL,
    secret: process.env.APP_BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const identificador = randomUUID();
  const administradorEmail = `admin-${identificador}@fretta.invalid`;
  const motorista_id = `motorista-${identificador}`;
  const placa = `T${identificador.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

  let administradorId: string | undefined;

  try {
    const cadastroAdministrador = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Administrador de Teste",
        email: administradorEmail,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroAdministrador.status, 200);

    const respostaCadastro = await cadastroAdministrador.clone().json();
    administradorId = respostaCadastro.user.id;

    await prisma.user.update({
      where: { id: administradorId },
      data: { papel: "ADMIN" },
    });

    await prisma.user.create({
      data: {
        id: motorista_id,
        name: "Motorista de Teste",
        email: `${motorista_id}@fretta.invalid`,
        emailVerified: false,
        motorista: {
          create: { codigo_publico: randomUUID(), atualizado_em: new Date() },
        },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        id: randomUUID(),
        motorista_id,
        categoria: "UTILITARIO",
        modelo: "Veículo Fictício",
        placa,
        capacidade_kg: 1000,
        descricao: "Teste de aprovação administrativa",
        categoria_porte: "PEQUENO",
        atualizado_em: new Date(),
      },
    });

    await prisma.arquivo_privado.createMany({
      data: [
        { id: identificador + "-foto", tipo: "FOTO_PERFIL" },
        { id: identificador + "-cnh", tipo: "CNH" },
      ].map((doc) => ({
        ...doc,
        tipo: doc.tipo as "FOTO_PERFIL" | "CNH",
        motorista_id,
        chave_armazenamento: doc.id + ".jpg",
        mime_type: "image/jpeg",
        tamanho_bytes: 10,
      })),
    });

    await prisma.cadastro_motorista.create({
      data: {
        id: randomUUID(),
        motorista_id,
        tipo_pessoa: "PF",
        cnh_numero: "DOCUMENTO_FICTICIO",
        cnh_categoria: "B",
        cnh_validade: new Date("2030-12-31T12:00:00Z"),
        foto_perfil_id: identificador + "-foto",
        documento_cnh_id: identificador + "-cnh",
        veiculo_id: veiculo.id,
        status: "EM_ANALISE",
        atualizado_em: new Date(),
      },
    });

    const cookies = cadastroAdministrador.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookies, "Sessão de teste não foi criada.");

    const stale = await PATCH(
      new NextRequest(
        "http://localhost:3002/api/v1/admin/driver/registration",
        {
          method: "PATCH",
          headers: { cookie: cookies, "content-type": "application/json" },
          body: JSON.stringify({
            motorista_id,
            status: "APROVADO",
            expectedUpdatedAt: "2000-01-01T00:00:00.000Z",
          }),
        },
      ),
    );
    assert.equal(
      stale.status,
      409,
      "Uma análise desatualizada não pode aprovar o cadastro",
    );

    // Verifica rollback quando a notificação falha.
    await assert.rejects(
      prisma.$transaction(async (tx) => {
        await tx.cadastro_motorista.updateMany({
          where: {
            motorista_id: motorista_id,
            status: "EM_ANALISE",
          },
          data: {
            status: "APROVADO",
            analisado_em: new Date(),
          },
        });

        // Título vazio provoca uma falha de validação.
        await criarNotificacao(tx, {
          destinatario_id: motorista_id,
          papel_destinatario: "motorista",
          evento: "CADASTRO_APROVADO",
          titulo: " ",
          corpo: "Seu cadastro foi aprovado.",
          autorId: administradorId!,
        });
      }),
      /Os dados da notificação são inválidos/,
    );

    const cadastroAposFalha = await prisma.cadastro_motorista.findUniqueOrThrow({
      where: { motorista_id },
    });

    assert.equal(cadastroAposFalha.status, "EM_ANALISE");
    assert.equal(cadastroAposFalha.analisado_em, null);

    const notificacoesAposFalha = await prisma.notificacao.count({
      where: {
        destinatario_id: motorista_id,
        evento: "CADASTRO_APROVADO",
      },
    });

    assert.equal(notificacoesAposFalha, 0);

    console.log("Rollback da aprovação e notificação - OK");

    const requisicao = new NextRequest(
      "http://localhost:3002/api/v1/admin/driver/registration",
      {
        method: "PATCH",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          motorista_id,
          status: "APROVADO",
        }),
      },
    );

    const resposta = await PATCH(requisicao);

    assert.equal(resposta.status, 200);

    const cadastroAtualizado = await prisma.cadastro_motorista.findUniqueOrThrow(
      {
        where: { motorista_id },
      },
    );

    assert.equal(cadastroAtualizado.status, "APROVADO");
    assert.ok(cadastroAtualizado.analisado_em);

    const notificacaoAprovacao = await prisma.notificacao.findFirst({
      where: {
        destinatario_id: motorista_id,
        evento: "CADASTRO_APROVADO",
      },
    });

    assert.ok(notificacaoAprovacao, "A aprovação deve gerar uma notificação.");

    assert.equal(notificacaoAprovacao.papel_destinatario, "motorista");
    assert.equal(notificacaoAprovacao.lida, false);

    console.log("Aprovação administrativa pela rota PATCH - OK");
    const requisicaoAjustes = new NextRequest(
      "http://localhost:3002/api/v1/admin/driver/registration",
      {
        method: "PATCH",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          motorista_id,
          status: "AJUSTES_SOLICITADOS",
          motivo_ajuste: "Atualizar o documento da CNH.",
        }),
      },
    );

    const respostaAjustes = await PATCH(requisicaoAjustes);

    assert.equal(respostaAjustes.status, 409);

    const cadastroComAjustes = await prisma.cadastro_motorista.findUniqueOrThrow(
      {
        where: { motorista_id },
      },
    );

    assert.equal(cadastroComAjustes.status, "APROVADO");
    assert.equal(cadastroComAjustes.motivo_ajuste, null);

    console.log("Transição inválida bloqueada pela rota PATCH - OK");
    // Simula o retorno do cadastro para análise em um novo cenário de teste.
    await prisma.cadastro_motorista.update({
      where: { motorista_id },
      data: {
        status: "EM_ANALISE",
        motivo_ajuste: null,
        analisado_em: null,
      },
    });

    const requisicaoSolicitacaoAjustes = new NextRequest(
      "http://localhost:3002/api/v1/admin/driver/registration",
      {
        method: "PATCH",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          motorista_id,
          status: "AJUSTES_SOLICITADOS",
          motivo_ajuste: "Atualizar o documento da CNH.",
        }),
      },
    );

    const respostaSolicitacaoAjustes = await PATCH(
      requisicaoSolicitacaoAjustes,
    );

    assert.equal(respostaSolicitacaoAjustes.status, 200);

    const cadastroAjustes = await prisma.cadastro_motorista.findUniqueOrThrow({
      where: { motorista_id },
    });

    assert.equal(cadastroAjustes.status, "AJUSTES_SOLICITADOS");
    assert.equal(cadastroAjustes.motivo_ajuste, "Atualizar o documento da CNH.");
    assert.ok(cadastroAjustes.analisado_em);

    const notificacaoAjustes = await prisma.notificacao.findFirst({
      where: {
        destinatario_id: motorista_id,
        evento: "CADASTRO_AJUSTES_SOLICITADOS",
      },
    });

    assert.ok(
      notificacaoAjustes,
      "A solicitação de ajustes deve gerar uma notificação.",
    );

    assert.match(notificacaoAjustes.corpo, /Atualizar o documento da CNH/);

    // Houve duas decisões válidas nos cenários do teste.
    // A tentativa de transição inválida não deve gerar notificação.
    const quantidadeNotificacoes = await prisma.notificacao.count({
      where: {
        destinatario_id: motorista_id,
        evento: {
          in: ["CADASTRO_APROVADO", "CADASTRO_AJUSTES_SOLICITADOS"],
        },
      },
    });

    assert.equal(quantidadeNotificacoes, 2);

    console.log("Solicitação de ajustes pela rota PATCH - OK");
  } finally {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [motorista_id, ...(administradorId ? [administradorId] : [])],
        },
      },
    });
  }
});
