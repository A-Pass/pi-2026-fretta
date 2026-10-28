# FRETTA

Aplicação Next.js + TypeScript do IFBA Eunápolis. Interface demonstrativa com perfis de cliente/motorista, pedidos, propostas, aceite, conversa local, avaliação e perfil. Servidor, contas reais e pagamentos são trabalho pendente do grupo.

## Executar

Node.js 20.9+ e npm:

```sh
cd app
npm ci
npm run dev
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

## Limites conhecidos

Esta é uma primeira entrega demonstrável do front-end. Autenticação, cadastro completo, edição de veículos, autorização de endereços privados, upload remoto, notificações remotas e gateway dependem dos módulos do servidor. API provisória retorna 501. Há manifest inicial, mas instalação PWA, ícones raster, HTTPS e compatibilidade mobile ainda exigem homologação. Não há service worker/offline. Navegação utiliza estado local, sem URLs individuais. Diálogos precisam de revisão de foco e acessibilidade. As telas estão separadas em módulos próprios; a orquestração demonstrativa fica em FrettaApp. Não usar a demonstração como produto com contas reais.

## Solicitações e endereços

Novo fluxo: Itens e fotos → Retirada → Entrega → Veículo → Quando → Datas/confirmação. A opção A combinar dispensa datas na etapa final. Endereços salvos em Meu perfil → Meus Endereços podem ser reutilizados, editados e excluídos. A caixa Salvar este endereço só grava quando o pedido é publicado. Os dados permanecem locais neste navegador, sem contas reais. O mapa online Leaflet/OpenStreetMap permite zoom, marcação e consulta pontual de GPS mediante permissão. Não há pesquisa automática de endereço. O Início do motorista filtra oportunidades por raio da retirada e permite alterar a base para buscar fretes de retorno; Meus serviços lista apenas suas propostas e serviços. O filtro atual usa os dados locais da demonstração. Consulte docs/domain.md para os limites de privacidade e integração.
