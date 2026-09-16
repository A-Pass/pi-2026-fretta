-- ============================================================================
-- SCHEMA: Aplicativo de Fretes (Clientes x Fretistas/Motoristas)
-- Banco: PostgreSQL 13+
-- Convenções: nomes em snake_case, chaves primárias UUID, timestamps em UTC,
-- normalização até 3FN (dados de motorista/cliente separados da tabela base
-- de usuários, endereços deduplicados em tabela própria, fotos em tabela 1:N).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- necessário para gen_random_uuid()

-- ============================================================================
-- 1. TIPOS ENUMERADOS
-- ============================================================================

CREATE TYPE porte_enum AS ENUM ('pequeno', 'medio', 'grande');

CREATE TYPE status_frete_enum AS ENUM (
    'aberto',          -- cliente cadastrou, aguardando propostas
    'em_negociacao',   -- já existe(m) proposta(s) em análise
    'aceito',          -- cliente aceitou uma proposta / motorista definido
    'em_transporte',   -- carga em rota
    'concluido',       -- entrega finalizada
    'cancelado'        -- cancelado pelo cliente ou pela plataforma
);

CREATE TYPE status_proposta_enum AS ENUM (
    'pendente',
    'aceita',
    'rejeitada',
    'cancelada'
);

-- ============================================================================
-- 2. FUNÇÃO UTILITÁRIA PARA ATUALIZAR "atualizado_em" AUTOMATICAMENTE
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. USUÁRIOS (tabela base de autenticação/identidade)
-- Um usuário pode ser cliente, motorista, ou ambos — o "papel" é definido
-- pela existência de registro nas tabelas clientes/motoristas (1:1),
-- evitando redundância e permitindo múltiplos papéis para a mesma pessoa.
-- ============================================================================

CREATE TABLE usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,
    telefone        VARCHAR(20),
    documento       VARCHAR(20)  NOT NULL UNIQUE, -- CPF ou CNPJ
    foto_perfil_url TEXT,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE TRIGGER trg_usuarios_atualizado_em
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

CREATE INDEX idx_usuarios_email ON usuarios (email);

-- ============================================================================
-- 4. ENDEREÇOS (reutilizável para origem/destino de frete e endereço padrão)
-- ============================================================================

CREATE TABLE enderecos (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logradouro   VARCHAR(200) NOT NULL,
    numero       VARCHAR(20),
    complemento  VARCHAR(100),
    bairro       VARCHAR(100),
    cidade       VARCHAR(100) NOT NULL,
    estado       CHAR(2)      NOT NULL,
    cep          VARCHAR(9)   NOT NULL,
    pais         VARCHAR(60)  NOT NULL DEFAULT 'Brasil',
    latitude     NUMERIC(10, 7),
    longitude    NUMERIC(10, 7),
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_enderecos_cidade_estado ON enderecos (cidade, estado);

-- ============================================================================
-- 5. CLIENTES (extensão 1:1 de usuarios)
-- ============================================================================

CREATE TABLE clientes (
    usuario_id   UUID PRIMARY KEY REFERENCES usuarios (id) ON DELETE CASCADE,
    endereco_id  UUID REFERENCES enderecos (id) ON DELETE SET NULL, -- endereço padrão, opcional
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. MOTORISTAS / FRETISTAS (extensão 1:1 de usuarios)
-- ============================================================================

CREATE TABLE motoristas (
    usuario_id       UUID PRIMARY KEY REFERENCES usuarios (id) ON DELETE CASCADE,
    cnh_numero       VARCHAR(20) NOT NULL UNIQUE,
    cnh_categoria    VARCHAR(5)  NOT NULL,
    cnh_validade     DATE        NOT NULL,
    avaliacao_media  NUMERIC(3, 2) NOT NULL DEFAULT 0
        CHECK (avaliacao_media BETWEEN 0 AND 5),
    total_avaliacoes INTEGER NOT NULL DEFAULT 0 CHECK (total_avaliacoes >= 0),
    disponivel       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_motoristas_disponivel ON motoristas (disponivel);

-- ============================================================================
-- 7. VEÍCULOS (um motorista pode ter mais de um veículo)
-- ============================================================================

CREATE TABLE veiculos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motorista_id        UUID NOT NULL REFERENCES motoristas (usuario_id) ON DELETE CASCADE,
    placa               VARCHAR(8)  NOT NULL UNIQUE,
    modelo              VARCHAR(100) NOT NULL,
    marca               VARCHAR(60),
    ano_fabricacao      SMALLINT CHECK (ano_fabricacao BETWEEN 1950 AND 2100),
    categoria_porte     porte_enum NOT NULL,
    carroceria_fechada  BOOLEAN NOT NULL DEFAULT FALSE,
    capacidade_kg       NUMERIC(10, 2) CHECK (capacidade_kg > 0),
    ativo               BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_veiculos_motorista ON veiculos (motorista_id);
CREATE INDEX idx_veiculos_categoria ON veiculos (categoria_porte);

-- ============================================================================
-- 8. FRETES (pedidos cadastrados pelos clientes)
-- ============================================================================

CREATE TABLE fretes (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id                UUID NOT NULL REFERENCES clientes (usuario_id),
    titulo                    VARCHAR(150) NOT NULL,
    descricao                 TEXT,
    categoria_porte           porte_enum NOT NULL,
    carroceria_fechada        BOOLEAN NOT NULL DEFAULT FALSE,
    endereco_origem_id        UUID NOT NULL REFERENCES enderecos (id),
    endereco_destino_id       UUID NOT NULL REFERENCES enderecos (id),
    status_frete              status_frete_enum NOT NULL DEFAULT 'aberto',
    data_coleta_prevista      DATE,
    data_entrega_prevista     DATE,
    valor_referencia          NUMERIC(10, 2) CHECK (valor_referencia IS NULL OR valor_referencia > 0),
    motorista_selecionado_id  UUID REFERENCES motoristas (usuario_id),
    criado_em                 TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em             TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_origem_diferente_destino CHECK (endereco_origem_id <> endereco_destino_id),
    CONSTRAINT chk_datas_previstas CHECK (
        data_entrega_prevista IS NULL
        OR data_coleta_prevista IS NULL
        OR data_entrega_prevista >= data_coleta_prevista
    )
);

CREATE TRIGGER trg_fretes_atualizado_em
    BEFORE UPDATE ON fretes
    FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

CREATE INDEX idx_fretes_status ON fretes (status_frete);
CREATE INDEX idx_fretes_cliente ON fretes (cliente_id);
CREATE INDEX idx_fretes_categoria ON fretes (categoria_porte);
-- Acelera a listagem de "fretes disponíveis" para os motoristas
CREATE INDEX idx_fretes_disponiveis ON fretes (status_frete, categoria_porte)
    WHERE status_frete IN ('aberto', 'em_negociacao');

-- ============================================================================
-- 9. FOTOS DO FRETE (1:N)
-- ============================================================================

CREATE TABLE frete_fotos (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frete_id   UUID NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    ordem      SMALLINT NOT NULL DEFAULT 0,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (frete_id, ordem)
);

CREATE INDEX idx_frete_fotos_frete ON frete_fotos (frete_id);

-- ============================================================================
-- 10. PROPOSTAS (enviadas pelos motoristas para um frete)
-- ============================================================================

CREATE TABLE propostas (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frete_id         UUID NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    motorista_id     UUID NOT NULL REFERENCES motoristas (usuario_id),
    valor_proposto   NUMERIC(10, 2) NOT NULL CHECK (valor_proposto > 0),
    mensagem         TEXT,
    status_proposta  status_proposta_enum NOT NULL DEFAULT 'pendente',
    criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Um motorista só pode ter uma proposta ativa por frete
    UNIQUE (frete_id, motorista_id)
);

CREATE TRIGGER trg_propostas_atualizado_em
    BEFORE UPDATE ON propostas
    FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

CREATE INDEX idx_propostas_frete ON propostas (frete_id);
CREATE INDEX idx_propostas_motorista ON propostas (motorista_id);
CREATE INDEX idx_propostas_status ON propostas (status_proposta);

-- ----------------------------------------------------------------------------
-- Regra de negócio: ao aceitar uma proposta, o frete muda de status,
-- o motorista é vinculado ao frete, e as demais propostas são rejeitadas.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_aceitar_proposta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_proposta = 'aceita' AND OLD.status_proposta IS DISTINCT FROM 'aceita' THEN

        UPDATE fretes
           SET status_frete             = 'aceito',
               motorista_selecionado_id  = NEW.motorista_id
         WHERE id = NEW.frete_id;

        UPDATE propostas
           SET status_proposta = 'rejeitada'
         WHERE frete_id = NEW.frete_id
           AND id <> NEW.id
           AND status_proposta = 'pendente';

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_propostas_aceitar
    AFTER UPDATE ON propostas
    FOR EACH ROW EXECUTE FUNCTION fn_aceitar_proposta();

-- ============================================================================
-- 11. AVALIAÇÕES (cliente avalia motorista e vice-versa, ao final do frete)
-- ============================================================================

CREATE TABLE avaliacoes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frete_id      UUID NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    avaliador_id  UUID NOT NULL REFERENCES usuarios (id),
    avaliado_id   UUID NOT NULL REFERENCES usuarios (id),
    nota          SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario    TEXT,
    criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (frete_id, avaliador_id, avaliado_id),
    CONSTRAINT chk_nao_autoavaliacao CHECK (avaliador_id <> avaliado_id)
);

CREATE INDEX idx_avaliacoes_avaliado ON avaliacoes (avaliado_id);

-- Mantém motoristas.avaliacao_media e total_avaliacoes sincronizados
CREATE OR REPLACE FUNCTION fn_atualizar_media_motorista()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE motoristas m
       SET total_avaliacoes = sub.total,
           avaliacao_media  = sub.media
      FROM (
            SELECT avaliado_id,
                   COUNT(*)::int          AS total,
                   ROUND(AVG(nota), 2)    AS media
              FROM avaliacoes
             WHERE avaliado_id = NEW.avaliado_id
             GROUP BY avaliado_id
           ) sub
     WHERE m.usuario_id = NEW.avaliado_id
       AND sub.avaliado_id = NEW.avaliado_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_avaliacoes_atualizar_media
    AFTER INSERT ON avaliacoes
    FOR EACH ROW EXECUTE FUNCTION fn_atualizar_media_motorista();

-- ============================================================================
-- 12. MENSAGENS (chat opcional entre cliente e motorista sobre um frete)
-- ============================================================================

CREATE TABLE mensagens (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    frete_id       UUID NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    remetente_id   UUID NOT NULL REFERENCES usuarios (id),
    destinatario_id UUID NOT NULL REFERENCES usuarios (id),
    conteudo       TEXT NOT NULL,
    lida           BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_remetente_diferente_destinatario CHECK (remetente_id <> destinatario_id)
);

CREATE INDEX idx_mensagens_frete ON mensagens (frete_id, criado_em);

-- ============================================================================
-- 13. VIEW DE APOIO: fretes disponíveis para os motoristas visualizarem
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
    u.nome          AS cliente_nome,
    f.criado_em
FROM fretes f
JOIN enderecos origem  ON origem.id  = f.endereco_origem_id
JOIN enderecos destino ON destino.id = f.endereco_destino_id
JOIN clientes c ON c.usuario_id = f.cliente_id
JOIN usuarios u ON u.id = c.usuario_id
WHERE f.status_frete IN ('aberto', 'em_negociacao');

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
