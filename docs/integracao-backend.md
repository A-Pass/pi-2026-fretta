# FRETTA - Integração do Backend

## 1. Informações gerais

O backend do FRETTA utiliza Next.js, TypeScript, Prisma e PostgreSQL.

**Endereço local:** http://localhost:3001

**Base da API:** /api/v1

**Autenticação:** Google OAuth com Better Auth.

As requisições autenticadas utilizam cookies de sessão HttpOnly.

## 2. Autenticação e perfis

### GET /api/v1/me

Retorna os dados do usuário autenticado, seus perfis habilitados e a situação do cadastro do motorista.

**Autenticação:** obrigatória.

**Exemplo de resposta (HTTP 200):**

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
  },
  "driverRegistration": {
    "status": "NAO_ENVIADO",
    "cadastroCompleto": false,
    "precisaCompletarCadastro": true,
    "motivoAjuste": null
  }
}
```

**Possíveis status do cadastro:**

- NAO_ENVIADO
- EM_ANALISE
- AJUSTES_SOLICITADOS
- APROVADO

**Erros:**

- HTTP 401: usuário não autenticado.
- HTTP 404: usuário não encontrado.

**Observação:** ter perfil de motorista não significa que o cadastro documental foi aprovado.

### PATCH /api/v1/me

Atualiza o nome de exibição do usuário autenticado.

**Autenticação:** obrigatória.

**Exemplo de requisição:**

```json
{
  "name": "Milena Brasil"
}
```

**Exemplo de resposta (HTTP 200):**

```json
{
  "id": "ID_DO_USUARIO",
  "name": "Milena Brasil",
  "email": "usuario@exemplo.com",
  "image": null
}
```

**Validações:**

- O nome deve conter entre 2 e 100 caracteres.
- Espaços no início e no fim são removidos.
- Somente o campo `name` pode ser atualizado.
- Não é permitido modificar `email`, `papel` ou outros campos protegidos.

**Erros:**

- HTTP 400: JSON inválido.
- HTTP 401: usuário não autenticado.
- HTTP 422: dados inválidos ou campos não permitidos.

**Integração com o frontend:**

Após salvar o nome, o frontend deve atualizar as informações exibidas no perfil do usuário.

## 3. Gerenciamento de veículos

As rotas de veículos exigem autenticação e perfil de motorista.

### GET /api/v1/vehicles

Lista os veículos ativos pertencentes ao motorista autenticado.

- Método: GET
- Autenticação: obrigatória
- Não retorna veículos desativados.

### POST /api/v1/vehicles

Cadastra um veículo para o motorista autenticado.

Campos utilizados:

- category: categoria do veículo
- model: modelo
- plate: placa
- capacityKg: capacidade em quilogramas (opcional)
- description: descrição

O proprietário é identificado pela sessão. Não é necessário enviar o ID do motorista.

### PATCH /api/v1/vehicles/:id

Atualiza os dados de um veículo pertencente ao motorista autenticado.

O backend verifica a propriedade do veículo antes de permitir alterações.

### DELETE /api/v1/vehicles/:id

Desativa o veículo.

A exclusão é lógica: o registro permanece no PostgreSQL, mas deixa de aparecer na listagem de veículos ativos.

### Contrato Vehicle do frontend

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

### Segurança e validações

- Usuários não autenticados não podem gerenciar veículos.
- Um motorista não pode modificar veículos de outro.
- Placas duplicadas são rejeitadas.
- Veículos desativados não aparecem na listagem.
- Veículos vinculados a cadastros documentais podem ter restrições de exclusão.

### Integração com o frontend

O frontend deve substituir gradualmente as operações de veículos armazenadas no localStorage por requisições autenticadas aos endpoints.

Não é necessário enviar tokens manualmente quando a sessão utiliza cookies válidos no mesmo domínio.

## 4. Cadastro e aprovação do motorista

O cadastro de motorista é separado da criação do perfil.

Ter o perfil motorista não significa estar aprovado para realizar fretes.

### GET /api/v1/driver/registration

Consulta a situação do cadastro documental do motorista autenticado.

O retorno deve preservar a privacidade dos documentos e dados pessoais.

### POST /api/v1/driver/registration

Recebe os dados necessários à análise cadastral:

- Nome completo
- Tipo de pessoa: física ou jurídica
- CPF
- CNPJ e razão social, quando aplicáveis
- Dados da CNH
- Identificadores dos documentos enviados
- Identificador do veículo cadastrado

O backend possui validações para CPF, CNPJ e dados da CNH.

**Situação atual:** o backend de Identidade e perfis já possui validações cadastrais. A conclusão do envio depende do serviço de upload privado, sob responsabilidade da frente de Comunicação e integrações. Após sua disponibilização, será necessário integrar os identificadores dos arquivos ao cadastro do motorista.

### Status do cadastro

- NAO_ENVIADO: documentação ainda não enviada.
- EM_ANALISE: cadastro aguardando avaliação.
- AJUSTES_SOLICITADOS: administrador solicitou correções.
- APROVADO: cadastro aprovado.

### Aprovação administrativa

A análise do cadastro é uma operação exclusiva de administradores.

O motorista não pode aprovar o próprio cadastro.

A rota administrativa possui controle de autorização, mas o fluxo completo de aprovação ainda precisa ser validado com testes de integração.

### Regras de segurança

- Todas as operações exigem autenticação.
- Os dados pessoais não devem ser expostos publicamente.
- Documentos de CNH devem permanecer em armazenamento privado.
- A aprovação deve ser validada pelo backend.
- Ter perfil de motorista não autoriza automaticamente o envio de propostas.

### Pendências e responsabilidades

- Comunicação e integrações: implementar o upload e o armazenamento privado dos documentos.
- Identidade e perfis: integrar os arquivos ao cadastro do motorista e validar sua propriedade e autorização.
- Identidade e perfis: concluir os testes do fluxo de aprovação administrativa.
- Clayton: integrar os formulários e as telas às APIs reais.
- Dados e entrega: garantir as migrações, a publicação e o backup do banco.
