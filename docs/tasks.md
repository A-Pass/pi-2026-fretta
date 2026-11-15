# Divisão do grupo

| Frente                    | Entrega e aceite                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Cleiton — front-end       | Telas, componentes, formulários e integração contratual; verificar mobile e acessibilidade |
| Identidade e perfis       | Sessão, cadastro, recuperação, motorista/veículos; testar isolamento de duas contas        |
| Fretes e negociação       | Pedidos, propostas, aceite e estados; teste concorrente com apenas uma contratação         |
| Comunicação e integrações | Chat, notificações, arquivos e assinatura; autorização e webhooks idempotentes             |
| Dados e entrega           | Prisma, migrações, seeds, publicação e backup restaurável                                  |

Todos testam suas funcionalidades. Alteração de contrato é discutida antes da implementação. Branch por tarefa, pull request pequeno com revisão por colega. Migrações coordenadas por uma pessoa. Integrar primeiro publicação → proposta → aceite → agendamento.

Checklist detalhado da revisão de 05/11/2026 em [frontend-checklist.md](frontend-checklist.md).

Front-end demonstrativo inclui veículos, endereços, acordo, propostas versionadas na conversa, notificações por perfil, avaliações e navegação por URL. Pendências de integração: Google/sessão real, cadastro complementar acordado com o grupo, adaptadores por endpoint, uploads, comunicação e notificações remotas, assinatura real e paginação HTTP. Pendências de homologação: Android/iPhone físicos, leitores de tela, HTTPS e instalação publicada. O backend deve autorizar cada recurso e nunca enviar endereços privados a participantes não contratados.
