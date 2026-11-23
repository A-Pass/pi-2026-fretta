-- CreateTable
CREATE TABLE "evento_webhook" (
    "id" TEXT NOT NULL,
    "provedor" TEXT NOT NULL,
    "evento_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "processado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_webhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evento_webhook_provedor_evento_id_key"
ON "evento_webhook"("provedor", "evento_id");

-- CreateIndex
CREATE INDEX "evento_webhook_processado_em_idx"
ON "evento_webhook"("processado_em");
