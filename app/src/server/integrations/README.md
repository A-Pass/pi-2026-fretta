# Integrações

Este diretório é reservado às integrações externas do servidor.

## Integrações configuradas

- **Better Auth / Google OAuth:** autenticação social configurada em `src/server/auth`.
- **PostgreSQL / Prisma:** persistência do domínio configurada em `src/server/db.ts`.
- **Leaflet / OpenStreetMap:** usado no front-end para seleção e exibição de pontos aproximados. O servidor não faz geocodificação automática.

## Limites atuais

Não há integração implementada para:

- cobrança ou gateway de pagamento;
- notificações por push;
- rastreamento contínuo;
- armazenamento privado de arquivos;
- chat por provedor externo;
- entrega de SMS ou e-mail além dos recursos de sessão do Better Auth.

Imagens e documentos enviados pelo protótipo não devem ser tratados como armazenamento seguro até existir uma integração privada explícita.
