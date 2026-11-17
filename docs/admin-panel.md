# Painel administrativo de prestadores

Abra `http://localhost:3000/admin`. O acesso é direto pela URL; os atalhos administrativos foram removidos das telas dos usuários a pedido de Cleiton. Isso não é autenticação: a proteção real continua pendente do back-end.

## Fluxo entregue

- Lista com busca por nome/empresa, filtros por situação, contadores, atualização e carregamento em lotes.
- Detalhes de identificação mascarada, foto quando disponível, habilitação, validade e veículos.
- Checklist de conferência para habilitar aprovação, confirmação visual e prevenção de aprovação duplicada/desatualizada.
- Solicitação de correções com motivo obrigatório e confirmação mostrando o texto que será recebido pelo prestador.
- Histórico das decisões feitas no painel, com autor fictício, data e motivo. Não inventa histórico para aprovações antigas feitas pelos controles anteriores.
- Decisões sobre o motorista deste navegador alteram seu cadastro. Após voltar ao aplicativo, o motivo aparece na tela de situação; reenvio volta para análise e mantém o histórico do painel. Exemplos Carlos/Marina são independentes desse cadastro.
- O motorista só pode propor após aprovação, CNH válida, foto, veículo e os demais critérios já existentes.

## Roteiro de apresentação

1. Como motorista, preencha o exemplo fictício e envie para análise.
2. Clique em Abrir painel administrativo · demonstração.
3. Selecione o cadastro desse motorista, escreva uma correção e confirme Solicitar correções.
4. Volte ao aplicativo, escolha a visão motorista e consulte o motivo em Cadastro do motorista. Corrija e reenvie.
5. Reabra o painel, confira os quatro itens e confirme Aprovar cadastro. Consulte as duas decisões no histórico.
6. Volte ao motorista; a aprovação demonstrativa aparece no cadastro e permite seguir para o início se os requisitos estiverem completos.

Não use documentos reais neste roteiro. Os exemplos da lista não incluem imagem de CNH, e a interface não afirma que verificou a identidade oficialmente.

## Limite atual e integração

Este é o painel completo de front-end com persistência demonstrativa. Não cria um administrador real nem libera documentos reais. No modo real, nenhum registro local é mostrado; a interface fica indisponível até a implementação da API administrativa e sessão. O [contrato proposto](api.md) descreve as operações, autorização, armazenamento privado, auditoria e conflitos a implementar. Após isso, ligar listagem/detalhe/revisão aos endpoints e mostrar o acesso em Meu perfil somente quando GET /me informar a permissão do servidor.

A análise real deve usar documentos armazenados de forma privada, no computador da apresentação ou servidor escolhido. A conta inicial de Cleiton pode receber permissão por preparação controlada do banco; isso não depende do seu perfil cliente/motorista e não deve ser configurado no front-end. Nenhuma credencial Google foi gravada nesta entrega.

## Melhorias da análise — 17/11/2026

- Correções têm categorias (dados pessoais, foto, CNH e veículo) e texto obrigatório. As categorias ficam no histórico e no resumo visível ao motorista. Registros antigos sem categorias continuam legíveis.
- Foto ausente, documentação não enviada, CNH vencida/invalidada e veículo ausente/incompleto geram avisos e impedem aprovação. O checklist não elimina essas pendências automaticamente.
- O cadastro guarda `submissionCount` no reenvio; casos legados sem contador são tratados como primeiro envio. O detalhe mostra a última solicitação de correções disponível no histórico. A versão inclui o contador para distinguir reenvios no mesmo instante.
- Aprovação e envio de correções exibem diálogo de sucesso centralizado. Os botões de sair/voltar e os filtros do resumo pedem confirmação se há observações, itens ou conferências não salvos. Fechar/atualizar a aba usa o aviso padrão do navegador. Não persistimos rascunhos de análise.
- Ao detectar atualização externa durante uma análise em edição, preservamos o texto e avisamos sobre a possível mudança; a confirmação relê o registro e rejeita versão substituída.
- Foto pode ser ampliada. Os exemplos Carlos/Marina têm avatar ilustrado e um documento inteiramente fictício para testar zoom, rotação, restauração e fechamento por Escape. Esses SVGs públicos não são documentos enviados por usuário. A CNH real do motorista continua indisponível, sem substituí-la pela ilustração.
- Visualizador prevê erro de carregamento e não oferece download de arquivos privados. Sua conexão a uma imagem real exige endpoint autenticado, autorização e cache privado no back-end.
