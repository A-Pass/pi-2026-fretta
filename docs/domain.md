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

## Atualização da interface de endereços

A demonstração agora contém formulário horizontal em seis etapas: itens/fotos, retirada, entrega, veículo, preferência de agenda e datas/confirmação. O endereço completo é digitado manualmente, com ponto confirmado no mapa Leaflet/OpenStreetMap. GPS é consultado uma vez somente ao clicar em Usar minha localização. Não há geocodificação, pesquisa de estabelecimentos ou rastreamento contínuo.

Meus Endereços permite adicionar, editar, excluir e reutilizar locais. A caixa Salvar este endereço no pedido grava o endereço junto da publicação, não antes. Alterações/exclusões posteriores não modificam as cópias usadas nos fretes existentes. Para evitar duplicação, endereços reutilizados não são salvos novamente automaticamente.

O feed demonstrativo mantém apenas bairro/cidade/UF nos campos públicos. Endereços e coordenadas completas ficam em snapshots separados no armazenamento local da demonstração. Isto NÃO é isolamento de contas nem garantia de privacidade: em produção, o backend deve guardar os dados privados, filtrar as respostas e autorizar acesso após o aceite. A implementação atual do raio e seus limites são descritos na seção Área de operação do motorista.

O mapa requer internet e segue a política https://operations.osmfoundation.org/policies/tiles/; sem download offline ou prefetch. O provedor pode ser configurado por NEXT_PUBLIC_MAP_TILE_URL com atribuição apropriada. Não é usado serviço de geocodificação para enviar endereços residenciais a terceiros. A seleção de ponto/endereço manual exige conferência do usuário.

## Área de operação do motorista

O Início do motorista tem uma área de operação configurável: base escolhida no mapa ou obtida por consulta pontual de GPS, raio em quilômetros e nome opcional para identificar a base. A alteração só muda o feed após Aplicar área de operação. A base pode ser alterada em outra cidade para buscar fretes de retorno. O círculo ilustra a área; o filtro compara a distância em linha reta até a RETIRADA, independentemente do destino. Solicitações sem coordenadas não recebem localização presumida. O exemplo f1 usa uma posição aproximada fictícia para demonstração.

Meus serviços do motorista contém apenas suas próprias propostas e fretes associados, com filtros de propostas, agendados/em transporte e histórico. Histórico e serviços já contratados não são filtrados pelo raio atual nem bloqueados pela assinatura vencida. Identidade estável demo-driver preserva a associação de novas propostas mesmo se o nome de exibição mudar; a integração real deve usar o ID autenticado.

O cálculo e a persistência são locais nesta demonstração. Em produção, o filtro geográfico e as permissões serão executados pelo servidor sem enviar coordenadas residenciais privadas ao motorista antes da contratação.
