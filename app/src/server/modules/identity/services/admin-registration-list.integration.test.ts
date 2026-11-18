import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { prisma } from "../../../db/prisma";

function verificarBancoDeTeste() {
  const databaseUrl = process.env.DATABASE_URL;

  assert.ok(databaseUrl, "DATABASE_URL não configurada.");

  const url = new URL(databaseUrl);

  assert.ok(
    ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.pathname === "/fretta_test",
    "Testes permitidos somente no banco local fretta_test.",
  );
}

test("listagem administrativa exige permissão e protege dados privados", async () => {
  verificarBancoDeTeste();

  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");
  const { NextRequest } = await import("next/server");
  const { GET } = await import("../../../../app/api/v1/[...path]/route");

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
  const usuarioIds: string[] = [];

  const urlBase = "http://localhost:3002/api/v1/admin/driver-registrations";

  try {
    // 1. Acesso sem sessão
    const respostaSemSessao = await GET(new NextRequest(urlBase));

    assert.equal(respostaSemSessao.status, 401);

    // 2. Criação de um usuário comum
    const cadastroUsuario = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Usuário Comum",
        email: `comum-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroUsuario.status, 200);

    const dadosUsuario = await cadastroUsuario.clone().json();
    usuarioIds.push(dadosUsuario.user.id);

    const cookieUsuario = cadastroUsuario.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookieUsuario);

    const respostaComum = await GET(
      new NextRequest(urlBase, {
        headers: { cookie: cookieUsuario },
      }),
    );

    assert.equal(respostaComum.status, 403);

    // 3. Criação de administrador
    const cadastroAdmin = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Administrador de Teste",
        email: `admin-lista-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastroAdmin.status, 200);

    const dadosAdmin = await cadastroAdmin.clone().json();
    usuarioIds.push(dadosAdmin.user.id);

    await prisma.user.update({
      where: { id: dadosAdmin.user.id },
      data: { papel: "ADMIN" },
    });

    const cookieAdmin = cadastroAdmin.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookieAdmin);

    // 4. Criar motorista fictício
    const motoristaId = `motorista-lista-${identificador}`;
    usuarioIds.push(motoristaId);

    await prisma.user.create({
      data: {
        id: motoristaId,
        name: "Motorista Listagem Teste",
        email: `${motoristaId}@fretta.invalid`,
        motorista: { create: {} },
      },
    });

    const veiculo = await prisma.veiculo.create({
      data: {
        motoristaId,
        categoria: "UTILITARIO",
        modelo: "Veículo de Teste",
        placa: `L${identificador.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
        descricao: "Teste de listagem administrativa",
      },
    });

    const cadastro = await prisma.cadastroMotorista.create({
      data: {
        motoristaId,
        tipoPessoa: "PF",
        cnhNumero: "CNH_PRIVADA_TESTE",
        cnhCategoria: "B",
        cnhValidade: new Date("2030-12-31T12:00:00Z"),
        fotoPerfilId: "FOTO_PRIVADA_TESTE",
        documentoCnhId: "DOCUMENTO_PRIVADO_TESTE",
        veiculoId: veiculo.id,
        status: "EM_ANALISE",
      },
    });

    // 5. Administrador consulta cadastros pendentes
    const respostaAdmin = await GET(
      new NextRequest(`${urlBase}?status=EM_ANALISE`, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(respostaAdmin.status, 200);

    const resultado = await respostaAdmin.json();

    assert.ok(Array.isArray(resultado.items));

    const item = resultado.items.find(
      (registro: { id: string }) => registro.id === cadastro.id,
    );

    assert.ok(item, "Cadastro fictício não encontrado.");
    assert.equal(item.nome, "Motorista Listagem Teste");
    assert.equal(item.status, "EM_ANALISE");

    // Não retornar dados privados na listagem
    const respostaTexto = JSON.stringify(resultado);

    assert.ok(!respostaTexto.includes("CNH_PRIVADA_TESTE"));
    assert.ok(!respostaTexto.includes("FOTO_PRIVADA_TESTE"));
    assert.ok(!respostaTexto.includes("DOCUMENTO_PRIVADO_TESTE"));

    // 6. Filtro inválido
    const respostaFiltro = await GET(
      new NextRequest(`${urlBase}?status=INVALIDO`, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(respostaFiltro.status, 422);

    // 7. Cursor inexistente
    const respostaCursor = await GET(
      new NextRequest(`${urlBase}?cursor=inexistente`, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(respostaCursor.status, 422);

    console.log("Listagem administrativa validada.");
  } finally {
    await prisma.user.deleteMany({
      where: {
        id: { in: usuarioIds },
      },
    });
  }
});

test("listagem administrativa pagina 21 cadastros sem repetir registros", async () => {
  verificarBancoDeTeste();

  const { betterAuth } = await import("better-auth");
  const { prismaAdapter } = await import("better-auth/adapters/prisma");
  const { NextRequest } = await import("next/server");
  const { GET } = await import("../../../../app/api/v1/[...path]/route");

  const autenticacaoTeste = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
  });

  const identificador = randomUUID().replace(/-/g, "");
  const usuarioIds: string[] = [];
  const cadastroIds: string[] = [];

  try {
    const respostaAdmin = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Administrador Paginação",
        email: `admin-pag-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(respostaAdmin.status, 200);

    const dadosAdmin = await respostaAdmin.clone().json();
    usuarioIds.push(dadosAdmin.user.id);

    await prisma.user.update({
      where: { id: dadosAdmin.user.id },
      data: { papel: "ADMIN" },
    });

    const cookies = respostaAdmin.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookies);

    // Cria 21 cadastros fictícios para testar duas páginas.
    for (let i = 0; i < 21; i++) {
      const motoristaId = `motorista-pag-${identificador}-${i}`;
      usuarioIds.push(motoristaId);

      await prisma.user.create({
        data: {
          id: motoristaId,
          name: `Motorista Paginação ${i}`,
          email: `${motoristaId}@fretta.invalid`,
          motorista: { create: {} },
        },
      });

      const veiculo = await prisma.veiculo.create({
        data: {
          motoristaId,
          categoria: "UTILITARIO",
          modelo: "Veículo Fictício",
          placa: `P${identificador.slice(0, 5).toUpperCase()}${i
            .toString(36)
            .toUpperCase()
            .padStart(2, "0")}`,
          descricao: "Teste de paginação",
        },
      });

      const cadastro = await prisma.cadastroMotorista.create({
        data: {
          motoristaId,
          tipoPessoa: "PF",
          cnhNumero: `CNH_TESTE_${i}`,
          cnhCategoria: "B",
          cnhValidade: new Date("2030-12-31T12:00:00Z"),
          fotoPerfilId: `foto-teste-${i}`,
          documentoCnhId: `cnh-teste-${i}`,
          veiculoId: veiculo.id,
          status: "EM_ANALISE",
          enviadoEm: new Date(Date.UTC(2026, 10, 17, 12, 0, i)),
        },
      });

      cadastroIds.push(cadastro.id);
    }

    const base = "http://localhost:3002/api/v1/admin/driver-registrations";

    const primeiraResposta = await GET(
      new NextRequest(`${base}?status=EM_ANALISE`, {
        headers: { cookie: cookies },
      }),
    );

    assert.equal(primeiraResposta.status, 200);

    const primeiraPagina = await primeiraResposta.json();

    assert.equal(primeiraPagina.items.length, 20);
    assert.ok(primeiraPagina.nextCursor);

    const segundaResposta = await GET(
      new NextRequest(
        `${base}?status=EM_ANALISE&cursor=${encodeURIComponent(
          primeiraPagina.nextCursor,
        )}`,
        { headers: { cookie: cookies } },
      ),
    );

    assert.equal(segundaResposta.status, 200);

    const segundaPagina = await segundaResposta.json();

    const encontrados = [...primeiraPagina.items, ...segundaPagina.items].map(
      (item: { id: string }) => item.id,
    );

    assert.equal(new Set(encontrados).size, encontrados.length);

    for (const id of cadastroIds) {
      assert.ok(encontrados.includes(id));
    }

    assert.equal(segundaPagina.nextCursor, null);
  } finally {
    await prisma.user.deleteMany({
      where: {
        id: { in: usuarioIds },
      },
    });
  }
});
