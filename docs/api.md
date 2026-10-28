# Contrato HTTP a implementar

Base /api/v1, JSON, IDs strings, dinheiro em centavos inteiros, instantes ISO 8601 com fuso. Listas paginadas: {items,nextCursor}. Erros {code,message}; 401 sem sessão, 403 sem permissão, 404 indisponível, 409 conflito, 422 inválido. Cookie HttpOnly de sessão. Tipos de demonstração em app/src/contracts; expandir com schemas e DTOs privados/públicos na integração.

| Operação | Resultado |
|---|---|
| GET /me e PATCH /me | Perfil autenticado e atualização permitida |
| GET /freights e POST /freights | Feed autorizado e criação com origem/destino privados, agenda e fotos |
| GET /freights/:id | Detalhes conforme participação |
| POST /freights/:id/cancel | Cancelamento validado |
| GET /freights/:id/proposals | Propostas visíveis ao proprietário; motorista vê as próprias |
| POST /freights/:id/proposals | Preço, disponibilidade, veículo, mensagem; motorista derivado da sessão |
| POST /proposals/:id/accept | Sem preço/identidade no corpo; aceite atômico |
| POST /freights/:id/start e /complete | Transições autorizadas |
| GET e POST /conversations/:id/messages | Mensagens privadas paginadas e texto até 2000 caracteres |
| POST /freights/:id/reviews | Nota e comentário; participação/conclusão obrigatórias |
| POST /uploads | Arquivo validado por conteúdo/tamanho; acesso autorizado |
| GET /subscription | Estado de acesso do motorista |
| GET /notifications | Notificações exclusivas do usuário |

Catch-all atual retorna 501. O cliente real está pendente: /state serve apenas para indicar indisponibilidade, não constitui contrato de produção. Não fazer fallback silencioso para mocks. Transporte de chat/notificações, reconexão e autorização serão implementados pela frente de comunicação.
