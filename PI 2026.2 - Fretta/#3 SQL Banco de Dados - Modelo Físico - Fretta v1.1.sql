-- ============================================================================
-- SCHEMA: Aplicativo de Fretes (Clientes x Fretistas/Motoristas)
-- Banco: PostgreSQL 13+
-- Convenções: nomes em snake_case, timestamps em UTC,
-- normalização até 3FN (dados de motorista/cliente separados da tabela base
-- de usuários, endereços deduplicados em tabela própria, fotos em tabela 1:N).
-- ============================================================================

-- ============================================================================
-- RESET
-- Descomente e exeute as linhas seguintes para resetar o banco.
-- ============================================================================
DROP TABLE IF EXISTS avaliacoes,
	clientes,
	enderecos,
	frete_fotos,
	fretes,
	mensagens,
	motoristas,
	propostas,
	"user",
	"session",
	account,
	verification,
	unidade_federativa,
	cidade,
	bairro,
	logradouro,
	pessoa,
	enderecos,
	veiculos cascade;

DROP TYPE IF EXISTS 
	porte_enum,
	status_frete_enum,
	status_proposta_enum,
	sigla_uf_enum,
	regiao_enum ;

-- ============================================================================
-- 1. TIPOS ENUMERADOS
-- ============================================================================

CREATE TYPE porte_enum AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

CREATE TYPE status_frete_enum AS ENUM (
    'ABERTO',          -- cliente cadastrou, aguardando propostas
    'EM_NEGOCIACAO',   -- já existe(m) proposta(s) em análise
    'ACEITO',          -- cliente aceitou uma proposta / motorista definido
    'EM_TRANSPORTE',   -- carga em rota
    'CONCLUIDO',       -- entrega finalizada
    'CANCELADO'        -- cancelado pelo cliente ou pela plataforma
);

CREATE TYPE status_proposta_enum AS ENUM (
    'PENDENTE',
    'ACEITA',
    'REJEITADA',
    'CANCELADA'
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

CREATE OR REPLACE FUNCTION fn_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. USUÁRIOS (tabela base de autenticação/identidade)
-- Um usuário pode ser cliente, motorista, ou ambos — o "papel" é definido
-- pela existência de registro nas tabelas clientes/motoristas (1:1),
-- evitando redundância e permitindo múltiplos papéis para a mesma pessoa.
-- ============================================================================

CREATE TABLE "user" (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    createdAt TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
    updatedAt TIMESTAMPTZ(3) NOT NULL DEFAULT now(),

	CONSTRAINT chk_user_email_formato CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
	CONSTRAINT chk_user_email_uq UNIQUE (email) 
);

CREATE TRIGGER trg_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION fn_updated_at_timestamp();

CREATE TABLE "session" (
    id         TEXT PRIMARY KEY,
    token      TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT session_token_uq UNIQUE (token),
    CONSTRAINT session_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);
CREATE INDEX session_user_id_idx ON session(user_id);

CREATE TABLE account (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL, 
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     
    CONSTRAINT account_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);
CREATE INDEX account_user_id_idx ON account(user_id);

CREATE TABLE verification (
    id BIGINT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TIMESTAMPTZ NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    updatedAt TIMESTAMPTZ NOT NULL
);
CREATE INDEX verification_identifier_idx ON verification(identifier);

-- ============================================================================
-- 4. ENDEREÇOS (reutilizável para origem/destino de frete e endereço padrão)
-- ============================================================================

CREATE TYPE sigla_uf_enum AS ENUM (
	'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 
	'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 
	'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
	'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

CREATE TYPE regiao_enum AS ENUM (
	'NORTE', 'NORDESTE', 'SUDESTE', 
	'SUL', 'CENTRO_OESTE');

CREATE TABLE unidade_federativa (
    sigla sigla_uf_enum NOT NULL,
    nome varchar(31) NOT NULL,
    regiao regiao_enum NOT NULL,

    CONSTRAINT unidade_federativa_pkey PRIMARY KEY (sigla),
    CONSTRAINT unidade_federativa_nome_uq UNIQUE (nome)
);

CREATE TABLE cidade (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uf_sigla sigla_uf_enum NOT NULL,
    nome VARCHAR(63) NOT NULL,
    cep VARCHAR(9),
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
    origem varchar(15),
    
    CONSTRAINT cidade_uf_sigla_nome_uq UNIQUE (uf_sigla, nome),
    CONSTRAINT cidade_uf_sigla_fk FOREIGN KEY (uf_sigla) 
    	REFERENCES unidade_federativa(sigla) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX cidade_uf_idx ON cidade(uf_sigla);

CREATE TABLE bairro (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(64) NOT NULL,
    cidade_id INTEGER NOT NULL,
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
	origem varchar(15),
	
    CONSTRAINT bairro_cidade_nome_uq UNIQUE (cidade_id, nome),
    CONSTRAINT bairro_cidade_id_fk 
    	FOREIGN KEY (cidade_id) 
    	REFERENCES cidade(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE logradouro (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(128) NOT NULL,
    cep CHAR(8) NOT NULL,
    bairro_id BIGINT NOT NULL,
    tipo TEXT,
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
	origem varchar(15),
    
	CONSTRAINT logradouro_bairro_nome_uq UNIQUE (bairro_id, nome),
	
    CONSTRAINT logradouro_bairro_id_fk 
    	FOREIGN KEY (bairro_id) 
    	REFERENCES bairro(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE enderecos (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    logradouro_id BIGINT NOT NULL REFERENCES logradouro(id),
    numero INTEGER NOT NULL,
    complemento VARCHAR(127),
	referencia VARCHAR(127),
	criado_em timestamptz NOT NULL DEFAULT now(),
	latitude    NUMERIC(10, 7),
    longitude   NUMERIC(10, 7),
	usuario_id bigint NOT NULL,
	
	CONSTRAINT enderecos_usuario_fk 
		FOREIGN KEY (usuario_id)
		REFERENCES "user"(id)
);

CREATE TABLE pessoa (
    user_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cpf CHAR(11) NOT NULL,
    nascimento DATE NOT NULL,
    celular VARCHAR(14) NOT NULL,
    criado_em TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pessoa_cpf_chk CHECK (cpf ~ '^[0-9]{11}$'),
    CONSTRAINT pessoa_celular_chk CHECK (celular ~ '^[1-9][0-9]9[0-9]{8}$'),
    CONSTRAINT pessoa_cpf_uq UNIQUE (cpf),
    
    CONSTRAINT pessoa_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TRIGGER trg_pessoa_atualizado_em BEFORE UPDATE ON pessoa
FOR EACH ROW EXECUTE FUNCTION fn_atualizar_timestamp();

-- ============================================================================
-- 5. CLIENTES (extensão 1:1 de usuarios)
-- ============================================================================

CREATE TABLE clientes (
    usuario_id   bigint PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    endereco_id  bigint REFERENCES enderecos (id) ON DELETE RESTRICT, -- endereço padrão, opcional
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. MOTORISTAS / FRETISTAS (extensão 1:1 de usuarios)
-- ============================================================================

CREATE TABLE motoristas (
    usuario_id       bigint PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
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
    id                  bigint PRIMARY KEY generated ALWAYS AS identity,
    motorista_id        bigint NOT NULL REFERENCES motoristas (usuario_id) ON DELETE CASCADE,
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
    id                        BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cliente_id                BIGINT NOT NULL REFERENCES clientes (usuario_id),
    titulo                    VARCHAR(150) NOT NULL,
    descricao                 TEXT,
    categoria_porte           porte_enum NOT NULL,
    carroceria_fechada        BOOLEAN NOT NULL DEFAULT FALSE,
    endereco_origem_id        BIGINT NOT NULL REFERENCES enderecos (id),
    endereco_destino_id       BIGINT NOT NULL REFERENCES enderecos (id),
    status_frete              status_frete_enum NOT NULL DEFAULT 'ABERTO',
    data_coleta_prevista      DATE,
    data_entrega_prevista     DATE,
    valor_referencia          NUMERIC(10, 2) CHECK (valor_referencia IS NULL OR valor_referencia > 0),
    motorista_selecionado_id  BIGINT REFERENCES motoristas (usuario_id),
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
    WHERE status_frete IN ('ABERTO', 'EM_NEGOCIACAO');

-- ============================================================================
-- 9. FOTOS DO FRETE (1:N)
-- ============================================================================

CREATE TABLE frete_fotos (
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    frete_id   BIGINT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
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
    id               BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    frete_id         BIGINT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    motorista_id     BIGINT NOT NULL REFERENCES motoristas (usuario_id),
    valor_proposto   NUMERIC(10, 2) NOT NULL CHECK (valor_proposto > 0),
    mensagem         TEXT,
    status_proposta  status_proposta_enum NOT NULL DEFAULT 'PENDENTE',
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
    IF NEW.status_proposta = 'ACEITA' AND OLD.status_proposta IS DISTINCT FROM 'ACEITA' THEN

        UPDATE fretes
           SET status_frete             = 'ACEITO',
               motorista_selecionado_id  = NEW.motorista_id
         WHERE id = NEW.frete_id;

        UPDATE propostas
           SET status_proposta = 'REJEITADA'
         WHERE frete_id = NEW.frete_id
           AND id <> NEW.id
           AND status_proposta = 'PENDENTE';

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
    id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    frete_id      BIGINT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    avaliador_id  BIGINT NOT NULL REFERENCES "user"(id),
    avaliado_id   BIGINT NOT NULL REFERENCES "user"(id),
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
    id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    frete_id       BIGINT NOT NULL REFERENCES fretes (id) ON DELETE CASCADE,
    remetente_id   BIGINT NOT NULL REFERENCES "user"(id),
    destinatario_id BIGINT NOT NULL REFERENCES "user"(id),
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
    oc.nome   AS origem_cidade,
    oc.uf_sigla   AS origem_estado,
    dc.nome  AS destino_cidade,
    dc.uf_sigla  AS destino_estado,
    u.name          AS cliente_nome,
    f.criado_em
FROM fretes f
JOIN enderecos origem  ON origem.id  = f.endereco_origem_id
JOIN logradouro ol ON ol.id = origem.logradouro_id
JOIN bairro ob ON ob.id = ol.bairro_id
JOIN cidade oc ON oc.id = ob.cidade_id
JOIN enderecos destino ON destino.id = f.endereco_destino_id
JOIN logradouro dl ON dl.id = destino.logradouro_id
JOIN bairro db ON db.id = dl.bairro_id
JOIN cidade dc ON dc.id = db.cidade_id
JOIN clientes c ON c.usuario_id = f.cliente_id
JOIN "user" u ON u.id = c.usuario_id
WHERE f.status_frete IN ('ABERTO', 'EM_NEGOCIACAO');

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
