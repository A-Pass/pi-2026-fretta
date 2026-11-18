import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { NextRequest } from "next/server";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../../../db/prisma";
import { GET, PATCH, POST } from "../../../../app/api/v1/[...path]/route";

test("protege e integra as rotas HTTP de notificacoes", async () => {
  // Garantir que somente o banco local de testes seja utilizado.
  const databaseUrl = process.env.DATABASE_URL;

  assert.ok(databaseUrl, "DATABASE_URL nao configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Este teste so pode utilizar o banco local fretta_test.",
  );

  const banco = await prisma.$queryRaw<
    Array<{ banco: string }>
  >`SELECT current_database() AS banco`;

  assert.equal(banco[0]?.banco, "fretta_test");

  // Configuracao de autenticacao utilizada somente no teste.
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

  async function criarUsuario(nome: string) {
    const email = `notificacao-http-${randomUUID()}@fretta.invalid`;

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

    const usuarioId = dados.user.id as string;
    usuarios.push(usuarioId);

    const cookie = resposta.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie, "Cookie de sessao nao retornado.");

    return {
      id: usuarioId,
      cookie,
    };
  }

  function criarRequisicao(
    metodo: "GET" | "PATCH" | "POST",
    caminho: string,
    cookie?: string,
    body?: unknown,
  ) {
    return new NextRequest(`http://localhost:3002/api/v1${caminho}`, {
      method: metodo,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  }

  try {
    // Criar dois usuarios com sessoes reais.
    const cliente = await criarUsuario("Cliente Teste");
    const motorista = await criarUsuario("Motorista Teste");

    // Criar 22 notificacoes para o cliente.
    await prisma.notificacao.createMany({
      data: Array.from({ length: 22 }, (_, indice) => ({
        id: randomUUID(),
        destinatarioId: cliente.id,
        papelDestinatario: "cliente",
        evento: "NOVA_MENSAGEM",
        titulo: `Notificacao ${indice + 1}`,
        corpo: "Mensagem ficticia para teste.",
        freteId: randomUUID(),
        lida: false,
        criadoEm: new Date(Date.now() - indice * 60_000),
      })),
    });

    // Criar notificacao exclusiva do motorista.
    const notificacaoMotorista = await prisma.notificacao.create({
      data: {
        destinatarioId: motorista.id,
        papelDestinatario: "motorista",
        evento: "NOVA_PROPOSTA",
        titulo: "Notificacao do motorista",
        corpo: "Conteudo privado.",
        freteId: randomUUID(),
      },
    });

    // TESTE 1: GET exige autenticacao.
    const semSessao = await GET(criarRequisicao("GET", "/notifications"));

    assert.equal(semSessao.status, 401);

    // TESTE 2: cliente lista sua primeira pagina.
    const consulta = await GET(
      criarRequisicao("GET", "/notifications", cliente.cookie),
    );

    assert.equal(consulta.status, 200);

    const primeiraPagina = await consulta.json();

    assert.equal(primeiraPagina.items.length, 20);
    assert.ok(primeiraPagina.nextCursor);
    // O frontend deve receber o papel correto.
    assert.equal(primeiraPagina.items[0].role, "cliente");
    assert.equal(primeiraPagina.items[0].read, false);
    assert.equal(typeof primeiraPagina.items[0].freightId, "string");

    // TESTE 3: cliente lista segunda pagina.
    const segundaConsulta = await GET(
      criarRequisicao(
        "GET",
        `/notifications?cursor=${encodeURIComponent(
          primeiraPagina.nextCursor,
        )}`,
        cliente.cookie,
      ),
    );

    assert.equal(segundaConsulta.status, 200);

    const segundaPagina = await segundaConsulta.json();

    assert.equal(segundaPagina.items.length, 2);
    assert.equal(segundaPagina.nextCursor, null);

    // Garantir que nao existem IDs repetidos.
    const todosIds = [
      ...primeiraPagina.items.map((item: { id: string }) => item.id),
      ...segundaPagina.items.map((item: { id: string }) => item.id),
    ];

    assert.equal(new Set(todosIds).size, 22);

    // TESTE 4: cliente nao pode utilizar cursor do motorista.
    const cursorPrivado = await GET(
      criarRequisicao(
        "GET",
        `/notifications?cursor=${notificacaoMotorista.id}`,
        cliente.cookie,
      ),
    );

    assert.equal(cursorPrivado.status, 422);

    // TESTE 5: cliente nao pode marcar notificacao do motorista.
    const alteracaoPrivada = await PATCH(
      criarRequisicao(
        "PATCH",
        `/notifications/${notificacaoMotorista.id}`,
        cliente.cookie,
        { read: true },
      ),
    );

    assert.equal(alteracaoPrivada.status, 404);

    // TESTE 6: PATCH exige autenticacao.
    const patchSemSessao = await PATCH(
      criarRequisicao("PATCH", `/notifications/${todosIds[0]}`, undefined, {
        read: true,
      }),
    );

    assert.equal(patchSemSessao.status, 401);

    // TESTE 7: cliente marca sua notificacao como lida.
    const alteracao = await PATCH(
      criarRequisicao(
        "PATCH",
        `/notifications/${todosIds[0]}`,
        cliente.cookie,
        { read: true },
      ),
    );

    assert.equal(alteracao.status, 200);

    const notificacaoAtualizada = await alteracao.json();

    assert.equal(notificacaoAtualizada.id, todosIds[0]);
    assert.equal(notificacaoAtualizada.read, true);
    assert.equal(notificacaoAtualizada.role, "cliente");

    // Confirmar que a alteracao foi salva no banco.
    const salva = await prisma.notificacao.findUnique({
      where: {
        id: todosIds[0],
      },
    });

    assert.equal(salva?.lida, true);

    // TESTE 8: read-all exige autenticacao.
    const postSemSessao = await POST(
      criarRequisicao("POST", "/notifications/read-all"),
    );

    assert.equal(postSemSessao.status, 401);

    // TESTE 9: cliente marca todas as restantes.
    const marcarTodas = await POST(
      criarRequisicao("POST", "/notifications/read-all", cliente.cookie),
    );

    assert.equal(marcarTodas.status, 200);

    const resultado = await marcarTodas.json();

    assert.equal(resultado.updatedCount, 21);

    // TESTE 10: cliente nao possui notificacoes nao lidas.
    const naoLidas = await prisma.notificacao.count({
      where: {
        destinatarioId: cliente.id,
        lida: false,
      },
    });

    assert.equal(naoLidas, 0);

    // TESTE 11: motorista continua com sua notificacao nao lida.
    const privada = await prisma.notificacao.findUnique({
      where: {
        id: notificacaoMotorista.id,
      },
    });

    assert.equal(privada?.lida, false);

    console.log("Rotas HTTP de notificacoes verificadas - OK");
  } finally {
    // Remover apenas os dados ficticios deste teste.
    await prisma.notificacao.deleteMany({
      where: {
        destinatarioId: {
          in: usuarios,
        },
      },
    });

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
