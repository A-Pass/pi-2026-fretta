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
