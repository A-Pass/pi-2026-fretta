ALTER TABLE "avaliacao"
ADD CONSTRAINT "avaliacao_nota_check"
CHECK ("nota" BETWEEN 1 AND 5);