# Divisão do grupo

| Frente | Entrega e aceite |
|---|---|
| Clayton — front-end | Telas, componentes, formulários e integração contratual; verificar mobile e acessibilidade |
| Identidade e perfis | Sessão, cadastro, recuperação, motorista/veículos; testar isolamento de duas contas |
| Fretes e negociação | Pedidos, propostas, aceite e estados; teste concorrente com apenas uma contratação |
| Comunicação e integrações | Chat, notificações, arquivos e assinatura; autorização e webhooks idempotentes |
| Dados e entrega | Prisma, migrações, seeds, publicação e backup restaurável |

Todos testam suas funcionalidades. Alteração de contrato é discutida antes da implementação. Branch por tarefa, pull request pequeno com revisão por colega. Migrações coordenadas por uma pessoa. Integrar primeiro publicação → proposta → aceite → agendamento.

Pendências front-end: autenticação/cadastro completo, veículos, endereços privados, adaptadores por endpoint, upload remoto, comunicação remota, assinatura real, paginação, URLs por tela, preservação de histórico, foco de diálogos, acessibilidade e homologação PWA. Telas separadas em WelcomeView, FreightListView, FreightDetailsView, ChatView e ProfileView; formulários são coordenados por FrettaApp. A demonstração usa registros compartilhados, sem controle de contas; permissões reais são responsabilidade do servidor.
