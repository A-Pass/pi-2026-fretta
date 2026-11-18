-- AlterTable
ALTER TABLE "Mensagem" ADD COLUMN     "clientMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mensagem_conversaId_autorId_clientMessageId_key" ON "Mensagem"("conversaId", "autorId", "clientMessageId");
