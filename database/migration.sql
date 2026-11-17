-- ============================================================================
-- SCHEMA SQL: Aplicativo de Fretes — equivalente ao prisma/schema.prisma
-- Banco: PostgreSQL 13+
-- Observação: os IDs (text) são gerados pelo Prisma Client (cuid()) na
-- aplicação, por isso as colunas "id" não têm DEFAULT no banco.
-- ============================================================================

-- ============================================================================
-- 1. TIPOS ENUMERADOS
-- ============================================================================

CREATE TYPE porte_enum AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

CREATE TYPE status_frete_enum AS ENUM (
    'ABERTO',
    'EM_NEGOCIACAO',
    'ACEITO',
    'EM_TRANSPORTE',
    'CONCLUIDO',
    'CANCELADO'
);

CREATE TYPE status_proposta_enum AS ENUM (
    'PENDENTE',
    'ACEITA',
    'REJEITADA',
    'CANCELADA'
);

-- ============================================================================
-- 2. TABELAS DO BETTER AUTH
-- ============================================================================

CREATE TABLE "user" (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    email          TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    image          TEXT,

    -- campos adicionais do domínio (Better Auth additionalFields)
    documento      TEXT UNIQUE, -- CPF ou CNPJ
    telefone       TEXT,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_user_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE TABLE session (
    id         TEXT PRIMARY KEY,
    token      TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id    TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_user ON session (user_id);

-- Guarda login social (Google, Apple) e login por credencial (e-mail/senha)
CREATE TABLE account (
    id             TEXT PRIMARY KEY,
    account_id     TEXT NOT NULL,           -- id do usuário no provedor (ou = user_id p/ credential)
    provider_id    TEXT NOT NULL,           -- 'google' | 'apple' | 'credential'
    user_id        TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,

    access_token              TEXT,
    refresh_token             TEXT,
    id_token                  TEXT,
    access_token_expires_at   TIMESTAMPTZ,
    refresh_token_expires_at  TIMESTAMPTZ,
    scope                     TEXT,
    password                  TEXT,          -- somente quando provider_id = 'credential'

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_account_provider UNIQUE (provider_id, account_id)
);

CREATE INDEX idx_account_user ON account (user_id);

CREATE TABLE verification (
    id         TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value      TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_verification_identifier ON verification (identifier);

-- ============================================================================
-- 3. ENDEREÇOS
-- ============================================================================

CREATE TABLE enderecos (
    id          TEXT PRIMARY KEY,
    logradouro  TEXT NOT NULL,
    numero      TEXT,
    complemento TEXT,
    bairro      TEXT,
    cidade      TEXT NOT NULL,
    estado      CHAR(2) NOT NULL,
    cep         TEXT NOT NULL,
    pais        TEXT NOT NULL DEFAULT 'Brasil',
    latitude    NUMERIC(10, 7),
    longitude   NUMERIC(10, 7),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_enderecos_cidade_estado ON enderecos (cidade, estado);

-- ============================================================================
-- 4. CLIENTES (extensão 1:1 de "user")
-- ============================================================================

CREATE TABLE clientes (
    usuario_id  TEXT PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
    endereco_id TEXT REFERENCES enderecos (id) ON DELETE SET NULL,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. MOTORISTAS / FRETISTAS (extensão 1:1 de "user")
-- ============================================================================

CREATE TABLE motoristas (
    usuario_id       TEXT PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
    cnh_numero       TEXT NOT NULL UNIQUE,
    cnh_categoria    TEXT NOT NULL,
    cnh_validade     DATE NOT NULL,
    avaliacao_media  NUMERIC(3, 2) NOT NULL DEFAULT 0
        CHECK (avaliacao_media BETWEEN 0 AND 5),
    total_avaliacoes INTEGER NOT NULL DEFAULT 0 CHECK (total_avaliacoes >= 0),
    disponivel       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_motoristas_disponivel ON motoristas (disponivel);

-- ============================================================================
-- 6. VEÍCULOS
-- ============================================================================

CREATE TABLE veiculos (
    id                 TEXT PRIMARY KEY,
    motorista_id       TEXT NOT NULL REFERENCES motoristas (usuario_id) ON DELETE CASCADE,
    placa              TEXT NOT NULL UNIQUE,
    modelo             TEXT NOT NULL,
    marca              TEXT,
    ano_fabricacao     SMALLINT CHECK (ano_fabricacao BETWEEN 1950 AND 2100),
    categoria_porte    porte_enum NOT NULL,
    carroceria_fechada BOOLEAN NOT NULL DEFAULT FALSE,
    capacidade_kg      NUMERIC(10, 2) CHECK (capacidade_kg > 0),
    ativo              BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_veiculos_motorista ON veiculos (motorista_id);
CREATE INDEX idx_veiculos_categoria ON veiculos (categoria_porte);

-- ============================================================================
-- 7. FRETES
-- ============================================================================

CREATE TABLE fretes (
    id                        TEXT PRIMARY KEY,
    cliente_id                TEXT NOT NULL REFERENCES clientes (usuario_id),
    titulo                    TEXT NOT NULL,
    descricao                 TEXT,
    categoria_porte           porte_enum NOT NULL,
    carroceria_fechada        BOOLEAN NOT NULL DEFAULT FALSE,
    status_frete              status_frete_enum NOT NULL DEFAULT 'ABERTO',
    endereco_origem_id        TEXT NOT NULL REFERENCES enderecos (id),
    endereco_destino_id       TEXT NOT NULL REFERENCES enderecos (id),
    data_coleta_prevista      DATE,
    data_entrega_prevista     DATE,
    valor_referencia          NUMERIC(10, 2) CHECK (valor_referencia IS NULL OR valor_referencia > 0),
    motorista_selecionado_id  TEXT REFERENCES motoristas (usuario_id) ON DELETE SET NULL,
    criado_em                 TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em             TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_origem_diferente_destino CHECK (endereco_origem_id <> endereco_destino_id),
    CONSTRAINT chk_datas_previstas CHECK (
        data_entrega_prevista IS NULL
        OR data_coleta_prevista IS NULL
        OR data_entrega_prevista >= data_coleta_prevista
    )
);

CREATE INDEX idx_fretes_status ON fretes (status_frete);
CREATE INDEX idx_fretes_cliente ON fretes (cliente_id);
CREATE INDEX idx_fretes_categoria ON fretes (categoria_porte);
CREATE INDEX idx_fretes_disponiveis ON fretes (status_frete, categoria_porte)
    WHERE status_frete IN ('ABERTO', 'EM_NEGOCIACAO');

-- ============================================================================
-- 8. FOTOS DO FRETE
-- ============================================================================

CREATE TABLE frete_fotos (
    id        TEXT PRIMARY KEY,
    frete_id  TEXT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    url       TEXT NOT NULL,
    ordem     INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (frete_id, ordem)
);

CREATE INDEX idx_frete_fotos_frete ON frete_fotos (frete_id);

-- ============================================================================
-- 9. PROPOSTAS
-- ============================================================================

CREATE TABLE propostas (
    id              TEXT PRIMARY KEY,
    frete_id        TEXT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    motorista_id    TEXT NOT NULL REFERENCES motoristas (usuario_id),
    valor_proposto  NUMERIC(10, 2) NOT NULL CHECK (valor_proposto > 0),
    mensagem        TEXT,
    status_proposta status_proposta_enum NOT NULL DEFAULT 'PENDENTE',
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (frete_id, motorista_id)
);

CREATE INDEX idx_propostas_frete ON propostas (frete_id);
CREATE INDEX idx_propostas_motorista ON propostas (motorista_id);
CREATE INDEX idx_propostas_status ON propostas (status_proposta);

-- ============================================================================
-- 10. AVALIAÇÕES
-- ============================================================================

CREATE TABLE avaliacoes (
    id           TEXT PRIMARY KEY,
    frete_id     TEXT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    avaliador_id TEXT NOT NULL REFERENCES "user" (id),
    avaliado_id  TEXT NOT NULL REFERENCES "user" (id),
    nota         SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario   TEXT,
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (frete_id, avaliador_id, avaliado_id),
    CONSTRAINT chk_nao_autoavaliacao CHECK (avaliador_id <> avaliado_id)
);

CREATE INDEX idx_avaliacoes_avaliado ON avaliacoes (avaliado_id);

-- ============================================================================
-- 11. MENSAGENS (chat por frete)
-- ============================================================================

CREATE TABLE mensagens (
    id              TEXT PRIMARY KEY,
    frete_id        TEXT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    remetente_id    TEXT NOT NULL REFERENCES "user" (id),
    destinatario_id TEXT NOT NULL REFERENCES "user" (id),
    conteudo        TEXT NOT NULL,
    lida            BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_remetente_diferente_destinatario CHECK (remetente_id <> destinatario_id)
);

CREATE INDEX idx_mensagens_frete ON mensagens (frete_id, criado_em);

-- ============================================================================
-- 12. (OPCIONAL) TRIGGER DE ACEITE DE PROPOSTA NO BANCO
-- Recomendo manter essa regra no service layer (transação do Prisma), mas
-- caso prefira garanti-la no próprio banco, descomente o bloco abaixo.
-- Ela: (a) muda o frete para 'ACEITO' e vincula o motorista; (b) rejeita
-- as demais propostas pendentes do mesmo frete.
-- ============================================================================

-- CREATE OR REPLACE FUNCTION fn_aceitar_proposta()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.status_proposta = 'ACEITA' AND OLD.status_proposta IS DISTINCT FROM 'ACEITA' THEN
--
--         UPDATE fretes
--            SET status_frete            = 'ACEITO',
--                motorista_selecionado_id = NEW.motorista_id,
--                atualizado_em            = now()
--          WHERE id = NEW.frete_id;
--
--         UPDATE propostas
--            SET status_proposta = 'REJEITADA',
--                atualizado_em   = now()
--          WHERE frete_id = NEW.frete_id
--            AND id <> NEW.id
--            AND status_proposta = 'PENDENTE';
--
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER trg_propostas_aceitar
--     AFTER UPDATE ON propostas
--     FOR EACH ROW EXECUTE FUNCTION fn_aceitar_proposta();

-- ============================================================================
-- 13. VIEW DE APOIO: fretes disponíveis para os motoristas
-- ============================================================================

CREATE OR REPLACE VIEW vw_fretes_disponiveis AS
SELECT
    f.id,
    f.titulo,
    f.descricao,
    f.categoria_porte,
    f.carroceria_fechada,
    f.status_frete,
    f.valor_referencia,
    f.data_coleta_prevista,
    f.data_entrega_prevista,
    origem.cidade   AS origem_cidade,
    origem.estado   AS origem_estado,
    destino.cidade  AS destino_cidade,
    destino.estado  AS destino_estado,
    u.name          AS cliente_nome,
    f.criado_em
FROM fretes f
JOIN enderecos origem  ON origem.id  = f.endereco_origem_id
JOIN enderecos destino ON destino.id = f.endereco_destino_id
JOIN clientes c   ON c.usuario_id = f.cliente_id
JOIN "user" u     ON u.id = c.usuario_id
WHERE f.status_frete IN ('ABERTO', 'EM_NEGOCIACAO');

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
