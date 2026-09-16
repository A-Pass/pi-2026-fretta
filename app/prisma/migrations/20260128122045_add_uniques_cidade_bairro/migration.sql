/*
  Warnings:

  - A unique constraint covering the columns `[cidade_id,nome]` on the table `bairro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cep]` on the table `cidade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bairro_cidade_id_nome_key" ON "bairro"("cidade_id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "cidade_cep_key" ON "cidade"("cep");
