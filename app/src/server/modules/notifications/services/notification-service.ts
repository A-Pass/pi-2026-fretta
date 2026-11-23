import { randomUUID } from "node:crypto";
import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@/server/generated/prisma/client";

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
        destinatario_id: usuarioId,
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
      destinatario_id: usuarioId,
    },
    orderBy: [{ criado_em: "desc" }, { id: "desc" }],
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
      role: notificacao.papel_destinatario,
      event: notificacao.evento,
      title: notificacao.titulo,
      body: notificacao.corpo,
      createdAt: notificacao.criado_em.toISOString(),
      read: notificacao.lida,
      freightId: notificacao.frete_id,
      proposalId: notificacao.proposta_id,
      conversationId: notificacao.conversa_id,
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
      destinatario_id: usuarioId,
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
      destinatario_id: usuarioId,
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
    role: notificacao.papel_destinatario,
    event: notificacao.evento,
    title: notificacao.titulo,
    body: notificacao.corpo,
    createdAt: notificacao.criado_em.toISOString(),
    read: notificacao.lida,
    freightId: notificacao.frete_id,
    proposalId: notificacao.proposta_id,
    conversationId: notificacao.conversa_id,
  };
}

export async function marcarTodasNotificacoesLidas(usuarioId: string) {
  const resultado = await prisma.notificacao.updateMany({
    where: {
      destinatario_id: usuarioId,
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
  destinatario_id: string;
  papel_destinatario: "cliente" | "motorista";
  evento: string;
  titulo: string;
  corpo: string;
  frete_id?: string;
  proposta_id?: string;
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
  if (dados.autorId && dados.autorId === dados.destinatario_id) {
    return null;
  }

  if (
    !dados.destinatario_id.trim() ||
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
      id: randomUUID(),
      destinatario_id: dados.destinatario_id,
      papel_destinatario: dados.papel_destinatario,
      evento: dados.evento.trim(),
      titulo: dados.titulo.trim(),
      corpo: dados.corpo.trim(),
      frete_id: dados.frete_id ?? null,
      proposta_id: dados.proposta_id ?? null,
      conversa_id: dados.conversaId ?? null,
    },
  });
}
