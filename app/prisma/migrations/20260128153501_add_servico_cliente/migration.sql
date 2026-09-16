-- CreateEnum
CREATE TYPE "enum_servico_cliente_status" AS ENUM ('ABERTO', 'NEGOCIANDO', 'CONTRATADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "servico_cliente" (
    "id" BIGSERIAL NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(500) NOT NULL,
    "data_hora_agendamento" TIMESTAMP(3) NOT NULL,
    "valor_oferecido" DECIMAL(7,2),
    "status" "enum_servico_cliente_status" DEFAULT 'ABERTO',
    "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servico_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servico_cliente_foto" (
    "servico_cliente_id" BIGINT NOT NULL,
    "md5" CHAR(32) NOT NULL,
    "uri_img" VARCHAR(255) NOT NULL,
    "ordem" SMALLINT NOT NULL,

    CONSTRAINT "servico_cliente_foto_pkey" PRIMARY KEY ("servico_cliente_id","md5")
);

-- CreateIndex
CREATE UNIQUE INDEX "servico_cliente_foto_servico_cliente_id_md5_key" ON "servico_cliente_foto"("servico_cliente_id", "md5");

-- AddForeignKey
ALTER TABLE "servico_cliente" ADD CONSTRAINT "servico_cliente_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servico_cliente_foto" ADD CONSTRAINT "servico_cliente_foto_servico_cliente_id_fkey" FOREIGN KEY ("servico_cliente_id") REFERENCES "servico_cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
