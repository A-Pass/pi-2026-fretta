export interface NovaMensagemInput {
  text: string;
  clientMessageId?: string;
}

export function validarNovaMensagem(dados: unknown): NovaMensagemInput | null {
  if (typeof dados !== "object" || dados === null || Array.isArray(dados)) {
    return null;
  }

  const body = dados as Record<string, unknown>;

  if (
    typeof body.text !== "string" ||
    body.text.trim().length === 0 ||
    body.text.length > 2000
  ) {
    return null;
  }

  if (
    body.clientMessageId !== undefined &&
    (typeof body.clientMessageId !== "string" ||
      body.clientMessageId.trim().length === 0 ||
      body.clientMessageId.length > 100)
  ) {
    return null;
  }

  return {
    text: body.text.trim(),
    clientMessageId: body.clientMessageId as string | undefined,
  };
}
