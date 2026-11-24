
-- CreateTable
CREATE TABLE "notificacao" (
    "id" TEXT NOT NULL,
    "destinatario_id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "frete_id" TEXT,
    "proposta_id" TEXT,
    "conversa_id" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificacao_destinatario_id_criado_em_id_idx"
ON "notificacao"("destinatario_id", "criado_em", "id");

-- CreateIndex
CREATE INDEX "notificacao_destinatario_id_lida_idx"
ON "notificacao"("destinatario_id", "lida");

-- AddForeignKey
ALTER TABLE "notificacao"
ADD CONSTRAINT "notificacao_destinatario_id_fkey"
FOREIGN KEY ("destinatario_id")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
