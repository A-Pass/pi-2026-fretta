# Fluxos do cliente — 17/11/2026

## Edição antes da contratação

Nos detalhes de uma solicitação aberta, Editar solicitação reabre as seis etapas com os dados existentes. Exemplos antigos sem snapshots privados pedem o preenchimento dos endereços; não inventamos ruas nem números. A revisão final mostra título/descrição, endereço completo de retirada/entrega, veículo, agenda e galeria de fotos ao cliente.

Qualquer alteração no conteúdo incrementa a revisão do pedido, encerra ofertas anteriores e notifica os prestadores participantes do exemplo. Conversas e histórico das ofertas permanecem; o motorista pode enviar nova oferta na mesma negociação, vinculada à revisão atual. O aceite rejeita proposta de revisão antiga. Salvar conteúdo idêntico não encerra propostas. Selecionar apenas salvar endereço adiciona o endereço sem invalidar a negociação.

A edição não fica disponível após contratação. O back-end deverá aplicar participação, versão esperada, autorização e atualização atômica; validação da interface não substitui isso.

## Acompanhamento

Os detalhes do cliente mostram Aguardando propostas → Agendado → Em transporte → Concluído, com etapa atual destacada. Não é rastreamento por GPS nem localização ao vivo. Pedidos cancelados mostram a situação e, nos novos cancelamentos, motivo e data. Pedidos legados sem metadados não recebem datas inventadas.

## Cancelamento

O cliente pode cancelar pedidos abertos ou agendados antes do início do transporte. O formulário exige motivo entre 10 e 1000 caracteres e confirmação visual. Guardamos motivo, autor cliente, data e situação anterior, preservando acordo e mensagens. Ofertas pendentes/aceitas são encerradas e notificações locais são geradas para os participantes da demonstração. Após o início do transporte, a interface orienta conversar sobre a ocorrência; não permite cancelamento automático.

Não há multa, pagamento, banimento ou avaliação negativa automática. Consequências por reincidência e análise administrativa de ocorrências continuam fora desta entrega. Pedidos cancelados não reabrem; o cliente pode criar uma nova solicitação.

## Rascunhos

Salvamento automático na sessão da aba, com botão Salvar e continuar depois. Ao atualizar a página e abrir novamente Solicitar frete, o usuário escolhe retomar ou descartar. A edição tem chave separada por pedido/revisão, para não restaurar alterações de uma revisão substituída. Dados completos e fotos ficam somente no sessionStorage deste navegador por até 24 horas após o último salvamento. Fechar a aba/sair da conta/restaurar demonstração remove ou encerra esse armazenamento; não é sincronizado entre dispositivos nem recuperável em qualquer computador.

Publicar/salvar ou confirmar Descartar e sair limpa o respectivo rascunho. Falhas/quota do navegador geram aviso, sem prometer que o conteúdo foi salvo. Datas são validadas novamente ao publicar. Produção deve usar chave/armazenamento por usuário autenticado, política de expiração e proteção de dados; o demo usa uma sessão fictícia compartilhada neste navegador.

## Validação e integração

Testes cobrem edição e aceite desatualizado, cancelamento com motivo, preservação do acordo/chat, bloqueio após início, notificações sem duplicação, formato/expiração do rascunho e situação visual. Conferência manual em origem separada: criar rascunho → atualizar página → retomar → completar/publicar → editar e salvar → aceitar proposta de outro exemplo → cancelar com motivo/confirmar.

Ainda faltam APIs/autorização de contas reais e persistência no banco. Notificações aqui são locais; não houve envio a pessoas reais. A revisão da solicitação continua exibindo somente bairro/cidade nos dados públicos antes do aceite.
