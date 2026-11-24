ALTER TABLE "cadastro_motorista" ADD COLUMN "itens_conferidos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "cadastro_motorista"
SET "itens_conferidos" = ARRAY(
  SELECT item FROM unnest(ARRAY['dados', 'foto', 'cnh', 'veiculo']) AS items(item)
  WHERE NOT (item = ANY ("itens_ajuste"))
)
WHERE status = 'AJUSTES_SOLICITADOS' AND cardinality("itens_ajuste") > 0;
