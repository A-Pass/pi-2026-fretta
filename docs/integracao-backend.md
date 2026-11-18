# FRETTA - Integração do Backend

**Projeto Integrador | Guia de integração do backend com o frontend**

**Frente:** Identidade e Perfis  
**Tecnologias:** Next.js, TypeScript, Better Auth, Prisma e PostgreSQL  
**Base da API:** `/api/v1`  
**Ambiente local:** `http://localhost:3001` (conforme configuração do servidor)

---

## 1. Informações gerais

O backend do FRETTA é desenvolvido com Next.js e TypeScript, utilizando Prisma ORM para comunicação com o PostgreSQL.

A autenticação utiliza Google OAuth/OpenID Connect por meio do Better Auth, com gerenciamento de sessões e cookies HttpOnly.

As operações protegidas identificam o usuário pela sessão. O frontend não deve enviar livremente o identificador do usuário para determinar a propriedade dos recursos.

### Padrão da API

- Corpo das requisições: JSON, exceto uploads.
- Identificadores: strings.
- Datas e instantes: ISO 8601, com fuso quando houver horário.
- Erros: objetos contendo `code` e `message`.
- Sessão: cookie HttpOnly.
- Operações autenticadas: exigem sessão válida.

### Principais códigos HTTP

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado ou solicitação registrada |
| 400 | JSON ou requisição malformada |
| 401 | Usuário não autenticado |
| 403 | Usuário sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito com o estado atual ou dados existentes |
| 415 | Tipo de conteúdo não suportado |
| 422 | Dados inválidos |
| 500 | Falha interna |

---

## 2. Autenticação e gerenciamento de perfis

### 2.1. Autenticação com Google

O FRETTA utiliza Better Auth para integrar a autenticação com Google.

O Google verifica a identidade do usuário, enquanto o Better Auth gerencia a integração e a sessão da aplicação.

Após a autenticação, o backend utiliza a sessão para identificar o usuário.

A autorização para operações específicas continua sendo responsabilidade do backend.

### 2.2. GET `/api/v1/me`

**Finalidade:** consultar o perfil do usuário autenticado.

**Autenticação:** obrigatória.

Informações previstas no contrato:

- Identificador do usuário.
- Nome de exibição.
- E-mail.
- Imagem de perfil da conta.
- Situação de verificação do e-mail.
- Papéis habilitados.
- Situação e pendências do cadastro de motorista.

Exemplo dos campos principais:

```json
{
  "id": "ID_DO_USUARIO",
  "name": "Usuário Exemplo",
  "email": "usuario@exemplo.com",
  "image": null,
  "emailVerified": true,
  "roles": {
    "cliente": false,
    "motorista": true
  }
}
```

O contrato também prevê um resumo da situação cadastral do motorista:

```json
{
  "driverRegistration": {
    "status": "NAO_ENVIADO",
    "cadastroCompleto": false,
    "precisaCompletarCadastro": true,
    "motivoAjuste": null
  }
}
```

**Atenção:** o exemplo de `driverRegistration` representa o contrato de integração desejado. Sua presença e os campos exatos na resposta de `GET /me` ainda precisam ser conferidos na implementação atual antes da homologação com o frontend.

**Erros principais:**

- 401: usuário não autenticado.
- 404: usuário não encontrado.

### 2.3. PATCH `/api/v1/me`

**Finalidade:** atualizar o nome de exibição do usuário autenticado.

**Exemplo de requisição:**

```json
{
  "name": "Milena Brasil"
}
```

**Validações:**

- O nome deve conter de 2 a 100 caracteres.
- Espaços nas extremidades são removidos.
- Somente o campo `name` pode ser atualizado.
- Não é permitido modificar e-mail, papéis ou campos protegidos por essa rota.

**Erros possíveis:**

- 400: JSON inválido.
- 401: usuário não autenticado.
- 422: dados inválidos.

**Integração com o frontend:** atualizar as informações exibidas após uma resposta bem-sucedida.

### 2.4. Ativação dos perfis

A mesma conta pode atuar como cliente e motorista.

Endpoints implementados:

- `POST /api/v1/me/client`
- `POST /api/v1/me/driver`

Essas operações criam ou reutilizam os registros de perfil associados ao usuário autenticado.

**Regra importante:** ativar o perfil de motorista não significa que o cadastro documental está aprovado.

---

## 3. Gerenciamento de veículos

As rotas de veículos exigem autenticação e perfil de motorista.

### 3.1. GET `/api/v1/vehicles`

Lista os veículos ativos pertencentes ao motorista autenticado.

O backend identifica o proprietário por meio da sessão.

Veículos desativados não devem aparecer na listagem de veículos ativos.

### 3.2. POST `/api/v1/vehicles`

Cadastra um veículo para o motorista autenticado.

Exemplo de requisição:

```json
{
  "category": "UTILITARIO",
  "model": "Fiorino",
  "plate": "ABC1D23",
  "capacityKg": 650,
  "description": "Veículo para pequenas cargas"
}
```

**Observação:** os valores de categoria devem respeitar as opções aceitas pela implementação. O exemplo acima é ilustrativo.

Campos:

| Campo | Significado |
|---|---|
| `category` | Categoria do veículo |
| `model` | Modelo |
| `plate` | Placa |
| `capacityKg` | Capacidade em quilogramas, quando informada |
| `description` | Descrição opcional |

O ID do motorista não precisa ser enviado pelo frontend.

### 3.3. PATCH `/api/v1/vehicles/:id`

Atualiza os dados de um veículo.

O backend deve verificar se o veículo pertence ao motorista autenticado antes de permitir a alteração.

### 3.4. DELETE `/api/v1/vehicles/:id`

Realiza a desativação lógica do veículo.

O registro permanece no PostgreSQL, mas deixa de ser disponibilizado na listagem de ativos.

Veículos associados a cadastros documentais ou outras operações podem possuir restrições adicionais.

### 3.5. Contrato do frontend

```typescript
interface Vehicle {
  id: string;
  category: string;
  model: string;
  plate: string;
  capacityKg?: number;
  description: string;
}
```

### 3.6. Regras de segurança

- Somente usuários autenticados com perfil de motorista podem gerenciar veículos.
- Um motorista não pode modificar veículos de outro.
- Placas duplicadas devem ser rejeitadas.
- Veículos desativados não aparecem na listagem de ativos.
- A desativação deve respeitar vínculos cadastrais existentes.

**Integração com o frontend:** substituir o armazenamento demonstrativo de veículos por chamadas reais aos endpoints.

---

## 4. Cadastro documental do motorista

O cadastro documental é separado da criação do perfil de motorista.

Esse processo envolve identificação pessoal, CNH, documentos privados e um veículo cadastrado.

O fluxo principal foi implementado com persistência no PostgreSQL e testado localmente.

### 4.1. GET `/api/v1/driver/registration`

**Finalidade:** consultar a situação do cadastro documental do motorista autenticado.

**Autenticação:** obrigatória.

Quando o motorista possui perfil, mas ainda não enviou cadastro:

```json
{
  "status": "NAO_ENVIADO",
  "cadastroCompleto": false,
  "podeRealizarFretes": false
}
```

Quando existe um cadastro:

```json
{
  "status": "EM_ANALISE",
  "cadastroCompleto": true,
  "podeRealizarFretes": false,
  "enviadoEm": "2026-11-16T12:00:00.000Z",
  "analisadoEm": null,
  "motivoAjuste": null
}
```

**Observações:**

- `cadastroCompleto: true` indica que existe um cadastro enviado, não que ele foi aprovado.
- A implementação atual mantém `podeRealizarFretes: false`, inclusive para cadastros aprovados.
- A autorização definitiva para novas propostas depende da integração com as regras de Fretes e Negociações e Assinaturas.
- CPF, número da CNH e identificadores dos documentos privados não são retornados nessa consulta.

**Erros principais:**

- 401: usuário não autenticado.
- 404: perfil de motorista não encontrado.

### 4.2. POST `/api/v1/driver/registration`

**Finalidade:** enviar ou reenviar o cadastro documental do motorista.

**Autenticação:** obrigatória.

Exemplo de requisição para pessoa física:

```json
{
  "tipoPessoa": "PF",
  "nomeCompleto": "Motorista Exemplo",
  "cpf": "529.982.247-25",
  "cnhNumero": "12345678901",
  "cnhCategoria": "B",
  "cnhValidade": "2099-12-31",
  "veiculoId": "ID_DO_VEICULO",
  "fotoPerfilId": "ID_DA_FOTO",
  "documentoCnhId": "ID_DA_CNH"
}
```

Os dados são fictícios e utilizados apenas para demonstrar a estrutura.

Para pessoa jurídica, devem ser informados também:

```json
{
  "tipoPessoa": "PJ",
  "cnpj": "CNPJ_VALIDO",
  "razaoSocial": "Razão Social Exemplo"
}
```

O CPF continua obrigatório porque identifica a pessoa responsável por dirigir.

### 4.3. Validações do cadastro

O backend verifica:

- Tipo de pessoa (`PF` ou `PJ`).
- Nome completo obrigatório.
- CPF válido.
- CNPJ válido para pessoa jurídica.
- Razão social obrigatória para pessoa jurídica.
- Número e categoria da CNH.
- Data de validade da CNH.
- Identificador do veículo.
- Existência e propriedade do veículo.
- Presença dos documentos obrigatórios.
- Existência, tipo e propriedade dos documentos.
- Situação atual do cadastro para determinar se o envio é permitido.

A validação de CPF e CNPJ verifica regras de formato e dígitos verificadores. A validação da CNH não representa consulta oficial ao DETRAN nem comprova sua autenticidade.

### 4.4. Resposta de sucesso

**HTTP 201:**

```json
{
  "id": "ID_DO_CADASTRO",
  "status": "EM_ANALISE",
  "enviadoEm": "2026-11-16T12:00:00.000Z",
  "message": "Cadastro enviado para análise com sucesso."
}
```

O envio não aprova automaticamente o motorista.

### 4.5. Erros relevantes

| Código HTTP | Código da API | Situação |
|---|---|---|
| 401 | `UNAUTHORIZED` | Usuário não autenticado |
| 403 | `FORBIDDEN` | Ausência do perfil de motorista |
| 409 | `REGISTRATION_ALREADY_APPROVED` | Cadastro já aprovado |
| 409 | `REGISTRATION_NOT_EDITABLE` | Cadastro não permite reenvio no estado atual |
| 409 | `REGISTRATION_CONFLICT` | Conflito de dados ou concorrência |
| 422 | `INVALID_INPUT` | Dados incompletos ou inválidos |
| 422 | `VALIDATION_ERROR` | Falha nas validações cadastrais |
| 422 | `INVALID_VEHICLE` | Veículo inexistente ou não autorizado |
| 422 | `DOCUMENTS_REQUIRED` | Documentos obrigatórios ausentes |
| 422 | `INVALID_DOCUMENTS` | Documentos inválidos ou pertencentes a outro motorista |

---

## 5. Upload privado de documentos

**Situação:** implementado e testado localmente.

O backend disponibiliza uma rota específica para enviar as imagens necessárias ao cadastro.

### 5.1. POST `/api/v1/driver/registration/uploads`

**Autenticação:** obrigatória.  
**Permissão:** usuário com perfil de motorista.  
**Formato:** `multipart/form-data`.

Campos:

| Campo | Valor |
|---|---|
| `tipo` | `FOTO_PERFIL` ou `CNH` |
| `arquivo` | Arquivo de imagem |

### 5.2. Regras de upload

A implementação atual:

- Aceita imagens JPEG e PNG válidas.
- Limita o tamanho de entrada a 5 MB.
- Valida o conteúdo real da imagem utilizando Sharp.
- Limita as dimensões da imagem.
- Processa e converte o arquivo para JPEG.
- Armazena o arquivo fora da pasta pública.
- Associa o documento ao motorista identificado pela sessão.
- Registra os metadados no PostgreSQL.

**Ponto de atenção:** a documentação do domínio prevê também WebP e dimensões mínimas de 200 × 200 pixels. Essas regras ainda precisam ser alinhadas com o backend antes da homologação final.

### 5.3. Exemplo de resposta

**HTTP 201:**

```json
{
  "id": "ID_DO_ARQUIVO",
  "tipo": "CNH",
  "criadoEm": "2026-11-16T12:00:00.000Z"
}
```

O endpoint não devolve URL pública do documento.

### 5.4. Como os arquivos são armazenados?

A implementação utiliza dois componentes.

**Armazenamento físico**

Os arquivos processados são salvos em:

```text
storage/private/
```

Essa pasta não deve ser disponibilizada publicamente.

**Metadados no PostgreSQL**

A tabela `ArquivoPrivado` registra:

- ID.
- ID do motorista.
- Tipo do arquivo.
- Chave de armazenamento.
- Tipo MIME.
- Tamanho em bytes.
- Data de criação.

O registro do banco é utilizado para relacionar cada documento ao seu proprietário.

### 5.5. Tratamento de falhas

Se a gravação do arquivo físico funcionar, mas a criação do registro no PostgreSQL falhar, o serviço tenta remover o arquivo recém-criado.

Esse mecanismo evita acumular arquivos sem vínculo com registros do banco.

### 5.6. Erros relevantes

- 401: usuário não autenticado.
- 403: usuário sem perfil de motorista.
- 415: requisição não utiliza o formato esperado.
- 422: arquivo ausente, inválido ou acima do limite.
- 500: falha ao armazenar o documento.

### 5.7. Integração com o frontend

Fluxo esperado:

1. O motorista seleciona a foto de perfil.
2. O frontend envia o arquivo ao endpoint de upload.
3. O backend devolve o ID da foto.
4. O frontend envia a imagem da CNH.
5. O backend devolve o ID da CNH.
6. O frontend envia o cadastro completo usando os dois identificadores.

Os IDs devem ser transmitidos nos campos `fotoPerfilId` e `documentoCnhId`.

Não devem ser enviadas URLs públicas de documentos sensíveis.

---

## 6. Estados do cadastro do motorista

O fluxo cadastral utiliza quatro estados apresentados ao frontend.

| Status | Significado | Comportamento |
|---|---|---|
| `NAO_ENVIADO` | Ainda não existe cadastro | Motorista pode iniciar o envio |
| `EM_ANALISE` | Cadastro aguardando análise | Reenvio bloqueado |
| `AJUSTES_SOLICITADOS` | Administrador solicitou correções | Motorista pode reenviar |
| `APROVADO` | Cadastro aprovado | Reenvio cadastral bloqueado pelo endpoint atual |

### 6.1. Primeiro envio

O backend cria o cadastro com status `EM_ANALISE`.

### 6.2. Solicitação de ajustes

O administrador registra o motivo e altera o status para `AJUSTES_SOLICITADOS`.

O motivo fica disponível na consulta cadastral.

### 6.3. Reenvio após ajustes

O motorista pode corrigir os dados e reenviar.

O backend:

- Atualiza as informações permitidas.
- Retorna o status para `EM_ANALISE`.
- Remove o motivo anterior dos ajustes.
- Limpa a data da análise anterior.
- Atualiza a data de envio.

O reenvio atualiza o cadastro existente, evitando duplicação.

### 6.4. Cadastro aprovado

Quando o cadastro está `APROVADO`, o endpoint de reenvio bloqueia alterações com HTTP 409.

A aprovação do motorista é responsabilidade administrativa.

O usuário não pode definir diretamente o próprio status cadastral.

### 6.5. Liberação para propostas

O cadastro aprovado é uma condição necessária, mas não suficiente para enviar novas propostas.

O contrato do FRETTA exige também a verificação de:

- CNH válida.
- Veículo adequado.
- Dados/documentos exigidos.
- Habilitação operacional.
- Assinatura ativa.

Essas condições ainda precisam ser integradas às operações de Fretes e Negociações.

---

## 7. Persistência no PostgreSQL

O envio do cadastro utiliza Prisma ORM.

A função `salvarCadastroMotorista()` centraliza a persistência cadastral.

Ela executa uma transação para manter a consistência das operações relacionadas aos modelos `Pessoa` e `CadastroMotorista`.

### Modelos relacionados

| Modelo | Responsabilidade |
|---|---|
| `User` | Conta de autenticação |
| `Pessoa` | Dados pessoais complementares |
| `Cliente` | Papel de cliente |
| `Motorista` | Papel de motorista |
| `Veiculo` | Veículos pertencentes ao motorista |
| `CadastroMotorista` | Informações e situação do cadastro |
| `ArquivoPrivado` | Metadados dos documentos privados |

### Transações

A persistência utiliza uma transação Prisma com isolamento `Serializable`.

O objetivo é preservar a consistência entre alterações relacionadas e tratar conflitos de concorrência.

Conflitos identificados pelo Prisma, como `P2002` e `P2034`, recebem tratamento na API.

Testes específicos de operações simultâneas ainda são recomendados.

---

## 8. Migração dos documentos privados

Foi preparada a migração:

```text
prisma/migrations/
└── 20261116180000_add_private_driver_files/
    └── migration.sql
```

Ela inclui:

- Enum `TipoArquivoPrivado`.
- Tabela `ArquivoPrivado`.
- Chave primária.
- Chave estrangeira para `Motorista`.
- Índice único da chave de armazenamento.
- Índice composto por motorista e tipo.

A estrutura foi verificada no PostgreSQL local de testes.

O histórico de migrações foi regularizado no banco `fretta_test`, que apresentou o estado atualizado.

**Responsabilidade da equipe de Dados e Entrega:** Anderson e Caio devem revisar e coordenar a integração dessa migração ao ambiente compartilhado.

A migração não deve ser aplicada novamente sobre um banco que já possui a mesma estrutura sem avaliação prévia.

---

## 9. Testes realizados

A implementação foi submetida a testes automatizados de integração utilizando o banco PostgreSQL `fretta_test`.

### Funcionalidades verificadas

- Bloqueio de cadastro sem autenticação.
- Validação de campos obrigatórios.
- Rejeição de CPF inválido.
- Rejeição de CNH vencida.
- Bloqueio de veículo pertencente a outro motorista.
- Exigência dos documentos.
- Persistência do cadastro no PostgreSQL.
- Bloqueio de reenvio de cadastro em análise.
- Reenvio após solicitação de ajustes.
- Bloqueio de reenvio de cadastro aprovado.
- Consulta de estados cadastrais.
- Ausência de dados sensíveis na resposta da consulta.
- Upload privado autenticado.
- Rejeição de arquivos inválidos.
- Rejeição de arquivos acima de 5 MB.
- Isolamento de documentos entre motoristas.
- Exclusão compensatória de arquivo após falha de persistência.

### Resultado da execução conjunta

**6 testes de nível superior aprovados, com várias verificações internas e nenhuma falha.**

O TypeScript também foi validado com:

```bash
npm run typecheck
```

Os testes utilizam registros fictícios e executam limpeza ao final.

Por isso, as tabelas do banco de testes podem ficar vazias após uma execução bem-sucedida.

---

## 10. Orientações para integração com o frontend

Cleiton deverá integrar as telas aos endpoints reais, substituindo gradualmente os dados simulados.

### Autenticação

Utilizar as sessões gerenciadas pelo Better Auth.

### Perfil

Consumir `GET /me` e `PATCH /me`, conforme os campos efetivamente retornados pelo backend.

### Veículos

Substituir operações locais por requisições autenticadas às rotas de veículos.

### Cadastro do motorista

Utilizar o seguinte fluxo:

1. Consultar o status cadastral.
2. Apresentar o formulário quando necessário.
3. Permitir seleção ou cadastro do veículo.
4. Enviar foto de perfil e documento da CNH.
5. Armazenar temporariamente os IDs retornados.
6. Enviar o cadastro completo.
7. Consultar a situação do cadastro.
8. Apresentar mensagens de análise, aprovação ou solicitação de ajustes.

### Tratamento de erros

O frontend deve interpretar o código HTTP e o campo `code` da API.

Não deve interpretar uma falha real como sucesso ou substituir silenciosamente o resultado por dados simulados.

### Privacidade

CPF, CNH e demais dados sensíveis não devem ser armazenados desnecessariamente no navegador.

O frontend não deve tratar a existência de login ou de perfil de motorista como comprovação de aprovação documental.

---

## 11. Pendências atuais

### Identidade e Perfis

- Conferir e consolidar os campos de `GET /me` conforme o contrato do frontend.
- Revisar o retorno das pendências cadastrais.
- Disponibilizar consulta segura dos documentos privados para usuários autorizados.
- Alinhar os requisitos de formatos e dimensões das imagens com o frontend.
- Complementar testes de concorrência e homologação da operação administrativa.
- Homologar o fluxo completo com o frontend.

### Comunicação e Integrações

- Implementar mensagens e conversas entre usuários autorizados.
- Implementar notificações persistidas.
- Integrar eventos de propostas, mensagens e estados.
- Avaliar mecanismos de entrega e atualização das notificações.
- Integrar serviços externos previstos no escopo, conforme definição da equipe.

O upload privado necessário ao cadastro documental já foi implementado na frente de Identidade e Perfis, portanto não deve continuar listado como funcionalidade ainda inexistente.

### Fretes e Negociações

- Integrar a verificação do cadastro aprovado ao envio de propostas.
- Validar veículo, habilitação e assinatura nas operações correspondentes.
- Respeitar o acesso aos dados privados dos fretes.
- Integrar as regras de permissão com a identidade autenticada.

### Frontend

- Integrar as telas aos endpoints implementados.
- Tratar estados cadastrais e mensagens de erro.
- Substituir simulações locais quando houver implementação real.
- Testar fluxos autenticados com contas distintas.

### Dados e Entrega

- Revisar e integrar a migração `ArquivoPrivado`.
- Coordenar o histórico de migrações do banco compartilhado.
- Preparar ambiente de publicação e backup.
- Verificar configuração do armazenamento privado em produção.

---

## 12. Controle de versão e estado da entrega

**Branch de desenvolvimento:**

```text
feat/identity-private-files
```

**Commits principais:**

| Commit | Descrição |
|---|---|
| `c09621d` | Integra upload privado ao PostgreSQL |
| `eea9202` | Implementa persistência e reenvio cadastral |
| `5b19270` | Adiciona migração de documentos privados |

A implementação principal de Identidade e Perfis está registrada localmente no Git.

**Situação da entrega:** funcionalidades principais implementadas e testadas localmente. Ainda dependem de revisão, integração entre frentes e homologação antes de serem consideradas prontas para produção.

**Próxima frente de desenvolvimento:** Comunicação e Integrações.

---

**Projeto Integrador FRETTA — Documentação de integração do backend**

**Atualizado em:** 16 de novembro de 2026.