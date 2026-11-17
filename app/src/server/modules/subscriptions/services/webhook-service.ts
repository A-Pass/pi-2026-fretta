import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

type EventoWebhookVerificado = {
  provedor: string;
  eventoId: string;
  tipo: string;
};

type ResultadoProcessamento = {
  processed: boolean;
  duplicate: boolean;
};

export class WebhookError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "WebhookError";
  }
}

/**
 * Processa um evento previamente autenticado pelo gateway.
 *
 * Esta função NÃO verifica assinaturas criptográficas.
 * A verificação deverá ocorrer na integração específica
 * do provedor, antes de chamar este serviço.
 */
export async function processarEventoWebhookVerificado(
  evento: EventoWebhookVerificado,
  aplicarEvento: (tx: Prisma.TransactionClient) => Promise<void>,
): Promise<ResultadoProcessamento> {
  const provedor = evento.provedor?.trim();
  const eventoId = evento.eventoId?.trim();
  const tipo = evento.tipo?.trim();

  if (
    !provedor ||
    !eventoId ||
    !tipo ||
    provedor.length > 100 ||
    eventoId.length > 255 ||
    tipo.length > 150
  ) {
    throw new WebhookError(
      "INVALID_WEBHOOK_EVENT",
      "Os dados do evento são inválidos.",
      422,
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Registrar primeiro o identificador do evento.
      // A restrição única impede processamento concorrente duplicado.
      await tx.eventoWebhook.create({
        data: {
          provedor,
          eventoId,
          tipo,
        },
      });

      // Executar a alteração de negócio na mesma transação.
      await aplicarEvento(tx);

      return {
        processed: true,
        duplicate: false,
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Confirmar que o conflito pertence ao evento recebido.
      const existente = await prisma.eventoWebhook.findUnique({
        where: {
          provedor_eventoId: {
            provedor,
            eventoId,
          },
        },
        select: {
          id: true,
          tipo: true,
        },
      });

      if (existente) {
        // Um mesmo ID não deve representar eventos diferentes.
        if (existente.tipo !== tipo) {
          throw new WebhookError(
            "WEBHOOK_EVENT_CONFLICT",
            "O identificador pertence a outro tipo de evento.",
            409,
          );
        }

        return {
          processed: false,
          duplicate: true,
        };
      }
    }

    // Outros erros não são ignorados.
    // Uma falha permite que o gateway tente entregar o evento novamente.
    throw error;
  }
}
