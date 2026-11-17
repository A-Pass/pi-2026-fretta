import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { prisma } from "@/server/db/prisma";
import { criarNotificacao } from "./notification-service";

test("criação segura e transacional de notificações", async () => {
  // Garantir que o teste utilize apenas o banco fretta_test.
  const databaseUrl = process.env.DATABASE_URL;

  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Este teste só pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<Array<{ banco: string }>>`
    SELECT current_database() AS banco
  `;

  assert.equal(banco[0]?.banco, "fretta_test");

  const destinatarioId = randomUUID();
  const autorId = randomUUID();

  try {
    await prisma.user.create({
      data: {
        id: destinatarioId,
        name: "Destinatário Teste",
        email: `notificacao-${destinatarioId}@fretta.invalid`,
        emailVerified: false,
      },
    });

    const dados = {
      destinatarioId,
      papelDestinatario: "motorista" as const,
      evento: "PROPOSTA_ACEITA",
      titulo: "Proposta aceita",
      corpo: "Sua proposta foi aceita.",
      freteId: randomUUID(),
      propostaId: randomUUID(),
      autorId,
    };

    // TESTE 1: Criar notificação com sucesso.
    const criada = await prisma.$transaction(async (tx) => {
      return criarNotificacao(tx, dados);
    });

    assert.ok(criada);
    assert.equal(criada.destinatarioId, destinatarioId);
    assert.equal(criada.evento, "PROPOSTA_ACEITA");
    assert.equal(criada.freteId, dados.freteId);
    assert.equal(criada.propostaId, dados.propostaId);
    assert.equal(criada.lida, false);

    // TESTE 2: Não notificar o próprio autor.
    const notificacaoPropria = await prisma.$transaction(async (tx) => {
      return criarNotificacao(tx, {
        ...dados,
        autorId: destinatarioId,
      });
    });

    assert.equal(notificacaoPropria, null);

    // TESTE 3: Reverter notificação se a transação falhar.
    await assert.rejects(
      prisma.$transaction(async (tx) => {
        await criarNotificacao(tx, {
          ...dados,
          evento: "EVENTO_COM_FALHA",
        });

        throw new Error("FALHA_SIMULADA");
      }),
      /FALHA_SIMULADA/,
    );

    const notificacaoRevertida = await prisma.notificacao.findFirst({
      where: {
        destinatarioId,
        evento: "EVENTO_COM_FALHA",
      },
    });

    assert.equal(notificacaoRevertida, null);

    // TESTE 4: Rejeitar dados obrigatórios vazios.
    await assert.rejects(
      prisma.$transaction(async (tx) => {
        await criarNotificacao(tx, {
          ...dados,
          titulo: " ",
        });
      }),
      (erro: unknown) =>
        erro instanceof Error &&
        erro.message === "Os dados da notificação são inválidos.",
    );

    // TESTE 5: Confirmar que só uma notificação foi salva.
    const quantidade = await prisma.notificacao.count({
      where: { destinatarioId },
    });

    assert.equal(quantidade, 1);

    console.log("Criação de notificações - OK");
    console.log("Proteção contra auto-notificação - OK");
    console.log("Rollback de transação - OK");
    console.log("Validação de dados - OK");
  } finally {
    await prisma.notificacao.deleteMany({
      where: { destinatarioId },
    });

    await prisma.user.deleteMany({
      where: { id: destinatarioId },
    });
  }
});
