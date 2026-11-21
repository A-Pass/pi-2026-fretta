import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../../../db/prisma";
import { randomUUID } from "node:crypto";
import { criarNotificacao } from "../../notifications/services/notification-service";

function verificarBancoDeTeste() {
  const databaseUrl = process.env.DATABASE_URL;

  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

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
          create: {},
        },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        motoristaId: usuarioId,
        categoria: "UTILITARIO",
        modelo: "Veículo de Teste",
        placa,
        capacidadeKg: 1000,
        descricao: "Veículo fictício para teste administrativo",
      },
    });

    const cadastro = await prisma.cadastroMotorista.create({
      data: {
        motoristaId: usuarioId,
        tipoPessoa: "PF",
        cnhNumero: "DOCUMENTO_FICTICIO",
        cnhCategoria: "B",
        cnhValidade: new Date("2030-12-31T12:00:00Z"),
        fotoPerfilId: "arquivo-ficticio-foto",
        documentoCnhId: "arquivo-ficticio-cnh",
        veiculoId: veiculo.id,
        status: "EM_ANALISE",
      },
    });

    assert.equal(cadastro.status, "EM_ANALISE");

    const resultado = await prisma.cadastroMotorista.updateMany({
      where: {
        id: cadastro.id,
        status: "EM_ANALISE",
      },
      data: {
        status: "APROVADO",
        motivoAjuste: null,
        analisadoEm: new Date(),
      },
    });

    assert.equal(resultado.count, 1);

    const cadastroAtualizado = await prisma.cadastroMotorista.findUniqueOrThrow(
      {
        where: {
          id: cadastro.id,
        },
      },
    );

    assert.equal(cadastroAtualizado.status, "APROVADO");
    assert.ok(cadastroAtualizado.analisadoEm);

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
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const identificador = randomUUID();
  const administradorEmail = `admin-${identificador}@fretta.invalid`;
  const motoristaId = `motorista-${identificador}`;
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
        id: motoristaId,
        name: "Motorista de Teste",
        email: `${motoristaId}@fretta.invalid`,
        emailVerified: false,
        motorista: {
          create: {},
        },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        motoristaId,
        categoria: "UTILITARIO",
        modelo: "Veículo Fictício",
        placa,
        capacidadeKg: 1000,
        descricao: "Teste de aprovação administrativa",
      },
    });

    await prisma.arquivoPrivado.createMany({
      data: [
        { id: identificador + "-foto", tipo: "FOTO_PERFIL" },
        { id: identificador + "-cnh", tipo: "CNH" },
      ].map((doc) => ({
        ...doc,
        tipo: doc.tipo as "FOTO_PERFIL" | "CNH",
        motoristaId,
        chaveArmazenamento: doc.id + ".jpg",
        mimeType: "image/jpeg",
        tamanhoBytes: 10,
      })),
    });

    await prisma.cadastroMotorista.create({
      data: {
        motoristaId,
        tipoPessoa: "PF",
        cnhNumero: "DOCUMENTO_FICTICIO",
        cnhCategoria: "B",
        cnhValidade: new Date("2030-12-31T12:00:00Z"),
        fotoPerfilId: identificador + "-foto",
        documentoCnhId: identificador + "-cnh",
        veiculoId: veiculo.id,
        status: "EM_ANALISE",
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
            motoristaId,
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
        await tx.cadastroMotorista.updateMany({
          where: {
            motoristaId,
            status: "EM_ANALISE",
          },
          data: {
            status: "APROVADO",
            analisadoEm: new Date(),
          },
        });

        // Título vazio provoca uma falha de validação.
        await criarNotificacao(tx, {
          destinatarioId: motoristaId,
          papelDestinatario: "motorista",
          evento: "CADASTRO_APROVADO",
          titulo: " ",
          corpo: "Seu cadastro foi aprovado.",
          autorId: administradorId!,
        });
      }),
      /Os dados da notificação são inválidos/,
    );

    const cadastroAposFalha = await prisma.cadastroMotorista.findUniqueOrThrow({
      where: { motoristaId },
    });

    assert.equal(cadastroAposFalha.status, "EM_ANALISE");
    assert.equal(cadastroAposFalha.analisadoEm, null);

    const notificacoesAposFalha = await prisma.notificacao.count({
      where: {
        destinatarioId: motoristaId,
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
          motoristaId,
          status: "APROVADO",
        }),
      },
    );

    const resposta = await PATCH(requisicao);

    assert.equal(resposta.status, 200);

    const cadastroAtualizado = await prisma.cadastroMotorista.findUniqueOrThrow(
      {
        where: { motoristaId },
      },
    );

    assert.equal(cadastroAtualizado.status, "APROVADO");
    assert.ok(cadastroAtualizado.analisadoEm);

    const notificacaoAprovacao = await prisma.notificacao.findFirst({
      where: {
        destinatarioId: motoristaId,
        evento: "CADASTRO_APROVADO",
      },
    });

    assert.ok(notificacaoAprovacao, "A aprovação deve gerar uma notificação.");

    assert.equal(notificacaoAprovacao.papelDestinatario, "motorista");
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
          motoristaId,
          status: "AJUSTES_SOLICITADOS",
          motivoAjuste: "Atualizar o documento da CNH.",
        }),
      },
    );

    const respostaAjustes = await PATCH(requisicaoAjustes);

    assert.equal(respostaAjustes.status, 409);

    const cadastroComAjustes = await prisma.cadastroMotorista.findUniqueOrThrow(
      {
        where: { motoristaId },
      },
    );

    assert.equal(cadastroComAjustes.status, "APROVADO");
    assert.equal(cadastroComAjustes.motivoAjuste, null);

    console.log("Transição inválida bloqueada pela rota PATCH - OK");
    // Simula o retorno do cadastro para análise em um novo cenário de teste.
    await prisma.cadastroMotorista.update({
      where: { motoristaId },
      data: {
        status: "EM_ANALISE",
        motivoAjuste: null,
        analisadoEm: null,
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
          motoristaId,
          status: "AJUSTES_SOLICITADOS",
          motivoAjuste: "Atualizar o documento da CNH.",
        }),
      },
    );

    const respostaSolicitacaoAjustes = await PATCH(
      requisicaoSolicitacaoAjustes,
    );

    assert.equal(respostaSolicitacaoAjustes.status, 200);

    const cadastroAjustes = await prisma.cadastroMotorista.findUniqueOrThrow({
      where: { motoristaId },
    });

    assert.equal(cadastroAjustes.status, "AJUSTES_SOLICITADOS");
    assert.equal(cadastroAjustes.motivoAjuste, "Atualizar o documento da CNH.");
    assert.ok(cadastroAjustes.analisadoEm);

    const notificacaoAjustes = await prisma.notificacao.findFirst({
      where: {
        destinatarioId: motoristaId,
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
        destinatarioId: motoristaId,
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
          in: [motoristaId, ...(administradorId ? [administradorId] : [])],
        },
      },
    });
  }
});
