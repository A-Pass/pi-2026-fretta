# FRETTA

Este repositório contém o código e a documentação técnica da aplicação.

Aplicação Next.js + TypeScript do IFBA Eunápolis para clientes e motoristas. Login Google, sessão persistida e estado privado por conta são implementados com Better Auth e PostgreSQL.

## Executar

Node.js 20.19+ e npm:
Docker Engine

Executar localmente (precisa de um banco de dados configurado)
```sh
cd app
npm ci
npm run dev
```

Para autenticação Google local, configure no `app/.env.local` as variáveis
`DB_URL`, `APP_BETTER_AUTH_SECRET`, `APP_URL`,
`APP_GOOGLE_CLIENT_ID` e `APP_GOOGLE_CLIENT_SECRET`. Gere um segredo com
`openssl rand -base64 32` e registre no cliente OAuth do Google a URI
`http://localhost:3100/api/auth/callback/google`. Não compartilhe nem versione
segredos. O `.env-sample` da raiz contém os nomes das variáveis; preserve
valores locais já existentes ao configurá-las.
Para executar via Docker Compose, configure essas variáveis também no `.env` da
raiz do produto; preserve as configurações de banco já existentes.

No Google Cloud Console, cadastre `http://localhost:3100` como origem
JavaScript autorizada e a URI de callback acima como redirecionamento
autorizado. Em produção, substitua ambas pelas origens HTTPS publicadas.

### Via Docker

Executa a aplicação em um container com debug ativado - <small>executa a aplicação, banco de dados e inicializa banco de dados automaticamente)</small>.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --rm --build --force-recreate --remove-orphans
```

Abra http://localhost:3000. Cada conta autenticada utiliza sua própria sessão e estado persistido no PostgreSQL. O OAuth Google redireciona ao Google e recebe a identidade básica. Nenhuma assinatura é cobrada sem integração explícita com um gateway.

Verificações: `npm run typecheck`, `npm test`, `npm run build` dentro de app.

## Estrutura

`app/src/frontend`: componentes, funcionalidades, cliente HTTP e mocks.
`app/src/contracts`: tipos compartilhados sem dependências do banco.
`app/src/server`: sessão Better Auth e conexão Prisma; os módulos de domínio continuam pendentes.
`app/prisma.config.ts`: configuração do Prisma CLI; o cliente é gerado em `app/src/server/generated/prisma` durante a instalação.
`app/src/app`: páginas, estilos, manifest e entradas HTTP.
`database/schema.prisma`: modelo de dados e geração do cliente Prisma.
`docs`: regras, contratos e tarefas do grupo.

O protótipo final não pôde ser aberto como projeto navegável. A interface interpreta a identidade e os fluxos recuperados do histórico do Figma; não promete reprodução exata das telas.

## Versão anterior e retorno

A tag `backup/homeclean-before-fretta-2026-10-28` preserva o commit anterior 0561e8e. A nova base está na branch `feat/fretta-rebuild`. A main permanece preservada.

Para consultar a antiga em outra pasta:

```sh
git worktree add ../fretta-versao-anterior backup/homeclean-before-fretta-2026-10-28
```

Para executar main: faça commit de seu trabalho e use `git switch main`. Não use reset destrutivo.

## Estado do front-end

O front-end possui veículos, perfil, negociação, chat, notificações, acordo e avaliação. As telas usam segmentos do App Router (`/motorista/veiculos`, `/cliente/fretes/{id}` e `/cliente/chat/{id}`); links antigos com parâmetros de consulta são redirecionados para as rotas equivalentes. Voltar/Avançar e recarregar preservam o contexto da conta autenticada.

No primeiro uso do perfil motorista, um cadastro guiado solicita dados, foto de perfil, CNH e veículo. O envio fica em análise. Dados sensíveis devem ser tratados por uploads privados autorizados.

Confira a entrega e as pendências em [docs/frontend-checklist.md](docs/frontend-checklist.md).

## Limites conhecidos

Autenticação Google e sessão persistida via Better Auth/PostgreSQL estão implementadas. Os dados da conta são carregados e salvos pela API em tabelas relacionais vinculadas ao usuário, com autorização por sessão; a migração `relational_user_data` transfere os dados legados e remove `app_states`. Cadastro complementar, autorização administrativa completa, uploads privados, chat remoto e pagamentos continuam pendentes nos módulos de domínio.

PWA: manifest e ícones preparados; em produção (`npm run build` e `npm start`) o service worker fornece apenas um aviso offline. APIs, dados privados e mapas não são cacheados. O sistema não funciona integralmente offline. A homologação em Android/iPhone físicos e em HTTPS publicado permanece pendente. Use `http://localhost:3000` em desenvolvimento; outros hosts podem ser bloqueados pela proteção de origem do Next.js.

## Solicitações e endereços

Novo fluxo: Itens e fotos → Retirada → Entrega → Veículo → Quando → Datas/confirmação. A opção A combinar dispensa datas na etapa final. Endereços salvos em Meu perfil → Meus Endereços podem ser reutilizados, editados e excluídos. A caixa Salvar este endereço associa uma cópia privada ao pedido publicado. O mapa Leaflet/OpenStreetMap permite zoom, marcação e consulta pontual de GPS mediante permissão. Não há pesquisa automática de endereço. Consulte docs/domain.md para os limites de privacidade e integração.
