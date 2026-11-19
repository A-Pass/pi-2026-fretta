ALTER TABLE "CadastroMotorista" ADD COLUMN "itensConferidos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "CadastroMotorista"
SET "itensConferidos" = ARRAY(
  SELECT item FROM unnest(ARRAY['dados', 'foto', 'cnh', 'veiculo']) AS items(item)
  WHERE NOT (item = ANY ("itensAjuste"))
)
WHERE status = 'AJUSTES_SOLICITADOS' AND cardinality("itensAjuste") > 0;
