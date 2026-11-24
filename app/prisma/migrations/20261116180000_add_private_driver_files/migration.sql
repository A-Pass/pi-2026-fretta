
-- CreateEnum
CREATE TYPE "tipo_arquivo_privado" AS ENUM ('FOTO_PERFIL', 'CNH');

-- CreateTable
CREATE TABLE "arquivo_privado" (
    "id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "tipo" "tipo_arquivo_privado" NOT NULL,
    "chave_armazenamento" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivo_privado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arquivo_privado_chave_armazenamento_key"
ON "arquivo_privado"("chave_armazenamento");

-- CreateIndex
CREATE INDEX "arquivo_privado_motorista_id_tipo_idx"
ON "arquivo_privado"("motorista_id", "tipo");

-- AddForeignKey
ALTER TABLE "arquivo_privado"
ADD CONSTRAINT "arquivo_privado_motorista_id_fkey"
FOREIGN KEY ("motorista_id")
REFERENCES "motorista"("user_id")
ON DELETE CASCADE
ON UPDATE CASCADE;
