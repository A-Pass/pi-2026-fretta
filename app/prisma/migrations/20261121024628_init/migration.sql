-- CreateEnum
CREATE TYPE "porte_enum" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "status_frete_enum" AS ENUM ('ABERTO', 'EM_NEGOCIACAO', 'ACEITO', 'EM_TRANSPORTE', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "status_proposta_enum" AS ENUM ('PENDENTE', 'ACEITA', 'REJEITADA', 'CANCELADA');

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
CREATE TABLE "app_states" (
    "user_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_states_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
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

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "usuario_id" TEXT NOT NULL,
    "endereco_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "motoristas" (
    "usuario_id" TEXT NOT NULL,
    "cnh_numero" TEXT NOT NULL,
    "cnh_categoria" TEXT NOT NULL,
    "cnh_validade" DATE NOT NULL,
    "avaliacao_media" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "total_avaliacoes" INTEGER NOT NULL DEFAULT 0,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "motoristas_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT,
    "ano_fabricacao" INTEGER,
    "categoria_porte" "porte_enum" NOT NULL,
    "carroceria_fechada" BOOLEAN NOT NULL DEFAULT false,
    "capacidade_kg" DECIMAL(10,2),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fretes" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria_porte" "porte_enum" NOT NULL,
    "carroceria_fechada" BOOLEAN NOT NULL DEFAULT false,
    "status_frete" "status_frete_enum" NOT NULL DEFAULT 'ABERTO',
    "endereco_origem_id" TEXT NOT NULL,
    "endereco_destino_id" TEXT NOT NULL,
    "data_coleta_prevista" DATE,
    "data_entrega_prevista" DATE,
    "valor_referencia" DECIMAL(10,2),
    "motorista_selecionado_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fretes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frete_fotos" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "frete_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propostas" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "valor_proposto" DECIMAL(10,2) NOT NULL,
    "mensagem" TEXT,
    "status_proposta" "status_proposta_enum" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "avaliador_id" TEXT NOT NULL,
    "avaliado_id" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "frete_id" TEXT NOT NULL,
    "remetente_id" TEXT NOT NULL,
    "destinatario_id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_documento_key" ON "user"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_id_account_id_key" ON "account"("provider_id", "account_id");

-- CreateIndex
CREATE INDEX "enderecos_cidade_estado_idx" ON "enderecos"("cidade", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "motoristas_cnh_numero_key" ON "motoristas"("cnh_numero");

-- CreateIndex
CREATE INDEX "motoristas_disponivel_idx" ON "motoristas"("disponivel");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_key" ON "veiculos"("placa");

-- CreateIndex
CREATE INDEX "veiculos_motorista_id_idx" ON "veiculos"("motorista_id");

-- CreateIndex
CREATE INDEX "veiculos_categoria_porte_idx" ON "veiculos"("categoria_porte");

-- CreateIndex
CREATE INDEX "fretes_status_frete_idx" ON "fretes"("status_frete");

-- CreateIndex
CREATE INDEX "fretes_cliente_id_idx" ON "fretes"("cliente_id");

-- CreateIndex
CREATE INDEX "fretes_categoria_porte_idx" ON "fretes"("categoria_porte");

-- CreateIndex
CREATE UNIQUE INDEX "frete_fotos_frete_id_ordem_key" ON "frete_fotos"("frete_id", "ordem");

-- CreateIndex
CREATE INDEX "propostas_status_proposta_idx" ON "propostas"("status_proposta");

-- CreateIndex
CREATE UNIQUE INDEX "propostas_frete_id_motorista_id_key" ON "propostas"("frete_id", "motorista_id");

-- CreateIndex
CREATE INDEX "avaliacoes_avaliado_id_idx" ON "avaliacoes"("avaliado_id");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_frete_id_avaliador_id_avaliado_id_key" ON "avaliacoes"("frete_id", "avaliador_id", "avaliado_id");

-- CreateIndex
CREATE INDEX "mensagens_frete_id_criado_em_idx" ON "mensagens"("frete_id", "criado_em");

-- AddForeignKey
ALTER TABLE "app_states" ADD CONSTRAINT "app_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motoristas" ADD CONSTRAINT "motoristas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motoristas"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fretes" ADD CONSTRAINT "fretes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fretes" ADD CONSTRAINT "fretes_endereco_origem_id_fkey" FOREIGN KEY ("endereco_origem_id") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fretes" ADD CONSTRAINT "fretes_endereco_destino_id_fkey" FOREIGN KEY ("endereco_destino_id") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fretes" ADD CONSTRAINT "fretes_motorista_selecionado_id_fkey" FOREIGN KEY ("motorista_selecionado_id") REFERENCES "motoristas"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frete_fotos" ADD CONSTRAINT "frete_fotos_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motoristas"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
