import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import sharp from "sharp";

import { prisma } from "../../../db/prisma";
import { salvarDocumentoMotorista } from "./private-file-service";
import { removerArquivoPrivado } from "../storage/private-file-storage";

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

test("administrador acessa somente documentos vinculados ao cadastro", async () => {
  verificarBancoDeTeste();

  const banco = await prisma.$queryRaw<Array<{ banco: string }>>`
    SELECT current_database() AS banco
  `;
  assert.equal(banco[0]?.banco, "fretta_test");

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
  const arquivoIds: string[] = [];

  const base = "http://localhost:3002/api/v1/admin/driver-registrations";

  function cookiesDaResposta(resposta: Response) {
    return resposta.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
  }

  try {
    // 1. Criar administrador
    const respostaAdmin = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Administrador de Teste",
        email: `admin-doc-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(respostaAdmin.status, 200);

    const admin = await respostaAdmin.clone().json();
    usuarioIds.push(admin.user.id);

    await prisma.user.update({
      where: { id: admin.user.id },
      data: { papel: "ADMIN" },
    });

    const cookieAdmin = cookiesDaResposta(respostaAdmin);
    assert.ok(cookieAdmin);

    // 2. Criar usuário comum
    const respostaComum = await autenticacaoTeste.api.signUpEmail({
      body: {
        name: "Usuário Comum",
        email: `comum-doc-${identificador}@fretta.invalid`,
        password: "SenhaFicticia123!",
      },
      asResponse: true,
    });

    assert.equal(respostaComum.status, 200);

    const comum = await respostaComum.clone().json();
    usuarioIds.push(comum.user.id);

    const cookieComum = cookiesDaResposta(respostaComum);
    assert.ok(cookieComum);

    // 3. Preparar imagem fictícia
    const imagem = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: "#ffffff",
      },
    })
      .png()
      .toBuffer();

    async function criarMotorista(indice: number) {
      const motoristaId = `motorista-doc-${identificador}-${indice}`;
      usuarioIds.push(motoristaId);

      await prisma.user.create({
        data: {
          id: motoristaId,
          name: `Motorista Fictício ${indice}`,
          email: `${motoristaId}@fretta.invalid`,
          motorista: {
            create: {
              codigo_publico: randomUUID(),
              atualizado_em: new Date(),
            },
          },
        },
      });

      const veiculo = await prisma.veiculo.create({
        data: {
          id: randomUUID(),
          motorista_id: motoristaId,
          categoria: "UTILITARIO",
          modelo: "Veículo Fictício",
          placa: `D${identificador.slice(0, 5).toUpperCase()}${indice}`,
          categoria_porte: "PEQUENO",
          descricao: "Teste administrativo",
          atualizado_em: new Date(),
        },
      });

      const foto = await salvarDocumentoMotorista({
        motorista_id: motoristaId,
        tipo: "FOTO_PERFIL",
        bytes: imagem,
      });
      arquivoIds.push(foto.id);

      const cnh = await salvarDocumentoMotorista({
        motorista_id: motoristaId,
        tipo: "CNH",
        bytes: imagem,
      });
      arquivoIds.push(cnh.id);

      const cadastro = await prisma.cadastro_motorista.create({
        data: {
          id: randomUUID(),
          motorista_id: motoristaId,
          tipo_pessoa: "PF",
          cnh_numero: `CNH_FICTICIA_${indice}`,
          cnh_categoria: "B",
          cnh_validade: new Date("2030-12-31T12:00:00Z"),
          foto_perfil_id: foto.id,
          documento_cnh_id: cnh.id,
          veiculo_id: veiculo.id,
          status: "EM_ANALISE",
          atualizado_em: new Date(),
        },
      });

      return { cadastro, foto, cnh };
    }

    const motorista1 = await criarMotorista(1);
    const motorista2 = await criarMotorista(2);

    const urlDocumento = `${base}/${motorista1.cadastro.id}/documents/${motorista1.cnh.id}`;

    // 4. Sem sessão: 401
    const semSessao = await GET(new NextRequest(urlDocumento));
    assert.equal(semSessao.status, 401);

    // 5. Usuário comum: 403
    const semPermissao = await GET(
      new NextRequest(urlDocumento, {
        headers: { cookie: cookieComum },
      }),
    );
    assert.equal(semPermissao.status, 403);

    // 6. Administrador: 200
    const autorizado = await GET(
      new NextRequest(urlDocumento, {
        headers: { cookie: cookieAdmin },
      }),
    );

    assert.equal(autorizado.status, 200);
    assert.equal(autorizado.headers.get("content-type"), "image/jpeg");
    assert.equal(autorizado.headers.get("cache-control"), "private, no-store");
    assert.equal(autorizado.headers.get("x-content-type-options"), "nosniff");

    const bytes = Buffer.from(await autorizado.arrayBuffer());
    const metadados = await sharp(bytes).metadata();

    assert.equal(metadados.format, "jpeg");
    assert.equal(metadados.width, 100);
    assert.equal(metadados.height, 100);

    // 7. Documento de outro cadastro: 404
    const documentoDeOutroMotorista = await GET(
      new NextRequest(
        `${base}/${motorista1.cadastro.id}/documents/${motorista2.cnh.id}`,
        { headers: { cookie: cookieAdmin } },
      ),
    );

    assert.equal(documentoDeOutroMotorista.status, 404);

    // 8. Documento inexistente: 404
    const inexistente = await GET(
      new NextRequest(
        `${base}/${motorista1.cadastro.id}/documents/${randomUUID()}`,
        { headers: { cookie: cookieAdmin } },
      ),
    );

    assert.equal(inexistente.status, 404);

    // 9. Cadastro inexistente: 404
    const cadastroInexistente = await GET(
      new NextRequest(
        `${base}/${randomUUID()}/documents/${motorista1.cnh.id}`,
        { headers: { cookie: cookieAdmin } },
      ),
    );

    assert.equal(cadastroInexistente.status, 404);

    // 10. Arquivo físico ausente: 404
    const registro = await prisma.arquivo_privado.findUniqueOrThrow({
      where: { id: motorista1.foto.id },
    });

    await removerArquivoPrivado(registro.chave_armazenamento);

    const arquivoAusente = await GET(
      new NextRequest(
        `${base}/${motorista1.cadastro.id}/documents/${motorista1.foto.id}`,
        { headers: { cookie: cookieAdmin } },
      ),
    );

    assert.equal(arquivoAusente.status, 404);

    console.log("Acesso administrativo a documentos validado.");
  } finally {
    // Remover somente os arquivos criados por este teste
    for (const id of arquivoIds) {
      const registro = await prisma.arquivo_privado.findUnique({
        where: { id },
      });

      if (registro) {
        try {
          await removerArquivoPrivado(registro.chave_armazenamento);
        } catch (error) {
          if (!(
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
          )) {
            throw error;
          }
        }
      }
    }

    await prisma.user.deleteMany({
      where: { id: { in: usuarioIds } },
    });
  }
});
