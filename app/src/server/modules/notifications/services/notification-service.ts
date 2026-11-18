import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

const LIMITE_NOTIFICACOES = 20;

export class NotificationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "NotificationError";
  }
}

export async function listarNotificacoes(usuarioId: string, cursor?: string) {
  if (cursor !== undefined) {
    const referencia = await prisma.notificacao.findFirst({
      where: {
        id: cursor,
        destinatarioId: usuarioId,
      },
      select: {
        id: true,
      },
    });

    if (!referencia) {
      throw new NotificationError(
        "INVALID_CURSOR",
        "Cursor de paginação inválido.",
        422,
      );
    }
  }

  const notificacoes = await prisma.notificacao.findMany({
    where: {
      destinatarioId: usuarioId,
    },
    orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    take: LIMITE_NOTIFICACOES + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
  });

  const temProximaPagina = notificacoes.length > LIMITE_NOTIFICACOES;

  const pagina = notificacoes.slice(0, LIMITE_NOTIFICACOES);

  return {
    items: pagina.map((notificacao) => ({
      id: notificacao.id,
      role: notificacao.papelDestinatario,
      event: notificacao.evento,
      title: notificacao.titulo,
      body: notificacao.corpo,
      createdAt: notificacao.criadoEm.toISOString(),
      read: notificacao.lida,
      freightId: notificacao.freteId,
      proposalId: notificacao.propostaId,
      conversationId: notificacao.conversaId,
    })),
    nextCursor: temProximaPagina ? pagina[pagina.length - 1].id : null,
  };
}

export async function marcarNotificacaoLida(
  notificacaoId: string,
  usuarioId: string,
) {
  const resultado = await prisma.notificacao.updateMany({
    where: {
      id: notificacaoId,
      destinatarioId: usuarioId,
    },
    data: {
      lida: true,
    },
  });

  if (resultado.count === 0) {
    throw new NotificationError(
      "NOTIFICATION_NOT_FOUND",
      "Notificação não encontrada.",
      404,
    );
  }

  const notificacao = await prisma.notificacao.findFirst({
    where: {
      id: notificacaoId,
      destinatarioId: usuarioId,
    },
  });

  if (!notificacao) {
    throw new NotificationError(
      "NOTIFICATION_NOT_FOUND",
      "Notificação não encontrada.",
      404,
    );
  }

  return {
    id: notificacao.id,
    role: notificacao.papelDestinatario,
    event: notificacao.evento,
    title: notificacao.titulo,
    body: notificacao.corpo,
    createdAt: notificacao.criadoEm.toISOString(),
    read: notificacao.lida,
    freightId: notificacao.freteId,
    proposalId: notificacao.propostaId,
    conversationId: notificacao.conversaId,
  };
}

export async function marcarTodasNotificacoesLidas(usuarioId: string) {
  const resultado = await prisma.notificacao.updateMany({
    where: {
      destinatarioId: usuarioId,
      lida: false,
    },
    data: {
      lida: true,
    },
  });

  return {
    updatedCount: resultado.count,
  };
}

type DadosNovaNotificacao = {
  destinatarioId: string;
  papelDestinatario: "cliente" | "motorista";
  evento: string;
  titulo: string;
  corpo: string;
  freteId?: string;
  propostaId?: string;
  conversaId?: string;
  autorId?: string;
};

/**
 * Cria uma notificação dentro de uma transação existente.
 * Deve ser chamada pelo serviço responsável pelo evento.
 */
export async function criarNotificacao(
  tx: Prisma.TransactionClient,
  dados: DadosNovaNotificacao,
) {
  // Não notificar o próprio autor da operação.
  if (dados.autorId && dados.autorId === dados.destinatarioId) {
    return null;
  }

  if (
    !dados.destinatarioId.trim() ||
    !dados.evento.trim() ||
    !dados.titulo.trim() ||
    !dados.corpo.trim()
  ) {
    throw new NotificationError(
      "INVALID_NOTIFICATION",
      "Os dados da notificação são inválidos.",
      422,
    );
  }

  return tx.notificacao.create({
    data: {
      destinatarioId: dados.destinatarioId,
      papelDestinatario: dados.papelDestinatario,
      evento: dados.evento.trim(),
      titulo: dados.titulo.trim(),
      corpo: dados.corpo.trim(),
      freteId: dados.freteId ?? null,
      propostaId: dados.propostaId ?? null,
      conversaId: dados.conversaId ?? null,
    },
  });
}
