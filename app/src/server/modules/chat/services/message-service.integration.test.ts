import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { prisma } from "../../../db/prisma";
import {
  ChatError,
  enviarMensagem,
  listarMensagens,
  verificarAcessoConversa,
} from "./message-service";

test("integra mensagens com autorização e paginação", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Este teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(banco[0]?.banco, "fretta_test");

  const sufixo = randomUUID();
  const clienteId = `chat-cliente-${sufixo}`;
  const motoristaId = `chat-motorista-${sufixo}`;
  const terceiroId = `chat-terceiro-${sufixo}`;

  let freteId: string | undefined;
  let propostaId: string | undefined;
  let conversaId: string | undefined;

  try {
    await prisma.user.create({
      data: {
        id: clienteId,
        name: "Cliente Teste",
        email: `${clienteId}@fretta.invalid`,
        emailVerified: false,
        cliente: {
          create: {},
        },
      },
    });

    await prisma.user.create({
      data: {
        id: motoristaId,
        name: "Motorista Teste",
        email: `${motoristaId}@fretta.invalid`,
        emailVerified: false,
        motorista: {
          create: {},
        },
      },
    });

    await prisma.user.create({
      data: {
        id: terceiroId,
        name: "Terceiro Teste",
        email: `${terceiroId}@fretta.invalid`,
        emailVerified: false,
      },
    });

    const frete = await prisma.frete.create({
      data: {
        clienteId,
        titulo: "Frete de teste do chat",
        descricao: "Carga fictícia",
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
        motoristaId,
      },
    });

    propostaId = proposta.id;

    const conversa = await prisma.conversa.create({
      data: {
        propostaId: proposta.id,
      },
    });

    conversaId = conversa.id;

    // Cliente e motorista têm acesso.
    await verificarAcessoConversa(conversaId, clienteId);
    await verificarAcessoConversa(conversaId, motoristaId);

    // Terceiro não pode acessar.
    await assert.rejects(
      () => verificarAcessoConversa(conversaId!, terceiroId),
      (error: unknown) => error instanceof ChatError && error.status === 404,
    );

    // Motorista envia uma mensagem.
    const primeira = await enviarMensagem(conversaId, motoristaId, {
      text: "Posso realizar o transporte.",
      clientMessageId: `msg-${randomUUID()}`,
    });

    assert.equal(primeira.role, "motorista");
    assert.equal(primeira.proposalId, propostaId);
    assert.equal(primeira.freightId, freteId);

    // Cliente responde.
    const segunda = await enviarMensagem(conversaId, clienteId, {
      text: "Qual é o horário disponível?",
      clientMessageId: `msg-${randomUUID()}`,
    });

    assert.equal(segunda.role, "cliente");

    // Texto vazio é rejeitado.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, clienteId, {
          text: "   ",
        }),
      (error: unknown) => error instanceof ChatError && error.status === 422,
    );

    // Texto acima de 2000 caracteres é rejeitado.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, clienteId, {
          text: "A".repeat(2001),
        }),
      (error: unknown) => error instanceof ChatError && error.status === 422,
    );

    // Terceiro não consegue enviar.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, terceiroId, {
          text: "Tentativa não autorizada.",
        }),
      (error: unknown) => error instanceof ChatError && error.status === 404,
    );

    // Reenvio com o mesmo identificador não duplica.
    const clientMessageId = `duplicada-${randomUUID()}`;

    const envioOriginal = await enviarMensagem(conversaId, motoristaId, {
      text: "Mensagem única",
      clientMessageId,
    });

    const reenvio = await enviarMensagem(conversaId, motoristaId, {
      text: "Mensagem única",
      clientMessageId,
    });

    assert.equal(reenvio.id, envioOriginal.id);

    // Mesmo identificador com texto diferente gera conflito.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, motoristaId, {
          text: "Texto diferente",
          clientMessageId,
        }),
      (error: unknown) => error instanceof ChatError && error.status === 409,
    );

    // Consulta das mensagens.
    const resultado = await listarMensagens(conversaId, clienteId);

    assert.equal(resultado.items.length, 3);
    assert.equal(resultado.nextCursor, null);

    // Confirma que as mensagens foram persistidas.
    const total = await prisma.mensagem.count({
      where: {
        conversaId,
      },
    });

    assert.equal(total, 3);

    // Cria mensagens adicionais para testar a paginação.
    for (let i = 0; i < 23; i++) {
      await enviarMensagem(conversaId, motoristaId, {
        text: `Mensagem de paginação ${i + 1}`,
        clientMessageId: `paginacao-${randomUUID()}`,
      });
    }

    const primeiraPagina = await listarMensagens(conversaId, clienteId);

    assert.equal(primeiraPagina.items.length, 20);
    assert.ok(primeiraPagina.nextCursor);

    const segundaPagina = await listarMensagens(
      conversaId,
      clienteId,
      primeiraPagina.nextCursor,
    );

    assert.equal(segundaPagina.items.length, 6);
    assert.equal(segundaPagina.nextCursor, null);

    // Nenhuma mensagem deve aparecer nas duas páginas.
    const ids = [
      ...primeiraPagina.items.map((mensagem) => mensagem.id),
      ...segundaPagina.items.map((mensagem) => mensagem.id),
    ];

    assert.equal(new Set(ids).size, 26);

    // Um cursor de outra conversa ou inexistente é inválido.
    await assert.rejects(
      () => listarMensagens(conversaId!, clienteId, randomUUID()),
      (error: unknown) => error instanceof ChatError && error.status === 422,
    );

    console.log("Integração de mensagens concluída - OK");
  } finally {
    // Limpeza na ordem dos relacionamentos.
    if (conversaId) {
      await prisma.mensagem.deleteMany({
        where: { conversaId },
      });

      await prisma.conversa.deleteMany({
        where: { id: conversaId },
      });
    }

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

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [clienteId, motoristaId, terceiroId],
        },
      },
    });
  }
});
