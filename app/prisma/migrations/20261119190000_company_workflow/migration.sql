-- CreateEnum
CREATE TYPE "StatusConviteEmpresa" AS ENUM ('PENDENTE', 'ACEITO', 'RECUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusAtribuicaoEmpresa" AS ENUM ('PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Motorista" ADD COLUMN "codigoPublico" TEXT;
UPDATE "Motorista" SET "codigoPublico" = gen_random_uuid()::text;
ALTER TABLE "Motorista" ALTER COLUMN "codigoPublico" SET NOT NULL;

-- AlterTable
ALTER TABLE "Proposta" ADD COLUMN     "empresaId" TEXT;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL DEFAULT 0,
    "planoAte" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoEmpresa" (
    "motoristaId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VinculoEmpresa_pkey" PRIMARY KEY ("motoristaId")
);

-- CreateTable
CREATE TABLE "ConviteEmpresa" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "status" "StatusConviteEmpresa" NOT NULL DEFAULT 'PENDENTE',
    "expiraEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConviteEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtribuicaoEmpresa" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "freteId" TEXT NOT NULL,
    "freteVersao" TIMESTAMP(3) NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "propostaId" TEXT,
    "status" "StatusAtribuicaoEmpresa" NOT NULL DEFAULT 'PENDENTE',
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtribuicaoEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_gestorId_key" ON "Empresa"("gestorId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE INDEX "VinculoEmpresa_empresaId_idx" ON "VinculoEmpresa"("empresaId");

-- CreateIndex
CREATE INDEX "ConviteEmpresa_motoristaId_status_idx" ON "ConviteEmpresa"("motoristaId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConviteEmpresa_empresaId_motoristaId_key" ON "ConviteEmpresa"("empresaId", "motoristaId");

-- CreateIndex
CREATE UNIQUE INDEX "AtribuicaoEmpresa_propostaId_key" ON "AtribuicaoEmpresa"("propostaId");

-- CreateIndex
CREATE INDEX "AtribuicaoEmpresa_motoristaId_idx" ON "AtribuicaoEmpresa"("motoristaId");

-- CreateIndex
CREATE UNIQUE INDEX "AtribuicaoEmpresa_empresaId_freteId_key" ON "AtribuicaoEmpresa"("empresaId", "freteId");

-- CreateIndex
CREATE UNIQUE INDEX "AtribuicaoEmpresa_propostaId_freteId_key" ON "AtribuicaoEmpresa"("propostaId", "freteId");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_codigoPublico_key" ON "Motorista"("codigoPublico");

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoEmpresa" ADD CONSTRAINT "VinculoEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoEmpresa" ADD CONSTRAINT "VinculoEmpresa_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConviteEmpresa" ADD CONSTRAINT "ConviteEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConviteEmpresa" ADD CONSTRAINT "ConviteEmpresa_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoEmpresa" ADD CONSTRAINT "AtribuicaoEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoEmpresa" ADD CONSTRAINT "AtribuicaoEmpresa_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoEmpresa" ADD CONSTRAINT "AtribuicaoEmpresa_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoEmpresa" ADD CONSTRAINT "AtribuicaoEmpresa_veiculoId_motoristaId_fkey" FOREIGN KEY ("veiculoId", "motoristaId") REFERENCES "Veiculo"("id", "motoristaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuicaoEmpresa" ADD CONSTRAINT "AtribuicaoEmpresa_propostaId_freteId_fkey" FOREIGN KEY ("propostaId", "freteId") REFERENCES "Proposta"("id", "freteId") ON DELETE RESTRICT ON UPDATE CASCADE;

