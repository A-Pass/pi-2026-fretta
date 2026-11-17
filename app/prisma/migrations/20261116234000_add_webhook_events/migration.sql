-- CreateTable
CREATE TABLE "EventoWebhook" (
    "id" TEXT NOT NULL,
    "provedor" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "processadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventoWebhook_provedor_eventoId_key"
ON "EventoWebhook"("provedor", "eventoId");

-- CreateIndex
CREATE INDEX "EventoWebhook_processadoEm_idx"
ON "EventoWebhook"("processadoEm");
