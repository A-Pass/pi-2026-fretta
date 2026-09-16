-- CreateTable
CREATE TABLE "bairro" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(64) NOT NULL,
    "cidade_id" INTEGER NOT NULL,

    CONSTRAINT "bairro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bairro" ADD CONSTRAINT "bairro_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
