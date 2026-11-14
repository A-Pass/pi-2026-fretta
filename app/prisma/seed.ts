
import "dotenv/config";
import { prisma } from "../src/server/db/prisma";

const USUARIO_ID = "fretta-seed-cliente-001";
const ENDERECO_ID = "00000000-0000-4000-8000-000000000101";
const FRETE_ID = "00000000-0000-4000-8000-000000000102";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada.");
  }

  const url = new URL(databaseUrl);

  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.pathname !== "/fretta_dev"
  ) {
    throw new Error(
      "O seed só pode ser executado no banco local fretta_dev.",
    );
  }

  const usuario = await prisma.user.upsert({
    where: { id: USUARIO_ID },
    update: {},
    create: {
      id: USUARIO_ID,
      name: "Cliente Teste FRETTA",
      email: "cliente-seed@fretta.invalid",
      emailVerified: false,
      papel: "USUARIO",
    },
  });

  const cliente = await prisma.cliente.upsert({
    where: { userId: usuario.id },
    update: {},
    create: {
      userId: usuario.id,
    },
  });

  const endereco = await prisma.endereco.upsert({
    where: { id: ENDERECO_ID },
    update: {},
    create: {
      id: ENDERECO_ID,
      clienteId: cliente.userId,
      nome: "Endereço Teste FRETTA",
      logradouro: "Rua Exemplo",
      numero: "100",
      bairro: "Centro",
      cidade: "Eunápolis",
      uf: "BA",
      latitude: -16.3775,
      longitude: -39.58,
    },
  });

  const origemSnapshot = {
    logradouro: endereco.logradouro,
    numero: endereco.numero,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    uf: endereco.uf,
  };

  const frete = await prisma.frete.upsert({
    where: { id: FRETE_ID },
    update: {},
    create: {
      id: FRETE_ID,
      clienteId: cliente.userId,
      titulo: "Frete de teste FRETTA",
      descricao: "Carga fictícia para testes de desenvolvimento.",
      categoriaVeiculo: "UTILITARIO",
      tipoAgendamento: "COMBINAR",
      origemId: endereco.id,
      origemSnapshot,
      destinoSnapshot: {
        logradouro: "Avenida Exemplo",
        numero: "200",
        bairro: "Centro",
        cidade: "Porto Seguro",
        uf: "BA",
      },
    },
  });

  console.log("Seed executado com sucesso.");
  console.log("Usuário fictício:", usuario.id);
  console.log("Endereço:", endereco.id);
  console.log("Frete:", frete.id);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
