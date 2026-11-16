# Painel administrativo de prestadores

Abra `http://localhost:3000/admin`. No modo demonstrativo há um link em Meu perfil e na tela de cadastro em análise. Os links são identificados como demonstração, sem adicionar um terceiro papel ao seletor público de cliente/motorista.

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
