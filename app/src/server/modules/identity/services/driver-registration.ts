
import { prisma } from "@/server/db/prisma";

export async function verificarVeiculoMotorista(
  motoristaId: string,
  veiculoId: string,
): Promise<boolean> {
  const veiculo = await prisma.veiculo.findFirst({
    where: {
      id: veiculoId,
      motoristaId,
      ativo: true,
    },
    select: {
      id: true,
    },
  });

  return veiculo !== null;
}
