
-- CreateTable
CREATE TABLE "ArquivoUpload" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "chaveArmazenamento" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArquivoUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArquivoUpload_chaveArmazenamento_key"
ON "ArquivoUpload"("chaveArmazenamento");

-- CreateIndex
CREATE INDEX "ArquivoUpload_usuarioId_criadoEm_idx"
ON "ArquivoUpload"("usuarioId", "criadoEm");

-- AddForeignKey
ALTER TABLE "ArquivoUpload"
ADD CONSTRAINT "ArquivoUpload_usuarioId_fkey"
FOREIGN KEY ("usuarioId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
