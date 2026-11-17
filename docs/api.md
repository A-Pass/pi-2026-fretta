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

## Complementos do front-end de 16/11/2026

Cliente HTTP preparado em `app/src/frontend/api/http.ts` e chamadas principais em `backend.ts`; ainda não conectado ao fluxo real das telas. Confirmar schemas/respostas antes da integração.

- GET /providers/:id: DTO público permitido (`PublicProviderProfile`), sem CPF/CNPJ/CNH/placa/endereços privados; empresa tem logo e motorista responsável com foto separados. Contagens e média são calculadas no servidor, somente de serviços concluídos.
- POST /freights/:id/reviews: inclui `publishComment` explícito, falso por padrão; avaliações antigas sem esse campo não publicam comentários. Não expor identidade do cliente junto ao comentário público.
- GET /addresses: coleção privada paginada. Acordar POST/PATCH/DELETE para o CRUD de endereços já existente na demonstração.
- Empresa: acordar leitura/edição autenticada de nome comercial, logo, apresentação e cidade; razão social/CNPJ seguem privados no cadastro. O MVP tem um motorista responsável; não concede vínculo a outras contas.
- Upload responde ID autorizado, não caminho arbitrário enviado pelo usuário. CNH usa endpoint privado separado. Identidade, autoria e permissão sempre derivadas da sessão no servidor.
- Mensagens incluem `clientMessageId` para permitir deduplicação no servidor. Falhas de mutações não são repetidas automaticamente pelo transporte.

## Painel administrativo — contrato proposto

Rota de interface `/admin`, separada da navegação de cliente/motorista no mesmo projeto. Neste momento funciona somente com casos fictícios no adaptador local. Em modo real, consulta `/admin/me` e permanece bloqueada: não há sessão/autorização administrativa implementada. Não ativar o painel real apenas por e-mail, query string ou localStorage.

Contrato a implementar pela frente de identidade/back-end:

- GET /admin/me: identidade administrativa derivada da sessão do servidor, 401 sem sessão, 403 para conta sem permissão.
- GET /admin/driver-registrations?status=EM_ANALISE&cursor=...: casos autorizados paginados, com versão de cada envio.
- GET /admin/driver-registrations/:id: identificação necessária à análise, foto, habilitação e veículos; resposta privada sem cache. DTO privado separado do perfil público.
- GET /admin/driver-registrations/:id/documents/:documentId: leitura do documento autorizada para administrador; arquivo fora de public/, cabeçalhos privados e sem URL pública permanente. A interface atual exibe um placeholder honesto pois a CNH nunca foi persistida no protótipo.
- POST /admin/driver-registrations/:id/review: `{decision, reason, expectedVersion}`. Decisões APROVADO/AJUSTES_SOLICITADOS; motivo de ajustes entre 10 e 1000 caracteres. Servidor verifica o cadastro pendente, versão, documentos/validade e permissão; rejeita decisão concorrente com 409. Não aceitar autor/data enviados pelo navegador como verdade.
- Registrar revisão e alteração de situação na mesma transação, com administrador, data do servidor, versão e motivo; histórico não editável pelo prestador. Notificar o prestador e devolver o resumo atualizado em GET /driver/registration.
- CSRF/origem para operações com sessão por cookie, limites de uso e trilha de acesso a documentos. Conceder a primeira permissão por migração/seed administrativo controlado, nunca pelo cadastro público. Conta com acesso ao repositório não é automaticamente administradora.

O demo mantém decisões em `adminReviews` e casos fictícios em `adminDemoCases`; o caso `demo-driver` lê e altera `driverRegistration` já existente. Reenvio do motorista mantém o histórico e muda a versão. As proteções locais evitam erros de apresentação, mas não equivalem à autorização ou concorrência transacional de servidor. Os botões antigos de autoaprovação foram retirados da tela do motorista.
