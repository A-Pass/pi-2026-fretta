-- CreateTable
CREATE TABLE "pessoa" (
    "id" TEXT NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "nascimento" DATE NOT NULL,
    "celular" VARCHAR(14) NOT NULL,
    "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "logradouro_id" BIGINT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "numero" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(128),

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("pessoa_id","logradouro_id","numero")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_cpf_key" ON "pessoa"("cpf");

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_logradouro_id_fkey" FOREIGN KEY ("logradouro_id") REFERENCES "logradouro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
