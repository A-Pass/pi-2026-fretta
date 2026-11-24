import { prisma } from "@/server/db/prisma";

export async function verificarAdministrador(userId: string): Promise<boolean> {
  const usuario = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      papel: true,
    },
  });

  return usuario?.papel === "ADMIN";
}
