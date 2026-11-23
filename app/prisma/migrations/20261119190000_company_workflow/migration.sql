-- CreateEnum
CREATE TYPE "status_convite_empresa" AS ENUM ('PENDENTE', 'ACEITO', 'RECUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "status_atribuicao_empresa" AS ENUM ('PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "motorista" ADD COLUMN "codigo_publico" TEXT;
UPDATE "motorista" SET "codigo_publico" = gen_random_uuid()::text;
ALTER TABLE "motorista" ALTER COLUMN "codigo_publico" SET NOT NULL;

-- AlterTable
ALTER TABLE "proposta" ADD COLUMN     "empresa_id" TEXT;

-- CreateTable
CREATE TABLE "empresa" (
    "id" TEXT NOT NULL,
    "gestor_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL DEFAULT 0,
    "plano_ate" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculo_empresa" (
    "motorista_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vinculo_empresa_pkey" PRIMARY KEY ("motorista_id")
);

-- CreateTable
CREATE TABLE "convite_empresa" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "status" "status_convite_empresa" NOT NULL DEFAULT 'PENDENTE',
    "expira_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convite_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atribuicao_empresa" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "frete_versao" TIMESTAMP(3) NOT NULL,
    "veiculo_id" TEXT NOT NULL,
    "proposta_id" TEXT,
    "status" "status_atribuicao_empresa" NOT NULL DEFAULT 'PENDENTE',
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atribuicao_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresa_gestor_id_key" ON "empresa"("gestor_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_cnpj_key" ON "empresa"("cnpj");

-- CreateIndex
CREATE INDEX "vinculo_empresa_empresa_id_idx" ON "vinculo_empresa"("empresa_id");

-- CreateIndex
CREATE INDEX "convite_empresa_motorista_id_status_idx" ON "convite_empresa"("motorista_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "convite_empresa_empresa_id_motorista_id_key" ON "convite_empresa"("empresa_id", "motorista_id");

-- CreateIndex
CREATE UNIQUE INDEX "atribuicao_empresa_proposta_id_key" ON "atribuicao_empresa"("proposta_id");

-- CreateIndex
CREATE INDEX "atribuicao_empresa_motorista_id_idx" ON "atribuicao_empresa"("motorista_id");

-- CreateIndex
CREATE UNIQUE INDEX "atribuicao_empresa_empresa_id_frete_id_key" ON "atribuicao_empresa"("empresa_id", "frete_id");

-- CreateIndex
CREATE UNIQUE INDEX "atribuicao_empresa_proposta_id_frete_id_key" ON "atribuicao_empresa"("proposta_id", "frete_id");

-- CreateIndex
CREATE UNIQUE INDEX "motorista_codigo_publico_key" ON "motorista"("codigo_publico");

-- AddForeignKey
ALTER TABLE "proposta" ADD CONSTRAINT "proposta_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_gestor_id_fkey" FOREIGN KEY ("gestor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculo_empresa" ADD CONSTRAINT "vinculo_empresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculo_empresa" ADD CONSTRAINT "vinculo_empresa_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite_empresa" ADD CONSTRAINT "convite_empresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite_empresa" ADD CONSTRAINT "convite_empresa_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicao_empresa" ADD CONSTRAINT "atribuicao_empresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicao_empresa" ADD CONSTRAINT "atribuicao_empresa_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicao_empresa" ADD CONSTRAINT "atribuicao_empresa_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "frete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicao_empresa" ADD CONSTRAINT "atribuicao_empresa_veiculo_id_motorista_id_fkey" FOREIGN KEY ("veiculo_id", "motorista_id") REFERENCES "veiculo"("id", "motorista_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicao_empresa" ADD CONSTRAINT "atribuicao_empresa_proposta_id_frete_id_fkey" FOREIGN KEY ("proposta_id", "frete_id") REFERENCES "proposta"("id", "frete_id") ON DELETE RESTRICT ON UPDATE CASCADE;

