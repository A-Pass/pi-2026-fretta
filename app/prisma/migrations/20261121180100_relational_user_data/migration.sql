-- DropForeignKey
ALTER TABLE "app_states" DROP CONSTRAINT "app_states_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "account_setup_complete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "motoristas" ADD COLUMN     "cadastro_status" TEXT,
ADD COLUMN     "cnh_foto_data_url" TEXT,
ADD COLUMN     "cnh_numero_mascarado" TEXT,
ADD COLUMN     "cnpj_mascarado" TEXT,
ADD COLUMN     "documento_mascarado" TEXT,
ADD COLUMN     "documentos_enviados" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enviado_em" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "nome_completo" TEXT,
ADD COLUMN     "nome_empresa" TEXT,
ADD COLUMN     "revisado_em" TIMESTAMP(3),
ADD COLUMN     "tipo_pessoa" TEXT,
ALTER COLUMN "cnh_numero" DROP NOT NULL,
ALTER COLUMN "cnh_categoria" DROP NOT NULL,
ALTER COLUMN "cnh_validade" DROP NOT NULL;

-- AlterTable
ALTER TABLE "veiculos" ADD COLUMN     "descricao" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "avaliacoes" ADD COLUMN     "perfil_avaliador" TEXT NOT NULL DEFAULT 'cliente',
ADD COLUMN     "publica" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "mensagens" ADD COLUMN     "perfil_remetente" TEXT NOT NULL DEFAULT 'cliente',
ADD COLUMN     "proposta_id" TEXT;

-- CreateTable
CREATE TABLE "enderecos_salvos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "cep" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_salvos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_empresa" (
    "usuario_id" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfis_empresa_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "areas_atuacao" (
    "usuario_id" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "raio_km" DECIMAL(8,2) NOT NULL,
    "label" TEXT NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_atuacao_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "ofertas_proposta" (
    "id" TEXT NOT NULL,
    "proposta_id" TEXT NOT NULL,
    "veiculo_id" TEXT,
    "veiculo_label" TEXT NOT NULL,
    "valor_centavos" INTEGER NOT NULL,
    "disponivel_em" TIMESTAMP(3) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ofertas_proposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acordos_frete" (
    "frete_id" TEXT NOT NULL,
    "proposta_id" TEXT NOT NULL,
    "oferta_id" TEXT NOT NULL,
    "motorista_id" TEXT NOT NULL,
    "nome_motorista" TEXT NOT NULL,
    "nome_prestador" TEXT,
    "tipo_prestador" TEXT,
    "valor_centavos" INTEGER NOT NULL,
    "veiculo" TEXT NOT NULL,
    "disponivel_em" TIMESTAMP(3) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "aceito_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acordos_frete_pkey" PRIMARY KEY ("frete_id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "frete_id" TEXT NOT NULL,
    "proposta_id" TEXT,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("usuario_id", "id")
);

-- CreateTable
CREATE TABLE "revisoes_cadastro" (
    "id" TEXT NOT NULL,
    "usuario_caso_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "revisoes_cadastro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enderecos_salvos_usuario_id_idx" ON "enderecos_salvos"("usuario_id");

-- CreateIndex
CREATE INDEX "ofertas_proposta_proposta_id_criado_em_idx" ON "ofertas_proposta"("proposta_id", "criado_em");

-- CreateIndex
CREATE INDEX "notificacoes_usuario_id_criado_em_idx" ON "notificacoes"("usuario_id", "criado_em");

-- CreateIndex
CREATE INDEX "revisoes_cadastro_usuario_caso_id_at_idx" ON "revisoes_cadastro"("usuario_caso_id", "at");

-- Backfill account data before removing the legacy JSON store.
UPDATE "user" AS u
SET
    "name" = COALESCE(NULLIF(s."data"#>>'{profile,name}', ''), u."name"),
    "image" = COALESCE(NULLIF(s."data"#>>'{profile,photo}', ''), u."image"),
    "account_setup_complete" = CASE
        WHEN s."data"->>'accountSetupComplete' = 'true' THEN true
        WHEN s."data"->>'accountSetupComplete' = 'false' THEN false
        ELSE true
    END
FROM "app_states" AS s
WHERE s."user_id" = u."id";

INSERT INTO "motoristas" (
    "usuario_id", "cadastro_status", "nome_completo", "tipo_pessoa",
    "documento_mascarado", "cnpj_mascarado", "nome_empresa",
    "cnh_numero_mascarado", "cnh_categoria", "cnh_validade",
    "cnh_foto_data_url", "documentos_enviados", "enviado_em",
    "revisado_em", "feedback"
)
SELECT
    s."user_id",
    CASE
        WHEN r->>'status' IN ('EM_ANALISE', 'APROVADO', 'AJUSTES_SOLICITADOS')
            THEN r->>'status'
        ELSE 'EM_ANALISE'
    END,
    NULLIF(r->>'fullName', ''),
    CASE WHEN r->>'personType' = 'pj' THEN 'pj' ELSE 'pf' END,
    NULLIF(r->>'cpfMasked', ''),
    NULLIF(r->>'cnpjMasked', ''),
    NULLIF(r->>'companyName', ''),
    NULLIF(r#>>'{license,numberMasked}', ''),
    NULLIF(r#>>'{license,category}', ''),
    CASE WHEN r#>>'{license,expiresOn}' ~ '^\d{4}-\d{2}-\d{2}$'
        THEN (r#>>'{license,expiresOn}')::date ELSE NULL END,
    NULLIF(r->>'licensePhotoDataUrl', ''),
    COALESCE((r->>'documentsSubmitted')::boolean, false),
    CASE WHEN r->>'submittedAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (r->>'submittedAt')::timestamptz ELSE CURRENT_TIMESTAMP END,
    CASE WHEN r->>'reviewedAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (r->>'reviewedAt')::timestamptz ELSE NULL END,
    NULLIF(r->>'feedback', '')
FROM "app_states" AS s
CROSS JOIN LATERAL (SELECT s."data"->'driverRegistration' AS r) AS registration
WHERE jsonb_typeof(r) = 'object'
  AND NULLIF(r->>'fullName', '') IS NOT NULL
  AND NULLIF(r#>>'{license,numberMasked}', '') IS NOT NULL
  AND NULLIF(r#>>'{license,category}', '') IS NOT NULL
ON CONFLICT ("usuario_id") DO UPDATE SET
    "cadastro_status" = EXCLUDED."cadastro_status",
    "nome_completo" = EXCLUDED."nome_completo",
    "tipo_pessoa" = EXCLUDED."tipo_pessoa",
    "documento_mascarado" = EXCLUDED."documento_mascarado",
    "cnpj_mascarado" = EXCLUDED."cnpj_mascarado",
    "nome_empresa" = EXCLUDED."nome_empresa",
    "cnh_numero_mascarado" = EXCLUDED."cnh_numero_mascarado",
    "cnh_categoria" = EXCLUDED."cnh_categoria",
    "cnh_validade" = EXCLUDED."cnh_validade",
    "cnh_foto_data_url" = EXCLUDED."cnh_foto_data_url",
    "documentos_enviados" = EXCLUDED."documentos_enviados",
    "enviado_em" = EXCLUDED."enviado_em",
    "revisado_em" = EXCLUDED."revisado_em",
    "feedback" = EXCLUDED."feedback";

INSERT INTO "motoristas" ("usuario_id")
SELECT DISTINCT s."user_id"
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'vehicles') = 'array'
        THEN s."data"->'vehicles' ELSE '[]'::jsonb END
) AS v
ON CONFLICT ("usuario_id") DO NOTHING;

INSERT INTO "veiculos" (
    "id", "motorista_id", "placa", "modelo", "categoria_porte",
    "capacidade_kg", "descricao", "criado_em"
)
SELECT
    v->>'id',
    s."user_id",
    upper(v->>'plate'),
    v->>'model',
    CASE
        WHEN v->>'category' IN ('Utilitário', 'Caminhão pequeno') THEN 'PEQUENO'::"porte_enum"
        WHEN v->>'category' = 'Caminhão médio' THEN 'MEDIO'::"porte_enum"
        WHEN v->>'category' = 'Caminhão grande' THEN 'GRANDE'::"porte_enum"
        ELSE NULL
    END,
    CASE WHEN v->>'capacityKg' ~ '^[0-9]+(\.[0-9]+)?$'
        THEN (v->>'capacityKg')::numeric ELSE NULL END,
    COALESCE(v->>'description', ''),
    CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'vehicles') = 'array'
        THEN s."data"->'vehicles' ELSE '[]'::jsonb END
) AS v
WHERE NULLIF(v->>'id', '') IS NOT NULL
  AND NULLIF(v->>'model', '') IS NOT NULL
  AND upper(v->>'plate') ~ '^[A-Z0-9]{7}$'
  AND v->>'category' IN ('Utilitário', 'Caminhão pequeno', 'Caminhão médio', 'Caminhão grande')
ON CONFLICT DO NOTHING;

INSERT INTO "enderecos_salvos" (
    "id", "usuario_id", "label", "logradouro", "numero", "complemento",
    "bairro", "cidade", "estado", "cep", "latitude", "longitude",
    "criado_em", "atualizado_em"
)
SELECT
    a->>'id', s."user_id", COALESCE(a->>'label', ''),
    COALESCE(a->>'street', ''), COALESCE(a->>'number', ''),
    COALESCE(a->>'complement', ''), COALESCE(a->>'neighborhood', ''),
    a->>'city', upper(a->>'state'), NULLIF(a->>'postalCode', ''),
    CASE WHEN a#>>'{point,lat}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{point,lat}')::numeric ELSE NULL END,
    CASE WHEN a#>>'{point,lng}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{point,lng}')::numeric ELSE NULL END,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'addresses') = 'array'
        THEN s."data"->'addresses' ELSE '[]'::jsonb END
) AS a
WHERE NULLIF(a->>'id', '') IS NOT NULL
  AND NULLIF(a->>'street', '') IS NOT NULL
  AND NULLIF(a->>'city', '') IS NOT NULL
  AND length(a->>'state') = 2
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "perfis_empresa" (
    "usuario_id", "nome_fantasia", "logo", "about", "city", "atualizado_em"
)
SELECT
    s."user_id", p->>'tradeName', COALESCE(p->>'logo', ''),
    COALESCE(p->>'about', ''), COALESCE(p->>'city', ''), CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL (SELECT s."data"->'companyProfile' AS p) AS company
WHERE jsonb_typeof(p) = 'object'
  AND NULLIF(p->>'tradeName', '') IS NOT NULL
ON CONFLICT ("usuario_id") DO NOTHING;

INSERT INTO "areas_atuacao" (
    "usuario_id", "latitude", "longitude", "raio_km", "label", "atualizado_em"
)
SELECT
    s."user_id",
    (a#>>'{center,lat}')::numeric,
    (a#>>'{center,lng}')::numeric,
    (a->>'radiusKm')::numeric,
    COALESCE(a->>'label', ''),
    CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL (SELECT s."data"->'operatingArea' AS a) AS area
WHERE jsonb_typeof(a) = 'object'
  AND a#>>'{center,lat}' ~ '^-?[0-9]+(\.[0-9]+)?$'
  AND a#>>'{center,lng}' ~ '^-?[0-9]+(\.[0-9]+)?$'
  AND a->>'radiusKm' ~ '^[0-9]+(\.[0-9]+)?$'
ON CONFLICT ("usuario_id") DO NOTHING;

INSERT INTO "clientes" ("usuario_id")
SELECT DISTINCT s."user_id"
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS f
WHERE jsonb_typeof(s."data"->'freightAddresses'->(f->>'id')) = 'object'
ON CONFLICT ("usuario_id") DO NOTHING;

INSERT INTO "enderecos" (
    "id", "logradouro", "numero", "complemento", "bairro", "cidade",
    "estado", "cep", "pais", "latitude", "longitude"
)
SELECT
    'legacy-pickup:' || (f->>'id'),
    COALESCE(a#>>'{pickup,street}', ''),
    NULLIF(a#>>'{pickup,number}', ''),
    NULLIF(a#>>'{pickup,complement}', ''),
    NULLIF(a#>>'{pickup,neighborhood}', ''),
    COALESCE(a#>>'{pickup,city}', ''),
    upper(COALESCE(a#>>'{pickup,state}', 'BA')),
    COALESCE(NULLIF(a#>>'{pickup,postalCode}', ''), ''),
    'Brasil',
    CASE WHEN a#>>'{pickup,point,lat}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{pickup,point,lat}')::numeric ELSE NULL END,
    CASE WHEN a#>>'{pickup,point,lng}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{pickup,point,lng}')::numeric ELSE NULL END
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS f
CROSS JOIN LATERAL (SELECT s."data"->'freightAddresses'->(f->>'id') AS a) AS addresses
WHERE jsonb_typeof(a->'pickup') = 'object'
  AND NULLIF(a#>>'{pickup,street}', '') IS NOT NULL
  AND NULLIF(a#>>'{pickup,city}', '') IS NOT NULL
  AND length(a#>>'{pickup,state}') = 2
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "enderecos" (
    "id", "logradouro", "numero", "complemento", "bairro", "cidade",
    "estado", "cep", "pais", "latitude", "longitude"
)
SELECT
    'legacy-delivery:' || (f->>'id'),
    COALESCE(a#>>'{delivery,street}', ''),
    NULLIF(a#>>'{delivery,number}', ''),
    NULLIF(a#>>'{delivery,complement}', ''),
    NULLIF(a#>>'{delivery,neighborhood}', ''),
    COALESCE(a#>>'{delivery,city}', ''),
    upper(COALESCE(a#>>'{delivery,state}', 'BA')),
    COALESCE(NULLIF(a#>>'{delivery,postalCode}', ''), ''),
    'Brasil',
    CASE WHEN a#>>'{delivery,point,lat}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{delivery,point,lat}')::numeric ELSE NULL END,
    CASE WHEN a#>>'{delivery,point,lng}' ~ '^-?[0-9]+(\.[0-9]+)?$'
        THEN (a#>>'{delivery,point,lng}')::numeric ELSE NULL END
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS f
CROSS JOIN LATERAL (SELECT s."data"->'freightAddresses'->(f->>'id') AS a) AS addresses
WHERE jsonb_typeof(a->'delivery') = 'object'
  AND NULLIF(a#>>'{delivery,street}', '') IS NOT NULL
  AND NULLIF(a#>>'{delivery,city}', '') IS NOT NULL
  AND length(a#>>'{delivery,state}') = 2
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "fretes" (
    "id", "cliente_id", "titulo", "descricao", "categoria_porte",
    "status_frete", "endereco_origem_id", "endereco_destino_id",
    "data_coleta_prevista", "data_entrega_prevista", "motorista_selecionado_id",
    "criado_em", "atualizado_em"
)
SELECT
    f->>'id', s."user_id", left(COALESCE(f->>'title', 'Frete migrado'), 150),
    NULLIF(left(COALESCE(f->>'description', ''), 2000), ''),
    CASE
        WHEN f->>'vehicle' IN ('Utilitário', 'Caminhão pequeno') THEN 'PEQUENO'::"porte_enum"
        WHEN f->>'vehicle' = 'Caminhão médio' THEN 'MEDIO'::"porte_enum"
        ELSE 'GRANDE'::"porte_enum"
    END,
    CASE f->>'status'
        WHEN 'AGENDADO' THEN 'ACEITO'::"status_frete_enum"
        WHEN 'EM_TRANSPORTE' THEN 'EM_TRANSPORTE'::"status_frete_enum"
        WHEN 'CONCLUIDO' THEN 'CONCLUIDO'::"status_frete_enum"
        WHEN 'CANCELADO' THEN 'CANCELADO'::"status_frete_enum"
        ELSE 'ABERTO'::"status_frete_enum"
    END,
    'legacy-pickup:' || (f->>'id'),
    'legacy-delivery:' || (f->>'id'),
    CASE WHEN f#>>'{schedule,start}' ~ '^\d{4}-\d{2}-\d{2}'
        THEN (f#>>'{schedule,start}')::timestamptz::date ELSE NULL END,
    CASE WHEN f#>>'{schedule,end}' ~ '^\d{4}-\d{2}-\d{2}'
        THEN (f#>>'{schedule,end}')::timestamptz::date ELSE NULL END,
    CASE WHEN EXISTS (
        SELECT 1 FROM "motoristas" AS driver
        WHERE driver."usuario_id" = f#>>'{agreement,driverId}'
    ) THEN NULLIF(f#>>'{agreement,driverId}', '') ELSE NULL END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS f
CROSS JOIN LATERAL (SELECT s."data"->'freightAddresses'->(f->>'id') AS a) AS addresses
WHERE NULLIF(f->>'id', '') IS NOT NULL
  AND jsonb_typeof(a->'pickup') = 'object'
  AND jsonb_typeof(a->'delivery') = 'object'
  AND NULLIF(a#>>'{pickup,street}', '') IS NOT NULL
  AND NULLIF(a#>>'{delivery,street}', '') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "fretes" existing WHERE existing."id" = f->>'id')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "frete_fotos" ("id", "frete_id", "url", "ordem")
SELECT
    (f->>'id') || ':photo:' || (photo.ordinality - 1)::text,
    f->>'id',
    photo.url,
    (photo.ordinality - 1)::integer
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS f
CROSS JOIN LATERAL jsonb_array_elements_text(
    CASE WHEN jsonb_typeof(f->'photos') = 'array'
        THEN f->'photos' ELSE '[]'::jsonb END
) WITH ORDINALITY AS photo(url, ordinality)
WHERE EXISTS (SELECT 1 FROM "fretes" existing WHERE existing."id" = f->>'id')
ON CONFLICT DO NOTHING;

INSERT INTO "motoristas" ("usuario_id")
SELECT DISTINCT p->>'driverId'
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'proposals') = 'array'
        THEN s."data"->'proposals' ELSE '[]'::jsonb END
) AS p
JOIN "user" AS driver ON driver."id" = p->>'driverId'
WHERE NULLIF(p->>'driverId', '') IS NOT NULL
ON CONFLICT ("usuario_id") DO NOTHING;

INSERT INTO "propostas" (
    "id", "frete_id", "motorista_id", "valor_proposto",
    "mensagem", "status_proposta", "criado_em", "atualizado_em"
)
SELECT DISTINCT ON (p->>'id')
    p->>'id',
    p->>'freightId',
    p->>'driverId',
    ((p->>'priceCents')::numeric / 100),
    NULLIF(left(COALESCE(p->>'message', ''), 2000), ''),
    CASE p->>'status'
        WHEN 'ACEITA' THEN 'ACEITA'::"status_proposta_enum"
        WHEN 'ENCERRADA' THEN 'CANCELADA'::"status_proposta_enum"
        ELSE 'PENDENTE'::"status_proposta_enum"
    END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'proposals') = 'array'
        THEN s."data"->'proposals' ELSE '[]'::jsonb END
) AS p
JOIN "fretes" AS freight ON freight."id" = p->>'freightId'
JOIN "motoristas" AS driver ON driver."usuario_id" = p->>'driverId'
WHERE NULLIF(p->>'id', '') IS NOT NULL
  AND p->>'priceCents' ~ '^[0-9]+$'
  AND (p->>'priceCents')::integer > 0
ORDER BY p->>'id',
    CASE WHEN p->>'status' = 'ACEITA' THEN 0 ELSE 1 END
ON CONFLICT DO NOTHING;

INSERT INTO "ofertas_proposta" (
    "id", "proposta_id", "veiculo_id", "veiculo_label",
    "valor_centavos", "disponivel_em", "mensagem", "status", "criado_em"
)
SELECT DISTINCT ON (offer->>'id')
    offer->>'id',
    p->>'id',
    CASE WHEN v."id" IS NOT NULL THEN v."id" ELSE NULL END,
    left(COALESCE(offer->>'vehicle', 'Veículo cadastrado'), 160),
    (offer->>'priceCents')::integer,
    (offer->>'availableAt')::timestamptz,
    left(COALESCE(offer->>'message', ''), 2000),
    CASE
        WHEN offer->>'status' IN ('ACEITA', 'RECUSADA', 'SUBSTITUIDA', 'ENCERRADA')
            THEN offer->>'status'
        ELSE 'PENDENTE'
    END,
    CASE WHEN offer->>'createdAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (offer->>'createdAt')::timestamptz ELSE CURRENT_TIMESTAMP END
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'proposals') = 'array'
        THEN s."data"->'proposals' ELSE '[]'::jsonb END
) AS p
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(p->'offers') = 'array' AND jsonb_array_length(p->'offers') > 0
        THEN p->'offers' ELSE jsonb_build_array(p) END
) AS offer
JOIN "propostas" AS proposal ON proposal."id" = p->>'id'
LEFT JOIN "veiculos" AS v
    ON v."id" = NULLIF(offer->>'vehicleId', '')
   AND v."motorista_id" = proposal."motorista_id"
WHERE NULLIF(offer->>'id', '') IS NOT NULL
  AND offer->>'priceCents' ~ '^[0-9]+$'
  AND (offer->>'priceCents')::integer > 0
  AND offer->>'availableAt' ~ '^\d{4}-\d{2}-\d{2}T'
ORDER BY offer->>'id', offer->>'createdAt'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ofertas_proposta" (
    "id", "proposta_id", "veiculo_label", "valor_centavos",
    "disponivel_em", "mensagem", "status", "criado_em"
)
SELECT
    p."id", p."id", 'Veículo cadastrado',
    GREATEST(1, round(p."valor_proposto" * 100)::integer),
    p."criado_em", COALESCE(p."mensagem", ''),
    CASE WHEN p."status_proposta" = 'ACEITA' THEN 'ACEITA' ELSE 'PENDENTE' END,
    p."criado_em"
FROM "propostas" AS p
WHERE NOT EXISTS (
    SELECT 1 FROM "ofertas_proposta" o WHERE o."proposta_id" = p."id"
)
ON CONFLICT ("id") DO NOTHING;

WITH legacy_status AS (
    SELECT DISTINCT ON (p->>'id')
        p->>'id' AS proposal_id,
        p->>'status' AS status
    FROM "app_states" AS s
    CROSS JOIN LATERAL jsonb_array_elements(
        CASE WHEN jsonb_typeof(s."data"->'proposals') = 'array'
            THEN s."data"->'proposals' ELSE '[]'::jsonb END
    ) AS p
    WHERE NULLIF(p->>'id', '') IS NOT NULL
    ORDER BY p->>'id',
        CASE WHEN p->>'status' = 'ACEITA' THEN 0 ELSE 1 END
)
UPDATE "propostas" AS proposal
SET "status_proposta" = CASE legacy_status.status
    WHEN 'ACEITA' THEN 'ACEITA'::"status_proposta_enum"
    WHEN 'ENCERRADA' THEN 'CANCELADA'::"status_proposta_enum"
    ELSE proposal."status_proposta"
END
FROM legacy_status
WHERE proposal."id" = legacy_status.proposal_id
  AND legacy_status.status IN ('ACEITA', 'ENCERRADA');

WITH legacy_agreements AS (
    SELECT DISTINCT ON (f->>'id')
        f->>'id' AS freight_id,
        f->'agreement' AS agreement
    FROM "app_states" AS s
    CROSS JOIN LATERAL jsonb_array_elements(
        CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
            THEN s."data"->'freights' ELSE '[]'::jsonb END
    ) AS f
    WHERE jsonb_typeof(f->'agreement') = 'object'
    ORDER BY f->>'id'
)
INSERT INTO "acordos_frete" (
    "frete_id", "proposta_id", "oferta_id", "motorista_id",
    "nome_motorista", "nome_prestador", "tipo_prestador",
    "valor_centavos", "veiculo", "disponivel_em", "mensagem", "aceito_em"
)
SELECT
    legacy.freight_id,
    proposal."id",
    offer."id",
    proposal."motorista_id",
    COALESCE(legacy.agreement->>'driver', driver."name", ''),
    NULLIF(legacy.agreement->>'providerName', ''),
    CASE WHEN legacy.agreement->>'providerKind' IN ('autonomo', 'empresa')
        THEN legacy.agreement->>'providerKind' ELSE NULL END,
    offer."valor_centavos",
    offer."veiculo_label",
    offer."disponivel_em",
    offer."mensagem",
    CASE WHEN legacy.agreement->>'acceptedAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (legacy.agreement->>'acceptedAt')::timestamptz ELSE CURRENT_TIMESTAMP END
FROM legacy_agreements AS legacy
JOIN "propostas" AS proposal
    ON proposal."id" = legacy.agreement->>'proposalId'
   AND proposal."frete_id" = legacy.freight_id
JOIN "ofertas_proposta" AS offer
    ON offer."id" = legacy.agreement->>'offerId'
   AND offer."proposta_id" = proposal."id"
JOIN "user" AS driver ON driver."id" = proposal."motorista_id"
ON CONFLICT ("frete_id") DO NOTHING;

UPDATE "fretes" AS freight
SET
    "status_frete" = 'ACEITO',
    "motorista_selecionado_id" = agreement."motorista_id"
FROM "acordos_frete" AS agreement
WHERE agreement."frete_id" = freight."id";

UPDATE "propostas" AS proposal
SET "status_proposta" = CASE
    WHEN agreement."proposta_id" = proposal."id"
        THEN 'ACEITA'::"status_proposta_enum"
    ELSE 'CANCELADA'::"status_proposta_enum"
END
FROM "acordos_frete" AS agreement
WHERE agreement."frete_id" = proposal."frete_id";

UPDATE "ofertas_proposta" AS offer
SET "status" = CASE
    WHEN agreement."oferta_id" = offer."id" THEN 'ACEITA'
    WHEN offer."status" = 'PENDENTE' THEN 'ENCERRADA'
    ELSE offer."status"
END
FROM "acordos_frete" AS agreement
WHERE agreement."proposta_id" = offer."proposta_id";

UPDATE "avaliacoes" AS review
SET "perfil_avaliador" = CASE
    WHEN review."avaliador_id" = freight."cliente_id" THEN 'cliente'
    ELSE 'motorista'
END
FROM "fretes" AS freight
WHERE freight."id" = review."frete_id";

INSERT INTO "avaliacoes" (
    "frete_id", "avaliador_id", "avaliado_id", "nota", "comentario",
    "publica", "perfil_avaliador", "criado_em"
)
SELECT DISTINCT ON (f."id", reviewer.role)
    f."id",
    CASE WHEN reviewer.role = 'cliente' THEN f."cliente_id"
        ELSE agreement."motorista_id" END,
    CASE WHEN reviewer.role = 'cliente' THEN agreement."motorista_id"
        ELSE f."cliente_id" END,
    (reviewer.score)::integer,
    left(COALESCE(freight_state->'reviewComments'->>reviewer.role, ''), 1000),
    COALESCE((freight_state->'reviewPublicComments'->>reviewer.role)::boolean, false),
    reviewer.role,
    CASE WHEN freight_state->'reviewDates'->>reviewer.role ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (freight_state->'reviewDates'->>reviewer.role)::timestamptz
        ELSE CURRENT_TIMESTAMP END
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'freights') = 'array'
        THEN s."data"->'freights' ELSE '[]'::jsonb END
) AS freight_state
CROSS JOIN LATERAL jsonb_each(
    CASE WHEN jsonb_typeof(freight_state->'reviews') = 'object'
        THEN freight_state->'reviews' ELSE '{}'::jsonb END
) AS reviewer(role, score)
JOIN "fretes" AS f ON f."id" = freight_state->>'id'
JOIN "acordos_frete" AS agreement ON agreement."frete_id" = f."id"
WHERE reviewer.role IN ('cliente', 'motorista')
  AND reviewer.score #>> '{}' ~ '^[1-5]$'
ORDER BY f."id", reviewer.role,
    CASE WHEN reviewer.score #>> '{}' ~ '^[1-5]$' THEN 0 ELSE 1 END
ON CONFLICT ("frete_id", "avaliador_id", "avaliado_id") DO NOTHING;

UPDATE "mensagens" AS m
SET "proposta_id" = (
    SELECT p."id"
    FROM "propostas" AS p
    WHERE p."frete_id" = m."frete_id"
      AND (p."motorista_id" = m."remetente_id" OR p."motorista_id" = m."destinatario_id")
    ORDER BY p."criado_em"
    LIMIT 1
)
WHERE m."proposta_id" IS NULL;

UPDATE "mensagens" AS message
SET "perfil_remetente" = CASE
    WHEN message."remetente_id" = freight."cliente_id" THEN 'cliente'
    ELSE 'motorista'
END
FROM "fretes" AS freight
WHERE freight."id" = message."frete_id";

INSERT INTO "mensagens" (
    "id", "frete_id", "remetente_id", "destinatario_id", "proposta_id",
    "perfil_remetente", "conteudo", "lida", "criado_em"
)
SELECT
    m->>'id', m->>'freightId', s."user_id",
    CASE WHEN m->>'role' = 'cliente' THEN p."motorista_id" ELSE f."cliente_id" END,
    p."id",
    CASE WHEN m->>'role' = 'motorista' THEN 'motorista' ELSE 'cliente' END,
    left(COALESCE(m->>'text', ''), 2000),
    false,
    CASE WHEN m->>'createdAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (m->>'createdAt')::timestamptz ELSE CURRENT_TIMESTAMP END
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'messages') = 'array'
        THEN s."data"->'messages' ELSE '[]'::jsonb END
) AS m
JOIN "propostas" AS p ON p."id" = m->>'proposalId'
JOIN "fretes" AS f ON f."id" = p."frete_id"
WHERE NULLIF(m->>'id', '') IS NOT NULL
  AND m->>'freightId' = p."frete_id"
  AND (
      (m->>'role' = 'cliente' AND s."user_id" = f."cliente_id")
      OR (m->>'role' = 'motorista' AND s."user_id" = p."motorista_id")
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "notificacoes" (
    "id", "usuario_id", "perfil", "titulo", "body", "criado_em",
    "lida", "frete_id", "proposta_id"
)
SELECT DISTINCT ON (s."user_id", n->>'id')
    n->>'id', s."user_id", n->>'role',
    COALESCE(n->>'title', ''), COALESCE(n->>'body', ''),
    CASE WHEN n->>'createdAt' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (n->>'createdAt')::timestamptz ELSE CURRENT_TIMESTAMP END,
    COALESCE((n->>'read')::boolean, false),
    COALESCE(n->>'freightId', ''),
    NULLIF(n->>'proposalId', '')
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'notifications') = 'array'
        THEN s."data"->'notifications' ELSE '[]'::jsonb END
) AS n
WHERE NULLIF(n->>'id', '') IS NOT NULL
  AND n->>'role' IN ('cliente', 'motorista')
ORDER BY s."user_id", n->>'id'
ON CONFLICT ("usuario_id", "id") DO NOTHING;

INSERT INTO "revisoes_cadastro" (
    "id", "usuario_caso_id", "version", "actor", "at", "decision", "reason"
)
SELECT DISTINCT ON (r->>'id')
    r->>'id', s."user_id", COALESCE(r->>'version', ''),
    COALESCE(r->>'actor', ''),
    CASE WHEN r->>'at' ~ '^\d{4}-\d{2}-\d{2}T'
        THEN (r->>'at')::timestamptz ELSE CURRENT_TIMESTAMP END,
    r->>'decision',
    COALESCE(r->>'reason', '')
FROM "app_states" AS s
CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(s."data"->'adminReviews') = 'array'
        THEN s."data"->'adminReviews' ELSE '[]'::jsonb END
) AS r
WHERE NULLIF(r->>'id', '') IS NOT NULL
  AND r->>'decision' IN ('APROVADO', 'AJUSTES_SOLICITADOS')
ORDER BY r->>'id', s."user_id"
ON CONFLICT ("id") DO NOTHING;

DROP TABLE "app_states";

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliador_id_fkey" FOREIGN KEY ("avaliador_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliado_id_fkey" FOREIGN KEY ("avaliado_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_remetente_id_fkey" FOREIGN KEY ("remetente_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos_salvos" ADD CONSTRAINT "enderecos_salvos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfis_empresa" ADD CONSTRAINT "perfis_empresa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_atuacao" ADD CONSTRAINT "areas_atuacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas_proposta" ADD CONSTRAINT "ofertas_proposta_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "propostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas_proposta" ADD CONSTRAINT "ofertas_proposta_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos_frete" ADD CONSTRAINT "acordos_frete_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos_frete" ADD CONSTRAINT "acordos_frete_proposta_id_fkey" FOREIGN KEY ("proposta_id") REFERENCES "propostas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acordos_frete" ADD CONSTRAINT "acordos_frete_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisoes_cadastro" ADD CONSTRAINT "revisoes_cadastro_usuario_caso_id_fkey" FOREIGN KEY ("usuario_caso_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
