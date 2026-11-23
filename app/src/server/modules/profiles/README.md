# Perfis

O estado do perfil é persistido por usuário e carregado por `loadAccountStore`.

## Dados implementados

- perfil básico da conta;
- conclusão do cadastro inicial;
- endereço principal da conta;
- veículos ativos do motorista;
- cadastro complementar com máscara de documentos;
- perfil de empresa e área de atuação;
- até 50 endereços privados salvos;
- notificações por usuário;
- revisão administrativa do cadastro do motorista.

## Regras

Dados privados só são enviados ao proprietário da conta ou ao participante autorizado pela operação. Operações administrativas exigem o login administrativo separado. O cadastro do motorista passa por `EM_ANALISE`, `AJUSTES_SOLICITADOS` ou `APROVADO`.

Uploads de CNH e fotos de perfil usam URLs/data URLs presentes no protótipo. Isso não constitui um serviço privado de armazenamento; a produção precisará de integração própria antes de aceitar documentos reais.
