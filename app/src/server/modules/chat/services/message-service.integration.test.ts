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
  const databaseUrl = process.env.DB_URL;
  assert.ok(databaseUrl, "DB_URL não configurada.");

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
  const cliente_id = `chat-cliente-${sufixo}`;
  const motorista_id = `chat-motorista-${sufixo}`;
  const terceiroId = `chat-terceiro-${sufixo}`;

  let frete_id: string | undefined;
  let proposta_id: string | undefined;
  let conversaId: string | undefined;

  try {
    await prisma.user.create({
      data: {
        id: cliente_id,
        name: "Cliente Teste",
        email: `${cliente_id}@fretta.invalid`,
        emailVerified: false,
        cliente: {
          create: {},
        },
      },
    });

    await prisma.user.create({
      data: {
        id: motorista_id,
        name: "Motorista Teste",
        email: `${motorista_id}@fretta.invalid`,
        emailVerified: false,
        motorista: {
          create: { codigo_publico: randomUUID(), atualizado_em: new Date() },
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
        id: randomUUID(),
        cliente: { connect: { user_id: cliente_id } },
        titulo: "Frete de teste do chat",
        descricao: "Carga fictícia",
        categoria_porte: "PEQUENO",
        tipo_agendamento_enum: "COMBINAR",
        atualizado_em: new Date(),
        endereco_frete_endereco_origem_idToendereco: {
          create: {
            id: randomUUID(),
            logradouro: "Rua Fictícia",
            cidade: "Eunápolis",
            estado: "BA",
            cep: "45880000",
          },
        },
        endereco_frete_endereco_destino_idToendereco: {
          create: {
            id: randomUUID(),
            logradouro: "Avenida Fictícia",
            cidade: "Porto Seguro",
            estado: "BA",
            cep: "45810000",
          },
        },
      },
    });

    frete_id = frete.id;

    const proposta = await prisma.proposta.create({
      data: {
        id: randomUUID(),
        frete_id: frete.id,
        motorista_id,
        valor_proposto: 100,
        atualizado_em: new Date(),
      },
    });

    proposta_id = proposta.id;

    const conversa = await prisma.conversa.create({
      data: {
        id: randomUUID(),
        proposta_id: proposta.id,
        atualizado_em: new Date(),
      },
    });

    conversaId = conversa.id;

    // Cliente e motorista têm acesso.
    await verificarAcessoConversa(conversaId, cliente_id);
    await verificarAcessoConversa(conversaId, motorista_id);

    // Terceiro não pode acessar.
    await assert.rejects(
      () => verificarAcessoConversa(conversaId!, terceiroId),
      (error: unknown) => error instanceof ChatError && error.status === 404,
    );

    // Motorista envia uma mensagem.
    const primeira = await enviarMensagem(conversaId, motorista_id, {
      text: "Posso realizar o transporte.",
      clientMessageId: `msg-${randomUUID()}`,
    });

    assert.equal(primeira.role, "motorista");
    assert.equal(primeira.proposalId, proposta_id);
    assert.equal(primeira.freightId, frete_id);

    // Cliente responde.
    const segunda = await enviarMensagem(conversaId, cliente_id, {
      text: "Qual é o horário disponível?",
      clientMessageId: `msg-${randomUUID()}`,
    });

    assert.equal(segunda.role, "cliente");

    // Texto vazio é rejeitado.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, cliente_id, {
          text: "   ",
        }),
      (error: unknown) => error instanceof ChatError && error.status === 422,
    );

    // Texto acima de 2000 caracteres é rejeitado.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, cliente_id, {
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

    const envioOriginal = await enviarMensagem(conversaId, motorista_id, {
      text: "Mensagem única",
      clientMessageId,
    });

    const reenvio = await enviarMensagem(conversaId, motorista_id, {
      text: "Mensagem única",
      clientMessageId,
    });

    assert.equal(reenvio.id, envioOriginal.id);

    // Mesmo identificador com texto diferente gera conflito.
    await assert.rejects(
      () =>
        enviarMensagem(conversaId!, motorista_id, {
          text: "Texto diferente",
          clientMessageId,
        }),
      (error: unknown) => error instanceof ChatError && error.status === 409,
    );

    // Consulta das mensagens.
    const resultado = await listarMensagens(conversaId, cliente_id);

    assert.equal(resultado.items.length, 3);
    assert.equal(resultado.nextCursor, null);

    // Confirma que as mensagens foram persistidas.
    const total = await prisma.mensagem.count({
      where: {
        proposta_id,
      },
    });

    assert.equal(total, 3);

    // Cria mensagens adicionais para testar a paginação.
    for (let i = 0; i < 23; i++) {
      await enviarMensagem(conversaId, motorista_id, {
        text: `Mensagem de paginação ${i + 1}`,
        clientMessageId: `paginacao-${randomUUID()}`,
      });
    }

    const primeiraPagina = await listarMensagens(conversaId, cliente_id);

    assert.equal(primeiraPagina.items.length, 20);
    assert.ok(primeiraPagina.nextCursor);

    const segundaPagina = await listarMensagens(
      conversaId,
      cliente_id,
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
      () => listarMensagens(conversaId!, cliente_id, randomUUID()),
      (error: unknown) => error instanceof ChatError && error.status === 422,
    );

    console.log("Integração de mensagens concluída - OK");
  } finally {
    // Limpeza na ordem dos relacionamentos.
    if (conversaId) {
      await prisma.mensagem.deleteMany({
        where: { proposta_id },
      });

      await prisma.conversa.deleteMany({
        where: { id: conversaId },
      });
    }

    if (proposta_id) {
      await prisma.proposta.deleteMany({
        where: { id: proposta_id },
      });
    }

    if (frete_id) {
      await prisma.frete.deleteMany({
        where: { id: frete_id },
      });
    }

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [cliente_id, motorista_id, terceiroId],
        },
      },
    });
  }
});
