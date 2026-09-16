-- CreateEnum
CREATE TYPE "sigla_uf" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateEnum
CREATE TYPE "regiao" AS ENUM ('NORTE', 'NORDESTE', 'SUDESTE', 'SUL', 'CENTRO_OESTE');

-- CreateTable
CREATE TABLE "unidade_federativa" (
    "sigla" "sigla_uf" NOT NULL,
    "nome" TEXT NOT NULL,
    "regiao" "regiao" NOT NULL,

    CONSTRAINT "unidade_federativa_pkey" PRIMARY KEY ("sigla")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidade_federativa_nome_key" ON "unidade_federativa"("nome");

INSERT INTO unidade_federativa (sigla, nome, regiao) VALUES
('AC', 'Acre', 'NORTE'),
('AL', 'Alagoas', 'NORDESTE'),
('AP', 'Amapá', 'NORTE'),
('AM', 'Amazonas', 'NORTE'),
('BA', 'Bahia', 'NORDESTE'),
('CE', 'Ceará', 'NORDESTE'),
('DF', 'Distrito Federal', 'CENTRO_OESTE'),
('ES', 'Espírito Santo', 'SUDESTE'),
('GO', 'Goiás', 'CENTRO_OESTE'),
('MA', 'Maranhão', 'NORDESTE'),
('MT', 'Mato Grosso', 'CENTRO_OESTE'),
('MS', 'Mato Grosso do Sul', 'CENTRO_OESTE'),
('MG', 'Minas Gerais', 'SUDESTE'),
('PA', 'Pará', 'NORTE'),
('PB', 'Paraíba', 'NORDESTE'),
('PR', 'Paraná', 'SUL'),
('PE', 'Pernambuco', 'NORDESTE'),
('PI', 'Piauí', 'NORDESTE'),
('RJ', 'Rio de Janeiro', 'SUDESTE'),
('RN', 'Rio Grande do Norte', 'NORDESTE'),
('RS', 'Rio Grande do Sul', 'SUL'),
('RO', 'Rondônia', 'NORTE'),
('RR', 'Roraima', 'NORTE'),
('SC', 'Santa Catarina', 'SUL'),
('SP', 'São Paulo', 'SUDESTE'),
('SE', 'Sergipe', 'NORDESTE'),
('TO', 'Tocantins', 'NORTE');