
import "dotenv/config";
import { prisma } from "../src/server/db/prisma";

const USUARIO_ID = "fretta-seed-cliente-001";
const ENDERECO_ID = "00000000-0000-4000-8000-000000000101";
const DESTINO_ID = "00000000-0000-4000-8000-000000000103";
const FRETE_ID = "00000000-0000-4000-8000-000000000102";

async function main() {
  const databaseUrl = process.env.DB_URL;

  if (!databaseUrl) {
    throw new Error("DB_URL não configurada.");
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
    where: { user_id: usuario.id },
    update: {},
    create: {
      user_id: usuario.id,
    },
  });

  const endereco = await prisma.endereco.upsert({
    where: { id: ENDERECO_ID },
    update: {},
    create: {
      id: ENDERECO_ID,
      logradouro: "Rua Exemplo",
      numero: "100",
      bairro: "Centro",
      cidade: "Eunápolis",
      estado: "BA",
      cep: "45880000",
      latitude: -16.3775,
      longitude: -39.58,
    },
  });
  const destino = await prisma.endereco.upsert({
    where: { id: DESTINO_ID },
    update: {},
    create: {
      id: DESTINO_ID,
      logradouro: "Avenida Exemplo",
      numero: "200",
      bairro: "Centro",
      cidade: "Porto Seguro",
      estado: "BA",
      cep: "45810000",
    },
  });

  const frete = await prisma.frete.upsert({
    where: { id: FRETE_ID },
    update: {},
    create: {
      id: FRETE_ID,
      cliente_id: cliente.user_id,
      titulo: "Frete de teste FRETTA",
      descricao: "Carga fictícia para testes de desenvolvimento.",
      categoria_porte: "PEQUENO",
      tipo_agendamento_enum: "COMBINAR",
      endereco_origem_id: endereco.id,
      endereco_destino_id: destino.id,
      atualizado_em: new Date(),
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
