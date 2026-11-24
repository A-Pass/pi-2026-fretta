import { auth } from "../../../auth";
import { prisma } from "../../../db/prisma";

export async function verificarPermissaoUpload(headers: Headers) {
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
      user_id: session.user.id,
    },
    select: {
      user_id: true,
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
    motorista_id: motorista.user_id,
  };
}
