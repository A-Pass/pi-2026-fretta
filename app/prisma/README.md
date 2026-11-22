# Prisma

Este diretório contém o schema e as migrations PostgreSQL da aplicação.

Antes de alterar o banco, revise `schema.prisma` e as migrations existentes em `migrations/`.

## Comandos

Os scripts reais estão em `package.json`:

```sh
npm run dev
npm run build
npm run typecheck
npm test
```

`npm run dev` executa `prisma migrate deploy` antes do Next.js. `npm start` também executa o deploy antes de iniciar a aplicação.

## Configuração

O Prisma CLI usa `prisma.config.ts` na raiz de `app`. O datasource usa `DB_URL`. O Prisma Client é gerado em `src/server/generated/prisma`.

## Migrations existentes

- `20261121024628_init`: estrutura inicial do banco;
- `20261121180100_relational_user_data`: migração do estado legado por usuário para tabelas relacionais e remoção do estado único `app_states`.

Não substitua migrations antigas nem copie scripts finais de `src-system/database` como migração automática.
