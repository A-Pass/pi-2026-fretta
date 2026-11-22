# Banco de dados

A conexão usa Prisma 7 com `@prisma/adapter-pg` e PostgreSQL.

## Configuração

- a conexão é criada em `src/server/db.ts`;
- a variável obrigatória é `DB_URL`;
- o schema está em `prisma/schema.prisma`;
- as migrations versionadas estão em `prisma/migrations`;
- o cliente gerado fica em `src/server/generated/prisma`.

Não execute SQL antigo diretamente a partir de `database/`. Essas migrations versionadas são a fonte que o projeto usa durante desenvolvimento.

## Estado persistido

O schema contém usuários, sessões e contas do Better Auth; clientes e motoristas; veículos; endereços; fretes e fotos; propostas e ofertas; acordos; mensagens; avaliações; notificações; cadastro administrativo e perfil de área/empresa.

Leitura e escrita do estado da conta passam por `src/server/modules/store/persistence.ts`. Operações que precisam preservar consistência usam transações Prisma.
