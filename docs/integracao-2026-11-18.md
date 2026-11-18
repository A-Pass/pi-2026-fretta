# Integração de 18/11/2026

A branch feat/fretta-rebuild incorpora fix/roteamento (Anderson, 6cf1907) e feat/communication-backend (Milena, 2873af2, incluindo identity-backend). Os commits originais e a versão anterior permanecem no histórico. Existe também a branch local backup/fretta-before-integration-2026-11-18.

## O que funciona em cada modo

O padrão NEXT_PUBLIC_API_MODE=demo preserva todas as telas e interações demonstrativas. O roteamento agora usa /cliente/inicio, /motorista/perfil etc.; os links antigos com parâmetros são redirecionados. /admin e /empresa continuam separados.

NEXT_PUBLIC_API_MODE=real habilita uma área inicial de integração, com a sessão Better Auth do Anderson/Milena, ativação de perfis, edição de nome, veículos, envio privado de fotos/CNH e cadastro para análise. O painel administrativo consulta cadastros reais e permite aprovar ou solicitar ajustes. Não usa os registros fictícios do navegador. A interface completa de fretes continua demonstrativa até existirem suas APIs; a área real não substitui isso por exemplos.

O acesso administrativo depende de User.papel=ADMIN no banco; conhecer a URL não concede permissão. A leitura dos documentos exige sessão e autorização do dono ou administrador. Não há promoção pública a administrador. A análise usa a versão atualizadoEm para evitar decisões sobre informações antigas. Histórico completo de revisores e categorias de correção ainda requer modelo/API próprios.

## Como executar

Na pasta app: npm ci; copie .env.example para .env.local, preencha os valores locais e execute npm run generate e npm run dev. Para os comandos Prisma, exporte DATABASE_URL no terminal ou use um arquivo app/.env, carregado pelo Prisma; o Next também carrega .env.local. npm run build gera o cliente Prisma antes de compilar. Não versionar .env, fotos ou segredos.

No modo real, usar BETTER_AUTH_URL=http://localhost:3000 e a credencial Google configurada para http://localhost:3000/api/auth/callback/google. Anderson deve confirmar os valores no ambiente dele. Não é necessário copiar a configuração Google antiga do Cleiton.

Para Docker: copie .env.example da raiz para .env, defina os segredos e execute docker compose up --build. O banco novo usa um volume nomeado separado e recebe as migrações Prisma. Os scripts SQL antigos não são aplicados nesse banco. O compose anterior está preservado em docker-compose.legacy.yml apenas como referência histórica; não executar junto com o novo. Os dados de _storage_ não foram migrados nem apagados. O diretório storage tem volume próprio para persistir documentos. Alterar NEXT_PUBLIC_API_MODE exige recompilar o front.

## Validação e limites

Foram aplicadas as 13 migrações em um PostgreSQL 18.6 temporário exclusivo (fretta_test), sem alterar o banco de desenvolvimento. Passaram os 33 testes existentes do servidor e o teste novo de autorização de leitura de documentos; a aprovação foi revalidada incluindo versão desatualizada. A suíte do front, a checagem de tipos e as compilações de produção foram verificadas. O teste HTTP confirmou rotas válidas, redirecionamento legado, 404 e bloqueio 401 sem sessão.

Docker não pôde ser executado neste ambiente porque o runtime local do Podman recusou acesso. A configuração deve ser executada também no notebook da apresentação (PostgreSQL 17 no compose). O fluxo Google completo não foi testado com uma conta real; não havia credenciais do Anderson configuradas no ambiente de testes.

## Pendências para combinar com a equipe

- APIs de solicitação de frete, propostas, aceite, cancelamento e andamento ainda não existem na contribuição recebida; /state retorna 501. Integrar essas operações antes de apresentar como sistema real completo.
- Chat e notificações possuem APIs, mas a navegação completa depende dos fretes/conversas reais e precisa ser conectada junto deles.
- Empresas, convites e atribuições de motoristas ainda precisam de persistência e permissões no servidor. Preços continuam pendentes de decisão do grupo.
- Confirmar quem será ADMIN na base da apresentação e como provisionar essa conta de forma controlada.
- Definir retenção dos documentos e histórico de auditoria. O servidor atual só permite nome no perfil; edição de foto/endereço precisa de endpoints próprios.
