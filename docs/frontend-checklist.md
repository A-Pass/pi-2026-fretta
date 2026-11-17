# Checklist do front-end — 16/11/2026

Implementação na demonstração local. Não representa uma entrega com contas reais.

## Concluído nesta revisão

- [x] Meus veículos: cadastro, edição, exclusão com confirmação, validação de placa/capacidade e seleção nas propostas. Placa não exibida no feed ou no chat.
- [x] Propostas e acordos guardam cópias das informações do veículo. Editar/excluir um veículo não altera negócios anteriores.
- [x] Pós-aceite: acordo com valor, horário, veículo, comentário e endereços completos quando o pedido tem os snapshots preenchidos. Exemplos antigos sem endereço mostram essa ausência explicitamente.
- [x] Endereços completos na interface somente após o aceite, para cliente ou motorista escolhido na simulação. Proteção real depende do servidor.
- [x] Início do transporte e conclusão com confirmação visual. Na interface, somente o motorista escolhido inicia e o cliente conclui.
- [x] Histórico de ofertas no chat, recusa sem bloquear conversa, nova oferta na mesma negociação e aceite da oferta mais recente.
- [x] Rótulo “Proposta recusada” coerente no chat, detalhes e serviços. Conversas continuam acessíveis após a recusa/encerramento.
- [x] Identificação do cliente no cabeçalho do chat do motorista; exemplos legados sem nome usam “Cliente de demonstração”.
- [x] Mensagens com envio em andamento e erro com texto preservado para reenvio. Não há confirmação fictícia de leitura/entrega remota.
- [x] Notificações locais por perfil: proposta, renegociação, mensagem, aceite/recusa/encerramento, início e conclusão. Indicador de não lido, leitura individual e leitura de todas.
- [x] Avaliação com nota e comentário, somente após conclusão; bloqueio de segundo envio por participante e confirmação de registro.
- [x] Perfil (nome/foto) e assinatura simulada persistidos no navegador.
- [x] URLs individuais para telas, frete e conversa, histórico Voltar/Avançar e sessão demonstrativa preservada ao recarregar a aba. Sair encerra a sessão demonstrativa.
- [x] Erros para frete/conversa indisponíveis, falha ao salvar e falta de espaço no armazenamento.
- [x] Datas/horários com apresentação em America/Bahia, campos locais convertidos para instantes ISO com fuso, exemplos novos com disponibilidade futura.
- [x] Listas de cliente e oportunidades com carregamento local em lotes de 12. Paginação HTTP ainda depende da API.
- [x] Pop-ups nativos acessíveis, confirmação visual para restaurar demonstração, foco nas ações, link para pular ao conteúdo, avaliação por teclado e ajustes de contraste.
- [x] Ajustes responsivos do chat, pop-ups, formulários e acordo; conferência no navegador em 360 e 1440 pixels.
- [x] Tela de assinatura com estado, benefícios e ativação/vencimento simulados, sem cobrança. Histórico e serviços contratados não são bloqueados pelo vencimento.
- [x] Ícones PNG 192/512, ícone maskable e Apple, manifest atualizado e instruções de instalação.
- [x] Service worker de produção com aviso offline. Não armazena APIs, dados privados ou tiles do mapa; não habilita o sistema inteiro offline.
- [x] Regras e contratos técnicos atualizados para veículos, ofertas, notificações e avaliações.

## Cadastro guiado do motorista

- [x] Primeiro acesso demonstrativo inicia tour e cadastro de cinco etapas.
- [x] CPF e CNPJ (numérico/alfanumérico) com dígitos verificadores; nome e dados da empresa condicionais.
- [x] Foto de perfil e imagem da CNH obrigatórias, com limite de arquivo, tipo/conteúdo e dimensão mínima.
- [x] CNH: número, categoria e validade não vencida. Não há validação oficial do documento.
- [x] Cadastro/reutilização de veículo e revisão antes de enviar.
- [x] Em análise, ajustes solicitados, reenvio e aprovação explicitamente simulada. Envio não aprova automaticamente.
- [x] Cadastro pendente/CNH vencida/falta de foto ou veículo impede novas propostas. Serviços e conversas existentes continuam acessíveis.
- [x] Números completos e imagem de CNH não são persistidos no protótipo; exemplo fictício disponível sem documentos reais.
- [ ] Identificação de conta Google nova, upload privado, autenticidade documental e análise administrativa reais dependem do backend.

## Verificação

- Testes de domínio e renderização: veículos, fuso horário, URLs, snapshot do acordo, confirmação de oferta substituída, avaliações únicas, notificações sem duplicação e visibilidade dos endereços na interface.
- Teste manual em origem separada para preservar os dados de localhost:3000: cadastrar veículo → proposta → mensagem → notificação → recusa → nova oferta → aceite de R$ 220 → início do transporte → conclusão → avaliação com comentário.
- Recarregar preserva veículo, perfil, sessão e contexto da tela; Voltar do navegador retorna à tela anterior.
- Conferência em viewport de celular não substitui homologação em Android/iPhone físicos.

## Pendente de integração com o grupo

- [ ] Login Google real, sessão de servidor, cadastro complementar e saída real da conta.
- [x] Cliente HTTP tipado preparado por endpoint, com cursores, cancelamento, timeout e mensagens seguras de erro.
- [ ] Conectar as telas aos endpoints reais após confirmar os DTOs com o grupo. O endpoint provisório continua retornando 501.
- [ ] Autorização por conta, associação cliente/motorista, filtro geográfico e proteção de endereços no servidor. O armazenamento demonstrativo é compartilhado neste navegador.
- [ ] Chat entre contas/dispositivos, reconexão, recebimento remoto e estados confirmados pelo servidor.
- [ ] Notificações remotas e push, incluindo permissões e assinatura no servidor.
- [ ] Upload remoto de fotos e validação de arquivos pelo backend.
- [ ] Assinatura e gateway reais, datas de vencimento, pagamento e webhooks.
- [x] Perfil público com veículos, média de avaliações de fretes concluídos e comentários publicados com autorização explícita na demonstração.
- [ ] Carregar esse perfil com dados autorizados e agregados pelo servidor.
- [ ] Publicação HTTPS, instalação e teclado virtual testados em aparelhos Android e iPhone reais; validação de leitores de tela.

## Decisões ainda necessárias

- [ ] Definir cancelamento após contratação: quem pode, motivo, consequências e como apresentar isso nas telas. O cancelamento implementado continua limitado a antes do aceite.
- [x] Cadastro inicial do motorista definido com o usuário: nome/CPF, empresa/CNPJ quando aplicável, foto obrigatória, CNH/imagem, veículo e revisão.
- [ ] Consolidar os campos do cliente e a verificação real dos documentos com a frente de identidade.
- [ ] Revisão final dos diagramas acadêmicos e do documento Word com o modelo definitivo da equipe. Esta entrega atualiza os documentos técnicos Markdown.

## Complementos de 16/11/2026

- [x] Perfil público acessível pelas propostas e pelo chat, preservando o contexto da negociação ao conversar e voltar.
- [x] Empresa com apresentação, nome comercial e logo opcional, separados da foto do motorista responsável. O MVP mantém um responsável e seus veículos; não implementa filiação de outros usuários.
- [x] Perfil público usa uma lista explícita de campos permitidos: não inclui CPF, CNPJ, CNH, placa ou endereços privados.
- [x] Comentário da avaliação só aparece publicamente quando o cliente marca a autorização. Comentários antigos ficam privados por padrão.
- [x] Confirmação para descartar alterações pelos botões de saída dos formulários de solicitação, perfil e empresa. Não é salvamento automático de rascunho e não impede perda ao atualizar/fechar o navegador ou trocar de tela pelo menu.
- [x] Validação por conteúdo e dimensão das imagens de itens, perfil e logo, além dos limites de tamanho.
- [x] Busca de conversas; paginação local de conversas, mensagens, serviços, notificações e avaliações públicas; filtro de notificações não lidas.
- [x] Conversa preserva a posição durante leitura de mensagens antigas e oferece retorno às mensagens novas.
- [x] Mapa operável pelo teclado, seleção explícita do centro e botão para tentar carregar os tiles novamente.
- [x] 31 testes automatizados e compilação de produção aprovados. Conferidos no navegador: descarte/continuação do formulário, seleção do centro do mapa, perfil público → negociação correta, cadastro PJ fictício → análise → aprovação simulada, edição/apresentação da empresa e layout do perfil em 360/1440 pixels.

Veja [a entrega e as dependências](frontend-handoff.md). A conferência visual desta revisão não repetiu todo o ciclo pós-aceite; suas regras continuam cobertas pelos testes e pelo roteiro anterior.

## Painel administrativo de prestadores

- [x] Rota /admin separada. A pedido de Cleiton, os atalhos administrativos foram removidos das telas de cliente e motorista.
- [x] Busca/filtros, detalhes mascarados, checklist, aprovação e solicitação de correções com confirmação.
- [x] Histórico das decisões e atualização do cadastro do motorista da demonstração, com verificação de versão e preservação do histórico no reenvio.
- [x] Retirados os controles de autoaprovação da interface do motorista.
- [ ] Sessão/permissão administrativa, fila de contas reais, documentos privados e auditoria no servidor. O painel real permanece bloqueado enquanto não houver integração.

Veja [o roteiro e limites do painel](admin-panel.md).

### Refinamentos administrativos — 17/11/2026

- [x] Itens de correção enviados ao resumo do motorista e registrados no histórico.
- [x] Avisos e bloqueio de aprovação para pendências de foto, documentação, validade e veículo.
- [x] Contagem de envios e última solicitação de ajustes para contextualizar reanálise.
- [x] Diálogo de sucesso, confirmação de descarte e preservação de texto ao detectar atualizações externas.
- [x] Ampliação de foto e visualizador com zoom/rotação usando documento ilustrativo explicitamente fictício nos exemplos. CNH real ainda depende do back-end.

## Fluxos do cliente — 17/11/2026

- [x] Edição de solicitação aberta com endereços/dados pré-preenchidos, revisão e encerramento das propostas anteriores quando houver mudanças.
- [x] Novas ofertas vinculadas à revisão atual; aceite antigo bloqueado, mantendo chat/histórico.
- [x] Acompanhamento visual por situação, sem rastreamento GPS.
- [x] Revisão completa antes de publicar, com descrição, fotos, agenda e endereços privados do próprio cliente.
- [x] Cancelamento antes do início do transporte, inclusive após aceite, com motivo, confirmação, registro e notificações locais; sem multa automática.
- [x] Recuperação de rascunho após recarregar, com opção retomar/descartar, validade de 24 horas na sessão da aba e limpeza ao sair/publicar.

Roteiro e limites em [fluxos do cliente](client-lifecycle.md).

## Empresa com equipe — 17/11/2026

- [x] Área /empresa com Equipe, Frota, Serviços e Plano (preços a definir).
- [x] Busca por código público, confirmação do perfil, convite por sete dias, aceite/recusa/cancelamento e prevenção de duplicatas.
- [x] Vínculo separado da aprovação administrativa e da ativação demonstrativa; sem cobrança individual duplicada.
- [x] Atribuição por motorista/veículo, confirmação de disponibilidade e proposta da empresa com identificação do condutor.
- [x] Feed do funcionário somente com suas atribuições, início do transporte pelo designado e conversa identificada por autor.
- [x] Bloqueio de saída/desativação/alteração de veículo com operação em aberto e preservação de histórico.
- [ ] Definição de preços, autenticação/autorizações por empresa, banco, cobrança e comunicação remota. Seleção de atores atual é somente demonstrativa.
- [ ] Link compartilhável de convite e confirmação de substituição de motorista após contratação em etapa posterior.

Veja [o roteiro e os limites da equipe](company-team.md).
