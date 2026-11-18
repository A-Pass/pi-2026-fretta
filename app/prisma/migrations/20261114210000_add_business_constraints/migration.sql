ALTER TABLE "Avaliacao"
ADD CONSTRAINT "Avaliacao_nota_check"
CHECK ("nota" BETWEEN 1 AND 5);

ALTER TABLE "Oferta"
ADD CONSTRAINT "Oferta_valorCents_check"
CHECK ("valorCents" > 0);
