# Empresa, equipe e convites — 17/11/2026

Área `/empresa`, no mesmo projeto, com Equipe, Frota, Serviços e Plano. Esta etapa é um protótipo funcional local. Em modo real permanece indisponível até integrar autenticação, autorização, banco e APIs. O seletor Simular conta existe apenas nesta demonstração; não representa autenticação, convite por e-mail ou concessão de permissões reais.

## Fluxo entregue

1. Criar empresa de demonstração com nome comercial. A identidade visual continua separada do rosto de quem dirige. O gestor fictício é diferente do administrador da plataforma.
2. Procurar motorista pelo código público exato (há códigos fictícios em um bloco de ajuda). A busca retorna apenas ID público, nome, foto e código, sem CPF/CNH/e-mail/documentos.
3. Confirmar o destinatário e enviar convite. Duração de sete dias, bloqueio de duplicata pendente e possibilidade de cancelar. Um convite expirado/cancelado não pode ser aceito.
4. Motorista entra na própria visão, copia seu código, aceita ou recusa o convite. Aceite cria vínculo inativo, sem aprovar documentos e sem aceitar serviço. Uma pessoa só tem um vínculo de empresa ativo neste modelo.
5. Gestor ativa na demonstração somente motorista com cadastro aprovado, foto, documentação e CNH válida. Plano e adicionais estão A definir; nada é cobrado. Motorista vinculado não recebe assinatura individual duplicada para esses serviços.
6. Frota é cadastrada separadamente dos motoristas. Gestor seleciona motorista ativo, veículo da categoria solicitada e oportunidade dentro da área configurada no aplicativo. A primeira versão permite um serviço/atribuição em aberto por motorista e veículo; não é um sistema de agenda com otimização de múltiplos fretes.
7. Motorista recebe apenas suas atribuições e aceita/recusa disponibilidade. Esse aceite não é o aceite do cliente. Gestor pode retirar uma atribuição ainda sem proposta.
8. Depois da confirmação do motorista, gestor envia uma proposta ao cliente com empresa, motorista e snapshot do veículo identificados. Cliente usa o aceite já existente no aplicativo; o motorista designado pode iniciar o transporte. Cliente continua responsável por confirmar a conclusão.
9. Gestor e motorista designado conversam no mesmo serviço. Mensagens incluem nome do autor. Outros motoristas não recebem os serviços/conversas dessa atribuição na interface.
10. Remover vínculo/sair/desativar é impedido quando há atribuição ou serviço em aberto. Histórico fica preservado. Veículos usados em atribuições em aberto também não podem ser alterados/excluídos. Edição/cancelamento do pedido pelo cliente invalida atribuições/propostas anteriores conforme o fluxo já implementado.

## Integração com as telas existentes

Meu perfil do motorista tem Minha equipe e convites; no cadastro PJ existe acesso demonstrativo à gestão da empresa. A apresentação da empresa tem Gerenciar equipe e frota. O motorista principal do exemplo (`demo-driver`) recebe notificação local de convite e, após vínculo, início/fretes/conversas usam a área da equipe, sem feed aberto nem envio de proposta autônoma. O perfil esconde assinatura individual para membros da empresa.

Os exemplos adicionais têm conta de simulação somente na área da empresa. Não são contas Google reais. A sessão principal do protótipo segue sendo a do usuário demonstrativo; não fizemos múltiplas sessões autenticadas.

Motoristas fictícios adicionais aparecem no painel administrativo. Aprovar um deles atualiza sua situação na equipe. O gestor não tem ação de aprovação. Motorista da frota não precisa possuir veículo pessoal; veículo da empresa é verificado na atribuição. Documentos reais permanecem indisponíveis neste protótipo.

## Roteiro conferido

Criar Reis Transportes de demonstração → buscar FRT-7K9P2X → enviar convite → simular Carlos → aceitar convite → gestor ativa sem cobrança → cadastrar Fiorino → atribuir Entrega de um sofá → Carlos confirma disponibilidade → gestor envia proposta → cliente vê empresa/motorista e aceita → Carlos inicia transporte e envia mensagem → cliente recebe estado Em transporte e notificação. Os dados de teste foram usados em outra origem local, preservando localhost:3000.

Testes automatizados cobrem permissões locais, lookup sem documentos, convites e expiração, separação entre vínculo/aprovação/ativação/serviço, operação administrativa, conflitos de motorista/veículo, proposta desatualizada, privacidade do DTO público e indisponibilidade em modo real. A tentativa de viewport móvel nesta revisão não aplicou o tamanho solicitado; a conferência visual foi feita no tamanho de computador. Homologação móvel continua pendente.

## Próximas dependências

- Definir mensalidade base, inclusão ou não de uma vaga e valor por motorista adicional. Não atribuímos valores, não integramos Stripe nem criamos cobrança.
- Implementar empresas e membros no banco, códigos únicos gerados no servidor, convite autenticado com expiração e índice que impeça múltiplos vínculos ativos.
- Substituir atores de simulação pela sessão Google e autorização por empresa/participante, incluindo cada operação e cada leitura de documento/endereço.
- Convites e chat entre dispositivos dependem de API e transporte remoto; a atualização local entre abas não equivale a comunicação entre usuários reais.
- Criar análise real da empresa, gestor, motoristas e veículos; persistência/arquivos privados e auditoria administrativa. Gestor que não dirige não deve ser obrigado a cadastrar CNH.
- Compartilhamento de link para alguém ainda sem conta ficou para uma etapa posterior; esta versão cobre o convite por código dentro da plataforma.
- Reatribuição após contratação requer consentimento do cliente e novo snapshot; nesta entrega o motorista/veículo do acordo não é trocado silenciosamente.
