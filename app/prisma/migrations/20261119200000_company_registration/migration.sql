CREATE TYPE "status_cadastro_empresa" AS ENUM ('EM_ANALISE', 'AJUSTES_SOLICITADOS', 'APROVADO');
ALTER TABLE "empresa"
  ADD COLUMN "razao_social" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "responsavel_nome" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "responsavel_email" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "cadastro_status" "status_cadastro_empresa" NOT NULL DEFAULT 'EM_ANALISE',
  ADD COLUMN "motivo_ajuste" TEXT,
  ADD COLUMN "logo_id" TEXT,
  ADD COLUMN "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "empresa" ALTER COLUMN "atualizado_em" DROP DEFAULT;
