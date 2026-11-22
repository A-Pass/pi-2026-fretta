# Fretes

O módulo controla solicitações persistidas de frete.

## Endpoints implementados

- `GET /api/v1/freights`: feed paginado de fretes com status `ABERTO`;
- `POST /api/v1/freights`: cria um frete na conta autenticada;
- `GET /api/v1/state` e `GET /api/v1/me`: carrega o estado da conta autenticada.

O feed aceita busca por texto, cursor e filtro aproximado por origem/área. Os resultados usam região aproximada, não endereço completo.

## Criação

Uma solicitação exige título, descrição, categoria do veículo, agenda, endereços completos com ponto no mapa e datas válidas quando aplicável. A opção `combinar` não exige datas.

Endereços podem ser associados ao pedido como snapshots privados e também podem ser copiados para a lista de endereços salvos do usuário.

Outros métodos de alteração de status ou cancelamento continuam sem implementação pública; o catch-all retorna `501`.
