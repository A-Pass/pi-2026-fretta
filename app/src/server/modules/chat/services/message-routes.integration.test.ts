import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { NextRequest } from "next/server";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../../../db/prisma";
import { GET, POST } from "../../../../app/api/v1/[...path]/route";

test("protege e integra as rotas HTTP de mensagens", async () => {
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

  const usuarios: string[] = [];
  let conversaId: string | undefined;
  let propostaId: string | undefined;
  let freteId: string | undefined;

  async function criarUsuario(nome: string) {
    const email = `chat-http-${randomUUID()}@fretta.invalid`;

    const resposta = await authTeste.api.signUpEmail({
      body: {
        name: nome,
        email,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(resposta.status, 200);

    const dados = await resposta.json();
    usuarios.push(dados.user.id as string);

    const cookie = resposta.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie, "Cookie de sessão não retornado.");

    return {
      id: dados.user.id as string,
      cookie,
    };
  }

  function criarRequisicao(
    metodo: "GET" | "POST",
    cookie?: string,
    body?: unknown,
  ) {
    return new NextRequest(
      `http://localhost:3002/api/v1/conversations/${conversaId}/messages`,
      {
        method: metodo,
        headers: {
          ...(cookie ? { cookie } : {}),
          ...(body !== undefined ? { "content-type": "application/json" } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      },
    );
  }

  try {
    const cliente = await criarUsuario("Cliente Fictício");
    const motorista = await criarUsuario("Motorista Fictício");
    const terceiro = await criarUsuario("Terceiro Fictício");

    await prisma.cliente.create({
      data: { userId: cliente.id },
    });

    await prisma.motorista.create({
      data: { userId: motorista.id },
    });

    const frete = await prisma.frete.create({
      data: {
        clienteId: cliente.id,
        titulo: "Frete de teste HTTP",
        categoriaVeiculo: "UTILITARIO",
        origemSnapshot: {
          cidade: "Eunápolis",
          uf: "BA",
        },
        destinoSnapshot: {
          cidade: "Porto Seguro",
          uf: "BA",
        },
      },
    });

    freteId = frete.id;

    const proposta = await prisma.proposta.create({
      data: {
        freteId: frete.id,
        motoristaId: motorista.id,
      },
    });

    propostaId = proposta.id;

    const conversa = await prisma.conversa.create({
      data: { propostaId: proposta.id },
    });

    conversaId = conversa.id;

    // Requisições sem sessão devem retornar 401.
    const getSemSessao = await GET(criarRequisicao("GET"));
    assert.equal(getSemSessao.status, 401);

    const postSemSessao = await POST(
      criarRequisicao("POST", undefined, {
        text: "Mensagem sem autenticação",
      }),
    );
    assert.equal(postSemSessao.status, 401);

    // Um terceiro não pode acessar a conversa.
    const getTerceiro = await GET(criarRequisicao("GET", terceiro.cookie));
    assert.equal(getTerceiro.status, 404);

    const postTerceiro = await POST(
      criarRequisicao("POST", terceiro.cookie, {
        text: "Tentativa não autorizada",
      }),
    );
    assert.equal(postTerceiro.status, 404);

    // O motorista envia uma mensagem autenticada.
    const clientMessageId = randomUUID();

    const envio = await POST(
      criarRequisicao("POST", motorista.cookie, {
        text: "Olá, posso realizar esse frete.",
        clientMessageId,
      }),
    );

    assert.equal(envio.status, 201);

    const mensagem = await envio.json();
    assert.equal(mensagem.role, "motorista");
    assert.equal(mensagem.text, "Olá, posso realizar esse frete.");
    // Uma mensagem enviada pelo motorista deve notificar o cliente.
    const notificacoesCliente = await prisma.notificacao.findMany({
      where: {
        destinatarioId: cliente.id,
        evento: "NOVA_MENSAGEM",
        conversaId,
      },
    });

    assert.equal(notificacoesCliente.length, 1);

    assert.equal(notificacoesCliente[0].freteId, freteId);
    assert.equal(notificacoesCliente[0].propostaId, propostaId);
    assert.equal(notificacoesCliente[0].lida, false);

    // O motorista não deve receber notificação da própria mensagem.
    const notificacoesMotorista = await prisma.notificacao.count({
      where: {
        destinatarioId: motorista.id,
        conversaId,
      },
    });

    assert.equal(notificacoesMotorista, 0);

    // O cliente consegue consultar a mensagem.
    const consulta = await GET(criarRequisicao("GET", cliente.cookie));

    assert.equal(consulta.status, 200);

    const pagina = await consulta.json();
    assert.equal(pagina.items.length, 1);
    assert.equal(pagina.items[0].id, mensagem.id);

    // Reenvio não cria outra mensagem.
    const reenvio = await POST(
      criarRequisicao("POST", motorista.cookie, {
        text: "Olá, posso realizar esse frete.",
        clientMessageId,
      }),
    );

    assert.equal(reenvio.status, 201);

    const mensagemReenviada = await reenvio.json();
    assert.equal(mensagemReenviada.id, mensagem.id);

    const total = await prisma.mensagem.count({
      where: { conversaId },
    });

    assert.equal(total, 1);
    // Reenviar a mesma mensagem não pode duplicar a notificação.
    const totalNotificacoes = await prisma.notificacao.count({
      where: {
        destinatarioId: cliente.id,
        evento: "NOVA_MENSAGEM",
        conversaId,
      },
    });

    assert.equal(totalNotificacoes, 1);

    // Mensagem vazia é rejeitada.
    const invalida = await POST(
      criarRequisicao("POST", cliente.cookie, {
        text: " ",
      }),
    );

    assert.equal(invalida.status, 422);

    console.log("Rotas HTTP de mensagens verificadas - OK");

    // Cliente envia uma mensagem ao motorista.
    const mensagemClienteId = randomUUID();

    const envioCliente = await POST(
      criarRequisicao("POST", cliente.cookie, {
        text: "Gostaria de confirmar o horário da coleta.",
        clientMessageId: mensagemClienteId,
      }),
    );

    assert.equal(envioCliente.status, 201);

    const mensagemDoCliente = await envioCliente.json();

    assert.equal(mensagemDoCliente.role, "cliente");

    // O motorista deve receber exatamente uma notificação.
    const notificacoesDoMotorista = await prisma.notificacao.findMany({
      where: {
        destinatarioId: motorista.id,
        evento: "NOVA_MENSAGEM",
        conversaId,
      },
    });

    assert.equal(notificacoesDoMotorista.length, 1);
    assert.equal(notificacoesDoMotorista[0].freteId, freteId);
    assert.equal(notificacoesDoMotorista[0].propostaId, propostaId);
    assert.equal(notificacoesDoMotorista[0].lida, false);

    // Reenviar a mesma mensagem não pode gerar outra notificação.
    const reenvioCliente = await POST(
      criarRequisicao("POST", cliente.cookie, {
        text: "Gostaria de confirmar o horário da coleta.",
        clientMessageId: mensagemClienteId,
      }),
    );

    assert.equal(reenvioCliente.status, 201);

    const mensagemReenviadaCliente = await reenvioCliente.json();

    assert.equal(mensagemReenviadaCliente.id, mensagemDoCliente.id);

    const totalNotificacoesMotorista = await prisma.notificacao.count({
      where: {
        destinatarioId: motorista.id,
        evento: "NOVA_MENSAGEM",
        conversaId,
      },
    });

    assert.equal(totalNotificacoesMotorista, 1);

    // Devem existir duas mensagens e duas notificações na conversa.
    const totalMensagensConversa = await prisma.mensagem.count({
      where: { conversaId },
    });

    const totalNotificacoesConversa = await prisma.notificacao.count({
      where: { conversaId },
    });

    assert.equal(totalMensagensConversa, 2);
    assert.equal(totalNotificacoesConversa, 2);
  } finally {
    // Remover notificações fictícias criadas neste teste.
    if (conversaId) {
      await prisma.notificacao.deleteMany({
        where: { conversaId },
      });
    }

    if (conversaId) {
      await prisma.mensagem.deleteMany({
        where: { conversaId },
      });

      await prisma.conversa.deleteMany({
        where: { id: conversaId },
      });
    }
    // Mantenha o restante da limpeza que já existe.

    if (propostaId) {
      await prisma.proposta.deleteMany({
        where: { id: propostaId },
      });
    }

    if (freteId) {
      await prisma.frete.deleteMany({
        where: { id: freteId },
      });
    }

    for (const usuarioId of usuarios) {
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
