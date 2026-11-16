
import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";

import { GET, POST } from "../../../../app/api/v1/[...path]/route";

import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../../db/prisma";

import sharp from "sharp";
import { salvarDocumentoMotorista } from "./private-file-service";
import { removerArquivoPrivado } from "../storage/private-file-storage";

test("bloqueia cadastro de motorista sem autenticação", async () => {
  const requisicao = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  const resposta = await POST(requisicao);
  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(dados.code, "UNAUTHORIZED");

  console.log("Cadastro sem autenticação bloqueado - OK");
});


test("bloqueia cadastro sem perfil de motorista", async () => {
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

  let usuarioId: string | undefined;

  try {
    const cadastro = await authTeste.api.signUpEmail({
      body: {
        name: "Usuário Fictício",
        email: `cadastro-${randomUUID()}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(cadastro.status, 200);

    const dados = await cadastro.json();
    usuarioId = dados.user.id;

    const cookies = cadastro.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    assert.ok(cookies, "Cookie de sessão não encontrado.");

    const requisicao = new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "POST",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    const resposta = await POST(requisicao);
    const resultado = await resposta.json();

    assert.equal(resposta.status, 403);
    assert.equal(resultado.code, "FORBIDDEN");
    // Ativar o perfil de motorista para testar a validação dos dados.
await prisma.motorista.create({
  data: {
    userId: usuarioId!,
  },
});

const requisicaoInvalida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  },
);

const respostaInvalida = await POST(requisicaoInvalida);
const dadosInvalidos = await respostaInvalida.json();

assert.equal(respostaInvalida.status, 422);
assert.equal(dadosInvalidos.code, "INVALID_INPUT");

console.log("Cadastro com dados incompletos bloqueado - OK");

const requisicaoCpfInvalido = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "11111111111",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2099-12-31",
      veiculoId: "veiculo-ficticio",
    }),
  },
);

    const respostaCpfInvalido = await POST(requisicaoCpfInvalido);
    const dadosCpfInvalido = await respostaCpfInvalido.json();

    assert.equal(respostaCpfInvalido.status, 422);
    assert.equal(dadosCpfInvalido.code, "VALIDATION_ERROR");
    assert.match(dadosCpfInvalido.message, /CPF inválido/);

    console.log("Cadastro com CPF inválido bloqueado - OK");

const requisicaoCnhVencida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "529.982.247-25",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2020-01-01",
      veiculoId: "veiculo-ficticio",
    }),
  },
);

    const respostaCnhVencida = await POST(requisicaoCnhVencida);
    const dadosCnhVencida = await respostaCnhVencida.json();

    assert.equal(respostaCnhVencida.status, 422);
    assert.equal(dadosCnhVencida.code, "VALIDATION_ERROR");
    assert.match(
    dadosCnhVencida.message,
    /CNH vencida ou data inválida/,
    );

    console.log("Cadastro com CNH vencida bloqueado - OK");

const outroMotoristaId = `motorista-teste-${randomUUID()}`;

try {
  // Criar outro motorista fictício.
  await prisma.user.create({
    data: {
      id: outroMotoristaId,
      name: "Outro Motorista Fictício",
      email: `${outroMotoristaId}@fretta.invalid`,
      emailVerified: false,
      motorista: {
        create: {},
      },
    },
  });

  // O veículo pertence ao outro motorista.
  const veiculoDeOutroMotorista = await prisma.veiculo.create({
    data: {
      motoristaId: outroMotoristaId,
      categoria: "UTILITARIO",
      modelo: "Veículo Fictício",
      placa: `T${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      capacidadeKg: 1000,
      descricao: "Teste de propriedade do veículo",
    },
  });

  // O motorista autenticado tenta usar esse veículo.
  const requisicaoVeiculoAlheio = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration",
    {
      method: "POST",
      headers: {
        cookie: cookies,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        tipoPessoa: "PF",
        nomeCompleto: "Motorista de Teste",
        cpf: "529.982.247-25",
        cnhNumero: "12345678901",
        cnhCategoria: "B",
        cnhValidade: "2099-12-31",
        veiculoId: veiculoDeOutroMotorista.id,
      }),
    },
  );

  const respostaVeiculoAlheio = await POST(requisicaoVeiculoAlheio);
  const dadosVeiculoAlheio = await respostaVeiculoAlheio.json();

  assert.equal(respostaVeiculoAlheio.status, 422);
  assert.equal(dadosVeiculoAlheio.code, "INVALID_VEHICLE");

  console.log("Uso de veículo de outro motorista bloqueado - OK");
} finally {
  await prisma.user.deleteMany({
    where: {
      id: outroMotoristaId,
    },
  });
}

const veiculoProprio = await prisma.veiculo.create({
  data: {
    motoristaId: usuarioId!,
    categoria: "UTILITARIO",
    modelo: "Veículo Próprio de Teste",
    placa: `T${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    capacidadeKg: 1000,
    descricao: "Teste de cadastro com veículo próprio",
  },
});

const requisicaoValida = new NextRequest(
  "http://localhost:3002/api/v1/driver/registration",
  {
    method: "POST",
    headers: {
      cookie: cookies,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      tipoPessoa: "PF",
      nomeCompleto: "Motorista de Teste",
      cpf: "529.982.247-25",
      cnhNumero: "12345678901",
      cnhCategoria: "B",
      cnhValidade: "2099-12-31",
      veiculoId: veiculoProprio.id,
    }),
  },
);

const respostaValida = await POST(requisicaoValida);
const dadosValidos = await respostaValida.json();

    assert.equal(respostaValida.status, 422);
    assert.equal(dadosValidos.code, "DOCUMENTS_REQUIRED");

    console.log("Cadastro sem documentos obrigatórios bloqueado - OK");

    const imagemTeste = await sharp({
    create: {
        width: 100,
        height: 100,
        channels: 3,
        background: "#ffffff",
    },
    })
    .png()
    .toBuffer();

    const documentosCriados: string[] = [];

    try {
    // Criar foto de perfil vinculada ao motorista.
    const foto = await salvarDocumentoMotorista({
        motoristaId: usuarioId!,
        tipo: "FOTO_PERFIL",
        bytes: imagemTeste,
    });

    documentosCriados.push(foto.id);

    // Criar documento da CNH.
    const cnh = await salvarDocumentoMotorista({
        motoristaId: usuarioId!,
        tipo: "CNH",
        bytes: imagemTeste,
    });

    documentosCriados.push(cnh.id);

    // Enviar cadastro completo.
    const requisicaoCompleta = new NextRequest(
        "http://localhost:3002/api/v1/driver/registration",
        {
        method: "POST",
        headers: {
            cookie: cookies,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            tipoPessoa: "PF",
            nomeCompleto: "Motorista de Teste",
            cpf: "529.982.247-25",
            cnhNumero: "12345678901",
            cnhCategoria: "B",
            cnhValidade: "2099-12-31",
            veiculoId: veiculoProprio.id,
            fotoPerfilId: foto.id,
            documentoCnhId: cnh.id,
        }),
        },
    );

    const respostaCompleta = await POST(requisicaoCompleta);
    const dadosCompletos = await respostaCompleta.json();

    assert.equal(
        respostaCompleta.status,
        201,
        JSON.stringify(dadosCompletos),
    );

    assert.equal(dadosCompletos.status, "EM_ANALISE");

    // Confirmar persistência do cadastro.
    const cadastroSalvo =
        await prisma.cadastroMotorista.findUniqueOrThrow({
        where: { motoristaId: usuarioId! },
        });

    assert.equal(cadastroSalvo.status, "EM_ANALISE");
    assert.equal(cadastroSalvo.fotoPerfilId, foto.id);
    assert.equal(cadastroSalvo.documentoCnhId, cnh.id);
    assert.equal(cadastroSalvo.veiculoId, veiculoProprio.id);

    // Confirmar persistência dos dados pessoais.
    const pessoaSalva = await prisma.pessoa.findUniqueOrThrow({
        where: { userId: usuarioId! },
    });

    assert.equal(pessoaSalva.nomeCompleto, "Motorista de Teste");
    assert.equal(pessoaSalva.cpf, "52998224725");

    console.log("Cadastro completo persistido no PostgreSQL - OK");

  // Consultar o cadastro pela API.
  const requisicaoConsulta = new NextRequest(
    "http://localhost:3002/api/v1/driver/registration",
    {
      method: "GET",
      headers: {
        cookie: cookies,
      },
    },
  );

  const respostaConsulta = await GET(requisicaoConsulta);
  const dadosConsulta = await respostaConsulta.json();

  assert.equal(respostaConsulta.status, 200);
  assert.equal(dadosConsulta.status, "EM_ANALISE");
  assert.equal(dadosConsulta.cadastroCompleto, true);
  assert.equal(dadosConsulta.podeRealizarFretes, false);

  // A consulta não deve expor documentos ou dados sensíveis.
  assert.equal(dadosConsulta.cpf, undefined);
  assert.equal(dadosConsulta.cnhNumero, undefined);
  assert.equal(dadosConsulta.fotoPerfilId, undefined);
  assert.equal(dadosConsulta.documentoCnhId, undefined);

  console.log("Consulta privada do cadastro em análise - OK");


  // Impedir novo envio enquanto o cadastro está em análise.
  const respostaReenvio = await POST(
    new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "POST",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tipoPessoa: "PF",
          nomeCompleto: "Motorista de Teste",
          cpf: "529.982.247-25",
          cnhNumero: "12345678901",
          cnhCategoria: "B",
          cnhValidade: "2099-12-31",
          veiculoId: veiculoProprio.id,
          fotoPerfilId: foto.id,
          documentoCnhId: cnh.id,
        }),
      },
    ),
  );

  const dadosReenvio = await respostaReenvio.json();

  assert.equal(respostaReenvio.status, 409);
  assert.equal(dadosReenvio.code, "REGISTRATION_NOT_EDITABLE");

  const quantidadeCadastros = await prisma.cadastroMotorista.count({
    where: { motoristaId: usuarioId! },
  });

  assert.equal(quantidadeCadastros, 1);

  console.log("Reenvio de cadastro em análise bloqueado - OK");

  // Simular uma solicitação de ajustes pelo administrador.
  await prisma.cadastroMotorista.update({
    where: { motoristaId: usuarioId! },
    data: {
      status: "AJUSTES_SOLICITADOS",
      motivoAjuste: "Atualizar os dados da CNH.",
      analisadoEm: new Date(),
    },
  });

  // Consultar o cadastro após solicitação de ajustes.
  const respostaConsultaAjustes = await GET(
    new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "GET",
        headers: {
          cookie: cookies,
        },
      },
    ),
  );

  const dadosConsultaAjustes =
    await respostaConsultaAjustes.json();

  assert.equal(respostaConsultaAjustes.status, 200);
  assert.equal(dadosConsultaAjustes.status, "AJUSTES_SOLICITADOS");
  assert.equal(
    dadosConsultaAjustes.motivoAjuste,
    "Atualizar os dados da CNH.",
  );
  assert.ok(dadosConsultaAjustes.analisadoEm);
  assert.equal(dadosConsultaAjustes.podeRealizarFretes, false);

  console.log("Consulta dos ajustes solicitados - OK");

  // Motorista corrige os dados e reenvia o cadastro.
  const respostaAjustes = await POST(
    new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "POST",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tipoPessoa: "PF",
          nomeCompleto: "Motorista de Teste Atualizado",
          cpf: "529.982.247-25",
          cnhNumero: "12345678901",
          cnhCategoria: "B",
          cnhValidade: "2099-12-31",
          veiculoId: veiculoProprio.id,
          fotoPerfilId: foto.id,
          documentoCnhId: cnh.id,
        }),
      },
    ),
  );

  const dadosAjustes = await respostaAjustes.json();

  assert.equal(respostaAjustes.status, 201, JSON.stringify(dadosAjustes));
  assert.equal(dadosAjustes.status, "EM_ANALISE");

  const cadastroReenviado =
    await prisma.cadastroMotorista.findUniqueOrThrow({
      where: { motoristaId: usuarioId! },
    });

  assert.equal(cadastroReenviado.status, "EM_ANALISE");
  assert.equal(cadastroReenviado.motivoAjuste, null);
  assert.equal(cadastroReenviado.analisadoEm, null);

  const pessoaAtualizada = await prisma.pessoa.findUniqueOrThrow({
    where: { userId: usuarioId! },
  });

  assert.equal(
    pessoaAtualizada.nomeCompleto,
    "Motorista de Teste Atualizado",
  );

  assert.equal(
    await prisma.cadastroMotorista.count({
      where: { motoristaId: usuarioId! },
    }),
    1,
  );

  console.log("Reenvio após solicitação de ajustes aprovado - OK");

  // Simular a aprovação administrativa.
  await prisma.cadastroMotorista.update({
    where: { motoristaId: usuarioId! },
    data: {
      status: "APROVADO",
      analisadoEm: new Date(),
    },
  });

  // Tentar reenviar um cadastro já aprovado.
  const respostaAprovado = await POST(
    new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "POST",
        headers: {
          cookie: cookies,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          tipoPessoa: "PF",
          nomeCompleto: "Alteração Não Autorizada",
          cpf: "529.982.247-25",
          cnhNumero: "12345678901",
          cnhCategoria: "B",
          cnhValidade: "2099-12-31",
          veiculoId: veiculoProprio.id,
          fotoPerfilId: foto.id,
          documentoCnhId: cnh.id,
        }),
      },
    ),
  );

  const dadosAprovado = await respostaAprovado.json();

  assert.equal(respostaAprovado.status, 409);
  assert.equal(
    dadosAprovado.code,
    "REGISTRATION_ALREADY_APPROVED",
  );

  const cadastroAprovado =
    await prisma.cadastroMotorista.findUniqueOrThrow({
      where: { motoristaId: usuarioId! },
    });

  assert.equal(cadastroAprovado.status, "APROVADO");

  const pessoaAprovada = await prisma.pessoa.findUniqueOrThrow({
    where: { userId: usuarioId! },
  });

  assert.equal(
    pessoaAprovada.nomeCompleto,
    "Motorista de Teste Atualizado",
  );

  console.log("Reenvio de cadastro aprovado bloqueado - OK");

  // Consultar o cadastro após aprovação administrativa.
  const respostaConsultaAprovado = await GET(
    new NextRequest(
      "http://localhost:3002/api/v1/driver/registration",
      {
        method: "GET",
        headers: {
          cookie: cookies,
        },
      },
    ),
  );

  const dadosConsultaAprovado =
    await respostaConsultaAprovado.json();

  assert.equal(respostaConsultaAprovado.status, 200);
  assert.equal(dadosConsultaAprovado.status, "APROVADO");
  assert.equal(dadosConsultaAprovado.cadastroCompleto, true);
  assert.equal(dadosConsultaAprovado.podeRealizarFretes, false);
  assert.ok(dadosConsultaAprovado.analisadoEm);

  // Não expor dados pessoais ou documentos na resposta.
  assert.equal(dadosConsultaAprovado.cpf, undefined);
  assert.equal(dadosConsultaAprovado.cnhNumero, undefined);
  assert.equal(dadosConsultaAprovado.fotoPerfilId, undefined);
  assert.equal(dadosConsultaAprovado.documentoCnhId, undefined);

  console.log("Consulta do cadastro aprovado - OK");

    } finally {
    // Remover somente arquivos criados por este teste.
    for (const id of documentosCriados) {
        const registro = await prisma.arquivoPrivado.findUnique({
        where: { id },
        });

        if (registro) {
        await removerArquivoPrivado(
            registro.chaveArmazenamento,
        );
        }
    }

    // Os registros do banco serão removidos pelo
    // finally externo, ao excluir o usuário fictício.
    }
    console.log("Cadastro sem perfil de motorista bloqueado - OK");
  } finally {
    if (usuarioId) {
      await prisma.user.deleteMany({
        where: { id: usuarioId },
      });
    }
  }
});