# Propostas

O servidor persiste propostas, ofertas, acordos e notificações relacionadas.

## Implementação atual

- `POST /api/v1/freights/:freightId/proposals` cria a primeira oferta de um motorista;
- o motorista precisa ter cadastro aprovado, CNH válida e veículo ativo;
- o frete precisa estar aberto e não pode pertencer ao próprio motorista;
- há uma proposta por motorista em cada frete;
- propostas e ofertas são registradas em transação;
- o aceite escolhido é persistido em `AcordoFrete` e encerra ofertas concorrentes;
- as operações devem ser idempotentes no caminho já implementado.

Valores são tratados como inteiros positivos em centavos nas ofertas e acordos. Disponibilidades usam instantes ISO 8601; apresentações usam o horário de `America/Bahia`.

As principais operações ainda não disponíveis fora do protótipo devem ser refletidas no cliente como `501`, não como sucesso fictício.
