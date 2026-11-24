import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { NextRequest } from "next/server";

import { GET, PATCH, POST } from "../../../../app/api/v1/[...path]/route";

import { prisma } from "@/server/db/prisma";

import {
  listarNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
  NotificationError,
} from "./notification-service";

test("Notificações: autenticação, paginação e privacidade", async () => {
  // Segurança: nunca executar este teste no banco compartilhado.
  const databaseUrl = process.env.DB_URL ?? "";

  if (!databaseUrl.includes("/fretta_test")) {
    throw new Error(
      "TEST_DATABASE_REQUIRED: utilize exclusivamente o banco fretta_test.",
    );
  }

  // 1. Verificar autenticação nas rotas HTTP.
  const respostaGet = await GET(
    new NextRequest("http://localhost:3000/api/v1/notifications"),
  );

  assert.equal(respostaGet.status, 401);

  const respostaPatch = await PATCH(
    new NextRequest(
      "http://localhost:3000/api/v1/notifications/notificacao-inexistente",
      { method: "PATCH" },
    ),
  );

  assert.equal(respostaPatch.status, 401);

  const respostaPost = await POST(
    new NextRequest("http://localhost:3000/api/v1/notifications/read-all", {
      method: "POST",
    }),
  );

  assert.equal(respostaPost.status, 401);

  // 2. Criar usuários exclusivos para o teste.
  const usuarioId = randomUUID();
  const outroUsuarioId = randomUUID();

  const usuarioIds = [usuarioId, outroUsuarioId];

  try {
    await prisma.user.createMany({
      data: [
        {
          id: usuarioId,
          name: "Usuario Teste Notificacoes",
          email: `teste-notificacoes-${usuarioId}@example.com`,
          emailVerified: false,
        },
        {
          id: outroUsuarioId,
          name: "Outro Usuario Teste",
          email: `teste-notificacoes-${outroUsuarioId}@example.com`,
          emailVerified: false,
        },
      ],
    });

    // 3. Criar 22 notificações para testar paginação.
    await prisma.notificacao.createMany({
      data: Array.from({ length: 22 }, (_, indice) => ({
        id: randomUUID(),
        destinatario_id: usuarioId,
        papel_destinatario: "cliente",
        evento: "NOVA_MENSAGEM",
        titulo: `Notificacao ${indice + 1}`,
        corpo: "Mensagem de teste.",
        frete_id: randomUUID(),
        lida: false,
        criado_em: new Date(Date.now() - indice * 60_000),
      })),
    });

    // 4. Criar uma notificação de outro usuário.
    const notificacaoPrivada = await prisma.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: outroUsuarioId,
        papel_destinatario: "motorista",
        evento: "NOVA_PROPOSTA",
        titulo: "Notificacao privada",
        corpo: "Somente o destinatario pode acessar.",
        frete_id: randomUUID(),
      },
    });

    // 5. Validar a primeira página.
    const primeiraPagina = await listarNotificacoes(usuarioId);

    assert.equal(primeiraPagina.items.length, 20);
    assert.ok(primeiraPagina.nextCursor);

    // 6. Validar a segunda página.
    const segundaPagina = await listarNotificacoes(
      usuarioId,
      primeiraPagina.nextCursor!,
    );

    assert.equal(segundaPagina.items.length, 2);
    assert.equal(segundaPagina.nextCursor, null);

    // Não pode repetir notificações entre as páginas.
    const todosIds = [
      ...primeiraPagina.items.map((item) => item.id),
      ...segundaPagina.items.map((item) => item.id),
    ];

    assert.equal(new Set(todosIds).size, 22);

    // 7. Impedir acesso a cursor de outro usuário.
    await assert.rejects(
      listarNotificacoes(usuarioId, notificacaoPrivada.id),
      (error: unknown) =>
        error instanceof NotificationError && error.status === 422,
    );

    // 8. Impedir alteração de notificação de outro usuário.
    await assert.rejects(
      marcarNotificacaoLida(notificacaoPrivada.id, usuarioId),
      (error: unknown) =>
        error instanceof NotificationError && error.status === 404,
    );

    // Confirmar que continua não lida.
    const privadaDepois = await prisma.notificacao.findUnique({
      where: { id: notificacaoPrivada.id },
    });

    assert.equal(privadaDepois?.lida, false);

    // 9. Marcar uma notificação própria como lida.
    const notificacaoId = primeiraPagina.items[0].id;

    const notificacaoAtualizada = await marcarNotificacaoLida(
      notificacaoId,
      usuarioId,
    );

    assert.equal(notificacaoAtualizada.read, true);

    // 10. Marcar todas as restantes como lidas.
    const resultado = await marcarTodasNotificacoesLidas(usuarioId);

    assert.equal(resultado.updatedCount, 21);

    // 11. Confirmar persistência no banco.
    const quantidadeNaoLidas = await prisma.notificacao.count({
      where: {
        destinatario_id: usuarioId,
        lida: false,
      },
    });

    assert.equal(quantidadeNaoLidas, 0);

    // A notificação do outro usuário deve permanecer intacta.
    const outraNotificacao = await prisma.notificacao.findUnique({
      where: { id: notificacaoPrivada.id },
    });

    assert.equal(outraNotificacao?.lida, false);
  } finally {
    // Limpar somente os dados criados por este teste.
    await prisma.notificacao.deleteMany({
      where: {
        destinatario_id: { in: usuarioIds },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: { in: usuarioIds },
      },
    });
  }
});
