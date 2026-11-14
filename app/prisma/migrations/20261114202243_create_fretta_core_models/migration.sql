-- CreateEnum
CREATE TYPE "StatusFrete" AS ENUM ('ABERTO', 'AGENDADO', 'EM_TRANSPORTE', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('FIXA', 'INTERVALO', 'COMBINAR');

-- CreateEnum
CREATE TYPE "StatusProposta" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusOferta" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'SUBSTITUIDA');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('PENDENTE', 'ATIVA', 'CANCELADA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cep" TEXT,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "referencia" TEXT,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frete" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "StatusFrete" NOT NULL DEFAULT 'ABERTO',
    "propostaAceitaId" TEXT,
    "categoriaVeiculo" TEXT NOT NULL,
    "tipoAgendamento" "TipoAgendamento" NOT NULL DEFAULT 'COMBINAR',
    "dataInicio" DATE,
    "dataFim" DATE,
    "origemId" TEXT,
    "destinoId" TEXT,
    "origemSnapshot" JSONB NOT NULL,
    "destinoSnapshot" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Frete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreteFoto" (
    "id" TEXT NOT NULL,
    "freteId" TEXT NOT NULL,
    "arquivoId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreteFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposta" (
    "id" TEXT NOT NULL,
    "freteId" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "status" "StatusProposta" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" TEXT NOT NULL,
    "propostaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "valorCents" INTEGER NOT NULL,
    "veiculoId" TEXT,
    "retiradaEm" TIMESTAMP(3),
    "entregaEm" TIMESTAMP(3),
    "comentario" TEXT,
    "status" "StatusOferta" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversa" (
    "id" TEXT NOT NULL,
    "propostaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "conversaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "texto" VARCHAR(2000) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "freteId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "avaliadoId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoAssinatura" (
    "id" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "status" "StatusAssinatura" NOT NULL DEFAULT 'PENDENTE',
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VinculoAssinatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Endereco_clienteId_idx" ON "Endereco"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Frete_propostaAceitaId_key" ON "Frete"("propostaAceitaId");

-- CreateIndex
CREATE INDEX "Frete_clienteId_idx" ON "Frete"("clienteId");

-- CreateIndex
CREATE INDEX "Frete_status_idx" ON "Frete"("status");

-- CreateIndex
CREATE INDEX "Frete_origemId_idx" ON "Frete"("origemId");

-- CreateIndex
CREATE INDEX "Frete_destinoId_idx" ON "Frete"("destinoId");

-- CreateIndex
CREATE UNIQUE INDEX "Frete_propostaAceitaId_id_key" ON "Frete"("propostaAceitaId", "id");

-- CreateIndex
CREATE INDEX "FreteFoto_freteId_idx" ON "FreteFoto"("freteId");

-- CreateIndex
CREATE INDEX "Proposta_motoristaId_idx" ON "Proposta"("motoristaId");

-- CreateIndex
CREATE INDEX "Proposta_status_idx" ON "Proposta"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Proposta_freteId_motoristaId_key" ON "Proposta"("freteId", "motoristaId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposta_id_freteId_key" ON "Proposta"("id", "freteId");

-- CreateIndex
CREATE INDEX "Oferta_propostaId_criadoEm_idx" ON "Oferta"("propostaId", "criadoEm");

-- CreateIndex
CREATE INDEX "Oferta_autorId_idx" ON "Oferta"("autorId");

-- CreateIndex
CREATE INDEX "Oferta_veiculoId_idx" ON "Oferta"("veiculoId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversa_propostaId_key" ON "Conversa"("propostaId");

-- CreateIndex
CREATE INDEX "Mensagem_conversaId_criadoEm_idx" ON "Mensagem"("conversaId", "criadoEm");

-- CreateIndex
CREATE INDEX "Mensagem_autorId_idx" ON "Mensagem"("autorId");

-- CreateIndex
CREATE INDEX "Avaliacao_avaliadoId_idx" ON "Avaliacao"("avaliadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_freteId_autorId_key" ON "Avaliacao"("freteId", "autorId");

-- CreateIndex
CREATE INDEX "VinculoAssinatura_motoristaId_idx" ON "VinculoAssinatura"("motoristaId");

-- CreateIndex
CREATE INDEX "VinculoAssinatura_status_idx" ON "VinculoAssinatura"("status");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_propostaAceitaId_id_fkey" FOREIGN KEY ("propostaAceitaId", "id") REFERENCES "Proposta"("id", "freteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frete" ADD CONSTRAINT "Frete_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreteFoto" ADD CONSTRAINT "FreteFoto_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposta" ADD CONSTRAINT "Proposta_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "Proposta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "Proposta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_freteId_fkey" FOREIGN KEY ("freteId") REFERENCES "Frete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_avaliadoId_fkey" FOREIGN KEY ("avaliadoId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoAssinatura" ADD CONSTRAINT "VinculoAssinatura_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
