import { prisma } from "@/server/db/prisma";

export async function verificarVeiculoMotorista(
  motorista_id: string,
  veiculoId: string,
): Promise<boolean> {
  const veiculo = await prisma.veiculo.findFirst({
    where: {
      id: veiculoId,
      motorista_id,
      ativo: true,
    },
    select: {
      id: true,
    },
  });

  return veiculo !== null;
}
