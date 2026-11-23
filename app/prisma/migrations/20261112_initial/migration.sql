-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "porte_enum" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "status_frete_enum" AS ENUM ('ABERTO', 'EM_NEGOCIACAO', 'ACEITO', 'EM_TRANSPORTE', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "status_proposta_enum" AS ENUM ('PENDENTE', 'ACEITA', 'REJEITADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "status_cadastro_motorista" AS ENUM ('EM_ANALISE', 'AJUSTES_SOLICITADOS', 'APROVADO');

-- CreateEnum
CREATE TYPE "tipo_pessoa" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "tipo_agendamento_enum" AS ENUM ('FIXA', 'INTERVALO', 'COMBINAR');

-- CreateEnum
CREATE TYPE "status_assinatura" AS ENUM ('PENDENTE', 'ATIVA', 'CANCELADA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "documento" TEXT,
    "telefone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_states" (
    "user_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_states_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "cep" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "user_id" TEXT NOT NULL,
    "endereco_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "motorista" (
    "user_id" TEXT NOT NULL,
    --"user_id" TEXT NOT NULL, CHECK
    "cnh_numero" TEXT NOT NULL,
    "cnh_categoria" TEXT NOT NULL,
    "cnh_validade" DATE NOT NULL,
    "avaliacao_media" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "total_avaliacao" INTEGER NOT NULL DEFAULT 0,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorista_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "user_id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT,
    "celular" TEXT,
    "nascimento" DATE,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "veiculo" (
    "id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT,
    "ano_fabricacao" INTEGER,
    "categoria_porte" "porte_enum" NOT NULL,
    "carroceria_fechada" BOOLEAN NOT NULL DEFAULT false,
    "capacidade_kg" DOUBLE PRECISION,
    "descricao" TEXT NOT NULL DEFAULT '',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro_motorista" (
    "id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "tipo_pessoa" "tipo_pessoa" NOT NULL,
    "cnpj" TEXT,
    "razao_social" TEXT,
    "cnh_numero" TEXT NOT NULL,
    "cnh_categoria" TEXT NOT NULL,
    "cnh_validade" DATE NOT NULL,
    "foto_perfil_id" TEXT NOT NULL,
    "documento_cnh_id" TEXT NOT NULL,
    "veiculo_id" TEXT NOT NULL,
    "status" "status_cadastro_motorista" NOT NULL DEFAULT 'EM_ANALISE',
    "motivo_ajuste" TEXT,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analisado_em" TIMESTAMP(3),
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cadastro_motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frete" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "proposta_aceita_id" TEXT,
    "tipo_agendamento_enum" "tipo_agendamento_enum" NOT NULL DEFAULT 'COMBINAR',
    "categoria_porte" "porte_enum" NOT NULL,
    "carroceria_fechada" BOOLEAN NOT NULL DEFAULT false,
    "status_frete_enum" "status_frete_enum" NOT NULL DEFAULT 'ABERTO',
    "endereco_origem_id" TEXT NOT NULL,
    "endereco_destino_id" TEXT NOT NULL,
    "data_coleta_prevista" DATE,
    "data_entrega_prevista" DATE,
    "valor_referencia" DECIMAL(10,2),
    "motorista_selecionado_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frete_pkey" PRIMARY KEY ("id")
);

-- CreateTablefrete_foto
CREATE TABLE "frete_foto" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "frete_foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposta" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "valor_proposto" DECIMAL(10,2) NOT NULL,
    "status_proposta" "status_proposta_enum" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposta_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "proposta_id_frete_uq" UNIQUE ("id", "frete_id")
);

-- CreateTable
CREATE TABLE "conversa" (
    "id" TEXT NOT NULL,
    "proposta_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversa_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "avaliacao" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "avaliador_id" TEXT NOT NULL,
    "avaliado_id" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagem" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "remetente_id" TEXT NOT NULL,
    "destinatario_id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vinculo_assinatura" (
    "id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "status" "status_assinatura" NOT NULL DEFAULT 'PENDENTE',
    "inicio_em" TIMESTAMP(3),
    "fim_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vinculo_assinatura_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

CREATE UNIQUE INDEX "user_documento_key" ON "user"("documento");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_id_account_id_key" ON "account"("provider_id", "account_id");

-- CreateIndex
CREATE INDEX "endereco_cidade_estado_idx" ON "endereco"("cidade", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "motorista_cnh_numero_key" ON "motorista"("cnh_numero");

-- CreateIndex
CREATE INDEX "motorista_disponivel_idx" ON "motorista"("disponivel");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_cpf_key" ON "pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_placa_key" ON "veiculo"("placa");

-- CreateIndex
CREATE INDEX "veiculo_motorista_id_idx" ON "veiculo"("motorista_id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_id_motorista_id_key" ON "veiculo"("id", "motorista_id");

-- CreateIndex
CREATE INDEX "veiculo_categoria_porte_idx" ON "veiculo"("categoria_porte");

-- CreateIndex
CREATE INDEX "frete_status_frete_idx" ON "frete"("status_frete_enum");

-- CreateIndex
CREATE INDEX "frete_cliente_id_idx" ON "frete"("cliente_id");

-- CreateIndex
CREATE INDEX "frete_categoria_porte_idx" ON "frete"("categoria_porte");

-- CreateIndexfrete_fotofrete_foto
CREATE UNIQUE INDEX "frete_foto_frete_id_ordem_key" ON "frete_foto"("frete_id", "ordem");

-- CreateIndex
CREATE INDEX "proposta_status_proposta_idx" ON "proposta"("status_proposta");

-- CreateIndex
CREATE UNIQUE INDEX "proposta_frete_id_motorista_id_key" ON "proposta"("frete_id", "motorista_id");

-- CreateIndex
CREATE INDEX "avaliacao_avaliado_id_idx" ON "avaliacao"("avaliado_id");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_frete_id_avaliador_id_avaliado_id_key" ON "avaliacao"("frete_id", "avaliador_id", "avaliado_id");

-- CreateIndex
CREATE INDEX "mensagem_frete_id_criado_em_idx" ON "mensagem"("frete_id", "criado_em");

-- CreateIndex
CREATE UNIQUE INDEX "cadastro_motorista_motorista_id_key" ON "cadastro_motorista"("motorista_id");

-- CreateIndex
CREATE UNIQUE INDEX "cadastro_motorista_cnpj_key" ON "cadastro_motorista"("cnpj");

-- AddForeignKey
ALTER TABLE "app_states" ADD CONSTRAINT "app_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorista" ADD CONSTRAINT "motorista_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro_motorista" ADD CONSTRAINT "cadastro_motorista_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro_motorista" ADD CONSTRAINT "cadastro_motorista_veiculo_id_motorista_id_fkey" FOREIGN KEY ("veiculo_id", "motorista_id") REFERENCES "veiculo"("id", "motorista_id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE "frete" ADD CONSTRAINT "frete_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frete" ADD CONSTRAINT "frete_endereco_origem_id_fkey" FOREIGN KEY ("endereco_origem_id") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frete" ADD CONSTRAINT "frete_endereco_destino_id_fkey" FOREIGN KEY ("endereco_destino_id") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frete" ADD CONSTRAINT "frete_motorista_selecionado_id_fkey" FOREIGN KEY ("motorista_selecionado_id") REFERENCES "motorista"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignfrete_fotofrete_foto
ALTER TABLE "frete_foto" ADD CONSTRAINT "frete_foto_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta" ADD CONSTRAINT "proposta_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposta" ADD CONSTRAINT "proposta_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motorista"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagem" ADD CONSTRAINT "mensagem_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "frete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
