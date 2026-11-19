import "dotenv/config";
import { prisma } from "../src/server/db/prisma";

async function main() {
  const [action, email] = process.argv.slice(2);
  if (!email || !["admin", "driver"].includes(action))
    throw new Error("Uso: provision:local -- admin|driver email-da-conta");
  const database = new URL(process.env.DATABASE_URL!);
  if (
    !["localhost", "127.0.0.1", "database"].includes(database.hostname) ||
    !["/fretta", "/fretta_dev"].includes(database.pathname)
  )
    throw new Error("Use o banco local da apresentação.");
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { motorista: { include: { cadastro: true } } },
  });
  if (!user?.emailVerified)
    throw new Error("Entre primeiro com a conta Google verificada.");
  if (action === "admin") {
    await prisma.user.update({
      where: { id: user.id },
      data: { papel: "ADMIN" },
    });
  } else {
    if (user.motorista?.cadastro?.status !== "APROVADO")
      throw new Error("Aprove o cadastro no painel antes de liberar o acesso.");
    const now = new Date();
    await prisma.vinculoAssinatura.create({
      data: {
        motoristaId: user.id,
        status: "ATIVA",
        inicioEm: now,
        fimEm: new Date(+now + 7 * 86400000),
      },
    });
  }
  console.log("Acesso local configurado.");
}

main()
  .catch((error: Error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
