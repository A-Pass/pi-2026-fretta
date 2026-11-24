import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import { prisma } from "@/server/db/prisma";
import { criarNotificacao } from "./notification-service";

test("criação segura e transacional de notificações", async () => {
  // Garantir que o teste utilize apenas o banco fretta_test.
  const databaseUrl = process.env.DB_URL;

  assert.ok(databaseUrl, "DB_URL não configurada.");

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

  const destinatario_id = randomUUID();
  const autorId = randomUUID();

  try {
    await prisma.user.create({
      data: {
        id: destinatario_id,
        name: "Destinatário Teste",
        email: `notificacao-${destinatario_id}@fretta.invalid`,
        emailVerified: false,
      },
    });

    const dados = {
      destinatario_id,
      papel_destinatario: "motorista" as const,
      evento: "PROPOSTA_ACEITA",
      titulo: "Proposta aceita",
      corpo: "Sua proposta foi aceita.",
      frete_id: randomUUID(),
      proposta_id: randomUUID(),
      autorId,
    };

    // TESTE 1: Criar notificação com sucesso.
    const criada = await prisma.$transaction(async (tx) => {
      return criarNotificacao(tx, dados);
    });

    assert.ok(criada);
    assert.equal(criada.destinatario_id, destinatario_id);
    assert.equal(criada.evento, "PROPOSTA_ACEITA");
    assert.equal(criada.frete_id, dados.frete_id);
    assert.equal(criada.proposta_id, dados.proposta_id);
    assert.equal(criada.lida, false);

    // TESTE 2: Não notificar o próprio autor.
    const notificacaoPropria = await prisma.$transaction(async (tx) => {
      return criarNotificacao(tx, {
        ...dados,
        autorId: destinatario_id,
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
        destinatario_id,
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
      where: { destinatario_id },
    });

    assert.equal(quantidade, 1);

    console.log("Criação de notificações - OK");
    console.log("Proteção contra auto-notificação - OK");
    console.log("Rollback de transação - OK");
    console.log("Validação de dados - OK");
  } finally {
    await prisma.notificacao.deleteMany({
      where: { destinatario_id },
    });

    await prisma.user.deleteMany({
      where: { id: destinatario_id },
    });
  }
});
