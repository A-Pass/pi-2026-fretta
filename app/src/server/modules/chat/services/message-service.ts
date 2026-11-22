import { prisma } from "@/server/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { validarNovaMensagem } from "../validators/message-validator";

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
    where: {
      id: conversaId,
    },
    select: {
      id: true,
      propostaId: true, // Adicione este campo
      proposta: {
        select: {
          motoristaId: true,
          empresa: { select: { gestorId: true } },
          frete: {
            select: {
              id: true, // Adicione este campo também
              clienteId: true,
            },
          },
        },
      },
    },
  });

  if (!conversa) {
    throw new ChatError(
      "CONVERSATION_NOT_FOUND",
      "Conversa não encontrada.",
      404,
    );
  }

  const ehMotorista = conversa.proposta.motoristaId === usuarioId;

  const ehCliente = conversa.proposta.frete.clienteId === usuarioId;

  if (
    !ehMotorista &&
    !ehCliente &&
    conversa.proposta.empresa?.gestorId !== usuarioId
  ) {
    throw new ChatError(
      "CONVERSATION_NOT_FOUND",
      "Conversa não encontrada.",
      404,
    );
  }

  return conversa;
}

export async function marcarMensagensLidas(
  conversaId: string,
  usuarioId: string,
  notificationIds: unknown,
) {
  await verificarAcessoConversa(conversaId, usuarioId);
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
      conversaId,
      destinatarioId: usuarioId,
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
  await verificarAcessoConversa(conversaId, usuarioId);

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
        conversaId,
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
          conversaId,
          destinatarioId: usuarioId,
          evento: "NOVA_MENSAGEM",
          lida: false,
        },
        take: 100,
        select: { id: true },
      });
  const mensagens = await prisma.mensagem.findMany({
    where: {
      conversaId,
    },
    orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    take: LIMITE_MENSAGENS + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    select: {
      id: true,
      texto: true,
      criadoEm: true,
      autorId: true,
      conversa: {
        select: {
          propostaId: true,
          proposta: {
            select: {
              freteId: true,
              motoristaId: true,
              frete: { select: { clienteId: true } },
            },
          },
        },
      },
    },
  });

  const temProximaPagina = mensagens.length > LIMITE_MENSAGENS;

  const pagina = mensagens.slice(0, LIMITE_MENSAGENS);

  return {
    readableNotificationIds: notificacoes.map((notificacao) => notificacao.id),
    items: pagina.map((mensagem) => ({
      id: mensagem.id,
      freightId: mensagem.conversa.proposta.freteId,
      proposalId: mensagem.conversa.propostaId,
      role:
        mensagem.autorId === mensagem.conversa.proposta.frete.clienteId
          ? "cliente"
          : "motorista",
      mine: mensagem.autorId === usuarioId,
      text: mensagem.texto,
      createdAt: mensagem.criadoEm.toISOString(),
    })),
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
    autorId: string;
    texto: string;
    criadoEm: Date;
  }) => ({
    id: mensagem.id,
    freightId: conversa.proposta.frete.id,
    proposalId: conversa.propostaId,
    role:
      mensagem.autorId === conversa.proposta.frete.clienteId
        ? "cliente"
        : "motorista",
    mine: mensagem.autorId === usuarioId,
    text: mensagem.texto,
    createdAt: mensagem.criadoEm.toISOString(),
  });

  // Busca uma mensagem anterior com o mesmo identificador.
  async function buscarMensagemExistente() {
    if (!clientMessageId) {
      return null;
    }

    return prisma.mensagem.findFirst({
      where: {
        conversaId,
        autorId: usuarioId,
        clientMessageId,
      },
    });
  }

  const existente = await buscarMensagemExistente();

  if (existente) {
    if (existente.texto !== text) {
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
        conversa.proposta.frete.clienteId,
        conversa.proposta.motoristaId,
        conversa.proposta.empresa?.gestorId,
      ]),
    ].filter((id): id is string => !!id && id !== usuarioId);

    const mensagem = await prisma.$transaction(async (tx) => {
      // Salvar a mensagem enviada.
      const novaMensagem = await tx.mensagem.create({
        data: {
          conversaId,
          autorId: usuarioId,
          texto: text,
          clientMessageId,
        },
      });

      if (recipients.length)
        await tx.notificacao.createMany({
          data: recipients.map((destinatarioId) => ({
            destinatarioId,
            papelDestinatario:
              destinatarioId === conversa.proposta.frete.clienteId
                ? "cliente"
                : "motorista",
            evento: "NOVA_MENSAGEM",
            titulo: "Nova mensagem",
            corpo: "Você recebeu uma nova mensagem sobre um frete.",
            freteId: conversa.proposta.frete.id,
            propostaId: conversa.propostaId,
            conversaId,
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
        if (mensagemExistente.texto !== text) {
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
