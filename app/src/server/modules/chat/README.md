# Chat

Mensagens persistentes são representadas pelo modelo `Mensagem` e carregadas junto ao estado da conta autenticada.

O vínculo aponta para o frete e, opcionalmente, para a proposta. O remetente e o destinatário são identificados pela sessão; o perfil armazenado é `cliente` ou `motorista`.

## Estado atual

- o front-end possui interface local de conversa;
- mensagens entre participantes podem ser persistidas no banco;
- carregamento, autoria e autorização devem ser feitos pelo servidor;
- anexos no chat não fazem parte do MVP;
- não há WebSocket, SSE, push ou entrega em tempo real.

A interface não deve interpretar mensagens simuladas como entrega remota confirmada.
