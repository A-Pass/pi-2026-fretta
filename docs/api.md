# Contrato HTTP a implementar

Base /api/v1, JSON, IDs strings, dinheiro em centavos inteiros, instantes ISO 8601 com fuso. Listas paginadas: {items,nextCursor}. Erros {code,message}; 401 sem sessão, 403 sem permissão, 404 indisponível, 409 conflito, 422 inválido. Cookie HttpOnly de sessão. Tipos de demonstração em app/src/contracts; expandir com schemas e DTOs privados/públicos na integração.

| Operação                                                | Resultado                                                                                                 |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GET /me e PATCH /me                                     | Perfil autenticado e atualização permitida                                                                |
| GET /freights e POST /freights                          | Feed autorizado e criação com origem/destino privados, agenda e fotos                                     |
| GET /freights/:id                                       | Detalhes conforme participação                                                                            |
| POST /freights/:id/cancel                               | Cancelamento validado                                                                                     |
| GET /freights/:id/proposals                             | Propostas visíveis ao proprietário; motorista vê as próprias                                              |
| POST /freights/:id/proposals                            | Preço, disponibilidade, veículo, mensagem; motorista derivado da sessão                                   |
| POST /proposals/:id/accept                              | offerId ou versão esperada no corpo, sem preço/identidade; aceite atômico da oferta pendente mais recente |
| POST /proposals/:id/decline                             | offerId esperado; recusa preserva conversa e frete aberto                                                 |
| GET e POST /proposals/:id/offers                        | Histórico e nova oferta na mesma conversa; substitui a oferta pendente anterior                           |
| GET e POST /vehicles; PATCH e DELETE /vehicles/:id      | Veículos do motorista autenticado; preservar snapshots anteriores                                         |
| POST /freights/:id/start e /complete                    | Transições autorizadas                                                                                    |
| GET e POST /conversations/:id/messages                  | Mensagens privadas paginadas e texto até 2000 caracteres                                                  |
| POST /freights/:id/reviews                              | Nota e comentário; participação/conclusão obrigatórias                                                    |
| POST /uploads                                           | Arquivo validado por conteúdo/tamanho; acesso autorizado                                                  |
| GET /subscription                                       | Estado de acesso do motorista                                                                             |
| GET /notifications                                      | Notificações paginadas exclusivas do usuário                                                              |
| PATCH /notifications/:id e POST /notifications/read-all | Marcar leitura somente das notificações do usuário                                                        |

Catch-all atual retorna 501. O cliente real está pendente: /state serve apenas para indicar indisponibilidade, não constitui contrato de produção. Não fazer fallback silencioso para mocks. Transporte de chat/notificações, reconexão e autorização serão implementados pela frente de comunicação.

## Dados a acordar na integração

GET /me deve retornar perfil, papéis habilitados e pendências do cadastro complementar. Detalhes de frete retornam acordo e endereços privados apenas aos participantes autorizados; feed contém somente regiões aproximadas. Proposta inicial e renegociação usam vehicleId de um veículo do motorista, dinheiro inteiro em centavos e disponibilidade ISO 8601 com fuso. O servidor copia os dados do veículo e os dados definitivos do acordo.

A conversa continua tendo o mesmo ID ao recusar/substituir ofertas. Mensagens e ofertas devem ser ordenadas pelo instante do servidor e preservar histórico. Endpoints de aceite/recusa validam oferta esperada e respondem 409 para versão substituída; nunca aceitar uma oferta diferente da confirmada. RECUSADA é situação da oferta; no protótipo o resumo da negociação usa ENCERRADA até receber nova oferta.

Avaliação aceita nota e comentário, retornando o registro definitivo; duplicidade por participante resulta em conflito. Notificações possuem id, evento, data, read e destino (frete/conversa); destinatário é derivado da sessão. A paginação local da interface deve ser substituída por cursores ao integrar os endpoints. A assinatura só muda por confirmação do servidor/gateway na versão real.

## Primeiro acesso do motorista — integração pendente

O backend de identidade deve informar em GET /me se a conta tem perfil motorista, se precisa completar o cadastro e a situação da análise. A ausência de metadados no navegador só identifica o primeiro uso na demonstração; não identifica uma conta Google nova em produção.

Contratos a consolidar com a frente de identidade:

- GET /driver/registration: resumo privado/mascarado, situação, pendências e motivo dos ajustes; sem retornar imagens/identificadores completos desnecessariamente.
- POST /driver/registration: nome completo, pessoa física/jurídica, CPF, CNPJ/razão social quando aplicáveis, CNH (registro/categoria/validade), IDs de uploads privados, foto do perfil e vehicleId. Envio e reenvio ficam EM_ANALISE.
- POST /driver/registration/uploads: upload autenticado de imagem de perfil/documento com validação de conteúdo, tamanho e autorização. Não reutilizar URLs públicas para a CNH.
- Análise aprovada/ajustes é uma operação administrativa separada, autorizada no servidor. Não expor endpoint de autoaprovação ao motorista. Os controles de simulação do front-end não são parte do contrato real.
- POST de proposta/nova oferta deve validar cadastro aprovado, habilitação, veículo e assinatura no momento da operação. Login Google ou preenchimento do formulário não equivalem a aprovação.

A demonstração só persiste o resumo mascarado em driverRegistration. Os arquivos de CNH e os identificadores completos não são persistidos/transmitidos pelo adaptador local. A implementação real depende de armazenamento privado e do processo de verificação escolhido pelo grupo; nenhum provedor de consulta/OCR/biometria foi contratado ou conectado.
