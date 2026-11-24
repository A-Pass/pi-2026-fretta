
-- Adiciona o papel do destinatário da notificação.
ALTER TABLE "notificacao"
ADD COLUMN "papel_destinatario" TEXT NOT NULL;
