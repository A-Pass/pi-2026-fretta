
-- CreateTable
CREATE TABLE "arquivo_upload" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "chave_armazenamento" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivo_upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arquivo_upload_chave_armazenamento_key"
ON "arquivo_upload"("chave_armazenamento");

-- CreateIndex
CREATE INDEX "arquivo_upload_usuario_id_criado_em_idx"
ON "arquivo_upload"("usuario_id", "criado_em");

-- AddForeignKey
ALTER TABLE "arquivo_upload"
ADD CONSTRAINT "arquivo_upload_usuario_id_fkey"
FOREIGN KEY ("usuario_id")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
