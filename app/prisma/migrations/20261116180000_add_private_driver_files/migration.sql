
-- CreateEnum
CREATE TYPE "TipoArquivoPrivado" AS ENUM ('FOTO_PERFIL', 'CNH');

-- CreateTable
CREATE TABLE "ArquivoPrivado" (
    "id" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "tipo" "TipoArquivoPrivado" NOT NULL,
    "chaveArmazenamento" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArquivoPrivado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArquivoPrivado_chaveArmazenamento_key"
ON "ArquivoPrivado"("chaveArmazenamento");

-- CreateIndex
CREATE INDEX "ArquivoPrivado_motoristaId_tipo_idx"
ON "ArquivoPrivado"("motoristaId", "tipo");

-- AddForeignKey
ALTER TABLE "ArquivoPrivado"
ADD CONSTRAINT "ArquivoPrivado_motoristaId_fkey"
FOREIGN KEY ("motoristaId")
REFERENCES "Motorista"("userId")
ON DELETE CASCADE
ON UPDATE CASCADE;
