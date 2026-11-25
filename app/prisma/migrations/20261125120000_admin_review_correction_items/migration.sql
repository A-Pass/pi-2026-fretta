ALTER TABLE "motorista" ADD COLUMN "itens_ajuste" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "revisoes_cadastro" ADD COLUMN "itens_ajuste" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
