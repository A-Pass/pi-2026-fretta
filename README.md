# FRETTA

Aplicação Next.js + TypeScript do IFBA Eunápolis. Interface demonstrativa com perfis de cliente/motorista, pedidos, propostas, aceite, conversa local, avaliação e perfil. Servidor, contas reais e pagamentos são trabalho pendente do grupo.

## Executar

Node.js 20.9+ e npm:
Docker Engine

Executar localmente (precisa de um banco de dados configurado)
```sh
cd app
npm ci
npm run dev
```

### Via Docker

Executa a aplicação em um container com debug ativado - <small>executa a aplicação, banco de dados e inicializa banco de dados automaticamente)</small>.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --rm --build --force-recreate --remove-orphans
```

Abra http://localhost:3000. Os exemplos são compartilhados pelos perfis e persistem apenas neste navegador. Use Meu perfil → Restaurar demonstração para recomeçar. Nenhuma mensagem é enviada a terceiros e nenhuma assinatura é cobrada.

Verificações: `npm run typecheck`, `npm test`, `npm run build` dentro de app.

## Estrutura

`app/src/frontend`: componentes, funcionalidades, cliente HTTP e mocks.
`app/src/contracts`: tipos compartilhados sem dependências do banco.
`app/src/server`: módulos reservados para implementação pelos colegas.
`app/src/app`: páginas, estilos, manifest e entradas HTTP.
`app/prisma`: espaço para o esquema e migrações oficiais.
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

A demonstração tem veículos, perfil persistente, negociação com histórico de ofertas no chat, notificações locais, acordo após aceite e avaliação com comentário. As telas usam URLs com parâmetros (`?perfil=motorista&tela=veiculos`, `?perfil=cliente&tela=fretes&frete=...` e `?perfil=cliente&tela=chat&conversa=...`). Voltar/Avançar e recarregar preservam o contexto; a sessão demonstrativa é mantida somente nesta aba até sair. Meus veículos e Minha assinatura ficam no perfil do motorista.

No primeiro uso do perfil motorista, um cadastro guiado solicita dados, foto de perfil, CNH e veículo. O envio fica em análise; a aprovação só pode ser simulada nos controles identificados como demonstração. Use dados fictícios: números completos e imagem da CNH não são persistidos no protótipo. Serviços/conversas anteriores continuam acessíveis enquanto há pendência, mas novas propostas exigem aprovação simulada e assinatura ativa.

Confira a entrega e as pendências em [docs/frontend-checklist.md](docs/frontend-checklist.md).

## Limites conhecidos

Contas, autenticação Google, autorização, upload remoto, comunicação entre dispositivos e cobrança continuam pendentes dos módulos do servidor. A API provisória retorna 501; não há fallback silencioso para mocks. Os dados locais não oferecem privacidade entre contas. A interface só exibe endereços após aceite aos participantes simulados, mas a autorização real deve ocorrer no backend.

PWA: manifest e ícones preparados; em produção (`npm run build` e `npm start`) o service worker fornece apenas um aviso offline. APIs, dados privados e mapas não são cacheados. O sistema não funciona integralmente offline. A homologação em Android/iPhone físicos e em HTTPS publicado permanece pendente. Use `http://localhost:3000` em desenvolvimento; outros hosts podem ser bloqueados pela proteção de origem do Next.js.

## Solicitações e endereços

Novo fluxo: Itens e fotos → Retirada → Entrega → Veículo → Quando → Datas/confirmação. A opção A combinar dispensa datas na etapa final. Endereços salvos em Meu perfil → Meus Endereços podem ser reutilizados, editados e excluídos. A caixa Salvar este endereço só grava quando o pedido é publicado. Os dados permanecem locais neste navegador, sem contas reais. O mapa online Leaflet/OpenStreetMap permite zoom, marcação e consulta pontual de GPS mediante permissão. Não há pesquisa automática de endereço. O Início do motorista filtra oportunidades por raio da retirada e permite alterar a base para buscar fretes de retorno; Meus serviços lista apenas suas propostas e serviços. O filtro atual usa os dados locais da demonstração. Consulte docs/domain.md para os limites de privacidade e integração.
