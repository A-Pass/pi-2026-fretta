import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { NextRequest } from "next/server";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../../../db/prisma";
import { POST as demoPix } from "../../../../app/api/v1/subscription/demo/route";
import { GET } from "../../../../app/api/v1/[...path]/route";

test("protege e consulta assinaturas de motoristas", async () => {
  // Garantir que o teste utilize apenas o banco local fretta_test.
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

  async function criarMotorista(nome: string) {
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: nome,
        email: `subscription-${randomUUID()}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dados = await cadastro.json();
    const usuarioId = dados.user.id as string;

    usuarios.push(usuarioId);

    const cookie = cadastro.headers
      .getSetCookie()
      .map((item) => item.split(";")[0])
      .join("; ");

    assert.ok(cookie, "Cookie de sessão não retornado.");

    await prisma.motorista.create({
      data: {
        userId: usuarioId,
      },
    });

    return {
      id: usuarioId,
      cookie,
    };
  }

  function requisicao(cookie?: string) {
    return new NextRequest("http://localhost:3002/api/v1/subscription", {
      method: "GET",
      headers: {
        ...(cookie ? { cookie } : {}),
      },
    });
  }

  try {
    const motorista = await criarMotorista("Motorista Teste");
    const outroMotorista = await criarMotorista("Outro Motorista");

    const pixRequest = (cookie: string, body: object) =>
      new Request("http://localhost:3002/api/v1/subscription/demo", {
        method: "POST",
        headers: {
          cookie,
          origin: "http://localhost:3002",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    const previousDemoFlag = process.env.FRETTA_DEMO_PIX;
    try {
      delete process.env.FRETTA_DEMO_PIX;
      assert.equal(
        (await demoPix(pixRequest(motorista.cookie, { action: "create" })))
          .status,
        404,
      );
      process.env.FRETTA_DEMO_PIX = "true";
      assert.equal(
        (await demoPix(pixRequest(motorista.cookie, { action: "create" })))
          .status,
        422,
      );
      const vehicle = await prisma.veiculo.create({
        data: {
          motoristaId: motorista.id,
          categoria: "Utilitário",
          modelo: "Veículo de teste",
          placa: randomUUID(),
        },
      });
      await prisma.cadastroMotorista.create({
        data: {
          motoristaId: motorista.id,
          tipoPessoa: "PF",
          cnhNumero: "teste",
          cnhCategoria: "B",
          cnhValidade: new Date("2099-01-01"),
          fotoPerfilId: randomUUID(),
          documentoCnhId: randomUUID(),
          veiculoId: vehicle.id,
          status: "APROVADO",
        },
      });
      const response = await demoPix(
        pixRequest(motorista.cookie, { action: "create" }),
      );
      assert.equal(response.status, 200);
      const invoice = await response.json();
      assert.equal(invoice.active, false);
      assert.match(invoice.qr, /^data:image\/png;base64,/);
      assert.equal(
        (await (await GET(requisicao(motorista.cookie))).json()).active,
        false,
      );
      const confirmation = { action: "confirm", id: invoice.id };
      assert.equal(
        (await demoPix(pixRequest(outroMotorista.cookie, confirmation))).status,
        422,
      );
      const confirmed = await demoPix(
        pixRequest(motorista.cookie, confirmation),
      );
      assert.equal(confirmed.status, 200);
      const first = await confirmed.json();
      const second = await (
        await demoPix(pixRequest(motorista.cookie, confirmation))
      ).json();
      assert.deepEqual(second, first);
      assert.equal(
        (await (await GET(requisicao(motorista.cookie))).json()).active,
        true,
      );
    } finally {
      if (previousDemoFlag === undefined) delete process.env.FRETTA_DEMO_PIX;
      else process.env.FRETTA_DEMO_PIX = previousDemoFlag;
      await prisma.vinculoAssinatura.deleteMany({
        where: { motoristaId: motorista.id, id: { startsWith: "pix-demo-" } },
      });
      await prisma.cadastroMotorista.deleteMany({
        where: { motoristaId: motorista.id },
      });
    }

    const agora = Date.now();
    const dia = 24 * 60 * 60 * 1000;

    // 1. Requisição sem autenticação.
    const semSessao = await GET(requisicao());
    assert.equal(semSessao.status, 401);

    // 2. Motorista sem assinatura.
    const semAssinatura = await GET(requisicao(motorista.cookie));
    assert.equal(semAssinatura.status, 200);

    const dadosSemAssinatura = await semAssinatura.json();
    assert.equal(dadosSemAssinatura.active, false);
    assert.equal(dadosSemAssinatura.expiresAt, null);

    // 3. Criar assinatura pendente.
    const assinatura = await prisma.vinculoAssinatura.create({
      data: {
        motoristaId: motorista.id,
        status: "PENDENTE",
      },
    });

    const pendente = await GET(requisicao(motorista.cookie));
    assert.equal(pendente.status, 200);
    assert.equal((await pendente.json()).active, false);

    // 4. Ativar assinatura com validade de 30 dias.
    const vencimento = new Date(agora + 30 * dia);

    await prisma.vinculoAssinatura.update({
      where: { id: assinatura.id },
      data: {
        status: "ATIVA",
        inicioEm: new Date(agora - dia),
        fimEm: vencimento,
      },
    });

    const ativa = await GET(requisicao(motorista.cookie));
    assert.equal(ativa.status, 200);

    const dadosAtiva = await ativa.json();

    assert.equal(dadosAtiva.active, true);
    assert.equal(dadosAtiva.expiresAt, vencimento.toISOString());

    // 5. Outro motorista não recebe a assinatura.
    const consultaOutro = await GET(requisicao(outroMotorista.cookie));

    assert.equal(consultaOutro.status, 200);
    assert.equal((await consultaOutro.json()).active, false);

    // 6. Assinatura com início no futuro.
    await prisma.vinculoAssinatura.update({
      where: { id: assinatura.id },
      data: {
        status: "ATIVA",
        inicioEm: new Date(agora + dia),
        fimEm: new Date(agora + 30 * dia),
      },
    });

    const futura = await GET(requisicao(motorista.cookie));
    assert.equal((await futura.json()).active, false);

    // 7. Assinatura vencida.
    await prisma.vinculoAssinatura.update({
      where: { id: assinatura.id },
      data: {
        status: "ATIVA",
        inicioEm: new Date(agora - 60 * dia),
        fimEm: new Date(agora - dia),
      },
    });

    const vencida = await GET(requisicao(motorista.cookie));
    assert.equal((await vencida.json()).active, false);

    // 8. Assinatura cancelada.
    await prisma.vinculoAssinatura.update({
      where: { id: assinatura.id },
      data: {
        status: "CANCELADA",
        inicioEm: new Date(agora - dia),
        fimEm: new Date(agora + 30 * dia),
      },
    });

    const cancelada = await GET(requisicao(motorista.cookie));
    assert.equal((await cancelada.json()).active, false);

    // 9. Assinatura expirada.
    await prisma.vinculoAssinatura.update({
      where: { id: assinatura.id },
      data: {
        status: "EXPIRADA",
      },
    });

    const expirada = await GET(requisicao(motorista.cookie));
    assert.equal((await expirada.json()).active, false);

    console.log("Consulta HTTP de assinaturas verificada - OK");
  } finally {
    // Limpar somente os dados fictícios deste teste.
    for (const usuarioId of usuarios) {
      await prisma.vinculoAssinatura.deleteMany({
        where: { motoristaId: usuarioId },
      });

      await prisma.motorista.deleteMany({
        where: { userId: usuarioId },
      });

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
