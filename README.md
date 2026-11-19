# FRETTA

Aplicação do IFBA Eunápolis para conectar clientes e motoristas de frete. O modo real roda localmente com Next.js, Better Auth, Prisma e PostgreSQL. O pagamento da apresentação usa Pix simulado.

## Apresentação local

Siga o [guia da apresentação](docs/apresentacao-local.md) para configurar o Google, preparar duas contas, demonstrar o Pix e ensaiar da publicação à avaliação. O guia também cobre migrações, backup e restauração do banco e das imagens.

Para uma instalação Docker nova, copie o `.env.example` da raiz para `.env`, preencha os valores locais e execute `docker compose up --build`. O servidor fica em http://localhost:3000 por padrão. A configuração do Google deve usar o mesmo endereço e a mesma porta. Para instalar sem Docker, siga a alternativa no guia.

O modo real usa contas, permissões e registros do banco. O modo demonstrativo separado (`NEXT_PUBLIC_API_MODE=demo`) usa exemplos do navegador. O Pix de teste no modo real depende de `FRETTA_DEMO_PIX=true`. A confirmação de teste libera o acesso no banco e não movimenta dinheiro.

## Código e testes

- `app/src/frontend` contém telas, componentes e clientes da API.
- `app/src/app` contém as páginas e rotas HTTP.
- `app/src/server` contém serviços, permissões e regras de negócio.
- `app/prisma` contém o esquema oficial e as migrações. O SQL legado em `database` não é usado na instalação atual.
- `app/storage` contém os arquivos enviados. No Docker, eles ficam em volume separado do PostgreSQL.

Na pasta `app`, instale com `npm ci` e use `npm run generate` para gerar o cliente Prisma. Execute `npm test`, `npm run typecheck` e `npm run build`. Para `npm run test:server`, use um banco PostgreSQL local separado chamado `fretta_test`, aplique as migrações e configure a sessão conforme o modelo de ambiente. Os testes do servidor criam e removem registros fictícios.

## Escopo da entrega

O roteiro cobre publicar e localizar uma solicitação, propor, negociar no chat, contratar, iniciar, concluir e avaliar. No cadastro do motorista, o administrador pode aprovar ou pedir correções específicas. Gateway real, equipes de empresas e perfil público com avaliações estão fora da apresentação local. Google e o carregamento do mapa precisam de internet.

## Versão anterior

A tag `backup/homeclean-before-fretta-2026-10-28` preserva a base anterior. A versão de trabalho fica em `feat/fretta-rebuild`. Para consultar a base anterior em outra pasta:

```sh
git worktree add ../fretta-versao-anterior backup/homeclean-before-fretta-2026-10-28
```
