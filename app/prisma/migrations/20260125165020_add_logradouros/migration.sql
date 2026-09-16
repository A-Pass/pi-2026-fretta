-- CreateTable
CREATE TABLE "logradouro" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(128) NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "bairro_id" BIGINT NOT NULL,
    "tipo" TEXT,

    CONSTRAINT "logradouro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logradouro" ADD CONSTRAINT "logradouro_bairro_id_fkey" FOREIGN KEY ("bairro_id") REFERENCES "bairro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
