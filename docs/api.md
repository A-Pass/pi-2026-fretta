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

### Categorias e reenvios da análise

A revisão inclui `correctionItems`: lista sem duplicatas de `dados`, `foto`, `cnh`, `veiculo`; ao solicitar ajustes, ao menos um item e motivo de 10–1000 caracteres. Retornar esses itens no resumo privado do motorista. Aprovação limpa as correções pendentes sem apagar o histórico. Incrementar `submissionCount` no servidor a cada envio/reenvio, mantendo as decisões anteriores. Os exemplos locais usam contador/instantes como versão; produção precisa de uma versão transacional gerada pelo banco. Não confiar no checklist do navegador para validar documentos ou compatibilidade CNH/veículo.

## Cliente: revisão de solicitação e cancelamento

- PATCH /freights/:id: conteúdo validado + versão esperada. Somente proprietário e ABERTO. Conteúdo alterado incrementa revisão, encerra ofertas anteriores e gera eventos de atualização, mantendo mensagens e histórico; tudo em transação. Sem mudança de conteúdo, não invalidar ofertas.
- Propostas/ofertas devem guardar a revisão do pedido para a qual foram enviadas; aceite rejeita revisão antiga com 409, mesmo que o navegador envie oferta indevidamente pendente.
- POST /freights/:id/cancel: motivo de 10–1000 caracteres e versão/situação esperada; somente proprietário em ABERTO/AGENDADO. Registrar autor/data do servidor, motivo e situação anterior; preservar acordo e mensagens, encerrar ofertas e notificar envolvidos. Sem cobrança automática nesta apresentação. Transporte iniciado não aceita este cancelamento.
- DTO privado pode devolver `revision`, `updatedAt` e resumo autorizado de `cancellation`. Não incluir endereços exatos em feed ou notificações públicas. Rascunhos locais não autorizam cadastro nem alteração de dados de outra conta.

## Equipe da empresa — contratos a implementar

- GET /companies/me: empresas e permissões do usuário derivadas da sessão. Gestor de empresa é diferente de administrador do FRETTA.
- GET /drivers/by-code/:code: busca exata, autenticada e limitada contra enumeração; retorna somente identificação pública necessária à confirmação. Código único aleatório no servidor, nunca CPF/e-mail como chave de busca pública.
- POST /companies/:id/invites: destinatário por ID público, criado pelo gestor autorizado. Expiração em sete dias, duplicatas impedidas no banco.
- POST /company-invites/:id/accept|decline e DELETE /companies/:id/invites/:inviteId: destinatário responde, gestor cancela; validar validade e estado transacionalmente. Aceite não aprova motorista, não ativa plano e não aceita um frete.
- GET /companies/:id/members; PATCH /companies/:id/members/:driverId; POST /companies/:id/leave: vínculo único ativo, acesso por empresa, histórico preservado e encerramento bloqueado por serviços em andamento. Ativação real aguarda política de plano/preços; não confiar em `activeSeat` enviado pelo navegador.
- Veículos da empresa separados dos pessoais, com CRUD autorizado por gestor e snapshots por serviço. Não alterar veículo comprometido em atribuição sem resolver a operação.
- POST /companies/:id/dispatches: motorista aprovado e habilitado, vaga operacional, veículo compatível e solicitação aberta na revisão esperada. Reservar motorista/veículo em transação; a demonstração usa somente uma atribuição em aberto de cada vez.
- POST /company-dispatches/:id/accept|decline: somente motorista designado. POST /company-dispatches/:id/proposal: somente gestor, após confirmação do motorista. Proposta guarda companyId, motorista, veículo, revisão do pedido e termos; servidor resolve as identidades.
- GET /me/company-services: somente atribuições do usuário, sem feed público para funcionário vinculado. Endereços privados só após contratação e somente aos participantes autorizados.
- Chat por negociação com participantes cliente, gestor autorizado e motorista designado; autor/data sempre derivados da sessão/servidor. Nenhuma mensagem externa é enviada pelo protótipo.

Modelo demonstrativo em `FleetState` não é um DTO que pode ser gravado inteiro pelo usuário em produção. Operações reais exigem autorização, concorrência, auditoria, separação de empresas e política de privacidade. `/empresa` não concede permissão real; o modo real permanece indisponível até integrar esses endpoints.
