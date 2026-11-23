import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/server/generated/prisma/client";
import { validarNovaMensagem } from "../validators/message-validator";
import { randomUUID } from "node:crypto";

export class ChatError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

export async function verificarAcessoConversa(
  conversaId: string,
  usuarioId: string,
) {
  const conversa = await prisma.conversa.findUnique({
    where: { id: conversaId },
    select: { id: true, proposta_id: true },
  });

  if (!conversa) {
    throw new ChatError(
      "CONVERSATION_NOT_FOUND",
      "Conversa não encontrada.",
      404,
    );
  }

  const proposta = await prisma.proposta.findUnique({
    where: { id: conversa.proposta_id },
    select: {
      id: true,
      motorista_id: true,
      empresa: { select: { gestor_id: true } },
      frete: { select: { id: true, cliente_id: true } },
    },
  });
  if (!proposta) {
    throw new ChatError("CONVERSATION_NOT_FOUND", "Conversa não encontrada.", 404);
  }

  const ehMotorista = proposta.motorista_id === usuarioId;
  const ehCliente = proposta.frete.cliente_id === usuarioId;

  if (
    !ehMotorista &&
    !ehCliente &&
    proposta.empresa?.gestor_id !== usuarioId
  ) {
    throw new ChatError(
      "CONVERSATION_NOT_FOUND",
      "Conversa não encontrada.",
      404,
    );
  }

  return { ...conversa, proposta };
}

export async function marcarMensagensLidas(
  conversaId: string,
  usuarioId: string,
  notificationIds: unknown,
) {
  const conversa = await verificarAcessoConversa(conversaId, usuarioId);
  if (
    !Array.isArray(notificationIds) ||
    !notificationIds.length ||
    notificationIds.length > 100 ||
    !notificationIds.every(
      (id) => typeof id === "string" && id.length > 0 && id.length <= 100,
    )
  )
    throw new ChatError(
      "INVALID_NOTIFICATIONS",
      "Notificações inválidas.",
      422,
    );
  await prisma.notificacao.updateMany({
    where: {
      id: { in: notificationIds },
      conversa_id: conversaId,
      destinatario_id: usuarioId,
      evento: "NOVA_MENSAGEM",
      lida: false,
    },
    data: { lida: true },
  });
}

const LIMITE_MENSAGENS = 20;

export async function listarMensagens(
  conversaId: string,
  usuarioId: string,
  cursor?: string,
) {
  const conversa = await verificarAcessoConversa(conversaId, usuarioId);

  if (cursor !== undefined) {
    if (typeof cursor !== "string" || cursor.trim().length === 0) {
      throw new ChatError(
        "INVALID_CURSOR",
        "Cursor de paginação inválido.",
        422,
      );
    }

    const mensagemCursor = await prisma.mensagem.findFirst({
      where: {
        id: cursor,
        proposta_id: conversa.proposta_id,
      },
      select: {
        id: true,
      },
    });

    if (!mensagemCursor) {
      throw new ChatError(
        "INVALID_CURSOR",
        "Cursor de paginação inválido.",
        422,
      );
    }
  }

  const notificacoes = cursor
    ? []
    : await prisma.notificacao.findMany({
        where: {
          conversa_id: conversaId,
          destinatario_id: usuarioId,
          evento: "NOVA_MENSAGEM",
          lida: false,
        },
        take: 100,
        select: { id: true },
      });
  const mensagens = await prisma.mensagem.findMany({
    where: {
      proposta_id: conversa.proposta_id,
    },
    orderBy: [{ criado_em: "desc" }, { id: "desc" }],
    take: LIMITE_MENSAGENS + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    select: {
      id: true,
      conteudo: true,
      criado_em: true,
      remetente_id: true,
      frete_id: true,
      proposta_id: true,
      perfil_remetente: true,
    },
  });

  const temProximaPagina = mensagens.length > LIMITE_MENSAGENS;

  const pagina = mensagens.slice(0, LIMITE_MENSAGENS);

  return {
    readableNotificationIds: notificacoes.map((notificacao) => notificacao.id),
    items: pagina.flatMap((mensagem) => {
      const autorId = mensagem.remetente_id;
      return [{
        id: mensagem.id,
        freightId: conversa.proposta.frete.id,
        proposalId: conversa.proposta.id,
        role:
          autorId === conversa.proposta.frete.cliente_id ? "cliente" : "motorista",
        mine: autorId === usuarioId,
        text: mensagem.conteudo,
        createdAt: mensagem.criado_em.toISOString(),
      }];
    }),
    nextCursor: temProximaPagina ? pagina[pagina.length - 1].id : null,
  };
}

export async function enviarMensagem(
  conversaId: string,
  usuarioId: string,
  dados: unknown,
) {
  // Verifica se o usuário participa da conversa.
  const conversa = await verificarAcessoConversa(conversaId, usuarioId);

  // Valida os dados recebidos do frontend.
  const mensagemValidada = validarNovaMensagem(dados);

  if (!mensagemValidada) {
    throw new ChatError(
      "INVALID_MESSAGE",
      "Mensagem inválida. Informe um texto de até 2000 caracteres.",
      422,
    );
  }

  const { text, clientMessageId } = mensagemValidada;

  // Converte o registro do banco para o contrato do frontend.
  const formatarMensagem = (mensagem: {
    id: string;
    remetente_id: string;
    conteudo: string;
    criado_em: Date;
  }) => ({
    id: mensagem.id,
    freightId: conversa.proposta.frete.id,
    proposalId: conversa.proposta_id,
    role:
      mensagem.remetente_id ===
      conversa.proposta.frete.cliente_id
        ? "cliente"
        : "motorista",
    mine: mensagem.remetente_id === usuarioId,
    text: mensagem.conteudo,
    createdAt: mensagem.criado_em.toISOString(),
  });

  // Busca uma mensagem anterior com o mesmo identificador.
  async function buscarMensagemExistente() {
    if (!clientMessageId) {
      return null;
    }

    return prisma.mensagem.findFirst({
      where: {
        id: clientMessageId,
      },
    });
  }

  const existente = await buscarMensagemExistente();

  if (existente) {
    if (existente.conteudo !== text) {
      throw new ChatError(
        "MESSAGE_ID_CONFLICT",
        "Identificador já utilizado em outra mensagem.",
        409,
      );
    }

    return formatarMensagem(existente);
  }

  try {
    // Registra a mensagem com o autor autenticado.

    const recipients = [
      ...new Set([
        conversa.proposta.frete.cliente_id,
        conversa.proposta.motorista_id,
        conversa.proposta.empresa?.gestor_id,
      ]),
    ].filter((id): id is string => !!id && id !== usuarioId);

    const mensagem = await prisma.$transaction(async (tx) => {
      // Salvar a mensagem enviada.
      const novaMensagem = await tx.mensagem.create({
        data: {
          id: randomUUID(),
          frete_id: conversa.proposta.frete.id,
          remetente_id: usuarioId,
          destinatario_id:
            usuarioId === conversa.proposta.frete.cliente_id
              ? conversa.proposta.motorista_id
              : conversa.proposta.frete.cliente_id,
          proposta_id: conversa.proposta_id,
          conteudo: text,
          perfil_remetente:
            usuarioId === conversa.proposta.frete.cliente_id
              ? "cliente"
              : "motorista",
        },
      });

      if (recipients.length)
        await tx.notificacao.createMany({
          data: recipients.map((destinatario_id) => ({
            id: randomUUID(),
            destinatario_id,
            papel_destinatario:
              destinatario_id === conversa.proposta.frete.cliente_id
                ? "cliente"
                : "motorista",
            evento: "NOVA_MENSAGEM",
            titulo: "Nova mensagem",
            corpo: "Você recebeu uma nova mensagem sobre um frete.",
            frete_id: conversa.proposta.frete.id,
            proposta_id: conversa.proposta_id,
            conversa_id: conversaId,
          })),
        });

      return novaMensagem;
    });

    return formatarMensagem(mensagem);
  } catch (error) {
    // Trata envios simultâneos com o mesmo identificador.
    if (
      clientMessageId &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const mensagemExistente = await buscarMensagemExistente();

      if (mensagemExistente) {
        if (mensagemExistente.conteudo !== text) {
          throw new ChatError(
            "MESSAGE_ID_CONFLICT",
            "Identificador já utilizado em outra mensagem.",
            409,
          );
        }

        return formatarMensagem(mensagemExistente);
      }
    }

    throw error;
  }
}
