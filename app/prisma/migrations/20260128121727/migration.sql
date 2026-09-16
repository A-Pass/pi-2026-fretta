/*
  Warnings:

  - A unique constraint covering the columns `[cep]` on the table `logradouro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bairro_id,nome]` on the table `logradouro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "logradouro_cep_key" ON "logradouro"("cep");

-- CreateIndex
CREATE UNIQUE INDEX "logradouro_bairro_id_nome_key" ON "logradouro"("bairro_id", "nome");
