# Autenticação

O servidor usa Better Auth com o adapter Prisma para PostgreSQL.

## Implementação

- configuração em `src/server/auth/index.ts`;
- validação das variáveis em `src/server/auth/env.ts`;
- entrada HTTP em `src/app/api/auth/[...all]/route.ts`;
- provedor ativo: Google OAuth;
- sessão: 30 dias, com renovação diária;
- `trustedOrigins` limitado ao valor de `APP_URL`.

## Variáveis

São obrigatórias `DB_URL`, `APP_BETTER_AUTH_SECRET`, `APP_URL`, `APP_GOOGLE_CLIENT_ID` e `APP_GOOGLE_CLIENT_SECRET`. O segredo do Better Auth deve ter pelo menos 32 caracteres.

As rotas `/api/v1` retornam `401` sem sessão válida. A API administrativa usa um cookie HTTP-only separado e credenciais administrativas configuradas no ambiente.
