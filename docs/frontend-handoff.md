# Entrega do front-end — 16/11/2026

A demonstração segue em `http://localhost:3000/`. Para iniciar novamente: `npm run dev --prefix app`, na raiz do repositório. Os exemplos ficam no navegador; não são contas Google nem verificações documentais reais.

## Implementado

Além dos fluxos de cliente e motorista já descritos no [checklist](frontend-checklist.md), esta revisão entrega apresentação pública de prestadores, identidade comercial de empresa separada do motorista, avaliações com publicação opcional de comentário, navegação contextual, proteção de saída de formulários, validação de imagens, busca/paginação de listas e melhorias de uso do chat e do mapa pelo teclado.

O perfil público contém somente campos permitidos. Média e contagem vêm dos fretes concluídos do exemplo; nenhuma aprovação oficial é inferida. A empresa nesta versão tem um motorista responsável. Gerenciar vários funcionários com contas próprias requer um modelo de organização e permissões posterior.

## Autenticação Google (17/11/2026)

Login OAuth Google e sessão de servidor estão implementados com Better Auth e Prisma/PostgreSQL. O callback autorizado é `${APP_URL}/api/auth/callback/google`; a tela de retorno confirma a identidade da sessão e permite encerrá-la. Configure as variáveis indicadas no [README](../README.md) e garanta que as tabelas Better Auth previstas em `database/schema.prisma` já existam no banco. Nenhuma migração foi aplicada nesta alteração.

Após o login, os fluxos de frete permanecem na demonstração local e não são associados à identidade Google. A sessão não concede acesso a dados privados nem isola a demonstração; cadastro complementar, autorização e endpoints de domínio seguem pendentes. Não use dados reais até esses fluxos serem integrados.

## Integração de domínio preparada, ainda não conectada

`app/src/frontend/api/http.ts` centraliza cookies de mesma origem, timeout, cancelamento, erros e páginas com cursor. `backend.ts` descreve chamadas tipadas para as operações principais. Não repete mutações automaticamente nem troca falha real por dados simulados. Os DTOs são uma proposta baseada em `api.md`, a confirmar com os responsáveis pelo back-end. O modo real atual continua diagnóstico e recebe 501: não basta ativá-lo para ter uma aplicação integrada.

A integração final ainda precisa substituir a leitura/gravação do Store demonstrativo por consultas/mutações específicas, mapear respostas e conflitos para as telas e usar identidade/autorização derivadas da sessão. Não enviar um Store completo ao servidor. CRUD de endereços, cadastro complementar, empresa e protocolos de eventos ainda precisam dos contratos finais do grupo.

## Checklist que depende do grupo ou de Cleiton

- [ ] Back-end disponibilizar cadastro/análise do motorista e endpoints funcionais com DTOs e erros acordados. Depois conectar à sessão Google e testar duas contas isoladas.
- [ ] Definir armazenamento privado, análise e acesso aos documentos; fornecer upload autenticado e IDs de arquivo. A interface não comprova autenticidade de CNH/CPF/CNPJ.
- [ ] Disponibilizar chat/notificações entre contas com protocolo de atualização, reconexão e autorização. Decidir se notificações push entram no escopo.
- [ ] Caso assinatura paga permaneça no escopo, definir provedor e ambiente de testes; estado da assinatura deve vir do servidor.
- [ ] Decidir regra de cancelamento depois do aceite. Até lá, a interface continua permitindo cancelamento somente antes da contratação.
- [ ] Confirmar que empresa com um responsável atende à apresentação; múltiplos motoristas vinculados exigem escopo e permissões definidos antes de implementar.
- [ ] Homologar em Android/iPhone físicos, teclado virtual, GPS e leitor de tela; fornecer ambiente HTTPS quando for necessário testar instalação e recursos fora do localhost.
- [ ] Grupo revisar os diagramas e o documento acadêmico com o modelo definitivo. Esta revisão altera documentação técnica Markdown, sem editar Word.

## Validação e limites

31 testes passaram e a compilação de produção passou. Há testes para contratos públicos sem dados privados, comentários com consentimento, contexto das rotas e falhas HTTP sem repetição de mutações. Teste visual em origem separada (porta 3003) preservou os dados da porta 3000. Conferidos descarte de formulário, mapa, navegação proposta/perfil/chat e cadastro/apresentação PJ. Layout público conferido em 360 e 1440 pixels. Isso não substitui validação em aparelhos físicos nem teste com servidor real.

Os arquivos de documentação desta revisão não alegam pagamento, verificação oficial ou comunicação remota implementados. As alterações desta revisão serão publicadas na branch de trabalho, preservando o histórico anterior.

## Escopo esclarecido por Cleiton

- Apresentação local com sistema integrado, banco persistente e contas funcionais; não será somente demonstração com mocks. O estado atual ainda é demonstrativo até a integração do backend.
- Prestador previamente cadastrado e aprovado para apresentação. A aprovação deverá ser registrada por processo administrativo/seed controlado, sem autoaprovação na interface real.
- Sem pagamentos ou assinatura com cobrança real na apresentação. O controle de acesso não deve depender de pagamento inexistente; integração deve definir acesso de apresentação autorizado no servidor.
- VPS não faz parte do escopo. Sugestão técnica: arquivos privados fora de public/, acesso por endpoint autenticado e autorizado, metadados no banco e backup local separado. A equipe ainda deve implementar e confirmar esse armazenamento.
- Empresa e vínculos de funcionários continuam em discussão.
- Cancelamento após contratação está em discussão; nenhuma nova penalidade foi implementada nesta revisão.
- Homologação dedicada com leitor de tela não é prioridade solicitada para esta entrega; manter os recursos acessíveis já existentes.
- Login Google precisa de internet mesmo com a aplicação e banco rodando localmente.
