import { auth } from "../../../auth/auth";
import { prisma } from "../../../db/prisma";

export async function verificarPermissaoUpload(
  headers: Headers,
) {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return {
      autorizado: false as const,
      status: 401,
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado.",
    };
  }

  const motorista = await prisma.motorista.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      userId: true,
    },
  });

  if (!motorista) {
    return {
      autorizado: false as const,
      status: 403,
      code: "FORBIDDEN",
      message: "É necessário possuir um perfil de motorista.",
    };
  }

  return {
    autorizado: true as const,
    motoristaId: motorista.userId,
  };
}
