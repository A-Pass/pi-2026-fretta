# Regras oficiais da reconstrução

Arquitetura: Next.js com TypeScript, servidor modular, Prisma e PostgreSQL. Interface sem importação de banco. API é a fronteira entre as frentes do grupo.

Uma conta poderá ser cliente e motorista. Sessão identifica o usuário; permissões conferidas pelo servidor em cada recurso. Simulação local não é autenticação.

Estados do frete: ABERTO → AGENDADO → EM_TRANSPORTE → CONCLUIDO. Cliente cancela antes do aceite, encerrando propostas. Cancelamento posterior deve registrar autor, motivo e data e exige definição antes de implementação. Motorista escolhido inicia transporte; cliente confirma conclusão. Proposta: PENDENTE, ACEITA ou ENCERRADA.

Preferência de agenda: data fixa, intervalo inclusivo ou a combinar. Proposta contém disponibilidade com horário. Aceite registra o acordo definitivo. Instantes HTTP em ISO 8601 com fuso, datas sem horário em YYYY-MM-DD; apresentação em America/Bahia. Rejeitar datas passadas e intervalos invertidos.

Motorista define livremente preço. Sem preço sugerido pelo cliente, comissão ou tarifação central. Dinheiro na API em centavos inteiros positivos. Uma proposta pendente por motorista/frete. Aceite atômico com controle de concorrência, garantindo um único motorista, encerramento das concorrentes e cópia do valor/horário. Repetir confirmação não cria contratação duplicada.

Feed fornece somente região aproximada. Endereço completo e coordenadas exatas são privados e liberados apenas a cliente proprietário e motorista escolhido após aceite. Dados privados não podem ser enviados e apenas escondidos por CSS. Identidade do remetente do chat deriva da sessão.

Chat de texto por proposta entre seus participantes; propostas encerradas preservam histórico privado. Sem anexos de chat no MVP. Avaliação por participante após conclusão, uma por frete/avaliador, nota inteira de 1 a 5. Incentivada sem bloquear outros serviços. Médias calculadas pelo servidor.

Assinatura de produto R$ 49,90/mês para feed e novas propostas. Vencimento preserva histórico e execução/conversas de fretes contratados. Integração real pendente: vínculo com gateway, webhooks autenticados e idempotência. A entrega atual somente simula ativo/vencido e não comprova pagamento.

Fora do MVP inicial: expiração/renovação automática, favoritos, rastreamento contínuo, anexos no chat e selos de verificação sem processo definido.

Modelo a implementar: User, Session, Account, Pessoa, Cliente, Motorista, Veiculo, Endereco, Frete, FreteFoto, Proposta, Conversa, Mensagem, Avaliacao e VinculoAssinatura. IDs externos strings; UUID recomendado no domínio. Modelos de autenticação respeitam biblioteca escolhida. Banco deve garantir unicidade de aceite e avaliação, além das validações de aplicação. Esquemas antigos não devem ser aplicados à nova base.

Qualidade: formulário em etapas/grupos com validação, sem promessa de três cliques. Responsividade de 360 a 1440 pixels sem rolagem horizontal. Homologação em Android/iOS. Alvo de 3 segundos para operações comuns em base de 1000 fretes e conexão de referência documentada na homologação. Backup diário com teste de restauração e disponibilidade monitorada são tarefas de publicação. PWA instalável requer testes próprios; responsividade não comprova instalação/offline.
