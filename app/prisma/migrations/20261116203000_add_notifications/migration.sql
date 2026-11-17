
-- CreateTable
CREATE TABLE "Notificacao" (
    "id" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "freteId" TEXT,
    "propostaId" TEXT,
    "conversaId" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notificacao_destinatarioId_criadoEm_id_idx"
ON "Notificacao"("destinatarioId", "criadoEm", "id");

-- CreateIndex
CREATE INDEX "Notificacao_destinatarioId_lida_idx"
ON "Notificacao"("destinatarioId", "lida");

-- AddForeignKey
ALTER TABLE "Notificacao"
ADD CONSTRAINT "Notificacao_destinatarioId_fkey"
FOREIGN KEY ("destinatarioId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
